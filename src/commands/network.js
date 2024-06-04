const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('network')
    .setDescription('Encourages members to network and connect for collaborations.')
    .addStringOption((option) =>
      option
        .setName('message')
        .setDescription('Your networking message')
        .setRequired(true)
    ),
  
  run: async ({ interaction }) => {
    const networkingMessage = interaction.options.getString('message');

    const embed = new EmbedBuilder()
      .setTitle('🤝 Network and Connect')
      .setDescription(networkingMessage)
      .setColor(2829617) // Set the embed color (you can change this)
      .addFields({name:'\u200B', value:'Feel free to reach out and start networking with fellow members! 🤝'});

    await interaction.reply({ embeds: [embed] });

    // Fetch reply message 
      const message = await interaction.fetchReply();

    // React to reply message
       await message.react('🤝');
    
     
  },
};
