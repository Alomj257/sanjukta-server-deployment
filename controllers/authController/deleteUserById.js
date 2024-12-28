const User = require('../../models/User'); // Adjust the path if needed

// Controller for deleting a user by ID
const deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the user
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: deletedUser,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'An error occurred while deleting the user',
            error: error.message,
        });
    }
};

module.exports = deleteUserById;
