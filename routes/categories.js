const {Category, validate } = require('../models/category')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

router.get('/get-all-categories', async(req, res) =>{
    const category = await Category.find();
    res.send (category)
})

router.post('/add-new-category', [auth, admin] , async(req, res) =>{
    const {error} = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

        let category = new Category({
            name: req.body.name
        })

        category = await category.save();

        res.json({
            status: "success",
            message: "category created successfully"
        })
        
})

router.put('/update-category/:id', [auth, admin] , async (req, res) =>{
    const {error} = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const category = await Category.findByIdAndUpdate(req.params.id,{name:req.body.name},
        {new:true}
    )
    if (!category) return res.status(404).send('the category with the given id not found')
            res.json({
              status:'success',
              message:'category updated successful'
        })

})

router.delete('/delete-category/:id', [auth, admin] , async (req, res) =>{
    const category = await Category.findByIdAndDelete(req.params.id)
    if (!category) return res.status(404).send('the category with the given id not found')
     res.json({
              status:'success',
              message:'category deleted successfully'
        })   
})
router.get('/get-single-category/:id', async (req,res) =>{
    const category = await Category.findById(req.params.id)
    if (!category) return res.status(404).send('the category with the given id not found')
        res.send(category)
})




module.exports = router;