import type { EmbedsObject } from "@/types/embedsObject.js";

import config from "@/config.js";

import { Embed } from "@/classes/embed.js";

import { navigationRow } from "@/utils/navigationRow.js";
import { locale, type LocaleKey } from "@/utils/locale.js";

import {
    AniListMediaListStatuses,
    searchUsers,
    type AniListMediaListStatus
} from "@/commands/utility/anilist/api/user.js";

import {
    getLatestActivity,
    type AniListListActivity
} from "@/commands/utility/anilist/api/activity.js";

import {
    ActionRowBuilder,
    blockQuote,
    bold,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    hyperlink,
    inlineCode,
    quote,
    subtext,
    time,
    TimestampStyles,
    unorderedList,
    type APIEmbedField,
    type ChatInputCommandInteraction
} from "discord.js";

// TODO: get user favorite characters count and the first 3 of them

export const searchUser = async (interaction: ChatInputCommandInteraction) => {
    const embeds: EmbedsObject = {
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

    const user = interaction.options.getString(
        locale("commands.anilist.subcommands.user.options.user.name")
    );

    if (!user) return interaction.reply({ embeds: [embeds.invalidSearch] });
    const reply = await interaction.deferReply({ withResponse: true });
    const results = await searchUsers(user);

    if (!results)
        return interaction.editReply({ embeds: [embeds.failedSearch] });

    if (!results?.length)
        return interaction.editReply({ embeds: [embeds.noResults] });

    let currentPage = 1;
    let currentUser = results[currentPage - 1];

    const formatActivity = (
        activity?: AniListListActivity | null
    ): APIEmbedField => {
        const name = locale(
            "anilist.user.latestActivity",
            interaction.guildLocale
        );

        if (
            !activity ||
            !activity.status ||
            !activity.progress ||
            !activity.media?.title?.romaji
        ) {
            return {
                name,
                value: subtext(
                    quote(
                        locale(
                            "anilist.user.noActivity",
                            interaction.guildLocale
                        )
                    )
                )
            };
        }

        const timestamp = subtext(
            time(activity.createdAt, TimestampStyles.RelativeTime)
        );

        const interactions = inlineCode(
            `️❤️ ${activity.likeCount} 💬 ${activity.replyCount}`
        );

        const title = activity.media?.siteUrl
            ? bold(
                  hyperlink(activity.media.title.romaji, activity.media.siteUrl)
              )
            : bold(activity.media?.title?.romaji);

        const status = activity.siteUrl
            ? hyperlink(
                  `${activity.status} ${activity.progress}`,
                  activity.siteUrl
              )
            : `${activity.status} ${activity.progress}`;

        const fields = [timestamp, title, status, interactions];
        return { name, value: blockQuote(fields.join("\n")) };
    };

    const getUserEmbed = async () => {
        const { avatar, bannerImage, name, statistics } = currentUser;
        const userEmbed = new Embed(interaction, {
            title: `${config.emojis.nanoKey} ${name}`
        }).data
            .setImage(bannerImage)
            .setThumbnail(avatar?.medium ?? null);

        const userActivity = await getLatestActivity(currentUser.id);
        userEmbed.addFields(formatActivity(userActivity));

        type StatisticType = "anime" | "manga";

        const statusLocales: Record<
            AniListMediaListStatus,
            (type?: StatisticType) => LocaleKey
        > = {
            COMPLETED: _ => "anilist.list.statuses.finished",
            CURRENT: type =>
                type === "manga"
                    ? "anilist.list.statuses.reading"
                    : "anilist.list.statuses.watching",

            DROPPED: _ => "anilist.list.statuses.dropped",
            PAUSED: _ => "anilist.list.statuses.hold",
            PLANNING: _ => "anilist.list.statuses.planning",

            REPEATING: type =>
                type === "manga"
                    ? "anilist.list.statuses.rereading"
                    : "anilist.list.statuses.rewatching"
        };

        const stats: Record<
            StatisticType,
            Record<AniListMediaListStatus, number>
        > = {
            anime: Object.fromEntries(
                AniListMediaListStatuses.map(status => [status, 0])
            ) as Record<AniListMediaListStatus, number>,

            manga: Object.fromEntries(
                AniListMediaListStatuses.map(status => [status, 0])
            ) as Record<AniListMediaListStatus, number>
        };

        (["anime", "manga"] as const).forEach(type => {
            statistics?.[type]?.statuses?.forEach(listStatus => {
                listStatus.status &&
                    (stats[type][listStatus.status] += listStatus.count);
            });
        });

        const formatStats = (
            stats: Record<AniListMediaListStatus, number>,
            type: StatisticType
        ) =>
            unorderedList(
                AniListMediaListStatuses.map(
                    status =>
                        `${bold(
                            locale(
                                statusLocales[status](type),
                                interaction.guildLocale
                            )
                        )} ~ ${stats[status].toString()}`
                )
            );

        userEmbed.addFields([
            {
                name: locale(
                    "anilist.user.stats.anime",
                    interaction.guildLocale
                ),

                value: formatStats(stats.anime, "anime"),
                inline: true
            },
            {
                name: locale(
                    "anilist.user.stats.manga",
                    interaction.guildLocale
                ),

                value: formatStats(stats.manga, "manga"),
                inline: true
            }
        ]);

        return userEmbed;
    };

    const linksRow = new ActionRowBuilder<ButtonBuilder>();
    if (currentUser.siteUrl)
        linksRow.addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL(currentUser.siteUrl)
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
        return interaction.editReply({ embeds: [await getUserEmbed()] });

    collector.on("end", () =>
        interaction.editReply({ components: [linksRow] })
    );

    collector.on("collect", async collectorInteraction => {
        collector.resetTimer();

        if (collectorInteraction.customId === "close")
            reply.resource?.message?.delete();

        if (collectorInteraction.customId === "next") currentPage++;
        if (collectorInteraction.customId === "back") currentPage--;
        currentUser = results[currentPage - 1];

        collectorInteraction.update({
            embeds: [await getUserEmbed()],
            components: [linksRow, navigationRow(currentPage, results.length)]
        });
    });

    interaction.editReply({
        embeds: [await getUserEmbed()],
        components: [linksRow, navigationRow(currentPage, results.length)]
    });
};
