// setup connection
const database = require('../database')
const connection = require('../helpers/databaseQuery')(database)

// export controllers
module.exports = {
    // superadmin features : access all users data and activity plus change user role
    getUserDataIncludeAdmin : async (req, res) => {
        await connection.databaseQueryWithErrorHandle(res, async () => {
            // do authorization
            if (req.user.role !== 1) throw ({code : 401, msg : 'access denied.'})

            // do query
            const query = `SELECT us.id, us.username, us.email, pf.name, 
                            pf.birthdate, pf.phone, pf.address, us.role 
                            FROM users us
                            JOIN profiles pf ON us.id = pf.id
                            WHERE us.role != 1`
            const result = await connection.databaseQuery(query)

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    getUserDataOnly : async (req, res) => {
        await connection.databaseQueryWithErrorHandle(res, async () => {
            // do authorization
            if (![1, 2].includes(req.user.role)) throw ({code : 401, msg : 'access denied.'})

            // do query
            const query = `SELECT us.id, us.username, us.email, pf.name, 
                            pf.birthdate, pf.phone, pf.address, us.role 
                            FROM users us
                            JOIN profiles pf ON us.id = pf.id
                            WHERE us.role != 1 AND us.role != 2`
            const result = await connection.databaseQuery(query)

            // send feedback to client-side
            res.status(200).send(result)
        })
    }
    // superadmin get user data
}

// NOTE : all superadmin features need authentication and authorization