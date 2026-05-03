import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { settings } from './storage.js';

// Routes
import authRoutes from './routes/auth.js';
import videosRoutes from './routes/videos.js';
import uploadRoutes from './routes/upload.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
// Ensure directories exist
const dataDir = path.resolve(__dirname, '..', process.env.DATA_DIR || 'data');
const uploadsDir = path.resolve(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));
app.use(express.static(path.join(__dirname, '../dist')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videosRoutes);
app.use('/api/upload', uploadRoutes);

// Get settings
app.get('/api/settings', (req, res) => {
  try {
    const allSettings = settings.getAll();
    res.json(allSettings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update settings
app.post('/api/settings', (req, res) => {
  try {
    const { key, value } = req.body;
    const result = settings.update(key, value);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Data stored at ${path.join(dataDir, '*.json')}`);
});

export default app;
