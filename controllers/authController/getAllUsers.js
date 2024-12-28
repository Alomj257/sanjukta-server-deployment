const User = require("../../models/User");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: "user" });
    res.status(200).json({
      users,
      message: "user fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};
