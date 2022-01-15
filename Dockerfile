FROM node:12-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY index.js .
COPY db.js .
COPY users.js .
COPY refreshTokens.js .

EXPOSE 3000

CMD npm start