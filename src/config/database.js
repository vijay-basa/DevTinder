const mongoose = require('mongoose');
require("dotenv").config();

const DATABASE_URI = process.env.DATABASE_URI

const connectDB = async () => {
    await mongoose.connect(DATABASE_URI);
};

module.exports = {
    connectDB
};