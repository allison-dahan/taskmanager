# Task Manager Application

A modern task management application built with React, TypeScript, and Hono. Features include drag-and-drop task organization, user authentication with Clerk, and real-time task updates.

## Features

- 🔐 User authentication with Clerk
- 📋 Create, update, and delete tasks
- 🔄 Drag-and-drop task status management
- 📱 Responsive design
- 🎯 Task status tracking (pending/completed)
- 📅 Due date management

## Tech Stack

### Frontend
- React with TypeScript
- TanStack Router for routing
- shadcn/ui for UI components
- @hello-pangea/dnd for drag and drop
- Clerk for authentication
- TanStack Query for caching and managing task data across the app.

### Backend
- Hono for API server
- Drizzle ORM with PostgreSQL for schema definition and database operations
- Zod for validation
- Clerk for authentication

## Prerequisites

- Bun (latest version)
- PostgreSQL (v14 or higher)
- Clerk account for authentication

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Environment Variables

#### Frontend (.env in packages/client)
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:3000
```

#### Backend (.env in packages/server)
```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/taskdb
CLERK_SECRET_KEY=your_clerk_secret_key
```

### 4. Database Setup

```bash
# Create database
createdb taskdb

# Run migrations (if needed)
cd packages/server
bun run migrate
```

### 5. Start Development Server

```bash
# Start both frontend and backend
bun run dev
```

This will concurrently run:
- Frontend at http://localhost:5173
- Backend at http://localhost:3000

## Project Structure

```
├── packages/
│   ├── client/              # Frontend React application
│   │   ├── src/
│   │   │   ├── components/  # React components
│   │   │   ├── routes/      # TanStack Router routes
│   │   │   └── types/       # TypeScript definitions
│   │   └── ...
│   └── server/              # Backend Hono application
│       ├── src/
│       │   ├── routes/      # API routes
│       │   ├── services/    # Business logic
│       │   └── db/          # Database schemas and migrations
│       └── ...
```

## Available Scripts

```bash
# Development
bun run dev              # Start both frontend and backend
bun run dev:frontend     # Start only frontend
bun run dev:backend      # Start only backend

# Build
bun run build           # Build both frontend and backend
bun run build:frontend  # Build frontend
bun run build:backend   # Build backend

# Type Checking
bun run typecheck      # Run TypeScript checks

# Clean
bun run clean         # Clean build artifacts
```

## API Routes

### Tasks

- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PATCH /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Authentication

This application uses Clerk for authentication. To set up:

1. Create a Clerk application at https://dashboard.clerk.dev
2. Configure your application with the required OAuth providers
3. Add the Clerk keys to your environment variables

## Development Considerations

### CORS Configuration

The backend is configured to accept requests from `http://localhost:5173` by default. Update the CORS configuration in `packages/server/src/index.ts` if needed.

### Type Safety

- Use TypeScript consistently across both frontend and backend
- Keep types synchronized between frontend and backend
- Use Zod schemas for API validation


## License

This project is licensed under the MIT License - see the LICENSE file for details.