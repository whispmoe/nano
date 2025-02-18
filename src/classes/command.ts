import { locale, localeMap, type LocaleKey } from "@/utils/locale.js";

import {
    InteractionContextType,
    SlashCommandBuilder,
    type ChatInputCommandInteraction,
    type PermissionResolvable
} from "discord.js";

interface CommandProperties {
    /** A locale key that will be used as the command description. The
     * localization map for it will be dynamically assigned */
    description: LocaleKey;

    /** Wether this command will only be deployed to the development guild */
    private?: boolean;

    /** The permissions required to run this command */
    permissions?: PermissionResolvable;

    /** What context this command can be executed in */
    context?: InteractionContextType;
}

export class Command {
    constructor(name: string, data: CommandProperties) {
        this.data.setName(name);
        this.data.setDescription(locale(data.description));
        this.data.setDescriptionLocalizations(localeMap(data.description));
        this.permissions = data.permissions ?? [];
        this.private = data.private ?? false;
        this.context = data.context;
    }

    data = new SlashCommandBuilder();
    context: InteractionContextType | undefined;
    permissions: PermissionResolvable;
    private: boolean;

    execute: (interaction: ChatInputCommandInteraction) => Promise<unknown> =
        async () => {};
}
