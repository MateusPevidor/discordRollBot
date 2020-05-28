require("dotenv/config");

const Discord = require("discord.js");
const { weather_com } = require('./weatherApi');

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

    try {
      const response = await weather_com.weather_com_location.get('', {
        params: {
          query: city,
        }
      });

      city = response.data.location.city[0];
      lat = response.data.location.latitude[0];
      lon = response.data.location.longitude[0];
    } catch (err) {
      console.log(err);
      return message.channel.send(`Ocorreu algum erro 😯`);
    }

    try {
      const response = await weather_com.weather_com_temperature.get('', {
        params: {
          geocode: `${lat},${lon}`,
        }
      });

      const temperature = response.data.temperature;
      return message.channel.send(`<@${message.author.id}>, temperatura em **${city}**: ${temperature}°`);
    } catch (err) {
      console.log(err);
      return message.channel.send(`Ocorreu algum erro 😯`);
    }
  }
});

client.on('ready', () => {
  const status = [
    '!>temp',
    '!>roll',
  ];
  let counter = 0;

  function setPresence() {
    client.user.setPresence({
      game: {
        name: status[counter % status.length],
        type: "PLAYING",
      }
    });
    counter++;
  }

  setInterval(setPresence, 1800000);
});