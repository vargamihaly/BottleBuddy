# Azure Deployment - Complete Guide

Complete documentation for deploying Bottle Buddy to Azure.

## 📖 Documentation Index

| Document | Purpose | Audience |
|----------|---------|----------|
| **[AZURE_QUICK_START.md](./AZURE_QUICK_START.md)** | Get started in 5 minutes | First-time deployers |
| **[AZURE_FREE_TIER_DEPLOYMENT.md](./AZURE_FREE_TIER_DEPLOYMENT.md)** | Complete FREE tier guide | All users |
| **[GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md)** | GitHub secrets configuration | CI/CD setup |

## 🏗️ Architecture

### FREE Tier Architecture

```
GitHub Push
    ↓
GitHub Actions
    ├→ Frontend Build → Azure Static Web Apps (FREE)
    └→ Backend Build  → Azure App Service F1 (FREE)
                            ↓
                        Azure SQL Free (32MB)
```

## 📁 Deployment Files Overview

### Infrastructure

```
infrastructure/azure/
├── main-free.bicep                    # FREE tier Bicep template
├── parameters-free.example.json       # Parameter template (copy & fill)
└── .gitignore                         # Prevents committing secrets
```

### Scripts

```
scripts/
└── deploy-to-azure.sh                 # One-time infrastructure setup
```

### CI/CD

```
.github/workflows/
├── azure-static-web-apps.yml          # Frontend deployment
└── azure-deploy-backend.yml           # Backend deployment
```

### Documentation

```
├── AZURE_QUICK_START.md               # 5-minute quick start
├── AZURE_FREE_TIER_DEPLOYMENT.md      # Complete deployment guide
├── GITHUB_SECRETS_SETUP.md            # GitHub secrets howto
└── AZURE_DEPLOYMENT.md                # This file
```

## 🎯 Deployment Flow

### One-Time Setup (Infrastructure)

```bash
# 1. Run deployment script
./scripts/deploy-to-azure.sh

# This creates:
# - Resource Group
# - Static Web App (frontend)
# - App Service F1 (backend)
# - SQL Database FREE
# - Application Insights
```

### Continuous Deployment (Code)

```bash
# 2. Push code to GitHub
git push origin main

# GitHub Actions automatically:
# - Builds frontend → Deploys to Static Web Apps
# - Builds backend → Deploys to App Service
```

## 💰 Cost Breakdown

| Resource | SKU | Monthly Cost | Limits |
|----------|-----|--------------|--------|
| Static Web Apps | Free | $0 | 100GB bandwidth |
| App Service | F1 | $0 | 60 min/day compute |
| SQL Database | Free | $0 | 32MB storage |
| Application Insights | Free | $0 | 5GB data/month |
| **TOTAL** | - | **$0** | Perfect for MVP |

## 🔑 Required Secrets

### For Infrastructure (One-time)

Provided during `deploy-to-azure.sh`:
- SQL admin username & password
- JWT secret key (32+ chars)
- Google OAuth Client ID & Secret
- GitHub repository URL

### For CI/CD (GitHub Secrets)

Add to GitHub repository:
1. `AZURE_CREDENTIALS` - Service principal for Azure login
2. `AZURE_STATIC_WEB_APPS_API_TOKEN` - Static Web App deployment token
3. `VITE_API_URL` - Backend API URL
4. `VITE_GOOGLE_CLIENT_ID` - Google OAuth Client ID

**Detailed instructions:** [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md)

## 🚀 Quick Commands

### Deploy Infrastructure

```bash
# Full guided deployment
./scripts/deploy-to-azure.sh

# Or manual Bicep deployment
az deployment group create \
  --resource-group bottlebuddy-free-rg \
  --template-file infrastructure/azure/main-free.bicep \
  --parameters @infrastructure/azure/parameters-free.json
```

### Deploy Application Code

```bash
# Automatic via GitHub push
git push origin main

# Or manual backend deployment
cd backend/src/BottleBuddy.Api
dotnet publish -c Release -o ./publish
az webapp deployment source config-zip \
  --resource-group bottlebuddy-free-rg \
  --name bottlebuddy-production-api \
  --src publish.zip
```

### Database Migrations

```bash
cd backend/src/BottleBuddy.Api
dotnet ef database update
```

## 📊 Monitoring

### Application Insights

**Access:** Azure Portal → Application Insights → `bottlebuddy-production-insights`

**Key Queries:**
```kusto
// Request rate
requests
| where timestamp > ago(1h)
| summarize count() by bin(timestamp, 5m)

// Failed requests
requests
| where success == false
| project timestamp, name, resultCode, customDimensions
```

### App Service Metrics

**Access:** Azure Portal → App Service → Metrics

**Monitor:**
- CPU Time (F1 limit: 60 min/day)
- Memory usage
- HTTP errors

### SQL Database

**Access:** Azure Portal → SQL Database → Query Performance Insight

**Monitor:**
- Data space used (32MB limit)
- DTU usage
- Query performance

## ⚠️ Known Limitations

### App Service F1 (Free Tier)

- **60 min/day compute:** App stops after reaching limit
- **Sleeps after 20 min:** First request has ~10-30s cold start
- **No Always On:** Can't prevent sleeping
- **No scale out:** Single instance only

**Solution:** Upgrade to B1 ($13/month) for production

### Azure SQL Free

- **32MB storage:** Supports ~5-10K users
- **No automated backups:** Manual exports only
- **Limited performance:** Basic IOPS

**Solution:** Upgrade to Basic 2GB ($5/month) for production

## 🎯 Upgrade Path

### When to Upgrade

Upgrade when you experience:
- ✅ App stops due to 60 min limit (daily)
- ✅ Database nearing 32MB
- ✅ Slow query performance
- ✅ Need 24/7 availability

### Upgrade Commands

```bash
# Upgrade App Service to B1 (removes time limits)
az appservice plan update \
  --name bottlebuddy-production-plan \
  --resource-group bottlebuddy-free-rg \
  --sku B1

# Upgrade SQL to Basic (2GB, backups)
az sql db update \
  --resource-group bottlebuddy-free-rg \
  --server bottlebuddy-production-sql \
  --name bottlebuddy \
  --service-objective Basic
```

**New monthly cost:** ~$18/month

## 🐛 Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| GitHub Actions fails | Missing secrets | Verify all 4 secrets in GitHub |
| Frontend can't connect | Wrong API URL | Check VITE_API_URL format |
| Backend cold starts | F1 tier sleeping | Expected behavior, upgrade to B1 |
| Database connection fails | Firewall rules | Verify Azure services allowed |

**Full troubleshooting:** [AZURE_FREE_TIER_DEPLOYMENT.md#-troubleshooting](./AZURE_FREE_TIER_DEPLOYMENT.md#-troubleshooting)

## 📚 Additional Resources

- [Azure Free Tier](https://azure.microsoft.com/free/)
- [Static Web Apps Docs](https://learn.microsoft.com/azure/static-web-apps/)
- [App Service Documentation](https://learn.microsoft.com/azure/app-service/)
- [Azure SQL Database](https://learn.microsoft.com/azure/azure-sql/)

## 🆘 Support

**Need help?**
1. Check documentation above
2. Review GitHub Actions logs
3. Check Azure Portal deployment logs
4. Create GitHub issue with error details

---

**✅ Start here:** [AZURE_QUICK_START.md](./AZURE_QUICK_START.md)
