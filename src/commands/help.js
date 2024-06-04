const { Client, Interaction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const GuildConfiguration = require('../models/GuildConfiguration');

module.exports = {
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  run: async ({ interaction, client }) => {
    const mention = interaction.options.getMentionable("mention");
    const description = interaction.options.getString("description");
    const link = interaction.options.getString("link");

    const guildConfiguration = await GuildConfiguration.findOne({ guildId: interaction.guildId });

    if (!guildConfiguration || !guildConfiguration.helpChannelIds.includes(interaction.channelId)) {
      await interaction.reply('The `/help` command is only available in the configured help channel.');
      return;
    }

    // Send mention private message before the embed message
    if (mention && mention.user) {
      try {
        await mention.user.send(`You were mentioned in the help command in ${interaction.channel.toString()}`);
      } catch (error) {
        console.log(`Failed to send a private message to ${mention.user.tag}: ${error}`);
      }
    }

    const helpEmbed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("Help Information")
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ size: 256 }),
      });

    if (mention) {
      helpEmbed.addFields({
        name: "`Mention`",
        value: mention.toString(),
      });
    }

    if (description) {
      helpEmbed.addFields({
        name: "`Description`",
        value: description,
      });
    }

    if (link) {
      helpEmbed.addFields({
        name: "`Link`",
        value: link,
      });
    }

    await interaction.reply({ content: mention ? `Mention sent to ${mention.toString()}` : '', embeds: [helpEmbed] });
  },

  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Get help information")
    .addMentionableOption((option) =>
      option
        .setName("mention")
        .setDescription("Mention a user or role (e.g: @moderator, @everyone, @help-team, ...")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Provide a description")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("link")
        .setDescription("Provide a link")
        .setRequired(false)
    ),
};
