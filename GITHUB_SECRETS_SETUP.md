# GitHub Secrets Setup Guide

This guide explains how to configure GitHub repository secrets for automated deployments.

## 📍 Location

`Your Repository → Settings → Secrets and variables → Actions → New repository secret`

## 🔑 Required Secrets

### 1. AZURE_CREDENTIALS

**Purpose:** Allows GitHub Actions to authenticate with Azure

**How to get:**
```bash
# Replace YOUR_SUBSCRIPTION_ID with your actual subscription ID
az ad sp create-for-rbac \
  --name 'bottlebuddy-github-actions' \
  --role contributor \
  --scopes /subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/bottlebuddy-free-rg \
  --sdk-auth
```

**Expected output:**
```json
{
  "clientId": "xxx",
  "clientSecret": "xxx",
  "subscriptionId": "xxx",
  "tenantId": "xxx",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```

**Action:** Copy the ENTIRE JSON output as the secret value

---

### 2. AZURE_STATIC_WEB_APPS_API_TOKEN

**Purpose:** Deployment token for Azure Static Web Apps

**Option A - From Deployment Script:**
- Look for "DEPLOYMENT_TOKEN" in the output of `deploy-to-azure.sh`

**Option B - From Azure Portal:**
1. Go to Azure Portal
2. Navigate to your Static Web App (`bottlebuddy-production-web`)
3. Click "Manage deployment token"
4. Copy the token

**Format:** Long alphanumeric string (e.g., `abc123def456...`)

---

### 3. VITE_API_URL

**Purpose:** Backend API URL for frontend environment variables

**How to get:**
```bash
# From deployment script output, or:
az webapp show \
  --name bottlebuddy-production-api \
  --resource-group bottlebuddy-free-rg \
  --query defaultHostName -o tsv
```

**Format:** `https://bottlebuddy-production-api.azurewebsites.net`

**⚠️ Important:** Must include `https://` prefix

---

### 4. VITE_GOOGLE_CLIENT_ID

**Purpose:** Google OAuth authentication

**How to get:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to: APIs & Services → Credentials
4. Find your OAuth 2.0 Client ID
5. Copy the Client ID

**Format:** `123456789-abcdefghijklmnop.apps.googleusercontent.com`

**Authorized JavaScript origins:**
- `https://bottlebuddy-production-web.azurestaticapps.net`
- `http://localhost:5173` (for development)

**Authorized redirect URIs:**
- `https://bottlebuddy-production-web.azurestaticapps.net/auth/callback`
- `http://localhost:5173/auth/callback`

---

## ✅ Verification Checklist

After adding all secrets, verify:

- [ ] All 4 secrets are added
- [ ] No extra spaces in secret values
- [ ] VITE_API_URL includes `https://`
- [ ] AZURE_CREDENTIALS is valid JSON
- [ ] Google OAuth redirect URIs are configured

## 🧪 Test Deployment

After adding secrets, trigger a deployment:

```bash
# Make a small change and push
git commit --allow-empty -m "Test deployment"
git push origin main
```

**Check:** `Actions` tab in GitHub for workflow progress

## 🐛 Common Issues

### ❌ Error: "Azure login failed"

**Cause:** Invalid AZURE_CREDENTIALS
**Fix:**
1. Regenerate service principal
2. Ensure it's valid JSON (no extra quotes)
3. Check subscription ID matches

### ❌ Error: "Static Web App deployment failed"

**Cause:** Invalid AZURE_STATIC_WEB_APPS_API_TOKEN
**Fix:**
1. Get new token from Azure Portal
2. Ensure no extra spaces

### ❌ Frontend can't connect to backend

**Cause:** Wrong VITE_API_URL
**Fix:**
1. Verify URL format: `https://your-app.azurewebsites.net`
2. Check CORS settings in backend
3. Ensure backend is deployed and running

### ❌ Google OAuth fails

**Cause:** Redirect URI mismatch
**Fix:**
1. Add Static Web App URL to Google Console
2. Match exact URLs (with/without trailing slash)
3. Wait 5-10 minutes for Google to propagate changes

## 🔒 Security Best Practices

1. **Never commit secrets to Git**
   - Use `.env.local` for local development
   - Add `.env*` to `.gitignore`

2. **Rotate secrets regularly**
   - Regenerate service principal every 90 days
   - Update deployment tokens annually

3. **Use least privilege**
   - Service principal only has `contributor` role on resource group
   - Not subscription-wide access

4. **Monitor access**
   - Check Azure Portal → Activity Log
   - Review GitHub Actions logs

## 📱 Testing Locally

To test with the same configuration locally:

```bash
# Create .env.local in /frontend
cat > frontend/.env.local << EOF
VITE_API_URL=https://bottlebuddy-production-api.azurewebsites.net
VITE_GOOGLE_CLIENT_ID=your-client-id
EOF

# Run frontend
cd frontend
npm install
npm run dev
```

**⚠️ Never commit `.env.local` to Git!**

## 🆘 Need Help?

1. Check GitHub Actions logs: `Actions` tab → Failed workflow → View logs
2. Check Azure deployment logs: Azure Portal → App Service → Deployment Center
3. Verify secrets: Settings → Secrets and variables → Actions

---

**✅ Once all secrets are configured, pushes to `main` will automatically deploy!**
