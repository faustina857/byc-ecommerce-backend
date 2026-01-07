const Joi = require('joi')
const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    companyName:{
        type: String,
        required: false,
        trim: true, 
        validate: { 
            validator: function (v) { 
                // allow empty or undefined, otherwise enforce minlength 
                return !v || v.length >= 5; }, 
                message: "Company name must be at least 5 characters if provided", 
            },
        required: false
    },
    country: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50
    },

    city: {
        type: String,
        required: true,
        minlength:3,
        maxlength:50
    },

    state: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50
    },

    address: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },

    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 15
    },

    emailAddress: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 200
    },

    landMark: {
        type: String,
        required: true,
    }
})

const Customer = mongoose.model('Customer', customerSchema)

function validateCustomer(customer){
    const schema = Joi.object({
        fullName: Joi.string().min(5).max(100).required(),
        companyName: Joi.string().min(5).allow('').optional(),
        country: Joi.string().min(4).max(50).required(),
        city: Joi.string().min(3).max(50).required(),
        state: Joi.string().min(4).max(50).required(),
        address: Joi.string().min(5).max(100).required(),
        phone: Joi.string().min(5).max(15).required(),
        emailAddress: Joi.string().email().min(5).max(200).required(),
        landMark: Joi.string().required()
    })
    return schema.validate(customer)
}

exports.Customer = Customer
exports.validate = validateCustomer