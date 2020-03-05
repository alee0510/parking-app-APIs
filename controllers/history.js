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
    getHistoryByUser : (req, res) => {
        const id = parseInt(req.params.id)
        console.log(id)
        connection.databaseQueryWithErrorHandle(res, async () => {
            // get user history
            const getHistory = `SELECT h.id, us.username, h.area_id, h.enter_date, h.leave_date, h.duration, pk.place_name 
                            FROM history h
                            JOIN users us ON h.user_id = us.id
                            JOIN parking_area pk ON h.area_id = pk.id
                            WHERE us.id = ?`
            const history = await connection.databaseQuery(getHistory, id)
            console.log(history)

            // get user vehicle type
            const getVehicleType = `SELECT vehicle_type FROM vehicles WHERE user_id = ?`
            const vehicle = await connection.databaseQuery(getVehicleType, id)

            // get cost
            const areaId = `(${history.map(item => item.area_id).join(',')})`
            const getCost = `SELECT car_cost, motor_cost FROM parking_area where id IN ${areaId}`
            const cost = await connection.databaseQuery(getCost)

            // get total cost by vehicle type, 1 = car and 2 = motor
            history.map((item, index) => item.total_cost = vehicle === 1 ? (item.duration/10)*cost[index].car_cost 
            : (item.duration/10)*cost[index].motor_cost)

            // send feedback to client side
            res.status(200).send(history)
        })
    },
    // add user log history when enter parking area
    addOnActive : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'INSERT INTO on_actibe SET ?'
            const result = await connection.databaseQuery(query)

            // send feedback to client-side
            const insertId = result.insertId
            res.status(200).send(insertId)
        })
    },
    // change status when user leave parking area
    changeOnActiveStatus : (req, res) => {
        const id = parseInt(req.params.id)
        connection.databaseQueryTransaction(res, async () => {
            // change status on on_active table
            const changeStatus = 'UPDATE on_active SET ? WHERE id = ?'
            await connection.databaseQuery(changeStatus, [req.body.status, id])

            // get log on_active history
            const getLog = 'SELECT * FROM on_active WHERE id = ?'
            const log = await connection.databaseQuery(getLog, id)

            // fill history table using data from log and leave data from log
            log.leave_data = req.body.leave_date
            log.duration = req.body.duration
            delete log.status

            const addHistory = 'INSERT INTO history SET ?'
            await connection.databaseQuery(addHistory, log)

            // send feedback to client-side
            res.status(200).send('status change and history added.')
        })
    },
    // SUPER ADMIN & ADMIN : get history data and on_active only
    getInitialHistory : (req, res) => {
        const limit = parseInt(req.query.limit)

        // do authorization to define execption
        const on = req.query.only === 'null' ? null : parseInt(req.query.only)
        const only = on ? `WHERE pk.company_id = ${only}` : ''

        connection.databaseQueryWithErrorHandle(req, async () => {
            const query = `SELECT h.id, us.username, h.enter_date, h.leave_date, h.duration, pk.place_name 
                        FROM history h
                        JOIN users us ON h.user_id = us.id
                        JOIN parking_area pk ON h.area_id = pk.id 
                        ${only} ORDER BY h.id DESC LIMIT ?`
            const result = await connection.databaseQuery(query, limit)
            
            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    getNextHistory : (req, result) => {
        const id = parseInt(req.query.id)
        const limit = parseInt(req.query.limit)

        // do authorization to define execption
        const on = req.query.only === 'null' ? null : parseInt(req.query.only)
        const only = on ? `pk.company_id = ${only} AND` : ''

        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT h.id, us.username, h.enter_date, h.leave_date, h.duration, pk.place_name 
                        FROM history h
                        JOIN users us ON h.user_id = us.id
                        JOIN parking_area pk ON h.area_id = pk.id
                        WHERE ${only} h.id < ? 
                        ORDER BY h.id DESC LIMIT ?`
            const result = await connection.databaseQuery(query, [id, limit])
            
            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    getPrevHistory : (req, res) => {
        const id = parseInt(req.query.id)
        const limit = parseInt(req.query.limit)
    
        // do authorization to define execption
        const on = req.query.only === 'null' ? null : parseInt(req.query.only)
        const only = on ? `pk.company_id = ${only} AND` : ''

        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT h.id, us.username, h.enter_date, h.leave_date, h.duration, pk.place_name 
                        FROM history h
                        JOIN users us ON h.user_id = us.id
                        JOIN parking_area pk ON h.area_id = pk.id
                        WHERE ${only} h.id > ?
                        ORDER BY h.id ASC LIMIT ?`
            const result = await connection.databaseQuery(query, [id, limit])
            
            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    // on active
    getInitialOnActive : (req, res) => {
        const limit = parseInt(req.query.limit)

        // do authorization to define execption
        const on = req.query.only === 'null' ? null : parseInt(req.query.only)
        const only = on ? `WHERE pk.company_id = ${only}` : ''

        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT oa.id, us.username, oa.enter_date, oa.status, pk.place_name, pk.company_id 
                        FROM on_active oa
                        JOIN users us ON oa.user_id = us.id
                        JOIN parking_area pk ON oa.area_id = pk.id
                        ${only} ORDER BY oa.id DESC LIMIT ?`
            const result = await databaseQuery(query, limit)

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    getNexOnActive : (res, res) => {
        const id = parseInt(req.query.id)
        const limit = parseInt(req.query.limit)
        
        // do authorization to define execption
        const on = req.query.only === 'null' ? null : parseInt(req.query.only)
        const only = on ? `pk.company_id = ${only} AND` : ''
        
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT oa.id, us.username, oa.enter_date, oa.status, pk.place_name, pk.company_id 
                        FROM on_active oa
                        JOIN users us ON oa.user_id = us.id
                        JOIN parking_area pk ON oa.area_id = pk.id
                        WHERE oa.id < ? ${only} 
                        ORDER BY oa.id DESC LIMIT ?`
            const result = await databaseQuery(query, [id, limit])
        
            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    getPrevOnActive : (res, res) => {
        const id = parseInt(req.query.id)
        const limit = parseInt(req.query.limit)
        
        // do authorization to define execption
        const on = req.query.only === 'null' ? null : parseInt(req.query.only)
        const only = on ? `pk.company_id = ${only} AND` : ''
        
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT oa.id, us.username, oa.enter_date, oa.status, pk.place_name, pk.company_id 
                        FROM on_active oa
                        JOIN users us ON oa.user_id = us.id
                        JOIN parking_area pk ON oa.area_id = pk.id
                        WHERE oa.id > ? ${only} 
                        ORDER BY oa.id ASC LIMIT ?`
            const result = await databaseQuery(query, [id, limit])
        
            // send feedback to client-side
            res.status(200).send(result)
        })
    }
}