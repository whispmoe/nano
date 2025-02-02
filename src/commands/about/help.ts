import config from "@/config.js";
import { locale } from "@/utils/messages/locale.js";
import { f } from "@/utils/messages/formatting.js";
import { buildCommand } from "@/utils/builders/buildCommand.js";

import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    ComponentType,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    type APIEmbedField,
    type RestOrArray
} from "discord.js";
import { getCommandID } from "@/utils/getCommandID.js";
import { buildEmbed } from "@/utils/builders/buildEmbed.js";

const getCategoryName = (
    interaction: ChatInputCommandInteraction,
    category: Category
) =>
    category.name[interaction.guildLocale ?? config.defaultLocale] ??
    category.id;

const getCategoryDescription = (
    interaction: ChatInputCommandInteraction,
    category: Category
) =>
    category.description[interaction.guildLocale ?? config.defaultLocale] ??
    locale("help.category.noDescription", interaction.guildLocale);

export default buildCommand(
    { name: "help", description: "commands.help.description" },
    async interaction => {
        let selection: string;

        const embedDefaultHelp = buildEmbed(interaction, {
            style: "default",
            title:
                `${config.emojis.kamakura} ` +
                locale("bot.fullName", interaction.guildLocale),

            description: `${locale(
                "help.intro",
                interaction.guildLocale,
                locale("bot.fullName", interaction.guildLocale)
            )}\n${f.small(locale("help.usage", interaction.guildLocale))}`
        }).setThumbnail(interaction.client.user.avatarURL());

        const categoryMenu = new StringSelectMenuBuilder()
            .setCustomId("category")
            .setPlaceholder(
                locale("help.category.select", interaction.guildLocale)
            );

        interaction.client.categories.forEach(category => {
            if (category.commands.size <= 0) return;

            embedDefaultHelp.addFields({
                name: `${category.emoji} ${getCategoryName(interaction, category)}`,
                value: getCategoryDescription(interaction, category),
                inline: true
            });

            categoryMenu.addOptions(
                new StringSelectMenuOptionBuilder()
                    .setValue(category.id)
                    .setEmoji(category.emoji)
                    .setDefault(selection === category.id)
                    .setLabel(getCategoryName(interaction, category))
                    .setDescription(
                        getCategoryDescription(interaction, category)
                    )
            );
        });

        const componentsRow = new ActionRowBuilder<StringSelectMenuBuilder>({
            components: [categoryMenu]
        });

        const response = await interaction.reply({
            withResponse: true,
            embeds: [embedDefaultHelp],
            components: [componentsRow]
        });

        const collector =
            response.resource?.message?.createMessageComponentCollector({
                time: config.componentTimeout,
                componentType: ComponentType.StringSelect,
                filter: i => i.user.id === interaction.user.id
            });

        if (!collector) return;
        collector.on("collect", async collectorInteraction => {
            collector.resetTimer();
            selection = collectorInteraction.values[0];
            const selectedOption = categoryMenu.options.find(
                option => option.data.value === selection
            );

            categoryMenu.options.forEach(option => option.setDefault(false));
            if (selectedOption) selectedOption.setDefault(true);

            return await collectorInteraction.update({
                embeds: [await getCategoryHelp(interaction, selection)],
                components: [componentsRow]
            });
        });

        collector.on("end", async () => {
            const isCategorySelected = categoryMenu.options.some(
                option => option.data.value === selection
            );

            const embedCategoryHelp = await getCategoryHelp(
                interaction,
                selection
            );

            const currentEmbed = isCategorySelected
                ? embedCategoryHelp.setDescription(
                      f.small(locale("common.expired", interaction.guildLocale))
                  )
                : embedDefaultHelp.setDescription(
                      `${locale(
                          "help.intro",
                          interaction.guildLocale,
                          locale("bot.fullName", interaction.guildLocale)
                      )}\n${f.small(locale("common.expired", interaction.guildLocale))}`
                  );

            interaction.editReply({
                embeds: [currentEmbed],
                components: []
            });
        });
    }
);

const getCategoryHelp = async (
    interaction: ChatInputCommandInteraction,
    selection: string
) => {
    const selectedCategory = interaction.client.categories.get(selection);

    if (!selectedCategory)
        return buildEmbed(interaction, {
            style: "error",
            description: locale(
                "help.category.notExists",
                interaction.guildLocale
            )
        });

    const commandFields: RestOrArray<APIEmbedField> = await Promise.all(
        selectedCategory.commands.map(
            async (command): Promise<APIEmbedField> => {
                const id = getCommandID(interaction, command.data.name);
                const name = f.command(command.data.name, await id);

                const descriptionLocalizations =
                    command.data.description_localizations;

                const descriptionLocale =
                    interaction.guildLocale ?? config.defaultLocale;

                let value =
                    descriptionLocalizations &&
                    descriptionLocalizations[descriptionLocale]
                        ? descriptionLocalizations[descriptionLocale]
                        : command.data.description;

                return { name, value, inline: true };
            }
        )
    );

    return buildEmbed(interaction, {
        style: "default",
        title:
            `${selectedCategory.emoji} ` +
            getCategoryName(interaction, selectedCategory),

        description: f.small(
            getCategoryDescription(interaction, selectedCategory)
        ),

        fields: commandFields
    }).setThumbnail(interaction.client.user.avatarURL());
};
