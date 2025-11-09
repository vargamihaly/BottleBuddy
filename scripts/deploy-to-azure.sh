#!/bin/bash

# Bottle Buddy - Azure FREE TIER Deployment Script
# This script automates the one-time infrastructure deployment to Azure
# After this, use GitHub Actions for code deployments

set -e  # Exit on error

echo "🚀 Bottle Buddy Azure FREE TIER Deployment"
echo "============================================"
echo ""
echo "This script will deploy:"
echo "  ✅ Azure SQL Database (Free 32MB)"
echo "  ✅ Azure App Service F1 (Backend API)"
echo "  ✅ Azure Static Web Apps (Frontend)"
echo "  ✅ Application Insights"
echo ""
echo "💰 Estimated Monthly Cost: \$0 (FREE)"
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed. Please install it first."
    echo "   Visit: https://learn.microsoft.com/cli/azure/install-azure-cli"
    exit 1
fi

# Check if logged in
echo "🔐 Checking Azure login status..."
az account show &> /dev/null || {
    echo "❌ Not logged in to Azure. Running 'az login'..."
    az login
}

# Variables
RESOURCE_GROUP="bottlebuddy-free-rg"
LOCATION="westeurope"
ENVIRONMENT="production"
BASE_NAME="bottlebuddy"

echo ""
echo "📋 Deployment Configuration:"
echo "  Resource Group: $RESOURCE_GROUP"
echo "  Location: $LOCATION"
echo "  Environment: $ENVIRONMENT"
echo ""

# Prompt for subscription
echo "📌 Available subscriptions:"
az account list --output table
echo ""
read -p "Enter your Azure subscription ID: " SUBSCRIPTION_ID
az account set --subscription "$SUBSCRIPTION_ID"

echo ""
echo "🔑 Required Secrets Configuration"
echo "=================================="
echo ""

# SQL Admin credentials
read -p "Enter SQL admin username (default: bottlebuddyadmin): " SQL_USER
SQL_USER=${SQL_USER:-bottlebuddyadmin}

while true; do
    read -sp "Enter SQL admin password (min 8 chars, must include uppercase, lowercase, number, special char): " SQL_PASSWORD
    echo ""
    read -sp "Confirm SQL admin password: " SQL_PASSWORD_CONFIRM
    echo ""
    if [ "$SQL_PASSWORD" = "$SQL_PASSWORD_CONFIRM" ] && [ ${#SQL_PASSWORD} -ge 8 ]; then
        break
    else
        echo "❌ Passwords don't match or too short. Try again."
    fi
done

# JWT Secret
while true; do
    read -sp "Enter JWT secret key (min 32 chars): " JWT_SECRET
    echo ""
    if [ ${#JWT_SECRET} -ge 32 ]; then
        break
    else
        echo "❌ JWT secret must be at least 32 characters. Try again."
    fi
done

# Google OAuth
read -p "Enter Google OAuth Client ID: " GOOGLE_CLIENT_ID
read -sp "Enter Google OAuth Client Secret: " GOOGLE_CLIENT_SECRET
echo ""

# GitHub repository
read -p "Enter your GitHub repository URL (e.g., https://github.com/username/bottle-buddy-share): " GITHUB_REPO
read -p "Enter your GitHub branch (default: main): " GITHUB_BRANCH
GITHUB_BRANCH=${GITHUB_BRANCH:-main}

echo ""
echo "✅ Configuration complete!"
echo ""
read -p "Continue with deployment? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ]; then
    echo "❌ Deployment cancelled"
    exit 0
fi

# Create Resource Group
echo ""
echo "📦 Creating resource group..."
az group create \
    --name "$RESOURCE_GROUP" \
    --location "$LOCATION" \
    --output table

# Deploy infrastructure using Bicep
echo ""
echo "🏗️  Deploying FREE TIER infrastructure with Bicep..."
echo "   This may take 5-10 minutes..."
az deployment group create \
    --resource-group "$RESOURCE_GROUP" \
    --template-file ../infrastructure/azure/main-free.bicep \
    --parameters environment="$ENVIRONMENT" \
                 baseName="$BASE_NAME" \
                 sqlAdminUsername="$SQL_USER" \
                 sqlAdminPassword="$SQL_PASSWORD" \
                 jwtSecretKey="$JWT_SECRET" \
                 googleClientId="$GOOGLE_CLIENT_ID" \
                 googleClientSecret="$GOOGLE_CLIENT_SECRET" \
                 githubRepoUrl="$GITHUB_REPO" \
                 githubBranch="$GITHUB_BRANCH" \
    --output table

# Get deployment outputs
echo ""
echo "📊 Retrieving deployment outputs..."
API_URL=$(az deployment group show \
    --resource-group "$RESOURCE_GROUP" \
    --name main-free \
    --query properties.outputs.apiAppUrl.value -o tsv)

FRONTEND_URL=$(az deployment group show \
    --resource-group "$RESOURCE_GROUP" \
    --name main-free \
    --query properties.outputs.staticWebAppUrl.value -o tsv)

STATIC_WEB_APP_NAME=$(az deployment group show \
    --resource-group "$RESOURCE_GROUP" \
    --name main-free \
    --query properties.outputs.staticWebAppName.value -o tsv)

DEPLOYMENT_TOKEN=$(az deployment group show \
    --resource-group "$RESOURCE_GROUP" \
    --name main-free \
    --query properties.outputs.deploymentToken.value -o tsv)

APP_INSIGHTS_KEY=$(az deployment group show \
    --resource-group "$RESOURCE_GROUP" \
    --name main-free \
    --query properties.outputs.applicationInsightsInstrumentationKey.value -o tsv)

# Run database migrations
echo ""
echo "🗄️  Running database migrations..."
echo "   Note: This uses the backend API's connection string"
cd D:/Repositories/bottle-buddy-share/bottle-buddy-share/backend/src/BottleBuddy.Api
dotnet ef database update --no-build || echo "⚠️  Migration skipped (run manually if needed)"
cd ../../..

# Display results
echo ""
echo "✅ Infrastructure deployment completed!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📌 Application URLs:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   Frontend: $FRONTEND_URL"
echo "   Backend API: $API_URL"
echo "   API Swagger: ${API_URL}/swagger"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔑 GitHub Secrets (Required for CI/CD):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Add these secrets to your GitHub repository:"
echo "  Settings → Secrets and variables → Actions → New repository secret"
echo ""
echo "1. AZURE_CREDENTIALS"
echo "   Run this command to get the value:"
echo "   az ad sp create-for-rbac --name 'bottlebuddy-github-actions' \\"
echo "     --role contributor \\"
echo "     --scopes /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP \\"
echo "     --sdk-auth"
echo ""
echo "2. AZURE_STATIC_WEB_APPS_API_TOKEN"
echo "   Value: $DEPLOYMENT_TOKEN"
echo ""
echo "3. VITE_API_URL"
echo "   Value: $API_URL"
echo ""
echo "4. VITE_GOOGLE_CLIENT_ID"
echo "   Value: $GOOGLE_CLIENT_ID"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Monitoring:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   Application Insights Key: $APP_INSIGHTS_KEY"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔗 Next Steps:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   1. Add the GitHub secrets listed above"
echo "   2. Push code to trigger GitHub Actions deployment"
echo "   3. Visit $FRONTEND_URL to test your application"
echo "   4. Configure custom domain (optional)"
echo "   5. Monitor usage in Azure Portal"
echo ""
echo "💰 Cost Reminder: This deployment uses FREE TIERS ONLY (\$0/month)"
echo ""
echo "📚 Full documentation: See AZURE_FREE_TIER_DEPLOYMENT.md"
echo ""
