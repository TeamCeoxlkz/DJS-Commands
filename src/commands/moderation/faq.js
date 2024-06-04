const { Client, Interaction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  run: async ({ interaction, client }) => {
    const infoOption = interaction.options.getBoolean("info");
    const contactOption = interaction.options.getBoolean("contact");

    if (infoOption && contactOption) {
      await interaction.reply("Please select only one option: `info` or `contact`.");
      return;
    }

    if (infoOption) {
      // Info option selected
      const infoEmbed = new EmbedBuilder()
        .setColor(2829617)
        .setTitle("FAQ - Information")
        .setDescription("Here is some information about the bot:")
        .addFields(
          { name: "Commands", value: "/ban - Banning member .\n/help - Request help from the community.\n/schedule - Create a schedule event.\n/suggest - Create a suggestion." },
          { name: "Permissions", value: "• The bot requires the Embed Links, Add Reactions, and Send Messages permissions.\n• Please make sure to grant these permissions to the bot." },
          { name: "ChannelPermissions", value: "• Commands that are set in some channel's should have specifique permission \nlike : \n• Send Messages, Mention Everyone, Mention Roles, ...etc. \n • Make sure that in channel  permission @everyone and @bot have same permission as i mentioned before." },
        )
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ size: 256 }), url: 'https://discord.gg/VnPxaR2Q' })
        .setFooter({ text: 'Made by ka._rim | 20,595 guilds | last updated 25/07/2023' });

      await interaction.reply({ embeds: [infoEmbed] });
      return;
    }

    if (contactOption) {
      // Contact option selected
      const contactEmbed = new EmbedBuilder()
        .setColor(2829617)
        .setTitle("FAQ - Contact")
        .setDescription("For support or more information, you can contact us through the following channels:")
        .addFields(
          { name: "Website", value: "https://example.com" },
          { name: "Server", value: "https://discord.gg/VnPxaR2Q" },
          { name: "Email", value: "lucidsavvyco@gmail.com" }
        )
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ size: 256 }), url: 'https://discord.gg/VnPxaR2Q' })
        .setFooter({ text: 'Made by ka._rim | 20,595 guilds | last updated 25/07/2023' });

      await interaction.reply({ embeds: [contactEmbed] });
      return;
    }

    // No valid option selected
    await interaction.reply("Please select a valid option: `info` or `contact`.");
  },

  data: new SlashCommandBuilder()
    .setName("faq")
    .setDescription("Get FAQ information")
    .addBooleanOption((option) =>
      option
        .setName("info")
        .setDescription("Get information about the bot")
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("contact")
        .setDescription("Contact for support or more information")
        .setRequired(false)
    ),
};
