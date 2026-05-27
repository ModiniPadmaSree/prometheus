# Monitoring Kubernetes-Deployed Resume Builder App using Prometheus & Grafana

A complete observability setup for a **MERN-based Resume Builder application** deployed on Kubernetes — featuring real-time metrics collection with **Prometheus**, visualization dashboards with **Grafana**, and email alerting via SMTP.

---

##  Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                  EC2 Instance (Kubernetes Cluster)       │
│                                                         │
│  ┌──────────────────┐    ┌──────────────────────────┐  │
│  │  default namespace│    │  monitoring namespace     │  │
│  │                  │    │                          │  │
│  │  ┌────────────┐  │    │  ┌──────────────────┐   │  │
│  │  │  Frontend  │  │    │  │   Prometheus      │   │  │
│  │  │ (port 3000)│  │    │  │   (port 9090)     │   │  │
│  │  └────────────┘  │    │  └──────────────────┘   │  │
│  │  ┌────────────┐  │    │  ┌──────────────────┐   │  │
│  │  │  Backend   │◄─┼────┼─►│     Grafana       │   │  │
│  │  │ (port 5000)│  │    │  │   (port 3000)     │   │  │
│  │  └────────────┘  │    │  └──────────────────┘   │  │
│  └──────────────────┘    │  ┌──────────────────┐   │  │
│                          │  │   Node Exporter   │   │  │
│                          │  └──────────────────┘   │  │
│                          │  ┌──────────────────┐   │  │
│                          │  │ Kube-State-Metrics│   │  │
│                          │  └──────────────────┘   │  │
│                          └──────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

##  Repository Structure

```
prometheus/
├── docker/                     # Docker configuration files
│   └── ...                     # Dockerfiles for frontend & backend
└── kubernetes/                 # Kubernetes manifest files
    ├── app/                    # Resume Builder app deployments
    │   ├── frontend-deployment.yaml
    │   └── backend-deployment.yaml
    └── monitoring/             # Monitoring stack manifests
        ├── namespace.yaml
        ├── node-exporter/
        ├── kube-state-metrics/
        ├── prometheus/
        │   ├── configmap.yaml
        │   ├── deployment.yaml
        │   └── service.yaml
        └── grafana/
            └── grafana.yaml
```

---

##  Application Stack

| Component | Technology | Port |
|-----------|-----------|------|
| Frontend | React.js | 3000 |
| Backend | Node.js / Express | 5000 |
| Database | MongoDB | 27017 |
| Container Runtime | Docker | — |
| Orchestration | Kubernetes (on EC2) | — |

Services are exposed via **LoadBalancer** to allow external access.

---

##  Prerequisites

- AWS EC2 instance with Kubernetes cluster configured
- `kubectl` configured and connected to your cluster
- Docker Hub account (pre-built images required)
- SMTP credentials (Gmail app password recommended) for alert notifications

---

##  Deployment Guide

### 1. Deploy the Resume Builder Application

```bash
# Deploy backend and frontend to default namespace
kubectl apply -f kubernetes/app/backend-deployment.yaml
kubectl apply -f kubernetes/app/frontend-deployment.yaml

# Verify pods are running
kubectl get pods
kubectl get services
```

### 2. Create the Monitoring Namespace

```bash
kubectl apply -f kubernetes/monitoring/namespace.yaml

# Verify namespace created
kubectl get namespaces
```

### 3. Deploy Node Exporter

Enables node-level metrics (CPU, memory, disk) collection.

```bash
kubectl apply -f kubernetes/monitoring/node-exporter/
kubectl get pods -n monitoring
```

### 4. Deploy Kube-State-Metrics

Exposes Kubernetes object-level metrics such as pod status and deployment replica counts.

```bash
kubectl apply -f kubernetes/monitoring/kube-state-metrics/
```

### 5. Deploy Prometheus

```bash
kubectl apply -f kubernetes/monitoring/prometheus/

# Verify Prometheus is running
kubectl get pods -n monitoring
kubectl get svc -n monitoring
```

Access the Prometheus UI by port-forwarding:
```bash
kubectl port-forward svc/prometheus-service 9090:9090 -n monitoring
```
Then visit: `http://localhost:9090`

Check **Status → Targets** to confirm metrics are being scraped from all configured jobs.

### 6. Configure SMTP Secrets for Grafana Alerting

Create a Kubernetes secret with your SMTP credentials before deploying Grafana:

```bash
kubectl create secret generic grafana-smtp-secret \
  --from-literal=GF_SMTP_USER=your-email@gmail.com \
  --from-literal=GF_SMTP_PASSWORD=your-app-password \
  -n monitoring
```

### 7. Deploy Grafana

```bash
kubectl apply -f kubernetes/monitoring/grafana/grafana.yaml

# Port-forward to access the UI
kubectl port-forward svc/grafana-service 3000:3000 -n monitoring
```
Then visit: `http://localhost:3000` (default credentials: `admin` / `admin`)

---

## Grafana Dashboard Setup

### Add Prometheus as a Data Source

1. Go to **Configuration → Data Sources → Add data source**
2. Select **Prometheus**
3. Set the URL to the Prometheus ClusterIP service endpoint:
   ```
   http://prometheus-service.monitoring.svc.cluster.local:9090
   ```
4. Click **Save & Test**

### Import / Create Dashboard

The dashboard monitors:

- **POST API traffic** — resume creation requests per minute (status 200 and 400)
- **GET API traffic** — resume fetch requests per minute with response code breakdown
- **Resume creation count** — successful resume saves per minute
- **Resume creation failure count** — failed attempts per minute

---

## PromQL Queries Reference

### API Traffic Monitoring

**POST requests to `/api/resumes` per minute:**
```promql
rate(http_request_duration_seconds_count{route="/api/resumes", method="POST"}[1m]) * 60
```

**GET requests to `/api/resumes` per minute:**
```promql
rate(http_request_duration_seconds_count{route="/api/resumes", method="GET"}[1m]) * 60
```

### Resume Business Metrics

**Resumes created per minute:**
```promql
rate(resumes_created_total[1m]) * 60
```

**Resume creation failures per minute:**
```promql
rate(resume_creation_failed_total[1m]) * 60
```

### Alert Query (POST traffic health check):
```promql
sum(
  increase(http_request_duration_seconds_count{
    method="POST",
    route="/api/resumes"
  }[1m])
) or vector(0)
```

---

## Alert Configuration

### Alert Rule: `ResumeAlert`

| Property | Value |
|----------|-------|
| Metric | POST requests to `/api/resumes` |
| Condition | Traffic drops **below 1** per minute |
| Evaluation | **Last / Strict** (most recent data point) |
| Purpose | Detect backend crash or routing failure |

### Email Notification via SMTP

SMTP is configured in `grafana.yaml` using environment variables sourced from Kubernetes Secrets:

| Environment Variable | Description |
|---------------------|-------------|
| `GF_SMTP_ENABLED` | Enables SMTP (`true`) |
| `GF_SMTP_HOST` | SMTP server and port (e.g., `smtp.gmail.com:587`) |
| `GF_SMTP_USER` | Sender email address (from Kubernetes Secret) |
| `GF_SMTP_PASSWORD` | App password (from Kubernetes Secret) |
| `GF_SMTP_FROM_ADDRESS` | Email shown as sender |
| `GF_SMTP_STARTLS_POLICY` | Enforces encrypted SMTP connection |

---

##  Useful kubectl Commands

```bash
# Check all monitoring pods
kubectl get pods -n monitoring

# Check all app pods
kubectl get pods

# View Prometheus logs
kubectl logs -l app=prometheus -n monitoring

# View Grafana logs
kubectl logs -l app=grafana -n monitoring

# Check services and their exposed ports
kubectl get svc -n monitoring
kubectl get svc
```

---
