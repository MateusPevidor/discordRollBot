const axios = require('axios').default;
const { formatNumber } = require('./utils/utils');

class CMCApi {
  constructor() {
    this.map = {};

    this.api = axios.create({
      baseURL: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency',
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
      }
    });
  }

  async query(symbol) {
    symbol = symbol.toUpperCase();
    if (!this.map[symbol]) {
      // map update
      const response = await this.api.get('/map', { params: { symbol } });
      if (response.data.status.error_code != 0) {
        throw new Error(response.data.status.error_message);
      }
      const coinData = response.data.data[0];
      this.map[symbol] = coinData.id;
    }

    const response = await this.api.get('/quotes/latest', { params: { id: this.map[symbol] } });
    if (response.data.status.error_code != 0) {
      throw new Error(response.data.status.error_message);
    }
    const coinData = response.data.data[this.map[symbol]];

    return {
      id: coinData.id,
      name: coinData.name,
      symbol: coinData.symbol,
      maxSupply: coinData.max_supply ? formatNumber(coinData.max_supply) : 'Infinity',
      circulatingSupply: formatNumber(coinData.circulating_supply),
      totalSupply: formatNumber(coinData.total_supply),
      addedDate: coinData.date_added.substr(0, coinData.date_added.length - 5),
      updatedDate: coinData.last_updated.substr(0, coinData.last_updated.length - 5),
      change: [
        formatNumber(coinData.quote.USD.percent_change_1h, 3) + '%',
        formatNumber(coinData.quote.USD.percent_change_24h, 3) + '%',
        formatNumber(coinData.quote.USD.percent_change_7d, 3) + '%',
        formatNumber(coinData.quote.USD.percent_change_30d, 3) + '%',
        formatNumber(coinData.quote.USD.percent_change_60d, 3) + '%',
        formatNumber(coinData.quote.USD.percent_change_90d, 3) + '%'
      ],
      price: coinData.quote.USD.price,
      marketCap: formatNumber(coinData.quote.USD.market_cap, 4),
      marketCapDominance: coinData.quote.USD.market_cap_dominance + '%',
      marketCapDiluted: formatNumber(coinData.quote.USD.fully_diluted_market_cap, 2),
    }
  }
}

module.exports = new CMCApi();