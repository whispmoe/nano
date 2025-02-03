import type { Client, ColorResolvable, Locale, PresenceData } from "discord.js";

export interface NanoConfig {
    /**
     * Credentials required by the bot, which may be obtained at the [Discord
     * Developer Portal](https://discord.com/developers/applications)
     */
    credentials: {
        /**
         * The authentication token for the bot, essentially your bot's password
         *
         * You should keep this value private and safe, **otherwise expect bad
         * things to happen!**
         */
        token: string;
        clientID: string;
    };

    /** Configuration values required for bot development or testing */
    dev: {
        /** Wether developer mode will be enabled. If true, commands will be
         * deployed to the specified guild ID instead of global application
         * commands */
        enabled: boolean;

        /** User ID for the bot developer or admin */
        id?: string;

        /** Guild ID for the bot's development or testing server */
        guild?: string;
    };

    /** An object defining paths to be used by the bot */
    paths: { [name: string]: string };

    /** The default or fallback locale to use for the bot */
    defaultLocale: Locale;

    /** The timeout, in ms, interactions for components (such as buttons) will
     * be listened for */
    componentTimeout: number;

    /** The bot's status and presence data */
    presence?: (client: Client) => PresenceData;

    /** An object defining colors which may be used by embeds */
    colors: Record<string, ColorResolvable>;

    /** An object representing the emojis to be used by the bot */
    emojis: { [name: string]: string };

    /** An object representing images to be used by the bot, each image can be
     * either a single URL or an array of URLs */
    img: { [name: string]: string };
}
