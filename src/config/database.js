const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://namaste-node:namastenodejs7777@namastenode.iszynrh.mongodb.net/devTinder");
};

module.exports = {
    connectDB
};