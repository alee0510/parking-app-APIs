// import nexmo methods
const { verify, check } = require('../helpers/nexmo')

// export our controllers
module.exports = {
    requestOTP : async (req, res) => {
        const phone = req.body.phone
        try {
            // send otp request
            const result = await verify(phone)
            console.log(result)
    
            // get request id
            const reqId = result.request_id
    
            // send feedback to client-side
            res.status(200).send({ request_id : reqId })
        } catch (err) {
            console.log(err)
        }
    },
    checkOTP : async (req, res) => {
        // get request_id and pin code
        const reqId = req.body.reqId
        const pin = req.body.pin
        try {
            // check OTP
            const result = await check(reqId, pin)
            console.log(result)
            const status = result.status

            // send feedback to client-side
            res.status(200).send({ status : status })
        } catch (err) {
            console.log(err)
        }
    }
}