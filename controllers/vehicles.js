// setup connection
const database = require('../database')
const connection = require('../helpers/databaseQuery')(database)

// export controllers
module.exports = {
    // CAR and MOTOR BRANDS: get, add, and edit brand name
    getTotalCarBrand : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'SELECT COUNT(*) as total FROM car_brands USE INDEX(PRIMARY)'
            const result = await connection.databaseQuery(query)
            
            // send feedback to client-side
            const total = result[0]['total']
            res.status(200).send([total])
        })
    },
    getCarBrands : (req, res) => {
        // check query
        const limit = parseInt(req.query.limit) || null
        const next = parseInt(req.query.next) || null
        const prev = parseInt(req.query.prev) || null

        // define query
        const queryLimit = limit ? `LIMIT ${limit}` : ''
        const queryNext = next ? `WHERE id > ${next} ` : ''
        const queryPrev = prev ? `WHERE id < ${prev} ORDER BY id DESC ` : ''

        // do query
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT * FROM car_brands ${queryNext}${queryPrev}${queryLimit}`
            // console.log(query)
            const result = await connection.databaseQuery(query)

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    // CRUD
    addCarBrand : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'INSERT INTO car_brands SET ?'
            await connection.databaseQuery(query, req.body)
            
            // send feedback to client-side
            res.status(200).send('car new brand has been added.')
        })
    },
    editCarBrand : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'UPDATE car_brands SET ? WHERE id = ?'
            await connection.databaseQuery(query, [req.body, parseInt(req.params.id)])
            
            // send feedback to client-side
            res.status(200).send('edit car brand success.')
        })
    },
    deleteCarBrand : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'DELETE FROM car_brands WHERE id = ?'
            await connection.databaseQuery(query, parseInt(req.params.id))
            
            // send feedback to client-side
            res.status(200).send('delete car brand success.')
        })

    },
    // MOTOR BRANDS
    getTotalMotorBrand : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'SELECT COUNT(*) AS total FROM motor_brands USE INDEX(PRIMARY)'
            const result = await connection.databaseQuery(query)

            // send feedback to client-side
            const total = result[0]['total']
            res.status(200).send([total])
        })
    },
    getMotorBrands : (req, res) => {
        // check query
        const limit = parseInt(req.query.limit) || null
        const next = parseInt(req.query.next) || null
        const prev = parseInt(req.query.prev) || null

        // define query
        const queryLimit = limit ? `LIMIT ${limit}` : ''
        const queryNext = next ? `WHERE id > ${next} ` : ''
        const queryPrev = prev ? `WHERE id < ${prev} ORDER BY id DESC ` : ''

        // do query
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT * FROM motor_brands ${queryNext}${queryPrev}${queryLimit}`
            // console.log(query)
            const result = await connection.databaseQuery(query)

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    addMotorBrand : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'INSERT INTO motor_brands SET ?'
            await connection.databaseQuery(query, req.body)
            
            // send feedback to client-side
            res.status(200).send('motor new brand has been added.')
        })
    },
    editMotorBrand : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'UPDATE motor_brands SET ? WHERE id = ?'
            await connection.databaseQuery(query, [req.body, parseInt(req.params.id)])
            
            // send feedback to client-side
            res.status(200).send('edit motor brand success.')
        })
    },
    deleteMotorBrand : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'DELETE FROM motor_brands WHERE id = ?'
            await connection.databaseQuery(query, parseInt(req.params.id))
            
            // send feedback to client-side
            res.status(200).send('delete motor brand success.')
        })
    },
    // CAR & MOTOR TYPE : get, add, and edit
    getTotalCarType : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'SELECT COUNT(*) as total FROM car_types USE INDEX(PRIMARY)'
            const result = await connection.databaseQuery(query)
            
            // send feedback to client-side
            const total = result[0]['total']
            res.status(200).send([total])
        })
    },
    getCarTypes : (req, res) => {
        // check query
        const limit = parseInt(req.query.limit) || null
        const next = parseInt(req.query.next) || null
        const prev = parseInt(req.query.prev) || null

        // define query
        const queryLimit = limit ? `LIMIT ${limit}` : ''
        const queryNext = next ? `WHERE ct.id > ${next} ` : ''
        const queryPrev = prev ? `WHERE ct.id < ${prev} ORDER BY ct.id DESC ` : ''

        // do query
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT ct.id, ct.name, cb.brand, ct.brand_id FROM car_types ct
                        JOIN car_brands cb ON ct.brand_id = cb.id
                        ${queryNext}${queryPrev}${queryLimit}`
            // console.log(query)
            const result = await connection.databaseQuery(query)

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    addCarType : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'INSERT INTO car_types SET ?'
            await connection.databaseQuery(query, req.body)
            
            // send feedback to client-side
            res.status(200).send('car new types has been added.')
        })
    },
    editCarType : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'UPDATE car_types SET ? WHERE id = ?'
            await connection.databaseQuery(query, [req.body, parseInt(req.params.id)])
            
            // send feedback to client-side
            res.status(200).send('edit car types success.')
        })
    },
    deleteCarType : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'DELETE FROM car_types WHERE id = ?'
            await connection.databaseQuery(query, parseInt(req.params.id))
            
            // send feedback to client-side
            res.status(200).send('delete car types success.')
        })
    },
    // MOTOR TYPES
    getTotalMotorType : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'SELECT COUNT(*) AS total FROM motor_types USE INDEX(PRIMARY)'
            const result = await connection.databaseQuery(query)

            // send feedback to client-side
            const total = result[0]['total']
            res.status(200).send([total])
        })
    },
    getMotorTypes : (req, res) => {
        // check query
        const limit = parseInt(req.query.limit) || null
        const next = parseInt(req.query.next) || null
        const prev = parseInt(req.query.prev) || null
    
        // define query
        const queryLimit = limit ? `LIMIT ${limit}` : ''
        const queryNext = next ? `WHERE mt.id > ${next} ` : ''
        const queryPrev = prev ? `WHERE mt.id < ${prev} ORDER BY mt.id DESC ` : ''

        // do query
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT mt.id, mt.name, mb.brand, mt.brand_id 
                        FROM motor_types mt
                        JOIN motor_brands mb ON mt.brand_id = mb.id
                        ${queryNext}${queryPrev}${queryLimit}`
            const result = await connection.databaseQuery(query, parseInt(req.query.limit))
    
            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    addMotorType : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'INSERT INTO motor_types SET ?'
            await connection.databaseQuery(query, req.body)
            
            // send feedback to client-side
            res.status(200).send('motor new type has been added.')
        })
    },
    editMotorType : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'UPDATE motor_types SET ? WHERE id = ?'
            await connection.databaseQuery(query, [req.body, parseInt(req.params.id)])
            
            // send feedback to client-side
            res.status(200).send('edit motor type success.')
        })
    },
    deleteMotorType : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'DELETE FROM motor_types WHERE id = ?'
            await connection.databaseQuery(query, parseInt(req.params.id))
            
            // send feedback to client-side
            res.status(200).send('delete motor type success.')
        })
        
    },  
    // USER : get and edit vehilce data
    getUserVehicle : (req, res) => {
        const id = parseInt(req.params.id)
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT * FROM vehicles WHERE user_id = ?`
            const result = await connection.databaseQuery(query, id)
            console.log(result)

            // check vehilce type
            const vehicleType = result[0].vehicle_type
            const brand = vehicleType === 1 ? `car_brands` : `motor_brands`
            const type = vehicleType === 1 ? `car_types` : `motor_types`

            // define query
            const getVehicle = `SELECT v.id, v.police_no, b.brand, v.brand_id, t.name as type, v.type_id, v.color, v.user_id, v.vehicle_type
                        FROM vehicles v
                        JOIN ${type} t ON t.id = v.type_id
                        JOIN ${brand} b ON b.id = v.brand_id
                        WHERE v.user_id = ?`
            const vehicle = await connection.databaseQuery(getVehicle, id)
            
            // send feedback to client-side
            res.status(200).send(vehicle[0])
        })
    },
    editVehicleData : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `UPDATE vehicles SET ? WHERE user_id = ?`
            await connection.databaseQuery(query, [req.body, parseInt(req.params.id)])
        
            // send feedback to client-side
            res.status(200).send('vehicles data has been updated.')
        })
    },
    getCarTypeByBrand : (req, res) => {
        const brand_id = parseInt(req.params.id)
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT * FROM car_types WHERE brand_id = ?`
            const result = await connection.databaseQuery(query, brand_id)

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    getMotorTypeByBrand : (req, res) => {
        const brand_id = parseInt(req.params.id)
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT * FROM motor_types WHERE brand_id = ?`
            const result = await connection.databaseQuery(query, brand_id)

            // send feedback to client-side
            res.status(200).send(result)
        })
    }
}