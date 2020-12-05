require("dotenv/config");

const Discord = require("discord.js");
const { weather_com } = require("./weatherApi");
const { temperatureToColor, parseWxPhrase } = require("./utils/utils");

const client = new Discord.Client();

client.login(process.env.BOT_TOKEN);

client.on("message", async (message) => {
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

  if (message.content.startsWith("$dev")) {
    const embed = new Discord.RichEmbed()
      .setTitle(`🧭 Contagem, Minas Gerais, Brasil`)
      .setColor(temperatureToColor(36))
      .setAuthor("Floaddy", message.author.avatarURL)
      .setThumbnail("https://ssl.gstatic.com/onebox/weather/64/cloudy.png")
      .addField("Temperatura", "🌡️ 36ºC", true)
      .addField("Sensação Térmica", "🌡️ 39ºC", true)
      .addField("Umidade", "💧 78%")
      .addBlankField()
      .setTimestamp()
      .setFooter(
        "weather.com",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/The_Weather_Channel_logo_2005-present.svg/200px-The_Weather_Channel_logo_2005-present.svg.png"
      );
    return message.channel.send({ embed });
  }

  if (message.content.startsWith("$temp")) {
    const content = message.content;
    let city = content.substr(
      content.indexOf(" ") + 1,
      content.length - content.indexOf(" ")
    );
    let lat,
      lon,
      isNeighborhood = false,
      showAll = false,
      minified = false;

    if (city.includes("-show")) {
      city = city.replace("-show", "");
      showAll = true;
    }

    if (city.includes("-min")) {
      city = city.replace("-min", "");
      minified = true;
    }

    if (city.includes("-b")) {
      city = city.replace("-b", "");
      isNeighborhood = true;
    }

    if (city.includes("-help")) {
      const embed = new Discord.RichEmbed()
        .setTitle(`[${message.author.username}] Temperature Options`)
        .setColor(0xfefefe).setDescription(`
          Usage: \`\`$temp <name> [...flags]\`\`
          \`\`\`Flags:
  -b: Sets location type to neighborhood instead of default (city)
  -show: Shows all possible locations
  -help: Shows this message\`\`\`
        `);
      return message.channel.send({ embed });
    }

    try {
      const response = await weather_com.weather_com_location.get("", {
        params: {
          query: city.trim(),
          locationType: isNeighborhood ? "neighborhood" : "city",
        },
      });

      if (showAll) {
        let locations = "";
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
      const response = await weather_com.weather_com_temperature.get("", {
        params: {
          geocode: `${lat},${lon}`,
        },
      });

      const {
        temperature,
        temperatureFeelsLike,
        relativeHumidity,
      } = response.data;

      if (minified) {
        return message.channel.send(
          `<@${message.author.id}>, temperatura em **${city}**: ${temperature}°`
        );
      } else {
        const embed = new Discord.RichEmbed()
          .setTitle(`🧭 ${city}`)
          .setColor(temperatureToColor(temperature))
          .setAuthor(`${message.author.username}`, message.author.avatarURL)
          .setThumbnail(
            "https://i.pinimg.com/originals/0e/f3/bb/0ef3bb66d9216fffcea9022628f7bb26.gif"
          )
          .addField("Temperatura", `🌡️ ${temperature}ºC`, true)
          .addField("Sensação Térmica", `🌡️ ${temperatureFeelsLike}ºC`, true)
          .addField("Umidade", `💧 ${relativeHumidity}%`)
          .addBlankField()
          .setTimestamp()
          .setFooter(
            "weather.com",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/The_Weather_Channel_logo_2005-present.svg/200px-The_Weather_Channel_logo_2005-present.svg.png"
          );
        return message.channel.send({ embed });
      }
    } catch (err) {
      console.log(err);
      return message.channel.send(`Ocorreu algum erro 😯`);
    }
  }
});

client.on("ready", () => {
  const status = ["$temp", "$roll"];
  let counter = 0;

  function setPresence() {
    client.user.setPresence({
      game: {
        name: status[counter % status.length],
        type: "PLAYING",
      },
    });
    counter++;
  }

  setInterval(setPresence, 180000);
});

// ---------------------------------------------------- //

const express = require('express');
const app = express();

const port = process.env.PORT || 3333;

app.use(express.json());

let ip;
let time;

app.get("/", (req, res) => {
  return res.json({
    ip: ip || 'Unset',
    time: time || 'Unset'
  });
});

app.post("/", (req, res) => {
  const newIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  ip = newIP;
  time = new Date();
  return res.json({
    message: `The IP has been updated to ${ip}`,
  });
});

app.listen(port, () => console.log(`[INFO] App is running on port ${port}.`));