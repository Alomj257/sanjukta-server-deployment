const { default: mongoose } = require("mongoose");
const Section = require("../models/Section");
const Stock = require("../models/Stock");
const Product = require("../models/Product");
const NewStock = require("../models/NewStock");

const Notification = require("../models/Notification");

exports.addProduct = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { stocks, productName, newProductName, price, qty, unit, sectionId } = req.body;
    const section = await Section.findById(sectionId).session(session);
    if (!section) {
      throw new Error("Section not found.");
    }
    const newStock = await NewStock.findOne({ productName }).session(session);
    if (!newStock) {
      await new NewStock({ productName: newProductName, qty, unit, price }).save({
        session,
      });
      req.body.productName = newProductName;
    } else {
      newStock.qty = newStock.qty + parseFloat(qty);
      await newStock.save({ session });
    }

    const product = new Product(req.body);
    await product.save({ session });
    await section.save({ session });

    // Save notification
    const notification = new Notification({
      productName: req.body.productName,
      sectionId,
      qty,
      unit,
    });
    await notification.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};


exports.updateProduct = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const {  productName, newProductName, price, qty, unit, sectionId } = req.body;
  const section = await Section.findById(sectionId).session(session);
  try {
    const product = await Product.findById(req.params.id).session(session);
    if (!product) {
      throw new Error("Product not found");
    }

    const section = await Section.findById(req.body.sectionId).session(session);
    if (!section) {
      throw new Error("Section not found");
    }
    const newStock = await NewStock.findOne({productName}).session(session);
    if (!newStock) {
      await new NewStock({ productName:newProductName, qty, unit, price }).save({
        session,
      });
      req.body.productName=newProductName;
    } else {
      newStock.qty=newStock.qty-product.qty;
      newStock.qty = newStock.qty + parseFloat(qty||0);
      await newStock.save({ session });
    }
    const { stocks, date } = req.body;
    // if (stocks && Array.isArray(stocks)) {
    //   for (const stock of stocks) {
    //     const { _id, qty } = stock;

    //     const stockDoc = section.stocks.find(
    //       (v) =>
    //         v._id.toString() === _id.toString() &&
    //         new Date(date).toString() === new Date(v.date).toString()
    //     );

    //     const oldStock = product.stocks.find(
    //       (v) => v._id.toString() === _id.toString()
    //     );

    //     if (!stockDoc) {
    //       throw new Error(`Stock with ID ${_id} not found in this section.`);
    //     }
    //     const mainStock = await Stock.findById(_id).session(session);

    //     mainStock.totalStock = mainStock.totalStock - stockDoc.qty;
    //     stockDoc.qty += oldStock.qty;

    //     if (stockDoc.qty < qty) {
    //       throw new Error(
    //         `Insufficient stock available: ${stockDoc.qty}, Requested: ${qty}`
    //       );
    //     }

    //     stockDoc.qty -= qty;

    //     // if (stockDoc.qty > 0) {
    //     //   mainStock.totalStock = mainStock.totalStock + stockDoc.qty;
    //     //   await mainStock.save({ session });
    //     // }
    //   }
    // }

    await section.save({ session });

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, session }
    );


    // Save notification
    const notification = new Notification({
      productName: req.body.productName,
      sectionId,
      qty,
      unit,
    });
    await notification.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Product updated successfully",
      section: updatedProduct,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// Delete ExistingItem
exports.deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }

    const updatedSection = await Product.findByIdAndDelete(id);

    res.status(200).json({
      message: "Product deleted successfully",
      section: updatedSection,
    });
  } catch (error) {
    next(error);
  }
};

// Get all Sections
exports.getAllProduct = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      message: "Product fetched successfully",
      products,
    });
  } catch (error) {
    next(error);
  }
};

// Get Product by ID with stock details and total price
exports.getProductById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await Product.findOne({ _id: id });

    if (!product) {
      const error = new Error("Product not found");
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      message: "Product details fetched successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

// Get Product by ID with stock details and total price
exports.getProductsByDate = async (req, res, next) => {
  const { sectionId, date } = req.params;
  try {
    const products = await Product.find({
      date: new Date(date),
      sectionId: sectionId,
    });

    if (!products) {
      const error = new Error("Product not found");
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      message: "Product details fetched successfully",
      products,
    });
  } catch (error) {
    next(error);
  }
};
