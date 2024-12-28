const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
    itemName: {
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
    totalStock: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('Stock', StockSchema);
