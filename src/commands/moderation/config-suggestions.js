const { SlashCommandBuilder, ChannelType } = require('discord.js');
const GuildConfiguration = require('../../models/GuildConfiguration');

module.exports = {
    /**
     * 
     * @param {Object} param0 
     * @param {ChatInputCommandInteraction} param0.interaction 
     */
    run: async ({ interaction}) => {
        let guildConfiguration = await GuildConfiguration.findOne({ guildId: interaction.guildId});
        if (!guildConfiguration) {
           guildConfiguration = new GuildConfiguration({guildId: interaction.guildId}); 
        };

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'add') {
            const channel = interaction.options.getChannel('channel');

            if (guildConfiguration.suggestionChannelIds.includes(channel.id)) {
                await interaction.reply(`${channel} is already a suggestions channel.`);
                return;
            }

            guildConfiguration.suggestionChannelIds.push(channel.id);
            await guildConfiguration.save();

            await interaction.reply(`Added ${channel} to suggestion channels.`);
            return;
        }

        if (subcommand === 'remove') {
            const channel = interaction.options.getChannel('channel');

            if (!guildConfiguration.suggestionChannelIds.includes(channel.id)) {
                await interaction.reply(`${channel} is not a suggestions channel.`);
                return;
            };

            guildConfiguration.suggestionChannelIds = guildConfiguration.suggestionChannelIds.filter(
                (id) => id !== channel.id
            );

            await guildConfiguration.save();

            await interaction.reply(`Removed ${channel} from suggestion channels.`);
        }
    },

    options: {
       userPermissions: ['Administrator'] 
    },

    data: new SlashCommandBuilder()
        .setName('config-suggestions')
        .setDescription('Configure suggestions.')
        .setDMPermission(false)
        .addSubcommand((subcommand) => 
            subcommand
                .setName('add')
                .setDescription('Add a suggestions channel.')
                .addChannelOption ((option) => 
                    option
                    .setName('channel')
                    .setDescription('The channel you want to add.')
                    .addChannelTypes(ChannelType.GuildText) 
                    .setRequired(true)
                )
        )
        .addSubcommand((subcommand) => 
            subcommand
                .setName('remove')
                .setDescription('Remove a suggestions channel.')
                .addChannelOption ((option) => 
                    option
                    .setName('channel')
                    .setDescription('The channel you want to remove.')
                    .addChannelTypes(ChannelType.GuildText) 
                    .setRequired(true)
                )
        )

};