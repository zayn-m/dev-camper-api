const mongoose = require("mongoose");

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });
    if (conn) console.log("DB connected".cyan.underline.bold);
    else console.log("Db not connected");
};

module.exports = connectDB;
