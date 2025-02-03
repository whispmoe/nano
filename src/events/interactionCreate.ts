import { error } from "@/utils/logging.js";
import { buildEvent } from "@/utils/builders/buildEvent.js";
import { buildEmbed } from "@/utils/builders/buildEmbed.js";
import { locale } from "@/utils/messages/locale.js";

import {
    EmbedBuilder,
    Events,
    GuildMember,
    InteractionContextType,
    MessageFlags,
    type Interaction,
    type InteractionReplyOptions
} from "discord.js";
import pc from "picocolors";

export default buildEvent(
    { name: Events.InteractionCreate },
    async (interaction: Interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(
            interaction.commandName
        );

        const embeds: Record<string, EmbedBuilder> = {
            commandNotFound: buildEmbed(interaction, {
                style: "error",
                description: locale(
                    "common.error.commandNotFound",
                    interaction.guildLocale,
                    interaction.commandName
                )
            }),

            interactionFailed: buildEmbed(interaction, {
                style: "error",
                description: locale(
                    "common.error.interactionFailed",
                    interaction.guildLocale
                )
            }),

            insufficientPermissions: buildEmbed(interaction, {
                style: "error",
                description: locale(
                    "common.error.insufficientPermissions",
                    interaction.guildLocale
                )
            }),

            scopeGuild: buildEmbed(interaction, {
                style: "error",
                description: locale(
                    "common.error.scope.guild",
                    interaction.guildLocale
                )
            }),

            scopeDM: buildEmbed(interaction, {
                style: "error",
                description: locale(
                    "common.error.scope.dm",
                    interaction.guildLocale
                )
            })
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
            member = guildMembers.find(
                member => member.id === interaction.user.id
            );

        const hasPermissions = member?.permissions.has(
            command.permissions ?? []
        );

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
    }
);
