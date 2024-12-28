const { default: mongoose } = require("mongoose");
const Section = require("../models/Section");
const Stock = require("../models/Stock");
const StockJoining = require("../models/StockJoining");

// Add ExistingItem
exports.addSection = async (req, res, next) => {
  try {
    const section = new Section(req.body);
    await section.save();
    res.status(201).json({
      message: "section added successfully",
      section,
    });
  } catch (error) {
    next(error);
  }
};

// Update Section
exports.updateSection = async (req, res, next) => {
  const { id } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const section = await Section.findById(req.params?.id).session(session);
    if (!section) {
      throw new Error("Section not found");
    }
    const { stocks, date } = req.body;
    if (stocks && Array.isArray(stocks)) {
      for (const stock of stocks) {
        const { _id, qty } = stock;
        // Find the stock item
        const stockDoc = await Stock.findById(_id).session(session);
        if (!stockDoc) {
          throw new Error(`Stock with ID ${_id} not found.`);
        }

        // Check if the stock quantity is sufficient
        if (stockDoc.totalStock < qty) {
          throw new Error(
            `Insufficient stock Available: ${stockDoc.totalStock}, Requested: ${qty}`
          );
        }

        // Deduct stock quantity
        // stockDoc.totalStock -= qty;
        // await stockDoc.save({ session });
      }

      const stockJoining = await StockJoining.findOne({ sectionId: id });
      if (stockJoining) {
        stockJoining.stockGroup.push({ date: date, status: "assigned" });
        await stockJoining.save({ session });
      } else {
        const newStockJoining = new StockJoining({
          sectionId: id,
          stockGroup: [{ date: date, status: "assigned" }],
        });
        await newStockJoining.save({ session });
      }
      req.body.stocks = [...section.stocks, ...req.body.stocks];
    }

    // Update the Section with the new data
    const updatedSection = await Section.findByIdAndUpdate(
      req.params?.id,
      req.body,
      { new: true, session }
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Section updated successfully",
      section: updatedSection,
    });
  } catch (error) {
    // Rollback the transaction on error
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

exports.updateSectionDetails = async (req, res, next) => {
  const { id } = req.params;
  const { sectionName, userPhone, userId } = req.body;

  try {
    // Validate the request body
    if (!sectionName && !userPhone && !userId) {
      return res.status(400).json({
        message: "At least one field (sectionName, userPhone, userId) must be provided",
      });
    }

    // Prepare the update object dynamically based on provided fields
    const updateData = {};
    if (sectionName) updateData.sectionName = sectionName;
    if (userPhone) updateData.userPhone = userPhone;
    if (userId) updateData.userId = userId;

    // Update the section
    const updatedSection = await Section.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validators are applied
    });

    if (!updatedSection) {
      return res.status(404).json({
        message: "Section not found",
      });
    }

    res.status(200).json({
      message: "Section details updated successfully",
      section: updatedSection,
    });
  } catch (error) {
    next(error);
  }
};


// Delete ExistingItem
exports.deleteSection = async (req, res, next) => {
  const { id } = req.params;
  try {
    const section = await Section.findById(id);
    if (!section) {
      throw new Error("Section not found");
    }
    // Delete the Section
    const updatedSection = await Section.findByIdAndDelete(id);

    res.status(200).json({
      message: " Section deleted successfully",
      section: updatedSection,
    });
  } catch (error) {
    next(error);
  }
};

// Get all Sections
exports.getAllSection = async (req, res, next) => {
  try {
    const sections = await Section.find();
    res.status(200).json({
      message: "Sections fetched successfully",
      sections,
    });
  } catch (error) {
    next(error);
  }
};

// Get Section by ID with stock details and total price
exports.getSectionById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const section = await Section.findOne({ _id: id });

    if (!section) {
      const error = new Error("Section not found");
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      message: "Section details fetched successfully",
      section,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSectionByUserId = async (req, res, next) => {
  const { userId, status } = req.params;
  try {
    const section = await Section.findOne({ userId: userId });
    if (!section) {
      const error = new Error("Section not found");
      error.status = 404;
      throw error;
    }
    res.status(200).json({
      message: "Section details fetched successfully",
      section,
    });
  } catch (error) {
    next(error);
  }
};

// exports.updateSectionStatus = async (req, res, next) => {
//   try {
//     const { id, status, date } = req.params;
//     const joinerDate = await StockJoining.findOne({sectionId:id});
//     if (!joinerDate) {
//       const error = new Error("Stock not found");
//       error.status = 404;
//       throw error;
//     }
//     const section = await Section.findById(id);
//     if (!section) {
//       const error = new Error("Section not found");
//       error.status = 404;
//       throw error;
//     }
//     const stock = joinerDate.stockGroup.find(
//       (v) => new Date(v.date).getTime() === new Date(date).getTime()
//     );
//     stock.status = status;
//     const updatedSection = await joinerDate.save();
//     res.status(200).json({
//       message: `Stocks  successfully ${status} `,
//       updatedSection,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

exports.updateSectionStatus = async (req, res, next) => {
  try {
    const { id, status, date } = req.params;

    const joinerDate = await StockJoining.findOne({ sectionId: id });
    if (!joinerDate) {
      throw new Error("Stock not found");
    }

    const section = await Section.findById(id);
    if (!section) {
      throw new Error("Section not found");
    }

    // Find the stock group by date
    const stock = joinerDate.stockGroup.find(
      (v) => new Date(v.date).getTime() === new Date(date).getTime()
    );

    if (!stock) {
      throw new Error("Stock group not found for the given date");
    }

    // Update the stock group status
    stock.status = status;

    // Deduct stock only if the status is "accepted"
    if (status === "accepted") {
      const stocksToDeduct = section.stocks.filter(
        (s) => new Date(s.date).toISOString() === new Date(date).toISOString()
      );

      for (const stockItem of stocksToDeduct) {
        const stockDoc = await Stock.findById(stockItem._id);
        if (!stockDoc) {
          throw new Error(`Stock with ID ${stockItem._id} not found.`);
        }

        if (stockDoc.totalStock >= stockItem.qty) {
          stockDoc.totalStock -= stockItem.qty;
          await stockDoc.save();
        } else {
          throw new Error(
            `Insufficient stock for ${stockDoc._id}. Available: ${stockDoc.totalStock}, Required: ${stockItem.qty}`
          );
        }
      }
    }

    // Save the updated stock group
    await joinerDate.save();

    res.status(200).json({
      message: `Stocks successfully ${status}`,
      updatedSection: joinerDate,
    });
  } catch (error) {
    next(error);
  }
};

