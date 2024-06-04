const { Client, Interaction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  run: async ({ interaction }) => {
    const name = interaction.user.username; // Use member's username
    const passion = interaction.options.getString("passion");
    const recentYears = interaction.options.getString("recent_years");
    const specializing = interaction.options.getString("specializing");
    const freeTimeActivities = interaction.options.getString("free_time_activities");
    const excitement = interaction.options.getString("excitement");

    const introduction = `Hi everyone! I'm **${name}**. I have a passion for **${passion}**, and I've been **${recentYears}**. My specialization is in **${specializing}**. In my free time, I enjoy **${freeTimeActivities}**. I'm really excited about **${excitement}**!`;

    const introductionEmbed = new EmbedBuilder()
      .setColor('#36393f')
      .setTitle("Introduction")
      .setDescription(introduction)
      .setAuthor({
        name: name,
        iconURL: interaction.user.displayAvatarURL({ size: 256 })
      })
      .setTimestamp();

    await interaction.reply({ embeds: [introductionEmbed] });
  },

  data: new SlashCommandBuilder()
    .setName("introduce")
    .setDescription("Introduce yourself")
    .addStringOption((option) =>
      option
        .setName("passion")
        .setDescription("Your passion or area of interest (I have a passion for...)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("recent_years")
        .setDescription("What you have been doing in recent years (and I've been...)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("specializing")
        .setDescription("Your specialization or expertise (My specialization is in...)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("free_time_activities")
        .setDescription("What you do in your free time (In my free time, I enjoy...)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("excitement")
        .setDescription("Something you are excited about (I'm really excited about...)")
        .setRequired(true)
    ),
};
