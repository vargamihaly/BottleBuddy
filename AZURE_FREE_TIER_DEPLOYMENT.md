# Azure FREE TIER Deployment Guide

Complete guide to deploying Bottle Buddy to Azure using **100% free resources**.

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Azure FREE TIER                       │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────┐         ┌──────────────────┐     │
│  │  Static Web App  │────────>│   App Service    │     │
│  │   (Frontend)     │         │   F1 (Backend)   │     │
│  │   FREE           │         │   FREE           │     │
│  └──────────────────┘         └────────┬─────────┘     │
│                                         │                │
│                                         v                │
│                               ┌──────────────────┐      │
│                               │   Azure SQL DB   │      │
│                               │   FREE (32MB)    │      │
│                               └──────────────────┘      │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │      Application Insights (5GB Free/month)        │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## 💰 Cost Breakdown

| Service | Tier | Cost | Limitations |
|---------|------|------|-------------|
| **Static Web Apps** | Free | $0/month | 100GB bandwidth/month, custom domains |
| **App Service** | F1 | $0/month | 60 min/day compute, sleeps after 20 min |
| **Azure SQL** | Free | $0/month | 32MB database (~5-10K users) |
| **Application Insights** | Free | $0/month | 5GB data/month |
| **TOTAL** | - | **$0/month** | Perfect for MVP/testing |

## 🎯 Prerequisites

### 1. Azure Account
- [Create free account](https://azure.microsoft.com/free/) (includes $200 credit)
- No credit card required for free tiers

### 2. Tools Installation
```bash
# Azure CLI
# Windows (PowerShell):
winget install Microsoft.AzureCLI

# macOS:
brew install azure-cli

# Linux:
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

### 3. GitHub Account
- Repository must be public or have GitHub Actions enabled

### 4. Required Secrets
Prepare these values (you'll need them during deployment):
- SQL admin username & password (8+ chars, complex)
- JWT secret key (32+ chars random string)
- Google OAuth Client ID & Secret

## 🚀 Deployment Steps

### Step 1: Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/bottle-buddy-share.git
cd bottle-buddy-share
```

### Step 2: Run Deployment Script

```bash
# Make script executable (Linux/macOS)
chmod +x scripts/deploy-to-azure.sh

# Run deployment
./scripts/deploy-to-azure.sh
```

The script will:
1. ✅ Prompt for all required configuration
2. ✅ Create Azure resource group
3. ✅ Deploy infrastructure via Bicep
4. ✅ Output GitHub secrets configuration
5. ✅ Provide next steps

**⏱️ Deployment time: 5-10 minutes**

### Step 3: Configure GitHub Secrets

After deployment completes, add these secrets to your GitHub repository:

**Navigate to:** `Settings → Secrets and variables → Actions → New repository secret`

#### Required Secrets:

1. **AZURE_CREDENTIALS**
   ```bash
   # Run this command to generate:
   az ad sp create-for-rbac \
     --name 'bottlebuddy-github-actions' \
     --role contributor \
     --scopes /subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/bottlebuddy-free-rg \
     --sdk-auth

   # Copy the entire JSON output as the secret value
   ```

2. **AZURE_STATIC_WEB_APPS_API_TOKEN**
   - Value is provided in deployment script output
   - Or get it from Azure Portal: Static Web App → Manage deployment token

3. **VITE_API_URL**
   - Format: `https://bottlebuddy-production-api.azurewebsites.net`
   - Provided in deployment script output

4. **VITE_GOOGLE_CLIENT_ID**
   - Your Google OAuth Client ID
   - Get from [Google Cloud Console](https://console.cloud.google.com/)

### Step 4: Deploy Application Code

```bash
# Push to GitHub to trigger deployment
git add .
git commit -m "Initial Azure deployment"
git push origin main
```

GitHub Actions will automatically:
- ✅ Build frontend → Deploy to Static Web Apps
- ✅ Build backend → Deploy to App Service

**⏱️ Build time: 3-5 minutes**

### Step 5: Run Database Migrations

```bash
# Navigate to backend
cd backend/src/BottleBuddy.Api

# Update connection string in appsettings.json or use environment variable
export ConnectionStrings__DefaultConnection="Server=tcp:bottlebuddy-production-sql.database.windows.net,1433;Initial Catalog=bottlebuddy;..."

# Run migrations
dotnet ef database update

# Or run from deployment script (automated)
```

### Step 6: Verify Deployment

1. **Frontend:** Visit your Static Web App URL
2. **Backend API:** Visit `https://your-api.azurewebsites.net/swagger`
3. **Health Check:** `https://your-api.azurewebsites.net/health`

## 🔧 Configuration

### Environment Variables

**Backend (Azure App Service):**
- Set in Azure Portal: App Service → Configuration → Application settings
- Or defined in Bicep template

**Frontend (Static Web Apps):**
- Set in Azure Portal: Static Web App → Configuration
- Or via Bicep `staticWebAppSettings` resource

### CORS Configuration

CORS is configured in Bicep to allow:
- Static Web App domain
- localhost:5173 (for development)

To add custom domains, update `main-free.bicep`:
```bicep
cors: {
  allowedOrigins: [
    'https://${staticWebAppName}.azurestaticapps.net'
    'https://your-custom-domain.com'
    'http://localhost:5173'
  ]
  supportCredentials: true
}
```

## 📊 Monitoring

### Application Insights

**Access:** Azure Portal → Application Insights → `bottlebuddy-production-insights`

**Key Metrics:**
- Request rates & response times
- Failed requests
- Server response times
- Custom telemetry

**Query Example:**
```kusto
requests
| where timestamp > ago(1h)
| summarize count() by resultCode
| render piechart
```

### Limitations Monitoring

**App Service F1 Limits:**
- 60 minutes compute/day
- Monitor: App Service → Metrics → CPU Time

**SQL Database:**
- 32MB storage
- Monitor: SQL Database → Metrics → Data space used

## ⚠️ Known Limitations

### App Service F1 (Free Tier)

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| 60 min/day compute | App stops after 60 min | Upgrade to B1 ($13/month) for production |
| Sleeps after 20 min | Cold start ~10-30s | Use external monitoring to keep alive |
| No custom domains | Uses *.azurewebsites.net | Upgrade to B1 |
| No scale out | Single instance | Acceptable for MVP |

### Azure SQL Free

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| 32MB storage | ~5-10K users | Upgrade to Basic (2GB, $5/month) |
| No backups | Data loss risk | Upgrade for production |
| Limited IOPS | Slower queries | Optimize queries, upgrade tier |

### Static Web Apps (Free)

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| 100GB bandwidth/month | ~500K requests | Upgrade to Standard ($9/month) |
| 0.5GB storage | Plenty for SPA | No issue for most apps |

## 🎯 Upgrade Path

When ready for production with more traffic:

```bash
# Upgrade App Service to B1 (removes time limits)
az appservice plan update \
  --name bottlebuddy-production-plan \
  --resource-group bottlebuddy-free-rg \
  --sku B1

# Upgrade SQL Database to Basic (2GB)
az sql db update \
  --resource-group bottlebuddy-free-rg \
  --server bottlebuddy-production-sql \
  --name bottlebuddy \
  --service-objective Basic
```

**New cost: ~$18/month**

## 🐛 Troubleshooting

### Deployment Fails

**Issue:** Bicep deployment fails
**Solution:**
```bash
# Check deployment logs
az deployment group show \
  --resource-group bottlebuddy-free-rg \
  --name main-free

# View detailed error
az deployment group list \
  --resource-group bottlebuddy-free-rg
```

### GitHub Actions Fails

**Issue:** Workflow fails on push
**Check:**
1. All GitHub secrets are configured
2. AZURE_CREDENTIALS is valid JSON
3. Resource names match in workflow files

### App Service Cold Start

**Issue:** First request takes 10-30 seconds
**Expected:** F1 tier sleeps after 20 min inactivity
**Solutions:**
- Upgrade to B1 for "Always On"
- Use external ping service (e.g., UptimeRobot)

### Database Connection Fails

**Issue:** Backend can't connect to SQL
**Check:**
1. Firewall allows Azure services: `0.0.0.0`
2. Connection string is correct
3. SQL admin password is complex enough

## 📚 Additional Resources

- [Azure Free Tier Details](https://azure.microsoft.com/free/)
- [Static Web Apps Documentation](https://learn.microsoft.com/azure/static-web-apps/)
- [App Service Free Tier](https://azure.microsoft.com/pricing/details/app-service/linux/)
- [Azure SQL Free Tier](https://azure.microsoft.com/pricing/details/sql-database/)

## 🆘 Support

**Issues?** Create an issue on GitHub with:
- Deployment logs
- Error messages
- Azure resource names

---

**💡 Pro Tip:** Start with FREE tier for MVP, monitor usage, upgrade only when needed!
