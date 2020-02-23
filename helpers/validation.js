// import module to validate user input
const Joi = require('joi')

// create user model validation
module.exports = {
    validateRegister : (data) => {
        const schema = {
            username : Joi.string().min(6).required(),
            email : Joi.string().min(6).required().email(),
            password : Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required()
        }
        return Joi.validate(data, schema)
    },
    validateLogin : (data) => {
        const schema = {
            username : Joi.string().min(6).required(),
            password : Joi.string().min(6).required()
        }
        return Joi.validate(data, schema)
    },
    validateUsername : (data) => {
        const schema = {
            username : Joi.string().min(6).required()
        }
        return Joi.validate(data, schema)
    },
    validatePassword : (data) => {
        const schema = {
            newPassword : Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
        }
        return Joi.validate(data, schema)
    }
}