const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const joi = require('joi');

// const register = async (req, res, next) => {

//     const {error: validationError} = validateUser(req.body);

//     const { name, email, password } = req.body;

//     try {
//         if(validationError){
//             const error = new Error(validationError.details[0].message)
//             error.statusCode = 400;
//             throw error;
//         }

//         const formatedName = name.toLowerCase();
//         const formatedEmail = email.toLowerCase();

//         const findUser = await User.findOne({ email: formatedEmail });
//         if (findUser) {
//             const error = new Error('This email is already exist');
//             error.statusCode = 400;
//             throw error;
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const newUser = new User({
//             name: formatedName,
//             email: formatedEmail,
//             password: hashedPassword
//         })

//         await newUser.save();

//         res.status(200).json({message: 'User registred sucessfully', status: true})

//     } catch (error) {
//         next(error);
//     }
// }

const register = async (req, res, next) => {
    const { error: validationError } = validateUser(req.body);
    const { name, email, password, role } = req.body;

    try {
        if (validationError) {
            const error = new Error(validationError.details[0].message);
            error.statusCode = 400;
            throw error;
        }

        // const formattedName = name.toLowerCase();
        const formattedEmail = email.toLowerCase();

        const existingUser = await User.findOne({ email: formattedEmail });
        if (existingUser) {
            const error = new Error('This email already exists');
            error.statusCode = 400;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name, // formattedName
            email: formattedEmail,
            password: hashedPassword,
            role: role || 'user', // Default to 'user' if no role is specified
        });

        await newUser.save();

        res.status(200).json({ message: 'User registered successfully', status: true });
    } catch (error) {
        next(error);
    }
};

module.exports = register;

// function validateUser(data) {
//     const userSchema = joi.object({
//         name: joi.string().min(2).required(),
//         email: joi.string().email().required(),
//         password: joi.string().min(8).max(15).required()
//     })

//     return userSchema.validate(data);
// }

// function validateUser(data) {
//     const userSchema = joi.object({
//         name: joi.string().min(2).required(),
//         email: joi.string().email().required(),
//         password: joi.string()
//             .min(8).message('Password length must be at least 8 characters long')
//             .max(15).message('Password length must be less than or equal to 15 characters long')
//             .pattern(new RegExp("[a-z]")).message("Include at least one lowercase letter.")
//             .pattern(new RegExp("[A-Z]")).message("Include at least one uppercase letter.")
//             .pattern(new RegExp("\\d")).message("Include at least one number.")
//             .pattern(new RegExp("[@$!%*?&]")).message("Include at least one special character.")
//             .required()
//     });

//     return userSchema.validate(data);
// }

function validateUser(data) {
    const userSchema = joi.object({
        name: joi.string().min(2).required(),
        email: joi.string().email().required(),
        password: joi.string()
            .min(8).message('Password length must be at least 8 characters long')
            .max(15).message('Password length must be less than or equal to 15 characters long')
            .pattern(new RegExp("[a-z]")).message("Include at least one lowercase letter.")
            .pattern(new RegExp("[A-Z]")).message("Include at least one uppercase letter.")
            .pattern(new RegExp("\\d")).message("Include at least one number.")
            .pattern(new RegExp("[@$!%*?&]")).message("Include at least one special character.")
            .required(),
        role: joi.string().valid('user', 'admin').optional()
    });

    return userSchema.validate(data);
}

