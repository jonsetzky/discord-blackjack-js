FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npx tsc
COPY . .
CMD [ "node", "./out/index.js" ]