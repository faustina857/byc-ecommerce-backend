const Joi = require('joi')
const mongoose = require('mongoose')
const config = require("config")
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    password:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

userSchema.methods.generateAuthToken = function() {
const token = jwt.sign(
    { _id: this._id, name: this.name, email:this.email, isAdmin: this.isAdmin 
 },
     config.get('jwtPrivateKey'),
    { expiresIn: '7d' }
    );
return token;
}

const User = mongoose.model("User", userSchema)

function validateUser(user){
    const schema = Joi.object({
        name:Joi.string().min(3).max(50).required(),
        email:Joi.string().email().min(5).max(255).required(),
        password:Joi.string().min(5).max(1024).required()
    })
    return schema.validate(user)
}

function validateLogin(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(req);
}
exports.User = User
exports.validate = validateUser
exports.validateLogin = validateLogin