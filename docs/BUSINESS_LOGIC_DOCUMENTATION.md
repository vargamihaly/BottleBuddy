# Bottle Buddy - Complete Business Logic & Flow Documentation

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Data Models & Relationships](#data-models--relationships)
4. [Business Rules & Validation](#business-rules--validation)
5. [User Flows](#user-flows)
6. [API Endpoints](#api-endpoints)
7. [Authentication & Authorization](#authentication--authorization)
8. [Transaction & Payment Logic](#transaction--payment-logic)
9. [Rating & Reputation System](#rating--reputation-system)
10. [State Management](#state-management)
11. [Technical Implementation](#technical-implementation)

---

## Overview

### What is Bottle Buddy?

**Bottle Buddy** is a community-driven platform that connects people who have returnable bottles with volunteers willing to pick them up and return them to recycling centers. The platform facilitates eco-friendly bottle recycling while creating financial opportunities for both parties through a configurable profit-sharing model.

### Core Value Proposition

- **For Bottle Owners**: Declutter your space and earn money from bottles without leaving home
- **For Volunteers**: Earn money by collecting bottles and returning them to recycling centers
- **For Communities**: Reduce waste and promote sustainable recycling habits
- **For Environment**: Increase bottle return rates and reduce environmental impact

### Technology Stack

**Backend:**
- ASP.NET Core 8.0 (C#)
- Entity Framework Core 8.0
- PostgreSQL Database
- JWT Authentication
- Google OAuth Integration

**Frontend:**
- React 18.3.1 with TypeScript
- Vite (Build Tool)
- React Router 6 (Navigation)
- TanStack React Query (Data Fetching)
- React Hook Form + Zod (Forms & Validation)
- Tailwind CSS + shadcn/ui (UI Components)
- Leaflet + React Leaflet (Interactive Maps)

---

## System Architecture

### High-Level Architecture

```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│   Browser   │◄───────►│  React SPA   │◄───────►│  Backend API │
│  (Client)   │  HTTPS  │  (Frontend)  │   REST  │  (ASP.NET)   │
└─────────────┘         └──────────────┘         └──────┬───────┘
                                                         │
                                                         ▼
                                                  ┌──────────────┐
                                                  │  PostgreSQL  │
                                                  │   Database   │
                                                  └──────────────┘
```

### Backend Architecture (Layered Design)

```
┌────────────────────────────────────────────────┐
│          Controllers (API Layer)               │
│  - AuthController                              │
│  - BottleListingsController                    │
│  - PickupRequestsController                    │
│  - TransactionsController                      │
│  - RatingsController                           │
└────────────┬───────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────┐
│       Services (Business Logic Layer)          │
│  - AuthService (JWT, OAuth)                    │
│  - BottleListingService                        │
│  - PickupRequestService                        │
│  - TransactionService                          │
│  - RatingService                               │
└────────────┬───────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────┐
│        Data Access Layer (EF Core)             │
│  - ApplicationDbContext                        │
│  - DbSets (Users, Listings, Requests, etc.)    │
└────────────┬───────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────┐
│            PostgreSQL Database                 │
└────────────────────────────────────────────────┘
```

### Frontend Architecture (Component-Based)

```
┌────────────────────────────────────────────────┐
│              App.tsx (Router)                  │
└────────────┬───────────────────────────────────┘
             │
      ┌──────┴──────┬──────────┬──────────┐
      ▼             ▼          ▼          ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│  Index   │  │   Auth   │  │  Create  │  │    My    │
│  (Home)  │  │ (Sign In)│  │  Listing │  │ Listings │
└──────────┘  └──────────┘  └──────────┘  └──────────┘

Global State Management:
┌────────────────────────────────────────────────┐
│  AuthContext (User, Token, Auth Methods)       │
└────────────────────────────────────────────────┘

Server State Management:
┌────────────────────────────────────────────────┐
│  React Query (API Data, Caching, Mutations)    │
└────────────────────────────────────────────────┘
```

---

## Data Models & Relationships

### Entity Relationship Diagram

```
┌─────────────────┐
│ ApplicationUser │
│  (Identity)     │
└────────┬────────┘
         │ 1:1
         │
         ▼
┌─────────────────┐
│    Profile      │
│  - FullName     │
│  - Username     │
│  - Rating       │
│  - TotalRatings │
└─────────────────┘
         │
         │ 1:Many (as owner)
         ▼
┌─────────────────┐
│ BottleListing   │
│  - BottleCount  │
│  - Location     │
│  - EstRefund    │
│  - Split%       │
│  - Status       │
└────────┬────────┘
         │ 1:Many
         │
         ▼
┌─────────────────┐          ┌─────────────────┐
│ PickupRequest   │          │ ApplicationUser │
│  - Message      │◄─────────│  (Volunteer)    │
│  - PickupTime   │  Many:1  └─────────────────┘
│  - Status       │
└────────┬────────┘
         │ 1:1
         │
         ▼
┌─────────────────┐
│  Transaction    │
│  - VolunteerAmt │
│  - OwnerAmt     │
│  - TotalRefund  │
│  - Status       │
└────────┬────────┘
         │ 1:Many
         │
         ▼
┌─────────────────┐
│     Rating      │
│  - Value (1-5)  │
│  - Comment      │
└─────────────────┘
```

### Entity Descriptions

#### 1. ApplicationUser
**Purpose**: Represents authenticated users
**Inherits**: ASP.NET Core IdentityUser
**Key Fields**:
- `Id` (string) - Primary key
- `Email` - Login email
- `UserName` - Login username
- `PasswordHash` - Encrypted password
- `Profile` (navigation) - One-to-one with Profile

#### 2. Profile
**Purpose**: User profile information and reputation
**Primary Key**: `Id` (string, same as ApplicationUser)
**Fields**:
- `FullName` - Display name
- `Username` - Unique username (nullable)
- `Phone` - Contact number
- `AvatarUrl` - Profile picture URL
- `Rating` - Average rating (1-5 scale)
- `TotalRatings` - Count of ratings received
- `CreatedAt` - Profile creation timestamp
- `UpdatedAt` - Last update timestamp

**Relationships**:
- One-to-one with ApplicationUser (cascade delete)
- Rated through Transaction → Rating

#### 3. BottleListing
**Purpose**: Represents a collection of bottles available for pickup
**Primary Key**: `Id` (Guid)
**Fields**:
- `BottleCount` (int) - Number of bottles (1-10,000)
- `LocationAddress` (string) - Pickup address
- `Title` (string) - Optional listing title
- `Description` (string) - Optional description
- `Latitude`, `Longitude` (double) - GPS coordinates
- `EstimatedRefund` (decimal) - Total refund value (HUF)
- `PickupDeadline` (DateTime?) - Latest pickup date
- `SplitPercentage` (decimal) - Owner's share % (0-100)
- `Status` (enum) - Open, Claimed, Completed, Cancelled
- `UserId` (string) - FK to owner
- `CreatedAt`, `UpdatedAt` - Timestamps

**Relationships**:
- Many-to-one with ApplicationUser (owner)
- One-to-many with PickupRequest

**Business Rules**:
- Status = Open: Available for pickup requests
- Status = Claimed: One pickup request accepted
- Status = Completed: Exchange finished
- Default SplitPercentage = 50%
- EstimatedRefund = BottleCount × 50 HUF

#### 4. PickupRequest
**Purpose**: Volunteer's request to pick up a listing
**Primary Key**: `Id` (Guid)
**Fields**:
- `ListingId` (Guid) - FK to BottleListing
- `VolunteerId` (string) - FK to ApplicationUser
- `Message` (string?) - Volunteer's message
- `PickupTime` (DateTime?) - Proposed pickup time
- `Status` (enum) - Pending, Accepted, Rejected, Completed, Cancelled
- `CreatedAt`, `UpdatedAt` - Timestamps

**Relationships**:
- Many-to-one with BottleListing
- Many-to-one with ApplicationUser (volunteer)
- One-to-one with Transaction (after completion)

**Business Rules**:
- Volunteer ≠ Listing Owner
- One active request per (volunteer, listing) pair
- Only created when Listing.Status = Open
- Accepting sets Listing.Status = Claimed
- Completing creates Transaction

#### 5. Transaction
**Purpose**: Financial record of completed pickup
**Primary Key**: `Id` (Guid)
**Fields**:
- `ListingId` (Guid) - FK to BottleListing
- `PickupRequestId` (Guid) - FK to PickupRequest
- `VolunteerAmount` (decimal) - Volunteer's earnings
- `OwnerAmount` (decimal) - Owner's earnings
- `TotalRefund` (decimal) - Total refund amount
- `Status` (enum) - Pending, Completed, Cancelled
- `CreatedAt` - Creation timestamp
- `CompletedAt` - Completion timestamp

**Relationships**:
- Many-to-one with BottleListing
- One-to-one with PickupRequest
- One-to-many with Rating

**Calculation Logic**:
```
ownerPercentage = Listing.SplitPercentage ?? 50
volunteerPercentage = 100 - ownerPercentage
OwnerAmount = (TotalRefund × ownerPercentage) / 100
VolunteerAmount = (TotalRefund × volunteerPercentage) / 100
```

#### 6. Rating
**Purpose**: User feedback and reputation system
**Primary Key**: `Id` (Guid)
**Fields**:
- `RaterId` (string) - FK to ApplicationUser (who rates)
- `RatedUserId` (string) - FK to ApplicationUser (who is rated)
- `TransactionId` (Guid) - FK to Transaction
- `Value` (int) - Rating value (1-5 stars)
- `Comment` (string?) - Optional feedback
- `CreatedAt` - Timestamp

**Relationships**:
- Many-to-one with ApplicationUser (rater)
- Many-to-one with ApplicationUser (rated)
- Many-to-one with Transaction

**Business Rules**:
- Value must be 1-5
- One rating per user per transaction
- Only transaction participants can rate
- Updates Profile.Rating and Profile.TotalRatings

---

## Business Rules & Validation

### Listing Creation Rules

**Validations**:
1. **Bottle Count**: 1-10,000 bottles
2. **Location Address**: Minimum 3 characters
3. **Title**: Maximum 200 characters (optional)
4. **Description**: Maximum 1,000 characters (optional)
5. **Latitude**: -90 to 90 degrees
6. **Longitude**: -180 to 180 degrees
7. **Estimated Refund**: 0 to 1,000,000 HUF
8. **Split Percentage**: 0-100%
9. **User must be authenticated**

**Business Logic**:
- Default split: 50/50 between owner and volunteer
- Auto-calculate estimated refund: `BottleCount × 50 HUF`
- Initial status: Open
- Location is required (must have latitude & longitude)
- Only owner can delete listing

### Pickup Request Rules

**Validations**:
1. **Listing must exist**
2. **Listing must be in Open status**
3. **Volunteer cannot be the listing owner**
4. **No duplicate active requests**:
   - Only one Pending or Accepted request per (volunteer, listing)
5. **Message is optional**
6. **Pickup time is optional**

**State Transitions**:
```
         ┌──────────┐
    ┌───►│ Pending  │
    │    └────┬─────┘
    │         │
    │    ┌────▼─────┐
    │    │ Accepted │
    │    └────┬─────┘
    │         │
    │    ┌────▼─────┐
    │    │Completed │
    │    └──────────┘
    │
    │    ┌──────────┐
    └───►│ Rejected │
         └──────────┘

    ┌──────────┐
    │Cancelled │
    └──────────┘
```

**Authorization**:
- **Create**: Any authenticated user (except owner)
- **Accept/Reject**: Listing owner only
- **Complete**: Both owner and volunteer
- **Cancel**: Volunteer only

**Side Effects**:
- **On Accept**:
  - Listing.Status → Claimed
  - Other pending requests for same listing → Rejected
- **On Complete**:
  - Listing.Status → Completed
  - Transaction auto-created
  - PickupRequest.Status → Completed

### Transaction Rules

**Creation Conditions**:
1. PickupRequest must exist
2. PickupRequest.Status must be Completed
3. User must be owner or volunteer
4. Transaction doesn't already exist (returns existing if found)

**Calculation**:
```typescript
const ownerPercentage = listing.splitPercentage ?? 50;
const volunteerPercentage = 100 - ownerPercentage;

transaction.ownerAmount = (totalRefund * ownerPercentage) / 100;
transaction.volunteerAmount = (totalRefund * volunteerPercentage) / 100;
transaction.totalRefund = listing.estimatedRefund;
transaction.status = 'Completed';
transaction.completedAt = DateTime.Now;
```

**Authorization**:
- Only owner or volunteer can view transaction
- Both can retrieve transaction details

### Rating Rules

**Validations**:
1. **Value**: Must be 1-5 stars
2. **Transaction must exist**
3. **User must be participant** (owner or volunteer)
4. **No duplicate ratings**: One per user per transaction
5. **Comment**: Optional, max length varies

**Rating Target Logic**:
```
IF rater = listing.owner
  THEN rated = volunteer
ELSE IF rater = volunteer
  THEN rated = listing.owner
ELSE
  THROW UnauthorizedException
```

**Profile Update Logic**:
```typescript
// After creating rating
const allRatings = await getRatingsForUser(ratedUserId);
const averageRating = allRatings.reduce((sum, r) => sum + r.value, 0) / allRatings.length;

profile.rating = averageRating;
profile.totalRatings = allRatings.length;
await saveProfile(profile);
```

---

## User Flows

### Flow 1: User Registration & First Listing

**Steps**:
1. User visits homepage
2. Clicks "Sign Up" or "Get Started"
3. Enters registration details:
   - Email (required)
   - Password (8+ chars, uppercase, lowercase, number)
   - Confirm Password
   - Full Name (optional)
   - Username (optional, must be unique)
   - Phone (optional)
4. Submits form
5. Backend validates and creates:
   - ApplicationUser
   - Profile (linked 1:1)
6. JWT token generated and returned
7. Frontend stores token in localStorage
8. Redirects to home page
9. User clicks "Create Listing"
10. Fills listing form:
    - Bottle count
    - Location (via map picker)
    - Split percentage (slider)
    - Optional: title, description, deadline
11. Submits listing
12. Backend creates BottleListing with status = Open
13. Listing appears on home page and map

**API Calls**:
```
POST /api/auth/register
  → Returns JWT token

GET /api/auth/me
  → Returns user profile

POST /api/bottlelistings
  → Creates listing
```

### Flow 2: Google OAuth Registration

**Steps**:
1. User clicks "Continue with Google"
2. Google OAuth popup appears
3. User authenticates with Google
4. Frontend receives Google ID token
5. Sends token to backend: `POST /api/auth/google-signin`
6. Backend:
   - Validates Google token
   - Checks if user exists (by email)
   - If new: Creates ApplicationUser + Profile
   - If exists: Updates profile with Google info
   - Generates JWT token
7. Frontend stores token
8. User redirected to home page (logged in)

**API Calls**:
```
POST /api/auth/google-signin
  { idToken: "google_id_token" }
  → Returns JWT token
```

### Flow 3: Discovering & Requesting Pickup

**Steps**:
1. User browses home page listings
2. Sees available bottles (grid or map view)
3. Filters/searches by location or distance
4. Clicks on interesting listing
5. Reviews details:
   - Bottle count
   - Location
   - Estimated refund
   - Split percentage
   - Owner's rating
6. Clicks "Offer to Pick Up"
7. Confirmation dialog appears
8. User confirms
9. Backend creates PickupRequest:
   - Status = Pending
   - Links to listing and volunteer
   - Validates no duplicates
10. User sees request in "My Requests" tab
11. Status shows "Pending" until owner responds

**API Calls**:
```
GET /api/bottlelistings
  → Fetches all listings

POST /api/pickuprequests
  { listingId, message?, pickupTime? }
  → Creates pickup request

GET /api/pickuprequests/my-requests
  → Shows user's requests
```

### Flow 4: Managing Pickup Requests (Listing Owner)

**Steps**:
1. Owner navigates to "My Listings"
2. Sees listing with badge showing request count
3. Expands listing card
4. Views incoming pickup requests:
   - Volunteer name
   - Volunteer rating
   - Message
   - Proposed pickup time
5. Decides to accept one request
6. Clicks "Accept"
7. Backend:
   - Updates request status to Accepted
   - Changes listing status to Claimed
   - Auto-rejects other pending requests
8. Owner and volunteer coordinate pickup (external)
9. After pickup, owner or volunteer clicks "Mark Completed"
10. Backend:
    - Updates request status to Completed
    - Changes listing status to Completed
    - Creates Transaction automatically
11. Both parties can now rate each other

**API Calls**:
```
GET /api/pickuprequests/listing/{listingId}
  → Shows requests for owner's listing

PATCH /api/pickuprequests/{id}/status
  { status: "Accepted" }
  → Accepts request, claims listing

PATCH /api/pickuprequests/{id}/status
  { status: "Completed" }
  → Completes pickup, creates transaction
```

### Flow 5: Completing Transaction & Rating

**Steps**:
1. After pickup marked Completed:
   - Transaction auto-created
   - Status = Completed
   - Amounts calculated based on split %
2. Both parties see "Rate" button in UI
3. User clicks "Rate this exchange"
4. RatingDialog appears showing:
   - Transaction details
   - Bottle count
   - Total refund
   - Partner's name
5. User selects star rating (1-5)
6. Optionally adds comment
7. Submits rating
8. Backend:
   - Validates user is participant
   - Creates Rating record
   - Updates rated user's profile:
     - Recalculates average rating
     - Increments total ratings count
9. Rating appears on rated user's profile
10. User can view received ratings in dashboard

**API Calls**:
```
GET /api/transactions/pickup-request/{pickupRequestId}
  → Fetches transaction details

POST /api/ratings
  { transactionId, value, comment? }
  → Creates rating, updates profile

GET /api/ratings/user/{userId}
  → Shows all ratings for user
```

### Flow 6: Viewing Dashboard & Statistics

**Steps**:
1. User clicks profile icon or "Dashboard" tab
2. Dashboard displays:
   - **Profile Card**:
     - Avatar
     - Display name
     - Email
     - Average rating (stars)
     - Total ratings count
   - **Statistics**:
     - Total bottles recycled
     - Total earnings (HUF)
     - Success rate %
     - Completed exchanges count
   - **Recent Activity**:
     - List of recent pickups
     - Earnings breakdown
     - Dates and partners
   - **Quick Actions**:
     - "List New Bottles"
     - "Find Bottles to Pick Up"

**API Calls**:
```
GET /api/auth/me
  → User profile with rating

GET /api/transactions/my-transactions
  → All user's transactions

GET /api/pickuprequests/my-requests
  → User's pickup requests

GET /api/bottlelistings
  → User's listings (filtered)
```

---

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Auth | Description | Request Body | Response |
|--------|----------|------|-------------|--------------|----------|
| POST | `/api/auth/register` | No | Create new account | `{ email, password, fullName?, username?, phone? }` | `{ token }` |
| POST | `/api/auth/login` | No | Login with credentials | `{ email, password }` | `{ token }` |
| POST | `/api/auth/google-signin` | No | Google OAuth login | `{ idToken }` | `{ token }` |
| POST | `/api/auth/logout` | Yes | Logout user | - | 200 OK |
| GET | `/api/auth/me` | Yes | Get current user | - | `UserResponseDto` |

### Bottle Listing Endpoints

| Method | Endpoint | Auth | Description | Request Body | Response |
|--------|----------|------|-------------|--------------|----------|
| GET | `/api/bottlelistings` | No | Get paginated listings | Query: `page`, `pageSize`, `status` | `{ data: [], total, page, pageSize }` |
| POST | `/api/bottlelistings` | Yes | Create listing | `CreateBottleListingRequest` | `BottleListingResponseDto` |
| DELETE | `/api/bottlelistings/{id}` | Yes | Delete listing | - | 204 No Content |

**Query Parameters for GET**:
- `page` (int, default: 1)
- `pageSize` (int, default: 50, max: 100)
- `status` (string, optional: "open", "claimed", "completed", "cancelled")

### Pickup Request Endpoints

| Method | Endpoint | Auth | Description | Request Body | Response |
|--------|----------|------|-------------|--------------|----------|
| POST | `/api/pickuprequests` | Yes | Create pickup request | `{ listingId, message?, pickupTime? }` | `PickupRequestResponseDto` |
| GET | `/api/pickuprequests/listing/{listingId}` | Yes | Get requests for listing (owner only) | - | `PickupRequestResponseDto[]` |
| GET | `/api/pickuprequests/my-requests` | Yes | Get user's requests | - | `PickupRequestResponseDto[]` |
| PATCH | `/api/pickuprequests/{id}/status` | Yes | Update request status | `{ status }` | `PickupRequestResponseDto` |

**Status Values**:
- "Pending", "Accepted", "Rejected", "Completed", "Cancelled"

### Transaction Endpoints

| Method | Endpoint | Auth | Description | Response |
|--------|----------|------|-------------|----------|
| GET | `/api/transactions/my-transactions` | Yes | Get user's transactions | `TransactionResponseDto[]` |
| GET | `/api/transactions/pickup-request/{pickupRequestId}` | Yes | Get transaction for pickup | `TransactionResponseDto` |
| POST | `/api/transactions` | Yes | Create transaction (auto on completion) | `TransactionResponseDto` |

### Rating Endpoints

| Method | Endpoint | Auth | Description | Request Body | Response |
|--------|----------|------|-------------|--------------|----------|
| POST | `/api/ratings` | Yes | Create rating | `{ transactionId, value, comment? }` | `RatingResponseDto` |
| GET | `/api/ratings/user/{userId}` | Yes | Get all ratings for user | - | `RatingResponseDto[]` |
| GET | `/api/ratings/transaction/{transactionId}` | Yes | Get my rating for transaction | - | `RatingResponseDto` |

---

## Authentication & Authorization

### JWT Authentication Flow

**Token Generation**:
1. User logs in with email/password or Google OAuth
2. Backend validates credentials
3. Generates JWT token with:
   - **Subject**: User ID
   - **Claims**: Email, NameIdentifier
   - **Expiration**: 1 hour from issuance
   - **Issuer**: Configured in appsettings
   - **Audience**: Configured in appsettings
   - **Signing Key**: HMAC SHA256 with secret key
4. Returns token to client

**Token Storage (Frontend)**:
- Stored in `localStorage` as `token`
- Automatically attached to API requests via `Authorization: Bearer {token}`
- Validated on each request for expiration
- Auto-logout if expired

**Token Validation (Backend)**:
- Validates signature with secret key
- Checks expiration timestamp
- Validates issuer and audience
- Extracts user ID from claims
- Middleware automatically validates on protected routes

### Authorization Rules by Feature

#### Bottle Listings
- **View (GET)**: Public (no auth required)
- **Create (POST)**: Authenticated users only
- **Delete (DELETE)**: Owner only

#### Pickup Requests
- **Create (POST)**: Authenticated users (except listing owner)
- **View for Listing**: Listing owner only
- **View Own Requests**: Authenticated user (their requests)
- **Accept/Reject**: Listing owner only
- **Complete**: Both owner and volunteer
- **Cancel**: Volunteer only

#### Transactions
- **View**: Owner or volunteer of the pickup request
- **Create**: Auto-created on completion (owner or volunteer triggers)

#### Ratings
- **Create**: Transaction participants only (owner or volunteer)
- **View**: Public (ratings for a user)

### Protected Routes (Frontend)

Routes requiring authentication:
- `/create-listing` - Create new bottle listing
- `/my-listings` - Manage user's listings

Components with conditional features:
- Home page: Sign-in prompt vs. authenticated actions
- Listing cards: "Offer to Pick Up" button (auth required)
- Dashboard: Full stats (auth required)

### CORS Configuration

**Allowed Origins**:
- `http://localhost:8080`
- `http://localhost:8081`

**Settings**:
- Allow any method (GET, POST, PATCH, DELETE)
- Allow any header
- Allow credentials (for cookies, if needed)

---

## Transaction & Payment Logic

### Refund Calculation

**Base Calculation**:
```
EstimatedRefund = BottleCount × 50 HUF
```

**Example**:
- 100 bottles × 50 HUF = 5,000 HUF total refund

### Split Percentage Logic

**Configurable Split**:
- Owner sets `SplitPercentage` (0-100%)
- Default: 50% (50/50 split)
- Owner's percentage = SplitPercentage
- Volunteer's percentage = 100 - SplitPercentage

**Amount Distribution**:
```typescript
function calculateAmounts(totalRefund: number, splitPercentage: number) {
  const ownerPercentage = splitPercentage ?? 50;
  const volunteerPercentage = 100 - ownerPercentage;

  const ownerAmount = (totalRefund * ownerPercentage) / 100;
  const volunteerAmount = (totalRefund * volunteerPercentage) / 100;

  return { ownerAmount, volunteerAmount, totalRefund };
}
```

**Examples**:

| Total Refund | Split % | Owner Gets | Volunteer Gets |
|--------------|---------|------------|----------------|
| 5,000 HUF | 50% | 2,500 HUF | 2,500 HUF |
| 5,000 HUF | 70% | 3,500 HUF | 1,500 HUF |
| 5,000 HUF | 30% | 1,500 HUF | 3,500 HUF |
| 10,000 HUF | 60% | 6,000 HUF | 4,000 HUF |

### Transaction Creation Trigger

**Automatic Creation**:
- Triggered when PickupRequest status → Completed
- No manual transaction creation needed
- Idempotent: Returns existing transaction if already created

**Transaction Record**:
```typescript
{
  id: Guid,
  listingId: Guid,
  pickupRequestId: Guid,
  volunteerAmount: decimal,
  ownerAmount: decimal,
  totalRefund: decimal,
  status: "Completed",
  createdAt: DateTime,
  completedAt: DateTime
}
```

### Payment Notes

**Current Implementation**:
- Transactions are **informational records** only
- No actual payment processing integrated
- Shows what each party should receive
- Users handle physical payment externally

**Future Enhancement Opportunities**:
- Integration with payment gateway (Stripe, PayPal)
- Escrow system for secure payments
- Automated payouts after ratings
- Dispute resolution system

---

## Rating & Reputation System

### Rating Mechanics

**Rating Scale**: 1-5 stars
- 1 star = Very poor
- 2 stars = Poor
- 3 stars = Average
- 4 stars = Good
- 5 stars = Excellent

**Rating Submission**:
1. User completes transaction
2. Rating dialog appears
3. User selects star rating (required)
4. User adds comment (optional, for feedback)
5. Submit rating

**Constraints**:
- One rating per user per transaction
- Only transaction participants can rate
- Cannot rate yourself
- Rating is immutable once submitted

### Who Rates Whom

**Logic**:
```
IF rater is listing owner:
  rated user = volunteer
ELSE IF rater is volunteer:
  rated user = listing owner
```

**Example**:
- Alice creates listing
- Bob offers to pick up
- Alice accepts
- Exchange completed
- Alice rates Bob (volunteer)
- Bob rates Alice (owner)

### Profile Rating Calculation

**Aggregation Logic**:
```typescript
async function updateUserRating(userId: string) {
  // Get all ratings received by user
  const ratings = await Rating.find({ ratedUserId: userId });

  // Calculate average
  const sum = ratings.reduce((acc, r) => acc + r.value, 0);
  const average = sum / ratings.length;

  // Update profile
  profile.rating = average;
  profile.totalRatings = ratings.length;
  await profile.save();
}
```

**Display**:
- Average rating shown as stars (e.g., 4.5 ⭐)
- Total rating count shown (e.g., "Based on 23 reviews")
- Displayed on user's profile and listings

### Trust & Reputation Impact

**High Rating Benefits**:
- More pickup requests accepted
- Higher trust from community
- Better negotiating position for split %
- Social proof in listings

**Low Rating Consequences**:
- Fewer requests or acceptance
- Lower trust
- Potential warnings or restrictions (future)

**Rating Distribution** (example):
- 5 stars: 70%
- 4 stars: 20%
- 3 stars: 8%
- 2 stars: 1.5%
- 1 star: 0.5%

---

## State Management

### Frontend State Architecture

**Three Types of State**:

1. **Global State (AuthContext)**
   - User authentication status
   - JWT token
   - User profile information
   - Auth methods (signIn, signUp, signOut)

2. **Server State (React Query)**
   - API data (listings, requests, transactions)
   - Loading states
   - Error states
   - Cache management
   - Automatic refetching

3. **Local Component State (React useState)**
   - Form inputs
   - UI toggles (dialogs, tabs)
   - Temporary selections

### AuthContext API

**State**:
```typescript
{
  token: string | null,
  user: User | null,
  loading: boolean,
  isAuthenticated: boolean // Computed: !!token && !!user
}
```

**Methods**:
```typescript
{
  signIn(email: string, password: string): Promise<void>
  signUp(email: string, password: string, ...): Promise<void>
  signInWithGoogle(idToken: string): Promise<void>
  signOut(): Promise<void>
  refreshUser(): Promise<void>
}
```

**Usage**:
```typescript
const { user, isAuthenticated, signIn, signOut } = useAuth();

if (isAuthenticated) {
  // Show authenticated UI
} else {
  // Show sign-in prompt
}
```

### React Query State

**Queries** (read operations):
```typescript
// Fetch listings
useQuery({
  queryKey: ['listings', { page, status }],
  queryFn: () => apiClient.get('/api/bottlelistings', { params: { page, status } })
})

// Fetch user's requests
useQuery({
  queryKey: ['myRequests'],
  queryFn: () => apiClient.get('/api/pickuprequests/my-requests')
})
```

**Mutations** (write operations):
```typescript
// Create listing
useMutation({
  mutationFn: (data) => apiClient.post('/api/bottlelistings', data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['listings'] })
    navigate('/')
  }
})

// Update request status
useMutation({
  mutationFn: ({ id, status }) =>
    apiClient.patch(`/api/pickuprequests/${id}/status`, { status }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['myRequests'] })
    queryClient.invalidateQueries({ queryKey: ['listingRequests'] })
  }
})
```

**Cache Configuration**:
- **Stale time**: 5 minutes
- **Retry**: 3 attempts with exponential backoff
- **Refetch on window focus**: Disabled
- **Cache time**: 10 minutes (default)

### State Synchronization

**Pattern**:
1. User performs action (e.g., create listing)
2. Mutation called → API request sent
3. On success:
   - Invalidate related queries
   - React Query auto-refetches
   - UI updates with fresh data
4. On error:
   - Show error toast
   - State remains unchanged

**Example Flow**:
```
User accepts pickup request
  ↓
Mutation: PATCH /api/pickuprequests/{id}/status
  ↓
Success
  ↓
Invalidate: ['myListings'], ['listingRequests']
  ↓
React Query refetches
  ↓
UI shows updated status (Accepted)
  ↓
Listing now shows "Claimed" badge
```

---

## Technical Implementation

### Backend Technology Details

**Framework**: ASP.NET Core 8.0
**Language**: C# 12
**ORM**: Entity Framework Core 8.0
**Database**: PostgreSQL 16+
**Auth**: JWT Bearer + ASP.NET Identity

**Key Packages**:
- `Npgsql.EntityFrameworkCore.PostgreSQL` - PostgreSQL provider
- `System.IdentityModel.Tokens.Jwt` - JWT handling
- `Microsoft.AspNetCore.Authentication.JwtBearer` - JWT auth
- `Swashbuckle.AspNetCore` - API documentation
- `Google.Apis.Auth` - Google OAuth verification

**Database Migrations**:
```bash
dotnet ef migrations add MigrationName
dotnet ef database update
```

**Application Startup** (Program.cs):
1. Configure services (DbContext, Identity, JWT)
2. Add controllers and Swagger
3. Configure middleware pipeline
4. Apply migrations on startup
5. Seed test data if empty

### Frontend Technology Details

**Framework**: React 18.3.1
**Language**: TypeScript 5.5.3
**Build Tool**: Vite 5.4.1
**Router**: React Router 6.26.2

**Key Libraries**:
- `@tanstack/react-query` - Server state management
- `react-hook-form` - Form handling
- `zod` - Schema validation
- `@radix-ui/*` - UI primitives
- `tailwindcss` - Utility CSS
- `leaflet` - Map rendering
- `@react-oauth/google` - Google OAuth

**Build Commands**:
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

**Environment Configuration**:
```env
VITE_API_URL=http://localhost:3668
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### API Client Implementation

**Features**:
- Automatic retry with exponential backoff
- Authorization header injection
- Error handling with custom error class
- TypeScript type safety

**Retry Logic**:
```typescript
async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      if (response.status >= 400 && response.status < 500) {
        // Client error, don't retry
        throw new ApiRequestError(response);
      }
    } catch (error) {
      if (i === retries - 1) throw error;
      await delay(Math.pow(2, i) * 1000); // Exponential backoff
    }
  }
}
```

### Error Handling Strategy

**Backend**:
- Global exception middleware
- Structured error responses
- Logging with detailed stack traces
- HTTP status codes (400, 401, 403, 404, 500)

**Frontend**:
- Error boundary component
- Toast notifications for API errors
- Graceful fallbacks
- User-friendly error messages

**Example Error Response**:
```json
{
  "error": "Validation failed",
  "message": "Bottle count must be between 1 and 10,000",
  "statusCode": 400
}
```

### Map Integration

**Library**: Leaflet + React Leaflet
**Tile Provider**: OpenStreetMap
**Geocoding**: Nominatim API (OpenStreetMap)

**Features**:
- Interactive map with markers
- User location detection (Geolocation API)
- Reverse geocoding (coordinates → address)
- Forward geocoding (address → coordinates)
- Distance calculation (Haversine formula)
- Custom markers with bottle counts
- Click to select listings

**Distance Calculation**:
```typescript
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}
```

### Performance Optimizations

**Backend**:
- Database indexing on foreign keys
- Pagination for large result sets
- Lazy loading of navigation properties
- Connection pooling

**Frontend**:
- React Query caching (5-minute stale time)
- Code splitting by route
- Lazy component loading
- Optimistic UI updates
- Debounced search inputs
- Virtual scrolling for large lists (future)

### Security Measures

**Backend**:
- Password hashing (ASP.NET Identity default)
- JWT token expiration (1 hour)
- HTTPS enforcement (production)
- CORS restrictions
- SQL injection prevention (EF Core parameterized queries)
- Input validation (Data Annotations)

**Frontend**:
- XSS prevention (React escapes by default)
- CSRF protection via JWT (stateless)
- Token expiration checking
- Secure token storage (localStorage with expiration)
- Input sanitization (Zod validation)

---

## Deployment Considerations

### Backend Deployment

**Requirements**:
- .NET 8 Runtime
- PostgreSQL 16+ server
- HTTPS certificate
- Environment variables:
  - `ConnectionStrings__DefaultConnection`
  - `Jwt__Secret`
  - `Jwt__Issuer`
  - `Jwt__Audience`
  - `Google__ClientId`

**Docker Support**:
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0
COPY ./publish /app
WORKDIR /app
ENTRYPOINT ["dotnet", "BottleBuddy.Api.dll"]
```

### Frontend Deployment

**Build**:
```bash
npm run build
# Output in dist/ folder
```

**Static Hosting**:
- Nginx
- Apache
- Vercel
- Netlify
- AWS S3 + CloudFront

**Environment Variables**:
- `VITE_API_URL` - Backend API URL
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID

**Nginx Configuration** (example):
```nginx
server {
  listen 80;
  root /var/www/bottle-buddy;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /api {
    proxy_pass http://backend:3668;
  }
}
```

---

## Future Enhancements

### Planned Features

1. **Payment Integration**
   - Stripe or PayPal integration
   - Escrow system
   - Automated payouts

2. **Messaging System**
   - In-app chat between owner and volunteer
   - Pickup coordination
   - Notifications

3. **Advanced Search**
   - Filter by distance radius
   - Filter by bottle count
   - Filter by refund amount
   - Sort by rating, date, distance

4. **Gamification**
   - Badges for milestones
   - Leaderboards
   - Streak tracking
   - Referral system

5. **Mobile Apps**
   - iOS app (React Native)
   - Android app (React Native)
   - Push notifications

6. **Analytics Dashboard**
   - Environmental impact metrics
   - Earnings over time
   - Popular pickup locations
   - User growth charts

7. **Admin Panel**
   - User management
   - Content moderation
   - Dispute resolution
   - Analytics dashboard

8. **Verification System**
   - ID verification
   - Phone verification
   - Trusted user badges

---

## Glossary

**Terms**:

- **Bottle Listing**: A collection of returnable bottles posted by an owner
- **Pickup Request**: A volunteer's offer to pick up a bottle listing
- **Transaction**: Financial record of a completed bottle exchange
- **Split Percentage**: Owner's share of the total refund (0-100%)
- **Estimated Refund**: Total refund value calculated as BottleCount × 50 HUF
- **Rating**: 1-5 star feedback given after transaction completion
- **Volunteer**: User who picks up bottles and returns them to recycling centers
- **Owner**: User who posts bottle listings
- **Claim**: Action of accepting a pickup request (changes listing status to Claimed)
- **Complete**: Final status when exchange is finished and transaction created

---

## Contact & Support

**For Issues**:
- GitHub Issues: (repository URL)
- Email: support@bottlebuddy.hu

**For Development**:
- Documentation: This file
- API Docs: Swagger UI at `/` (development mode)
- Backend: ASP.NET Core project
- Frontend: React + TypeScript project

---

**Document Version**: 1.0
**Last Updated**: 2025-10-23
**Authors**: Development Team
**Status**: Complete