const express = require('express');
const cors = require('cors');
require('dotenv').config();  // Load environment variables
const { connectDB } = require('./config/db');  // Import the connectDB function
const userRoutes = require('./routes/user');
const supplierRoutes = require('./routes/supplierRoutes')
const stockRoutes = require('./routes/stockRoutes');
const existingRoutes = require('./routes/existingRoutes');
const sectionRoutes = require('./routes/sectionRoutes');
const productRoutes = require('./routes/productRoutes');
const newProductRoutes = require('./routes/newStockRoutes');
const returnStockRoutes = require('./routes/returnStockRoutes');
const notificationRoutes = require('./routes/notificationRoutes')

// Initialize the app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/user', userRoutes);
app.use('/suppliers', supplierRoutes);
app.use('/stocks', stockRoutes);
app.use('/existings', existingRoutes);
app.use('/section', sectionRoutes);
app.use('/product', productRoutes);
app.use('/newStock', newProductRoutes);
app.use('/return-stock', returnStockRoutes);
app.use('/notification', notificationRoutes);

// Connect to MongoDB
connectDB();

// Define the port with a fallback
const port = process.env.PORT || 3000;

app.use((error, req, res, next) => {
    const message = error.message || 'Server error';
    const statusCode = error.statusCode || 500
    res.status(statusCode).json({message: message})
})

// Start the server
app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
