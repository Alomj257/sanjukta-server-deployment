const Stock = require('../models/Stock');

// Add stock
exports.addStock = async (req, res, next) => {
    const { itemName, unit, totalStock } = req.body;

    try {
        let stock = await Stock.findOne({ itemName: itemName.toLowerCase() });
        if (stock) {
            stock.totalStock += totalStock;
            await stock.save();
            return res.status(200).json({
                message: 'Stock updated successfully',
                stock
            });
        }

        // Create new stock if not exists
        stock = new Stock({ itemName: itemName.toLowerCase(), unit, totalStock });
        await stock.save();
        res.status(201).json({
            message: 'Stock added successfully',
            stock
        });
    } catch (error) {
        next(error);
    }
};

// Update stock
exports.updateStock = async (req, res, next) => {
    const { itemId } = req.params;
    const { totalStock } = req.body;

    try {
        const updatedStock = await Stock.findByIdAndUpdate(itemId, { totalStock }, { new: true });
        if (!updatedStock) {
            const error = new Error('Stock not found');
            error.status = 404;
            throw error;
        }
        res.status(200).json({
            message: 'Stock updated successfully',
            updatedStock
        });
    } catch (error) {
        next(error);
    }
};

// Delete stock
exports.deleteStock = async (req, res, next) => {
    const { itemId } = req.params;

    try {
        const deletedStock = await Stock.findByIdAndDelete(itemId);
        if (!deletedStock) {
            const error = new Error('Stock not found');
            error.status = 404;
            throw error;
        }
        res.status(200).json({ message: 'Stock deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Get all stock
exports.getStockById = async (req, res, next) => {
    try {
        const stock = await Stock.findById(req.params.id);
        res.status(200).json({
            message: 'Stock list fetched successfully',
            stock
        });
    } catch (error) {
        next(error);
    }
};
// Get all stock
exports.getAllStock = async (req, res, next) => {
    try {
        const stockList = await Stock.find();
        res.status(200).json({
            message: 'Stock list fetched successfully',
            stockList
        });
    } catch (error) {
        next(error);
    }
};
