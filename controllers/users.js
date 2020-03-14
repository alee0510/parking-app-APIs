// import module
const bycript = require('bcryptjs')
const jwt = require('../helpers/jwt')

// setup connection
const database = require('../database')
const connection = require('../helpers/databaseQuery')(database)

// export controllers
module.exports = {
    // register
    register : (req, res) => {
        const { fullname, username, email, password } = req.body // user basic infromation
        connection.databaseQueryTransaction(res, async () => {
            // check if username and email is avaiable, username or email can't be duplicate
            const check = 'SELECT * FROM users WHERE username = ? OR email = ?'
            const result = await connection.databaseQuery(check, [username, email])
            if (result.length !== 0) throw ({code : 400, msg : 'username or email is already exist.'})

            // crypt user password
            const salt = await bycript.genSalt(10)
            const cryptPassword = await bycript.hash(password, salt)
            // req.body.password = cryptPassword

            // input user data into database
            const user = { username, email, password : cryptPassword }
            const addUser = 'INSERT INTO users SET ?'
            const newUser = await connection.databaseQuery(addUser, user)

            // add user profile
            const profile = { id : newUser.insertId, name : fullname }
            const addProfile = 'INSERT INTO profiles SET ?'
            await connection.databaseQuery(addProfile, profile)

            // add user wallet
            const wallet = { id : newUser.insertId, saldo : 0, point : 0}
            const addWallet = 'INSERT INTO wallet SET ?'
            await connection.databaseQuery(addWallet, wallet)

            // send token to client-side
            const token = jwt.createToken({id : newUser.insertId})
            res.header('Auth-Token', token).send({id : newUser.insertId})
        })
    },
    // additional data : vehicle information
    regisVehicleInfo : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'INSERT INTO vehicles SET ?'
            await connection.databaseQuery(query)

            // send feedback to client side
            res.status(200).send('vehicle register success.')
        })
    },
    // login
    login : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
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
            res.header('Auth-Token', token).send(result[0])
        })
    },
    // keep login
    stayLogin : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            // do query to always provide data to user
            const query = 'SELECT * FROM users WHERE id = ?'
            const result = await connection.databaseQuery(query, req.user.id)

            // send feedback to client-side
            res.status(200).send(result[0])
        })
    },
    passwordConfirm : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            // get user password from database
            const getInfo = `SELECT * FROM users WHERE id = ?`
            const result = await connection.databaseQuery(getInfo, parseInt(req.params.id))
            console.log(result)

            // password authentication
            const valid = await bycript.compare(req.body.password, result[0].password)
            if(!valid) throw({code : 400, msg : 'invalid password.'})
            console.log(valid)

            // send feedback to client-side
            res.status(200).send({valid})
        })
    }
}

// NOTE : validation input has been done in client-side before sending a request