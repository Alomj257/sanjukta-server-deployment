const User = require("../../models/User");

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      user,
      message: "user fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserByEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({email:req.params.email});
    res.status(200).json({
      user,
      message: "user fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};
