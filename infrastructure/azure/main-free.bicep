// Bottle Buddy - FREE TIER Azure Infrastructure
// Frontend: Azure Static Web Apps (Free)
// Backend: Azure App Service F1 (Free)
// Database: Azure SQL Free (32MB)
// Estimated cost: $0/month (completely free!)

@description('The location for all resources')
param location string = resourceGroup().location

@description('The environment name (dev, staging, production)')
@allowed([
  'dev'
  'staging'
  'production'
])
param environment string = 'production'

@description('The base name for all resources')
param baseName string = 'bottlebuddy'

@description('SQL Database administrator username')
@secure()
param sqlAdminUsername string

@description('SQL Database administrator password')
@minLength(8)
@secure()
param sqlAdminPassword string

@description('JWT secret key (min 32 chars)')
@minLength(32)
@secure()
param jwtSecretKey string

@description('Google OAuth Client ID')
@secure()
param googleClientId string

@description('Google OAuth Client Secret')
@secure()
param googleClientSecret string

@description('GitHub repository URL for Static Web Apps (format: https://github.com/username/repo)')
param githubRepoUrl string = ''

@description('GitHub branch for Static Web Apps deployment')
param githubBranch string = 'main'

// Variables
var resourcePrefix = '${baseName}-${environment}'
var appServicePlanName = '${resourcePrefix}-plan'
var apiAppName = '${resourcePrefix}-api'
var staticWebAppName = '${resourcePrefix}-web'
var sqlServerName = '${resourcePrefix}-sql'
var sqlDatabaseName = 'bottlebuddy'
var applicationInsightsName = '${resourcePrefix}-insights'
var logAnalyticsWorkspaceName = '${resourcePrefix}-logs'

// Tags
var commonTags = {
  Environment: environment
  Application: 'BottleBuddy'
  ManagedBy: 'Bicep'
  CostProfile: 'Free'
}

// Log Analytics Workspace (Pay-as-you-go, low usage = minimal cost)
resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: logAnalyticsWorkspaceName
  location: location
  tags: commonTags
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
    features: {
      enableLogAccessUsingOnlyResourcePermissions: true
    }
  }
}

// Application Insights (Free 5GB/month)
resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: applicationInsightsName
  location: location
  tags: commonTags
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalyticsWorkspace.id
    RetentionInDays: 30
    IngestionMode: 'LogAnalytics'
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

// SQL Server (Logical Server - Free)
resource sqlServer 'Microsoft.Sql/servers@2023-05-01-preview' = {
  name: sqlServerName
  location: location
  tags: commonTags
  properties: {
    administratorLogin: sqlAdminUsername
    administratorLoginPassword: sqlAdminPassword
    version: '12.0'
    minimalTlsVersion: '1.2'
    publicNetworkAccess: 'Enabled'
  }
}

// SQL Server Firewall Rule - Allow Azure Services
resource sqlServerFirewallAzure 'Microsoft.Sql/servers/firewallRules@2023-05-01-preview' = {
  name: 'AllowAllWindowsAzureIps'
  parent: sqlServer
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

// SQL Database - FREE TIER (32MB database)
resource sqlDatabase 'Microsoft.Sql/servers/databases@2023-05-01-preview' = {
  name: sqlDatabaseName
  parent: sqlServer
  location: location
  tags: commonTags
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    collation: 'SQL_Latin1_General_CP1_CI_AS'
    maxSizeBytes: 32 * 1024 * 1024  // 32MB limit
    catalogCollation: 'SQL_Latin1_General_CP1_CI_AS'
    zoneRedundant: false
    readScale: 'Disabled'
    requestedBackupStorageRedundancy: 'Local'
  }
}

// App Service Plan - FREE TIER (F1)
// F1: Free (1GB RAM, 60 min/day compute, 1 GB storage)
resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: appServicePlanName
  location: location
  tags: commonTags
  sku: {
    name: 'F1'
    tier: 'Free'
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

// Backend API App Service (F1 Free Tier)
resource apiApp 'Microsoft.Web/sites@2023-01-01' = {
  name: apiAppName
  location: location
  tags: commonTags
  kind: 'app,linux'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'DOTNETCORE|9.0'
      alwaysOn: false  // Not available on Free tier
      http20Enabled: true
      minTlsVersion: '1.2'
      ftpsState: 'Disabled'
      cors: {
        allowedOrigins: [
          'https://${staticWebAppName}.azurestaticapps.net'
          'http://localhost:5173'
        ]
        supportCredentials: true
      }
      appSettings: [
        {
          name: 'ASPNETCORE_ENVIRONMENT'
          value: environment == 'production' ? 'Production' : 'Staging'
        }
        {
          name: 'ConnectionStrings__DefaultConnection'
          value: 'Server=tcp:${sqlServer.properties.fullyQualifiedDomainName},1433;Initial Catalog=${sqlDatabaseName};Persist Security Info=False;User ID=${sqlAdminUsername};Password=${sqlAdminPassword};MultipleActiveResultSets=True;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;'
        }
        {
          name: 'Jwt__Key'
          value: jwtSecretKey
        }
        {
          name: 'Jwt__Issuer'
          value: 'BottleBuddyApi'
        }
        {
          name: 'Jwt__Audience'
          value: 'BottleBuddyApi'
        }
        {
          name: 'Authentication__Google__ClientId'
          value: googleClientId
        }
        {
          name: 'Authentication__Google__ClientSecret'
          value: googleClientSecret
        }
        {
          name: 'ApplicationInsights__ConnectionString'
          value: applicationInsights.properties.ConnectionString
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: applicationInsights.properties.ConnectionString
        }
      ]
    }
  }
}

// Azure Static Web Apps (Free Tier)
resource staticWebApp 'Microsoft.Web/staticSites@2023-01-01' = {
  name: staticWebAppName
  location: 'westeurope'  // Static Web Apps available in limited regions
  tags: commonTags
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    repositoryUrl: githubRepoUrl
    branch: githubBranch
    buildProperties: {
      appLocation: '/frontend'
      apiLocation: ''  // We use separate API
      outputLocation: 'dist'
    }
  }
}

// Static Web App - Custom App Settings
resource staticWebAppSettings 'Microsoft.Web/staticSites/config@2023-01-01' = {
  name: 'appsettings'
  parent: staticWebApp
  properties: {
    VITE_API_URL: 'https://${apiApp.properties.defaultHostName}'
    VITE_GOOGLE_CLIENT_ID: googleClientId
  }
}

// Outputs
output apiAppUrl string = 'https://${apiApp.properties.defaultHostName}'
output staticWebAppUrl string = 'https://${staticWebApp.properties.defaultHostname}'
output staticWebAppName string = staticWebApp.name
output applicationInsightsConnectionString string = applicationInsights.properties.ConnectionString
output applicationInsightsInstrumentationKey string = applicationInsights.properties.InstrumentationKey
output sqlServerFQDN string = sqlServer.properties.fullyQualifiedDomainName
output sqlDatabaseName string = sqlDatabase.name
output deploymentToken string = staticWebApp.listSecrets().properties.apiKey
output estimatedMonthlyCost string = 'FREE ($0/month with free tiers)'
