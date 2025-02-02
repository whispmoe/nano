import config from "@/config.js";

import { f } from "@/utils/messages/formatting.js";
import { locale } from "@/utils/messages/locale.js";
import { buildEmbed } from "@/utils/builders/buildEmbed.js";
import { buildCommand } from "@/utils/builders/buildCommand.js";

import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    ComponentType,
    StringSelectMenuBuilder,
    type InteractionUpdateOptions
} from "discord.js";
import yts from "yt-search";

export default buildCommand(
    {
        name: "search",
        description: "commands.search.description",
        options: [
            {
                type: "string",
                name: "commands.search.options.song.name",
                description: "commands.search.options.song.description",
                required: true
            }
        ]
    },
    async interaction => search(interaction)
);

type SearchOptions = {
    /** Instead of returning the search menu, return the first video result for
     * the specified search query */
    getFirstResult?: boolean;
};

export const search = async (
    interaction: ChatInputCommandInteraction,
    options: SearchOptions = {}
) => {
    const song = interaction.options.getString(
        locale("commands.search.options.song.name")
    );

    const embedNoSong = buildEmbed(interaction, {
        style: "error",
        description: locale("music.noSong", interaction.guildLocale)
    });

    if (!song) {
        if (options.getFirstResult) return undefined;
        return interaction.reply({
            embeds: [embedNoSong]
        });
    }

    if (options.getFirstResult) {
        const results = (await yts(song)).videos;
        if (!results.length) return undefined;
        return results[0];
    }

    const resultsPerPage = 5;
    let currentPage = 1;

    const response = await interaction.deferReply({ withResponse: true });
    const results = (await yts(song)).videos;

    const embedNoResults = buildEmbed(interaction, {
        style: "error",
        description: locale("music.search.noResults", interaction.guildLocale)
    });

    if (!results.length)
        return interaction.editReply({
            embeds: [embedNoResults]
        });

    const getPage = (page: number) =>
        results.slice((page - 1) * resultsPerPage, page * resultsPerPage);

    const resultsPayload = (
        options: {
            expired?: boolean;
        } = {}
    ): InteractionUpdateOptions => {
        const fields = getPage(currentPage).map(result => ({
            name:
                `${result.author.name} ~ ` + f.code(result.duration.timestamp),

            value:
                `${config.emojis.cd} ` +
                f.bold(f.link(result.title, result.url))
        }));

        const embedExpired = buildEmbed(interaction, {
            fields,
            style: "default",
            description: f.small(
                locale("common.expired", interaction.guildLocale)
            )
        });

        if (options.expired) return { embeds: [embedExpired], components: [] };

        const embed = buildEmbed(interaction, {
            thumbnail: { url: getPage(currentPage)[0].image },
            title: locale("music.search.results", interaction.guildLocale),
            style: "default",
            fields
        });

        const menuSongs = new StringSelectMenuBuilder()
            .setCustomId("song")
            .setPlaceholder(
                locale("music.search.menu.select", interaction.guildLocale)
            );

        getPage(currentPage).forEach(result => {
            menuSongs.addOptions({
                label: result.title,
                value: result.videoId,
                description: result.author.name,
                emoji: config.emojis.cd
            });
        });

        const buttons = {
            back: new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setDisabled(currentPage === 1)
                .setCustomId("back")
                .setLabel(
                    locale("music.search.menu.back", interaction.guildLocale)
                ),

            next: new ButtonBuilder()
                .setDisabled(results.length <= currentPage * resultsPerPage)
                .setStyle(ButtonStyle.Primary)
                .setCustomId("next")
                .setLabel(
                    locale("music.search.menu.next", interaction.guildLocale)
                )
        };

        buttons.back.setDisabled(currentPage === 1);
        buttons.next.setDisabled(
            results.length <= currentPage * resultsPerPage
        );

        const primaryRow = new ActionRowBuilder<StringSelectMenuBuilder>({
            components: [menuSongs]
        });

        const secondaryRow = new ActionRowBuilder<ButtonBuilder>({
            components: [buttons.back, buttons.next]
        });

        return { embeds: [embed], components: [primaryRow, secondaryRow] };
    };

    const menuCollector =
        response.resource?.message?.createMessageComponentCollector({
            time: config.componentTimeout,
            componentType: ComponentType.StringSelect,
            filter: i => i.user.id === interaction.user.id
        });

    const buttonCollector =
        response.resource?.message?.createMessageComponentCollector({
            time: config.componentTimeout,
            componentType: ComponentType.Button,
            filter: i => i.user.id === interaction.user.id
        });

    const embedErrorUknown = buildEmbed(interaction, {
        style: "error",
        description: locale("common.error.unknown", interaction.guildLocale)
    });

    if (!menuCollector || !buttonCollector)
        return interaction.editReply({
            embeds: [embedErrorUknown]
        });

    buttonCollector.on("collect", async collectorInteraction => {
        if (collectorInteraction.customId === "back") currentPage--;
        if (collectorInteraction.customId === "next") currentPage++;
        collectorInteraction.update(resultsPayload());
    });

    buttonCollector.on("end", async () => {
        await interaction.editReply(resultsPayload({ expired: true }));
    });

    menuCollector.on("end", async () => {
        await interaction.editReply(resultsPayload({ expired: true }));
    });

    interaction.editReply(resultsPayload());
};
