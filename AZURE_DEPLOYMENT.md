# Azure Deployment Guide for YOLO Image Search

This guide explains how to deploy the YOLO Image Search application to Microsoft Azure.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Azure Cloud                               │
│  ┌─────────────────┐    ┌──────────────────────────────┐   │
│  │ Azure Container │    │     Azure App Service        │   │
│  │    Registry     │───▶│    (Linux Container)         │   │
│  │  (ACR)          │    │                              │   │
│  │                 │    │  ┌────────────────────────┐  │   │
│  │ Docker Image    │    │  │   Docker Container     │  │   │
│  │ - Python 3.10   │    │  │                        │  │   │
│  │ - Node.js 18    │    │  │  ┌──────────────────┐  │  │   │
│  │ - YOLOv11       │    │  │  │ Express Server   │  │  │   │
│  │ - React Build   │    │  │  │ (Port 5000)      │  │  │   │
│  └─────────────────┘    │  │  ├──────────────────┤  │  │   │
│                         │  │  │ Python ML Engine │  │  │   │
│                         │  │  │ (YOLOv11)        │  │  │   │
│                         │  │  ├──────────────────┤  │  │   │
│                         │  │  │ React Frontend   │  │  │   │
│                         │  │  │ (Static Files)   │  │  │   │
│                         │  │  └──────────────────┘  │  │   │
│                         │  └────────────────────────┘  │   │
│                         └──────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Prerequisites

1. **Azure Account** - [Create free account](https://azure.microsoft.com/free/)
2. **Azure CLI** - [Install Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli)
3. **Docker Desktop** - [Install Docker](https://www.docker.com/products/docker-desktop)
4. **Node.js 18+** - For building the frontend

## Deployment Steps

### Step 1: Login to Azure

```powershell
az login
```

### Step 2: Build the Frontend

```powershell
cd frontend
npm install
npm run build
cd ..
```

### Step 3: Run the Deployment Script

**Windows (PowerShell):**
```powershell
.\azure-deploy.ps1
```

**Linux/Mac (Bash):**
```bash
chmod +x azure-deploy.sh
./azure-deploy.sh
```

### Step 4: Access Your Application

After deployment completes, your app will be available at:
```
https://yolo-image-search-app.azurewebsites.net
```

## Manual Deployment Steps

If you prefer to run commands manually:

### 1. Create Resource Group
```powershell
az group create --name yolo-image-search-rg --location eastus
```

### 2. Create Container Registry
```powershell
az acr create --resource-group yolo-image-search-rg --name yoloimagesearchacr --sku Basic --admin-enabled true
```

### 3. Build & Push Docker Image
```powershell
# Build frontend first
cd frontend && npm run build && cd ..

# Build Docker image
docker build -t yolo-image-search:latest .

# Login to ACR
az acr login --name yoloimagesearchacr

# Tag and push
docker tag yolo-image-search:latest yoloimagesearchacr.azurecr.io/yolo-image-search:latest
docker push yoloimagesearchacr.azurecr.io/yolo-image-search:latest
```

### 4. Create App Service
```powershell
# Create App Service Plan (B2 tier has 3.5GB RAM)
az appservice plan create --name yolo-app-plan --resource-group yolo-image-search-rg --is-linux --sku B2

# Get ACR credentials
$ACR_PASSWORD = az acr credential show --name yoloimagesearchacr --query "passwords[0].value" -o tsv

# Create Web App
az webapp create `
  --resource-group yolo-image-search-rg `
  --plan yolo-app-plan `
  --name yolo-image-search-app `
  --docker-registry-server-url https://yoloimagesearchacr.azurecr.io `
  --docker-registry-server-user yoloimagesearchacr `
  --docker-registry-server-password $ACR_PASSWORD `
  --deployment-container-image-name yoloimagesearchacr.azurecr.io/yolo-image-search:latest
```

### 5. Configure Settings
```powershell
az webapp config appsettings set `
  --resource-group yolo-image-search-rg `
  --name yolo-image-search-app `
  --settings WEBSITES_PORT=5000 NODE_ENV=production PYTHONUNBUFFERED=1
```

## Pricing Estimate

| Resource | SKU | Monthly Cost (approx) |
|----------|-----|----------------------|
| App Service Plan | B2 (3.5GB RAM) | ~$55/month |
| Container Registry | Basic | ~$5/month |
| **Total** | | **~$60/month** |

> 💡 **Tip:** Use B1 ($13/month) for testing, but B2 is recommended for ML workloads.

## Useful Commands

### View Logs
```powershell
az webapp log tail --name yolo-image-search-app --resource-group yolo-image-search-rg
```

### Restart App
```powershell
az webapp restart --name yolo-image-search-app --resource-group yolo-image-search-rg
```

### Redeploy After Changes
```powershell
# Rebuild frontend
cd frontend && npm run build && cd ..

# Rebuild and push Docker image
docker build -t yolo-image-search:latest .
docker tag yolo-image-search:latest yoloimagesearchacr.azurecr.io/yolo-image-search:latest
docker push yoloimagesearchacr.azurecr.io/yolo-image-search:latest

# Restart to pull new image
az webapp restart --name yolo-image-search-app --resource-group yolo-image-search-rg
```

### Delete Everything (Cleanup)
```powershell
az group delete --name yolo-image-search-rg --yes --no-wait
```

## Troubleshooting

### Container Not Starting
1. Check logs: `az webapp log tail --name yolo-image-search-app --resource-group yolo-image-search-rg`
2. Verify WEBSITES_PORT=5000 is set
3. Ensure Docker image builds successfully locally

### Out of Memory
- Upgrade to B2 or B3 tier
- YOLOv11m requires ~2-3GB RAM for inference

### Slow First Load
- Initial container startup takes 1-2 minutes
- YOLO model loading adds ~10-30 seconds
- Subsequent requests are fast

## Alternative: Azure Container Instances (Simpler, Cheaper)

For a simpler deployment without App Service:

```powershell
# Create container instance directly
az container create `
  --resource-group yolo-image-search-rg `
  --name yolo-container `
  --image yoloimagesearchacr.azurecr.io/yolo-image-search:latest `
  --registry-login-server yoloimagesearchacr.azurecr.io `
  --registry-username yoloimagesearchacr `
  --registry-password $ACR_PASSWORD `
  --cpu 2 `
  --memory 4 `
  --ports 5000 `
  --dns-name-label yolo-image-search `
  --environment-variables NODE_ENV=production PYTHONUNBUFFERED=1
```

Access at: `http://yolo-image-search.eastus.azurecontainer.io:5000`

---

## Questions?

If you encounter issues, check:
1. Azure Portal → Resource Group → Activity Log
2. App Service → Deployment Center → Logs
3. App Service → Log Stream
