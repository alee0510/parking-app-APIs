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
    // pay parking
    payParking : (req, res) => {
        const id = parseInt(req.params.id)
        req.body.status = 1
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `INSERT INTO transaction_history SET ?`
            await connection.databaseQuery(query, req.body)

            // send feedback to client-side
            res.status(200).send('payment success.')
        })
    }
}