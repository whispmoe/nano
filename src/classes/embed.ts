import config from "@/config.js";

import {
    EmbedBuilder,
    resolveColor,
    type ChatInputCommandInteraction,
    type EmbedData,
    type EmbedFooterData
} from "discord.js";

export class Embed {
    constructor(
        interaction: ChatInputCommandInteraction,
        prop: EmbedData = {}
    ) {
        const timestamp = prop.timestamp ?? new Date();
        const footer = prop.footer ?? Embed.defaultFooter(interaction);
        const color = prop.color ?? resolveColor(config.colors.default);
        this.data = new EmbedBuilder({ ...prop, color, footer, timestamp });
    }

    data: EmbedBuilder;

    private static defaultFooter = (
        interaction: ChatInputCommandInteraction
    ): EmbedFooterData => ({
        text: interaction.guild?.name ?? interaction.client.user.displayName,
        iconURL:
            interaction.guild?.iconURL() ??
            interaction.client.user.avatarURL() ??
            undefined
    });

    static success: EmbedData = {
        color: resolveColor(config.colors.success)
    };

    static warning: EmbedData = {
        color: resolveColor(config.colors.warning)
    };

    static error: EmbedData = {
        color: resolveColor(config.colors.error)
    };
}
