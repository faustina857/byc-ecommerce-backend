const express = require('express')
const app = express()
const mongoose = require('mongoose')
const category = require('./routes/categories')
const product = require('./routes/products')
const blog = require('./routes/blogs')
const customer = require('./routes/customers')
const cart = require('./routes/carts')
const order = require('./routes/orders')
const user = require('./routes/users')
const auth = require('./routes/auth')
const config = require('config')
const cors = require('cors');
require('dotenv').config()

if (!config.get('jwtPrivateKey')) {
console.error('FATAL ERROR: jwtPrivateKey is not defined.');
process.exit(1);
}

console.log('paystack secretekey:', !!process.env.PAYSTACK_SECRET_KEY)

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error("Mongo error:", err));


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://byc-admin-three.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,      // allow cookies/auth headers
    optionsSuccessStatus: 200 // for preflight
  })
);


app.get("/", (req, res) => {
  res.send("BYC Backend is running 🚀");
});

app.use(express.json())
app.use('/api/byc-stores/category', category)
app.use('/api/byc-stores/product', product)
app.use('/api/byc-stores/blog', blog)
app.use('/api/byc-stores/customer', customer)
app.use('/api/byc-stores/cart', cart)
app.use('/api/byc-stores/order', order )
app.use('/api/byc-stores/user/register', user )
app.use('/api/byc-stores/auth/login', auth )

const port = process.env.PORT || 3001

app.listen(port, console.log(`listening on port ${port}...`))