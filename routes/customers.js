const {Customer, validate} = require('../models/customer')
const express = require('express')
const router = express.Router()

router.get('/get-all-customers', async (req, res) =>{
    const customer = await Customer.find().sort('firstName');
    res.send(customer)
})

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

    const customer = await Customer.findByIdAndUpdate(req.params.id,
        {
          firstName:req.body.firstName,
          middleName:req.body.middleName,
          lastName:req.body.lastName,
          phone:req.body.phone,
          isGold:req.body.isGold
        },
        {new:true}
    )
    
        if (!customer) return res.status(404).send('the customer with the given id not found')
            res.json({
              status:'success',
              message:'customer updated successful'
        })

})

router.delete('/delete-customer/:id', async (req, res) =>{
    const customer = await Customer.findByIdAndDelete(req.params.id)
    if (!customer) return res.status(404).send('the customer with the given id not found')
     res.json({
              status:'success',
              message:'customer deleted successfully'
        })   
})
router.get('/get-single-customer/:id', async (req,res) =>{
    const customer = await Customer.findById(req.params.id)
    if (!customer) return res.status(404).send('the customer with the given id not found')
        res.send(customer)
})

module.exports = router;