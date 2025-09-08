import { Router, Request, Response } from 'express';
import { authMiddleware } from '../authMiddleware.js';
import pool from '../db/dbConnection.js';

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
        res.json({ data: clipData });
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
            [userId, title, clipUrl, JSON.stringify(timestamps)]
        );

        const newClip = result.rows[0];
        res.status(201).json({ message: 'Clip created successfully', data: newClip });
    } catch (error) {
        console.error('Error creating clip:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
});

router.put('/clips/update/:clipId', async (req: Request, res: Response) => {
    const { clipId } = req.params;
    const { title, timestamps } = req.body;
    const userId = req.user?.id;

    try {
        const result = await pool.query(
            'UPDATE clips SET title = $1, timestamps = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
            [title, JSON.stringify(timestamps), clipId, userId]
        );

        const updatedClip = result.rows[0];
        res.json({ message: 'Clip updated successfully', data: updatedClip });
    } catch (error) {
        console.error('Error updating clip:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;