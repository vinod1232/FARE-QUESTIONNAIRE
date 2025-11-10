require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test database connection
pool.getConnection()
  .then(conn => {
    console.log('Connected to MariaDB!');
    conn.release();
  })
  .catch(err => {
    console.error('Error connecting to MariaDB:', err);
  });

// Example route to fetch all questions with options
app.get('/api/questions', async (req, res) => {
  try {
    const [questions] = await pool.query('SELECT * FROM Questions');
    const [options] = await pool.query('SELECT * FROM QuestionOptions');

    // Combine questions with their options
    const result = questions.map(q => ({
      ...q,
      options: options.filter(o => o.question_id === q.question_id)
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
