import { f } from "@/utils/messages/formatting.js";

export const en = {
    bot: {
        shortName: "Nano",
        fullName: "Nano Shinonome",
        description: "I am a robot. I live with the doctor who created me"
    },

    common: {
        servers: "Servers",
        expired: "This command has expired",

        error: {
            default: "Something went wrong...",
            insufficientPermissions:
                "You don't have enough permissions to use this command!",

            scope: {
                guild: "This command can only be used in a server!",
                dm: "This command can only be used in a DM!"
            }
        }
    },

    categories: {
        utility: {
            name: "Utility",
            description: "Commands that may be useful"
        },

        about: {
            name: "About",
            description: "Get more information about me"
        },

        music: {
            name: "Music",
            description: "Let nano play music for you"
        }
    },

    commands: {
        say: {
            description: "Let Nano say something for you",
            options: {
                message: {
                    name: "message",
                    description: "The message you want Nano to repeat for you"
                }
            }
        },

        status: { description: "Returns the bot status to ensure its running" },
        help: { description: "Get information about the available commands" },
        join: { description: "Ask Nano to join your current voice channel" }
    },

    say: { invalidMessage: "The specified message is not valid" },

    help: {
        intro: (name: string) =>
            `Hello, I'm ${f.bold(`${name}!`)} ${en.bot.description}`,

        usage: "To get started, select a command category from the menu below",

        category: {
            select: "Select a category",
            notExists: "The selected category does not exist!",
            noDescription: "This category does not have a description"
        }
    },

    status: {
        title: "Bot status",
        pinging: "Pinging...",

        latency: {
            api: "API latency",
            bot: "Bot latency",
            error: "Could not gather bot's latency data"
        },

        uptime: {
            title: "Uptime",
            value: (uptime: string) =>
                `Nano has been awake for ${f.bold(uptime)}`
        }
    },

    voice: {
        couldNotJoin: "Could not join your voice channel!",
        notInVoice: "You are currently not in a voice channel!",
        alreadyInVoice: "I am already connected to a voice channel!"
    }
};
