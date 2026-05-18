import { Router } from 'express';
import db from '../db.js';

const router = Router();

function rowToPost(row) {
  return {
    id: row.id,
    content: row.content,
    createdAt: row.created_at,
  };
}

router.get('/', async (_req, res) => {
  try {
    const rows = await db.all('SELECT * FROM posts ORDER BY created_at DESC');
    res.json(rows.map(rowToPost));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) {
      return res.status(400).json({ error: 'Content is required' });
    }
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    if (db.isPostgres) {
      await db.run(
        'INSERT INTO posts (id, content, created_at) VALUES ($1, $2, $3)',
        [id, content.trim(), createdAt]
      );
    } else {
      db.run(
        'INSERT INTO posts (id, content, created_at) VALUES (?, ?, ?)',
        [id, content.trim(), createdAt]
      );
    }

    const row = db.isPostgres
      ? await db.get('SELECT * FROM posts WHERE id = $1', [id])
      : db.get('SELECT * FROM posts WHERE id = ?', [id]);

    res.status(201).json(rowToPost(row));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (db.isPostgres) {
      await db.run('DELETE FROM posts WHERE id = $1', [id]);
    } else {
      db.run('DELETE FROM posts WHERE id = ?', [id]);
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

export default router;
