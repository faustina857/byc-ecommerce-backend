const Joi = require('joi')
const mongoose = require('mongoose')
const {categorySchema} = require('./category')

const productSchema = new mongoose.Schema({
    productName:{
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 50
    },
    productTitle:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    productNumber:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    productImage:{
        type: [String],
        required: true
    },
    productPrice:{
        type: Number,
        required: true
    },
    productRating:{
        type: [String],
        default: ["0"]
    },
    numberInStock:{
        type: Number,
        required: true,
        min: 1,
        max: 200
    },
    category:{
        type: categorySchema,
        required: true
    }
})

const Product = mongoose.model("Product", productSchema)

function validateProduct(product){
    const schema = Joi.object({
        productName: Joi.string().min(5).max(50).trim().required(),
        productTitle: Joi.string().min(5).max(100).required(),
        productNumber: Joi.string().min(5).max(50).required(),
        productImage: Joi.array().items(Joi.string()).required(),
        productPrice: Joi.number().required(),
        productRating: Joi.array().items(Joi.string()).default(["0"]),
        numberInStock: Joi.number().min(1).max(200).required(),
        categoryId: Joi.required()
    })
    return schema.validate(product)
}

exports.Product = Product
exports.validate = validateProduct