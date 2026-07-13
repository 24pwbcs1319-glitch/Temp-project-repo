# Study Genie — Smart Study Planner

A full-stack MERN web application built for UET Peshawar students to manage study tasks, track progress, and stay focused using a Pomodoro timer.

---

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Routes](#api-routes)
- [Pages Overview](#pages-overview)
- [Team](#team)

---

## About the Project

Study Genie is a study planner web app that helps students organize their subjects and assignments, track completion progress, and use a built-in Pomodoro timer to manage study sessions effectively. It features user authentication, dark mode support, and a responsive design that works on both desktop and mobile.

---

## Features

- User registration and login with password hashing
- Protected routes — only logged-in users can access the app
- Add subjects with custom colors
- Add tasks with deadlines and link them to subjects
- Mark tasks as complete or delete them
- Color-coded deadline badges (Overdue / Due Soon / Days Left)
- Dashboard with stats cards and a bar chart showing progress per subject
- Pomodoro timer with 25-minute study and 5-minute break sessions
- Auto-cycle between study and break modes with audio beep notification
- Dark mode and light mode toggle
- Responsive layout — sidebar on desktop, bottom tab bar on mobile

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router, Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Password Hashing | bcryptjs |
| Build Tool | Vite |
| Runtime | tsx (for development) |

---

## Project Structure

```
smart-study-planner/
│
├── index.html                  # HTML shell — React mounts here
├── server.js                   # Express server entry point
├── vite.config.js              # Vite build configuration
├── package.json                # Dependencies and scripts
├── .env                        # Environment variables (not committed)
├── .env.example                # Example env file
│
├── server/                     # Backend (Node.js + Express)
│   ├── middleware/
│   │   └── auth.js             # Auth middleware — checks token on requests
│   ├── models/
│   │   ├── User.js             # User schema (name, email, password)
│   │   ├── Subject.js          # Subject schema (name, color, userId)
│   │   └── Task.js             # Task schema (title, subject, deadline, completed)
│   └── routes/
│       ├── auth.js             # Register, login, get current user
│       ├── subjects.js         # CRUD for subjects
│       └── tasks.js            # CRUD for tasks
│
└── src/                        # Frontend (React)
    ├── main.jsx                # React entry point
    ├── App.jsx                 # Routing and context setup
    ├── index.css               # Global styles and theme variables
    │
    ├── components/
    │   ├── AuthProvider.jsx    # Login state management and useAuth() hook
    │   ├── ThemeProvider.jsx   # Dark/light mode management
    │   ├── Layout.jsx          # Sidebar, nav, and page shell
    │   └── ProtectedRoute.jsx  # Redirects unauthenticated users to login
    │
    ├── pages/
    │   ├── Login.jsx           # Login page
    │   ├── Register.jsx        # Registration page
    │   ├── Dashboard.jsx       # Stats cards and subject progress chart
    │   ├── Tasks.jsx           # Task and subject management
    │   └── Timer.jsx           # Pomodoro timer
    │
    └── lib/
        └── utils.js            # cn() helper for Tailwind class merging
```

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher) — download from [https://nodejs.org](https://nodejs.org)
- A terminal (Command Prompt, PowerShell, or Terminal)

### Installation

**1. Clone or download the project**

```bash
git clone https://github.com/your-username/smart-study-planner.git
cd smart-study-planner
```

**2. Allow scripts to run (Windows PowerShell only)**

Open PowerShell as Administrator and run:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**3. Install dependencies**

```bash
npm install
```

**4. Set up environment variables**

Create a `.env` file in the root folder:

```
NODE_ENV=development
```

Leave `MONGODB_URI` empty or unset to use an automatic in-memory database for local testing. To use your own MongoDB Atlas database, add:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/SmartStudyPlanner
```

**5. Start the development server**

```bash
npm run dev
```

**6. Open in browser**

```
http://localhost:3000
```

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server (Express + Vite) |
| `npm run build` | Build frontend and bundle server for production |
| `npm start` | Run the production build |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | Yes | Set to `development` for local dev |
| `MONGODB_URI` | No | MongoDB connection string. If not set, uses in-memory database |

---

## API Routes

### Auth — `/api/auth`

| Method | Endpoint | Description | Protected |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login with email and password | No |
| GET | `/api/auth/me` | Get current logged-in user | Yes |

### Subjects — `/api/subjects`

| Method | Endpoint | Description | Protected |
|---|---|---|---|
| GET | `/api/subjects` | Get all subjects for logged-in user | Yes |
| POST | `/api/subjects` | Create a new subject | Yes |
| DELETE | `/api/subjects/:id` | Delete a subject by ID | Yes |

### Tasks — `/api/tasks`

| Method | Endpoint | Description | Protected |
|---|---|---|---|
| GET | `/api/tasks` | Get all tasks for logged-in user | Yes |
| POST | `/api/tasks` | Create a new task | Yes |
| PUT | `/api/tasks/:id` | Update a task (complete/edit) | Yes |
| DELETE | `/api/tasks/:id` | Delete a task by ID | Yes |

---

## Pages Overview

### Login `/login`
Email and password form. Sends credentials to `/api/auth/login`. On success, stores token and redirects to dashboard.

### Register `/register`
Name, email, and password form. Password must be at least 8 characters and contain uppercase, lowercase, number, and symbol. On success, auto-logs in and redirects to dashboard.

### Dashboard `/`
Shows three stat cards: tasks completion percentage, number of active subjects, and estimated hours studied. Includes a stacked bar chart showing completed vs pending tasks per subject.

### Tasks `/tasks`
Two forms: add a subject (name + color) and add a task (title + subject + deadline). Task list shows all tasks with color-coded deadline badges and checkboxes to mark complete. Hover over a task to reveal the delete button.

### Timer `/timer`
Pomodoro timer with 25-minute study and 5-minute break modes. Play/pause and reset controls. Auto-switches modes when timer ends and plays a beep sound. Visual progress fill shows time elapsed.

---

## Team

| Name | Role |
|---|---|
| Abdullah Abbasi | Backend & Server Setup |
| Saad Altaf | Database Models |
| Ahmed Bilal | API Routes |
| Ahmad Fahim | Middleware & Configuration |

> All 4 members collaborated on the React frontend together.

---

## Notes

- Authentication uses MongoDB user `_id` as a token instead of JWT. This is suitable for development and learning purposes.
- The in-memory database (used when no `MONGODB_URI` is set) resets every time the server restarts. Use MongoDB Atlas for persistent data.
- The Pomodoro timer is entirely client-side and does not save sessions to the database.