import cors from 'cors';
import express from 'express';
import db from '../server/config/db.js';

const app = express();


app.use(cors());

app.get('/fetch-banner-data', async (req, res) => {
    try {
        const [rows, fields] = await db.query('SELECT * FROM tbl_banner ORDER BY id DESC');
        if (rows.length > 0) {
            res.json(rows);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
