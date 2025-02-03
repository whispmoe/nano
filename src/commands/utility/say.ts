import { Command } from "@/classes/command.js";
import { buildEmbed } from "@/utils/builders/buildEmbed.js";
import { locale, localeMap } from "@/utils/messages/locale.js";
import { EmbedBuilder, MessageFlags, PermissionFlagsBits } from "discord.js";

const say = new Command("say", {
    description: "commands.say.description",
    permissions: PermissionFlagsBits.Administrator
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

    const embeds: Record<string, EmbedBuilder> = {
        error: buildEmbed(interaction, {
            style: "error",
            description: locale("say.invalidMessage", interaction.guildLocale)
        })
    };

    interaction.reply(
        message ?? {
            flags: MessageFlags.Ephemeral,
            embeds: [embeds.error]
        }
    );
};

export default say;
