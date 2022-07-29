const { Schema, model } = require('mongoose');

let newUser = new Schema({
    name:{type:String, required:true},
    sure:{type:String, required:true},
    email:{type:String, required:true},
    pass:{type:String, required:true},
    regTime:{type:Date, default:Date.now}
});

module.exports = model('User', newUser);