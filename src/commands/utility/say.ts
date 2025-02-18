import type { EmbedsObject } from "@/types/embedsObject.js";

import { Embed } from "@/classes/embed.js";
import { Command } from "@/classes/command.js";

import { locale, localeMap } from "@/utils/locale.js";
import { MessageFlags, PermissionFlagsBits } from "discord.js";

const say = new Command("say", {
    description: "commands.say.description",
    permissions: PermissionFlagsBits.Administrator,
    private: true
});

say.data.addStringOption(option => {
    return option
        .setName(locale("commands.say.options.message.name"))
        .setNameLocalizations(localeMap("commands.say.options.message.name"))
        .setDescription(locale("commands.say.options.message.description"))
        .setDescriptionLocalizations(
            localeMap("commands.say.options.message.description")
        );
});

say.execute = async interaction => {
    const message = interaction.options.getString(
        locale("commands.say.options.message.name")
    );

    const embeds: EmbedsObject = {
        error: new Embed(interaction, {
            ...Embed.error,
            description: locale(
                "say.error.invalidMessage",
                interaction.guildLocale
            )
        }).data
    };

    interaction.reply(
        message ?? {
            flags: MessageFlags.Ephemeral,
            embeds: [embeds.error]
        }
    );
};

export default say;
