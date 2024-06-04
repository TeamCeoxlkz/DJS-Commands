const {
  Client,
  Interaction,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  run: async ({ interaction, client, handler }) => {
    const targetUserId = interaction.options.get("user").value;
    const reason =
      interaction.options.get("reason")?.value || "No Reason Provided";

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    const ban1 = new EmbedBuilder()
      .setColor(2829617)
      .setDescription("That User doesn't Exist on this Server.");
    if (!targetUser) {
      await interaction.editReply({ embeds: [ban1] });
      return;
    }

    const ban2 = new EmbedBuilder()
      .setColor(2829617)
      .setDescription("You can't Ban that User as they are the Server Owner.");
    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply({ embeds: [ban2] });
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    const ban3 = new EmbedBuilder()
      .setColor(2829617)
      .setDescription(
        "You can't Ban that User because they have the Same/Higher Role than You."
      );
    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply({ embeds: [ban3] });
      return;
    }

    const ban4 = new EmbedBuilder()
      .setColor(2829617)
      .setDescription(
        "I can't Ban that User because they have the Same/Higher Role than Me."
      );
    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply({ embeds: [ban4] });
      return;
    }

    const banConfirmationEmbed = new EmbedBuilder()
      .setColor(2829617)
      .setDescription(
        `Are you sure you want to ban ${targetUser}?\nReason: ${reason}`
      );

    const confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Confirm Ban')
			.setStyle(ButtonStyle.Danger)

		const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Secondary)

    const row = new ActionRowBuilder()
      .addComponents(cancel, confirm);

    await interaction.editReply({ embeds: [banConfirmationEmbed], components: [row] });

    const filter = (i) => i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async (i) => {
      if (i.customId === 'confirm') {
        await targetUser.ban({ reason });
        const banSuccessEmbed = new EmbedBuilder()
          .setColor(2829617)
          .setDescription(`${targetUser} was Banned.\nReason: ${reason}`);
        await i.update({ embeds: [banSuccessEmbed], components: [] });
      } else if (i.customId === 'cancel') {
        const banCanceledEmbed = new EmbedBuilder()
          .setColor(2829617)
          .setDescription(`Ban action has been canceled.`);
        await i.update({ embeds: [banCanceledEmbed], components: [] });
      }
    });

    collector.on('end', async (collected) => {
      if (collected.size === 0) {
        const banTimedOutEmbed = new EmbedBuilder()
          .setColor(2829617)
          .setDescription(`Ban confirmation has timed out.`);
        await interaction.editReply({ embeds: [banTimedOutEmbed], components: [] });
      }
    });
  },

  permissionsRequired: [PermissionFlagsBits.ADMINISTRATOR],
  botPermissions: [PermissionFlagsBits.BAN_MEMBERS],

  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans a Member from this Server.")
    .addMentionableOption((option) =>
      option
        .setName("user")
        .setDescription("The User you want to Ban.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("The Reason you want to Ban.")
    ),
};
