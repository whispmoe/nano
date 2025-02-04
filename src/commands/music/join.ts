import { Command } from "@/classes/command.js";
import { Embed } from "@/classes/embed.js";

import { error } from "@/utils/logging.js";
import { locale } from "@/utils/locale.js";

import {
    joinVoiceChannel,
    VoiceConnection,
    VoiceConnectionStatus
} from "@discordjs/voice";

import {
    bold,
    channelMention,
    ChatInputCommandInteraction,
    InteractionContextType,
    MessageFlags,
    type EmbedBuilder,
    type VoiceBasedChannel
} from "discord.js";

const join = new Command("join", {
    description: "commands.join.description",
    context: InteractionContextType.Guild
});

join.execute = async interaction => {
    const member = interaction.guild?.members.cache.find(
        member => member.id === interaction.user.id
    );

    const vc = {
        user: member?.voice.channel,
        bot: interaction.guild?.members.me?.voice.channel
    };

    const embeds: Record<string, EmbedBuilder> = {
        notInVoice: new Embed(interaction, {
            ...Embed.error,
            description: locale("voice.notInVoice", interaction.guildLocale)
        }).data,

        alreadyInVoice: new Embed(interaction, {
            ...Embed.error,
            description: locale("voice.alreadyInVoice", interaction.guildLocale)
        }).data
    };

    if (!vc.user)
        return interaction.reply({
            flags: MessageFlags.Ephemeral,
            embeds: [embeds.notInVoice]
        });

    if (vc.bot && vc.bot.guild.id === vc.user.guild.id) {
        if (vc.bot.members.size && vc.bot.members.size <= 1)
            return await joinVC(vc.user, interaction);

        return interaction.reply({
            flags: MessageFlags.Ephemeral,
            embeds: [embeds.alreadyInVoice]
        });
    }

    await joinVC(vc.user, interaction);
};

export const joinVC = async (
    vc: VoiceBasedChannel,
    interaction?: ChatInputCommandInteraction
): Promise<VoiceConnection | undefined> => {
    const embeds: Record<string, EmbedBuilder> = {};

    if (interaction) {
        embeds.success = new Embed(interaction, {
            ...Embed.success,
            description: bold(
                locale(
                    "voice.joined",
                    interaction?.guildLocale,
                    channelMention(vc.id)
                )
            )
        }).data;

        embeds.couldNotJoin = new Embed(interaction, {
            ...Embed.error,
            description: locale("voice.couldNotJoin", interaction.guildLocale)
        }).data;
    }

    try {
        const connection = joinVoiceChannel({
            channelId: vc.id,
            guildId: vc.guild.id,
            adapterCreator: vc.guild.voiceAdapterCreator
        });

        connection.on("stateChange", (_, newState) => {
            if (
                interaction &&
                newState.status === VoiceConnectionStatus.Ready
            ) {
                interaction.reply({
                    embeds: [embeds.success]
                });
            }
        });

        return connection;
    } catch (err) {
        error(err);
        if (interaction) {
            interaction.reply({
                embeds: [embeds.couldNotJoin]
            });
        }
    }
};

export default join;
