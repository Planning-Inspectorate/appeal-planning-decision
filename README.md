# Appeal Planning Decision API

## Commands

npm run start:dev - Runs the TypeScript development server.

npm run compile - Compiles the TypeScript files into JavaScript and stores the files in /dist.

npm start - Runs the compiled JavaScript in /dist

## Build Docker Container

docker build -t foundry4/appeal-planning-decision-api .

docker run -i -p 4000:4000 foundry4/appeal-planning-decision-api
