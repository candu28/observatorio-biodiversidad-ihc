import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { syncRouter } from './controllers/SyncController';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/sync', syncRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
