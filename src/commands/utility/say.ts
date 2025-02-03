import { locale } from "@/utils/messages/locale.js";
import { buildEmbed } from "@/utils/builders/buildEmbed.js";
import { buildCommand } from "@/utils/builders/buildCommand.js";

import { EmbedBuilder, MessageFlags, PermissionFlagsBits } from "discord.js";

export default buildCommand(
    {
        name: "say",
        description: "commands.say.description",
        permissions: PermissionFlagsBits.Administrator,
        options: [
            {
                type: "string",
                name: "commands.say.options.message.name",
                description: "commands.say.options.message.description",
                required: true
            }
        ]
    },

    async interaction => {
        const message = interaction.options.getString(
            locale("commands.say.options.message.name")
        );

        const embeds: Record<string, EmbedBuilder> = {
            error: buildEmbed(interaction, {
                style: "error",
                description: locale(
                    "say.invalidMessage",
                    interaction.guildLocale
                )
            })
        };

        interaction.reply(
            message ?? {
                flags: MessageFlags.Ephemeral,
                embeds: [embeds.error]
            }
        );
    }
);
