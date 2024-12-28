const mongoose = require("mongoose");

const returnStockSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    stocks: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Stock",
        },
        qty: {
          type: Number,
          min: 0,
        },
        date: Date,
        unit: String,
      },
    ],
  },
  { timeStamp: true }
);

module.exports = mongoose.model("ReturnStock", returnStockSchema);
