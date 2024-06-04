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
      const role = interaction.options.getRole('role');

      if (guildConfiguration.hireRoleIds.includes(role.id)) {
        await interaction.reply(`${role} is already a hire role.`);
        return;
      }

      guildConfiguration.hireRoleIds.push(role.id);
      await guildConfiguration.save();

      await interaction.reply(`Added ${role} to hire roles.`);
      return;
    }

    if (subcommand === 'remove') {
      const role = interaction.options.getRole('role');

      if (!guildConfiguration.hireRoleIds.includes(role.id)) {
        await interaction.reply(`${role} is not a hire role.`);
        return;
      }

      guildConfiguration.hireRoleIds = guildConfiguration.hireRoleIds.filter(
        (id) => id !== role.id
      );

      await guildConfiguration.save();

      await interaction.reply(`Removed ${role} from hire roles.`);
    }
  },

  options: {
    userPermissions: ['Administrator'],
  },

  data: new SlashCommandBuilder()
    .setName('hire-config')
    .setDescription('Configure the hire roles.')
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('set')
        .setDescription('Set a hire role.')
        .addRoleOption((option) =>
          option
            .setName('role')
            .setDescription('The role you want to set as a hire role.')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('remove')
        .setDescription('Remove a hire role.')
        .addRoleOption((option) =>
          option
            .setName('role')
            .setDescription('The role you want to remove from hire roles.')
            .setRequired(true)
        )
    ),
};
