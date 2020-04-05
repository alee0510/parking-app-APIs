// setup connection
const database = require('../database')
const connection = require('../helpers/databaseQuery')(database)

// export controllers
module.exports = {
    // get total income
    getTotalIncome : (req, res) => {
        // do athorization to define exception
        const company = parseInt(req.query.company) || null
        const queryCompany = company ? `WHERE pk.company_id = ${company}` : ''
        
        // do query
        connection.databaseQueryWithErrorHandle(res, async () => {
            // get cost from company
            const getCost = `SELECT h.id, h.user_id, h.area_id, h.duration, vh.vehicle_type, pk.place_name, pk.car_cost, pk.motor_cost 
                            FROM history h
                            JOIN parking_area pk ON pk.id = h.area_id
                            JOIN vehicles vh ON vh.id = h.user_id ${queryCompany}`
            const cost = await connection.databaseQuery(getCost)

            // calculate income
            const total = cost.map(({vehicle_type, duration,  car_cost, motor_cost}) => {
                if (vehicle_type === 1) {
                    return Math.ceil(duration/10)*car_cost
                } else {
                    return Math.ceil(duration/10)*motor_cost
                }
            }).reduce((x, y) => x + y)

            // send feedback to client-side
            res.status(200).send([total])
        })
    },
    getGuestByVehilce : (req, res) => {
        // check query
        const vehicle = parseInt(req.query.vehicle) || null
        const queryVehicle = vehicle ? `WHERE vh.vehicle_type=${vehicle}` : ''

        // do query
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT h.id, h.user_id, vh.vehicle_type, vh.brand_id, vh.type_id 
                        FROM history h
                        JOIN vehicles vh ON vh.id = h.user_id ${queryVehicle}`
            const result = await connection.databaseQuery(query)

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    getHistoryPerProps : (req, res) => {
        const key = req.query.key || null // day, month. and week
    }
}