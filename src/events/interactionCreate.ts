import { error } from "@/utils/logging.js";
import { buildEvent } from "@/utils/builders/buildEvent.js";
import { buildEmbed } from "@/utils/builders/buildEmbed.js";
import { locale } from "@/utils/messages/locale.js";
import pc from "picocolors";

import {
    Events,
    GuildMember,
    InteractionContextType,
    MessageFlags,
    type Interaction,
    type InteractionReplyOptions
} from "discord.js";

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
                            flags: MessageFlags.Ephemeral,
                            embeds: [embedScopeGuild]
                        });
                    break;

                case InteractionContextType.BotDM:
                    if (isGuild)
                        return interaction.reply({
                            flags: MessageFlags.Ephemeral,
                            embeds: [embedScopeDM]
                        });
                    break;
            }

            if (isGuild && !hasPermissions) {
                return interaction.reply({
                    embeds: [embedInsufficientPermissions]
                });
            }

            await command.execute(interaction);
        } catch (err) {
            error(err);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(messageInteractionError);
            } else await interaction.reply(messageInteractionError);
        }
    }
);
