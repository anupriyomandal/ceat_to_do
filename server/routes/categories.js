import { Router } from 'express';
import db from '../db.js';

const router = Router();

function rowToCategory(row) {
  return {
    id: row.id,
    name: row.name,
  };
}

router.get('/', async (_req, res) => {
  try {
    const rows = await db.all('SELECT * FROM categories ORDER BY name');
    res.json(rows.map(rowToCategory));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const id = crypto.randomUUID();

    if (db.isPostgres) {
      await db.run('INSERT INTO categories (id, name) VALUES ($1, $2)', [id, name.trim()]);
    } else {
      db.run('INSERT INTO categories (id, name) VALUES (?, ?)', [id, name.trim()]);
    }

    const row = db.isPostgres
      ? await db.get('SELECT * FROM categories WHERE id = $1', [id])
      : db.get('SELECT * FROM categories WHERE id = ?', [id]);

    res.status(201).json(rowToCategory(row));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (db.isPostgres) {
      await db.run('UPDATE tasks SET category = $1 WHERE category = $2', ['', id]);
      await db.run('DELETE FROM categories WHERE id = $1', [id]);
    } else {
      db.run('UPDATE tasks SET category = ? WHERE category = ?', ['', id]);
      db.run('DELETE FROM categories WHERE id = ?', [id]);
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
