const express = require('express');
const router = express.Router();
const { getNotifications, deleteNotification } = require('../controllers/notificationController');

// Get all notifications
router.get("/", getNotifications);

// Delete a notification by ID
router.delete("/:notificationId", deleteNotification);

module.exports = router;
