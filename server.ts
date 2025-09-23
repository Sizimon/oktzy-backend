import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import clipRoutes from './routes/clipRoutes.js';

const app = express();

app.set('trust proxy', 1);

app.use(cors({
    origin: 'https://oktzy.com',
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', clipRoutes);

const PORT = 5001;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
