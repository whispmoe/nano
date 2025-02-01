import { error } from "@/utils/logging.js";
import { f } from "@/utils/messages/formatting.js";
import { locale } from "@/utils/messages/locale.js";
import { buildEmbed } from "@/utils/builders/buildEmbed.js";
import { buildCommand } from "@/utils/builders/buildCommand.js";

import {
    joinVoiceChannel,
    VoiceConnection,
    VoiceConnectionStatus
} from "@discordjs/voice";

import {
    ChatInputCommandInteraction,
    InteractionContextType,
    MessageFlags,
    type VoiceBasedChannel
} from "discord.js";

export default buildCommand(
    {
        name: "join",
        description: "commands.join.description",
        context: InteractionContextType.Guild
    },

    async interaction => {
        const member = interaction.guild?.members.cache.find(
            member => member.id === interaction.user.id
        );

        if (!member?.voice.channel)
            return interaction.reply({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    buildEmbed(interaction, {
                        style: "error",
                        description: locale(
                            "voice.notInVoice",
                            interaction.guildLocale
                        )
                    })
                ]
            });

        const memberVC = member.voice.channel;
        const botVC = interaction.guild?.members.me?.voice.channel;

        if (botVC && botVC.guild.id === memberVC.guild.id) {
            if (botVC.members.size && botVC.members.size <= 1)
                return await joinVC(interaction, memberVC);

            return interaction.reply({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    buildEmbed(interaction, {
                        style: "error",
                        description: locale(
                            "voice.alreadyInVoice",
                            interaction.guildLocale
                        )
                    })
                ]
            });
        }

        await joinVC(interaction, memberVC);
    }
);

const joinVC = async (
    interaction: ChatInputCommandInteraction,
    vc: VoiceBasedChannel
): Promise<VoiceConnection | undefined> => {
    try {
        const connection = joinVoiceChannel({
            channelId: vc.id,
            guildId: vc.guild.id,
            adapterCreator: vc.guild.voiceAdapterCreator
        });

        connection.on("stateChange", (oldState, newState) => {
            if (newState.status === VoiceConnectionStatus.Ready)
                interaction.reply({
                    embeds: [
                        buildEmbed(interaction, {
                            style: "success",
                            description: f.bold(
                                locale(
                                    "voice.joined",
                                    interaction.guildLocale,
                                    f.channel(vc.id)
                                )
                            )
                        })
                    ]
                });
        });

        return connection;
    } catch (err) {
        error(err);
        interaction.reply({
            embeds: [
                buildEmbed(interaction, {
                    style: "error",
                    description: locale(
                        "voice.couldNotJoin",
                        interaction.guildLocale
                    )
                })
            ]
        });
    }
};
