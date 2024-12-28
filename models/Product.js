const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      // unique: true,
      trim: true,
      lowercase: true 
    },

    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    date: {
      type: Date,
      // unique: true,
      required: true,
    },
    qty: {
      type: Number,
      min: 0,
    },
    unit: String,
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

module.exports = mongoose.model("Product", productSchema);
