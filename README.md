# Task Manager

A full-stack task management application with user authentication, CRUD operations, and AI-powered priority suggestions.

## Features

- User authentication (signup/login)
- Create, read, update, and delete tasks
- Task properties: title, description, deadline, priority, status
- Filter tasks by status (completed/pending) and priority (low/medium/high)
- AI-powered priority suggestion based on task text
- Real-time dashboard with task statistics
- Responsive design with Tailwind CSS

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Vite for build tooling
- Lucide React for icons

### Backend
- Supabase Edge Functions (Node.js/Deno)
- RESTful API architecture

### Database
- Supabase (PostgreSQL)
- Row Level Security (RLS) for data protection

## Project Structure

```
src/
├── components/          # React components
│   ├── Auth.tsx        # Authentication UI
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Header.tsx      # App header
│   ├── TaskCard.tsx    # Individual task display
│   └── TaskModal.tsx   # Task creation/editing modal
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── lib/                # Utility libraries
│   └── supabase.ts     # Supabase client setup
├── services/           # API services
│   └── taskService.ts  # Task CRUD operations
├── types/              # TypeScript types
│   └── task.ts         # Task type definitions
├── App.tsx             # Main app component
└── main.tsx            # App entry point

supabase/
└── functions/          # Edge Functions
    ├── tasks/          # Task CRUD API
    └── suggest-priority/ # AI priority suggestion
```

## Database Schema

### Tasks Table
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to auth.users)
- `title` (text)
- `description` (text)
- `deadline` (timestamptz)
- `priority` (text: 'low', 'medium', 'high')
- `status` (text: 'pending', 'completed')
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

## API Endpoints

### Tasks API (`/functions/v1/tasks`)
- `GET /tasks` - Get all tasks (supports ?status=pending&priority=high filters)
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

### AI Priority Suggestion API (`/functions/v1/suggest-priority`)
- `POST /suggest-priority` - Get priority suggestion based on task text

## Getting Started

The application is already set up and ready to use. The database and Edge Functions are deployed and configured.

### Running the Application

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

Build the application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Usage

1. **Sign Up/Login**: Create a new account or sign in with existing credentials
2. **Create Tasks**: Click "New Task" to add tasks with title, description, deadline, priority, and status
3. **AI Priority Suggestion**: Click "AI Suggest" when creating/editing a task to get an intelligent priority recommendation
4. **Manage Tasks**:
   - Toggle task completion by clicking the circle icon
   - Edit tasks using the edit button
   - Delete tasks using the trash button
5. **Filter Tasks**: Use the dropdown filters to view tasks by status or priority
6. **View Statistics**: Dashboard shows total, completed, and pending task counts

## Security

- All API endpoints require authentication
- Row Level Security (RLS) ensures users can only access their own tasks
- JWT tokens are used for secure authentication
- Passwords are securely hashed by Supabase Auth

## AI Priority Suggestion Logic

The AI priority suggestion analyzes task titles and descriptions for keywords:
- **High Priority**: Detects urgent keywords like "urgent", "asap", "critical", "deadline", "today"
- **Low Priority**: Detects flexible keywords like "maybe", "someday", "optional"
- **Medium Priority**: Default for standard tasks

## Validation

- Email and password validation on signup/login
- Required fields enforced (title for tasks)
- Password minimum length: 6 characters
- Task priority and status constrained to valid values
