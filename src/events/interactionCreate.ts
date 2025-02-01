import { error } from "@/utils/logging.js";
import { buildEvent } from "@/utils/builders/buildEvent.js";
import { buildEmbed } from "@/utils/builders/buildEmbed.js";

import pc from "picocolors";

import {
    Events,
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

        try {
            await command.execute(interaction);
        } catch (err) {
            error(err);
            if (interaction.replied || interaction.deferred)
                await interaction.followUp(messageInteractionError);
            else await interaction.reply(messageInteractionError);
        }
    }
);
