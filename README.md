# Agent Core Platform

A comprehensive, modular agentic platform built with **NestJS**, **React**, **LangChain**, and **PostgreSQL**. This platform provides a complete foundation for developing, managing, and deploying intelligent agents with extensible tooling and prompt management.

## Project Structure

```
agent_core/
├── backend/                  # NestJS backend API
│   ├── src/                 # Backend source code
│   │   ├── agents/          # Agent framework core
│   │   ├── modules/         # Feature modules
│   │   ├── config/          # Configuration
│   │   ├── infrastructure/  # Database layer
│   │   ├── common/          # Shared utilities
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   └── health.controller.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── README.md            # Backend setup
│
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Page components
│   │   ├── api/             # API services
│   │   ├── store/           # State management
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   ├── Dockerfile
│   └── README.md            # Frontend setup
│
├── docker-compose.yml       # Full stack orchestration
├── .env.example             # Environment template
├── .gitignore
├── README.md                # This file
└── rules.md                 # Project conventions
```

### Structure Notes

- **Monorepo with Independent Packages**: The `backend/` and `frontend/` directories are completely independent and self-contained. Each has its own:
  - `package.json` with dependencies
  - Build configuration (tsconfig.json, Dockerfile, etc.)
  - ESLint and Prettier configs
  - README with setup instructions

- **Orchestration**: The root `docker-compose.yml` is used only for local development to wire up both services with PostgreSQL and Redis.

- **Future Separation**: Each package can be easily extracted into its own repository when needed, as they have no shared build configuration.

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd agent_core

# Copy environment variables
cp .env.example .env

# Start all services
docker-compose up -d

# Services available at:
# - Backend API: http://localhost:3000
# - API Docs: http://localhost:3000/api
# - Frontend: http://localhost:3001
# - PostgreSQL: localhost:5432
# - Redis: localhost:6379

# Stop services
docker-compose down
```

### Local Development

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install --legacy-peer-deps

# Set up environment variables
cp ../.env.example .env

# Start PostgreSQL and Redis (using Docker)
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:15-alpine
docker run -d -p 6379:6379 redis:7-alpine

# Start the backend in development mode
npm run start:dev

# Backend available at http://localhost:3000
# API documentation at http://localhost:3000/api
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Frontend available at http://localhost:3001
```

## Features

### Agent Framework
- Extensible BaseAgent class for custom agents
- Tool registry with built-in tools (calculator, time, string operations)
- Agent registry for discovery and management
- Execution lifecycle management

### Management Modules
- **Agents**: Full CRUD operations for agents
- **Tools**: Tool management and assignment
- **AgentRuns**: Execution tracking and history

### Database
- PostgreSQL with TypeORM
- Normalized schema design
- Type-safe queries
- Migration support

### API
- 20+ REST endpoints
- Input validation with DTOs
- Swagger/OpenAPI documentation
- Error standardization

### Frontend
- React 18 with TypeScript
- Responsive Tailwind CSS design
- Zustand state management
- Axios API integration
- Mobile-friendly navigation

### DevOps
- Docker containerization
- Docker Compose orchestration
- Environment management
- Health checks

## Technology Stack

| Category | Technology |
|----------|-----------|
| **Backend** | NestJS 10, Node.js 18, TypeORM, PostgreSQL |
| **Frontend** | React 18, TypeScript, Tailwind CSS, Zustand, Vite |
| **Agent Framework** | LangChain |
| **Database** | PostgreSQL 15 |
| **Cache** | Redis 7 |
| **DevOps** | Docker, Docker Compose |

## Documentation

- **Backend**: See [backend/README.md](backend/README.md)
- **Frontend**: See [frontend/README.md](frontend/README.md)
- **Architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md)
- **Development**: See [DEVELOPMENT.md](DEVELOPMENT.md)
- **API Reference**: See [API.md](API.md)
- **Project Conventions**: See [rules.md](rules.md)

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=agent_core

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=3600

# LLM
OPENAI_API_KEY=sk-...
LANGCHAIN_API_KEY=...

# Logging
LOG_LEVEL=debug
```

## Development Workflow

1. Create feature branch: `git checkout -b feature/my-feature`
2. Follow project conventions in `rules.md`
3. Write code and tests
4. Run linting: `npm run lint`
5. Build and test: `npm run build && npm test`
6. Create pull request for review

## Common Commands

### Backend

```bash
cd backend

# Build
npm run build

# Development
npm run start:dev

# Production
npm run start:prod

# Database migrations
npm run db:migrate:run
npm run db:migrate:generate -- -n MigrationName

# Testing
npm test
npm run test:cov
```

### Frontend

```bash
cd frontend

# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview

# Linting
npm run lint
npm run format
```

## Deployment

### Docker

```bash
# Build images
docker-compose build

# Deploy
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Railway

1. Connect your GitHub repository
2. Configure environment variables
3. Set build command: `npm install && npm run build`
4. Set start command: `npm run start:prod`
5. Deploy!

## API Endpoints Overview

### Agents
- `GET /agents` - List agents
- `POST /agents` - Create agent
- `GET /agents/:id` - Get agent details
- `PUT /agents/:id` - Update agent
- `DELETE /agents/:id` - Delete agent

### Tools
- `GET /tools` - List tools
- `POST /tools` - Create tool
- `GET /tools/:id` - Get tool details
- `PUT /tools/:id` - Update tool
- `DELETE /tools/:id` - Delete tool
- `GET /tools/active/list` - Get active tools

### Agent Runs
- `GET /agent-runs` - List runs
- `POST /agent-runs` - Create run
- `GET /agent-runs/:id` - Get run details
- `GET /agent-runs/agent/:agentId` - Get runs for agent

### Health
- `GET /health` - Health check

## Troubleshooting

### Port Already in Use

```bash
# Change port for backend
PORT=3002 npm run start:dev

# Change port for frontend
npm run dev -- --port 3002
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Reset database
docker-compose down -v
docker-compose up -d postgres
```

### Module Not Found Errors

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [LangChain Documentation](https://python.langchain.com)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

## License

MIT License

## Support

For issues and questions, please create an issue on the repository.
