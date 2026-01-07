const Joi = require('joi')
const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'product',
        required: true
    },
    name: String,
    color: String,
    size: String,
    price: Number,
    quantity:{
        type: Number,
        required: true,
        min: 1
    },
    subtotal: Number
})

const cartSchema = new mongoose.Schema({
    customerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    customerSnapshot:{
        name: String,
        email: String
    },
    items:[cartItemSchema],
    totalAmount:{
        type: Number,
        required: true,
        default: 0
    },
    status:{
        type: String,
        enum: ["active","checked_out","abandoned"],
        default: "active"
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    }
})

cartSchema.pre("save",function(next){
    this.totalAmount = this.items.reduce((acc,item) => acc + (item.price * item.quantity), 0);
    next()
})

const Cart = mongoose.model("Cart", cartSchema)

function validateCart(cart) {
    const schema = Joi.object({
        customerId: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(), // must be a valid ObjectId

        customerSnapshot: Joi.object().keys({
            name: Joi.string().min(2).max(100).required(),
            email: Joi.string().email().required(),
        }).required(),

        items: Joi.array().items(
            Joi.object().keys({
                productId: Joi.string()
                    .regex(/^[0-9a-fA-F]{24}$/)
                    .required(),

                name: Joi.string().required(),
                color: Joi.string(),
                size: Joi.string(),

                price: Joi.number().min(0).required(),
                quantity: Joi.number().integer().min(1).required(),
                subtotal: Joi.number().min(0),
            })
        ).min(1).required(),

        totalAmount: Joi.number().min(0),

        status: Joi.string()
            .valid("active", "checked_out", "abandoned")
            .default("active"),

        createdAt: Joi.date(),
        updatedAt: Joi.date(),
    });

    return schema.validate(cart);
}

exports.Cart = Cart
exports.validate = validateCart
 