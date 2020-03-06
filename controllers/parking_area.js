// setup connection
const database = require('../database')
const connection = require('../helpers/databaseQuery')(database)

// export controllers
module.exports = {
    // SUPERADMIN & ADMIN : get parking area data
    getParkingAreaData : (req, res) => {
        // do authorization to define execption
        const on = req.query.only === 'null' ? null : parseInt(req.query.only)
        const only = on ? `WHERE company_id = ${only}` : ''

        connection.databaseQueryWithErrorHandle(res, async () => {
            const getData = `SELECT * FROM parking_area ${only}`
            const data = await connection.databaseQuery(getData)

            // send feedback to client side
            res.status(200).send(data)
        })
    },
    // input need company_id
    addParkingArea : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const add = 'INSERT INTO parking_area SET ?'
            await connection.databaseQuery(add)

            // send feedback to client-side
            res.status(200).send('new parking area has been added.')
        })
    },
    // delete parking area : parameter from query
    deleteParkingArea : (req, res) => {
        const company_id = parseInt(req.query.companyid)
        const area_id = parseInt(req.query.areaid)

        connection.databaseQueryWithErrorHandle(res, async () => {
            const deleteParkingArea = 'DELETE FROM parking_area WHERE company_id = ? and id = ?'
            await connection.databaseQueryWithErrorHandle(deleteParkingArea, [company_id, area_id])

            // send feedback to client-side
            res.status(200).send('area has been deleted.')
        })
    }
}