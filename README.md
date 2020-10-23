# Appeal Planning Decision API

## Pre-requisites

node.js v14.14.0 (recommend installing with [NVM](https://github.com/nvm-sh/nvm/blob/master/README.md))

## Setup

```
cd api-microservice

npm install
```

## Available Commands

`npm run start:dev` - Runs the TypeScript development server.

`npm run compile` - Compiles the TypeScript files into JavaScript and stores the files in /dist.

`npm start` - Runs the compiled JavaScript in /dist

## Build Docker Container

```
docker build -t foundry4/appeal-planning-decision-api .

docker run -i -d -p 4000:4000 foundry4/appeal-planning-decision-api
```

# Appeal Planning Decision UX

## Setup

```
cd ux-microservice

npm install
```

## Available Commands

`npm run sass` - Compiles the GOV.UK styles into a CSS file

`npm start` - Runs the app which can then be browsed at http://localhost:3000
