# Docker AWS Learning
command use for frontend initial
1. npm create vite@7 with react framework and javascript variant
2. tailwind install using npm i tailwindcss @tailwindcss/vite configure it in vite.config file.
3. In frontend we must - npm i y-monaco y-socket.io yjs

// concept 
CRDTs - Conflict free Replicated Data Types
Basically, It allow to enable multiple user to edit concurrently without conflits.
Eg. Figma, Google Doc where use this. 
To create a view of it , install - npm i @monaco-eitor/react
To Sync the data of multiple user - use Y.js

command use for backend initial
1. npm init -y - it'll create package.json file
2. to create server - npm i express socket.io
3. and y-socker.io - it will use Y.js to resolve the user conflict.

----------------------------------------------
We need 4 thing to create a server
Code          ------\
Dependancies  -------->
                         -----> Server
Nodejs        -------->
OS            ------/

so similary we will create in AWS using EC2
 // AWS //
Code
Dependancies
              } ------------> Server
Nodejs
Linux(OS)

* We will use Docker to create Image [Code, Dependancies, Nodejs, OS]
* AWS provide a service called ECS to run your docker image. 

Congo!! you will get server in the cloud system.

-----------------------------------------
Understanding build concepts (run frontend and backend on same url "/")
Frontend => npm run build => create the dist folder [html,css,js]

Copy dist folder content in Backend/public folder

use.app.use(express.static("public"));

-----------------------------------------
DOCKER concepts

1. Create common file (Frontend/backend) - named as dockerfile
2. To run and create image of it, use command => docker build -t backend(folder Name) .
3. To test your created image use => docker run -p 4000:3000 backend

-----------------------------------------
Learn Multi-stage build (Production used)
Stage 1. Build the Frondend [dist folder]
Stage 2. Copy the dist folder content in Backend/public folder

//////////////////

AWS contains ECR and ECS services, we are going to run our image on AWS.
Amazon Elastic Container Registry is basically Docker Hub, but inside AWS.

What it does
Stores your Docker images
Private and secure
Integrated with other AWS services

Amazon Elastic Container Service is what runs your containers.
What ECS handles
Starting containers
Scaling (more users → more containers)
Load balancing
Restarting if something crashes

----------------------------------------------

ECS => task defination
       (Image + infra)
           |
           v
         service ----> 3000 port

1. Security Group (SG)
2. Application load Balancer
3. VPC (Virtual private cloud)  --> Public subnet   
