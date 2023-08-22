const mongoose = require('mongoose');
const db = "mongodb://localhost:27017/test";

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB Connected...");
    } catch (err) {
        console.error(err.message, "MongoDB Error");
    }
}
module.exports = connectDB;