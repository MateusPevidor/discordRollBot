FROM node:latest

WORKDIR /usr/src/discord-bot

COPY . /usr/src/discord-bot
RUN npm i

CMD [ "node", "src/index.js" ]