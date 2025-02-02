import { locale, localeMap, type LocaleKey } from "@/utils/messages/locale.js";

import {
    ChatInputCommandInteraction,
    InteractionContextType,
    SlashCommandBooleanOption,
    SlashCommandBuilder,
    SlashCommandStringOption,
    type PermissionResolvable
} from "discord.js";

/* these are not exhaustive or complete, and are made to only meet the
requirements by the bot commands. as the bot grows, these types will be modified
to allow for more properties and option types */

type BaseOption = {
    name: LocaleKey;
    description: LocaleKey;
    required?: boolean;
};

type StringOption = BaseOption & { type: "string" };
type BooleanOption = BaseOption & { type: "boolean" };
type CommandOption = StringOption | BooleanOption;

type ValidContext = InteractionContextType.BotDM | InteractionContextType.Guild;
interface CommandProperties {
    name: string;
    description: LocaleKey;
    options?: CommandOption[];
    permissions?: PermissionResolvable;
    context?: ValidContext;
    private?: boolean;
}

export const buildCommand = (
    prop: CommandProperties,
    execute: (interaction: ChatInputCommandInteraction) => Promise<unknown>
) => {
    const data = new SlashCommandBuilder()
        .setName(prop.name)
        .setDescription(locale(prop.description))
        .setDescriptionLocalizations(localeMap(prop.description));

    const command = {
        data,
        execute,
        private: prop.private,
        permissions: prop.permissions,
        context: prop.context
    };

    if (!prop.options) return command;

    prop.options.forEach(opt => {
        switch (opt.type) {
            case "string":
                data.addStringOption(
                    new SlashCommandStringOption()
                        .setRequired(opt.required ?? false)
                        .setName(locale(opt.name))
                        .setNameLocalizations(localeMap(opt.name))
                        .setDescription(locale(opt.description))
                        .setDescriptionLocalizations(localeMap(opt.description))
                );

                break;

            case "boolean":
                data.addBooleanOption(
                    new SlashCommandBooleanOption()
                        .setRequired(opt.required ?? false)
                        .setName(locale(opt.name))
                        .setNameLocalizations(localeMap(opt.name))
                        .setDescription(locale(opt.description))
                        .setDescriptionLocalizations(localeMap(opt.description))
                );

                break;
        }
    });

    return command;
};
