# Blog Backend API

A scalable blog backend built with FastAPI, SQLModel, and PostgreSQL. Features session-based authentication and a clean, modular architecture.

## Features

- **FastAPI**: Modern, fast web framework for building APIs
- **SQLModel**: Type-safe database models with Pydantic integration
- **PostgreSQL**: Robust database with UUID primary keys
- **Session-based Authentication**: Secure user authentication with sessions
- **Modular Architecture**: Clean separation of concerns with controllers, services, and models
- **Poetry**: Modern dependency management
- **Docker Ready**: Easy containerization and deployment

## Project Structure

```
src/
├── backend/
│   ├── config/          # Configuration and database setup
│   ├── controllers/     # API route handlers
│   ├── models/          # SQLModel database models
│   ├── services/        # Business logic layer
│   ├── middleware/      # Authentication and other middleware
│   ├── utils/           # Utility functions and exceptions
│   └── main.py         # FastAPI application setup
├── start.py            # Application entry point
└── tests/              # Test files
```

## Quick Start

1. **Clone and setup the project:**
   ```bash
   git clone <repository-url>
   cd backend
   make quick-start
   ```

2. **Configure environment:**
   Edit `.env` file with your database connection details:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/blog_db
   SECRET_KEY=your-secret-key-here-change-this-in-production
   ```

3. **Create database tables:**
   ```bash
   make db-migrate
   ```

4. **Start development server:**
   ```bash
   make dev
   ```

The API will be available at `http://localhost:8000` with interactive docs at `http://localhost:8000/docs`.

## Available Commands

- `make help` - Show all available commands
- `make dev` - Run in development mode with auto-reload
- `make run` - Run the application
- `make install` - Install dependencies
- `make test` - Run tests
- `make lint` - Run linting checks
- `make format` - Format code
- `make clean` - Clean cache and build files

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user and create session
- `POST /auth/logout` - Logout user and delete session
- `GET /auth/me` - Get current user information
- `POST /auth/logout-all` - Logout from all sessions

### Users
- `GET /users/` - List users (with pagination)
- `GET /users/{user_id}` - Get user by ID
- `PUT /users/{user_id}` - Update user profile
- `DELETE /users/{user_id}` - Delete user

### Health Check
- `GET /health` - Application health check
- `GET /` - API information

## Authentication

The API uses session-based authentication with HTTP-only cookies. After successful login, a session token is stored in a secure cookie and used for subsequent requests.

### Login Example

```bash
curl -X POST "http://localhost:8000/auth/login" \
     -H "Content-Type: application/json" \
     -d '{"username": "your_username", "password": "your_password"}'
```

### Using the session

The session cookie is automatically included in subsequent requests. For API clients, you can also use the Bearer token:

```bash
curl -X GET "http://localhost:8000/auth/me" \
     -H "Authorization: Bearer <session_token>"
```

## Database Schema

The application uses a PostgreSQL database with the following main tables:

- **users** - User accounts and profiles
- **user_sessions** - Active user sessions
- **roles** & **permissions** - Role-based access control (future use)

See `reference.sql` for the complete database schema.

## Development

### Environment Setup

1. Make sure you have Python 3.12+ and Poetry installed
2. Run `make install` to install dependencies
3. Copy `.env.example` to `.env` and configure your settings
4. Set up a PostgreSQL database
5. Run `make db-migrate` to create tables

### Code Style

This project uses:
- **Black** for code formatting
- **isort** for import sorting  
- **flake8** for linting
- **mypy** for type checking

Run `make format` to format code and `make lint` to check for issues.

### Adding New Features

1. Create models in `src/backend/models/`
2. Implement business logic in `src/backend/services/`
3. Add API endpoints in `src/backend/controllers/`
4. Register new routers in `src/backend/main.py`

## Deployment

### Environment Variables

Required environment variables for production:

```env
DATABASE_URL=postgresql://user:password@host:port/database
SECRET_KEY=your-very-secure-secret-key
DEBUG=False
HOST=0.0.0.0
PORT=8000
SESSION_EXPIRE_HOURS=24
```

### Running in Production

```bash
# Install dependencies
poetry install --without dev

# Run with gunicorn (install separately)
gunicorn backend.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.