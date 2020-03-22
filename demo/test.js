// // erorr handling test
// try {
//     for (let i = 0; i < 10; i++) {
//         console.log(i)
//         if (i == 5) throw ({code : 500, msg : 'hello'})
//     }
//     console.log('hello')
//     let arr = [1, 2, 3]
//     console.log(arr)
// } catch (err) {
//     console.log(err)
// }

// // conditional test
// const role = ['admin', 'user']
// if (role.includes('superadmin')) console.log('yes')

// // // date module
// let date = new Date()
// const today = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
// console.log(today)

// // array statements
// let arr = [1, 3, 4]
// let statement = `(${arr.map(value => value)})`
// let statements = `(${[...arr]})`
// console.log(statements)

// // test jwt token
// const dotenv = require('dotenv').config()
// const jwt = require('./helpers/jwt')
// const token = jwt.createToken({id : 1})
// console.log(token)

// const obj = {
//     hello : 'alee',
//     age : '25'
// }

// console.log(obj)
// console.log(delete obj.age)
// console.log(obj)

// test schema 
// const { registerInputValidation } = require('../helpers/validation')
// const { error } = registerInputValidation({username : 'aleaeee', password : 'eyy!0rr', email : 'alee@gmail.com'})

// console.log( error ? error.details[0].message : 'ok' )

// test duration
// let duration = 635
// let hours = Math.floor(duration/60)
// let minutes = duration - (hours*60)

// console.log(`${hours} : ${minutes}`)

// change object parameter value
const area = [
    {
        "id": 1,
        "company": "aeon ceria",
        "image": null,
        "address": "Jl. BSD Raya Utama, Pagedangan, Kec. Pagedangan",
        "city": "Tanggerang Selatan",
        "province": "Banten",
        "car_cost": 350,
        "motor_cost": 250,
        "car_slot": 150,
        "motor_slot": 210,
        "place_name": "AEON Mall BSD",
        "coordinates": "{\"latitude\": -6.302018, \"longitude\": 106.646241}"
    },
    {
        "id": 2,
        "company": "itc elektronik",
        "image": null,
        "address": "Jalan Pahlawan Seribu, Lengkong Wetan, Serpong",
        "city": "Tangerang Selatan",
        "province": "Banten",
        "car_cost": 300,
        "motor_cost": 280,
        "car_slot": 135,
        "motor_slot": 200,
        "place_name": "ITC BSD",
        "coordinates": "{\"latitude\": -6.288359, \"longitude\": 106.662625}"
    },
    {
        "id": 3,
        "company": "teras kota corp",
        "image": null,
        "address": "Jalan Pahlawan Seribu CBD Lot VII B, Lengkong Gudang, Serpong",
        "city": "Tangerang Selatan",
        "province": "Banten",
        "car_cost": 365,
        "motor_cost": 300,
        "car_slot": 115,
        "motor_slot": 195,
        "place_name": "Teras Kota Mall",
        "coordinates": "{\"latitude\": -6.298531, \"longitude\": 106.668144}"
    },
]

const data = area.map(item => {
    return { ...item, coordinates : JSON.parse(item.coordinates)}
})
// console.log(area)
console.log(data.map(({coordinates}) => coordinates.latitude))