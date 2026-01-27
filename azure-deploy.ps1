# Azure Deployment Script for YOLO Image Search (Windows PowerShell)
# Prerequisites: Azure CLI installed and logged in (az login)

# ============================================
# CONFIGURATION - Update these values
# ============================================
$RESOURCE_GROUP = "yolo-image-search-rg"
$LOCATION = "eastus"
$ACR_NAME = "yoloimagesearchacr"  # Must be globally unique, lowercase, no hyphens
$APP_SERVICE_PLAN = "yolo-app-plan"
$WEB_APP_NAME = "yolo-image-search-app"  # Must be globally unique

# ============================================
# Step 1: Create Resource Group
# ============================================
Write-Host "Creating Resource Group..." -ForegroundColor Cyan
az group create --name $RESOURCE_GROUP --location $LOCATION

# ============================================
# Step 2: Create Azure Container Registry
# ============================================
Write-Host "Creating Azure Container Registry..." -ForegroundColor Cyan
az acr create `
  --resource-group $RESOURCE_GROUP `
  --name $ACR_NAME `
  --sku Basic `
  --admin-enabled true

# Get ACR credentials
$ACR_USERNAME = az acr credential show --name $ACR_NAME --query "username" -o tsv
$ACR_PASSWORD = az acr credential show --name $ACR_NAME --query "passwords[0].value" -o tsv
$ACR_LOGIN_SERVER = az acr show --name $ACR_NAME --query "loginServer" -o tsv

Write-Host "ACR Login Server: $ACR_LOGIN_SERVER" -ForegroundColor Green

# ============================================
# Step 3: Build and Push Docker Image
# ============================================
Write-Host "Building Frontend..." -ForegroundColor Cyan
Set-Location frontend
npm run build
Set-Location ..

Write-Host "Building Docker Image..." -ForegroundColor Cyan
docker build -t yolo-image-search:latest .

Write-Host "Tagging and Pushing to ACR..." -ForegroundColor Cyan
docker tag yolo-image-search:latest "$ACR_LOGIN_SERVER/yolo-image-search:latest"
az acr login --name $ACR_NAME
docker push "$ACR_LOGIN_SERVER/yolo-image-search:latest"

# ============================================
# Step 4: Create App Service Plan (Linux)
# ============================================
Write-Host "Creating App Service Plan..." -ForegroundColor Cyan
az appservice plan create `
  --name $APP_SERVICE_PLAN `
  --resource-group $RESOURCE_GROUP `
  --is-linux `
  --sku B2  # B2 has 3.5GB RAM, good for ML workloads

# ============================================
# Step 5: Create Web App from Container
# ============================================
Write-Host "Creating Web App..." -ForegroundColor Cyan
az webapp create `
  --resource-group $RESOURCE_GROUP `
  --plan $APP_SERVICE_PLAN `
  --name $WEB_APP_NAME `
  --docker-registry-server-url "https://$ACR_LOGIN_SERVER" `
  --docker-registry-server-user $ACR_USERNAME `
  --docker-registry-server-password $ACR_PASSWORD `
  --deployment-container-image-name "$ACR_LOGIN_SERVER/yolo-image-search:latest"

# ============================================
# Step 6: Configure App Settings
# ============================================
Write-Host "Configuring App Settings..." -ForegroundColor Cyan
az webapp config appsettings set `
  --resource-group $RESOURCE_GROUP `
  --name $WEB_APP_NAME `
  --settings WEBSITES_PORT=5000 NODE_ENV=production PYTHONUNBUFFERED=1

# Enable persistent storage
az webapp config appsettings set `
  --resource-group $RESOURCE_GROUP `
  --name $WEB_APP_NAME `
  --settings WEBSITES_ENABLE_APP_SERVICE_STORAGE=true

# ============================================
# Step 7: Enable Continuous Deployment (Optional)
# ============================================
az webapp deployment container config `
  --resource-group $RESOURCE_GROUP `
  --name $WEB_APP_NAME `
  --enable-cd true

# ============================================
# Done!
# ============================================
Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host "Your app is available at: https://$WEB_APP_NAME.azurewebsites.net" -ForegroundColor Yellow
Write-Host ""
Write-Host "To view logs:" -ForegroundColor Cyan
Write-Host "az webapp log tail --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP"
Write-Host ""
Write-Host "To redeploy after changes:" -ForegroundColor Cyan
Write-Host "docker build -t yolo-image-search:latest ."
Write-Host "docker tag yolo-image-search:latest $ACR_LOGIN_SERVER/yolo-image-search:latest"
Write-Host "docker push $ACR_LOGIN_SERVER/yolo-image-search:latest"
Write-Host "az webapp restart --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP"
