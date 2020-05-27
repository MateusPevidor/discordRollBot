require("dotenv/config");
const Discord = require("discord.js");
const weatherApi = require('./weatherApi');

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

  if (message.content.startsWith('!>temp')) {
    const content = message.content;
    const city = content.substr(content.indexOf(" ") + 1, content.length - content.indexOf(" "));
    weatherApi.get('', {
      params: {
        query: city,
      }
    }).then(response => {
      const temperature = response.data.current.temperature;
      const city = response.data.location.name;
      message.channel.send(`<@${message.author.id}>, temperatura em **${city}**: ${temperature}°`);
    }).catch(err => {
      console.log(err);
      message.channel.send(`Ocorreu algum erro 😯`);
    });
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