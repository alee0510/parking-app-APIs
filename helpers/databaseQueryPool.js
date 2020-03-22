class Pool {
    databaseQuery = (connection, query, escape = []) => {
        return new Promise ((resolve, reject) => {
            connection.query(query, escape, (err, result) => {
                // if there an any erorr during query process send error code and message
                if (err) {
                    reject({ code : 500, msg : err.sqlMessage })
                } else {
                    resolve(result)
                }
            })
        })
    }
    databaseQueryTransaction = (con, res, callback) => {
        con.getConnection((err, connection) => {
            if(err) {
                connection.rollback()
                connection.release()
            }
            connection.beginTransaction( async err => {
                try {
                    await callback(connection)
                    await connection.commit()
                } catch (err) {
                    console.log(err)
                    await connection.rollback()
                    res.status(err.code||500).send(err.msg)
                } finally {
                    await connection.release()
                }
            })
        })
    }
}

module.exports = () => new Pool()