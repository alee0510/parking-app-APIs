// import module
const bycript = require('bcryptjs')

// setup connection
const database = require('../database')
const connection = require('../helpers/databaseQuery')(database)

// export controllers
module.exports = {
    // get account info by user id => NEED login authentication
    getAccountById : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'SELECT * FROM users WHERE id = ?'
            const result = await connection.databaseQuery(query, parseInt(req.params.id))

            // send feedback to client-side
            res.status(200).send(result[0])
        })
    },
    // edit account : change username or passowrd => NEED login authentication
    changePassword : (req, res) => {
        // const id = parseInt(req.params.id)
        const { oldPassword, newPassword } = req.body

        connection.databaseQueryWithErrorHandle(res, async () => {
            // do query to get user data
            const getUser = 'SELECT * FROM users WHERE id = ?'
            const user = await connection.databaseQuery(getUser, req.user.id)

            // do authentication => password confirmation
            const valid = await bycript.compare(oldPassword, user[0].password)
            if (!valid) throw ({code : 400, msg : 'invalid password.'})
            
            // crypt new password
            const salt = await bycript.genSalt(10)
            const newCryptPassword = await bycript.hash(newPassword, salt)

            // update password in database
            const update = 'UPDATE users SET password = ? WHERE id = ?'
            await connection.databaseQuery(update, [newCryptPassword, id])

            // send feedback to client-side
            res.status(200).send('password has been updated.')
        })
    },
    changeUsername : (req, res) => {
        const id = parseInt(req.params.id)
        const { username } = req.body // new username

        connection.databaseQueryWithErrorHandle(res, async () => {
            // check if new username is avaiable, username cannot be duplicate
            const check = 'SELECT * FROM users WHERE username = ?'
            const result = await connection.databaseQuery(check, username)
            if (result.length !== 0) throw ({code : 400, msg : 'username is already exist.'})
            
            // update username in database
            const update = 'UPDATE users SET ? WHERE id = ?'
            await connection.databaseQuery(update, [username, id])
            
            // send feedback to client-side
            res.status(200).send('username has been updated.')
        })
    },
    // delete account, NEED login authorization and password authentication
    delete : (req, res) => {
        const id = parseInt(req.params.id)
        connection.databaseQueryWithErrorHandle(res, async () => {
            // do query to get user data
            const getUser = 'SELECT * FROM users WHERE id = ?'
            const user = await connection.databaseQuery(getUser, id)
    
            // do authentication => password confirmation
            const valid = await bycript.compare(req.body.confirmPassowrd, user[0].password)
            if (!valid) throw ({code : 400, msg : 'invalid password.'})

            // do query
            const query = 'DELETE FROM users WHERE id = ?'
            await connection.databaseQuery(query, id)

            // send feedback to client-side
            res.status(200).send('your account has been deleted.')
        })
    },

}