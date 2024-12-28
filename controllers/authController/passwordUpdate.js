const User = require('../../models/User');
const bcrypt = require('bcryptjs');

const passwordUpdate = async (req, res, next) => {
    const { password, confirmPassword, token } = req.body;

    try {
        const findedUser = await User.findOne({ 'otp.token': token });
        if (!findedUser) {
            return res.status(400).json({ message: 'Unverified Token' });
        }

        const isExpired = new Date(findedUser.otp.sendTime).getTime() + 5 * 60 * 1000 < new Date().getTime();
        if (isExpired) {
            return res.status(400).json({ message: 'Time expired for password update' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        findedUser.password = hashedPassword;
        findedUser.otp.sendTime = null;
        findedUser.otp.token = null;
        await findedUser.save();

        res.status(200).json({ message: 'Password updated successfully', status: true });

    } catch (error) {
        res.status(500).json({ message: 'Server error occurred', error: error.message });
    }
};


module.exports = passwordUpdate;