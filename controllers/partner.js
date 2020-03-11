// setup connection
const database = require('../database')
const connection = require('../helpers/databaseQuery')(database)

// export controllers
module.exports = {
    getPartnersData : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT p.id, p.company, p.phone, p.email, us.username AS admin 
                        FROM partners p
                        JOIN users us ON p.user_id = us.id`
            const result = await connection.databaseQuery(query)

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    deletePartners : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `DELETE FROM partners WHERE id = ?`
            await connection.databaseQuery(query)
            
            // send feedback to client-side
            res.status(200).send('partner has been delete.')
        })
    }
}