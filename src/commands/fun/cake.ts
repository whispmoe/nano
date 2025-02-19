import { Command } from "@/classes/command.js";
import { Embed } from "@/classes/embed.js";
import config from "@/config.js";
import type { EmbedsObject } from "@/types/embedsObject.js";
import { locale } from "@/utils/locale.js";

const cake = new Command("cake", {
    description: "commands.cake.description"
});

cake.execute = async interaction => {
    const embeds: EmbedsObject = {
        cake: new Embed(interaction, {
            image: { url: config.img.cake },
            description: locale(
                "cake.eating",
                interaction.guildLocale,
                interaction.user.displayName
            )
        }).data
    };

    return interaction.reply({ embeds: [embeds.cake] });
};

export default cake;
