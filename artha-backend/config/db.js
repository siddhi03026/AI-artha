const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri =
      process.env.NODE_ENV === 'production'
        ? process.env.MONGO_URI_ATLAS || process.env.MONGO_URI
        : process.env.MONGO_URI || process.env.MONGO_URI_ATLAS;

    if (!uri) {
      throw new Error('Missing MongoDB URI. Set MONGO_URI or MONGO_URI_ATLAS.');
    }

    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);

    // ❌ REMOVE THIS
    // process.exit(1);

    // ✅ ADD THIS
    console.log("MongoDB skipped, server still running");
  }
};

module.exports = connectDB;