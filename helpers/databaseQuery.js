// create class
class Connection {
    constructor(database) {
        this.database = database
    }
    // create promisfy our query
    databaseQuery = (query, escape = []) => {
        return new Promise ((resolve, reject) => {
            this.database.query(query, escape, (err, result) => {
                // if there an any erorr during query process send error code and message
                if (err) {
                    reject({ code : 500, msg : err.sqlMessage })
                } else {
                    resolve(result)
                }
            })
        })
    }
    // create error handle for databaseQuery()
    databaseQueryWithErrorHandle = async (res, callback) => {
        try {
            await callback()
        } catch (err) {
            res.status(err.code).send(err.msg)
        }
    }
    // create promisfy using begin transaction
    databaseQueryTransaction = async (res, callback) => {
        try {
            await this.database.beginTransaction( async (err) => {
                if (err) throw err
                // error handling for our custom function
                try {
                    await callback()
                } catch (err) {
                    await this.database.rollback() 
                    res.status(err.code).send(err.msg) 
                }
                await this.database.commit()
            })
        } catch (err) {
            await this.database.rollback() 
        }
    }
    // create query that include file with error handle

}

module.exports = (database) => new Connection (database)