# BottleBuddy 🍾♻️

A community-driven platform for sharing and returning plastic bottles in Hungary, making recycling profitable and social.

[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://www.docker.com/)

## 🌟 Overview

BottleBuddy connects people who have bottles to return with volunteers who can help return them, splitting the 50 HUF refund per bottle. The platform makes recycling easier, more profitable, and builds community connections across Hungary.

## 📁 Project Structure

```
bottle-buddy-share/
├── backend/              # .NET 8 Web API
│   ├── src/
│   │   └── BottleBuddy.Api/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   └── BottleBuddyApi.sln
│
├── frontend/             # React + TypeScript + Vite
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
│
├── docker/               # Docker orchestration
│   ├── docker-compose.yml       # Production setup
│   ├── docker-compose.dev.yml   # Development with hot-reload
│   ├── Dockerfile               # Frontend production image
│   ├── Dockerfile.dev          # Frontend dev image
│   ├── nginx.conf              # Nginx reverse proxy config
│   ├── .env.docker.example     # Environment variables template
│   ├── Makefile                # Docker shortcuts
│   └── README.md               # Detailed Docker documentation
│
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites

- **Docker & Docker Compose** (recommended)
- OR manually:
  - Node.js 18+
  - .NET 8 SDK
  - PostgreSQL 16

### Setup with Docker (Recommended)

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd bottle-buddy-share
   ```

2. **Create environment file:**
   ```bash
   cp .env.example docker/.env
   # Edit docker/.env with your configuration (see Google OAuth Setup below)
   ```

3. **Start all services:**
   ```bash
   cd docker
   docker-compose up -d
   ```

4. **Access the application:**
   - 🌐 Frontend: http://localhost:8080
   - 🔌 Backend API: http://localhost:3668
   - 📚 API Documentation (Swagger): http://localhost:3668/swagger
   - 🔍 Jaeger Tracing UI: http://localhost:16686
   - 🗄️ PostgreSQL: localhost:5432

### Google OAuth Setup

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Navigate to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen
6. Add authorized redirect URIs:
   - `http://localhost:8080`
   - `http://localhost:3668`
7. Copy **Client ID** and **Client Secret** to `docker/.env`

## 🏗️ Tech Stack

### Backend
- **.NET 8** with ASP.NET Core
- **PostgreSQL 16** with Entity Framework Core
- **ASP.NET Core Identity** for user management
- **JWT** + **Google OAuth** authentication
- **OpenTelemetry** + **Jaeger** for distributed tracing
- **Swagger/OpenAPI** for API documentation

### Frontend
- **React 18** with **TypeScript**
- **Vite** for fast builds and HMR
- **TanStack Query** (React Query) for data fetching
- **React Router** for navigation
- **Tailwind CSS** + **shadcn/ui** components
- **Leaflet** for interactive maps
- **Lucide Icons**

### Infrastructure
- **Docker** with multi-stage builds
- **Docker Compose** for orchestration
- **Nginx** as reverse proxy
- **PostgreSQL 16** Alpine
- **Jaeger** all-in-one for tracing

## 📋 Features

### ✅ Implemented
- User authentication (email/password + Google OAuth)
- User profiles with ratings
- Create and browse bottle listings
- Interactive map view with markers
- Responsive design (mobile & desktop)
- Real-time data updates
- Automatic database migrations
- API documentation
- Distributed tracing
- Error handling and logging

### 🚧 In Progress
- Pickup request workflow
- In-app messaging
- Push notifications
- Payment integration

### 📝 Planned
- Advanced search and filters
- User verification system
- Rating and review system
- Transaction history
- Admin dashboard
- Mobile app (React Native)

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/google-signin` - Google OAuth sign-in
- `GET /api/auth/me` - Get current user profile

### Bottle Listings
- `GET /api/bottlelistings` - Get all listings (paginated)
- `GET /api/bottlelistings/{id}` - Get specific listing
- `POST /api/bottlelistings` - Create new listing (auth required)
- `PUT /api/bottlelistings/{id}` - Update listing (auth required)
- `DELETE /api/bottlelistings/{id}` - Delete listing (auth required)

For complete API documentation, visit **http://localhost:3668/swagger** after starting the application.

## 🔧 Development

### Backend Development

```bash
cd backend/src/BottleBuddy.Api

# Run the API
dotnet run

# Create a new migration
dotnet ef migrations add YourMigrationName

# Update database
dotnet ef database update
```

### Frontend Development

For hot-reloading during development:

```bash
cd frontend
npm install
npm run dev
# Visit http://localhost:5173
```

### Database Access

```bash
# Connect to PostgreSQL
docker exec -it bottlebuddy-db psql -U postgres -d bottlebuddy

# View tables
\dt

# View table structure
\d "BottleListings"
```

### View Logs

```bash
cd docker

# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f frontend
docker-compose logs -f db
```

### Rebuild Everything

```bash
cd docker
docker-compose down
docker-compose build
docker-compose up -d
```

## 🐛 Troubleshooting

### Port Already in Use

If ports are already occupied:

```bash
# Windows
netstat -ano | findstr ":3668"
netstat -ano | findstr ":8080"

# Linux/Mac
lsof -i :3668
lsof -i :8080

# Modify docker-compose.yml or stop conflicting services
```

### Database Migrations Not Applied

Migrations run automatically on startup. Check logs:

```bash
docker-compose logs api | grep -i migration
```

### Frontend Build Errors

```bash
cd docker
docker-compose build frontend --no-cache
docker-compose up -d frontend
```

### Clear All Data and Restart

```bash
cd docker
docker-compose down -v  # WARNING: Deletes all data!
docker-compose up -d
```

## 🗄️ Database Schema

### Key Tables

- **AspNetUsers** - User accounts (Identity)
- **Profiles** - Extended user profiles
- **BottleListings** - Bottle collection posts
- **PickupRequests** - Volunteer pickup offers
- **Transactions** - Completed exchanges
- **Ratings** - User reviews

## 🌍 Environment Variables

See `.env.example` for all required variables.

**Required:**
- `DB_PASSWORD` - PostgreSQL password
- `JWT_SECRET` - JWT signing key (min 32 characters)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

**Optional:**
- `ASPNETCORE_ENVIRONMENT` - Development/Production (default: Development)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 💬 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Made with 💚 in Hungary | **Turn bottles into community connections**
