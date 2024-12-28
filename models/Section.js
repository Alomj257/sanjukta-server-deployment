const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
  {
    sectionName: {
      type: String,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
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
        date:Date,
        unit:String
      },
    ],
    userPhone:{
        type:String,
        required:true
    },
    status:{
      type:String,
      enum:["assigned","accepted","rejected"]
    },
  },
  { timeStamp: true }
);

module.exports = mongoose.model("Section", sectionSchema);
