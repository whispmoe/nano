import config from "@/config.js";

import { Embed } from "@/classes/embed.js";
import { navigationRow } from "@/utils/navigationRow.js";
import { locale, type LocaleKey } from "@/utils/locale.js";

import {
    searchMedia,
    type AniListMediaStatus,
    type AniListSeason
} from "@/commands/utility/anilist/api/media.js";
import { trailerVideoURL } from "@/commands/utility/anilist/utils.js";

import {
    ActionRowBuilder,
    bold,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    italic,
    subtext,
    type ChatInputCommandInteraction,
    type ColorResolvable,
    type EmbedBuilder
} from "discord.js";

export const searchAnime = async (interaction: ChatInputCommandInteraction) => {
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

    const anime = interaction.options.getString(
        locale("commands.anilist.subcommands.anime.options.anime.name")
    );

    if (!anime) return interaction.reply({ embeds: [embeds.invalidSearch] });
    const reply = await interaction.deferReply({ withResponse: true });
    const results = await searchMedia(anime, "ANIME");

    if (!results)
        return interaction.editReply({ embeds: [embeds.failedSearch] });

    if (!results?.length)
        return interaction.editReply({ embeds: [embeds.noResults] });

    let currentPage = 1;
    let currentAnime = results[currentPage - 1];

    const getAnimeEmbed = () => {
        const {
            averageScore,
            bannerImage,
            coverImage,
            episodes,
            genres,
            rankings,
            season,
            seasonYear,
            status,
            title
        } = currentAnime;

        const animeEmbed = new Embed(interaction, {
            title: `${config.emojis.nanoKey} ` + title?.romaji
        }).data
            .setThumbnail(coverImage?.medium ?? null)
            .setImage(bannerImage);

        animeEmbed.setColor(
            (coverImage?.color ?? config.colors.default) as ColorResolvable
        );

        title?.english &&
            animeEmbed.setDescription(subtext(italic(title.english)));

        if (seasonYear && season) {
            const seasonLocales: Record<AniListSeason, LocaleKey> = {
                FALL: "anilist.anime.season.fall",
                SPRING: "anilist.anime.season.spring",
                SUMMER: "anilist.anime.season.summer",
                WINTER: "anilist.anime.season.winter"
            };

            const releaseSeason =
                locale(seasonLocales[season], interaction.guildLocale) +
                ` ${seasonYear}`;

            animeEmbed.addFields({
                name: locale("anilist.anime.released", interaction.guildLocale),
                value: releaseSeason,
                inline: true
            });
        }

        if (status) {
            const statusLocales: Record<AniListMediaStatus, LocaleKey> = {
                CANCELLED: "anilist.anime.statuses.cancelled",
                FINISHED: "anilist.anime.statuses.finished",
                HIATUS: "anilist.anime.statuses.hiatus",
                NOT_YET_RELEASED: "anilist.anime.statuses.notReleasedYet",
                RELEASING: "anilist.anime.statuses.releasing"
            };

            animeEmbed.addFields({
                name: locale("anilist.anime.status", interaction.guildLocale),
                value: locale(statusLocales[status], interaction.guildLocale),
                inline: true
            });
        }

        if (episodes && episodes > 1)
            animeEmbed.addFields({
                name: locale(
                    "anilist.anime.totalEpisodes",
                    interaction.guildLocale
                ),

                value: `${episodes} ${locale(
                    "anilist.anime.episodes",
                    interaction.guildLocale
                )}`,

                inline: true
            });

        const rankAllTime = rankings?.find(
            rank => rank.allTime && rank.type === "RATED"
        );

        if (averageScore && rankAllTime)
            animeEmbed.addFields({
                name: locale(
                    "anilist.anime.averageScore",
                    interaction.guildLocale
                ),

                value:
                    bold(`${averageScore}%`) +
                    " ~ " +
                    italic(
                        locale(
                            "anilist.anime.rankedAllTime",
                            interaction.guildLocale,
                            rankAllTime.rank
                        )
                    )
            });

        if (genres && genres.length > 0)
            animeEmbed.addFields({
                name: locale("anilist.anime.genres", interaction.guildLocale),
                value: italic(genres.join(", "))
            });

        return animeEmbed;
    };

    const linksRow = new ActionRowBuilder<ButtonBuilder>();
    const videoURL = trailerVideoURL(currentAnime.trailer);

    if (currentAnime.siteUrl)
        linksRow.addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL(currentAnime.siteUrl)
                .setLabel(
                    locale("anilist.viewOnAniList", interaction.guildLocale)
                )
        );

    if (videoURL)
        linksRow.addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL(videoURL)
                .setLabel(
                    locale("anilist.anime.trailer", interaction.guildLocale)
                )
        );

    const collector = reply.resource?.message?.createMessageComponentCollector({
        filter: i => i.user.id === interaction.user.id,
        componentType: ComponentType.Button,
        time: config.componentTimeout
    });

    if (!collector) return interaction.editReply({ embeds: [getAnimeEmbed()] });

    collector.on("end", () =>
        interaction.editReply({ components: [linksRow] })
    );

    collector.on("collect", collectorInteraction => {
        collector.resetTimer();

        if (collectorInteraction.customId === "close")
            reply.resource?.message?.delete();

        if (collectorInteraction.customId === "next") currentPage++;
        if (collectorInteraction.customId === "back") currentPage--;
        currentAnime = results[currentPage - 1];

        collectorInteraction.update({
            embeds: [getAnimeEmbed()],
            components: [linksRow, navigationRow(currentPage, results.length)]
        });
    });

    interaction.editReply({
        embeds: [getAnimeEmbed()],
        components: [linksRow, navigationRow(currentPage, results.length)]
    });
};
