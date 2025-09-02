import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

const PORT = 5007;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
