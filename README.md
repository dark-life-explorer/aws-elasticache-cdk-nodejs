# AWS ElastiCache + AWS VPC + AWS CDK + NodeJS Setup 

The repository contains simple example of how ElastiCache with Redis Cluster can be setup within AWS VPC. And also shows how to connect the Redis cluster from a Lambda. 

___
## Technology Stack
- AWS CDK (Nodejs)
- AWS VPC
- AWS ElastiCache
- AWS Parameter Store
- AWS Lambda

___
## Repository Content
The repository contains three stacks:
1. The first contains AWS VPC resource.
2. The second is responsible for AWS ElastiCache and uses vpc created within first stack.
3. The last one shows how we can connect to the ElastiCache from a Lambda and perform some simple operations.

___

### How To Build and Deploy
1. Nodejs should be installed(Directly on using NVM).
2. [Install AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html) and configure programmatic access. Because it's used to build the infrastructure. 
3. Install dependencies: ```yarn install```
4. Provide your **Account Id** and **Region**  in the **infra/App.ts** file in order to deploy to your aws account and desired region!
5. Build infrastructure: ```yarn build```
6. And finally deploy: ```yarn deploy```