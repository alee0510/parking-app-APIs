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

// // date module
let date = new Date()
const today = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
console.log(today)

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

const obj = {
    hello : 'alee',
    age : '25'
}

console.log(obj)
console.log(delete obj.age)
console.log(obj)