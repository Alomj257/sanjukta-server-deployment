const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.post('/add', stockController.addStock);
router.put('/update/:itemId', stockController.updateStock);
router.delete('/delete/:itemId', stockController.deleteStock);
router.get('/:id', stockController.getStockById);
router.get('/', stockController.getAllStock);

module.exports = router;
