import config from "@/config.js";

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
): EmbedFooterData => ({
    text: interaction.guild?.name ?? interaction.client.user.displayName,
    iconURL:
        interaction.guild?.iconURL() ??
        interaction.client.user.avatarURL() ??
        undefined
});

export const buildEmbed = (
    interaction: ChatInputCommandInteraction,
    prop: EmbedProperties
) => {
    const color = config.embedColors[prop.style] ?? config.embedColors.default;
    return new EmbedBuilder({ ...prop })
        .setFooter(defaultFooter(interaction))
        .setTimestamp(new Date())
        .setColor(color);
};
