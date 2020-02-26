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
            // check if username and email is avaiable, username or email can't be duplicate
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
            // do query
            const query = 'SELECT * FROM users WHERE username = ?'
            const result = await connection.databaseQuery(query, req.body.username)
            if (result.length === 0) throw ({code : 404, msg : 'user doesn\'t found.'})

            // do password authentication
            const valid = await bycript.compare(req.body.password, result[0].password)
            if (!valid) throw({code : 400, msg : 'invalid password.'})

            // create token
            const { id, role, status } = result[0]
            const token = jwt.createToken({id, role, status})

            // send feedback (token) to client-side
            res.header('Auth-Token', token).send('Welcome.')
        })
    },
    // keep login
    stayLogin : async (req, res) => {
        await connection.databaseQueryWithErrorHandle(res, async () => {
            // do query to always provide data to user
            const query = 'SELECT * FROM users WHERE id = ?'
            const result = await connection.databaseQuery(query, req.user.id)

            // send feedback to client-side
            res.status(200).send(result[0])
        })
    }
}

// NOTE : validation input has been done in client-side before sending a request