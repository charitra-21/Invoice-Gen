import express from 'express';
import { clerkMiddleware } from '@clerk/express';
import multer from 'multer';
import path from 'path';
import { createBusinessProfile, getBusinessProfile, updateBusinessProfile } from '../controllers/businessprofilecontroller.js';

const businessProfileRouter = express.Router();

businessProfileRouter.use(clerkMiddleware());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), '/uploads'));
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `business-${unique}${ext}`);
    }
});
const upload = multer({ storage });

businessProfileRouter.post('/', upload.fields([
    { name: 'logoName', maxCount: 1 },
    { name: 'stampName', maxCount: 1 },
    { name: 'signatureNameMeta', maxCount: 1 },
]), createBusinessProfile);

businessProfileRouter.put('/:id', upload.fields([
    { name: 'logoName', maxCount: 1 },
    { name: 'stampName', maxCount: 1 },
    { name: 'signatureNameMeta', maxCount: 1 },
]), updateBusinessProfile);

businessProfileRouter.get("/me",getBusinessProfile)

export default businessProfileRouter;