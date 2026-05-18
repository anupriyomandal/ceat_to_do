import dotenv from 'dotenv';
dotenv.config();

let db;
let isPostgres = false;

if (process.env.DATABASE_URL) {
  const { Pool } = await import('pg');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false },
  });
  isPostgres = true;

  const init = async () => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        due_date TEXT,
        priority TEXT CHECK(priority IN ('low','medium','high')),
        status TEXT CHECK(status IN ('todo','in-progress','done')),
        category TEXT,
        created_at TEXT NOT NULL,
        completed_at TEXT
      )
    `);

    const { rows } = await pool.query("SELECT COUNT(*) FROM categories");
    if (parseInt(rows[0].count, 10) === 0) {
      const defaults = [
        { id: 'work', name: 'Work' },
        { id: 'personal', name: 'Personal' },
        { id: 'urgent', name: 'Urgent' },
        { id: 'ceat-projects', name: 'CEAT Projects' },
      ];
      for (const c of defaults) {
        await pool.query(
          'INSERT INTO categories (id, name) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [c.id, c.name]
        );
      }
    }
  };

  await init();

  db = {
    async query(sql, params = []) {
      const result = await pool.query(sql, params);
      return result.rows;
    },
    async run(sql, params = []) {
      await pool.query(sql, params);
    },
    async get(sql, params = []) {
      const result = await pool.query(sql, params);
      return result.rows[0] || null;
    },
    async all(sql, params = []) {
      const result = await pool.query(sql, params);
      return result.rows;
    },
    isPostgres: true,
  };
} else {
  let Database;
  try {
    Database = (await import('better-sqlite3')).default;
  } catch {
    throw new Error(
      'SQLite is not available. Please install better-sqlite3 (npm install better-sqlite3) or set DATABASE_URL to use PostgreSQL.'
    );
  }
  const sqlite = new Database('./data.sqlite');
  sqlite.pragma('journal_mode = WAL');

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    )
  `);
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      due_date TEXT,
      priority TEXT CHECK(priority IN ('low','medium','high')),
      status TEXT CHECK(status IN ('todo','in-progress','done')),
      category TEXT,
      created_at TEXT NOT NULL,
      completed_at TEXT
    )
  `);

  const count = sqlite.prepare('SELECT COUNT(*) as count FROM categories').get();
  if (count.count === 0) {
    const insert = sqlite.prepare('INSERT INTO categories (id, name) VALUES (?, ?)');
    const defaults = [
      ['work', 'Work'],
      ['personal', 'Personal'],
      ['urgent', 'Urgent'],
      ['ceat-projects', 'CEAT Projects'],
    ];
    for (const [id, name] of defaults) {
      try { insert.run(id, name); } catch {}
    }
  }

  db = {
    query(sql, params = []) {
      const stmt = sqlite.prepare(sql);
      if (/^\s*SELECT/i.test(sql)) {
        return stmt.all(...params);
      }
      return stmt.run(...params);
    },
    run(sql, params = []) {
      sqlite.prepare(sql).run(...params);
    },
    get(sql, params = []) {
      return sqlite.prepare(sql).get(...params) || null;
    },
    all(sql, params = []) {
      return sqlite.prepare(sql).all(...params);
    },
    isPostgres: false,
  };
}

export default db;
