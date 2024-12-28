const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

router.post('/add-supplier', supplierController.addSupplier);
router.get('/', supplierController.getAllSuppliers);
router.get('/view-supplier/:id', supplierController.getSupplierById);
router.put('/update-supplier/:id', supplierController.updateSupplier);
router.delete('/delete-supplier/:id', supplierController.deleteSupplier);

module.exports = router;
