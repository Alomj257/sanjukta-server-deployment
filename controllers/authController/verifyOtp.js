const User = require('../../models/User');


const verifyOtp = async(req,res,next) => {
    const {otp} = req.body;

    try{
        const findedUser = await User.findOne({'otp.otp': otp});

        if (!findedUser) {
            const error = new Error('Invalid OTP');
            error.statusCode = 400;
            throw error;
        }

        if(new Date(findedUser.otp.sendTime).getTime() < new Date().getTime()){
            const error = new Error('OTP expired');
            error.statusCode = 400;
            throw error;
        }

        res.status(200).json({message:'OTP verified', status:true})
        await findedUser.save();
        findedUser.otp.otp = null;

        

    }catch(error){
        next(error);
    }
}

module.exports = verifyOtp;