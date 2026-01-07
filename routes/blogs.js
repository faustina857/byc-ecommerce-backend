const {Blog, validate} = require('../models/blog')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

router.get('/get-all-blogs', async(req,res) =>{
    const blog = await Blog.find();
    res.send(blog)
})

router.post('/add-new-blog', [auth, admin], async(req,res) =>{
    const {error} = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    let blog = new Blog({
        blogImage: req.body.blogImage,
        blogDescription: req.body.blogDescription,
        blogTitle: req.body.blogTitle,
        blogContent: req.body.blogContent,
        ownerName: req.body.ownerName,
        ownerImage: req.body.ownerImage,
        ownerProfession: req.body.ownerProfession

    })
    blog = await blog.save()
    res.json({
        status: 'successful',
        message: 'new blog created'
    })
})

router.put('/update-blog/:id', [auth, admin], async(req,res) =>{
    const {error} = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
        let blog = await Blog.findByIdAndUpdate(req.params.id,{
            blogImage: req.body.blogImage,
            blogDescription: req.body.blogDescription,
            blogTitle: req.body.blogTitle,
            blogContent: req.body.blogContent,
            ownerName: req.body.ownerName,
            ownerImage: req.body.ownerImage,
            ownerProfession: req.body.ownerProfession 
    },{new:true})

    if(!blog) return res.status(404).send('blog not found')
        res.json({
    status: 'successful',
    message:'blog updated'})
})

router.get('/get-single-blog/:id', async(req,res)=>{
    const blog = await Blog.findById(req.params.id)
    if(!blog) return res.status(404).send('blog with id not found')
        res.send(blog)
})

router.delete('/delete-blog/:id', [auth, admin], async(req, res) =>{
    const blog = await Blog.findByIdAndDelete(req.params.id)
    if (!blog) return res.status(404).send('blog not found')
        res.json({
        status:"successful",
        message:"blog deleted"})
})

module.exports = router