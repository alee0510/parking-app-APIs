// import module to validate user input
const Joi = require('@hapi/joi')

// create user model validation
module.exports = {
    registerInputValidation : data => {
        const Schema = Joi.object({
            username : Joi.string()
                    .alphanum()
                    .min(6)
                    .max(30)
                    .required(),
            email : Joi.string()
                    .email({minDomainSegments : 2, tlds : {allow : ['net', 'com']}}),
            password : Joi.string()
                    .min(6)
                    .max(30)
                    .pattern(new RegExp('[a-zA-Z0-9][!@#$%^&*;]'))
                    .message({"string.pattern.base" : "password must include number and special character"})  
        })
        return Schema.validate(data)
    }
}