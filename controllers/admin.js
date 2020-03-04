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
        const on = req.query.only === 'null' ? null : parseInt(req.query.only)
        console.log(on)
        
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

        const on = req.query.only === 'null' ? null : parseInt(req.query.only)
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

        const on = req.query.only === 'null' ? null : parseInt(req.query.only)
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
        const on = req.query.only === 'null' ? null : parseInt(req.query.only)
        if (![2, 3, null].includes(on)) return res.status(404).send('user role not found.')
        const only = `us.role ${!on ? ' != 1' : on === 2 ? ' = 2' : ' = 3'}`
        
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

        const on = req.query.only === 'null' ? null : parseInt(req.query.only)
        if (![2, 3, null].includes(on)) return res.status(404).send('user role not found.')
        const only = `us.role ${!on ? ' != 1' : on === 2 ? ' = 2' : ' = 3'}`

        // do query
        await connection.databaseQueryWithErrorHandle(res, async () => {
            const getNextProfileData = `SELECT pf.id, us.username, pf.name, 
                                    pf.image, pf.birthdate, pf.phone, pf.address 
                                    FROM users us
                                    JOIN profiles pf ON us.id = pf.id
                                    WHERE ${only} AND pf.id < ?
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

        const on = req.query.only === 'null' ? null : parseInt(req.query.only)
        if (![2, 3, null].includes(on)) return res.status(404).send('user role not found.')
        const only = `us.role ${!on ? ' != 1' : on === 2 ? ' = 2' : ' = 3'}`

        // do query
        await connection.databaseQueryWithErrorHandle(res, async () => {
            const getPrevProfileData = `SELECT pf.id, us.username, pf.name, 
                                    pf.image, pf.birthdate, pf.phone, pf.address 
                                    FROM users us
                                    JOIN profiles pf ON us.id = pf.id
                                    WHERE ${only} AND pf.id > ?
                                    ORDER BY pf.id ASC LIMIT ?`
            const result = await connection.databaseQuery(getPrevProfileData, [id, limit])

            // send feeback to client-side
            res.status(200).send(result)
        })
    },
    // superadmin feature : manage user's role
    getUserRole : async (req, res) => {
        await connection.databaseQueryWithErrorHandle(res, async () => {
            const getRole = 'SELECT * FROM roles'
            const result = await connection.databaseQuery(getRole)

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    editUserRole : async (req, res) => {
        const id = parseInt(req.params.id)
        console.log('user id', id)

        // do query
        await connection.databaseQueryWithErrorHandle(res, async () => {
            const editRle = 'UPDATE users SET ? WHERE id = ?'
            await connection.databaseQuery(editRle, [req.body, id])

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    // superadmin feature : manage user account
    deletUser : async (req, res) => {
        console.log(req.query)
        const multiple = parseInt(req.query.multiple || 0) // value 0 or 1
        const id = parseInt(req.query.id)

        // do query
        await connection.databaseQueryWithErrorHandle(res, async () => {
            // define query
            let query = 'DELETE FROM users WHERE id = ?'
            if (multiple) query = `DELETE FROM users WEHERE id IN (${[...req.body.id]})`
            
            // do query
            console.log(query)
            await connection.databaseQuery(query, id || [])

            // send feedback to client-side
            res.status(200).send('user has been deleted.')
        })
    },
    // get total user in database
    getTotalUser : async (req, res) => {
        await connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'SELECT COUNT(*) AS total FROM users USE INDEX(PRIMARY)'
            const result = await connection.databaseQuery(query)

            // send feedback to client-side
            const total = result[0]['total']
            res.status(200).send([total])
        })
    }

}

/* NOTE : all superadmin features need authentication and authorization
superadmin features : access all users data and activity plus change user role
'only' paramater is used to define what user role want in request
 - none : get all data including admin
 - 2 : gett admin data only, 
 - 3 : get user data only */

// NOTE : for test purpose : authorization or authentication is temporray disabled