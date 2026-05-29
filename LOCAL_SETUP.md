# The Inkwell — Local Setup Guide
## HTML · CSS · JavaScript · MySQL

---

## What you're getting

A full-stack blog platform built with:
- **Frontend** — plain HTML, CSS, and vanilla JavaScript (no frameworks)
- **Backend** — Node.js + Express.js REST API
- **Database** — MySQL with three tables: users, posts, comments
- **Auth** — JWT tokens + bcrypt password hashing

---

## Prerequisites

Install these before starting:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18 or newer | https://nodejs.org |
| MySQL | 8.0 or newer | https://dev.mysql.com/downloads/mysql/ |

Verify your installs:
```bash
node --version    # should print v18.x.x or higher
mysql --version   # should print mysql  Ver 8.x.x
```

---

## Step 1 — Set up the MySQL database

Open a terminal and connect to MySQL:
```bash
mysql -u root -p
```
Enter your MySQL root password when prompted. Then run:
```sql
source /path/to/inkwell-mysql/setup.sql
```
Or paste the content of `setup.sql` directly. This creates the `inkwell` database and all three tables.

Type `exit` to leave MySQL.

**Alternative — run it directly from the terminal:**
```bash
mysql -u root -p < setup.sql
```

---

## Step 2 — Configure environment variables

Copy the example env file:
```bash
cp .env.example .env
```

Open `.env` in any text editor and fill in your values:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_root_password
DB_NAME=inkwell
JWT_SECRET=replace-this-with-a-long-random-string
PORT=3000
```

**Generate a strong JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output and paste it as your `JWT_SECRET`.

---

## Step 3 — Install dependencies

In the project folder (`inkwell-mysql/`), run:
```bash
npm install
```

This installs Express, MySQL driver, JWT, bcrypt, and everything else automatically.

---

## Step 4 — Seed demo data (optional)

To populate the database with two demo accounts and some sample posts:
```bash
npm run seed
```

Demo accounts created:
| Email | Password |
|-------|----------|
| alice@example.com | password123 |
| bob@example.com | password456 |

Skip this step if you prefer to start fresh and register your own account.

---

## Step 5 — Start the server

```bash
npm start
```

You should see:
```
The Inkwell is running at http://localhost:3000
```

Open **http://localhost:3000** in your browser.

---

## Step 6 — Verify it works

| Action | Expected result |
|--------|----------------|
| Visit `http://localhost:3000` | Home page with posts list and stats |
| Click "Register" | Register form — create a new account |
| Click "Sign in" | Login form |
| Sign in with alice@example.com / password123 | Redirected to home, nav shows username |
| Click "+ New Post" | Post editor |
| Open a post | Detail page with comments section |
| Search for "MySQL" | Search results with highlighted keywords |
| Click an author name | Their profile page with all their posts |

---

## Development mode (auto-restart on file changes)

```bash
npm run dev
```

This uses `nodemon` to automatically restart the server when you edit any file.

---

## Project structure

```
inkwell-mysql/
│
├── server.js               ← Express app entry point
├── db.js                   ← MySQL connection pool
├── package.json
├── .env                    ← Your local config (not committed to git)
├── .env.example            ← Template for .env
├── setup.sql               ← Creates the database + tables
├── seed.js                 ← Inserts demo accounts and posts
│
├── middleware/
│   └── auth.js             ← JWT verification middleware
│
├── routes/
│   ├── auth.js             ← POST /api/auth/register, /login, GET /me
│   ├── posts.js            ← Full CRUD for posts + comments + search
│   └── users.js            ← GET /api/users/:id (profile)
│
└── public/                 ← All frontend files (served as static files)
    ├── index.html          ← Home page
    ├── login.html          ← Login page
    ├── register.html       ← Registration page
    ├── post.html           ← Post detail + comments
    ├── create-post.html    ← Write a new post
    ├── edit-post.html      ← Edit your post
    ├── search.html         ← Search results
    ├── profile.html        ← User profile
    │
    ├── css/
    │   └── style.css       ← All styles
    │
    └── js/
        ├── api.js          ← Fetch wrapper + token helpers (shared by all pages)
        ├── nav.js          ← Renders the navigation bar (shared by all pages)
        ├── main.js         ← Home page logic
        ├── login.js        ← Login page logic
        ├── register.js     ← Register page logic
        ├── post.js         ← Post detail + comment logic
        ├── create-post.js  ← Create post logic
        ├── edit-post.js    ← Edit post logic
        ├── search.js       ← Search results logic
        └── profile.js      ← Profile page logic
```

---

## API reference

| Method | URL | Auth required | Description |
|--------|-----|--------------|-------------|
| POST | /api/auth/register | No | Register a new user, returns JWT |
| POST | /api/auth/login | No | Login, returns JWT |
| GET | /api/auth/me | Yes | Get current user |
| GET | /api/posts | No | List all posts (newest first) |
| POST | /api/posts | Yes | Create a post |
| GET | /api/posts/:id | No | Get a post with all its comments |
| PATCH | /api/posts/:id | Yes (owner) | Edit a post |
| DELETE | /api/posts/:id | Yes (owner) | Delete a post |
| GET | /api/posts/search?q= | No | Search posts by title or content |
| GET | /api/posts/stats/summary | No | Total posts and comments count |
| POST | /api/posts/:postId/comments | Yes | Add a comment |
| DELETE | /api/posts/:postId/comments/:id | Yes (owner) | Delete a comment |
| GET | /api/users/:id | No | Get a user's profile and their posts |

---

## Database schema

```sql
users
  id            INT  AUTO_INCREMENT PRIMARY KEY
  username      VARCHAR(50)   UNIQUE NOT NULL
  email         VARCHAR(255)  UNIQUE NOT NULL
  password_hash VARCHAR(255)  NOT NULL
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP

posts
  id         INT AUTO_INCREMENT PRIMARY KEY
  title      VARCHAR(255) NOT NULL
  content    TEXT NOT NULL
  author_id  INT NOT NULL  → users.id
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

comments
  id         INT AUTO_INCREMENT PRIMARY KEY
  content    TEXT NOT NULL
  post_id    INT NOT NULL  → posts.id
  author_id  INT NOT NULL  → users.id
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

---

## Troubleshooting

**"Access denied for user" error**
Your `DB_USER` or `DB_PASSWORD` in `.env` is incorrect. Check them against what you set when installing MySQL.

**"Unknown database 'inkwell'" error**
You haven't run `setup.sql` yet. Run:
```bash
mysql -u root -p < setup.sql
```

**"Cannot find module" error**
You haven't installed packages yet. Run:
```bash
npm install
```

**Port 3000 already in use**
Change `PORT=3001` (or any free port) in your `.env` file and restart.

**JWT errors / getting logged out unexpectedly**
If you change `JWT_SECRET` in `.env`, all existing tokens become invalid. Sign out and sign back in.

**Fonts not loading**
The CSS loads Google Fonts from the internet. If you're offline, the page will fall back to Georgia/system fonts — this is cosmetic only and doesn't affect functionality.

**MySQL on Windows — "mysql" command not found**
Add MySQL to your PATH. The default install location is:
`C:\Program Files\MySQL\MySQL Server 8.0\bin`
Add this to your System Environment Variables → PATH.
