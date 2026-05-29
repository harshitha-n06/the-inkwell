# Free Deployment Guide — The Inkwell

## Best Free Option: Railway

Railway gives you a free Node.js server + MySQL database in one place.
No credit card required to get started.

---

### Step 1 — Push your code to GitHub

1. Create a free account at https://github.com
2. Create a new **private** repository (e.g. `the-inkwell`)
3. Inside the `inkwell-mysql/` folder on your machine, run:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/the-inkwell.git
git push -u origin main
```

---

### Step 2 — Create a Railway account

Go to https://railway.app and sign up with your GitHub account.

---

### Step 3 — Create a new project on Railway

1. Click **New Project**
2. Choose **Deploy from GitHub repo**
3. Select your `the-inkwell` repository
4. Railway will detect it is a Node.js project automatically

---

### Step 4 — Add a MySQL database

1. Inside your Railway project, click **+ New**
2. Choose **Database → MySQL**
3. Railway creates and connects a MySQL instance automatically

---

### Step 5 — Set environment variables

In your Railway project, go to your **web service → Variables** and add:

| Variable | Value |
|----------|-------|
| `DB_HOST` | (copy from Railway MySQL service → Connect → Host) |
| `DB_USER` | (copy from Railway MySQL → User) |
| `DB_PASSWORD` | (copy from Railway MySQL → Password) |
| `DB_NAME` | (copy from Railway MySQL → Database name) |
| `DB_PORT` | 3306 |
| `JWT_SECRET` | any long random string (e.g. `openssl rand -hex 32`) |
| `PORT` | 3000 |

> **Tip:** Railway also provides a `DATABASE_URL` variable you can parse,
> but setting each value individually is easier.

---

### Step 6 — Run the setup SQL on Railway

1. In Railway, open your MySQL service
2. Click **Connect → Query**
3. Paste the contents of `setup.sql` and run it

This creates your tables.

---

### Step 7 — (Optional) Seed demo data

In your Railway project's web service terminal, run:

```bash
node seed.js
```

---

### Step 8 — Deploy

Railway deploys automatically every time you push to GitHub.

Your live URL will be something like:
`https://the-inkwell-production.up.railway.app`

---

## Other Free Options

| Platform | Notes |
|----------|-------|
| **Render** | Free Node.js hosting. Use **PlanetScale** (free MySQL) or **Aiven** (free MySQL) for the database. |
| **Fly.io** | Generous free tier. Needs a `Dockerfile` (add `FROM node:20-alpine` + your start command). |
| **Cyclic** | Simple Node.js hosting. Pair with PlanetScale for MySQL. |

### Free MySQL databases (if hosting Node.js elsewhere)

| Service | Free tier |
|---------|-----------|
| **PlanetScale** | 1 database, 5 GB storage, serverless MySQL — https://planetscale.com |
| **Aiven** | 1 free MySQL service — https://aiven.io |
| **Railway** | Included with the web service |

---

## Important: Update db.js for PlanetScale

PlanetScale uses SSL. If you use PlanetScale, update `db.js`:

```js
const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port:     process.env.DB_PORT || 3306,
  ssl: { rejectUnauthorized: true },   // add this line
  waitForConnections: true,
  connectionLimit: 10,
});
```

---

## Costs

Railway free plan: **$5 free credit per month** — more than enough for a small blog.
All other options listed above: **completely free** on the tiers mentioned.
