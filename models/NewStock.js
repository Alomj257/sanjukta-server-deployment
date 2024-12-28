const mongoose = require('mongoose');

const NewStockSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true 
    },
    unit: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('NewStock', NewStockSchema);
