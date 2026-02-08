import mongoose from 'mongoose';

const connectDB = async () => {
  await mongoose.connect('mongodb+srv://prokrish0506_db_user:invoice123@cluster0.3xkb36o.mongodb.net/InvoiceAI').then(() => {
    console.log('MongoDB connected successfully')})
  }
export default connectDB;