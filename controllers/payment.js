// setup connection
const database = require('../database')
const connection = require('../helpers/databaseQuery')(database)
const pool = require('../helpers/databaseQueryPool')()
const transporter = require('../helpers/nodemailer')

// export controllers
module.exports = {
    // USER : check, top-up saldo, check history transaction
    getSaldo : (req, res) => {
        // console.log(req.params.id)
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'SELECT * FROM wallet WHERE id = ?'
            const result = await connection.databaseQuery(query, parseInt(req.params.id))
            // console.log(result)

            // send feedback to client-side
            res.status(200).send(result[0])
        })
    },
    topUpSaldo : (req, res) => {
        // setup additional data
        // let date = new Date()
        // req.body.date = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
        req.body.type = 1
        req.body.status = 2 // pending -> paymen need approval from superadmin
        req.body.user_id = parseInt(req.params.id)

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
        pool.databaseQueryTransaction(database, res, async (connection) => {
            // get current saldo
            const getCurrentSaldo = 'SELECT * FROM wallet where id = ?'
            const currentSaldo = await pool.databaseQuery(connection, getCurrentSaldo, userId)
            if(currentSaldo[0].saldo < totalPayment) throw({code : 400, msg : 'saldo doesn\'t enough.'})

            // reduce user saldo according to payment total
            const saldo = currentSaldo[0].saldo - totalPayment
            const reduceSaldo = `UPDATE wallet SET saldo = ${saldo} WHERE id = ?`
            await pool.databaseQuery(connection, reduceSaldo, userId)

            // add log to transaction history
            const data = {
                // date : req.body.date,
                type : 2,
                amount : totalPayment,
                user_id : userId,
                status : 1
            }
            const addLogHistory = `INSERT INTO transaction_history SET ?`
            await pool.databaseQuery(connection, addLogHistory, data)

            // OPTIONAL : send invoice receipt
            const message = `<h1>Invoice</h1>
                        <br/>
                        <h3>Payment type = parking</h3>
                        <h3>Total = ${totalPayment}</h3>
                        <h3>Thank you.</h3>
                        `
            // mail option
            // get user email
            const getUser = 'SELECT * FROM users WHERE id = ?'
            const user = await pool.databaseQuery(connection, getUser, userId)
            
            const mailOption = {
                from : `admin <ali.muksin0510@gmail.com>`, // sender address
                to : `${user[0].email}`,//`${req.body.email}`,
                subject : 'Invoice',
                text : '',
                html : message
            }
            // send mail
            await transporter.sendMail(mailOption)

            // send feedback to client-side
            res.status(200).send('payment success.')
        })
    },
    // ADMIN : to-up approval
    topUpApprovalByAdmin : (req, res) => {
        // get user id from req.params
        const transactionId = parseInt(req.params.id)

        pool.databaseQueryTransaction(database, res, async (connection) => {
            // do authorization
            // if (parseInt(req.user.role) !== 1) throw({code : 401, msg : 'access denied.'})

            // get top-up amount
            const chekTopUpAmount = 'SELECT * FROM transaction_history WHERE id = ?'
            const topUpAmount = await pool.databaseQuery(connection, chekTopUpAmount, transactionId)
            // console.log(topUpAmount)

            
            // get user current saldo
            const userId = parseInt(topUpAmount[0].user_id)
            // console.log(userId)
            const checkUserSaldo = 'SELECT * FROM wallet WHERE id = ?'
            const currentSaldo = await pool.databaseQuery(connection, checkUserSaldo, userId)
            // console.log(currentSaldo)
            
            // top-up saldo to user wallet
            const saldo = topUpAmount[0].amount + currentSaldo[0].saldo
            const topUpSaldo = `UPDATE wallet SET ? WHERE id = ?`
            await pool.databaseQuery(connection, topUpSaldo, [{ saldo }, userId])

            // change user status transaction
            const approveStatus = 'UPDATE transaction_history SET status = 1 WHERE id = ?'
            await pool.databaseQuery(connection, approveStatus, transactionId)

            // OPTIONAL : send invoice receipt
            // get user email
            const getUser = 'SELECT * FROM users WHERE id = ?'
            const user = await pool.databaseQuery(connection, getUser, userId)

            // mail message
            const message = `<h1>Invoice</h1>
                            <br/>
                            <h3>Payment type = top up</h3>
                            <h3>Total = ${topUpAmount[0].amount}</h3>
                            <h3>Thank you.</h3>
                            `
            // mail option
            const mailOption = {
                from : `admin <ali.muksin0510@gmail.com>`, // sender address
                to : `${user[0].email}`,//`${user[0].email}`,
                subject : 'Invoice',
                text : '',
                html : message
            }

            // send mail
            await transporter.sendMail(mailOption)

            // send feedback to client-side
            res.status(200).send('top-up approval success.')
        })
    },
    topUpRejectByAdmin : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'UPDATE transaction_history SET status = 3 WHERE id = ?'
            await connection.databaseQuery(query, parseInt(req.params.id))

            // send feedback to client-side
            res.status(200).send('top-up has been rejected.')
        })
    },
    // get transaction history
    getTransactionHistory : (req, res) => {
        // check query
        const limit = parseInt(req.query.limit) || null
        const type = parseInt(req.query.type) || null
        const next  = parseInt(req.query.next) || null // last id
        const prev = parseInt(req.query.prev) || null // first id
    
        // define query
        const queryLimit = limit ? `LIMIT ${limit}` : ''
        const queryType = type ? next || prev ? `AND type = ${type}` : `WHERE type = ${type}` : ''
        const queryNext =  next ? `WHERE th.id < ${next} ` : ''
        const queryPrev = prev ? `WHERE th.id > ${prev} ` : ''
        const order = prev ? 'ASC' : 'DESC'

        // do query
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT th.id, 
                    DATE_FORMAT(th.date, '%W, %D %M %Y, %H:%i') AS date,
                    th.type, th.am  ount, th.user_id, us.username, th.status 
                    FROM transaction_history th
                    JOIN users us ON us.id = th.user_id 
                    ${queryNext}${queryPrev}${queryType}
                    ORDER by th.id ${order} ${queryLimit}`
            console.log(query)
            const result = await connection.databaseQuery(query)

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    // get total data
    getTotalTransactionHistoryData : (req, res) => {
        // do authorization to define execption
        const type = parseInt(req.query.type) || null
        const queryType = type ? `WHERE type = ${type}` : ''

        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT COUNT(*) AS total 
                        FROM transaction_history USE INDEX(PRIMARY) ${queryType}`
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