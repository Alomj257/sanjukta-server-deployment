const User = require('../../models/User');
const crypto = require('crypto');
const sendMail = require('../../utils/sendMail');

const forgetPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const formatedEmail = email.toLowerCase();

        const findedUser = await User.findOne({ email: formatedEmail });
        if (!findedUser) {
            const error = new Error('This email does not exist');
            error.statusCode = 400;
            throw error;
        }

        if (findedUser.otp.otp && new Date(findedUser.otp.sendTime).getTime() > new Date().getTime()) {
            const error = new Error('Please wait for 1 minuite');
            error.statusCode = 400;
            throw error;
        }

        const otp = Math.floor(Math.random() * 90000) + 100000;
        console.log(otp);

        const token = crypto.randomBytes(32).toString('hex');

        findedUser.otp.otp = otp;
        findedUser.otp.sendTime = new Date().getTime() + 1 * 60 * 1000;
        findedUser.otp.token = token;

        await findedUser.save();

        sendMail(otp, formatedEmail);

        res.status(200).json({ message: 'Please check your email for OTP', status: true, token });
    } catch (error) {
        next(error);
    }
};

module.exports = forgetPassword;
