# Docker Build Context Path Fix

## Problem

When trying to build the Docker Compose services via Visual Studio, the following error occurred:

```
target frontend: failed to solve: failed to compute cache key:
failed to calculate checksum of ref: "/docker/nginx.conf": not found
```

## Root Cause

The issue was with the Docker build context configuration in `docker-compose.yml`:

### Original Configuration (BROKEN)
```yaml
frontend:
  build:
    context: ../frontend          # Build context was frontend folder
    dockerfile: ../docker/Dockerfile
```

### In Dockerfile (BROKEN)
```dockerfile
COPY ../docker/nginx.conf /etc/nginx/conf.d/default.conf
```

**Why it failed:**
- The build context was `frontend/`
- Docker cannot access files outside the build context
- `nginx.conf` is in `docker/` folder, which is outside `frontend/`
- The path `../docker/nginx.conf` from `frontend/` tried to access parent directories, which Docker doesn't allow

## Solution

Changed the build context to the **root directory** of the project, allowing access to both `frontend/` and `docker/` folders.

### Fixed Configuration
```yaml
frontend:
  build:
    context: ..                    # Build context is now root (parent of docker/)
    dockerfile: docker/Dockerfile  # Dockerfile path relative to root
```

### In Dockerfile (FIXED)
```dockerfile
# Copy frontend package files
COPY frontend/package*.json ./

# Copy frontend source
COPY frontend/ .

# Copy nginx config (now accessible from root context)
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
```

## Files Modified

1. **docker/docker-compose.yml** - Updated frontend build context and dockerfile path
2. **docker/docker-compose.dev.yml** - Updated for consistency
3. **docker/Dockerfile** - Updated COPY commands to reference `frontend/` and `docker/`
4. **docker/Dockerfile.dev** - Updated COPY commands for dev builds

## Folder Structure

```
bottle-buddy-share/              ← Build context is now HERE (root)
├── backend/
│   └── ...
├── frontend/                    ← Contains React source code
│   ├── package.json
│   ├── src/
│   └── ...
└── docker/                      ← Contains Docker configuration
    ├── docker-compose.yml       ✅ FIXED
    ├── docker-compose.dev.yml   ✅ FIXED
    ├── Dockerfile               ✅ FIXED
    ├── Dockerfile.dev           ✅ FIXED
    └── nginx.conf               ✅ Now accessible!
```

## Testing the Fix

### From Command Line
```powershell
cd docker
docker-compose build frontend
docker-compose up -d
```

### From Visual Studio
1. Open `backend/BottleBuddyApi.sln`
2. Set `docker-compose` as startup project
3. Press F5
4. Should build and run without errors

## Why This Approach Works

✅ **Single build context** - All files are accessible from one root location
✅ **No parent directory access** - Docker doesn't need to traverse outside the context
✅ **Clearer paths** - `frontend/` and `docker/` paths are explicit
✅ **Consistent** - Both prod and dev Dockerfiles use same context approach

## Related Files

- `docker-compose.yml` - Production configuration
- `docker-compose.dev.yml` - Development configuration
- `Dockerfile` - Production frontend build
- `Dockerfile.dev` - Development frontend build
- `nginx.conf` - Nginx reverse proxy configuration

## Additional Notes

- The backend API build context remains unchanged (`../backend`)
- Volume mounts in `docker-compose.dev.yml` still use `../frontend:/app` for hot reload
- This change only affects the **build process**, not runtime behavior

---

**Status**: ✅ FIXED - Docker can now access nginx.conf during frontend build
