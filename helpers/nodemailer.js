// import module
const nodemailer = require('nodemailer')

// setup nodemailer
const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : 'ali.muksin0510@gmail.com',
        pass : process.env.EMAIL_TOKEN
    },
    tls : {
        rejectUnauthorized : false // to run in localhost
    } 
})

module.exports = transporter