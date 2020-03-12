const Nexmo = require('nexmo')
// setup nexmo
const nexmo = new Nexmo({
    apiKey : process.env.NEXMO_API_KEY,
    apiSecret : process.env.NEXMO_API_SECRET
})

module.exports = {
    // trigger the verification code 
    verify : async (number) => {
        return new Promise((resolve, reject) => {
            nexmo.verify.request({
                number : number,
                brand : process.env.NEXMO_BRAND_NAME
            }, (err, result) => {
                if (err) {
                    console.log(err)
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    },
    // after user receive PIN CODE via SMS, we need to check it
    check : async (reqId, code) => {
        return new Promise ((resolve, reject) => {
            nexmo.verify.check({
                request_id : reqId,
                code : code
            }, (err, result) => {
                if (err) {
                    console.log(err)
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    },
    // OPTIONAL : if user want to cancel the verification
    cancel : async (reqId) => {
        return new Promise ((resolve, reject) => {
            nexmo.verify.control({
                request_id : reqId,
                cmd : 'cancel'
            }, (err, result) => {
                if (err) {
                    console.log(err)
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }

}
