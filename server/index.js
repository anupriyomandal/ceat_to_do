import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import tasksRouter from './routes/tasks.js';
import categoriesRouter from './routes/categories.js';
import postsRouter from './routes/posts.js';
import transcribeRouter from './routes/transcribe.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API routes
app.use('/api/tasks', tasksRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/posts', postsRouter);
app.use('/api/transcribe', transcribeRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Serve static files from dist (production build)
app.use(express.static(path.join(__dirname, '../dist')));

// Fallback to index.html for SPA routes
app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`CEAT Task Manager server running on port ${PORT}`);
});
