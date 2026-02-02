This document describes the process of deploying a full-stack application to AWS EKS (Elastic Kubernetes Service) using an AWS EC2 instance.  
1. Architecture  
EC2 instance - as an administrative server where dockers, kubernetes, aws cli installation is done.uilt and push docker images to Docker hub.    
  
2. Application components - Frontend(React), Backend(node.js/express.js), Database(MongoDB Atlas)  
  
3. Docker setup   
-- Installed Docker on EC2 instance.
--Built Docker images:Frontend image, Backend image
--Ran containers using docker-compose
--Verified application using EC2 public IP  
  
4. Kubernetes setup  
--Tools Installed on EC2:AWS CLI, kubectl, eksctl
--Cluster Setup: Created EKS cluster using eksctl with managed node group  
   eksctl create cluster \
  --name resume-builder-cluster \
  --region us-east-1 \
  --nodegroup-name resumenodes \
  --node-type t3.small \
  --nodes 2 \
  --nodes-min 1 \
  --nodes-max 3 \
  --managed  
--EC2 instance used only to run kubectl commands
  
5. Files in kubernetes  
--frontend/  
  frontend-deplyment.yml  
  frontend-service.yml  
--backend/  
  backend-deployment.yml  
  backend-service.yml  
  
6. API calls between frontend and backend  
--After gaining External IP of the backend service, it is assigned to backend url of frontend .env variable to establish connection  
--Rebuild the image and push into docker hub  
  From the frontend dir:  docker build -t modinipadmasree/resume-builder-frontend:latest .  
   docker push modinipadmasree/resume-builder-frontend:latest
--Rollout and restart deployment of frontend to call backend  
  kubectl rollout restart deployment frontend-deployment  
  
7. Testing  
   In browser paste the external IP of frontend service and verfiy the connection between forntend and backend.
