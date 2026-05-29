const bcrypt = require('bcryptjs');
const db = require('./db');

async function seed() {
  console.log('Seeding database...');

  const aliceHash = await bcrypt.hash('password123', 10);
  const bobHash   = await bcrypt.hash('password456', 10);

  await db.execute(
    'INSERT IGNORE INTO users (username, email, password_hash) VALUES (?, ?, ?)',
    ['alice', 'alice@example.com', aliceHash]
  );
  await db.execute(
    'INSERT IGNORE INTO users (username, email, password_hash) VALUES (?, ?, ?)',
    ['bob', 'bob@example.com', bobHash]
  );

  const [[alice]] = await db.execute('SELECT id FROM users WHERE email = ?', ['alice@example.com']);
  const [[bob]]   = await db.execute('SELECT id FROM users WHERE email = ?', ['bob@example.com']);

  const posts = [
    {
      title: 'Getting Started with HTML and CSS',
      content: `HTML (HyperText Markup Language) is the standard markup language for web pages. Every website you visit is built on HTML at its core — it defines the structure and meaning of content.

CSS (Cascading Style Sheets) works alongside HTML to control how that content looks: colors, fonts, spacing, layout, and animations. Together they are the foundation of every web page.

Here is a simple example:

  <h1>Hello, World!</h1>
  <p style="color: blue;">This text is blue.</p>

Start with the basics, and you will be building beautiful web pages in no time.`,
      author_id: alice.id,
    },
    {
      title: 'Why JavaScript is Essential for Web Development',
      content: `JavaScript is the world's most popular programming language and the only language that runs natively in web browsers. While HTML and CSS define structure and style, JavaScript brings interactivity.

With JavaScript you can:
- Respond to user actions (clicks, keypresses, form submissions)
- Fetch data from APIs without reloading the page
- Update the DOM dynamically
- Build full server-side applications with Node.js

Every modern web application — from Google Maps to Gmail — relies heavily on JavaScript. Learning it opens the door to full-stack development.`,
      author_id: bob.id,
    },
    {
      title: 'Introduction to MySQL Databases',
      content: `MySQL is the world's most popular open-source relational database. It stores data in tables with rows and columns — just like a spreadsheet — and lets you query that data using SQL (Structured Query Language).

Key concepts:
- Tables: where data lives (users, posts, orders, etc.)
- Rows: individual records
- Columns: the fields each record has
- Joins: combining data from multiple tables
- Indexes: speeding up queries on large datasets

A simple query looks like this:

  SELECT * FROM users WHERE email = 'alice@example.com';

MySQL is used by Facebook, Twitter, YouTube, and thousands of other applications. It is an excellent choice for any project.`,
      author_id: alice.id,
    },
  ];

  const postIds = [];
  for (const p of posts) {
    const [result] = await db.execute(
      'INSERT IGNORE INTO posts (title, content, author_id) VALUES (?, ?, ?)',
      [p.title, p.content, p.author_id]
    );
    if (result.insertId) {
      postIds.push(result.insertId);
    } else {
      const [[existing]] = await db.execute('SELECT id FROM posts WHERE title = ?', [p.title]);
      postIds.push(existing.id);
    }
  }

  const comments = [
    { post_id: postIds[0], author_id: bob.id,   content: 'Great introduction! HTML and CSS are definitely the building blocks of the web.' },
    { post_id: postIds[0], author_id: alice.id,  content: 'Thank you! I hope it helps beginners get started on their web journey.' },
    { post_id: postIds[1], author_id: alice.id,  content: 'Absolutely agree. JavaScript has become indispensable in modern web development.' },
    { post_id: postIds[1], author_id: bob.id,    content: 'Node.js being mentioned here is key — JavaScript everywhere!' },
    { post_id: postIds[2], author_id: bob.id,    content: 'MySQL is my go-to for almost every project. Solid and reliable.' },
    { post_id: postIds[2], author_id: alice.id,  content: 'Great overview. The JOIN explanation really helped me understand relational databases better.' },
  ];

  for (const c of comments) {
    await db.execute(
      'INSERT IGNORE INTO comments (content, post_id, author_id) VALUES (?, ?, ?)',
      [c.content, c.post_id, c.author_id]
    );
  }

  console.log('Done! Demo accounts:');
  console.log('  alice@example.com / password123');
  console.log('  bob@example.com   / password456');

  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
