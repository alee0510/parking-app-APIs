// setup connection
const database = require('../database')
const connection = require('../helpers/databaseQuery')(database)

// export controllers
module.exports = {
    // superadmin features : access all users data and activity plus change user role
    getUserDataIncludeAdmin : async (req, res) => {
        await connection.databaseQueryWithErrorHandle(res, async () => {
            // do authorization
            // if (req.user.role !== 1) throw ({code : 401, msg : 'access denied.'})

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
    },
    // pagination implementation --> reverse : get the last registered user
    // superadmin : get all users account including admin
    paginationGetUsers : async (req, res) => {
        const limit = parseInt(req.query.limit)
        await connection.databaseQueryWithErrorHandle(res, async () => {
            // do query
            const getFirstData = `SELECT * FROM users 
                                WHERE role != 1
                                ORDER BY id DESC LIMIT ?`
            const result = await connection.databaseQuery(getFirstData, limit)

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    paginationGetNextUsers : async (req, res) => {
        const id = parseInt(req.query.id)
        const limit = parseInt(req.query.limit)
        console.log(req.query)
        await connection.databaseQueryWithErrorHandle(res, async () => {
            // do query
            const getNextData = `SELECT * FROM users 
                                WHERE role != 1 AND id < ?
                                ORDER BY id DESC LIMIT ?`
            const result = await connection.databaseQuery(getNextData, [id, limit])

            // send feeback to client-side
            res.status(200).send(result)
        })
    },
    paginationGetPreviousUsers : async (req, res) => {
        const id = parseInt(req.query.id)
        const limit = parseInt(req.query.limit)
        console.log(req.query)
        await connection.databaseQueryWithErrorHandle(res, async () => {
            // do quer
            const getPrevData = `SELECT * FROM users
                                WHERE role != 1 AND id > ?
                                ORDER BY id ASC LIMIT ?`
            const result = await connection.databaseQuery(getPrevData, [id, limit])

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
}

// NOTE : all superadmin features need authentication and authorization