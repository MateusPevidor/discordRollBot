require("dotenv/config");

const Discord = require("discord.js");
const { weatherstack, weather_com } = require('./weatherApi');

const client = new Discord.Client();

client.login(process.env.BOT_TOKEN);

client.on("message", async message => {
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
    let city = content.substr(content.indexOf(" ") + 1, content.length - content.indexOf(" "));
    let lat, lon;

    let response = await weatherstack.get('', {
      params: {
        query: city,
      }
    });

    city = response.data.location.name;
    lat = response.data.location.lat;
    lon = response.data.location.lon;

    response = await weather_com.get('', {
      params: {
        geocode: `${lat},${lon}`,
      }
    });

    const temperature = response.data.temperature;
    message.channel.send(`<@${message.author.id}>, temperatura em **${city}**: ${temperature}°`);
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