const mongodb = require("mongoose");
require('dotenv').config()

// console.log(process.env)

const connectDB = async () => {
  await mongodb.connect(
    process.env.DB_CONNECTION_DETAIL
  );
};

module.exports = { connectDB };
