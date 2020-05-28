const axios = require('axios').default;

const weather_com_temperature = axios.create({
  baseURL: 'https://api.weather.com/v3/wx/observations/current',
  params: {
    apiKey: process.env.WEATHERCOM_APIKEY,
    format: 'json',
    language: 'en-US',
    units: 'm',
  }
});

const weather_com_location = axios.create({
  baseURL: 'https://api.weather.com/v3/location/search',
  params: {
    apiKey: process.env.WEATHERCOM_APIKEY,
    format: 'json',
    language: 'en-US',
    locationType: 'city',
  }
});

module.exports = {
  weather_com: {
    weather_com_temperature,
    weather_com_location,
  }
};