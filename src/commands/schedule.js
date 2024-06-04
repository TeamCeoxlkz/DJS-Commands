const { Client, Interaction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  run: async ({ interaction, client, handler }) => {
    const mention = interaction.options.getMentionable("mention");
    const date = interaction.options.getString("date");
    const time = interaction.options.getString("time");
    const description = interaction.options.getString("description");
    const link = interaction.options.getString("link");

    const scheduleEmbed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("Event Schedule")
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ size: 256 }),
      });

    if (mention) {
      scheduleEmbed.addFields({
        name: "Mention",
        value: mention.toString(),
      });

      // Send a private message to the mentioned user
      try {
        await mention.send(`You were mentioned in the schedule command in ${interaction.channel.toString()}`);
      } catch (error) {
        console.log(`Failed to send a private message to ${mention.tag}: ${error}`);
      }
    }

    if (date) {
      scheduleEmbed.addFields({
        name: "Date",
        value: date,
        inline: true,
      });
    }

    if (time) {
      scheduleEmbed.addFields({
        name: "Time", color:"blue",
        value: time,
        inline: true,
      });
    }

    if (description) {
      scheduleEmbed.addFields({
        name: "Description",
        value: description,
      });
    }

    if (link) {
      scheduleEmbed.addFields({
        name: "Link",
        value: link,
      });
    }

    await interaction.reply({ embeds: [scheduleEmbed] });
  },

  data: new SlashCommandBuilder()
    .setName("schedule")
    .setDescription("Schedule an event")
    .addMentionableOption((option) =>
      option
        .setName("mention")
        .setDescription("Mention a member")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("date")
        .setDescription("Enter the date of the event, (e.g: dd/mm/yy)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("Enter the time of the event, (e.g: tt:tt)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Enter the description of the event")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("link")
        .setDescription("Enter the link for the event")
        .setRequired(false)
    ),
};
