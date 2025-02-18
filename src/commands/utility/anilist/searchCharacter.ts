import config from "@/config.js";

import { Embed } from "@/classes/embed.js";

import { locale } from "@/utils/locale.js";
import { navigationRow } from "@/utils/navigationRow.js";

import { searchCharacters } from "@/commands/utility/anilist/api/characters.js";
import { anilistMarkdownParser } from "@/commands/utility/anilist/utils.js";

import {
    ActionRowBuilder,
    bold,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    hyperlink,
    italic,
    time,
    TimestampStyles,
    type ChatInputCommandInteraction,
    type EmbedBuilder
} from "discord.js";

export const searchCharacter = async (
    interaction: ChatInputCommandInteraction
) => {
    const embeds: Record<string, EmbedBuilder> = {
        invalidSearch: new Embed(interaction, {
            ...Embed.error,
            description: locale(
                "anilist.error.invalidSearch",
                interaction.guildLocale
            )
        }).data,

        failedSearch: new Embed(interaction, {
            ...Embed.error,
            description: locale(
                "anilist.error.failedSearch",
                interaction.guildLocale
            )
        }).data,

        noResults: new Embed(interaction, {
            ...Embed.error,
            description: locale(
                "anilist.error.noResults",
                interaction.guildLocale
            )
        }).data
    };

    const character = interaction.options.getString(
        locale("commands.anilist.subcommands.character.options.character.name")
    );

    if (!character)
        return interaction.reply({ embeds: [embeds.invalidSearch] });

    const reply = await interaction.deferReply({ withResponse: true });
    const results = await searchCharacters(character);

    if (!results)
        return interaction.editReply({ embeds: [embeds.failedSearch] });

    if (!results?.length)
        return interaction.editReply({ embeds: [embeds.noResults] });

    let currentPage = 1;
    let currentCharacter = results[currentPage - 1];

    const getCharacterEmbed = () => {
        const {
            age,
            dateOfBirth,
            description,
            favourites,
            image,
            media,
            name
        } = currentCharacter;

        const characterEmbed = new Embed(interaction, {
            title: `${config.emojis.nanoKey} ${name?.full}`
        }).data
            .setImage(image?.large ?? null)
            .setDescription(description && anilistMarkdownParser(description));

        const alternativeNames: string[] = [];
        name?.native && alternativeNames.push(name.native);
        name?.alternative?.forEach(name => name && alternativeNames.push(name));

        alternativeNames.length &&
            characterEmbed.addFields({
                name: locale(
                    "anilist.character.alternativeNames",
                    interaction.guildLocale
                ),

                value: italic(alternativeNames.join(", ")),
                inline: true
            });

        age &&
            characterEmbed.addFields({
                name: locale("anilist.character.age", interaction.guildLocale),
                value: age,
                inline: true
            });

        const getBirthdayTimestamp = () => {
            if (!dateOfBirth || !dateOfBirth.day || !dateOfBirth.month)
                return null;

            const { day, month, year } = dateOfBirth;
            const localizedMonth = new Intl.DateTimeFormat(
                interaction.guildLocale ?? config.defaultLocale,
                { month: "long" }
            ).format(new Date(0, month - 1));

            if (year)
                return time(
                    Date.UTC(year, month - 1, day),
                    TimestampStyles.LongDate
                );

            return `${day} ${localizedMonth}`;
        };

        const birthday = getBirthdayTimestamp();

        birthday &&
            characterEmbed.addFields({
                name: locale(
                    "anilist.character.birthday",
                    interaction.guildLocale
                ),

                value: birthday,
                inline: true
            });

        favourites &&
            characterEmbed.addFields({
                name: locale(
                    "anilist.character.favorites",
                    interaction.guildLocale
                ),

                value: `${bold(favourites.toString())} ${locale(
                    "anilist.character.favorites",
                    interaction.guildLocale
                ).toLowerCase()}`,

                inline: true
            });

        const getRelatedMedia = () => {
            const mediaLimit = 3;
            let relatedMedia = media?.nodes?.filter(
                media => media.title?.romaji
            );

            if (!relatedMedia) return null;

            let formattedMedia = relatedMedia.map(media =>
                media.siteUrl
                    ? hyperlink(media.title?.romaji!, media.siteUrl)
                    : media.title?.romaji!
            );

            const remainingCount = formattedMedia.length - mediaLimit;

            if (formattedMedia.length < 3 || remainingCount === 0)
                return `${formattedMedia.join(", ")}`;

            formattedMedia = formattedMedia.slice(0, mediaLimit);

            return locale(
                "anilist.character.related.summary",
                interaction.guildLocale,
                formattedMedia.join(", "),
                remainingCount
            );
        };

        const relatedMedia = getRelatedMedia();

        relatedMedia &&
            characterEmbed.addFields({
                name: locale(
                    "anilist.character.related.title",
                    interaction.guildLocale
                ),

                value: relatedMedia
            });

        return characterEmbed;
    };

    const linksRow = new ActionRowBuilder<ButtonBuilder>();
    if (currentCharacter.siteUrl)
        linksRow.setComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL(currentCharacter.siteUrl)
                .setLabel(
                    locale("anilist.viewOnAniList", interaction.guildLocale)
                )
        );

    const collector = reply.resource?.message?.createMessageComponentCollector({
        filter: i => i.user.id === interaction.user.id,
        componentType: ComponentType.Button,
        time: config.componentTimeout
    });

    if (!collector)
        return interaction.editReply({ embeds: [getCharacterEmbed()] });

    collector.on("end", () =>
        interaction.editReply({ components: [linksRow] })
    );

    collector.on("collect", collectorInteraction => {
        collector.resetTimer();

        if (collectorInteraction.customId === "close")
            reply.resource?.message?.delete();

        if (collectorInteraction.customId === "next") currentPage++;
        if (collectorInteraction.customId === "back") currentPage--;
        currentCharacter = results[currentPage - 1];

        if (currentCharacter.siteUrl)
            linksRow.setComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setURL(currentCharacter.siteUrl)
                    .setLabel(
                        locale("anilist.viewOnAniList", interaction.guildLocale)
                    )
            );

        collectorInteraction.update({
            embeds: [getCharacterEmbed()],
            components: [linksRow, navigationRow(currentPage, results.length)]
        });
    });

    interaction.editReply({
        embeds: [getCharacterEmbed()],
        components: [linksRow, navigationRow(currentPage, results.length)]
    });
};
