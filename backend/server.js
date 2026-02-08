import express from 'express';
import cors from 'cors';
import 'dotenv/config.js';
import { clerkMiddleware } from '@clerk/express'
import connectDB from './config/db.js';
import path from 'path';
import invoiceRouter from './routes/invoiceRouter.js';
import businessProfileRouter from './routes/businessProfileRouter.js';
import aiInvoiceRouter from './routes/aiinvoiceRouter.js';

const app = express();
const port = 4000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(clerkMiddleware());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

connectDB();

app.use('/uploads', express.static(path.join(process.cwd(), '/uploads')));
app.use('/api/invoice', invoiceRouter);
app.use('/api/businessprofile', businessProfileRouter);
app.use('/api/aiinvoice', aiInvoiceRouter);

app.get('/', (req, res) => {
  res.send('Hello from the backend server!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});