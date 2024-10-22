require('dotenv').config()
const mongoose = require('mongoose');
// const createSchoolYearAndSemesters = require('../scr/controllers/createSchoolYearAndSemesters')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');

  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
