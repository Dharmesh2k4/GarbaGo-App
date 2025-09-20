import jwt from 'jsonwebtoken';
import { Admin } from "../models/Admin.js"; // make sure you have this model

export const verifyAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const admin = await Admin.findById(decoded.id);
        if (!admin) return res.status(401).json({ status: 'error', message: 'Admin not found' });

        req.admin = admin; // ✅ Attach admin to req
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ status: 'error', message: 'Invalid token' });
    }
};
