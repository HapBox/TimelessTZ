FROM node:16.16-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.build.json ./
COPY tsconfig.json ./

RUN npm install

COPY src ./src/

RUN npm run build

EXPOSE 3000
CMD [ "npm", "run", "start" ]