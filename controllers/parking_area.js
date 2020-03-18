// import module
const fileSystem = require('fs')
const path = require('path')

// setup connection
const database = require('../database')
const connection = require('../helpers/databaseQuery')(database)

const PATH = './public'

// export controllers
module.exports = {
    // SUPERADMIN & ADMIN : get parking area data
    getParkingAreaData : (req, res) => {
        // do authorization to define execption
        const company = ['null', undefined].includes(req.query.company) ? null 
                        : parseInt(req.query.company)
        const execption = company ? `WHERE company_id = ${company}` : ''

        connection.databaseQueryWithErrorHandle(res, async () => {
            const getData = `SELECT pk.id, p.company, pk.image, pk.address, pk.city, 
                        pk.province, pk.car_cost, pk.motor_cost, pk.car_slot, 
                        pk.motor_slot, pk.place_name, pk.coordinates
                        FROM parking_area pk
                        JOIN partners p ON p.id = pk.company_id ${execption}`
            const data = await connection.databaseQuery(getData)
            // const get = JSON.parse(data[0].coordinates)
            // console.log(get.latitude)

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
            const query = 'DELETE FROM parking_area WHERE company_id = ? and id = ?'
            await connection.databaseQuery(query, [company_id, area_id])

            // send feedback to client-side
            res.status(200).send('area has been deleted.')
        })
    },
    // edit parking area
    editParkingArea : (req, res) => {
        const id = parseInt(req.params.id)
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `UPDATE parking_area SET ? WHERE id = ?`
            await connection.databaseQuery(query, [{...req.body}, id])
            
            // send feedback to client-side
            res.status(200).send('area has been edited.')
        })
    },
    // add photos
    addPhoto : async (req, res) => {
        const id = parseInt(req.params.id)
        console.log(req.file)
        try {
            // check file image from request
            if (!req.file) throw ({code : 400, msg : 'image doesn\'t exist.'})

            // check image path in database if exist
            const getPath = 'SELECT * FROM parking_area WHERE id = ?'
            const result = await connection.databaseQuery(getPath, id)

            // get image file path from request
            const image = req.file.path.split('\\').splice(1).join('/')
            console.log(image)

            // do query to update image
            const update = 'UPDATE parking_area SET image = ? WHERE id = ?'
            await connection.databaseQuery(update, [image, id])

            // check old profile image file in public folder => if exist delete it
            if (result[0].image) {
                fileSystem.unlinkSync(path.join(PATH, result[0].image))
            }

            // send feedback to client-side
            res.status(200).send('upload success.')

        } catch (err) {
            fileSystem.unlinkSync(req.file.path)
            res.status(err.code).send(err.msg)
        }
    }
}