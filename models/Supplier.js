const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
    supplierName: {
        type: String,
        required: true
    },
    supplierAddress: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gst: {
        type: String,
        required: true
    },
    contactDetails: {
        type: String,
        required: true
    },
    items: [
        {
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
        }
    ]
});

// Method to calculate total price of all items in a supplier
SupplierSchema.methods.calculateTotalPrice = function() {
    return this.items.reduce((sum, item) => sum + item.totalPrice, 0);
};

module.exports = mongoose.model('Supplier', SupplierSchema);
