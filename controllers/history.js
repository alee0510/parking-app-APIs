// setup connection
const database = require('../database')
const connection = require('../helpers/databaseQuery')(database)

// export controllers
module.exports = {
    // get total data
    getTotalHistory : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'SELECT COUNT(*) AS total FROM history USE INDEX(PRIMARY)'
            const result = await connection.databaseQuery(query)

            // send feedback to client-side
            const total = result[0]['total']
            res.status(200).send([total])
        })
    },
    // USER : GET History by id and total cost by duration per-10 minutes
    // getHistoryByUser : async(req, res) => {
    //     await connection.databaseQueryWithErrorHandle(res, async () => {

    //     })
    // }


}