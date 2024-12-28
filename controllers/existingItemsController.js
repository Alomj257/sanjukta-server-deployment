const ExistingItems = require('../models/ExistingItems');
const Stock = require('../models/Stock');

// Add ExistingItem
exports.addExistingItem = async (req, res, next) => {
    const { itemName, unit, itemQuantity, pricePerItem } = req.body;

    try {
        const totalPrice = itemQuantity * pricePerItem;

        const existingItem = new ExistingItems({
            itemName,
            unit,
            itemQuantity,
            pricePerItem,
            totalPrice
        });

        await existingItem.save();

        // Ensure itemName is handled in lowercase
        const stockUpdate = await Stock.findOneAndUpdate(
            { itemName: itemName.toLowerCase() },
            {
                $inc: { totalStock: itemQuantity },
                $set: { unit: unit }
            },
            { upsert: true, new: true }
        );

        if (!stockUpdate) {
            console.error(`Stock update failed for item: ${itemName}`);
        }

        res.status(201).json({
            message: 'Existing item added successfully',
            existingItem
        });
    } catch (error) {
        console.error(error.message);
        next(error);
    }
};

// Update ExistingItem
exports.updateExistingItem = async (req, res, next) => {
    const { id } = req.params;
    const { itemName, unit, itemQuantity, pricePerItem } = req.body;

    try {
        const existingItem = await ExistingItems.findById(id);
        if (!existingItem) {
            throw new Error('Existing item not found');
        }

        const quantityDifference = itemQuantity - existingItem.itemQuantity;
        const totalPrice = itemQuantity * pricePerItem;

        // Update stock if quantity changes
        if (quantityDifference !== 0) {
            const stockUpdate = await Stock.findOneAndUpdate(
                { itemName: existingItem.itemName.toLowerCase() },
                { $inc: { totalStock: quantityDifference } },
                { new: true }
            );

            if (!stockUpdate) {
                console.error(`Stock update failed for item: ${existingItem.itemName}`);
            }
        }

        // Update the existing item's details
        existingItem.itemName = itemName;
        existingItem.unit = unit;
        existingItem.itemQuantity = itemQuantity;
        existingItem.pricePerItem = pricePerItem;
        existingItem.totalPrice = totalPrice;

        await existingItem.save();

        // Update the unit in stock
        await Stock.findOneAndUpdate(
            { itemName: itemName.toLowerCase() },
            { $set: { unit: unit } }
        );

        res.status(200).json({
            message: 'Existing item updated successfully',
            existingItem
        });
    } catch (error) {
        console.error(error.message);
        next(error);
    }
};

// Delete ExistingItem
exports.deleteExistingItem = async (req, res, next) => {
    const { id } = req.params;

    try {
        // Find the existing item by ID
        const existingItem = await ExistingItems.findById(id);
        if (!existingItem) {
            throw new Error('Existing item not found');
        }

        // Reduce stock for the deleted item
        const stockUpdate = await Stock.findOneAndUpdate(
            { itemName: existingItem.itemName.toLowerCase() }, // Match by lowercase itemName
            { $inc: { totalStock: -existingItem.itemQuantity } }, // Decrement stock by itemQuantity
            { new: true } // Return the updated document
        );

        if (!stockUpdate) {
            console.error(`Stock update failed for item: ${existingItem.itemName}`);
            return res.status(500).json({ 
                message: `Stock update failed for item: ${existingItem.itemName}` 
            });
        }

        // Delete the existing item
        await ExistingItems.findByIdAndDelete(id);

        res.status(200).json({
            message: 'Existing item deleted successfully',
            stock: stockUpdate // Include updated stock information for reference
        });
    } catch (error) {
        console.error('Error deleting existing item:', error.message);
        next(error); // Pass error to the global error handler
    }
};


// Get all existing items
exports.getAllExistingItems = async (req, res, next) => {
    try {
        const existingItems = await ExistingItems.find();
        res.status(200).json({
            message: 'Existing items fetched successfully',
            existingItems
        });
    } catch (error) {
        next(error);
    }
};

// Get existing item by ID with stock details and total price
exports.getExistingItemById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const existingItem = await ExistingItems.findOne({ _id: id });

        if (!existingItem) {
            const error = new Error('Existing item not found');
            error.status = 404;
            throw error;
        }

        res.status(200).json({
            message: 'Existing item details fetched successfully',
            existingItem
        });
    } catch (error) {
        next(error);
    }
};
