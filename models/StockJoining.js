const mongoose = require("mongoose");

const joinSchema = new mongoose.Schema(
  {
   
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      unique: true,
      required: true,
    },
   
    stockGroup: [
      { 
       date:Date,
       status:{
        type:String,
        default:"assigned",
        enum:["assigned","accepted","rejected"]
      },
      },
    ],
  },
  { timeStamp: true }
);

module.exports = mongoose.model("StockJoining", joinSchema);
