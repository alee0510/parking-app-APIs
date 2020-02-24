// import module
// const bycript = require('bcryptjs')
// const validation = require('../helpers/validation')
// const jwt = require('../helpers/jwt')

// setup connection
const database = require('../database')
const connection = require('../helpers/databaseQuery')(database)

// export controllers
module.exports = {
    // get all admins data
    getAdmins : async (req, res) => {
        await connection.databaseQueryWithErrorHandle(res, async () => {
            // do authorization
            if(req.user.role !== 'superadmin') throw ({code : 401, msg : 'access denied.'})
            
            // do query
            const query = 'SELECT * FROM users WHERE role = ?'
            const result = await connection.databaseQuery(query, 'admins')

            // send result to client-side
            res.status(200).send(result)
        })
    },
    // get all users data
    getUsers : async (req, res) => {
        await connection.databaseQueryWithErrorHandle(res, async () => {
            // do authorization
            const role = ['admin', 'superadmin']
            if (!role.includes(req.user.role)) throw ({code : 401, msg : 'access denied.'})

            // do query
            const query = 'SELECT * FROM users WHERE role = ?'
            const result = await connection.databaseQuery(query, 'user')

            // send result to client-side
            res.status(200).send(result)
        })
    },
    // get roles
    getRoles : async (req, res) => {
        await connection.databaseQueryWithErrorHandle(res, async () => {
            // do authorization
            if(req.user.role !== 'superadmin') throw ({code : 401, msg : 'access denied.'})

            // do query
            const query = 'SELECT * FROM roles'
            const result = await connection.databaseQuery(query)

            // send feedback to client-side
            res.status(200).send(result)
        })
    },
    // superadmin : edit role
    editRole : async (req, res) => {
        const id = parseInt(req.params.id)
        await connection.databaseQueryWithErrorHandle(res, async () => {
            // do authorization
            if (req.user.role !== 'superadmin') throw ({code : 401, msg : 'action restricted.'})

            // do edit query
            const edit = 'UPDATE users SET ? WHERE id = ?'
            await connection.databaseQuery(edit, [req.body, id])

            // send feedback to client-side
            res.status(200).send('role has been changed.')
        })
    },
    // superadmin : delete admin (single or multiple)
    singleDelete : async (req, res) => {
        const id = parseInt(req.params.id)
        await connection.databaseQueryWithErrorHandle(res, async () => {
            // do authorization
            if (req.user.role !== 'superadmin') throw ({code : 401, msg : 'action restricted.'})
            
            // do delete query
            const query = 'DELETE FROM users WHERE id = ?'
            await connection.databaseQuery(query, id)
            
            // send feedback to client-side
            res.status(200).send('user had been deleted.')
        })
    },
    // multiple delete : input arry of id
    multipleDelete : async (req, res) => {
        await connection.databaseQueryWithErrorHandle(res, async () => {
            // do authorization
            if (req.user.role !== 'superadmin') throw ({code : 401, msg : 'action restricted.'})

            // do query
            const query = `DELETE FROM users WEHERE id IN (${[...req.body.id]})`
            await connection.databaseQuery(query)
            
            // send feedback to client-side
            res.status(200).send('users had been deleted.')
        })
    },

}