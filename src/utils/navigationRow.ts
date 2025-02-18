import config from "@/config.js";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export const navigationRow = (currentPage: number, totalPages: number) => {
    const navigationButtons = {
        back: new ButtonBuilder()
            .setCustomId("back")
            .setEmoji(config.emojis.arrowLeft)
            .setStyle(ButtonStyle.Primary),

        next: new ButtonBuilder()
            .setCustomId("next")
            .setEmoji(config.emojis.arrowRight)
            .setStyle(ButtonStyle.Primary),

        close: new ButtonBuilder()
            .setCustomId("close")
            .setEmoji(config.emojis.close)
            .setStyle(ButtonStyle.Danger)
    };

    navigationButtons.back.setDisabled(currentPage <= 1);
    navigationButtons.next.setDisabled(currentPage === totalPages);

    const navigationRow = new ActionRowBuilder<ButtonBuilder>({
        components: [
            navigationButtons.back,
            navigationButtons.next,
            navigationButtons.close
        ]
    });

    return navigationRow;
};
