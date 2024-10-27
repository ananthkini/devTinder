const mongodb = require("mongoose");

const connectDB = async () => {
  await mongodb.connect(
    "mongodb+srv://namastenode:namastenode@namastenode.uwm7b.mongodb.net/devTinder"
  );
};

module.exports = { connectDB };
