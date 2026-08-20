const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function connecttoDB() {
   try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
   } catch (err) {
    console.error('Error connecting to MongoDB:', err );
   }
}

module.exports = connecttoDB;