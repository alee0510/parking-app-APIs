// setup connection
const database = require('../database')
const connection = require('../helpers/databaseQuery')(database)

// export controllers
module.exports = {
    /* 
    pagination implementation --> reverse : get the last registered user
    get all users account 
    endpoint : /admin/get/users/query => next, prev, limit
    */
    getUserAccount : (req, res) => {
        // check query
        const limit = parseInt(req.query.limit) || null
        const role = parseInt(req.query.role) || null
        const next  = parseInt(req.query.next) || null // last id
        const prev = parseInt(req.query.prev) || null // first id

        // define query
        const queryLimit = limit ? `LIMIT ${limit}` : ''
        const queryRole = role && role !== 1 ? `role = ${role}` : `role != 1`
        const queryNext =  next ? `AND id < ${next}` : ''
        const queryPrev = prev ? `AND id > ${prev}` : ''
        const order = prev ? 'ASC' : 'DESC'

        // do query
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT * FROM users
                        WHERE ${queryRole} ${queryNext}${queryPrev}
                        ORDER BY id ${order} ${queryLimit}`

            // console.log(query)
            const result = await connection.databaseQuery(query)

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    getUserProfile : (req, res) => {
        // check query
        const limit = parseInt(req.query.limit) || null
        const role = parseInt(req.query.role) || null
        const next  = parseInt(req.query.next) || null // last id
        const prev = parseInt(req.query.prev) || null // first id

        // define query
        const queryLimit = limit ? `LIMIT ${limit}` : ''
        const queryRole = role && role !== 1 ? `us.role = ${role}` : `us.role != 1`
        const queryNext =  next ? `AND pf.id < ${next}` : ''
        const queryPrev = prev ? `AND pf.id > ${prev}` : ''
        const order = prev ? 'ASC' : 'DESC'

        // do query
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT pf.id, us.username, pf.name, pf.image, pf.birthdate, pf.phone, pf.address 
                        FROM users us
                        JOIN profiles pf ON us.id = pf.id
                        WHERE ${queryRole} ${queryNext}${queryPrev}
                        ORDER BY pf.id ${order} ${queryLimit}`
            // console.log(query)
            const result = await connection.databaseQuery(query)
            
            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    // superadmin feature : manage user's role
    getUserRole : (req, res) => {
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'SELECT * FROM roles'
            const result = await connection.databaseQuery(query)

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    editUserRole : (req, res) => {
        // do query
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'UPDATE users SET ? WHERE id = ?'
            await connection.databaseQuery(query, [req.body, parseInt(req.params.id)])

            // send feedback to client-side
            res.status(200).send('role has been edited.')
        })
    },
    // superadmin feature : manage user account
    deleteUserAccount : (req, res) => {
        // do query
        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = 'DELETE FROM users WHERE id = ?'
            await connection.databaseQuery(query, parseInt(req.params.id))

            // send feedback to client-side
            res.status(200).send('user has been deleted.')
        })
    },
    // get total user in database
    getTotalUserAccount : (req, res) => {
        // define exception
        const role = parseInt(req.query.role) || null
        const queryRole = role ? `WHERE role = ${role}` : ''

        connection.databaseQueryWithErrorHandle(res, async () => {
            const query = `SELECT COUNT(*) AS total FROM users USE INDEX(PRIMARY) ${queryRole} `
            const result = await connection.databaseQuery(query)

            // send feedback to client-side
            const total = result[0]['total']
            res.status(200).send([total])
        })
    }

}

/* NOTE : all superadmin features need authentication and authorization
superadmin features : access all users data and activity plus change user role
'role' paramater is used to define what user role want in request
 - none : get all data including admin
 - 2 : gett admin data role, 
 - 3 : get user data role */

// NOTE : for test purpose : authorization or authentication is temporray disabled