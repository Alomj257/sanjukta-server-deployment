const mongoose = require('mongoose');

const ExistingItemsSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
        lowercase: true
    },
    unit: {
        type: String,
        required: true
    },
    itemQuantity: {
        type: Number,
        required: true
    },
    pricePerItem: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true,
        default: function() {
            return this.itemQuantity * this.pricePerItem;
        }
    }
});

// Method to calculate total price for all items in ExistingItems
ExistingItemsSchema.methods.calculateTotalPrice = function() {
    return this.itemQuantity * this.pricePerItem;
};

module.exports = mongoose.model('ExistingItems', ExistingItemsSchema);
