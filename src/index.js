require("dotenv/config");

const Discord = require("discord.js");
const { api } = require("./weatherApi");
const { temperatureToColor } = require("./utils/utils");

const CMCApi = require("./coinMarketCapApi");

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

  if (message.content.startsWith("$coin")) {
    const { content } = message;
    const coinName = content.split(" ")[1];

    try {
      const coinInfo = await CMCApi.query(coinName);

      const embed = new Discord.RichEmbed()
        .setTitle(`💰 $${coinInfo.price}`)
        .setColor(0xececec)
        .setAuthor(`${coinInfo.symbol} - ${coinInfo.name}`, `https://s2.coinmarketcap.com/static/img/coins/64x64/${coinInfo.id}.png`)
        .setThumbnail(
          `https://s2.coinmarketcap.com/static/img/coins/64x64/${coinInfo.id}.png`
        )
        .addField("Max supply", `${coinInfo.maxSupply}`, true)
        .addField("Circulating supply", `${coinInfo.circulatingSupply}`, true)
        .addField("Total supply", `${coinInfo.totalSupply}`, true)
        .addField("1h", `${coinInfo.change[0]}`, true)
        .addField("24h", `${coinInfo.change[1]}`, true)
        .addField("7d", `${coinInfo.change[2]}`, true)
        .addField("30d", `${coinInfo.change[3]}`, true)
        .addField("60d", `${coinInfo.change[4]}`, true)
        .addField("90d", `${coinInfo.change[5]}`, true)
        .addField("Market cap", `${coinInfo.marketCap}`, true)
        .addField("Market dominance", `${coinInfo.marketCapDominance}`, true)
        .addField("Diluted market cap", `${coinInfo.marketCapDiluted}`, true)
        .addBlankField()
        .addField("Added at", `${coinInfo.addedDate}`, true)
        .addField("Updated at", `${coinInfo.updatedDate}`, true)
        .setTimestamp()
        .setFooter(
          "coinmarketcap.com",
          "https://c.tenor.com/OT750eWlhoQAAAAC/cmc-coinmarketcap.gif"
        );
      return message.channel.send({ embed });
    } catch (err) {
      console.log(err);
      let text = `Ocorreu algum erro 😯`;
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
