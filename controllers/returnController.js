const { default: mongoose } = require("mongoose");
const ReturnStock = require("../models/ReturnStock");
const Section = require("../models/Section");
const Stock = require("../models/Stock");

exports.addReturnProduct = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const { stocks,date } = req.body;
      const section = await Section.findById(req.body.sectionId).session(session);
      if (!section) {
        throw new Error("Section not found.");
      }
      const returnProductOld=await ReturnStock.findOne({date:new Date(date)}).session(session);
      if (returnProductOld) {
        throw new Error("This Stocks all ready return");
      }
  
      if (stocks && Array.isArray(stocks)) {
        for (const stock of stocks) {
          const { _id, qty } = stock;
          const stockDoc = section.stocks.find(
            (v) =>
              v._id.toString() === _id.toString() &&
              new Date(req.body.date).toString() === new Date(v.date).toString()
          );
  
          if (!stockDoc) {
            throw new Error(`This Stock is not assigned on this Date`);
          }
  
          if (stockDoc.qty < qty) {
            throw new Error(
              `Insufficient stock Available: ${stockDoc.qty} in section, Requested: ${qty}`
            );
          }
  
          stockDoc.qty -= qty;
            const mainStock = await Stock.findById(_id).session(session);
            mainStock.totalStock = mainStock.totalStock + qty;
            await mainStock.save({ session });
        }
      }
  
      const returnProduct = new ReturnStock(req.body);
      await returnProduct.save({ session });
      await section.save({ session });
  
      await session.commitTransaction();
      session.endSession();
  
      res.status(201).json({
        message: "Stock Return successfully",
        returnProduct,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  };
  
  exports.updateReturnProduct = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const returnStock = await ReturnStock.findById(req.params.id).session(session);
      if (!returnStock) {
        throw new Error("Return Stock not found");
      }
  
      const section = await Section.findById(req.body.sectionId).session(session);
      if (!section) {
        throw new Error("Section not found");
      }
      const { stocks, date } = req.body;
      if (stocks && Array.isArray(stocks)) {
        for (const stock of stocks) {
          const { _id, qty } = stock;
  
          const stockDoc = section.stocks.find(
            (v) =>
              v._id.toString() === _id.toString() &&
              new Date(date).toString() === new Date(v.date).toString()
          );
  
          const oldStock = returnStock.stocks.find(
            (v) => v._id.toString() === _id.toString()
          );
  
          if (!stockDoc) {
            throw new Error(`Stock with ID ${_id} not found in this section.`);
          }
          const mainStock = await Stock.findById(_id).session(session);
  
          mainStock.totalStock = mainStock.totalStock - stockDoc.qty;
          stockDoc.qty += oldStock.qty;
  
          if (stockDoc.qty < qty) {
            throw new Error(
              `Insufficient stock available: ${stockDoc.qty}, Requested: ${qty}`
            );
          }
          stockDoc.qty -= qty;
            mainStock.totalStock = mainStock.totalStock + qty;
            await mainStock.save({ session });
        }
      }
  
      await section.save({ session });
  
      const updatedProduct = await ReturnStock.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, session }
      );
  
      await session.commitTransaction();
      session.endSession();
  
      res.status(200).json({
        message: "Return stock updated successfully",
        section: updatedProduct,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  };