# URL Shortener with Nest

# Description

> Simple and yet powerful URL Shortener written with Nest.js and Typescript

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