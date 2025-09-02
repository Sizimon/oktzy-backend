import { Router, Request, Response } from 'express';
import { authMiddleware } from '../authMiddleware';
import pool from '../db/dbConnection';

const router = Router();
router.use(authMiddleware);

router.get('/clips/fetch', async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        const clipQuery = await pool.query(
            'SELECT * FROM clips WHERE user_id = $1',
            [userId]
        );

        const clipData = clipQuery.rows;
        res.json({ clips: clipData });
    } catch (error) {
        console.error('Error fetching clips:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/clips/create', async (req: Request, res: Response) => {
    const { title, clipUrl, timestamps } = req.body;
    const userId = req.user?.id;

    try {
        const result = await pool.query(
            'INSERT INTO clips (user_id, title, clip_url, timestamps) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, title, clipUrl, timestamps]
        );

        const newClip = result.rows[0];
        res.status(201).json({ message: 'Clip created successfully', clip: newClip });
    } catch (error) {
        console.error('Error creating clip:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
});

export default router;