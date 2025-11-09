# Azure Deployment - Quick Start (5 Minutes)

Get Bottle Buddy running on Azure FREE tier in 5 simple steps!

## 🎯 What You'll Get

- ✅ **Frontend:** Azure Static Web Apps (FREE)
- ✅ **Backend:** Azure App Service F1 (FREE)
- ✅ **Database:** Azure SQL 32MB (FREE)
- ✅ **Cost:** $0/month

## ⚡ Prerequisites (2 minutes)

```bash
# 1. Install Azure CLI
# macOS:
brew install azure-cli

# Windows (PowerShell as Admin):
winget install Microsoft.AzureCLI

# 2. Login to Azure
az login

# 3. Verify subscription
az account list --output table
```

**Prepare these values:**
- SQL password (8+ chars, complex)
- JWT secret (32+ random chars)
- Google OAuth Client ID & Secret
- Your GitHub repo URL

## 🚀 Deploy in 3 Commands

### Step 1: Run Deployment Script (5-10 min)

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/bottle-buddy-share.git
cd bottle-buddy-share

# Run deployment
chmod +x scripts/deploy-to-azure.sh
./scripts/deploy-to-azure.sh
```

**The script will ask for:**
1. Azure subscription ID
2. SQL admin credentials
3. JWT secret
4. Google OAuth credentials
5. GitHub repository URL

**Then it will:**
- Create all Azure resources
- Configure settings
- Output GitHub secrets

### Step 2: Add GitHub Secrets (2 min)

Copy the secrets from script output to:
`GitHub Repo → Settings → Secrets and variables → Actions`

**Required secrets:**
1. `AZURE_CREDENTIALS` (from `az ad sp create-for-rbac` command)
2. `AZURE_STATIC_WEB_APPS_API_TOKEN` (from script output)
3. `VITE_API_URL` (from script output)
4. `VITE_GOOGLE_CLIENT_ID` (your Google Client ID)

**Detailed instructions:** See [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md)

### Step 3: Deploy Code (3-5 min)

```bash
# Push to GitHub
git add .
git commit -m "Initial Azure deployment"
git push origin main
```

**GitHub Actions will automatically:**
- ✅ Build & deploy frontend to Static Web Apps
- ✅ Build & deploy backend to App Service

**Monitor progress:** GitHub → Actions tab

## ✅ Verify Deployment

1. **Frontend:** `https://bottlebuddy-production-web.azurestaticapps.net`
2. **Backend API:** `https://bottlebuddy-production-api.azurewebsites.net/swagger`
3. **Health:** `https://bottlebuddy-production-api.azurewebsites.net/health`

## 🎉 That's It!

Your app is now running on Azure FREE tier!

## 📚 Next Steps

- [Full Deployment Guide](./AZURE_FREE_TIER_DEPLOYMENT.md)
- [Troubleshooting](./AZURE_FREE_TIER_DEPLOYMENT.md#-troubleshooting)
- [Upgrade to Production](./AZURE_FREE_TIER_DEPLOYMENT.md#-upgrade-path)

## 🐛 Common Issues

**Q: GitHub Actions fails?**
A: Check all 4 secrets are added correctly

**Q: Frontend can't connect to backend?**
A: Verify VITE_API_URL includes `https://`

**Q: App is slow on first request?**
A: Normal for F1 tier (cold start ~10-30s)

**Q: Need help?**
A: See [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md#-common-issues)

---

**💡 Pro Tip:** Deployment script output contains ALL the secrets you need. Save it!
