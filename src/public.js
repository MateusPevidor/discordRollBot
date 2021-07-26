require("dotenv/config");

const express = require('express');
const { api } = require("./weatherApi");

const app = express();

const PORT = process.env.PORT || 3333;

app.get('/api', async (req, res) => {
  const city = req.query.city;
  let response;

  try {
    response = (await api.get("", {
      params: {
        q: city,
      },
    })).data;
  } catch (err) {
    console.log(err);
  }

  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});