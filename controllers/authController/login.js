const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// const login = async (req, res, next) => {
//     const { email, password } = req.body;

//     try {

//         const formatedEmail = email.toLowerCase();
//         const findedUser = await User.findOne({ email: formatedEmail })

//         if (!findedUser) {
//             const error = new Error('User not found')
//             error.statusCode = 400
//             throw error;
//         }

//         const isPasswordMatched = await bcrypt.compare(password, findedUser.password);
//         if (!isPasswordMatched) {
//             const error = new Error('Incorrect password')
//             error.statusCode = 400
//             throw error;
//         }

//         const accessToken = jwt.sign({ email: formatedEmail, userId: findedUser._id }, process.env.ACCESS_TOKEN_KEY, { expiresIn: '7d' });

//         res.status(200).json({message: 'Login sucessfully', status: true, token: accessToken})


//     } catch (error) {
//         next(error);
//     }
// };


const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const formattedEmail = email.toLowerCase();
        const user = await User.findOne({ email: formattedEmail });

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 400;
            throw error;
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            const error = new Error('Incorrect password');
            error.statusCode = 400;
            throw error;
        }

        const accessToken = jwt.sign(
            { email: user.email, userId: user._id, role: user.role, name: user.name },
            process.env.ACCESS_TOKEN_KEY,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: 'Login successfully',
            status: true,
            token: accessToken,
            user: { email: user.email, role: user.role, name: user.name }
        });
    } catch (error) {
        next(error);
    }
};



module.exports = login;