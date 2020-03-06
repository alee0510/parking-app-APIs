// setup connection
const database = require('../database')
const connection = require('../helpers/databaseQuery')(database)

// export controllers
module.exports = {
    // USER : check, top-up saldo, check history transaction
    getSaldo : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'SELECT * FROM wallet WHERE id = ?'
            const result = await connection.databaseQuery(query, parseInt(res.params.id))

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    topUpSaldo : (req, res) => {
        // setup additional data
        // let date = new Date()
        // req.body.date = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
        req.body.status = 2 // pending -> paymen need approval from superadmin

        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'INSERT INTO transaction_history SET ?'
            await connection.databaseQuery(query, req.body)

            // send feedback to client-side
            res.status(200).send('top up saldo has been send, witing for approval.')
        })
    },
    checkTransactionHistory : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'SELECT * FROM transaction_history WHERE user_id = ?'
            const result = await connection.databaseQuery(query, parseInt(req.params.id))

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    // pay parking : user input date and payment total, include user id in params
    payParking : (req, res) => {
        const userId = parseInt(req.params.id)
        const totalPayment = parseInt(req.body.total)
        connection.databaseQueryTransaction(res, async () => {
            // get current saldo
            const getCurrentSaldo = 'SELECT * FROM wallet where id = ?'
            const currentSaldo = await connection.databaseQuery(getCurrentSaldo, userId)

            // reduce user saldo according to payment total
            const saldo = currentSaldo - totalPayment
            const reduceSaldo = `UPDATE FROM wallet SET saldo = ${saldo} WHERE id = ?`
            await connection.databaseQuery(reduceSaldo, userId)

            // add log to transaction history
            const data = {
                date : req.body.date,
                type : 2,
                ammount : totalPayment,
                user_id : userId,
                status : 1
            }
            const addLogHistory = `INSERT INTO transaction_history SET ?`
            await connection.databaseQuery(query, data)

            // send feedback to client-side
            res.status(200).send('payment success.')
        })
    },
    // ADMIN : to-up approval
    topUpApproveByAdmin : (req, res) => {
        // get user id from req.params
        const transactionId = parseInt(req.params.id)

        connection.databaseQueryTransaction(res, async () => {
            // do authorization
            if (parseInt(req.user.role) !== 1) throw({code : 401, msg : 'access denied.'})

            // get top-up amount
            const chekTopUpAmount = 'SELECT * FROM transaction_history WHERE id = ?'
            const topUpAmount = await connection.databaseQuery(chekTopUpAmount, transactionId)

            
            // get user current saldo
            const userId = parseInt(topUpAmount[0].user_id)
            const checkUserSaldo = 'SELECT * FROM wallet where id = '
            const currentSaldo = await connection.databaseQuery(checkUserSaldo, userId)
            
            
            // top-up saldo to user wallet
            const saldo = topUpAmount[0].amount + currentSaldo[0].saldo
            const topUpSaldo = `UPDATE wallet WHERE SET ? user_id = ?`
            await connection.databaseQuery(topUpSaldo, [{ saldo }, userId])

            // change user status transaction
            const approveStatus = 'UPDATE transaction_history SET status = 1 WHERE id = ?'
            await connection.databaseQuery(approveStatus, transactionId)
            
            // send feedback to client-side
            res.status(200).send('top-up approval success.')
        })
    }
}