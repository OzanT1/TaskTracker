# Task Tracker

A simple full-stack task management application built with **React** (frontend) and **ASP.NET Core Minimal API** (backend) using **Entity Framework Core** and **PostgreSQL**.

---

## Features

- Create, read, update, and delete tasks (CRUD)
- Mark tasks as completed
- Tasks are automatically sorted according to priority (by status and due date)
- Responsive and clean UI with React
- Minimal API backend with CORS support
- Data persistence using PostgreSQL and EF Core

---

## Tech Stack

- **Frontend**: React + Vite, JavaScript/JSX, CSS (vanilla)
- **Backend**: ASP.NET Core, C#, Entity Framework Core, PostgreSQL

---

## Getting Started

### Prerequisites

- .NET 8 SDK
- Node.js & npm
- PostgreSQL

---

### Backend Setup

1. Navigate to the backend folder:

    ```bash
    cd TaskTracker/TaskTrackerApi
    ```

2. Update your database connection string in `appsettings.json`:

    ```json
    "ConnectionStrings": {
      "DefaultConnection": "Host=localhost;Database=tasktrackerdb;Username=YOUR_USERNAME;Password=YOUR_PASSWORD"
    }
    ```

3. Apply migrations and update the database:

    ```bash
    dotnet ef database update
    ```

4. Run the backend server:

    ```bash
    dotnet run
    ```

API will be running at `https://localhost:7051` (or your configured port).

---

### Frontend Setup

1. Navigate to the frontend folder:

    ```bash
    cd TaskTracker/TaskTrackerApp
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Run the frontend dev server:

    ```bash
    npm run dev
    ```

The React app will be served at `http://localhost:5173` by default.

---

### Using the App

- Open your browser at `http://localhost:5173`
- Add new tasks with title, description, and due date
- Edit, delete, and mark tasks as complete
- Tasks are saved and retrieved via the backend API

---

## Notes

- CORS policy is configured in the backend to allow requests from the React app during development.
- For production, consider serving the React build files from the backend.
