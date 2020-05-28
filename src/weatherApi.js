const axios = require('axios').default;

const weatherstack = axios.create({
  baseURL: 'http://api.weatherstack.com/current',
  params: {
    access_key: process.env.WEATHERSTACK_APIKEY
  }
});

const weather_com = axios.create({
  baseURL: 'https://api.weather.com/v3/wx/observations/current',
  params: {
    apiKey: process.env.WEATHERCOM_APIKEY,
    format: 'json',
    language: 'en-US',
    units: 'm',
  }
})

module.exports = {
  weatherstack,
  weather_com,
};