// setup connection
const database = require('../database')
const connection = require('../helpers/databaseQuery')(database)

// export controllers
module.exports = {
    // get all vehicle data by type
    getCarBrandDetails : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SLECT cb.id AS brand_id, cb.brand, ct.id AS car_id, ct.name 
                            FROM car_brands cb
                            LEFT JOIN car_name ct ON ct.brand_id = cb.id`
            const result = await connection.databaseQuery(query)

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    getMotorBrandDetails : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT mb.id AS id, mb.brand, mt.id AS motor_id, mt.name 
                            FROM motorcycle_brands mb
                            LEFT JOIN motorcycle_name mt ON mt.brand_id = mb.id`
            const result = await connection.databaseQuery(query)

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    getCar : (req, res) => {
        await connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'SELECT * FROM car_brands'
            const result = await connection.databaseQuery(query)

            // send feedbacl to client-side
            res.status(200).send(result)
        })
    },
    getMotor : (req, res) => {
        await connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'SELECT * FROM motorcycle_brands'
            const result = await connection.databaseQuery(query)

            // send feedbacl to client-side
            res.status(200).send(result)
        })
    },
    // add new vehicle brand
    addCarBrand : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () =>{
            const query = 'INSERT INTO car_brands SET ?'
            await connection.databaseQuery(query)
            
            // send feedback to client-side
            res.status(200).send('car brand is added.')
        })
    },
    addMotorBrand : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () =>{
            const query = 'INSERT INTO motorcycle_brands SET ?'
            await connection.databaseQuery(query)
            
            // send feedback to client-side
            res.status(200).send('motorcylce brand is added.')
        })
    },
    addCarName : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () =>{
            const query = 'INSERT INTO car_name SET ?'
            await connection.databaseQuery(query)
            
            // send feedback to client-side
            res.status(200).send('motorcylce brand is added.')
        })
    },
    addMotorName : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () =>{
            const query = 'INSERT INTO motorcycle_name SET ?'
            await connection.databaseQuery(query)
            
            // send feedback to client-side
            res.status(200).send('motorcylce brand is added.')
        })
    },

}