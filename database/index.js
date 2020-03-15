// setup database
const mysql = require('mysql')

// create connection
const database = mysql.createConnection({
    host : process.env.HOST_IP,
    user : process.env.NAME,
    password : process.env.PASS,
    database : "db_parking_app",
    port : 3306
})

// export our database
module.exports = database