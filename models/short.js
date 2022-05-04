const mongoose = require('mongoose');
const shortid = require('shortid')

const shortSchema = new mongoose.Schema({
    url:{
        type:String,
        required:true
    },
    short:{
        type:String,
        required:true,
        default:shortid.generate
    },
    clicks:{
        type:Number,
        required:true,
        default: 0
    },
    session:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('urls', shortSchema)