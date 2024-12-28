const {
  addProduct,
  getAllProduct,
  getProductById,
  deleteProduct,
  updateProduct,
  getProductsByDate,
} = require("../controllers/productController");

const productRoutes = require("express").Router();

productRoutes.delete("/:id", deleteProduct);
productRoutes.put("/:id", updateProduct);
productRoutes.post("/", addProduct);
productRoutes.get("/", getAllProduct);
productRoutes.get("/:id", getProductById);
productRoutes.get("/date/:sectionId/:date", getProductsByDate);

module.exports = productRoutes;
