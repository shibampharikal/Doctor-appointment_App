const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL,{
       useNewUrlParser: true,
      useUnifiedTopology: true,
      tls: true,
      tlsAllowInvalidCertificates: true,
    });
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`.bgGreen.white);
  } catch (error) {
    console.log(`MongoDB Connection Error: ${error}`.bgRed.white);
    process.exit(1);
  }
};

module.exports = connectDB;
