import { Router } from 'express';
import db from '../db.js';

const router = Router();

function rowToTask(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    dueDate: row.due_date || undefined,
    priority: row.priority,
    status: row.status,
    category: row.category || '',
    assignedFrom: row.assigned_from || undefined,
    assignedTo: row.assigned_to || undefined,
    createdAt: row.created_at,
    completedAt: row.completed_at || undefined,
  };
}

router.get('/', async (_req, res) => {
  try {
    const rows = await db.all('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(rows.map(rowToTask));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, category, assignedFrom, assignedTo } = req.body;
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    if (db.isPostgres) {
      await db.run(
        `INSERT INTO tasks (id, title, description, due_date, priority, status, category, assigned_from, assigned_to, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [id, title, description || '', dueDate || null, priority, status, category || '', assignedFrom || null, assignedTo || null, createdAt]
      );
    } else {
      db.run(
        `INSERT INTO tasks (id, title, description, due_date, priority, status, category, assigned_from, assigned_to, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, title, description || '', dueDate || null, priority, status, category || '', assignedFrom || null, assignedTo || null, createdAt]
      );
    }

    const row = db.isPostgres
      ? await db.get('SELECT * FROM tasks WHERE id = $1', [id])
      : db.get('SELECT * FROM tasks WHERE id = ?', [id]);

    res.status(201).json(rowToTask(row));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, priority, status, category, assignedFrom, assignedTo } = req.body;

    const updates = [];
    const params = [];

    if (title !== undefined) { updates.push('title = ?'); params.push(title); }
    if (description !== undefined) { updates.push('description = ?'); params.push(description); }
    if (dueDate !== undefined) { updates.push('due_date = ?'); params.push(dueDate || null); }
    if (priority !== undefined) { updates.push('priority = ?'); params.push(priority); }
    if (status !== undefined) { updates.push('status = ?'); params.push(status); }
    if (category !== undefined) { updates.push('category = ?'); params.push(category); }
    if (assignedFrom !== undefined) { updates.push('assigned_from = ?'); params.push(assignedFrom || null); }
    if (assignedTo !== undefined) { updates.push('assigned_to = ?'); params.push(assignedTo || null); }
    if (status === 'done') { updates.push('completed_at = ?'); params.push(new Date().toISOString()); }
    if (status === 'todo' || status === 'in-progress') { updates.push('completed_at = ?'); params.push(null); }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(id);
    const sql = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;

    if (db.isPostgres) {
      const pgSql = sql.replace(/\?/g, (__, i) => `$${i + 1}`);
      await db.run(pgSql, params);
    } else {
      db.run(sql, params);
    }

    const row = db.isPostgres
      ? await db.get('SELECT * FROM tasks WHERE id = $1', [id])
      : db.get('SELECT * FROM tasks WHERE id = ?', [id]);

    res.json(rowToTask(row));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (db.isPostgres) {
      await db.run('DELETE FROM tasks WHERE id = $1', [id]);
    } else {
      db.run('DELETE FROM tasks WHERE id = ?', [id]);
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

router.post('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const row = db.isPostgres
      ? await db.get('SELECT * FROM tasks WHERE id = $1', [id])
      : db.get('SELECT * FROM tasks WHERE id = ?', [id]);

    if (!row) return res.status(404).json({ error: 'Task not found' });

    const isDone = row.status === 'done';
    const newStatus = isDone ? 'todo' : 'done';
    const completedAt = isDone ? null : new Date().toISOString();

    if (db.isPostgres) {
      await db.run('UPDATE tasks SET status = $1, completed_at = $2 WHERE id = $3', [newStatus, completedAt, id]);
    } else {
      db.run('UPDATE tasks SET status = ?, completed_at = ? WHERE id = ?', [newStatus, completedAt, id]);
    }

    const updated = db.isPostgres
      ? await db.get('SELECT * FROM tasks WHERE id = $1', [id])
      : db.get('SELECT * FROM tasks WHERE id = ?', [id]);

    res.json(rowToTask(updated));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to toggle task' });
  }
});

router.post('/:id/move', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const completedAt = status === 'done' ? new Date().toISOString() : null;

    if (db.isPostgres) {
      await db.run('UPDATE tasks SET status = $1, completed_at = $2 WHERE id = $3', [status, completedAt, id]);
    } else {
      db.run('UPDATE tasks SET status = ?, completed_at = ? WHERE id = ?', [status, completedAt, id]);
    }

    const row = db.isPostgres
      ? await db.get('SELECT * FROM tasks WHERE id = $1', [id])
      : db.get('SELECT * FROM tasks WHERE id = ?', [id]);

    res.json(rowToTask(row));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to move task' });
  }
});

router.post('/bulk-delete', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No IDs provided' });
    }

    if (db.isPostgres) {
      await db.run(`DELETE FROM tasks WHERE id = ANY($1)`, [ids]);
    } else {
      const placeholders = ids.map(() => '?').join(',');
      db.run(`DELETE FROM tasks WHERE id IN (${placeholders})`, ids);
    }

    res.json({ success: true, deleted: ids.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to bulk delete' });
  }
});

router.post('/bulk-complete', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No IDs provided' });
    }

    const completedAt = new Date().toISOString();

    if (db.isPostgres) {
      await db.run(
        `UPDATE tasks SET status = 'done', completed_at = $1 WHERE id = ANY($2)`,
        [completedAt, ids]
      );
    } else {
      const placeholders = ids.map(() => '?').join(',');
      db.run(`UPDATE tasks SET status = 'done', completed_at = ? WHERE id IN (${placeholders})`, [completedAt, ...ids]);
    }

    res.json({ success: true, updated: ids.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to bulk complete' });
  }
});

router.post('/import', async (req, res) => {
  try {
    const { tasks, categories } = req.body;

    if (categories && Array.isArray(categories)) {
      for (const cat of categories) {
        try {
          if (db.isPostgres) {
            await db.run(
              'INSERT INTO categories (id, name) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name',
              [cat.id, cat.name]
            );
          } else {
            db.run('INSERT OR REPLACE INTO categories (id, name) VALUES (?, ?)', [cat.id, cat.name]);
          }
        } catch {}
      }
    }

    if (tasks && Array.isArray(tasks)) {
      for (const task of tasks) {
        try {
          if (db.isPostgres) {
            await db.run(
              `INSERT INTO tasks (id, title, description, due_date, priority, status, category, assigned_from, assigned_to, created_at, completed_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
               ON CONFLICT (id) DO UPDATE SET
                 title = EXCLUDED.title,
                 description = EXCLUDED.description,
                 due_date = EXCLUDED.due_date,
                 priority = EXCLUDED.priority,
                 status = EXCLUDED.status,
                 category = EXCLUDED.category,
                 assigned_from = EXCLUDED.assigned_from,
                 assigned_to = EXCLUDED.assigned_to,
                 completed_at = EXCLUDED.completed_at`,
              [
                task.id,
                task.title,
                task.description || '',
                task.dueDate || null,
                task.priority,
                task.status,
                task.category || '',
                task.assignedFrom || null,
                task.assignedTo || null,
                task.createdAt,
                task.completedAt || null,
              ]
            );
          } else {
            db.run(
              `INSERT OR REPLACE INTO tasks (id, title, description, due_date, priority, status, category, assigned_from, assigned_to, created_at, completed_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                task.id,
                task.title,
                task.description || '',
                task.dueDate || null,
                task.priority,
                task.status,
                task.category || '',
                task.assignedFrom || null,
                task.assignedTo || null,
                task.createdAt,
                task.completedAt || null,
              ]
            );
          }
        } catch {}
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to import data' });
  }
});

router.post('/clear', async (_req, res) => {
  try {
    if (db.isPostgres) {
      await db.run('DELETE FROM tasks');
      await db.run('DELETE FROM categories');
    } else {
      db.run('DELETE FROM tasks');
      db.run('DELETE FROM categories');
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to clear data' });
  }
});

export default router;
