import config from "@/config.js";
import { locale, type LocaleKey } from "@/utils/messages/locale.js";

import {
    EmbedBuilder,
    type ChatInputCommandInteraction,
    type EmbedData,
    type EmbedFooterData
} from "discord.js";

interface EmbedProperties extends EmbedData {
    style: "default" | "success" | "warning" | "error";
}

const defaultFooter = (
    interaction: ChatInputCommandInteraction
): EmbedFooterData => {
    let iconURL;

    const text = interaction.guild
        ? interaction.guild.name
        : interaction.client.user.displayName;

    if (interaction.guild?.iconURL())
        iconURL = interaction.guild.iconURL() ?? undefined;
    else if (interaction.client.user.avatarURL())
        iconURL = interaction.client.user.avatarURL() ?? undefined;

    return { text, iconURL };
};

export const buildEmbed = (
    interaction: ChatInputCommandInteraction,
    prop: EmbedProperties
) => {
    let color = config.embedColors.default;
    switch (prop.style) {
        case "default":
            color = config.embedColors.default;
            break;

        case "success":
            color = config.embedColors.success;
            break;

        case "warning":
            color = config.embedColors.warning;
            break;

        case "error":
            color = config.embedColors.error;
            if (!prop.title)
                prop.title =
                    `${config.emojis.sakamotoFear} ` +
                    locale("common.error.default", interaction.guildLocale);

            if (!prop.image) prop.image = { url: config.img.embarassed };
            break;
    }

    return new EmbedBuilder(prop)
        .setTitle(prop.title ?? null)
        .setDescription(prop.description ?? null)
        .setFooter(defaultFooter(interaction))
        .setTimestamp(new Date())
        .setColor(color);
};
