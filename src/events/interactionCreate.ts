import { error } from "@/utils/logging.js";
import { buildEvent } from "@/utils/builders/buildEvent.js";
import { buildEmbed } from "@/utils/builders/buildEmbed.js";

import pc from "picocolors";

import {
    Events,
    InteractionContextType,
    MessageFlags,
    type Interaction,
    type InteractionReplyOptions
} from "discord.js";
import { locale } from "@/utils/messages/locale.js";

export default buildEvent(
    { name: Events.InteractionCreate },
    async (interaction: Interaction) => {
        if (!interaction.isChatInputCommand()) return;
        const command = interaction.client.commands.get(
            interaction.commandName
        );

        if (!command) {
            error(
                "command",
                pc.bold(pc.cyan(`/${interaction.commandName}`)),
                "not found"
            );

            return interaction.reply({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    buildEmbed(interaction, {
                        style: "error",
                        description:
                            "The specified command `" +
                            interaction.commandName +
                            "` was not found"
                    })
                ]
            });
        }

        const messageInteractionError: InteractionReplyOptions = {
            flags: MessageFlags.Ephemeral,
            embeds: [
                buildEmbed(interaction, {
                    style: "error",
                    description: "Something went wrong during this interaction!"
                })
            ]
        };

        const embedScopeGuild = buildEmbed(interaction, {
            style: "error",
            description: locale(
                "common.error.scope.guild",
                interaction.guildLocale
            )
        });

        const embedScopeDM = buildEmbed(interaction, {
            style: "error",
            description: locale(
                "common.error.scope.dm",
                interaction.guildLocale
            )
        });

        const embedInsufficientPermissions = buildEmbed(interaction, {
            style: "error",
            description: locale(
                "common.error.insufficientPermissions",
                interaction.guildLocale
            )
        });

        const userHasPermissions =
            command.context === InteractionContextType.Guild &&
            (await interaction.guild?.members.fetch())?.find(
                member => member.id === interaction.user.id
            );

        try {
            switch (command.context) {
                case InteractionContextType.Guild:
                    return interaction.reply({
                        flags: MessageFlags.Ephemeral,
                        embeds: [embedScopeGuild]
                    });

                case InteractionContextType.BotDM:
                    return interaction.reply({
                        flags: MessageFlags.Ephemeral,
                        embeds: [embedScopeDM]
                    });
            }

            if (userHasPermissions) {
                await command.execute(interaction);
            } else {
                interaction.reply({
                    flags: MessageFlags.Ephemeral,
                    embeds: [embedInsufficientPermissions]
                });
            }
        } catch (err) {
            error(err);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(messageInteractionError);
            } else await interaction.reply(messageInteractionError);
        }
    }
);
