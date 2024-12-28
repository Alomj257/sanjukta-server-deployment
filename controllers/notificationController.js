const Notification = require('../models/Notification');


exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find().populate("sectionId", "sectionName").sort({ date: -1 });
    res.status(200).json({
      message: "Notifications fetched successfully",
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteNotification = async (req, res, next) => {
  const { notificationId } = req.params;
  try {
    const notification = await Notification.findByIdAndDelete(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    next(error);
  }
};