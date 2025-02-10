const NewStock = require("../models/NewStock");

// Get all stock
exports.getAllNewStock = async (req, res, next) => {
    try {
        const stockList = await NewStock.find();
        res.status(200).json({
            message: 'New stock list fetched successfully',
            stockList
        });
    } catch (error) {
        next(error);
    }
};

// Delete stock by ID
exports.deleteNewStock = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedStock = await NewStock.findByIdAndDelete(id);
        if (!deletedStock) {
            return res.status(404).json({ message: "Stock not found" });
        }
        res.status(200).json({ message: "Stock deleted successfully" });
    } catch (error) {
        next(error);
    }
};

// Update stock by ID
exports.updateNewStock = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedStock = await NewStock.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedStock) {
            return res.status(404).json({ message: "Stock not found" });
        }
        res.status(200).json({ message: "Stock updated successfully", updatedStock });
    } catch (error) {
        next(error);
    }
};
