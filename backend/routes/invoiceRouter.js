import express from 'express';
import { clerkMiddleware } from '@clerk/express';
import { createInvoice, getInvoices, getInvoiceById, updateInvoice, deleteInvoice } from '../controllers/invoiceController.js';


const invoiceRouter = express.Router();
invoiceRouter.use(clerkMiddleware());

invoiceRouter.post('/', createInvoice);
invoiceRouter.get('/', getInvoices);
invoiceRouter.get('/:id', getInvoiceById);
invoiceRouter.put('/:id', updateInvoice);
invoiceRouter.delete('/:id', deleteInvoice);

export default invoiceRouter;