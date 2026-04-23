const {Category, validate } = require('../models/category')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

router.get('/get-all-categories', async(req, res) =>{
  try {
    const categories = await Category.find();
    res.send(categories);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
})

router.post('/add-new-category', [auth, admin] , async(req, res) =>{
    const {error} = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    try{
        let category = new Category({name: req.body.name})
        category = await category.save();

        res.json({
            status: "success",
            message: "category created successfully"
        })
    } catch (err) {
        res.status(500).json({ message: 'Failed to create category' });
    }    
})

router.put('/update-category/:id', [auth, admin] , async (req, res) =>{
    const {error} = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    try {
        const category = await Category.findByIdAndUpdate(req.params.id,{name:req.body.name},
            {new:true}
        )
        if (!category) return res.status(404).send('the category with the given id not found')
                res.json({
              status:'success',
              message:'category updated successful'
        })
    } catch (err) {
        res.status(500).json({ message: 'Failed to update category' });
    }
})

router.delete('/delete-category/:id', [auth, admin] , async (req, res) =>{
    try {
        const category = await Category.findByIdAndDelete(req.params.id)
        if (!category) return res.status(404).send('the category with the given id not found')
         res.json({
                  status:'success',
                  message:'category deleted successfully'
            })   
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete category' });
    }
})
router.get('/get-single-category/:id', async (req,res) =>{
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).send('the category with the given id not found');
        res.send(category);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch category' });
    }
});




module.exports = router;