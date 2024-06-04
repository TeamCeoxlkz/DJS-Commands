const { Client, Interaction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  run: async ({ interaction }) => {
    const stockSymbol = interaction.options.getString("stock_symbol");

    try {
      // Fetch stock information from Binance API
      const response = await axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${stockSymbol.toUpperCase()}USDT`);

      if (response.status === 200) {
        const stockInfo = response.data;

        // Calculate percentage change
        const priceChangePercent = (parseFloat(stockInfo.priceChange) / parseFloat(stockInfo.lastPrice)) * 100;
        const priceChangePercentFormatted = priceChangePercent.toFixed(2);

        // Determine the direction of the price change
        const priceChangeDirection = priceChangePercent > 0 ? "⬈" : priceChangePercent < 0 ? "⬊" : "➞";

        // Determine the trading status of the stock
        const tradingStatus = stockInfo.isTrading ? "Trading" : "Not Trading";

        // Create an embed with the stock information
        const stockEmbed = new EmbedBuilder()
          .setColor(2829617)
          .setTitle(`Stock Information for ${stockSymbol.toUpperCase()}`)
          .addFields(
            { name: "Last Price", value: stockInfo.lastPrice },
            { name: "High Price (24h)", value: stockInfo.highPrice },
            { name: "Low Price (24h)", value: stockInfo.lowPrice },
            { name: "Volume (24h)", value: stockInfo.volume },
            { name: "Price Change (24h)", value: `${priceChangeDirection} ${stockInfo.priceChange} (${priceChangePercentFormatted}%)` },
            { name: "Daily Percentage Change", value: `${priceChangeDirection} ${priceChangePercentFormatted}%` },
            { name: "Percentage Change Since Last Update", value: `${priceChangeDirection} ${stockInfo.priceChangePercent}%` },
            { name: "Trading Status", value: tradingStatus }
          );

        await interaction.reply({ embeds: [stockEmbed] });
      } else {
        await interaction.reply("Failed to fetch stock information. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching stock information:", error);
      await interaction.reply("An error occurred while fetching stock information. Please try again later.");
    }
  },

  data: new SlashCommandBuilder()
    .setName("stock-info")
    .setDescription("Get information about a stock or market share")
    .addStringOption((option) =>
      option
        .setName("stock_symbol")
        .setDescription("The symbol of the stock or market share (e.g., BTC, ETH, XRP, ...)")
        .setRequired(true)
    ),
};
