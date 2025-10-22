# Backend API Docker Build Fix

## Problem

When building the Docker Compose stack via Visual Studio or command line, the backend API build failed with:

```
target api: failed to solve: process "/bin/sh -c dotnet restore" did not complete successfully: exit code: 1
```

Detailed error:
```
/docker/docker-compose.dcproj : error MSB4025: The project file could not be loaded.
Could not find a part of the path '/docker/docker-compose.dcproj'.
```

## Root Cause

The issue had **two contributing factors**:

### 1. Solution File Referenced docker-compose.dcproj

The `backend/BottleBuddyApi.sln` file included a reference to `../docker/docker-compose.dcproj`:

```xml
Project("{E53339B2-1760-4266-BCC7-CA923CBCF16C}") = "docker-compose", "..\docker\docker-compose.dcproj", "{...}"
```

**Why it failed:**
- The Dockerfile command `RUN dotnet restore` tries to restore all projects referenced in the `.sln` file
- The `docker-compose.dcproj` file is **outside the Docker build context** (`backend/`)
- Docker cannot access files outside the build context
- This caused the restore command to fail

### 2. Missing .dockerignore File

The backend folder had no `.dockerignore` file, which meant:
- Build artifacts in `bin/` and `obj/` folders were copied into the Docker image
- These artifacts could contain stale or corrupted build outputs
- Increased build context size unnecessarily

## Solution

### Fix #1: Skip Solution File, Restore Project Directly

Changed the Dockerfile to restore the specific `.csproj` file instead of using the `.sln` file:

**Before (BROKEN):**
```dockerfile
COPY BottleBuddyApi.sln ./
COPY src/BottleBuddy.Api/BottleBuddy.Api.csproj ./src/BottleBuddy.Api/

RUN dotnet restore
```

**After (FIXED):**
```dockerfile
# Copy project file only (skip solution to avoid docker-compose.dcproj reference issue)
COPY src/BottleBuddy.Api/BottleBuddy.Api.csproj ./src/BottleBuddy.Api/

# Restore dependencies for the specific project
RUN dotnet restore ./src/BottleBuddy.Api/BottleBuddy.Api.csproj
```

**Why this works:**
- ✅ Restores only the `BottleBuddy.Api.csproj` project
- ✅ Doesn't require the solution file
- ✅ Avoids the docker-compose.dcproj reference issue
- ✅ Still restores all NuGet packages correctly

### Fix #2: Created .dockerignore File

Created `backend/.dockerignore` to exclude unnecessary files from the Docker build context:

```
**/bin/
**/obj/
**/out/
**/publish/
.vs/
.vscode/
*.user
.env
packages/
TestResults/
*.md
!README.md
scripts/
```

**Benefits:**
- ✅ Faster builds (smaller context)
- ✅ No stale build artifacts
- ✅ Prevents environment variable leaks
- ✅ Cleaner Docker images

## Files Modified

1. **backend/Dockerfile** - Updated to restore specific .csproj instead of .sln
2. **backend/Dockerfile.dev** - Same fix for development builds
3. **backend/.dockerignore** - Created new file to exclude build artifacts
4. **docker/docker-compose.yml** - Removed obsolete `version: '3.8'`
5. **docker/docker-compose.dev.yml** - Removed obsolete `version: '3.8'`
6. **docker/docker-compose.override.yml** - Removed obsolete `version: '3.8'`

## Additional Fixes

### Removed Obsolete Docker Compose Version

Docker Compose v2+ doesn't require the `version` field. Removed `version: '3.8'` from all compose files to eliminate warnings:

```yaml
# Before
version: '3.8'
services:
  ...

# After
services:
  ...
```

## Testing the Fix

### Build Backend Only
```powershell
cd docker
docker-compose build api
```

### Build Full Stack
```powershell
cd docker
docker-compose build
```

### Start All Services
```powershell
cd docker
docker-compose up -d
```

### From Visual Studio
1. Open `backend/BottleBuddyApi.sln`
2. Set `docker-compose` as startup project
3. Press **F5**
4. All services build and start successfully

## Why the Solution File Still Works in Visual Studio

**Important:** The solution file (`BottleBuddyApi.sln`) still references `docker-compose.dcproj`, and that's **intentional**:

- ✅ Visual Studio uses the solution file for IDE features
- ✅ Visual Studio doesn't use the solution file when building Docker containers
- ✅ Docker builds bypass the solution file and use the Dockerfile directly
- ✅ This approach gives us the best of both worlds

## Build Process Flow

### Visual Studio Build (F5)
```
1. Visual Studio reads BottleBuddyApi.sln
2. Finds docker-compose.dcproj reference
3. Calls Docker Compose with docker-compose.yml
4. Docker Compose reads Dockerfile
5. Dockerfile restores BottleBuddy.Api.csproj directly ✅
```

### Command Line Build
```
1. Run: docker-compose build
2. Docker Compose reads docker-compose.yml
3. Reads Dockerfile from backend/ folder
4. Dockerfile restores BottleBuddy.Api.csproj directly ✅
```

## Folder Structure

```
bottle-buddy-share/
├── backend/                     ← Build context for API
│   ├── BottleBuddyApi.sln      ← References docker-compose (for VS only)
│   ├── Dockerfile               ✅ FIXED - Restores .csproj directly
│   ├── Dockerfile.dev           ✅ FIXED - Restores .csproj directly
│   ├── .dockerignore            ✅ CREATED - Excludes bin/obj/etc
│   └── src/
│       └── BottleBuddy.Api/
│           └── BottleBuddy.Api.csproj
│
└── docker/
    ├── docker-compose.yml       ✅ FIXED - Removed version
    ├── docker-compose.dev.yml   ✅ FIXED - Removed version
    ├── docker-compose.override.yml ✅ FIXED - Removed version
    └── docker-compose.dcproj    ← Referenced by solution, but not copied to Docker
```

## Summary of Changes

| Issue | Solution | Status |
|-------|----------|--------|
| docker-compose.dcproj not found | Restore .csproj directly, skip .sln | ✅ Fixed |
| Build artifacts copied to image | Created .dockerignore | ✅ Fixed |
| Docker Compose version warnings | Removed `version:` field | ✅ Fixed |
| Frontend nginx.conf not found | Changed build context to root | ✅ Fixed (previous issue) |

## Verification

### Backend Build Success
```
✅ dotnet restore ./src/BottleBuddy.Api/BottleBuddy.Api.csproj
   Restored /app/src/BottleBuddy.Api/BottleBuddy.Api.csproj (in 18.84 sec).

✅ dotnet build -c Release -o /app/build
   BottleBuddy.Api -> /app/build/BottleBuddy.Api.dll
   Build succeeded.
       0 Warning(s)
       0 Error(s)

✅ dotnet publish -c Release -o /app/publish
   BottleBuddy.Api -> /app/publish/

✅ docker-api Built
```

All builds now succeed without errors! 🎉

---

**Status**: ✅ FIXED - Backend API builds successfully via Docker Compose
