import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import clipRoutes from './routes/clipRoutes';

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', clipRoutes);

const PORT = 5007;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
