import type { EmbedsObject } from "@/types/embedsObject.js";

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

const getUserInfo = async (
    interaction: ChatInputCommandInteraction,
    user: User
) => {
    const reply = await interaction.deferReply();

    const embeds: EmbedsObject = {
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
                                "general.notAvailable",
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

    reply.edit({ embeds: [embeds.userInfo] });
};

const getUserAvatar = async (
    interaction: ChatInputCommandInteraction,
    user: User
) => {
    const reply = await interaction.deferReply();
    const userAvatar = user.avatarURL({ size: 4096 }) ?? null;

    const embeds: EmbedsObject = {
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
                locale("error.default", interaction.guildLocale),

            description: locale(
                "user.avatar.notAvailable",
                interaction.guildLocale,
                userMention(user.id)
            )
        }).data
    };

    if (!userAvatar) return reply.edit({ embeds: [embeds.error] });
    reply.edit({ embeds: [embeds.userAvatar] });
};

const getUserBanner = async (
    interaction: ChatInputCommandInteraction,
    user: User
) => {
    const reply = await interaction.deferReply();
    const userBanner = user.bannerURL({ size: 4096 }) ?? null;

    const embeds: EmbedsObject = {
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
                locale("error.default", interaction.guildLocale),

            description: locale(
                "user.banner.notAvailable",
                interaction.guildLocale,
                userMention(user.id)
            )
        }).data
    };

    if (!userBanner) return reply.edit({ embeds: [embeds.error] });
    reply.edit({ embeds: [embeds.userBanner] });
};

user.execute = async interaction => {
    let user =
        interaction.options.getUser(
            locale("commands.user.options.user.name")
        ) ?? interaction.user;

    user = await user.fetch();
    switch (interaction.options.getSubcommand()) {
        case "info":
            await getUserInfo(interaction, user);
            break;

        case "avatar":
            await getUserAvatar(interaction, user);
            break;

        case "banner":
            await getUserBanner(interaction, user);
            break;
    }
};

export default user;
