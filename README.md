# URL Shortener with Nest

# Description

> Simple and yet powerful URL Shortener written with Nest.js and Typescript

### Build with ###

![alt image](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) ![alt image](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![alt image](https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white) ![alt image](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white) ![alt image](https://img.shields.io/badge/Sonar%20cloud-F3702A?style=for-the-badge&logo=sonarcloud&logoColor=white) ![alt image](https://img.shields.io/badge/Snyk-4C4A73?style=for-the-badge&logo=snyk&logoColor=white) ![alt image](https://img.shields.io/badge/json%20web%20tokens-323330?style=for-the-badge&logo=json-web-tokens&logoColor=pink)

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