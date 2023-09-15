# URL Shortener with Nest

Welcome to the OpenSource URL Shortener project, designed exclusively for learning purposes and as a tutorial resource. Built with Nest.js, TypeScript, and Node.js, this project serves as an invaluable educational tool for aspiring developers and enthusiasts.

### Key Features: ###

- Nest.js Foundation: Delve into the powerful Nest.js framework and learn how to create modular and scalable applications. Explore its architectural intricacies and grasp the principles of maintainable code and DDD design.

- TypeScript Proficiency: Gain hands-on experience with TypeScript, a language that combines innovation with safety. Discover how type checking at compile time can enhance code reliability.

- Node.js Performance: Dive into Node.js and harness its capabilities for high-performance web applications.

- Open-Source Collaboration: Immerse yourself in the world of open-source development. Contribute, collaborate, and discover the power of community-driven projects.

# Description

> Simple and yet powerful URL Shortener written with Nest.js and Typescript

### Build with ###

![alt image](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) ![alt image](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![alt image](https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white) ![alt image](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white) ![alt image](https://img.shields.io/badge/Sonar%20cloud-F3702A?style=for-the-badge&logo=sonarcloud&logoColor=white) ![alt image](https://img.shields.io/badge/Snyk-4C4A73?style=for-the-badge&logo=snyk&logoColor=white) ![alt image](https://img.shields.io/badge/json%20web%20tokens-323330?style=for-the-badge&logo=json-web-tokens&logoColor=pink) ![alt image](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white) ![alt image](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220) ![alt image](https://img.shields.io/badge/Amazon%20DynamoDB-4053D6?style=for-the-badge&logo=Amazon%20DynamoDB&logoColor=white) 

# Project Description

- Language: Typescript
- Framework: Nest.js
- Database: MongoDB
- Cache: In-Memory (Currently, Redis v4 has problem with Nest.js cache manager)
- Security:
  - Authentication: JSON Web Token
  - Authorization: RABC
- Bootstrap: Docker
- CI/CD: GitHub actions
- Docs URL: `/api/docs` for swagger.
- Comment style: All the code in project are self-documenting
- Deploy to AWS Lambda: GitOps - Every push or pull request to release/lambda will deploy the docker image to lambda. (Currently I don’t have enough time to write actions for this tasks)
- Code Quality Analysis: SonarCloud
  - SonarCloud Project URL: [https://sonarcloud.io/summary/new_code?id=url-shortener-with-nest-sonar&branch=main](https://sonarcloud.io/summary/new_code?id=url-shortener-with-nest-sonar&branch=main)
- Package Analysis: Synk