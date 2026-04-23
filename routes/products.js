const {Product, validate} = require('../models/product')
const {Category} = require('../models/category')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

router.get('/get-all-products', async(req, res) =>{
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.send(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
})

router.post('/add-new-product', [auth, admin] , async(req, res) =>{
    const {error} = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    try{
        const category = await Category.findById(req.body.categoryId)
        if (!category) return res.status(400).send('category with the given Id not found')

        let product = new Product({
            productName: req.body.productName,
            productTitle: req.body.productTitle,
            productNumber: req.body.productNumber,
            productImage: req.body.productImage,
            productPrice: req.body.productPrice,
            productRating: req.body.productRating,
            numberInStock: req.body.numberInStock,
            category:{_id: category._id, name: category.name}
        })
        product = await product.save()
        res.json({
            status: 'success',
            message: 'product added'
        })
    } catch (err) {
    res.status(500).json({ message: 'Failed to add product' });
    }
})

router.put('/update-product/:id', [auth, admin] , async(req,res) =>{
    const {error} = validate(req.body)
    if (error)  return res.status(400).send(error.details[0].message)
    try{
        const category = await Category.findById(req.body.categoryId)
        if (!category) return res.status(400).send('category with the given Id not found')
        const product = await Product.findByIdAndUpdate(req.params.id,
        {productName:req.body.productName,
            productTitle:req.body.productTitle,
            productNumber:req.body.productNumber,
            productImage:req.body.productImage,
            productPrice:req.body.productPrice,
            productRating:req.body.productRating,
            numberInStock:req.body.numberInStock,
            category:{_id: category._id, name: category.name}},
        {new: true})

        if(!product) return res.status(404).send('product not found')
        res.json({
            status: "success",
            message:"product updated successfully"
        })
    } catch (err) {
    res.status(500).json({ message: 'Failed to update product' });
    }
})

router.get('/get-single-product/:id', async(req, res) =>{
    try {
        const product = await Product.findById(req.params.id)
        if (!product) return res.status(404).send('product with the given id not found')
            res.send(product)
    } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product' });
    }
})

router.get('/get-product-by-category/:id', async(req, res) =>{
    try {
        const products = await Product.find({ "category._id": req.params.id });
        if (!products.length) return res.status(400).send('no products found for this category');
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch products by category' });
    }
})

router.delete('/delete-product/:id', [auth, admin] ,async (req, res) =>{
 try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).send('product not found');
    res.json({ status: 'success', message: 'product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product' });
  } 
})
module.exports = router
