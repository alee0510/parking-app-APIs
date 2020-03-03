// import module
const jwt = require('jsonwebtoken')

module.exports = {
    // create token
    createToken : (...args) => {
        // console.log(...args)
        return jwt.sign(...args, process.env.SECRET_TOKEN)
    },
    // verify token
    verify : (req, res, next) => {
        // get token from request header
        const token = req.header('Auth-Token')
        // console.log('token', req.header('Auth-Token'))
        if (!token) return res.status(401).send('access denied.')

        try {
            // verify token
            const verified = jwt.verify(token, process.env.SECRET_TOKEN)
            
            // pass decoded data to request
            req.user = verified
            
            // execute next middleware
            next()
        } catch (err) {
            res.status(400).send('invalid token.')
        }
    }
}