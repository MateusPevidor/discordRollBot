const Discord = require("discord.js");
require("dotenv/config");

const client = new Discord.Client();

client.login(process.env.BOT_TOKEN);

client.on("message", message => {
  if (message.content.startsWith("!>roll")) {
    let messageContent = message.content.split(" ");
    let roll;
    if (!isNaN(messageContent[1]))
      roll = Math.floor(Math.random() * parseInt(messageContent[1])) + 1;
    else roll = Math.floor(Math.random() * 10) + 1;
    message.channel.send(`${message.author.username} rolled ${roll}`);
  }

  if (message.content.startsWith("!>porquebuduga?")) {
    message.channel.send(`pq me kiko buduga :(`);
  }
});

client.on('ready', () => {
  client.user.setPresence({
    game: {
      name: '!>roll',
      type: "PLAYING",
    }
  });
});