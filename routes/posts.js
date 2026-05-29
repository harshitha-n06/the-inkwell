const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/posts/stats/summary  — must be before /:id
router.get('/stats/summary', async (req, res) => {
  try {
    const [[{ total_posts }]] = await db.execute('SELECT COUNT(*) AS total_posts FROM posts');
    const [[{ total_comments }]] = await db.execute('SELECT COUNT(*) AS total_comments FROM comments');
    const [recent] = await db.execute(
      `SELECT p.id, p.title, p.created_at, u.username AS author_name
       FROM posts p JOIN users u ON p.author_id = u.id
       ORDER BY p.created_at DESC LIMIT 5`
    );
    res.json({ totalPosts: total_posts, totalComments: total_comments, recentPosts: recent });
  } catch {
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// GET /api/posts/search?q=  — must be before /:id
router.get('/search', async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.json([]);
  try {
    const like = `%${q}%`;
    const [rows] = await db.execute(
      `SELECT p.id, p.title, p.content, p.created_at,
              u.id AS author_id, u.username AS author_name,
              COUNT(c.id) AS comment_count
       FROM posts p
       JOIN users u ON p.author_id = u.id
       LEFT JOIN comments c ON p.id = c.post_id
       WHERE p.title LIKE ? OR p.content LIKE ?
       GROUP BY p.id
       ORDER BY p.created_at DESC`,
      [like, like]
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Search failed' });
  }
});

// GET /api/posts
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT p.id, p.title, p.content, p.created_at,
              u.id AS author_id, u.username AS author_name,
              COUNT(c.id) AS comment_count
       FROM posts p
       JOIN users u ON p.author_id = u.id
       LEFT JOIN comments c ON p.id = c.post_id
       GROUP BY p.id
       ORDER BY p.created_at DESC`
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Failed to get posts' });
  }
});

// POST /api/posts
router.post('/', requireAuth, async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  try {
    const [result] = await db.execute(
      'INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)',
      [title.trim(), content.trim(), req.user.userId]
    );
    const [[post]] = await db.execute(
      `SELECT p.id, p.title, p.content, p.created_at,
              u.id AS author_id, u.username AS author_name
       FROM posts p JOIN users u ON p.author_id = u.id WHERE p.id = ?`,
      [result.insertId]
    );
    res.status(201).json(post);
  } catch {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// GET /api/posts/:id
router.get('/:id', async (req, res) => {
  try {
    const [[post]] = await db.execute(
      `SELECT p.id, p.title, p.content, p.created_at, p.updated_at,
              u.id AS author_id, u.username AS author_name
       FROM posts p JOIN users u ON p.author_id = u.id WHERE p.id = ?`,
      [req.params.id]
    );
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const [comments] = await db.execute(
      `SELECT c.id, c.content, c.created_at,
              u.id AS author_id, u.username AS author_name
       FROM comments c JOIN users u ON c.author_id = u.id
       WHERE c.post_id = ? ORDER BY c.created_at ASC`,
      [req.params.id]
    );
    res.json({ ...post, comments });
  } catch {
    res.status(500).json({ error: 'Failed to get post' });
  }
});

// PATCH /api/posts/:id
router.patch('/:id', requireAuth, async (req, res) => {
  const { title, content } = req.body;
  try {
    const [[post]] = await db.execute('SELECT author_id FROM posts WHERE id = ?', [req.params.id]);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author_id !== req.user.userId) return res.status(403).json({ error: 'Not authorized' });

    await db.execute(
      'UPDATE posts SET title = COALESCE(?, title), content = COALESCE(?, content) WHERE id = ?',
      [title || null, content || null, req.params.id]
    );
    const [[updated]] = await db.execute(
      `SELECT p.id, p.title, p.content, p.created_at,
              u.id AS author_id, u.username AS author_name
       FROM posts p JOIN users u ON p.author_id = u.id WHERE p.id = ?`,
      [req.params.id]
    );
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// DELETE /api/posts/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const [[post]] = await db.execute('SELECT author_id FROM posts WHERE id = ?', [req.params.id]);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author_id !== req.user.userId) return res.status(403).json({ error: 'Not authorized' });
    await db.execute('DELETE FROM posts WHERE id = ?', [req.params.id]);
    res.json({ message: 'Post deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// POST /api/posts/:postId/comments
router.post('/:postId/comments', requireAuth, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Comment content is required' });
  try {
    const [result] = await db.execute(
      'INSERT INTO comments (content, post_id, author_id) VALUES (?, ?, ?)',
      [content.trim(), req.params.postId, req.user.userId]
    );
    const [[comment]] = await db.execute(
      `SELECT c.id, c.content, c.created_at,
              u.id AS author_id, u.username AS author_name
       FROM comments c JOIN users u ON c.author_id = u.id WHERE c.id = ?`,
      [result.insertId]
    );
    res.status(201).json(comment);
  } catch {
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// DELETE /api/posts/:postId/comments/:commentId
router.delete('/:postId/comments/:commentId', requireAuth, async (req, res) => {
  try {
    const [[comment]] = await db.execute('SELECT author_id FROM comments WHERE id = ?', [req.params.commentId]);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (comment.author_id !== req.user.userId) return res.status(403).json({ error: 'Not authorized' });
    await db.execute('DELETE FROM comments WHERE id = ?', [req.params.commentId]);
    res.json({ message: 'Comment deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

module.exports = router;
