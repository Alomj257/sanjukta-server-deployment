// const Supplier = require('../models/Supplier');
// const Stock = require('../models/Stock');

// // Add supplier
// exports.addSupplier = async (req, res, next) => {
//     const { supplierName, supplierAddress, email, gst, contactDetails, items } = req.body;

//     try {
//         // Calculate totalPrice for each item
//         items.forEach(item => {
//             item.totalPrice = item.itemQuantity * item.pricePerItem;
//         });

//         const supplier = new Supplier({ supplierName, supplierAddress, email, gst, contactDetails, items });
//         await supplier.save();

//         // Update stock for each item added by supplier
//         for (let item of items) {
//             await Stock.findOneAndUpdate(
//                 { itemName: item.itemName.toLowerCase() },
//                 { 
//                     $inc: { totalStock: item.itemQuantity },
//                     $setOnInsert: { unit: item.unit } // Ensure unit is set if it's a new stock item
//                 },
//                 { upsert: true, new: true } // Create a new record if it doesn't exist
//             );
//         }

//         // Calculate total sum of all items' total prices
//         const totalSum = supplier.calculateTotalPrice();

//         res.status(201).json({
//             message: 'Supplier added successfully',
//             supplier,
//             totalSum
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// // Update supplier
// exports.updateSupplier = async (req, res, next) => {
//     const { id } = req.params;
//     const { supplierName, supplierAddress, email, gst, contactDetails, items } = req.body;

//     try {
//         // Find the supplier by ID
//         const supplier = await Supplier.findById({ _id: id });
//         if (!supplier) {
//             const error = new Error('Supplier not found');
//             error.status = 404;
//             throw error;
//         }

//         // Calculate totalPrice for each item
//         items.forEach(item => {
//             item.totalPrice = item.itemQuantity * item.pricePerItem;
//         });

//         // Update the supplier details
//         supplier.supplierName = supplierName;
//         supplier.supplierAddress = supplierAddress;
//         supplier.email = email;
//         supplier.gst = gst;
//         supplier.contactDetails = contactDetails;

//         // Find removed items and update stock
//         for (let oldItem of supplier.items) {
//             const newItem = items.find(item => item.itemName === oldItem.itemName);
//             if (!newItem) {
//                 // Item was removed, reduce stock
//                 await Stock.findOneAndUpdate(
//                     { itemName: oldItem.itemName.toLowerCase() },
//                     { $inc: { totalStock: -oldItem.itemQuantity } }
//                 );
//             } else if (newItem.itemQuantity !== oldItem.itemQuantity) {
//                 // Item quantity changed, update stock
//                 const quantityDifference = newItem.itemQuantity - oldItem.itemQuantity;
//                 await Stock.findOneAndUpdate(
//                     { itemName: oldItem.itemName.toLowerCase() },
//                     { $inc: { totalStock: quantityDifference } }
//                 );
//             }
//         }

//         // Add new items and update stock
//         for (let newItem of items) {
//             const oldItem = supplier.items.find(item => item.itemName === newItem.itemName);
//             if (!oldItem) {
//                 // New item, add to stock
//                 await Stock.findOneAndUpdate(
//                     { itemName: newItem.itemName.toLowerCase() },
//                     { 
//                         $inc: { totalStock: newItem.itemQuantity },
//                         $setOnInsert: { unit: newItem.unit } // Set unit if it's a new stock item
//                     },
//                     { upsert: true, new: true } // Ensure new records are created when not found
//                 );
//             } else {
//                 // Update existing item's unit if necessary
//                 await Stock.findOneAndUpdate(
//                     { itemName: newItem.itemName.toLowerCase() },
//                     { unit: newItem.unit } // Update the unit field
//                 );
//             }
//         }

//         // Update supplier's items array and save it
//         supplier.items = items;
//         await supplier.save();

//         // Calculate total sum of all items' total prices
//         const totalSum = supplier.items.reduce((sum, item) => sum + item.totalPrice, 0);

//         res.status(200).json({
//             message: 'Supplier updated successfully',
//             supplier,
//             totalSum
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// // Delete supplier
// exports.deleteSupplier = async (req, res, next) => {
//     const { id } = req.params;

//     try {
//         const supplier = await Supplier.findOne({_id: id});
//         if (!supplier) {
//             const error = new Error('Supplier not found');
//             error.status = 404;
//             throw error;
//         }

//         // Decrease stock for items of the deleted supplier
//         for (let item of supplier.items) {
//             await Stock.findOneAndUpdate(
//                 { itemName: item.itemName.toLowerCase() },
//                 { $inc: { totalStock: -item.itemQuantity } }
//             );
//         }

//         await Supplier.findByIdAndDelete(id);

//         res.status(200).json({ message: 'Supplier deleted successfully' });
//     } catch (error) {
//         next(error);
//     }
// };

// // Get all suppliers
// exports.getAllSuppliers = async (req, res, next) => {
//     try {
//         const suppliers = await Supplier.find();
//         res.status(200).json({
//             message: 'Suppliers fetched successfully',
//             suppliers
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// // Get supplier by ID with stock details and total sum
// exports.getSupplierById = async (req, res, next) => {
//     const { id } = req.params;
    
//     try {
//         const supplier = await Supplier.findOne({ _id: id });
    
//         if (!supplier) {
//             const error = new Error('Supplier not found');
//             error.status = 404;
//             throw error;
//         }
    
//         const totalSum = supplier.items.reduce((sum, item) => sum + item.totalPrice, 0);
//         res.status(200).json({
//             message: 'Supplier details fetched successfully.',
//             supplier: {
//                 ...supplier.toObject(),
//                 totalSum,
//             },
//         });
//     } catch (error) {
//         next(error);
//     }
// };

const Supplier = require('../models/Supplier');
const Stock = require('../models/Stock');
const moment = require('moment');

// Add supplier
exports.addSupplier = async (req, res, next) => {
    try {
        const { supplierName, supplierAddress, email, gst, contactDetails, items, purchaseDate } = req.body;

        // Validate and convert purchaseDate
        if (!moment(purchaseDate, 'DD-MM-YYYY', true).isValid()) {
            return res.status(400).json({ message: 'Invalid date format. Use DD-MM-YYYY' });
        }
        const formattedDate = moment(purchaseDate, 'DD-MM-YYYY').toDate();

        // Calculate total price for each item
        items.forEach(item => {
            item.totalPrice = item.itemQuantity * item.pricePerItem;
        });

        const supplier = new Supplier({ supplierName, supplierAddress, email, gst, contactDetails, items, purchaseDate: formattedDate });
        await supplier.save();

        // Update stock quantity
        for (let item of items) {
            await Stock.findOneAndUpdate(
                { itemName: item.itemName.toLowerCase() },
                { 
                    $inc: { totalStock: item.itemQuantity },
                    $setOnInsert: { unit: item.unit }
                },
                { upsert: true, new: true }
            );
        }

        const totalSum = supplier.calculateTotalPrice();

        res.status(201).json({
            message: 'Supplier added successfully',
            supplier,
            totalSum
        });
    } catch (error) {
        next(error);
    }
};

// Update supplier
exports.updateSupplier = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { supplierName, supplierAddress, email, gst, contactDetails, items, purchaseDate } = req.body;

        console.log("Received Data:", req.body);
        console.log("Received purchaseDate:", purchaseDate, "Type:", typeof purchaseDate);

        const supplier = await Supplier.findById(id);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        // Validate and Convert purchaseDate
        let formattedDate;
        if (moment(purchaseDate, 'DD-MM-YYYY', true).isValid()) {
            formattedDate = moment(purchaseDate, 'DD-MM-YYYY').toDate();
        } else if (moment(purchaseDate, 'YYYY-MM-DD', true).isValid()) {
            formattedDate = moment(purchaseDate, 'YYYY-MM-DD').toDate();
        } else {
            return res.status(400).json({ message: 'Invalid date format. Use DD-MM-YYYY or YYYY-MM-DD' });
        }

        // Recalculate total price for each item
        items.forEach(item => {
            item.totalPrice = item.itemQuantity * item.pricePerItem;
        });

        // Adjust stock based on updated items
        for (let oldItem of supplier.items) {
            const newItem = items.find(item => item.itemName === oldItem.itemName);
            if (!newItem) {
                await Stock.findOneAndUpdate(
                    { itemName: oldItem.itemName.toLowerCase() },
                    { $inc: { totalStock: -oldItem.itemQuantity } }
                );
            } else if (newItem.itemQuantity !== oldItem.itemQuantity) {
                const quantityDifference = newItem.itemQuantity - oldItem.itemQuantity;
                await Stock.findOneAndUpdate(
                    { itemName: oldItem.itemName.toLowerCase() },
                    { $inc: { totalStock: quantityDifference } }
                );
            }
        }

        for (let newItem of items) {
            const oldItem = supplier.items.find(item => item.itemName === newItem.itemName);
            if (!oldItem) {
                await Stock.findOneAndUpdate(
                    { itemName: newItem.itemName.toLowerCase() },
                    { 
                        $inc: { totalStock: newItem.itemQuantity },
                        $setOnInsert: { unit: newItem.unit }
                    },
                    { upsert: true, new: true }
                );
            } else {
                await Stock.findOneAndUpdate(
                    { itemName: newItem.itemName.toLowerCase() },
                    { unit: newItem.unit }
                );
            }
        }

        // Update supplier details
        supplier.supplierName = supplierName;
        supplier.supplierAddress = supplierAddress;
        supplier.email = email;
        supplier.gst = gst;
        supplier.contactDetails = contactDetails;
        supplier.purchaseDate = formattedDate;
        supplier.items = items;

        await supplier.save();
        const totalSum = supplier.calculateTotalPrice();

        res.status(200).json({
            message: 'Supplier updated successfully',
            supplier,
            totalSum
        });
    } catch (error) {
        console.error("Error in updateSupplier:", error);
        next(error);
    }
};
// Delete supplier
exports.deleteSupplier = async (req, res, next) => {
    try {
        const { id } = req.params;
        const supplier = await Supplier.findById(id);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        // Reduce stock quantity before deleting supplier
        for (let item of supplier.items) {
            await Stock.findOneAndUpdate(
                { itemName: item.itemName.toLowerCase() },
                { $inc: { totalStock: -item.itemQuantity } }
            );
        }

        await Supplier.findByIdAndDelete(id);

        res.status(200).json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Get all suppliers
exports.getAllSuppliers = async (req, res, next) => {
    try {
        const suppliers = await Supplier.find();
        res.status(200).json({
            message: 'Suppliers fetched successfully',
            suppliers
        });
    } catch (error) {
        next(error);
    }
};

// Get supplier by ID
exports.getSupplierById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const supplier = await Supplier.findById(id);

        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        const totalSum = supplier.calculateTotalPrice();
        res.status(200).json({
            message: 'Supplier details fetched successfully',
            supplier: { ...supplier.toObject(), totalSum }
        });
    } catch (error) {
        next(error);
    }
};

// Get suppliers by date range
exports.getSuppliersByDateRange = async (req, res, next) => {
    try {
        let { fromDate, toDate } = req.query;

        if (!fromDate || !toDate) {
            return res.status(400).json({ message: 'Both fromDate and toDate are required' });
        }

        if (!moment(fromDate, 'DD-MM-YYYY', true).isValid() || !moment(toDate, 'DD-MM-YYYY', true).isValid()) {
            return res.status(400).json({ message: 'Invalid date format. Use DD-MM-YYYY' });
        }

        let startDate = moment(fromDate, 'DD-MM-YYYY').startOf('day').toDate();
        let endDate = moment(toDate, 'DD-MM-YYYY').endOf('day').toDate();

        const suppliers = await Supplier.find({
            purchaseDate: { $gte: startDate, $lte: endDate }
        }).select('supplierName contactDetails items purchaseDate');

        const formattedSuppliers = suppliers.map(supplier => ({
            ...supplier.toObject(),
            purchaseDate: moment(supplier.purchaseDate).format('DD-MM-YYYY')
        }));

        res.status(200).json({
            message: 'Suppliers fetched successfully',
            suppliers: formattedSuppliers
        });
    } catch (error) {
        next(error);
    }
};
