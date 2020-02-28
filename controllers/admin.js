// setup connection
const database = require('../database')
const connection = require('../helpers/databaseQuery')(database)

// export controllers
module.exports = {
    /* pagination implementation --> reverse : get the last registered user
    get all users account */
    paginationGetUsers : async (req, res) => {
        console.log(req.query)

        // define exception
        const on = parseInt(req.query.only || null)
        
        if (![2, 3, null].includes(on)) return res.status(404).send('user role not found.')
        const only = `role ${!on ? ' != 1' : on === 2 ? ' = 2' : ' = 3'}`

        // do query
        await connection.databaseQueryWithErrorHandle(res, async () => {
            const getFirstData = `SELECT * FROM users 
                                WHERE ${only}
                                ORDER BY id DESC LIMIT ?`
            const result = await connection.databaseQuery(getFirstData, parseInt(req.query.limit))

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    paginationGetNextUsers : async (req, res) => {
        console.log(req.query)

        // get and define execption
        const id = parseInt(req.query.id)
        const limit = parseInt(req.query.limit)

        const on = parseInt(req.query.only || null)
        if (![2, 3, null].includes(on)) return res.status(404).send('user role not found.')
        const only = `role ${!on ? ' != 1' : on === 2 ? ' = 2' : ' = 3'}`

        // do query
        await connection.databaseQueryWithErrorHandle(res, async () => {
            const getNextData = `SELECT * FROM users 
                                WHERE ${only} AND id < ?
                                ORDER BY id DESC LIMIT ?`
            const result = await connection.databaseQuery(getNextData, [id, limit])

            // send feeback to client-side
            res.status(200).send(result)
        })
    },
    paginationGetPreviousUsers : async (req, res) => {
        console.log(req.query)

        // get and define execption
        const id = parseInt(req.query.id)
        const limit = parseInt(req.query.limit)

        const on = parseInt(req.query.only || null)
        if (![2, 3, null].includes(on)) return res.status(404).send('user role not found.')
        const only = `role ${!on ? ' != 1' : on === 2 ? ' = 2' : ' = 3'}`

        // do query
        await connection.databaseQueryWithErrorHandle(res, async () => {
            const getPrevData = `SELECT * FROM users
                                WHERE ${only} AND id > ?
                                ORDER BY id ASC LIMIT ?`
            const result = await connection.databaseQuery(getPrevData, [id, limit])

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    // get user profile
    paginationGetUserProfile : async (req, res) => {
        console.log(req.query)
        
        // define exception
        const on = parseInt(req.query.only || null)
        if (![2, 3, null].includes(on)) return res.status(404).send('user role not found.')
        const only = `role ${!on ? ' != 1' : on === 2 ? ' = 2' : ' = 3'}`
        
        // do query
        await connection.databaseQueryWithErrorHandle(res, async () => {
            const getProfileData = `SELECT pf.id, us.username, pf.name, 
                                    pf.image, pf.birthdate, pf.phone, pf.address 
                                    FROM users us
                                    JOIN profiles pf ON us.id = pf.id
                                    WHERE ${only}
                                    ORDER BY pf.id DESC LIMIT ?`
            const result = await connection.databaseQuery(getProfileData, parseInt(req.query.limit))

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    paginationGetUserProfileNext : async (req, res) => {
        console.log(req.query)

        // get and define execption
        const id = parseInt(req.query.id)
        const limit = parseInt(req.query.limit)

        const on = parseInt(req.query.only || null)
        if (![2, 3, null].includes(on)) return res.status(404).send('user role not found.')
        const only = `role ${!on ? ' != 1' : on === 2 ? ' = 2' : ' = 3'}`

        // do query
        await connection.databaseQueryWithErrorHandle(res, async () => {
            const getNextProfileData = `SELECT pf.id, us.username, pf.name, 
                                    pf.image, pf.birthdate, pf.phone, pf.address 
                                    FROM users us
                                    JOIN profiles pf ON us.id = pf.id
                                    WHERE ${only} AND id < ?
                                    ORDER BY pf.id DESC LIMIT ?`
            const result = await connection.databaseQuery(getNextProfileData, [id, limit])

            // send feeback to client-side
            res.status(200).send(result)
        })
    },
    paginationGetUserProfilePrev : async (req, res) => {
        console.log(req.query)

        // get and define execption
        const id = parseInt(req.query.id)
        const limit = parseInt(req.query.limit)

        const on = parseInt(req.query.only || null)
        if (![2, 3, null].includes(on)) return res.status(404).send('user role not found.')
        const only = `role ${!on ? ' != 1' : on === 2 ? ' = 2' : ' = 3'}`

        // do query
        await connection.databaseQueryWithErrorHandle(res, async () => {
            const getPrevProfileData = `SELECT pf.id, us.username, pf.name, 
                                    pf.image, pf.birthdate, pf.phone, pf.address 
                                    FROM users us
                                    JOIN profiles pf ON us.id = pf.id
                                    WHERE ${only} AND id > ?
                                    ORDER BY pf.id ASC LIMIT ?`
            const result = await connection.databaseQuery(getPrevProfileData, [id, limit])

            // send feeback to client-side
            res.status(200).send(result)
        })
    },

}

/* NOTE : all superadmin features need authentication and authorization
superadmin features : access all users data and activity plus change user role
'only' paramater is used to define what user role want in request
 - none : get all data including admin
 - 2 : gett admin data only, 
 - 3 : get user data only */