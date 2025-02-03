import config from "@/config.js";
import { Command } from "@/classes/command.js";

import { f } from "@/utils/messages/formatting.js";
import { locale } from "@/utils/messages/locale.js";
import { buildEmbed } from "@/utils/builders/buildEmbed.js";

import prettyMilliseconds from "pretty-ms";
import { EmbedBuilder, resolveColor } from "discord.js";

const status = new Command("status", {
    description: "commands.status.description"
});

status.execute = async interaction => {
    const embeds: Record<string, EmbedBuilder> = {
        pinging: buildEmbed(interaction, {
            style: "default",
            image: { url: config.img.walking },

            title:
                `${config.emojis.nanoKey} ` +
                locale("status.pinging", interaction.guildLocale),

            description: locale("status.wait", interaction.guildLocale)
        }),

        error: buildEmbed(interaction, {
            style: "error",
            description: locale("status.latency.error", interaction.guildLocale)
        })
    };

    const response = await interaction.reply({
        embeds: [embeds.pinging]
    });

    const roundtripLatency =
        response.createdTimestamp - interaction.createdTimestamp;

    const wsHeartbeat = interaction.client.ws.ping;
    const uptimeSeconds = process.uptime();
    const uptime = prettyMilliseconds(uptimeSeconds * 1000, {
        secondsDecimalDigits: 0
    });

    const getAvg = (n: number) => ({
        emoji:
            n < 200
                ? config.emojis.dotGreen
                : n < 300
                  ? config.emojis.dotOrange
                  : config.emojis.dotRed,

        color:
            n < 200
                ? config.embedColors.success
                : n < 300
                  ? config.embedColors.warning
                  : config.embedColors.error
    });

    embeds.status = buildEmbed(interaction, {
        style: "default",
        image: { url: config.img.sleepy },

        title:
            `${config.emojis.nanoKey} ` +
            locale("status.title", interaction.guildLocale),

        color: resolveColor(getAvg((roundtripLatency + wsHeartbeat) / 2).color),

        fields: [
            {
                inline: true,
                name: locale(
                    "status.latency.roundtrip",
                    interaction.guildLocale
                ),

                value:
                    `${getAvg(roundtripLatency).emoji} ` +
                    `${roundtripLatency}ms`
            },
            {
                inline: true,
                name: locale("status.latency.ws", interaction.guildLocale),
                value: `${getAvg(wsHeartbeat).emoji} ${wsHeartbeat}ms`
            },
            {
                name: locale("status.uptime.title", interaction.guildLocale),

                value:
                    `${config.emojis.clock} ` +
                    `${locale(
                        "status.uptime.value",
                        interaction.guildLocale,
                        uptime
                    )}`
            }
        ]
    });

    response.edit({
        embeds: [embeds.status]
    });
};

export default status;
