// db.js
const mongoose = require('mongoose');

const connectDB = () => {
    // Check if MONGO_URI is set correctly in .env
    if (!process.env.MONGO_URI) {
        console.error('MONGO_URI is not defined in the .env file');
        process.exit(1);  // Exit with failure if MONGO_URI is missing
    }

    // Return a promise to connect to MongoDB
    return mongoose.connect(process.env.MONGO_URI, {
    })
        .then((conn) => {
            console.log(`MongoDB Connected: ${conn.connection.host}`);
        })
        .catch((error) => {
            console.error(`Error: ${error.message}`);
            process.exit(1);  // Exit the process with a failure code
        });
};

module.exports = { connectDB };
