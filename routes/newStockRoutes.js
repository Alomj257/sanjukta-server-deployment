const { getAllNewStock, deleteNewStock, updateNewStock } = require("../controllers/newStockController");

const newProductRoutes = require("express").Router();

newProductRoutes.get("/", getAllNewStock);
newProductRoutes.delete("/:id", deleteNewStock); // Delete stock by ID
newProductRoutes.put("/:id", updateNewStock); // Update stock by ID

module.exports = newProductRoutes;
