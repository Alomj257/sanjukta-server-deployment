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
