# cc deploy — Azure Deployment Orchestrator

> **Rank**: #2 (Critical)
> **Effort**: High (3-4 weeks)
> **Dependencies**: Azure CLI, Azure Developer CLI (azd), Docker

## The Problem

Deploying Crown Commerce to Azure requires coordinating:

- **11 backend services** as Azure Container Apps
- **1 API gateway** (YARP reverse proxy) as a Container App
- **3+ frontend apps** as Azure Static Web Apps
- **11 SQL Server databases** on Azure SQL
- **1 RabbitMQ instance** as a Container App
- **DNS configuration** for custom domains (originhair.com, manehaus.com, admin.originhair.com)
- **SSL certificates** via Azure-managed certificates
- **Environment variables** and connection strings per service

Doing this manually involves 50+ Azure CLI commands, each with service-specific parameters. One typo in a connection string takes down a service. Forgetting to run migrations after deploying new code causes runtime errors.

## The Solution

A single CLI that knows the full topology and deploys services in the correct order with health verification.

## Deployment Topology

```
Azure Container App Environment
├── crowncommerce-api-gateway     (YARP, routes /api/* to services)
├── crowncommerce-catalog-api
├── crowncommerce-content-api
├── crowncommerce-identity-api
├── crowncommerce-inquiry-api
├── crowncommerce-newsletter-api
├── crowncommerce-notification-api
├── crowncommerce-order-api
├── crowncommerce-payment-api
├── crowncommerce-chat-api
├── crowncommerce-crm-api
├── crowncommerce-scheduling-api
└── crowncommerce-rabbitmq

Azure SQL (Logical Server: crowncommerce.database.windows.net)
├── CrownCommerce_Catalog
├── CrownCommerce_Chat
├── CrownCommerce_Content
├── CrownCommerce_Crm
├── CrownCommerce_Identity
├── CrownCommerce_Inquiry
├── CrownCommerce_Newsletter
├── CrownCommerce_Notification
├── CrownCommerce_Order
├── CrownCommerce_Payment
└── CrownCommerce_Scheduling

Azure Static Web Apps
├── originhair.com                 (origin-hair-collective)
├── manehaus.com                   (mane-haus)
└── admin.originhair.com           (crown-commerce-admin)
```

## Deployment Sequence

The tool enforces a safe deployment order:

```
1. Infrastructure (Azure SQL databases, RabbitMQ)
   ↓
2. Database Migrations (cc migrate apply <service> --env production)
   ↓
3. Backend Services (in dependency order)
   a. identity-api (no deps)
   b. content-api (no deps)
   c. catalog-api, inquiry-api, order-api, payment-api,
      notification-api, chat-api, newsletter-api, crm-api,
      scheduling-api (depend on RabbitMQ)
   ↓
4. API Gateway (depends on all backends)
   ↓
5. Frontend Applications (depend on API gateway)
   ↓
6. Health Verification (hit all endpoints)
   ↓
7. DNS / SSL (if first deployment)
```

## Service Deployment Pipeline

For each backend service, `cc deploy service <name>` executes:

```
Step 1: Build Docker image
  docker build -t crowncommerceprod.azurecr.io/<service>:$(git rev-parse --short HEAD) \
    -f src/Services/<Service>/<Service>.Api/Dockerfile .

Step 2: Push to Azure Container Registry
  docker push crowncommerceprod.azurecr.io/<service>:$(git rev-parse --short HEAD)

Step 3: Run pending database migrations
  cc migrate apply <service> --env production --confirm

Step 4: Update Container App revision
  az containerapp update \
    --name crowncommerce-<service> \
    --resource-group crowncommerce-prod \
    --image crowncommerceprod.azurecr.io/<service>:$(git rev-parse --short HEAD)

Step 5: Wait for revision to become active (up to 120s)

Step 6: Health check
  curl https://crowncommerce-<service>.azurecontainerapps.io/health

Step 7: If health check fails → automatic rollback to previous revision
```

## Frontend Deployment Pipeline

For each Angular app:

```
Step 1: Build for production
  cd src/CrownCommerce.Web
  npx ng build <app-name> --configuration production

Step 2: Deploy to Azure Static Web Apps
  az staticwebapp deploy \
    --name crowncommerce-<app-name> \
    --source dist/<app-name>/browser \
    --deployment-token $DEPLOYMENT_TOKEN

Step 3: Purge CDN cache (if configured)

Step 4: Verify deployment
  curl https://<domain>/
```

## Rollback Strategy

```bash
# Rollback a single service to its previous revision
cc deploy rollback catalog --env production

# This executes:
# 1. az containerapp revision list → find previous revision
# 2. az containerapp ingress traffic set → route 100% to previous
# 3. Health check on previous revision
# 4. Deactivate failed revision
```

## Cost Estimation

| Resource | Tier | Monthly Cost |
|----------|------|-------------|
| Azure SQL (11 DBs) | 1 Free + 10 Basic ($5 each) | $50 |
| Container Apps (13) | Consumption (pay-per-use) | ~$30-80 |
| Container Registry | Basic | $5 |
| Static Web Apps (3) | Free tier | $0 |
| RabbitMQ (Container) | Included in Container Apps | $0 |
| **Total** | | **~$85-135/mo** |
