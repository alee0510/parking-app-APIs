// import module
const fileSystem = require('fs')
const path = require('path')

// setup connection
const database = require('../database')
const connection = require('../helpers/databaseQuery')(database)

const PATH = './public'

// export controllers
module.exports = {
    // get user profile info by user id => NEED login authentication
    getUserProfileByID : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            // const query = `SELECT id, name, image, DATE_FORMAT(birthdate, '%W %D %M %Y') AS birthdate, phone, address 
            // FROM profiles WHERE id = ?`
            const query = `SELECT id, name, image, DATE_FORMAT(birthdate,'%Y-%m-%d') as birthdate, phone, address 
                        FROM profiles WHERE id = ?`
            const result = await connection.databaseQuery(query, parseInt(req.params.id))

            // send feedback to client-side
            res.status(200).send(result[0])
        })
    },
    editUserProfile : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'UPDATE profiles SET ? WHERE id = ?'
            await connection.databaseQuery(query, [req.body, parseInt(req.params.id)])
            
            // send feeback to client-side
            res.status(200).send('your profile has been updated.')
        })
    },
    uploadImageProfile : async (req, res) => {
        const id = parseInt(req.params.id)
        console.log(req.file)
        try {
            // check file image from request
            if (!req.file) throw ({code : 400, msg : 'image doesn\'t exist.'})

            // check user image path in database if exist
            const getPath = 'SELECT * FROM profiles WHERE id = ?'
            const result = await connection.databaseQuery(getPath, id)

            // get image file path from request
            const image = req.file.path
            console.log(image)

            // do query to update image profile
            const update = 'UPDATE profiles SET image = ? WHERE id = ?'
            await connection.databaseQuery(update, [image, id])

            // check old profile image file in public folder => if exist delete it
            if (result[0].image) {
                fileSystem.unlinkSync(path.join(PATH, result[0].image))
            }

            // send feedback to client-side
            res.status(200).send('ok')

        } catch (err) {
            fileSystem.unlinkSync(req.file.path)
            res.status(err.code).send(err.msg)
        }
    }
}

// NOTE : image profile will add later after registration, in profile edit page