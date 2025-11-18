# BottleBuddy 🍾♻️

A community-driven platform for sharing and returning plastic bottles in Hungary, making recycling profitable and social.

[![.NET](https://img.shields.io/badge/.NET-9.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-2022-CC2927?logo=microsoftSqlServer)](https://www.microsoft.com/sql-server)
[![Azure](https://img.shields.io/badge/Azure-Deploy-0078D4?logo=microsoftazure)](https://azure.microsoft.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://www.docker.com/)
[![Tests](https://img.shields.io/badge/Tests-106%20Passing-success?logo=xunit)](https://github.com/xunit/xunit)

## 🌟 Overview

BottleBuddy connects people who have bottles to return with volunteers who can help return them, splitting the 50 HUF refund per bottle. The platform makes recycling easier, more profitable, and builds community connections across Hungary.

**🌐 Live Demo:** https://victorious-water-0d5f77603.3.azurestaticapps.net/

## 📁 Project Structure

```
BottleBuddy/
├── backend/              # .NET 9 Web API + application layer
│   ├── src/
│   │   ├── BottleBuddy.Api/
│   │   └── BottleBuddy.Application/
│   ├── tests/
│   │   └── BottleBuddy.Tests/   # xUnit tests (106 tests)
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   └── BottleBuddyApi.sln
│
├── frontend/             # React + TypeScript + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── api/
│   │   └── pages/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── docs/                 # Architecture & feature documentation
│   ├── README.md         # This file
│   └── frontend.md       # Detailed frontend guide
│
├── docker/               # Docker orchestration & frontend image
│   ├── docker-compose.yml
│   ├── docker-compose.dev.yml
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── nginx.conf
│   ├── .env.docker.example
│   └── README.md
│
├── infrastructure/       # IaC (Bicep, Terraform, GitHub Actions helpers)
└── scripts/              # Utility scripts (migrations, seeding, etc.)
```

## 🚀 Quick Start

### Prerequisites

- **Docker & Docker Compose** (recommended)
- OR manually:
  - Node.js 18+
  - .NET 9.0 SDK
  - SQL Server 2022 (or Azure SQL Database)

### Setup with Docker (Recommended)

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd BottleBuddy
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
   - 🗄️ SQL Server: localhost:1433

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
- **.NET 9.0** with ASP.NET Core
- **SQL Server 2022** (or Azure SQL Database) with Entity Framework Core 9.0
- **SignalR** for real-time WebSocket communication
- **ASP.NET Core Identity** for user management
- **JWT** + **Google OAuth** authentication
- **SendGrid** for transactional email notifications
- **SixLabors.ImageSharp** for image processing and optimization
- **Serilog** for structured logging with Application Insights integration
- **OpenTelemetry** + **Jaeger** for distributed tracing
- **Swagger/OpenAPI** for API documentation

### Frontend
- **React 18** with **TypeScript**
- **Vite** for fast builds and HMR
- **TanStack Query v5** (React Query) for data fetching & caching
- **TanStack Query Devtools** for debugging queries
- **@microsoft/signalr** for real-time WebSocket connections
- **React Router v6** for navigation
- **react-i18next** for internationalization (English/Hungarian)
- **Tailwind CSS** + **shadcn/ui** components
- **Leaflet** + **React Leaflet** for interactive maps
- **Lucide Icons**
- **React Hook Form** + **Zod** for authentication flows; controlled inputs for listing creation
- **Google OAuth** (@react-oauth/google)
- **Sonner** for toast notifications
- **date-fns** for date/time formatting

### Infrastructure
- **Docker** with multi-stage builds
- **Docker Compose** for orchestration
- **Nginx** as reverse proxy
- **SQL Server 2022** for local development
- **Azure** for cloud hosting (production)
- **Jaeger** all-in-one for distributed tracing

## 📋 Features

### ✅ Implemented
- User authentication (email/password + Google OAuth)
- User profiles with ratings
- Create and browse bottle listings
- Delete bottle listings
- Interactive map view with markers
- Responsive design (mobile & desktop)
- Data fetching with TanStack Query (5-minute stale cache)
- Real-time messaging via SignalR hub connection
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
- **Notification System**
  - **User Activities & Notifications** - Comprehensive in-app notification system
    - `/notifications` - Dedicated notification center page with full history
    - Bell icon dropdown in header with real-time updates (30-second polling)
    - Grouped notifications: "New" (unread) and "Earlier" (read)
    - Filter by type: All, Listings, Pickups, Transactions, Ratings
    - Traditional pagination for browsing notification history
    - Mark as read/delete individual notifications
    - Mark all as read functionality
    - Unread badge count in header
    - Activity types: listing events, pickup requests, transactions, ratings
  - **Email Notifications via SendGrid** - Critical updates sent to user's email
    - Pickup request received (when someone wants to pick up your bottles)
    - Pickup request accepted (when your request is accepted)
    - Transaction completed (when you receive earnings)
    - Professional HTML email templates with responsive design
    - Plain text fallback for all emails
  - **User Settings & Preferences** - `/settings/notifications` page
    - User settings stored per user (language preference + notification preferences)
    - Preferred language setting (default: "en-US") - ready for i18n integration
    - Master email notification toggle (enable/disable all email notifications)
    - Granular email controls for each critical notification type
    - Real-time preference updates with optimistic UI
    - Auto-created on user registration with sensible defaults
    - PATCH API for partial updates

### 🚧 In Progress
- Frontend integration for notification settings page
- Frontend integration for notification center page

### 📝 Planned
- Push notifications (mobile/browser)
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

### User Activities (Notifications)
- `GET /api/useractivities` - Get user activities with pagination and filtering (auth required)
  - Query params: `page`, `pageSize`, `isRead` (bool), `type` (UserActivityType enum)
- `GET /api/useractivities/unread-count` - Get count of unread activities (auth required)
- `PATCH /api/useractivities/{id}/mark-read` - Mark activity as read (auth required)
- `PATCH /api/useractivities/mark-all-read` - Mark all activities as read (auth required)
- `DELETE /api/useractivities/{id}` - Delete activity (auth required)

### User Settings
- `GET /api/user-settings` - Get user settings (language + notification preferences, auto-creates if not exists, auth required)
- `PATCH /api/user-settings` - Update user settings (partial update, auth required)

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
- `/faq` - Frequently Asked Questions
- `/terms` - Terms of Service

### Optional Protected Routes
Routes are public by default. Wrap them in `<ProtectedRoute>` once authentication gating is required:
- `/create-listing` - Create a new bottle listing
- `/my-listings` - View and manage user's bottle listings (Active/Claimed/Completed tabs)
- `/my-pickup-tasks` - View active and completed pickup tasks (with status tabs)
- `/messages` - Dedicated messaging page with conversation list and chat interface
- `/notifications` - Notification center with full history, filters, and pagination
- `/settings/notifications` - User settings for language preference and email notification preferences

### In-App Views (Accessible from Home)
- **User Dashboard** - View user stats, earnings, recent activity, and profile
- **Map View** - Interactive map showing all bottle listings with markers

## 🌍 Internationalization (i18n)

BottleBuddy supports **English** and **Hungarian** languages with full internationalization.

### Language Support

- **English** (`en`) - Default language
- **Hungarian** (`hu`) - Complete translations for all user-facing text
- **Language Switcher** - Available in header for easy switching
- **Persistent Preference** - Language choice saved to localStorage

### Translation Coverage

- ✅ All pages and components
- ✅ Form validation messages
- ✅ Error messages and notifications
- ✅ Dashboard and statistics
- ✅ Messaging interface
- ✅ FAQ and about pages
- ✅ Terms of service
- ⚠️ Some components still need Hungarian translations (see [Translation Report](#) for details)

### Implementation Details

- **Library**: react-i18next with i18next
- **Configuration**: `frontend/src/lib/i18n.ts`
- **Usage**: `useTranslation()` hook in components
- **Format**: JSON-based translation keys with support for:
  - Pluralization (count-based)
  - Variable interpolation (`{{variable}}`)
  - Nested keys for organization

### Adding New Translations

1. Add translation keys to `frontend/src/lib/i18n.ts`:
   ```typescript
   en: {
     translation: {
       myFeature: {
         title: "My Feature",
         description: "Description here"
       }
     }
   },
   hu: {
     translation: {
       myFeature: {
         title: "Saját Funkció",
         description: "Leírás itt"
       }
     }
   }
   ```

2. Use in components:
   ```typescript
   import { useTranslation } from 'react-i18next';

   const MyComponent = () => {
     const { t } = useTranslation();
     return <h1>{t("myFeature.title")}</h1>;
   };
   ```

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
- **UserActivities** - Notification/activity feed for users (listing events, pickup requests, transactions, ratings)
- **UserSettings** - User preferences (preferred language, email notification settings as owned entity)
  - Owned entity: **NotificationSettings** (email preferences embedded in same table)

## 🌍 Environment Variables

See `docker/.env.example` for all required variables.

**Required:**
- `DB_PASSWORD` - SQL Server SA password (min 8 chars, must include uppercase, lowercase, digits, and special chars)
- `JWT_SECRET` - JWT signing key (min 32 characters)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

**Optional:**
- `ASPNETCORE_ENVIRONMENT` - Development/Production (default: Development)
- `DB_USER` - SQL Server username (default: sa)
- `DB_NAME` - Database name (default: BottleBuddy)
- `SENDGRID_API_KEY` - SendGrid API key for email notifications (optional, emails disabled if not set)
- `SENDGRID_FROM_EMAIL` - Sender email address (default: noreply@bottlebuddy.com)
- `SENDGRID_FROM_NAME` - Sender display name (default: BottleBuddy)
- `FRONTEND_BASE_URL` - Frontend URL for email links (default: http://localhost:5173)



## 📄 License

This project is licensed under the MIT License.

## 💬 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Made with 💚 in Hungary | **Turn bottles into community connections**
