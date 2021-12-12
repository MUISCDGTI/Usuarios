FROM node:9-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY index.js .
COPY db.js .
COPY users.js .

EXPOSE 3000

CMD npm start