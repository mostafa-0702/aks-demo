const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
app.use(cors());
app.use(express.json());

// Connexion SQL depuis Secret Kubernetes
const sqlConfig = {
  connectionString: process.env.SQL_CONNECTION_STRING,
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', hostname: require('os').hostname() });
});

// GET tous les utilisateurs
app.get('/api/users', async (req, res) => {
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request()
      .query('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST créer un utilisateur
app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'name et email requis' });
  }
  try {
    const pool = await sql.connect(sqlConfig);
    await pool.request()
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .query('INSERT INTO users (name, email) VALUES (@name, @email)');
    res.status(201).json({ message: 'Utilisateur créé', name, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE supprimer un utilisateur
app.delete('/api/users/:id', async (req, res) => {
  try {
    const pool = await sql.connect(sqlConfig);
    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM users WHERE id = @id');
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test connexion SQL
app.get('/api/test-db', async (req, res) => {
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request().query('SELECT GETDATE() AS time');
    res.json({ status: 'Azure SQL connecté ✅', time: result.recordset[0].time });
  } catch (err) {
    res.status(500).json({ status: 'Erreur SQL ❌', error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Backend démarré sur port ${PORT}`));
