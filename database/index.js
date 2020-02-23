// setup database
const mysql = require('mysql')

// create connection
const database = mysql.createConnection({
    host : "localhost",
    user : "alee",
    password : process.env.PASS,
    database : "db_parking_app",
    port : 3306
})

// export our database
module.exports = database