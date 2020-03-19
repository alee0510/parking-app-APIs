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
            password : Joi.string()
                    .min(6)
                    .max(30)
                    .pattern(new RegExp('[a-zA-Z0-9][!@#$%^&*;]')),
            email : Joi.string()
                    .email({minDomainSegments : 2, tlds : {allow : ['net', 'com']}})
        })
        return Schema.validate(data)
    }
}