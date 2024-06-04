const { Client, Interaction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const GuildConfiguration = require('../models/GuildConfiguration');

module.exports = {
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  run: async ({ interaction, client }) => {
    const position = interaction.options.getString("position");
    const experience = interaction.options.getString("experience");
    const requirements = interaction.options.getString("requirements");
    const pay = interaction.options.getString("pay");
    const jobSlots = interaction.options.getInteger("job_slots");
    const howToApply = interaction.options.getString("how_to_apply");
  
    const guildConfiguration = await GuildConfiguration.findOne({ guildId: interaction.guildId });
    if (!guildConfiguration) {
      guildConfiguration = new GuildConfiguration({ guildId: interaction.guildId });
    }
  
    const hireRoleIds = guildConfiguration.hireRoleIds;
    const hireRoleMentions = hireRoleIds.map((roleId) => `<@&${roleId}>`);
  
    const member = interaction.member;
    const memberRoles = member.roles.cache;
    const hasHireRole = memberRoles.some((role) => hireRoleIds.includes(role.id));

    const hireEmbed = new EmbedBuilder()
      .setColor(2829617)
      .setTitle(`📢 Looking for **${position}**`)
      .setDescription(`If you're experienced in **${experience}**, we need you!`)
      .addFields(
        { name: "🔎 Requirements", value: requirements },
        { name: '\u200b', value: '\u200b' },
        { name: "PAY", value: pay },
        { name: '\u200b', value: '\u200b' },
        { name: "Job Slots Available", value: jobSlots.toString(), inline:true },
        { name: "📩 How to Apply\n", value: howToApply,  inline:true },
        { name: '\u200b', value: '\u200b' }
      )
      .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ size: 256 }), url: 'https://discord.gg/VnPxaR2Q' })
      .setTimestamp()
      .setFooter({ iconURL: interaction.user.displayAvatarURL({ size: 256 }), text: "Job Posting" });
  
    await interaction.reply({ embeds: [hireEmbed] });

    if (hasHireRole) {
      const mentionString = `@everyone, ${hireRoleMentions.join(", ")} ${interaction.user} is looking to hire someone...`;
      await interaction.channel.send(mentionString);
    }
  },
  
  data: new SlashCommandBuilder()
    .setName("hire")
    .setDescription("Post a job hiring announcement")
    .addStringOption((option) =>
      option
      .setName("position")
      .setDescription("The position you are hiring for (Looking for...)")
      .setRequired(true)
    )
    .addStringOption((option) =>
      option
      .setName("experience")
      .setDescription("The required experience for the position (If you're experienced in)")
      .setRequired(true)
    )
    .addStringOption((option) =>
      option
      .setName("requirements")
      .setDescription("The job requirements (use: • ) ")
      .setRequired(true)
    )
    .addStringOption((option) => 
    option
    .setName("pay")
    .setDescription("The payment details").setRequired(true))
    .addIntegerOption((option) =>
      option
      .setName("job_slots")
      .setDescription("The number of job slots available")
      .setRequired(true)
    )
    .addStringOption((option) =>
      option
      .setName("how_to_apply")
      .setDescription("How to apply for the job")
      .setRequired(true)
    ),
};
