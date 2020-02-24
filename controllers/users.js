// import module
const bycript = require('bcryptjs')
const validation = require('../helpers/validation')
const jwt = require('../helpers/jwt')

// setup connection
const database = require('../database')
const connection = require('../helpers/databaseQuery')(database)

// export controllers
module.exports = {
    // register
    register : async (req, res) => {
        const { username, email, password } = req.body
        await connection.databaseQueryWithErrorHandle(res, async () => {
            // do input validation
            const { error } = validation.validateRegister(req.body)
            if (error) throw ({code : 400, msg : error.details[0].message})

            // check username and email avaiability, username or email can't duplicate
            const check = 'SELECT * FROM users WHERE username = ? OR email = ?'
            const result = await connection.databaseQuery(check, [username, email])
            if (result.length !== 0) throw ({code : 400, msg : 'username or email is already exist.'})

            // crypt user password
            const salt = await bycript.genSalt(10)
            const cryptPassword = await bycript.hash(password, salt)
            req.body.password = cryptPassword

            // input user data into database
            const addUser = 'INSERT INTO users SET ?'
            const newUser = await connection.databaseQuery(addUser, req.body)

            // send token to client-side
            const token = jwt.createToken({id : newUser.insertId})
            res.header('Auth-Token', token).send('register success.')
        })
    },
    // login
    login : async (req, res) => {
        await connection.databaseQueryWithErrorHandle(res, async () => {
            // do input validation
            const { error } = validation.validateLogin(req.body)
            if (error) throw ({code : 400, msg : error.details[0].message})

            // do query
            const query = 'SELECT * FROM users WHERE username = ?'
            const result = await connection.databaseQuery(query, req.body.username)
            if (result.length === 0) throw ({code : 404, msg : 'user doesn\'t found.'})

            // do authorization or password validation
            const valid = await bycript.compare(req.body.password, result[0].password)
            if (!valid) throw({code : 400, msg : 'invalid password.'})

            // create token
            const { id, role, status } = result[0]
            const token = jwt.createToken({id, role, status})

            // send feedback (token) to client-side
            res.header('Auth-Token', token).send('Welcome.')
        })
    },
    // change password
    changePassword : async (req, res) => {
        const id = parseInt(req.params.id)
        const { confirmPassword, newPassword } = req.body
        await connection.databaseQueryWithErrorHandle(res, async () => {
            // do query to get user data
            const getUser = 'SELECT * FROM users WHERE id = ?'
            const user = await connection.databaseQuery(getUser, id)

            // do authorization, password confirmation
            const valid = await bycript.compare(confirmPassword, user[0].password)
            if (!valid) throw ({code : 400, msg : 'invalid password.'})
            
            // do input validation
            const { error } = validation.validatePassword({newPassword})
            if (error) throw ({code : 400, msg : error.details[0].message})
            
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
    // edit username
    editUsername : async (req, res) => {
        const id = parseInt(req.params.id)
        const { username } = req.body // new username
        await connection.databaseQueryWithErrorHandle(res, async () => {
            // check new username avaiability
            const check = 'SELECT * FROM users WHERE username = ?'
            const result = await connection.databaseQuery(check, [username])
            if (result.length !== 0) throw ({code : 400, msg : 'username is already exist.'})
            
            // do input validation
            const { error } = validation.validateUsername({username})
            if (error) throw ({code : 400, msg : error.details[0].message})
            
            // update username
            const update = 'UPDATE users SET ? WHERE id = ?'
            await connection.databaseQuery(update, [req.body, id])
            
            // send feedback to client-side
            res.status(200).send('username has been updated.')
        })
    },
    // delete account
    delete : async (req, res) => {
        const id = parseInt(req.params.id)
        await connection.databaseQueryWithErrorHandle(res, async () => {
            // do query
            const query = 'DELETE FROM users WHERE id = ?'
            await connection.databaseQuery(query, id)

            // send feedback to client-side
            res.status(200).send('your account has been deleted.')
        })
    },
    // keep login
    
}

// NOTE : validation input need to improved