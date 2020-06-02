require("dotenv/config");

const Discord = require("discord.js");
const { weather_com } = require('./weatherApi');

const client = new Discord.Client();

client.login(process.env.BOT_TOKEN);

client.on("message", async message => {
  if (message.content.startsWith("$roll")) {
    let messageContent = message.content.split(" ");
    let roll;
    if (!isNaN(messageContent[1]))
      roll = Math.floor(Math.random() * parseInt(messageContent[1])) + 1;
    else roll = Math.floor(Math.random() * 100) + 1;
    message.channel.send(`${message.author.username} rolled ${roll}`);
  }

  if (message.content.startsWith("$porquebuduga?")) {
    message.channel.send(`pq me kiko buduga :(`);
  }

  if (message.content.startsWith('$temp')) {
    const content = message.content;
    let city = content.substr(content.indexOf(" ") + 1, content.length - content.indexOf(" "));
    let lat, lon, isNeighborhood = false, showAll = false;

    if (city.includes('-show')) {
      city = city.replace('-show', '');
      showAll = true;
    }

    if (city.includes('-b')) {
      city = city.replace('-b', '');
      isNeighborhood = true;
    }

    if (city.includes('-help')) {
      const embed = new Discord.RichEmbed()
        .setTitle(`[${message.author.username}] Temperature Options`)
        .setColor(0xfefefe)
        .setDescription(`
          Usage: \`\`$temp <name> [...flags]\`\`
          \`\`\`Flags:
  -b: Sets location type to neighborhood instead of default (city)
  -show: Shows all possible locations
  -help: Shows this message\`\`\`
        `);
      return message.channel.send({ embed });
    }
    
    try {
      const response = await weather_com.weather_com_location.get('', {
        params: {
          query: city.trim(),
          locationType: isNeighborhood ? 'neighborhood' : 'city',
        }
      });

      if (showAll) {
        let locations = '';
        response.data.location.address.forEach((address, i) => {
          locations += `${i + 1}. ${address}\n`;
        });

        const embed = new Discord.RichEmbed()
          .setTitle(`[${city.trim()}] Locations`)
          .setColor(0xfefefe)
          .setDescription(locations);
        return message.channel.send({ embed });
      }

      city = response.data.location.address[0];
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
    '$temp',
    '$roll',
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