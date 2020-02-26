// import module
const fileSystem = require('fs')

// setup connection
const database = require('../database')
const connection = require('../helpers/databaseQuery')(database)
const DIRECTORY = '../public/profiles/'

// export controllers
module.exports = {
    // get user profile info by user id => NEED login authentication
    getUserProfileByID : async (req, res) => {
        await connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'SELECT * FROM profiles WHERE id = ?'
            const result = await connection.databaseQuery(query, req.user.id)

            // send feedback to client-side
            res.status(200).send(result[0])
        })
    },
    // add profile data => NEED login authentication
    addUserProfile : async (req, res) => {
        await connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'INSERT INTO profiles SET ?'
            await connection.databaseQuery(query, req.body)

            // send feeback to client-side
            res.status(200).send('your profile has been added.')
        })
    },
    // edit user profile : change user image or profile data, => NEED login authentication
    editUserProfile : async (req, res) => {
        await connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'UPDATE profiles SET ? WHERE id = ?'
            await connection.databaseQuery(query, [req.body, req.user.id])
            
            // send feeback to client-side
            res.status(200).send('your profile has been updated.')
        })
    },
    uploadImageProfile : async(req, res) => {
        await connection.databaseQueryWithErrorHandle(res, async () => {
            // check image file from request
            if (!req.file) throw ({code : 400, msg : 'image doesn\'t exist.'})

            // check user image path in database
            const getPath = 'SELECT * FROM profiles WHERE id = ?'
            const result = await connection.databaseQuery(getPath, req.user.id)

            // get image file path
            const image = req.file.path.split('\\').splice(1).join('/')
            
            // do query update
            const update = 'UPDATE profiles SET image = ? WHERE id = ?'
            await connection.databaseQuery(update, [image, req.user.id])
            
            // check old profile image file in public folder => if exist delete it
            if (result[0].image) fileSystem.unlinkSync(DIRECTORY + result[0].image)

            // send feedback to client-side
            res.status(200).send('image profile has been updated.')
        })
    }
}

// NOTE : image profile will add later after registration, in profile edit page