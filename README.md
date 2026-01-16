# project1

A full-stack job portal application with Next.js frontend and NestJS backend.

## Features

- User registration and authentication
- Job posting and application system
- Blog management
- Admin panel
- Responsive design

## Tech Stack

### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- React Query
- React Hook Form

### Backend
- NestJS
- TypeScript
- MikroORM
- SQL Server
- JWT Authentication
- Swagger API documentation

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn or pnpm
- SQL Server

### Installation

1. Clone the repository
```bash
git clone https://github.com/hoangtuanphong1a/project1.git
cd project1
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables
   - Copy `backend/.env.example` to `backend/.env`
   - Update database connection settings

5. Start the backend
```bash
cd backend
npm run start:dev
```

6. Start the frontend (in a new terminal)
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3002
- API Documentation: http://localhost:3002/docs

## Project Structure

```
project1/
├── backend/          # NestJS API server
│   ├── src/
│   │   ├── modules/  # Feature modules
│   │   ├── entities/ # Database entities
│   │   └── common/   # Shared utilities
│   └── test/         # E2E tests
└── frontend/         # Next.js client application
    ├── src/
    │   ├── app/      # Next.js app router
    │   ├── components/ # Reusable components
    │   └── apis/     # API client
    └── public/       # Static assets
