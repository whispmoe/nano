import config from "@/config.js";

import { Embed } from "@/classes/embed.js";
import { Command } from "@/classes/command.js";

import { locale } from "@/utils/locale.js";
import { getCommandID } from "@/utils/getCommandID.js";

import {
    ActionRowBuilder,
    chatInputApplicationCommandMention,
    ChatInputCommandInteraction,
    ComponentType,
    EmbedBuilder,
    inlineCode,
    Locale,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    subtext,
    type APIEmbedField
} from "discord.js";

const help = new Command("help", {
    description: "commands.help.description"
});

help.execute = async interaction => {
    const embeds: Record<string, EmbedBuilder> = {
        defaultHelp: new Embed(interaction, {
            title:
                `${config.emojis.nanoKey} ` +
                locale("bot.fullName", interaction.guildLocale),

            description: `${locale(
                "help.intro",
                interaction.guildLocale,
                locale("bot.fullName", interaction.guildLocale)
            )}\n${subtext(locale("help.usage", interaction.guildLocale))}`
        }).data.setThumbnail(interaction.client.user.avatarURL())
    };

    let selectedCategory: string;
    const effectiveLocale = interaction.guildLocale ?? config.defaultLocale;

    const categoryMenu = new StringSelectMenuBuilder()
        .setCustomId("category")
        .setPlaceholder(
            locale("help.category.select", interaction.guildLocale)
        );

    interaction.client.categories.forEach(category => {
        if (category.commands.size <= 0) return;
        embeds.defaultHelp.addFields({
            name:
                `${category.emoji} ` +
                getCategoryName(effectiveLocale, category),

            value: getCategoryDescription(effectiveLocale, category),
            inline: true
        });

        categoryMenu.addOptions(
            new StringSelectMenuOptionBuilder()
                .setValue(category.id)
                .setEmoji(category.emoji)
                .setDefault(selectedCategory === category.id)
                .setLabel(getCategoryName(effectiveLocale, category))
                .setDescription(
                    getCategoryDescription(effectiveLocale, category)
                )
        );
    });

    const componentsRow = new ActionRowBuilder<StringSelectMenuBuilder>({
        components: [categoryMenu]
    });

    const response = await interaction.reply({
        withResponse: true,
        embeds: [embeds.defaultHelp],
        components: [componentsRow]
    });

    const collector =
        response.resource?.message?.createMessageComponentCollector({
            time: config.componentTimeout,
            componentType: ComponentType.StringSelect,
            filter: i => i.user.id === interaction.user.id
        });

    if (!collector) return response.resource?.message?.edit({ components: [] });

    collector.on("collect", async collectorInteraction => {
        collector.resetTimer();
        selectedCategory = collectorInteraction.values[0];

        const selectedOption = categoryMenu.options.find(
            option => option.data.value === selectedCategory
        );

        categoryMenu.options.forEach(option => option.setDefault(false));
        if (selectedOption) selectedOption.setDefault(true);

        collectorInteraction.update({
            embeds: [
                await getCategoryHelp(
                    interaction,
                    selectedCategory,
                    effectiveLocale
                )
            ],
            components: [componentsRow]
        });
    });

    collector.on("end", async () => {
        const isCategorySelected = categoryMenu.options.some(
            option => option.data.value === selectedCategory
        );

        let currentEmbed: EmbedBuilder;
        if (isCategorySelected) {
            const categoryHelp = await getCategoryHelp(
                interaction,
                selectedCategory,
                effectiveLocale
            );

            currentEmbed = categoryHelp.setDescription(
                subtext(locale("common.expired", interaction.guildLocale))
            );
        } else {
            currentEmbed = embeds.defaultHelp.setDescription(
                `${locale(
                    "help.intro",
                    interaction.guildLocale,
                    locale("bot.fullName", interaction.guildLocale)
                )}\n${subtext(locale("common.expired", interaction.guildLocale))}`
            );
        }

        interaction.editReply({
            embeds: [currentEmbed],
            components: []
        });
    });
};

const getCategoryName = (loc: Locale, category: BotCategory) =>
    category.name[loc] ?? category.id;

const getCategoryDescription = (loc: Locale, category: BotCategory) =>
    category.description[loc] ?? locale("help.category.noDescription", loc);

const getCategoryHelp = async (
    interaction: ChatInputCommandInteraction,
    selection: string,
    loc: Locale
): Promise<EmbedBuilder> => {
    const selectedCategory = interaction.client.categories.get(selection);
    if (!selectedCategory)
        return new Embed(interaction, {
            ...Embed.error,
            description: locale(
                "help.category.notExists",
                interaction.guildLocale
            )
        }).data;

    const fields: APIEmbedField[] = await Promise.all(
        selectedCategory.commands.map(
            async (command): Promise<APIEmbedField> => {
                const id = await getCommandID(interaction, command.data.name);

                const name = id
                    ? chatInputApplicationCommandMention(command.data.name, id)
                    : inlineCode(`/${command.data.name}`);

                const descriptionLocalizations =
                    command.data.description_localizations;

                const value =
                    descriptionLocalizations && descriptionLocalizations[loc]
                        ? descriptionLocalizations[loc]
                        : command.data.description;

                return { name, value, inline: true };
            }
        )
    );

    return new Embed(interaction, {
        fields,
        title:
            `${selectedCategory.emoji} ` +
            getCategoryName(loc, selectedCategory),
        description: subtext(getCategoryDescription(loc, selectedCategory))
    }).data.setThumbnail(interaction.client.user.avatarURL());
};

export default help;
