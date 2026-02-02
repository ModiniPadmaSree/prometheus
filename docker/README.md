# Docker Compose Implementation – Step-by-Step Process

This document describes the exact steps followed to containerize and run the Resume Builder MERN application using Docker, Docker Compose, and Docker Hub.

---

## Step 1: Prepare the Application for Containerization

The project was structured with separate directories for frontend and backend.  
Docker support was added by preparing the application so that it could be built into container images.

This step ensured:
- Frontend and backend are independent services
- Environment variables are used
- Application can run in any environment

---

## Step 2: Create Docker Configuration Files

Docker configuration files were created inside the frontend  and backend directories, and a Docker Compose configuration file was created at the root of the repository.

Purpose:
- Frontend and backend containers can be managed together
- Ports, environment variables, and dependencies can be defined in one place  

---

## Step 3: Build Images Locally Using Docker Compose

Docker Compose was used to build images and start containers locally.

Command used: \
docker compose up --build -d 

---
## Step 4: Verified containers

docker ps 

---
## Step 5: Push images to docker hub 

To make images and portable, run in any environment(EC2, Kubernetes) 
- Tag existing images with Docker hub username and repository name \
  docker images \
  docker tag resume-builder-frontend:latest modinipadmasree/resume-builder-frontend:latest \
  docker tag resume-builder-backend:latest modinipadmasree/resume-builder-backend:latest 
- Push images to hub \
  docker login \
  docker push modinipadmasree/resume-builder-frontend:latest \
  docker push modinipadmasree/resume-builder-backend:latest

  ---
## Step 6: Update docker-compose
 Docker-Compose configuration was updated to pull images from hub

  ---
## Step 7: Configure Frontend–Backend Connectivity

  To connect frontend & backend : 
  - Backend URL (ip-of-instance:5000) was added to .env of frontend
  - Backend CORS origin is updated to allow requests from forntend
 
 ---
## Step 8: Rebuild and restart containers

 After updates rebuild the iamges and restart the containers 
 - docker compose down
 - docker compose up --build -d
Updated images were pushed again to docker hub

---
## Step 9: Verify Application

In browser, paste the <ip of instance:port number> to test the application deployment 
