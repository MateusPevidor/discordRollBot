FROM arm32v7/node:18.12.0-alpine

WORKDIR /usr/src/discord-bot

COPY . /usr/src/discord-bot
RUN npm i --production

CMD [ "node", "src/index.js" ]