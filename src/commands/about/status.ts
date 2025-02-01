import config from "@/config.js";
import { delay } from "@/utils/delay.js";
import { locale } from "@/utils/messages/locale.js";

import prettyMilliseconds from "pretty-ms";
import { buildEmbed } from "@/utils/builders/buildEmbed.js";
import { buildCommand } from "@/utils/builders/buildCommand.js";

export default buildCommand(
    {
        name: "status",
        description: "commands.status.description"
    },

    async interaction => {
        const embedPinging = buildEmbed(interaction, {
            style: "default",
            title:
                `${config.emojis.hakaseButton} ` +
                locale("status.pinging", interaction.guildLocale)
        }).setImage(config.img.walking);

        const embedError = buildEmbed(interaction, {
            style: "error",
            description: locale("status.latency.error", interaction.guildLocale)
        });

        const response = await interaction.reply({ embeds: [embedPinging] });
        const botLatency =
            response.createdTimestamp - interaction.createdTimestamp;

        const wsTimeout = 10000;
        const wsTimestamp = Date.now();
        let wsHeartbeat = interaction.client.ws.ping;

        while (wsHeartbeat < 1) {
            if (Date.now() - wsTimestamp > wsTimeout)
                return response.edit({ embeds: [embedError] });

            await delay(100);
            wsHeartbeat = interaction.client.ws.ping;
        }

        const uptimeSeconds = process.uptime();
        const uptime = prettyMilliseconds(uptimeSeconds * 1000, {
            secondsDecimalDigits: 0
        });

        const statusEmoji = (n: number) => {
            if (n < 100) return config.emojis.dotGreen;
            else if (n >= 100 && n < 300) return config.emojis.dotOrange;
            else return config.emojis.dotRed;
        };

        const embedColor = (n: number) => {
            if (n < 100) return config.embedColors.success;
            else if (n >= 100 && n < 300) return config.embedColors.warning;
            else return config.embedColors.error;
        };

        const averageLatency = (botLatency + wsHeartbeat) / 2;
        const embedStatus = buildEmbed(interaction, {
            style: "default",
            title:
                `${config.emojis.checkmark} ` +
                locale("status.title", interaction.guildLocale),

            fields: [
                {
                    name: locale("status.latency.bot", interaction.guildLocale),
                    value: `${statusEmoji(botLatency)} ${botLatency}ms`,
                    inline: true
                },
                {
                    name: locale("status.latency.api", interaction.guildLocale),
                    value: `${statusEmoji(wsHeartbeat)} ${wsHeartbeat}ms`,
                    inline: true
                },
                {
                    name: locale(
                        "status.uptime.title",
                        interaction.guildLocale
                    ),
                    value: `${config.emojis.clock} ${locale("status.uptime.value", interaction.guildLocale, uptime)}`
                }
            ]
        })
            .setImage(config.img.sleepy)
            .setColor(embedColor(averageLatency));

        response.edit({ embeds: [embedStatus] });
    }
);
