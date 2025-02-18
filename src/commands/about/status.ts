import config from "@/config.js";

import { Command } from "@/classes/command.js";
import { Embed } from "@/classes/embed.js";

import { locale } from "@/utils/locale.js";

import prettyMilliseconds from "pretty-ms";
import { bold, EmbedBuilder, resolveColor } from "discord.js";

const status = new Command("status", {
    description: "commands.status.description"
});

status.execute = async interaction => {
    const embeds: Record<string, EmbedBuilder> = {
        pinging: new Embed(interaction, {
            image: { url: config.img.walking },
            title:
                `${config.emojis.nanoKey} ` +
                locale("status.pinging", interaction.guildLocale),
            description: locale("status.wait", interaction.guildLocale)
        }).data,

        error: new Embed(interaction, {
            ...Embed.error,
            description: locale("status.latency.error", interaction.guildLocale)
        }).data
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
                ? config.colors.success
                : n < 300
                  ? config.colors.warning
                  : config.colors.error
    });

    embeds.status = new Embed(interaction, {
        color: resolveColor(getAvg((roundtripLatency + wsHeartbeat) / 2).color),
        image: { url: config.img.sleepy },

        title:
            `${config.emojis.nanoKey} ` +
            locale("status.title", interaction.guildLocale),

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
                value:
                    wsHeartbeat > 0
                        ? `${getAvg(wsHeartbeat).emoji} ${wsHeartbeat}ms`
                        : `${config.emojis.dotOrange} ` +
                          bold(
                              locale(
                                  "general.notAvailable",
                                  interaction.guildLocale
                              )
                          )
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
    }).data;

    response.edit({
        embeds: [embeds.status]
    });
};

export default status;
