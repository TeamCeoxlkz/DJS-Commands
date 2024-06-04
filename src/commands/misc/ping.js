const { Client, Interaction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: 'ping',
    description: 'Pong!',
  },

  run: async ({ interaction, client }) => {
    const start = Date.now();
    const message = await interaction.reply(':ping_pong: Pinging...');
    const end = Date.now();
    const apiPing = Math.round(client.ws.ping);
    const gatewayPing = end - start;
    
    const pingEmbed = new EmbedBuilder()
      .setColor(2829617)
      .setTitle("Ping Information")
      .setDescription(":ping_pong: Pong!")
      .addFields(
        { name: "Discord Bot", value: `${apiPing}ms` },
        { name: "Discord Websocket", value: `${gatewayPing}ms` }
      );
      
    await message.edit({ embeds: [pingEmbed] });
  },

  options: {
    devOnly: false,
    guildOnly: true,
    userPermissions: ['Administrator', 'AddReactions'],
    botPermissions: ['AddReactions'],
    deleted: false,
  },
};
