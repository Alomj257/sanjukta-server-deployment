const User = require('../../models/User');

const getOtpTime = async (req, res, next) => {
    const { token } = req.body;

    try {
        const findedUser = await User.findOne({ 'otp.token': token }).select('otp');

        if (!findedUser) {
            const error = new Error('Something went wrong');
            error.statusCode = 400;
            throw error;
        }

        res.status(200).json({ message: 'Success', status: true, sendTime: findedUser.otp.sendTime })
        await findedUser.save();



    } catch (error) {
        next(error);
    }
}

module.exports = getOtpTime;