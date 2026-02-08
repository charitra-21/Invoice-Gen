import mongoose from 'mongoose';
import validator from 'validator';

const { trim } = validator;


const businessProfileSchema = new mongoose.Schema({
    owner: { type: String, required: true, unique: true },
    businessName: { type: String, required: true},
    email: { type: String, required: false, default: '',trim: true,lowercase: true},
    address: { type: String, required: false, default: '' },
    phone: { type: String, required: false, default: '' },
    gst: { type: String, required: false, default: '' },

    logoUrl: { type: String, required: false, default: '' },
    stampUrl: { type: String, required: false, default: '' },
    signatureUrl: { type: String, required: false, default: '' },
    signatureOwnerName: { type: String, required: false, default: '' },
    signatureOwnerTitle: { type: String, required: false, default: '' },
    defaultTaxPercent: { type: Number, required: false, default: 18 },

}, { timestamps: true });

const BusinessProfile =mongoose.model.BusinessProfile || mongoose.model('BusinessProfile', businessProfileSchema);
export default BusinessProfile;