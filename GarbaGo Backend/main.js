import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv'
import { verifyToken } from './middleware/authMiddleware.js';
import eventRoutes from "./routes/eventRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import bookingRoutes from './routes/bookingRoutes.js'

const app = express();
dotenv.config();

app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use('/api/auth', authRoutes);
app.use("/uploads", express.static("uploads")); // serve images

// Routes
app.use("/api/event", eventRoutes);
app.use("/api/payment",paymentRoutes)
app.use("/api/booking",bookingRoutes)

const port = 3000;
connectDB();

app.get('/', (req, res) => {
    res.send("Hello,World");
})

// app.get('/userdata', verifyToken, (req, res) => {
//   res.json({ user: req.user });
// });



app.listen(port, () => {
    console.log(`App Listen at port ${port}`);
})