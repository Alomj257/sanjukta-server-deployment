const express = require('express');
const router = express.Router();
const existingItemsController = require('../controllers/existingItemsController');

router.post('/add-item', existingItemsController.addExistingItem);
router.get('/', existingItemsController.getAllExistingItems);
router.get('/view-item/:id', existingItemsController.getExistingItemById);
router.put('/update-item/:id', existingItemsController.updateExistingItem);
router.delete('/delete-item/:id', existingItemsController.deleteExistingItem);

module.exports = router;
