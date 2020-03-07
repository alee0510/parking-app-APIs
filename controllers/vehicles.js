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
    getCarBrand : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'SELECT * FROM car_brands LIMIT ?'
            const result = await connection.databaseQuery(query, parseInt(req.query.limit))

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    getNextCarBrand : (req, res) => {
        const id = parseInt(req.query.id)
        const limit = parseInt(req.query.limit)
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT * FROM car_brands 
                        WHERE id > ? 
                        LIMIT ?`
            const result = await connection.databaseQuery(query, [id, limit])

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    getPrevCarBrand : (req, res) => {
        const id = parseInt(req.query.id)
        const limit = parseInt(req.query.limit)
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT * FROM car_brands
                        WHERE id < ?
                        ORDER BY id DESC LIMIT ?`
            const result = await connection.databaseQuery(query, [id, limit])
            
            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    // CRUD
    addCarBrand : (req, res) => {
        connection.databaseQueryWithErrorHandle(req, async () => {
            const query = 'INSERT INTO car_brands SET ?'
            await connection.databaseQuery(query, req.body)
            
            // send feedback to client-side
            res.status(200).send('car new brand has been added.')
        })
    },
    editCarBrand : (req, res) => {
        connection.databaseQueryWithErrorHandle(req, async () => {
            const query = 'UPDATE car_brands SET ? WHERE id ?'
            await connection.databaseQuery(query, [req.body, parseInt(req.params.id)])
            
            // send feedback to client-side
            res.status(200).send('edit car brand success.')
        })
    },
    // MOTOR BRANDS
    getMotorBrand : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'SELECT * FROM motor_brands'
            const result = await connection.databaseQuery(query)
    
            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    addMotorBrand : (req, res) => {
        connection.databaseQueryWithErrorHandle(req, async () => {
            const query = 'INSERT INTO motor_brands SET ?'
            await connection.databaseQuery(query, req.body)
            
            // send feedback to client-side
            res.status(200).send('motor new brand has been added.')
        })
    },
    editMotorBrand : (req, res) => {
        connection.databaseQueryWithErrorHandle(req, async () => {
            const query = 'UPDATE motor_brands SET ? WHERE id ?'
            await connection.databaseQuery(query, [req.body, parseInt(req.params.id)])
            
            // send feedback to client-side
            res.status(200).send('edit motor brand success.')
        })
    },
    // CAR & MOTOR TYPE : get, add, and edit
    getCarTypeTotal : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'SELECT COUNT(*) as total FROM car_types USE INDEX(PRIMARY)'
            const result = await connection.databaseQuery(query)
            
            // send feedback to client-side
            const total = result[0]['total']
            res.status(200).send([total])
        })
    },
    getCarType : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT ct.id, ct.name, cb.brand FROM car_types ct
                        JOIN car_brands cb ON ct.brand_id = cb.id
                        LIMIT ?`
            const result = await connection.databaseQuery(query, parseInt(req.query.limit))

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    getNextCarType : (req, res) => {
        const id = parseInt(req.query.id)
        const limit = parseInt(req.query.limit)
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT ct.id, ct.name, cb.brand FROM car_types ct
                        JOIN car_brands cb ON ct.brand_id = cb.id
                        WHERE ct.id > ? LIMIT ?`
            const result = await connection.databaseQuery(query, [id, limit])

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    getPrevCarType : (req, res) => {
        const id = parseInt(req.query.id)
        const limit = parseInt(req.query.limit)
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT ct.id, ct.name, cb.brand FROM car_types ct
                        JOIN car_brands cb ON ct.brand_id = cb.id
                        WHERE ct.id < ?
                        ORDER BY ct.id DESC LIMIT ?`
            const result = await connection.databaseQuery(query, [id, limit])

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    addCarType : (req, res) => {
        connection.databaseQueryWithErrorHandle(req, async () => {
            const query = 'INSERT INTO car_types SET ?'
            await connection.databaseQuery(query, req.body)
            
            // send feedback to client-side
            res.status(200).send('car new types has been added.')
        })
    },
    editCarType : (req, res) => {
        connection.databaseQueryWithErrorHandle(req, async () => {
            const query = 'UPDATE car_types SET ? WHERE id ?'
            await connection.databaseQuery(query, [req.body, parseInt(req.params.id)])
            
            // send feedback to client-side
            res.status(200).send('edit car types success.')
        })
    },
    // MOTOR BRANDS
    getMotorType : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'SELECT * FROM motor_types'
            const result = await connection.databaseQuery(query)
    
            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    addMotorType : (req, res) => {
        connection.databaseQueryWithErrorHandle(req, async () => {
            const query = 'INSERT INTO motor_types SET ?'
            await connection.databaseQuery(query, req.body)
            
            // send feedback to client-side
            res.status(200).send('motor new type has been added.')
        })
    },
    editMotorType : (req, res) => {
        connection.databaseQueryWithErrorHandle(req, async () => {
            const query = 'UPDATE motor_types SET ? WHERE id ?'
            await connection.databaseQuery(query, [req.body, parseInt(req.params.id)])
            
            // send feedback to client-side
            res.status(200).send('edit motor type success.')
        })
    },
}