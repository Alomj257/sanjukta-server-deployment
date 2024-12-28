const {
    addSection,
    updateSection,
    deleteSection,
    getSectionById,
    getSectionByUserId,
    getAllSection,
    updateSectionStatus,
    updateSectionDetails, // Import the new controller
  } = require("../controllers/sectionController");
  
  const assingStockToSectionRoutes = require("./assignStockToSectionRoutes");
  const sectionRoutes = require("express").Router();
  
  // Existing routes
  sectionRoutes.post("/", addSection);
  sectionRoutes.put("/:id", updateSection);
  sectionRoutes.delete("/:id", deleteSection);
  sectionRoutes.get("/:id", getSectionById);
  sectionRoutes.get("/user/data/:userId", getSectionByUserId);
  sectionRoutes.get("/", getAllSection);
  sectionRoutes.put("/status/:id/:date/:status", updateSectionStatus);
  sectionRoutes.use("/stock/", assingStockToSectionRoutes);
  
  // New route for updating section details
  sectionRoutes.put("/details/:id", updateSectionDetails);
  
  module.exports = sectionRoutes;
  