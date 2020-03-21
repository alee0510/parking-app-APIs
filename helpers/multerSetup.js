// import module
const multer = require('multer')
const path = require('path')
const fileSystem = require('fs')

// setup multer
const _this = module.exports = {
    // create uploader
    upload : (folder) => {
        // storage setup
        const storage = multer.diskStorage({
            destination : folder,
            filename : (req, file, callback) => {
                callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
            }
        })
        return multer({
            storage : storage,
            limits : { fileSize : 5000000}, // limit size 1Mb
            fileFilter : (req, file, callback) => {
                _this.checkFileTypes(file, callback)
            }
        })
    },
    // check file type
    checkFileTypes : (file, callback) => {
        // allowed file type
        const type = /jpeg|jpg|png|svg|gif/

        // validate file type
        const vaidType = type.test(path.extname(file.originalname).toLowerCase())

        // validate mimetype
        const validMimeType = type.test(file.mimetype)

        // validate all
        if (vaidType && validMimeType) return callback(null, true)
        return callback(new Error('Error : image only.'), false)
    },
    // optional : clean folder (...path) and delete file inside it
    cleanFolder : (folder) => {
        // read all files inside folder path
        let files = fileSystem.readFileSync(folder)
        
        // delete all files inside it
        files.map(file => fileSystem.unlinkSync(path.join(folder, file)))
        
        // send feedback to console
        console.log(folder + ' folder is cleaned.')
    },
    deleteFolder : (folder) => {
        fileSystem.rmdirSync(folder)
        // send feedback to console
        console.log(folder + ' folder has been deleted.')
    }
}