const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });

const Bootcamp = require("./models/Bootcamp");

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

// Read json files
const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

// Import into database
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        console.log("Data imported...".green.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
    }
};

// Delete data from database
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        console.log("Data destroyed...".red.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
    }
};

if (process.argv[2] === "-i") {
    importData();
} else if (process.argv[2] === "-d") {
    deleteData();
}
