FROM node:18-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

WORKDIR /usr/src/app/frontend
RUN npm install
RUN npm run build

WORKDIR /usr/src/app

EXPOSE 8000

RUN node seed.js

CMD ["npm", "run", "start"]
