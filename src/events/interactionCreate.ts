import type { EmbedsObject } from "@/types/embedsObject.js";

import { Embed } from "@/classes/embed.js";
import { Event } from "@/classes/event.js";

import { error } from "@/utils/logging.js";
import { locale } from "@/utils/locale.js";

import {
    Events,
    GuildMember,
    InteractionContextType,
    MessageFlags,
    type Interaction,
    type InteractionReplyOptions
} from "discord.js";
import pc from "picocolors";

const interactionCreate = new Event(Events.InteractionCreate);
interactionCreate.execute = async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    const embeds: EmbedsObject = {
        commandNotFound: new Embed(interaction, {
            ...Embed.error,
            description: locale(
                "error.commandNotFound",
                interaction.guildLocale,
                interaction.commandName
            )
        }).data,

        interactionFailed: new Embed(interaction, {
            ...Embed.error,
            description: locale(
                "error.interactionFailed",
                interaction.guildLocale
            )
        }).data,

        insufficientPermissions: new Embed(interaction, {
            ...Embed.error,
            description: locale(
                "error.insufficientPermissions",
                interaction.guildLocale
            )
        }).data,

        scopeGuild: new Embed(interaction, {
            ...Embed.error,
            description: locale("error.scope.guild", interaction.guildLocale)
        }).data,

        scopeDM: new Embed(interaction, {
            ...Embed.error,
            description: locale("error.scope.dm", interaction.guildLocale)
        }).data
    };

    if (!command) {
        error(
            `command ${pc.bold(pc.cyan(`/${interaction.commandName}`))}`,
            "not found!"
        );

        return interaction.reply({
            flags: MessageFlags.Ephemeral,
            embeds: [embeds.commandNotFound]
        });
    }

    let member: GuildMember | undefined;
    const guild = await interaction.guild?.fetch();
    const guildMembers = await guild?.members.fetch();

    if (guildMembers)
        member = guildMembers.find(member => member.id === interaction.user.id);

    const hasPermissions = member?.permissions.has(command.permissions ?? []);

    const isDM = interaction.context === InteractionContextType.BotDM;
    const isGuild = interaction.context === InteractionContextType.Guild;

    try {
        switch (command.context) {
            case InteractionContextType.Guild:
                if (isDM)
                    return interaction.reply({
                        embeds: [embeds.scopeGuild]
                    });
                break;

            case InteractionContextType.BotDM:
                if (isGuild)
                    return interaction.reply({
                        flags: MessageFlags.Ephemeral,
                        embeds: [embeds.scopeDM]
                    });
                break;
        }

        if (isGuild && !hasPermissions) {
            return interaction.reply({
                flags: MessageFlags.Ephemeral,
                embeds: [embeds.insufficientPermissions]
            });
        }

        await command.execute(interaction);
    } catch (err) {
        error(err);
        const interactionError: InteractionReplyOptions = {
            flags: MessageFlags.Ephemeral,
            embeds: [embeds.interactionFailed]
        };

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(interactionError);
        } else await interaction.reply(interactionError);
    }
};

export default interactionCreate;
