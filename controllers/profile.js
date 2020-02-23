// import module
const fileSystem = require('fs')

// setup connection
const database = require('../database')
const connection = require('../helpers/databaseQuery')(database)

// export controllers
module.exports = {
    // add profile data : need user_id
    addProfile : async (req, res) => {
        console.log(req.file.path || 'image does\'t exist.')
        await connection.databaseQueryWithErrorHandle(res, req.file, async () => {
            // prepare profile data
            let profile = JSON.parse(req.body.profile)

            // check if image file exist => user avatar
            if (req.file) profile.image = req.file.path.split('\\').splice(1).join('/')

            // do query
            const query = 'INSERT INTO users SET ? '
            await connection.databaseQuery(query, profile)

            // send feedback to client-side
            res.status(200).send('profile added.')
        })
    },
    // edit image profile : need user_id
    editImage : async (req, res) => {
        console.log(req.file.path || 'image does\'t exist.')
        await connection.databaseQueryWithErrorHandle(res, req.file, async () => {
            // prepare updated profile data
            let profile = JSON.parse(req.body.profile)
            let oldImage = profile.image

            // check if image file exist
            if (req.body.image) profile.image = req.file.path.split('\\').splice(1).join('/')

            // do query
            const update = 'UPDATE users SET ? WHERE user_id = ?'
            await connection.databaseQuery(update, [profile, parseInt(profile.user_id)])

            // delete old image file
            fileSystem.unlinkSync(oldImage)

            // send feedback to client-side
            res.status(200).send('profile updated.')
        })
    },
    // edit profile data
    editProfile : async (req, res) => {
        const id = parseInt(req.params.id)
        await connection.databaseQueryWithErrorHandle(res, async () => {
            // do query
            const query = 'UPDATE users SET ? WHERE id = ?'
            await connection.databaseQuery(query, [req.body, id])

            // send feedback to client-side
            res.status(200).send('your data has been updated.')
        })
    },
}