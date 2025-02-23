const { addStockToSection, updateStockToSection, deleteStock, getStocks,getAllStocksByDate,getAllStocksGroupByDate ,getStocksGroupByDate, generateDailyStockReport, generateMonthlyStockReport, generateStockReport} = require("../controllers/assignStockToSection");

const assingStockToSectionRoutes=require("express").Router();

assingStockToSectionRoutes.post("/:sectionId/",addStockToSection);
assingStockToSectionRoutes.put("/:sectionId/:stockId/:date",updateStockToSection);
assingStockToSectionRoutes.delete("/:sectionId/:stockId/:date",deleteStock);
assingStockToSectionRoutes.get("/:sectionId/",getStocks);
assingStockToSectionRoutes.get("/:sectionId/:date",getAllStocksByDate);
assingStockToSectionRoutes.get("/:sectionId/group/date/:status",getAllStocksGroupByDate);
assingStockToSectionRoutes.get("/:sectionId/group/by/date/all",getStocksGroupByDate);

// // Route for Daily Report
// assingStockToSectionRoutes.get('/daily-report/:sectionId/:selectedDate', generateDailyStockReport);
// // Route for Monthly Report
// assingStockToSectionRoutes.get('/monthly-report/:sectionId/:selectedMonth', generateMonthlyStockReport);
// Route for Stock Report by date range
assingStockToSectionRoutes.get('/stock-report/:sectionId/:fromDate/:toDate', generateStockReport);




module.exports=assingStockToSectionRoutes;