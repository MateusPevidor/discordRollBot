const converter = require("hsl-to-rgb-for-reals");

const parseWxPhrase = (phrase) => {
  return phrase.toLowerCase().replace(/ /, "_");
};

const temperatureToColor = (temperature) => {
  function rgbToHex(r, g, b) {
    return (r << 16) + (g << 8) + b;
  }
  temperature += 10;

  const [r, g, b] = converter(Math.abs(temperature - 60) * 4, 1, 0.5);
  const value = rgbToHex(r, g, b);

  return value;
};

module.exports = {
  parseWxPhrase,
  temperatureToColor,
};
