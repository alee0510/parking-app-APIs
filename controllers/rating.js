// setup connection
const database = require('../database')
const connection = require('../helpers/databaseQuery')(database)

// export controllers
module.exports = {
    // USER : GEt rating by user
    getRatingByUser : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'SELECT * FROM ratings WHERE user_id = ?'
            const result = await connection.databaseQuery(query, parseInt(req.params.id))
            console.log(result)

            // if user does'nt has rating records
            if (result.length === 0) throw({ code  : 200, msg : [] })

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
    getRating : (req, res) => {
        // check query
        const limit = parseInt(req.query.limit) || null
        const company = parseInt(req.query.company) || null
        const next  = parseInt(req.query.next) || null // last id
        const prev = parseInt(req.query.prev) || null // first id
    
        // define query
        const queryLimit = limit ? `LIMIT ${limit}` : ''
        const queryCompany = company ? next || prev ? `AND pk.company_id = ${company}` : `WHERE pk.company_id = ${company}` : ''
        const queryNext =  next ? `WHERE rt.id < ${next} ` : ''
        const queryPrev = prev ? `WHERE rt.id > ${prev} ` : ''
        const order = prev ? 'ASC' : 'DESC'

        // do query
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT rt.id, us.username, rt.rating, rt.message, rt.date, pk.place_name 
                    FROM ratings rt
                    JOIN users us ON rt.user_id = us.id
                    JOIN parking_area pk ON rt.area_id = pk.id
                    ${queryNext}${queryPrev}${queryCompany}
                    ORDER BY rt.id ${order} ${queryLimit}`
            // console.log(query)
            const result = await connection.databaseQuery(query)

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