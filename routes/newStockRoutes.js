const { getAllNewStock } = require("../controllers/newStockController");

const newProductRoutes=require("express").Router();

newProductRoutes.get("/",getAllNewStock)

module.exports=newProductRoutes;