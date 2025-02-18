import type { ChatInputCommandInteraction } from "discord.js";

export const getCommandID = async (
    interaction: ChatInputCommandInteraction,
    name: string
) => {
    let scope = interaction.guild
        ? await interaction.guild.commands.fetch()
        : await interaction.client.application.commands.fetch();

    if (scope.size <= 0)
        scope = await interaction.client.application.commands.fetch();

    const command = scope.find(command => command.name === name);
    return command?.id;
};
