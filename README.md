# ✨ The Inkwell  https://the-inkwell.onrender.com/

A full-stack blogging platform built with **HTML, CSS, JavaScript, Node.js, Express.js, and MySQL**. The Inkwell allows users to register, log in, create blog posts, edit their content, search posts, and engage through comments.

---

## 📖 Overview

The Inkwell is a modern blog application that provides a complete blogging experience with authentication, post management, commenting, user profiles, and search functionality.

This project demonstrates full-stack web development concepts including:

- User Authentication using JWT
- Password Hashing with bcrypt
- RESTful API Development
- MySQL Database Integration
- CRUD Operations
- Search Functionality
- Responsive Frontend Design

---

## 🚀 Features

### 👤 User Authentication
- User Registration
- User Login
- JWT-based Authentication
- Secure Password Hashing using bcrypt
- Protected Routes

### 📝 Blog Posts
- Create New Posts
- View All Posts
- View Individual Posts
- Edit Own Posts
- Delete Own Posts
- Recent Posts Section

### 💬 Comments
- Add Comments to Posts
- View Comments
- User-based Comment Tracking

### 🔍 Search
- Search Posts by:
  - Title
  - Content

### 📊 Dashboard Statistics
- Total Posts Count
- Total Comments Count
- Recently Published Posts

### 👨‍💻 User Profile
- View User Information
- Track Created Content

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla JS)

### Backend
- Node.js
- Express.js

### Database
- MySQL

### Authentication
- JSON Web Tokens (JWT)
- bcryptjs

### Other Tools
- dotenv
- cors
- nodemon

---

## 📂 Project Structure

```text
inkwell-mysql/
│
├── public/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── create-post.html
│   ├── edit-post.html
│   ├── post.html
│   ├── profile.html
│   ├── search.html
│   │
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       ├── api.js
│       ├── main.js
│       ├── login.js
│       ├── register.js
│       ├── create-post.js
│       ├── edit-post.js
│       ├── post.js
│       ├── profile.js
│       ├── search.js
│       └── nav.js
│
├── routes/
│   ├── auth.js
│   ├── posts.js
│   └── users.js
│
├── middleware/
│   └── auth.js
│
├── db.js
├── server.js
├── setup.sql
├── package.json
└── .env
```

---

## ⚙️ Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/the-inkwell.git

cd the-inkwell
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Create MySQL Database

Run:

```bash
mysql -u root -p < setup.sql
```

This creates:

- users table
- posts table
- comments table

---

### 4️⃣ Configure Environment Variables

Create a `.env` file in the root directory.

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=inkwell

JWT_SECRET=your_secret_key
```

---

### 5️⃣ Start the Application

Development Mode:

```bash
npm run dev
```

Production Mode:

```bash
npm start
```

---

## 🌐 Access the Application

Open:

```text
http://localhost:3000
```

---

## 🔑 API Endpoints

### Authentication

| Method | Endpoint |
|----------|-----------|
| POST | /api/auth/register |
| POST | /api/auth/login |
| GET | /api/auth/me |

---

### Posts

| Method | Endpoint |
|----------|-----------|
| GET | /api/posts |
| GET | /api/posts/:id |
| POST | /api/posts |
| PATCH | /api/posts/:id |
| DELETE | /api/posts/:id |
| GET | /api/posts/search |
| GET | /api/posts/stats/summary |

---

## 🗄️ Database Schema

### Users

```sql
id
username
email
password_hash
created_at
```

### Posts

```sql
id
title
content
author_id
created_at
updated_at
```

### Comments

```sql
id
content
post_id
author_id
created_at
```

---

## 🔒 Security Features

- JWT Authentication
- Password Hashing with bcrypt
- Protected API Routes
- User Ownership Validation
- Environment Variable Protection


---

## 🎯 Future Improvements

- Rich Text Editor
- Categories & Tags
- User Avatars
- Like System
- Bookmark Posts
- Dark Mode
- Email Verification
- Password Reset
- Pagination
- Admin Dashboard

---

## 📚 Learning Outcomes

This project demonstrates:

- Full Stack Development
- REST API Design
- Authentication & Authorization
- Database Relationships
- CRUD Operations
- MySQL Integration
- Frontend-Backend Communication

---

## 👩‍💻 Author

**Harshitha Nallaganti**
