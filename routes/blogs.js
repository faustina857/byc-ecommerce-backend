const {Blog, validate} = require('../models/blog')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

router.get('/get-all-blogs', async(req,res) =>{
  try {
    const blogs = await Blog.find();
    res.send(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
})

router.post('/add-new-blog', [auth, admin], async(req,res) =>{
    const {error} = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    try {
      let blog = new Blog({
        blogImage: req.body.blogImage,
        blogDescription: req.body.blogDescription,
        blogTitle: req.body.blogTitle,
        blogContent: req.body.blogContent,
        ownerName: req.body.ownerName,
        ownerImage: req.body.ownerImage,
        ownerProfession: req.body.ownerProfession
        });
        blog = await blog.save();
        res.json({ status: 'successful', message: 'new blog created' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create blog' });
    }
})

router.put('/update-blog/:id', [auth, admin], async(req,res) =>{
    const {error} = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    try {
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
    } catch (err) {
        res.status(500).json({ message: 'Failed to update blog' });
    }
})

router.get('/get-single-blog/:id', async(req,res)=>{
    try {
        const blog = await Blog.findById(req.params.id)
        if(!blog) return res.status(404).send('blog with id not found')
        res.send(blog)
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch blog' });
    }
})

router.delete('/delete-blog/:id', [auth, admin], async(req, res) =>{
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id)
        if (!blog) return res.status(404).send('blog not found')
        res.json({
        status:"successful",
        message:"blog deleted"})
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete blog' });
    }
})

module.exports = router