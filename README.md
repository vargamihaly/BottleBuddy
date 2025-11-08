# BottleBuddy 🍾♻️

A community-driven platform for sharing and returning plastic bottles in Hungary, making recycling profitable and social.

[![.NET](https://img.shields.io/badge/.NET-9.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://www.docker.com/)
[![Tests](https://img.shields.io/badge/Tests-106%20Passing-success?logo=xunit)](https://github.com/xunit/xunit)

## 🌟 Overview

BottleBuddy connects people who have bottles to return with volunteers who can help return them, splitting the 50 HUF refund per bottle. The platform makes recycling easier, more profitable, and builds community connections across Hungary.

## 📁 Project Structure

```
bottle-buddy-share/
├── backend/              # .NET 9 Web API
│   ├── src/
│   │   ├── BottleBuddy.Api/
│   │   └── BottleBuddy.Application/
│   ├── tests/
│   │   └── BottleBuddy.Tests/  # xUnit tests (106 tests)
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
- **TanStack Query** (React Query) for data fetching & caching
- **TanStack Query Devtools** for debugging queries
- **React Router** for navigation
- **Tailwind CSS** + **shadcn/ui** components
- **Leaflet** + **React Leaflet** for interactive maps
- **Lucide Icons**
- **React Hook Form** + **Zod** for form validation
- **Google OAuth** (@react-oauth/google)
- **Sonner** for toast notifications

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
- Delete bottle listings
- Interactive map view with markers
- Responsive design (mobile & desktop)
- Real-time data updates (React Query)
- Automatic database migrations
- API documentation
- Distributed tracing
- Error handling and logging
- **Pickup request workflow** (create, accept, reject, complete, cancel)
- **Rating and review system** (rate users after completed transactions)
- **Transaction history** (view all transactions, transaction details)
- **Platform statistics** (total bottles, HUF shared, active users)
- **User dashboard** (stats, earnings, recent activity)
- **My Listings management** (view and manage user's listings)
- **My Pickup Tasks** (active and completed pickups with status tracking)
- **In-app messaging system**
  - Dedicated `/messages` page with two-panel layout (conversation list + chat interface)
  - Pickup-request-scoped conversations (messages tied to specific pickup requests)
  - **Real-time updates via WebSockets/SignalR** - instant message delivery without polling
  - **Image sharing** - share photos of bottles, proof of pickup, and location landmarks
    - Auto-resize and compress images (max 1920x1920px, 5MB limit)
    - Supports JPG, JPEG, PNG, GIF formats
    - Full-screen image viewer with download functionality
    - Lazy loading for performance
  - **Typing indicators** - "User is typing..." with animated dots
    - Debounced to prevent spam (500ms delay)
    - Auto-stop after 3 seconds of inactivity
    - Real-time updates via SignalR
  - **Enhanced read receipts** - "Delivered" vs "Read" status with timestamps
    - ✓ Delivered (gray) - message sent but not read
    - ✓✓ Read (green) - message read with relative time ("Read 2m")
    - Tooltips show absolute timestamp on hover
    - Real-time status updates via SignalR
  - Unread message badges across the platform (header, listing cards, conversation list)
  - Auto-scroll to latest messages and auto-mark as read
  - Character limit (1000 chars) with visual counter
  - Message input with Enter-to-send and Shift+Enter for new lines
  - Shows sender info (avatar, name, timestamp)
  - Different styling for own vs other messages
  - Mobile-responsive with full-screen chat on small devices
  - Authorization: only pickup request participants can view/send messages
  - Cascade delete: messages automatically deleted when pickup request is deleted
  - Empty states for no conversations and no messages
  - Conversation filtering: shows only active conversations (pending/accepted status)

### 🚧 In Progress
- Push notifications
- Payment integration

### 📝 Planned
- Advanced search and filters
- User verification system
- Admin dashboard
- Mobile app (React Native)

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/google-signin` - Google OAuth sign-in
- `GET /api/auth/me` - Get current user profile

### Bottle Listings
- `GET /api/bottlelistings` - Get all listings (paginated, filterable by status)
- `POST /api/bottlelistings` - Create new listing (auth required)
- `DELETE /api/bottlelistings/{id}` - Delete listing (auth required)

### Pickup Requests
- `POST /api/pickuprequests` - Create pickup request (auth required)
- `GET /api/pickuprequests/listing/{listingId}` - Get requests for a listing (auth required)
- `GET /api/pickuprequests/my-requests` - Get current user's pickup requests (auth required)
- `PATCH /api/pickuprequests/{id}/status` - Update request status (auth required)

### Transactions
- `GET /api/transactions/my-transactions` - Get user's transaction history (auth required)
- `GET /api/transactions/pickup-request/{pickupRequestId}` - Get transaction by pickup request (auth required)
- `POST /api/transactions` - Create transaction (auth required, auto-triggered on pickup completion)

### Ratings
- `POST /api/ratings` - Create rating for completed transaction (auth required)
- `GET /api/ratings/user/{userId}` - Get all ratings for a user
- `GET /api/ratings/transaction/{transactionId}` - Get user's rating for a transaction (auth required)

### Statistics
- `GET /api/statistics` - Get platform statistics (total bottles, HUF shared, active users)

### Messages
- `POST /api/pickuprequests/{pickupRequestId}/messages` - Send message in pickup request conversation (auth required)
- `GET /api/pickuprequests/{pickupRequestId}/messages` - Get all messages for pickup request (auth required)
- `PATCH /api/pickuprequests/{pickupRequestId}/messages/mark-all-read` - Mark all messages as read (auth required)
- `GET /api/pickuprequests/{pickupRequestId}/messages/unread-count` - Get unread count for pickup request (auth required)
- `GET /api/messages/unread-count` - Get total unread message count across all conversations (auth required)
- `PATCH /api/messages/{messageId}/read` - Mark specific message as read (auth required)

For complete API documentation, visit **http://localhost:3668/swagger** after starting the application.

## 🔄 Pickup Request Workflow

The complete bottle exchange workflow:

1. **Listing Creation** - User creates a bottle listing with location and details
2. **Pickup Request** - Volunteer sends a pickup request with optional message
3. **Request Review** - Listing owner can accept or reject the request
4. **Pickup Completion** - Either party can mark the pickup as completed
5. **Transaction Created** - System automatically creates a transaction record
6. **Rating Exchange** - Both parties can rate each other after completion

**Status Flow:**
- Pickup Request: `pending` → `accepted` → `completed` (or `rejected`/`cancelled`)
- Bottle Listing: `open` → `claimed` → `completed` (or `cancelled`)
- Transaction: Auto-created when pickup status changes to `completed`

## 💬 Messaging System

The in-app messaging system enables seamless communication between bottle listing owners and volunteers during the pickup coordination process.

### How It Works

1. **Message Access** - Only participants in a pickup request can send/view messages
   - Listing owners can message volunteers who requested their bottles
   - Volunteers can message owners of bottles they're picking up

2. **Conversation Scoping** - Messages are scoped to specific pickup requests
   - Each pickup request has its own independent conversation thread
   - Same two users can have multiple conversations (for different pickup requests)

3. **Message Creation** - Users can send text and/or images through:
   - Dedicated `/messages` page with full conversation view
   - Direct "Message" button on bottle listing cards
   - Image uploads: photos of bottles, proof of pickup, location landmarks
   - Text messages (1-1000 characters)

4. **Real-time Updates** - Instant communication via WebSockets/SignalR
   - Instant message delivery without page refresh
   - Real-time typing indicators ("User is typing...")
   - Live read receipts with timestamps
   - Automatic reconnection on connection loss
   - Group-based messaging (conversation-scoped events)

5. **Image Sharing**
   - Upload photos directly in chat (JPG, PNG, GIF - max 5MB)
   - Auto-resize and compress (max 1920x1920px, 85% quality)
   - Click to view full-screen with download option
   - Lazy loading for performance

6. **Typing Indicators**
   - Shows when other user is actively typing
   - Animated bouncing dots
   - Debounced (500ms) to prevent spam
   - Auto-stops after 3 seconds of inactivity
   - Immediate stop when message sent

7. **Enhanced Read Receipts**
   - ✓ Delivered (gray) - message sent but not read
   - ✓✓ Read (green) - message opened with timestamp
   - Relative time display ("Read 2m", "Read 5h")
   - Hover tooltip shows absolute timestamp
   - Real-time status updates across all devices

8. **Read Status Tracking**
   - Messages marked as read automatically after 1 second of viewing
   - Unread badges shown on header, listing cards, and conversation list
   - Total unread count across all conversations displayed in header

9. **Conversation Lifecycle**
   - Messages persist throughout the pickup request lifecycle
   - Conversations automatically filtered by status (only active: pending/accepted)
   - Messages and images cascade deleted when pickup request is deleted
   - Chat disabled after pickup is completed/rejected/cancelled

### Technical Details

- **Backend**: ASP.NET Core with Entity Framework + SignalR
- **Real-time**: SignalR MessageHub with WebSocket connections
- **Database**: Messages table with foreign keys to PickupRequests and Users
  - Columns: Id, PickupRequestId, SenderId, Content, ImageUrl, ImageFileName, IsRead, ReadAtUtc, CreatedAtUtc
- **Image Storage**: Local file system (wwwroot/uploads/messages/) with SixLabors.ImageSharp processing
- **Authorization**: Endpoint-level checks ensure only participants can access
- **Validation**: 1-1000 character limit with input validation, image type/size validation
- **Frontend**: React with TanStack Query for caching + @microsoft/signalr for WebSockets
- **UI Components**: ChatBox, ChatMessage, MessageInput, ConversationList, ReadReceipt, TypingIndicator, ImagePreview, ImageModal
- **Libraries**: date-fns for timestamp formatting, lucide-react for icons

### Future Enhancements

Potential improvements planned for the messaging system:
- Quick reply templates for common messages ("On my way", "Running late", etc.)
- Push notifications for new messages
- Location sharing integration with existing Leaflet maps
- Voice messages for complex directions
- Message reactions (emoji reactions like 👍, ❤️, ✅)
- Online/offline status indicators
- Message search functionality
- Conversation archiving for completed pickups

## 🌐 Frontend Pages

### Public Routes
- `/` - Home page with hero section, statistics, available bottles, and map view
- `/auth` - Authentication page (login/register with email or Google OAuth)
- `/auth/success` - OAuth callback success page
- `/about` - About page

### Protected Routes (Auth Required)
- `/create-listing` - Create a new bottle listing
- `/my-listings` - View and manage user's bottle listings
- `/my-pickup-tasks` - View active and completed pickup tasks (with status tabs)
- `/messages` - Dedicated messaging page with conversation list and chat interface

### In-App Views (Accessible from Home)
- **User Dashboard** - View user stats, earnings, recent activity, and profile
- **Map View** - Interactive map showing all bottle listings with markers

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

**React Query Devtools:**
The TanStack Query Devtools are automatically available in development mode. Look for the TanStack logo in the bottom-left corner of your browser to inspect queries, mutations, and cache state.

### Testing

The backend includes comprehensive unit tests using xUnit, Moq, and FluentAssertions.

**Test Project Location:** `backend/tests/BottleBuddy.Tests`

**Run All Tests:**
```bash
cd backend/tests/BottleBuddy.Tests
dotnet test
```

**Run Tests with Detailed Output:**
```bash
dotnet test --verbosity detailed
```

**Run Specific Test Class:**
```bash
dotnet test --filter "FullyQualifiedName~MessageServiceTests"
```

**Run Tests with Code Coverage:**
```bash
dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=opencover
```

**Test Coverage:**
- **MessageServiceTests** (31 tests) - Messaging logic, SignalR integration, authorization
- **ImageStorageServiceTests** (18 tests) - Image upload, validation, resizing, storage
- **PickupRequestServiceTests** (23 tests) - Pickup request CRUD, status management, authorization
- **TransactionServiceTests** (17 tests) - Transaction creation, refund calculations
- **RatingServiceTests** (17 tests) - Rating validation, average calculations

**Total Tests:** 106 (All passing ✅)

**Testing Stack:**
- **xUnit** - Test framework
- **Moq** - Mocking framework for dependencies
- **FluentAssertions** - Expressive assertions
- **InMemory Database** - Fast, isolated database tests

**Test Patterns:**
- AAA (Arrange-Act-Assert) pattern
- Independent test isolation
- Comprehensive coverage of happy paths and edge cases
- Authorization and validation testing
- Business logic verification

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

- **AspNetUsers** - User accounts (ASP.NET Core Identity)
- **Profiles** - Extended user profiles (username, full name, phone, avatar, ratings)
- **BottleListings** - Bottle collection posts with location and status
- **PickupRequests** - Volunteer pickup offers with status tracking (pending/accepted/rejected/completed/cancelled)
- **Transactions** - Completed exchanges with refund amounts (auto-created when pickup completes)
- **Ratings** - User reviews (1-5 stars with optional comments, linked to transactions)
- **Messages** - In-app messages scoped to pickup requests (with read status tracking, cascade deleted with pickup request)

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
