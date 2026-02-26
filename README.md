# Task Manager Backend

A secure, RESTful API built with **Node.js**, **Express**, and **Supabase**. This project implements a multi-tenant task management system where data isolation is enforced through JWT-based ownership validation.

## Key Features
- **User Authentication:** Registration and Login using `bcrypt` for password hashing and `jsonwebtoken` (JWT) for session management.
- **Ownership Validation:** Custom middleware and route logic ensure users can only access projects and tasks they own.
- **Relational Mapping:** Optimized PostgreSQL schema with Foreign Keys and Cascade Deletes.
- **Environment Management:** Uses `dotenv` for secure configuration.
- **Developer Workflow:** Pre-configured with `nodemon` for automated server restarts.

## Tech Stack
- **Runtime:** Node.js (ES6 Modules)
- **Framework:** Express.js
- **Database:** Supabase (PostgreSQL)
- **Security:** JSON Web Tokens (JWT) & Bcrypt

## 📋 Database Schema
To set up the database, run the following in your Supabase SQL Editor:
-- Users table

create table users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password text not null,
  role text default 'member',
  created_at timestamp default now()
);

-- Projects table
create table projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  owner_id uuid references users(id) on delete cascade,
  created_at timestamp default now()
);

-- Tasks table
create table tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text default 'todo',
  priority text default 'medium',
  due_date date,
  project_id uuid references projects(id) on delete cascade,
  assigned_to uuid references users(id),
  created_at timestamp default now()
);

-- Ensure projects.description has a default empty string
ALTER TABLE projects
ALTER COLUMN description SET DEFAULT '';

## API Endpoints

**Auth**
- POST /api/auth/register → register a new user
- POST /api/auth/login → login and get JWT token

**Projects**
- POST /api/projects/ → create project
- GET /api/projects/ → get all your projects
- PUT /api/projects/:id → update project (owner only)
- DELETE /api/projects/:id → delete project (owner only)

**Tasks**
- POST /api/tasks/ → create task (must own project)
- GET /api/tasks/:projectId → get all tasks for a project (owner only)

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-link>
   cd task-manager-backend

2. **Install dependencies** 
   ```
   npm install
   ```

3. **Environment Variables**
 Create a .env file in the project root:

   ```
   PORT=5000
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the server**
    ```
    Development: npm run dev (uses nodemon)
    Production: npm start
    ```

## Example Request & Response

**Register User:**

```
POST /api/auth/register
Content-Type: application/json

{
  "name": "Shreys",
  "email": "shreya@gmail.com",
  "password": "321456"
}
```

**Response:**

```
{
  "id": "c7673aaf-edf2-4cf8-bc39-dd7cee3958be",
  "name": "Shreys",
  "email": "shreya@gmail.com",
  "role": "member"
}
```