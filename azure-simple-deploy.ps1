# Azure Simple Deployment Script for YOLO Image Search
# This script deploys using Azure App Service with ZIP deployment (no Docker required)

$ErrorActionPreference = "Continue"

# Configuration
$RESOURCE_GROUP = "yolo-search-rg"
$LOCATION = "eastus"
$WEB_APP_NAME = "yolo-search-$(Get-Random -Minimum 1000 -Maximum 9999)"
$PLAN_NAME = "yolo-search-plan"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "YOLO Image Search - Azure Deployment" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Web App Name: $WEB_APP_NAME"
Write-Host ""

# Step 1: Create Resource Group
Write-Host "Step 1: Creating Resource Group..." -ForegroundColor Yellow
az group create --name $RESOURCE_GROUP --location $LOCATION

# Step 2: Create App Service Plan (Linux, Python)
Write-Host "Step 2: Creating App Service Plan (B1 tier)..." -ForegroundColor Yellow
az appservice plan create `
    --name $PLAN_NAME `
    --resource-group $RESOURCE_GROUP `
    --is-linux `
    --sku B1

# Step 3: Create Web App with Python runtime
Write-Host "Step 3: Creating Web App with Python 3.10..." -ForegroundColor Yellow
az webapp create `
    --resource-group $RESOURCE_GROUP `
    --plan $PLAN_NAME `
    --name $WEB_APP_NAME `
    --runtime "PYTHON:3.10"

# Step 4: Configure startup command
Write-Host "Step 4: Configuring startup command..." -ForegroundColor Yellow
az webapp config set `
    --resource-group $RESOURCE_GROUP `
    --name $WEB_APP_NAME `
    --startup-file "gunicorn --bind=0.0.0.0:8000 --timeout 600 app:app"

# Step 5: Set environment variables
Write-Host "Step 5: Setting environment variables..." -ForegroundColor Yellow
az webapp config appsettings set `
    --resource-group $RESOURCE_GROUP `
    --name $WEB_APP_NAME `
    --settings `
        SCM_DO_BUILD_DURING_DEPLOYMENT=true `
        PYTHONUNBUFFERED=1

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "Resource Created!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Web App URL: https://$WEB_APP_NAME.azurewebsites.net" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next: Deploy the code using:" -ForegroundColor Yellow
Write-Host "az webapp deploy --resource-group $RESOURCE_GROUP --name $WEB_APP_NAME --src-path deploy.zip --type zip"
Write-Host ""

# Save the web app name for later use
$WEB_APP_NAME | Out-File -FilePath "azure-webapp-name.txt"
Write-Host "Web app name saved to azure-webapp-name.txt"
