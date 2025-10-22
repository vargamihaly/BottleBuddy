# Port 3668 Already Allocated - Fix Guide

## Problem

When starting Docker Compose, you get this error:

```
Error response from daemon: failed to set up container networking:
driver failed programming external connectivity on endpoint bottlebuddy-api:
Bind for 0.0.0.0:3668 failed: port is already allocated
```

## Root Cause

Port 3668 is in `TIME_WAIT` state, which means:
- A previous connection recently used this port
- Windows hasn't fully released the port yet
- This is normal TCP behavior
- TIME_WAIT typically lasts 30-120 seconds

## Quick Solutions

### Solution 1: Wait for Port Release (Easiest)

Simply wait 1-2 minutes for Windows to release the port, then retry:

```powershell
# Wait 60 seconds
Start-Sleep -Seconds 60

# Try again
cd docker
docker-compose up -d
```

### Solution 2: Restart Docker Desktop (Fastest)

1. Right-click **Docker Desktop** icon in system tray
2. Click **Quit Docker Desktop**
3. Wait 10 seconds
4. Start **Docker Desktop** again
5. Wait for it to fully start
6. Retry:
```powershell
cd docker
docker-compose up -d
```

### Solution 3: Kill Lingering Connections (Advanced)

```powershell
# Stop all Docker containers
cd docker
docker-compose down

# Remove all containers forcefully
docker rm -f $(docker ps -aq)

# Wait 60 seconds
Start-Sleep -Seconds 60

# Start services
docker-compose up -d
```

### Solution 4: Use Different Port (Temporary)

If you need to start immediately, temporarily change the port:

**Edit `docker/docker-compose.yml`:**

```yaml
api:
  # ... other config ...
  ports:
    - "3669:3668"  # Changed from "3668:3668"
```

**Then:**
```powershell
cd docker
docker-compose up -d
```

**Access API at:** http://localhost:3669/swagger (instead of 3668)

**Remember to change it back later!**

## Checking Port Status

### Check if port is in use:
```powershell
netstat -ano | findstr :3668
```

**Output meanings:**
- `LISTENING` = Port actively in use by a process
- `ESTABLISHED` = Active connection
- `TIME_WAIT` = Recently closed, will be free soon (30-120 seconds)
- No output = Port is free ✅

### Find what process is using the port:
```powershell
Get-NetTCPConnection -LocalPort 3668 | Select-Object State, OwningProcess
Get-Process -Id <OwningProcess>
```

## Prevention

### Always stop containers when done:

```powershell
# When stopping work
cd docker
docker-compose down

# This properly releases all ports
```

### Don't force-kill Docker Desktop
- Always use "Quit Docker Desktop" instead of Task Manager
- Gives Docker time to clean up properly

## Understanding TIME_WAIT

**What is TIME_WAIT?**
- Normal TCP state after closing a connection
- Ensures all packets are properly finished
- Prevents port reuse conflicts
- Automatically clears after timeout

**How long does it last?**
- Windows: 30-120 seconds (default: 120s)
- Linux: 60 seconds (default)
- Cannot be manually cleared on Windows without registry changes

**Is it a problem?**
- No, it's normal TCP behavior
- Just wait or use one of the solutions above

## Troubleshooting

### Still getting error after waiting?

**Check for other services using the port:**
```powershell
# List all processes and ports
netstat -ano | findstr :3668

# If you see a process ID (not 0), kill it:
taskkill /PID <process_id> /F
```

### Multiple ports conflicting?

Check all ports used by the application:
- 3668 - Backend API
- 5432 - PostgreSQL
- 16686 - Jaeger UI
- 4317/4318 - Jaeger OTLP
- 8080 - Frontend

```powershell
# Check all at once
netstat -ano | findstr "3668 5432 16686 4317 4318 8080"
```

### Docker Desktop won't start?

1. Open Task Manager (Ctrl+Shift+Esc)
2. End these processes:
   - Docker Desktop
   - com.docker.service
   - com.docker.backend
3. Restart Docker Desktop

## Recommended Workflow

### Starting development:
```powershell
# 1. Ensure Docker Desktop is running
# 2. Navigate to docker folder
cd D:\Repositories\bottle-buddy-share\bottle-buddy-share\docker

# 3. Clean start (removes old containers)
docker-compose down
docker-compose up -d

# 4. Check status
docker-compose ps
docker-compose logs -f
```

### Stopping development:
```powershell
# Navigate to docker folder
cd D:\Repositories\bottle-buddy-share\bottle-buddy-share\docker

# Stop and remove containers (releases ports)
docker-compose down

# OR just stop without removing (faster next start)
docker-compose stop
```

### Restarting after code changes:
```powershell
# Rebuild and restart
cd docker
docker-compose down
docker-compose build
docker-compose up -d
```

## Summary

**Most Common Solution:**
1. Run `docker-compose down`
2. Wait 60 seconds
3. Run `docker-compose up -d`

**Fastest Solution:**
1. Restart Docker Desktop
2. Run `docker-compose up -d`

**If stuck:**
- Restart your computer (nuclear option, but works 100%)

---

**Status**: This is a normal Windows networking behavior, not a bug. Just wait or restart Docker Desktop.
