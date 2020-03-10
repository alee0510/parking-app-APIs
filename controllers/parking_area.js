// setup connection
const database = require('../database')
const connection = require('../helpers/databaseQuery')(database)

// export controllers
module.exports = {
    // SUPERADMIN & ADMIN : get parking area data
    getParkingAreaData : (req, res) => {
        // do authorization to define execption
        const company = req.query.company === 'null' & !req.query.company ? null 
                        : parseInt(req.query.company)
        const execption = company ? `WHERE company_id = ${company}` : ''

        connection.databaseQueryWithErrorHandle(res, async () => {
            const getData = `SELECT p.company, pk.id, pk.address, pk.city, pk.province, pk.car_cost, pk.motor_cost, pk.slot, pk.place_name, pk.geo_location 
                        FROM parking_area pk
                        JOIN partners p ON p.id = pk.company_id ${execption}`
            const data = await connection.databaseQuery(getData)

            // send feedback to client side
            res.status(200).send(data)
        })
    },
    // input need company_id
    addParkingArea : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const add = 'INSERT INTO parking_area SET ?'
            await connection.databaseQuery(add, req.body)

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
    },
    // edit parking area
}