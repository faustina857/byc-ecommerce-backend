const {Cart, validate} = require('../models/cart')
const express = require('express')
const router = express.Router()
const {Customer} = require('../models/customer')
const {Product} = require('../models/product')

router.post("/", async (req, res) => {
  try {
    const { error, value } = validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { customerId, items } = value;

    
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

   
    const customerSnapshot = {
        name: customer.fullName,
        email: customer.emailAddress,
    };

    
    let cartItems = [];
    for (let p of items) {
      const product = await Product.findById(p.productId);
      if (!product) continue;
      cartItems.push({
        productId: product._id,
        name: product.name,
        color: p.color,
        size: p.size,
        price: p.price,
        quantity: p.quantity,
        subtotal: p.price * p.quantity, // match schema
      });
    }


    if (cartItems.length === 0) {
      return res.status(400).json({ message: "No valid products in cart" });
    }

    
    const cart = new Cart({
      customerId,
      customerSnapshot,
      items: cartItems,
    });

    await cart.save();
    res.status(201).json({
      message: "Cart created successfully",
      cart,
    });
  } catch (error) {
    console.error("Error creating cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router