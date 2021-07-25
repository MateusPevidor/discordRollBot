require("dotenv/config");

const Discord = require("discord.js");
const { api } = require("./weatherApi");
const { temperatureToColor } = require("./utils/utils");

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

  if (message.content.startsWith("$temp")) {
    const content = message.content;
    let city = content.substr(
      content.indexOf(" ") + 1,
      content.length - content.indexOf(" ")
    );
    let minified = false;

    if (city.includes("-min")) {
      city = city.replace("-min", "");
      minified = true;
    }

    if (city.includes("-help")) {
      const embed = new Discord.RichEmbed()
        .setTitle(`[${message.author.username}] Temperature Options`)
        .setColor(0xfefefe).setDescription(`
          Usage: \`\`$temp <name> [...flags]\`\`
          \`\`\`Flags:
  -min: Shows a simpler response
  -help: Shows this message\`\`\`
        `);
      return message.channel.send({ embed });
    }

    try {
      const response = await api.get("", {
        params: {
          q: city.trim(),
        },
      });

      const cityName = response.data.name;
      const { temp, feels_like: tempFeelsLike, humidity } = response.data.main;
      const icon = response.data.weather[0].icon;

      if (minified) {
        return message.channel.send(
          `<@${message.author.id}>, temperatura em **${cityName}**: ${temp}°`
        );
      } else {
        const embed = new Discord.RichEmbed()
          .setTitle(`🧭 ${cityName}`)
          .setColor(temperatureToColor(temp))
          .setAuthor(`${message.author.username}`, message.author.avatarURL)
          .setThumbnail(
            `http://openweathermap.org/img/wn/${icon}@2x.png`
          )
          .addField("Temperatura", `🌡️ ${temp}ºC`, true)
          .addField("Sensação Térmica", `🌡️ ${tempFeelsLike}ºC`, true)
          .addField("Umidade", `💧 ${humidity}%`)
          .addBlankField()
          .setTimestamp()
          .setFooter(
            "openweathermap.org",
            "https://openweathermap.org/themes/openweathermap/assets/img/logo_white_cropped.png"
          );
        return message.channel.send({ embed });
      }

    } catch (err) {
      console.log(err);
      let text = `Ocorreu algum erro 😯`;
      if (err.response.status == 404) text = "Cidade não encontrada";
      return message.channel.send(text);
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

// ---------------- // this code omg kms

const express = require('express');

const app = express();

const PORT = process.env.PORT || 3333;

app.get('/api', async (req, res) => {
  const city = req.query.city;

  const response = await api.get("", {
    params: {
      q: city,
    },
  });

  res.json(response.data);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
