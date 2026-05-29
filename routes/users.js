const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const [[user]] = await db.execute(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [req.params.id]
    );
    if (!user) return res.status(404).json({ error: 'User not found' });

    const [posts] = await db.execute(
      `SELECT p.id, p.title, p.content, p.created_at,
              COUNT(c.id) AS comment_count
       FROM posts p LEFT JOIN comments c ON p.id = c.post_id
       WHERE p.author_id = ?
       GROUP BY p.id
       ORDER BY p.created_at DESC`,
      [req.params.id]
    );
    res.json({ ...user, posts });
  } catch {
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

module.exports = router;
