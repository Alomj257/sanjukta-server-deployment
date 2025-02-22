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

// Add supplier
exports.addSupplier = async (req, res, next) => {
    const { supplierName, supplierAddress, email, gst, contactDetails, items, purchaseDate } = req.body;

    try {
        items.forEach(item => {
            item.totalPrice = item.itemQuantity * item.pricePerItem;
        });

        const supplier = new Supplier({ supplierName, supplierAddress, email, gst, contactDetails, items, purchaseDate });
        await supplier.save();

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
    const { id } = req.params;
    const { supplierName, supplierAddress, email, gst, contactDetails, items, purchaseDate } = req.body;

    try {
        const supplier = await Supplier.findById(id);
        if (!supplier) {
            const error = new Error('Supplier not found');
            error.status = 404;
            throw error;
        }

        items.forEach(item => {
            item.totalPrice = item.itemQuantity * item.pricePerItem;
        });

        supplier.supplierName = supplierName;
        supplier.supplierAddress = supplierAddress;
        supplier.email = email;
        supplier.gst = gst;
        supplier.contactDetails = contactDetails;
        supplier.purchaseDate = purchaseDate;

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

        supplier.items = items;
        await supplier.save();

        const totalSum = supplier.calculateTotalPrice();

        res.status(200).json({
            message: 'Supplier updated successfully',
            supplier,
            totalSum
        });
    } catch (error) {
        next(error);
    }
};

// Delete supplier
exports.deleteSupplier = async (req, res, next) => {
    const { id } = req.params;

    try {
        const supplier = await Supplier.findById(id);
        if (!supplier) {
            const error = new Error('Supplier not found');
            error.status = 404;
            throw error;
        }

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
    const { id } = req.params;
    
    try {
        const supplier = await Supplier.findById(id);
    
        if (!supplier) {
            const error = new Error('Supplier not found');
            error.status = 404;
            throw error;
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
