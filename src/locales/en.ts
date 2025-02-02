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
        help: { description: "Get information about the available commands" }
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
            ws: "WebSocket Latency",
            roundtrip: "Roundtrip Response",
            error: "Could not gather bot's latency data"
        },

        uptime: {
            title: "Uptime",
            value: (uptime: string) =>
                `Nano has been awake for ${f.bold(uptime)}`
        }
    }
};
