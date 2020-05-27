const axios = require('axios').default;

const api = axios.create({
  baseURL: 'http://api.weatherstack.com/current',
  params: {
    access_key: process.env.WEATHER_APIKEY
  }
})

module.exports = api;