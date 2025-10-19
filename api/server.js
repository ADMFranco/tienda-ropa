// server.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors()); // permitir peticiones desde tu frontend
app.use(express.json());

// Conexión a Postgres vía DATABASE_URL (Render provee esta variable)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Endpoint simple: lista de productos desde DB (o desde un array si quieres)
app.get('/api/products', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name, price, image FROM products ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Endpoint de ejemplo: registrar usuario (muy simple; no encriptar en prototipo)
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'faltan campos' });
  try {
    await pool.query('INSERT INTO users(name,email,password) VALUES($1,$2,$3)', [name, email, password]);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'no se pudo crear usuario' });
  }
});

// Healthcheck
app.get('/health', (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on ${port}`));
