const { addReturnProduct } = require("../controllers/returnController");

const returnStockRoutes=require("express").Router();

returnStockRoutes.post("/",addReturnProduct);

module.exports=returnStockRoutes;