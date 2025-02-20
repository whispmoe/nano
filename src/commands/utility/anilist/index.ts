import { Command } from "@/classes/command.js";

import { locale, localeMap } from "@/utils/locale.js";
import { searchUser } from "@/commands/utility/anilist/searchUser.js";
import { searchAnime } from "@/commands/utility/anilist/searchAnime.js";
import { searchCharacter } from "@/commands/utility/anilist/searchCharacter.js";

const anilist = new Command("anilist", {
    description: "general.noDescription"
});

anilist.data.addSubcommand(subcommand =>
    subcommand
        .setName("anime")
        .setDescription(
            locale("commands.anilist.subcommands.anime.description")
        )
        .setDescriptionLocalizations(
            localeMap("commands.anilist.subcommands.anime.description")
        )
        .addStringOption(option =>
            option
                .setRequired(true)
                .setName(
                    locale(
                        "commands.anilist.subcommands.anime.options.anime.name"
                    )
                )
                .setDescription(
                    locale(
                        "commands.anilist.subcommands.anime.options.anime.description"
                    )
                )
                .setDescriptionLocalizations(
                    localeMap(
                        "commands.anilist.subcommands.anime.options.anime.description"
                    )
                )
        )
);

anilist.data.addSubcommand(subcommand =>
    subcommand
        .setName("user")
        .setDescription(locale("commands.anilist.subcommands.user.description"))
        .setDescriptionLocalizations(
            localeMap("commands.anilist.subcommands.user.description")
        )
        .addStringOption(option =>
            option
                .setRequired(true)
                .setName(
                    locale(
                        "commands.anilist.subcommands.user.options.user.name"
                    )
                )
                .setDescription(
                    locale(
                        "commands.anilist.subcommands.user.options.user.description"
                    )
                )
                .setDescriptionLocalizations(
                    localeMap(
                        "commands.anilist.subcommands.user.options.user.description"
                    )
                )
        )
);

anilist.data.addSubcommand(subcommand =>
    subcommand
        .setName("character")
        .setDescription(
            locale("commands.anilist.subcommands.character.description")
        )
        .setDescriptionLocalizations(
            localeMap("commands.anilist.subcommands.character.description")
        )
        .addStringOption(option =>
            option
                .setRequired(true)
                .setName(
                    locale(
                        "commands.anilist.subcommands.character.options.character.name"
                    )
                )
                .setDescription(
                    locale(
                        "commands.anilist.subcommands.character.options.character.description"
                    )
                )
                .setDescriptionLocalizations(
                    localeMap(
                        "commands.anilist.subcommands.character.options.character.description"
                    )
                )
        )
);

anilist.execute = async interaction => {
    /* TODO: add manga command (the functionality is already there but it would
     * require refactoring to avoid code duplication which i am too lazy for) */
    switch (interaction.options.getSubcommand()) {
        case "anime":
            searchAnime(interaction);
            break;

        case "user":
            searchUser(interaction);
            break;

        case "character":
            searchCharacter(interaction);
            break;
    }
};

export default anilist;
