import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import adRoutes from './routes/adRoutes';
import pool from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api", adRoutes);

app.get('/api/test-db', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS result');
        res.json({ 
            success: true, 
            message: 'Database connected successfully!',
            data: rows 
        });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Database connection failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running smoothly on port ${PORT}`);
    console.log(`Database is connected via MySQL2`);
});