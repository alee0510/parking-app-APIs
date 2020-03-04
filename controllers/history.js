// setup connection
const database = require('../database')
const connection = require('../helpers/databaseQuery')(database)

// export controllers
module.exports = {
    // USER : get activy by user
    getHistoryByUser : async (req, res) => {
        await connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT ac.id, ac.user_id, us.username, ac.duration, ac.status, ac.date, pk.place_name 
                        FROM activity ac
                        JOIN users us ON us.id = ac.user_id
                        JOIN parking_area pk ON pk.id = ac.area_id
                        WHERE ac.user_id = ?`
            const result = await connection.databaseQuery(query, req.user.id)

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    // ADMIN & SUPER ADMIN : get all user activity history
    paginationGetUserHistory : async (req, res) => {
        console.log(req.query)

        // do authorization check for exception
        const companyId = req.query.company === 'null' ? null : parseInt(req.params.company)
        let exception = companyId ? '' : `WHERE pk.company_id = ${companyId}`

        await connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT ac.id, pk.company_id, us.username, ac.duration, ac.status, ac.date, pk.place_name 
                        FROM activity ac
                        JOIN users us ON us.id = ac.user_id
                        JOIN parking_area pk ON pk.id = ac.area_id ${exception}
                        ORDER BY ac.id DESC LIMIT = ?`
            const result = await connection.databaseQuery(query, parseInt(req.query.limit))

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    paginationGetNextUserHistory : async (req, res) => {
        console.log(req.query)
        const id = parseInt(req.query.id)
        const limit = parseInt(req.query.limit)

        // do authorization check for exception
        const companyId = req.query.company === 'null' ? null : parseInt(req.params.company)
        let exception = companyId ? '' : `AND pk.company_id = ${companyId}`

        await connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT ac.id, pk.company_id, us.username, ac.duration, ac.status, ac.date, pk.place_name 
                        FROM activity ac
                        JOIN users us ON us.id = ac.user_id
                        JOIN parking_area pk ON pk.id = ac.area_id 
                        WHERE ac.id < ? ${exception}
                        ORDER BY ac.id DESC LIMIT = ?`
            const result = await connection.databaseQuery(query, [id, limit])

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    paginationGetPrevUserHistory : async (req, res) => {
        console.log(req.query)
        const id = parseInt(req.query.id)
        const limit = parseInt(req.query.limit)
        
        // do authorization check for exception
        const companyId = req.query.company === 'null' ? null : parseInt(req.params.company)
        let exception = companyId ? '' : `AND pk.company_id = ${companyId}`

        await connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT ac.id, pk.company_id, us.username, ac.duration, ac.status, ac.date, pk.place_name 
                        FROM activity ac
                        JOIN users us ON us.id = ac.user_id
                        JOIN parking_area pk ON pk.id = ac.area_id 
                        WHERE ac.id > ? ${exception}
                        ORDER BY ac.id ASC LIMIT = ?`
            const result = await connection.databaseQuery(query, [id, limit])
    
            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    // get total data
    getTotalHistory : async (req, res) => {
        await connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'SELECT COUNT(*) AS total FROM activity USE INDEX(PRIMARY)'
            const result = await connection.databaseQuery(query)

            // send feedback to client-side
            const total = result[0]['total']
            res.status(200).send([total])
        })
    }

}