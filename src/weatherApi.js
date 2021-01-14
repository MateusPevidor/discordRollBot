const axios = require('axios').default;

const api = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5/weather',
  params: {
    appid: process.env.OPENWEATHERMAP_APIKEY,
    units: 'metric',
  }
});

module.exports = {
  api
};