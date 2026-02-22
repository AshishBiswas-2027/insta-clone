const mongoose = require("mongoose");

async function connectToDb() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("✅ Connected to Database");
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1); // optional but recommended in production
    }
}

module.exports = connectToDb;
