// setup connection
const database = require('../database')
const connection = require('../helpers/databaseQuery')(database)

// export controllers
module.exports = {
    // USER : GEt rating by user
    getRatingByUser : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'SELECT * FROM ratings WHERE id = ?'
            const result = await connection.databaseQuery(query, parseInt(req.params.id))

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    addRating : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'INSERT INTO ratings SET ?'
            await connection.databaseQuery(query, req.body)

            // send feedback to client-side
            res.status(200).send('add rating success.')
        })
    },
    // SUPERADMIN and ADMIN : GET all ratings data
    getInitialRatings : (req, res) => {
        const limit = parseInt(req.query.limit)

        // do athorization to define exception
        const company = req.query.company === 'null' ? null : parseInt(req.query.company)
        const exception = company ? `WHERE pk.company_id = ${company}` : ''

        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT rt.id, us.username, rt.rating, rt.message, rt.date, pk.place_name 
                        FROM ratings rt
                        JOIN users us ON rt.user_id = us.id
                        JOIN parking_area pk ON rt.area_id = pk.id
                        ${exception} ORDER BY rt.id DESC LIMIT ?`
            const result = await connection.databaseQuery(query, limit)

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    getNextRatings : (req, res) => {
        const id = parseInt(req.query.id)
        const limit = parseInt(req.query.limit)

        // do athorization to define exception
        const company = req.query.company === 'null' ? null : parseInt(req.query.company)
        const exception = company ? `pk.company_id = ${company} AND` : ''

        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT rt.id, us.username, rt.rating, rt.message, rt.date, pk.place_name 
                        FROM ratings rt
                        JOIN users us ON rt.user_id = us.id
                        JOIN parking_area pk ON rt.area_id = pk.id
                        WHERE ${exception} rt.id < ?
                        ORDER BY rt.id DESC LIMIT ?`
            const result = await connection.databaseQuery(query, [id, limit])

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    getPrevRatings : (req, res) => {
        const id = parseInt(req.query.id)
        const limit = parseInt(req.query.limit)

        // do athorization to define exception
        const company = req.query.company === 'null' ? null : parseInt(req.query.company)
        const exception = company ? `pk.company_id = ${company} AND` : ''

        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT rt.id, us.username, rt.rating, rt.message, rt.date, pk.place_name 
                        FROM ratings rt
                        JOIN users us ON rt.user_id = us.id
                        JOIN parking_area pk ON rt.area_id = pk.id
                        WHERE ${exception} rt.id > ?
                        ORDER BY rt.id ASC LIMIT ?`
            const result = await connection.databaseQuery(query, [id, limit])

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    getTotalRating : (req, res) => {
        // do athorization to define exception
        const company = req.query.company === 'null' ? null : parseInt(req.query.company)
        const exception = company ? `WHERE pk.company_id = ${company}` : ''

        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT COUNT(*) AS total 
                        FROM ratings rt USE INDEX(PRIMARY)
                        JOIN parking_area pk on rt.area_id = pk.id ${exception}`
            const result = await connection.databaseQuery(query)

            // send feedback to client-side
            const total = result[0]['total']
            res.status(200).send([total])
        })
    }
}