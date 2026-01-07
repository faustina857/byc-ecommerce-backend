const Joi = require("joi")
const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    blogImage:{
        type: String,
        required: true
    },
    blogDescription:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1500
    },
    blogTitle:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    blogContent:{
        type: String,
        required: true
    },
    ownerName:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    ownerImage:{
        type: String,
        required: true
    },
    ownerProfession:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    }
})

const Blog = mongoose.model("Blog", blogSchema)

function validateBlog(blog){
    const schema = Joi.object({
        blogImage: Joi.string().required(),
        blogDescription: Joi.string().min(5).max(1500).required(),
        blogTitle: Joi.string().min(5).max(100).required(),
        blogContent: Joi.string().required(),
        ownerName: Joi.string().min(5).max(50).required(),
        ownerImage: Joi.string().required(),
        ownerProfession: Joi.string().min(3).max(50).required()
    })
    return schema.validate(blog)
}

exports.Blog = Blog
exports.validate = validateBlog