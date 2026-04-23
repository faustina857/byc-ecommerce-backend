const {Customer, validate} = require('../models/customer')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

router.get('/get-all-customers', async (req, res) => {
  try {
    const customers = await Customer.find().sort('fullName');
    res.send(customers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch customers' });
  }
});

router.post('/add-new-customer', async (req, res) => {
  // Joi validation first
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // Check if customer already exists by email
    const existingCustomer = await Customer.findOne({ emailAddress: req.body.emailAddress });
    if (existingCustomer) {
      return res.status(400).json({
        status: "error",
        message: "Email already registered",
      });
    }

    // Create new customer object
    let customer = new Customer({
      fullName: req.body.fullName,
      companyName: req.body.companyName || undefined, // optional
      country: req.body.country,
      city: req.body.city,
      state: req.body.state,
      address: req.body.address,
      phone: req.body.phone,
      emailAddress: req.body.emailAddress,
      landMark: req.body.landMark,
    });

    customer = await customer.save();

    res.json({
      status: "success",
      message: "Customer created successfully",
      customerId: customer._id,
    });
  } catch (err) {
    console.error("Customer snapshot error:", err.message);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

router.put('/update-customer/:id', async (req, res) =>{
    const {error} = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    try {
      const customer = await Customer.findByIdAndUpdate(req.params.id,
        {
          fullName: req.body.fullName,
          country: req.body.country,
          city: req.body.city,
          state: req.body.state,
          address: req.body.address,
          phone: req.body.phone,
          landMark: req.body.landMark,
          companyName: req.body.companyName
        },
          {new:true}
      )
    
        if (!customer) return res.status(404).send('the customer with the given id not found')
            res.json({
              status:'success',
              message:'customer updated successful'
        })
    } catch (err) {
    res.status(500).json({ message: 'Failed to update customer' });
    }
})

router.delete('/delete-customer/:id',[auth, admin], async (req, res) =>{
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id)
    if (!customer) return res.status(404).send('the customer with the given id not found')
     res.json({
              status:'success',
              message:'customer deleted successfully'
        })   
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete customer' });
  }
})
router.get('/get-single-customer/:id', async (req,res) =>{
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send('the customer with the given id not found');
    res.send(customer);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch customer' });
  }
})

// Upsert: create customer if email doesn't exist, update if fields changed
router.post('/upsert-customer', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
 
  try {
    const {
      fullName, companyName, country, city,
      state, address, phone, emailAddress, landMark
    } = req.body;
 
    const updateFields = {
      fullName,
      country,
      city,
      state,
      address,
      phone,
      landMark,
      ...(companyName ? { companyName } : {})
    };
 
    // findOneAndUpdate with upsert:
    // - finds by email (unique identifier)
    // - updates all other fields if record exists
    // - creates new record if email not found
    // - returns the final document either way
    const customer = await Customer.findOneAndUpdate(
      { emailAddress },
      { $set: updateFields },
      { new: true, upsert: true, runValidators: true }
    );
 
    res.json({
      status: 'success',
      customerId: customer._id.toString(),
      isNew: !customer.createdAt || (Date.now() - customer.createdAt < 2000)
    });
 
  } catch (err) {
    console.error('Upsert customer error:', err.message);
    res.status(500).json({ status: 'error', message: 'Failed to save customer info' });
  }
});

module.exports = router;