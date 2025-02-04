import { Embed } from "@/classes/embed.js";
import { Command } from "@/classes/command.js";

import config from "@/config.js";
import { locale, localeMap } from "@/utils/locale.js";

import {
    inlineCode,
    subtext,
    time,
    TimestampStyles,
    userMention,
    type ChatInputCommandInteraction,
    type EmbedBuilder,
    type User
} from "discord.js";

const user = new Command("user", {
    description: "commands.user.description"
});

user.data.addSubcommand(subcommand =>
    subcommand
        .setName("info")
        .setDescription(locale("commands.user.description"))
        .setDescriptionLocalizations(localeMap("commands.user.description"))
        .addUserOption(option =>
            option
                .setName(locale("commands.user.options.user.name"))
                .setDescription(
                    locale("commands.user.options.user.description")
                )
                .setDescriptionLocalizations(
                    localeMap("commands.user.options.user.description")
                )
        )
);

user.data.addSubcommand(subcommand =>
    subcommand
        .setName("avatar")
        .setDescription(locale("commands.user.subcommands.avatar.description"))
        .setDescriptionLocalizations(
            localeMap("commands.user.subcommands.avatar.description")
        )
        .addUserOption(option =>
            option
                .setName(locale("commands.user.options.user.name"))
                .setDescription(
                    locale("commands.user.options.user.description")
                )
                .setDescriptionLocalizations(
                    localeMap("commands.user.options.user.description")
                )
        )
);

user.data.addSubcommand(subcommand =>
    subcommand
        .setName("banner")
        .setDescription(locale("commands.user.subcommands.banner.description"))
        .setDescriptionLocalizations(
            localeMap("commands.user.subcommands.banner.description")
        )
        .addUserOption(option =>
            option
                .setName(locale("commands.user.options.user.name"))
                .setDescription(
                    locale("commands.user.options.user.description")
                )
                .setDescriptionLocalizations(
                    localeMap("commands.user.options.user.description")
                )
        )
);

user.execute = async interaction => {
    let user =
        interaction.options.getUser(
            locale("commands.user.options.user.name")
        ) ?? interaction.user;

    await interaction.deferReply();
    user = await user.fetch();

    if (interaction.options.getSubcommand() === "info")
        getUserInfo(interaction, user);

    if (interaction.options.getSubcommand() === "avatar")
        getUserAvatar(interaction, user);

    if (interaction.options.getSubcommand() === "banner")
        getUserBanner(interaction, user);
};

const getUserInfo = async (
    interaction: ChatInputCommandInteraction,
    user: User
) => {
    const embeds: Record<string, EmbedBuilder> = {
        userInfo: new Embed(interaction, {
            title:
                `${config.emojis.kamakura} ` +
                locale(
                    "user.info.title",
                    interaction.guildLocale,
                    user.displayName
                ),

            fields: [
                {
                    name: locale(
                        "user.info.globalName",
                        interaction.guildLocale
                    ),

                    value:
                        user.globalName ??
                        subtext(
                            locale(
                                "common.notAvailable",
                                interaction.guildLocale
                            )
                        ),

                    inline: true
                },
                {
                    name: locale("user.info.username", interaction.guildLocale),
                    value: user.username,
                    inline: true
                },
                {
                    name: locale("user.info.date", interaction.guildLocale),
                    value: time(user.createdAt, TimestampStyles.ShortDateTime)
                },
                {
                    name: locale("user.info.id", interaction.guildLocale),
                    value: inlineCode(user.id),
                    inline: true
                }
            ]
        }).data
            .setColor(user.accentColor ?? config.colors.default)
            .setImage(user.bannerURL({ size: 4096 }) ?? null)
            .setThumbnail(user.avatarURL())
    };

    interaction.editReply({ embeds: [embeds.userInfo] });
};

const getUserAvatar = async (
    interaction: ChatInputCommandInteraction,
    user: User
) => {
    const userAvatar = user.avatarURL({ size: 4096 }) ?? null;
    const embeds: Record<string, EmbedBuilder> = {
        userAvatar: new Embed(interaction, {
            title:
                `${config.emojis.nanoKey} ` +
                locale(
                    "user.avatar.title",
                    interaction.guildLocale,
                    user.globalName
                )
        }).data
            .setColor(user.accentColor ?? config.colors.default)
            .setImage(userAvatar),

        error: new Embed(interaction, {
            ...Embed.error,
            title:
                `${config.emojis.nanoKey} ` +
                locale("common.error.default", interaction.guildLocale),

            description: locale(
                "user.avatar.notAvailable",
                interaction.guildLocale,
                userMention(user.id)
            )
        }).data
    };

    if (!userAvatar) return interaction.editReply({ embeds: [embeds.error] });
    interaction.editReply({ embeds: [embeds.userAvatar] });
};

const getUserBanner = async (
    interaction: ChatInputCommandInteraction,
    user: User
) => {
    const userBanner = user.bannerURL({ size: 4096 }) ?? null;
    const embeds: Record<string, EmbedBuilder> = {
        userBanner: new Embed(interaction, {
            title:
                `${config.emojis.nanoKey} ` +
                locale(
                    "user.banner.title",
                    interaction.guildLocale,
                    user.globalName
                )
        }).data
            .setColor(user.accentColor ?? config.colors.default)
            .setImage(userBanner),

        error: new Embed(interaction, {
            ...Embed.error,
            title:
                `${config.emojis.nanoKey} ` +
                locale("common.error.default", interaction.guildLocale),

            description: locale(
                "user.banner.notAvailable",
                interaction.guildLocale,
                userMention(user.id)
            )
        }).data
    };

    if (!userBanner) return interaction.editReply({ embeds: [embeds.error] });
    interaction.editReply({ embeds: [embeds.userBanner] });
};

export default user;
