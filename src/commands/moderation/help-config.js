const { SlashCommandBuilder, ChannelType } = require('discord.js');
const GuildConfiguration = require('../../models/GuildConfiguration');

module.exports = {
  /**
   * @param {Object} param0
   * @param {ChatInputCommandInteraction} param0.interaction
   */
  run: async ({ interaction }) => {
    let guildConfiguration = await GuildConfiguration.findOne({ guildId: interaction.guildId });
    if (!guildConfiguration) {
      guildConfiguration = new GuildConfiguration({ guildId: interaction.guildId });
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'set') {
      const channel = interaction.options.getChannel('channel');

      if (guildConfiguration.helpChannelIds.includes(channel.id)) {
        await interaction.reply(`${channel} is already a help channel.`);
        return;
      }

      guildConfiguration.helpChannelIds.push(channel.id);
      await guildConfiguration.save();

      await interaction.reply(`Added ${channel} to help channels.`);
      return;
    }

    if (subcommand === 'remove') {
      const channel = interaction.options.getChannel('channel');

      if (!guildConfiguration.helpChannelIds.includes(channel.id)) {
        await interaction.reply(`${channel} is not a help channel.`);
        return;
      }

      guildConfiguration.helpChannelIds = guildConfiguration.helpChannelIds.filter(
        (id) => id !== channel.id
      );

      await guildConfiguration.save();

      await interaction.reply(`Removed ${channel} from help channels.`);
    }
  },

  options: {
    userPermissions: ['Administrator'],
  },

  data: new SlashCommandBuilder()
    .setName('help-config')
    .setDescription('Configure the help channel.')
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('set')
        .setDescription('Set the help channel.')
        .addChannelOption((option) =>
          option
            .setName('channel')
            .setDescription('The channel you want to set as the help channel.')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('remove')
        .setDescription('Remove the help channel.')
        .addChannelOption((option) =>
          option
            .setName('channel')
            .setDescription('The channel you want to remove as the help channel.')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    ),
};
