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
            res.status(200).send('top up saldo has been send, waiting for approval.')
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
            await connection.databaseQuery(addLogHistory, data)

            // send feedback to client-side
            res.status(200).send('payment success.')
        })
    },
    // ADMIN : to-up approval
    topUpApprovalByAdmin : (req, res) => {
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
    },
    // get transaction history
    getInitialTransactionHistory : (req, res) => {
        const limit = parseInt(req.query.limit)

        // define exception
        const type = req.query.type === 'null' ? null : parseInt(req.query.type)
        const exception = type ? `WHERE type = ${type}` : ''

        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT th.id, 
                    DATE_FORMAT(th.date, '%W, %D %M %Y, %H:%i') AS date,
                    th.type, th.amount, th.user_id, us.username, th.status 
                    FROM transaction_history th
                    JOIN users us ON us.id = th.user_id 
                    ${exception}
                    ORDER by th.id DESC LIMIT ?`
            const result = await connection.databaseQuery(query, limit)

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    getNextTransactionHistory : (req, res) => {
        const id = parseInt(req.query.id)
        const limit = parseInt(req.query.limit)

        // define exception
        const type = req.query.type === 'null' ? null : parseInt(req.query.type)
        const exception = type ? `AND type = ${type}` : ''

        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT th.id, 
                    DATE_FORMAT(th.date, '%W, %D %M %Y, %H:%i') AS date,
                    th.type, th.amount, th.user_id, us.username, th.status 
                    FROM transaction_history th
                    JOIN users us ON us.id = th.user_id 
                    WHERE th.id < ? ${exception}
                    ORDER by th.id DESC LIMIT ?`
            const result = await connection.databaseQuery(query, [id, limit])

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    getPrevTransactionHIstory : (req, res) => {
        const id = parseInt(req.query.id)
        const limit = parseInt(req.query.limit)
    
        // define exception
        const type = req.query.type === 'null' ? null : parseInt(req.query.type)
        const exception = type ? `AND type = ${type}` : ''
    
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT th.id, 
                    DATE_FORMAT(th.date, '%W, %D %M %Y, %H:%i') AS date,
                    th.type, th.amount, th.user_id, us.username, th.status 
                    FROM transaction_history th
                    JOIN users us ON us.id = th.user_id 
                    WHERE th.id > ? ${exception}
                    ORDER by th.id ASC LIMIT ?`
            const result = await connection.databaseQuery(query, [id, limit])
    
            // send feedback to client-side
            res.status(200).send(result)
        })
        
    },
    // get total data
    getTotalTransactionHistoryData : (req, res) => {
        // do authorization to define execption
        const type = ['null', undefined].includes(req.query.type) ? null : parseInt(req.query.type)
        const exception = type ? `WHERE type = ${type}` : ''

        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT COUNT(*) AS total 
                        FROM transaction_history USE INDEX(PRIMARY) ${exception}`
            const result = await connection.databaseQuery(query)

            // send feedback to client-side
            const total = result[0]['total']
            res.status(200).send([total])
        })
    },
    // get payment status and types
    getPaymentStatus : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'SELECT * FROM transaction_status'
            const result = await connection.databaseQuery(query)
            
            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    getPaymentTypes : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'SELECT * FROM transaction_types'
            const result = await connection.databaseQuery(query)
            
            // send feedback to client-side
            res.status(200).send(result)
        })
    }
}