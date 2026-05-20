require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const jsYaml = require('js-yaml');
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Sou o Projeto de Node + Express!');
});


// Lê o arquivo YAML e converte para objeto JavaScript
const swaggerFilePath = path.join(__dirname, 'swagger.yaml');
const swaggerDocument = jsYaml.load(fs.readFileSync(swaggerFilePath, 'utf8'));

// Configura a rota da documentação
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Create (POST)
app.post('/users', async (req, res) => {
    try {
        const { name, email } = req.body;
        const query = 'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *';
        const values = [name, email];
        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// Read (GET)
app.get('/users', async (req, res) => {
    try {
        const query = 'SELECT * FROM users';
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// Update (PUT)
app.put('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { name, email } = req.body;
        const query = 'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *';
        const values = [name, email, id];
        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// Delete (DELETE)
app.delete('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = 'DELETE FROM users WHERE id = $1';
        const result = await pool.query(query, [id]);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/posts', (req, res) => {
    res.send([{
        "id": 1,
        "titulo": "Lançamento do novo sistema",
        "descricao": "Confira as novidades do…",
        "autor": "Maria Silva",
        "dataPublicacao": "2026-04-28",
        "fotoAutor": "https://..."
    },
    {
        "id": 1,
        "titulo": "Lançamento do novo sistema",
        "descricao": "Confira as novidades do…",
        "autor": "Maria Silva",
        "dataPublicacao": "2026-04-28",
        "fotoAutor": "https://..."
    },
    {
        "id": 1,
        "titulo": "Lançamento do novo sistema",
        "descricao": "Confira as novidades do…",
        "autor": "Maria Silva",
        "dataPublicacao": "2026-04-28",
        "fotoAutor": "https://..."
    }]
    );
});

app.listen(3000, () => {
    console.log(` running at http://localhost:3000`);
});
