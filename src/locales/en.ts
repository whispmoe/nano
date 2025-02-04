import { bold, inlineCode } from "discord.js";

export const en = {
    bot: {
        shortName: "Nano",
        fullName: "Nano Shinonome",
        description: "I am a robot. I live with the doctor who created me"
    },

    common: {
        servers: "Servers",
        expired: "This command has expired",
        notAvailable: "Not available",

        error: {
            default: "Something went wrong...",
            unknown: "An unknown error occurred!",
            interactionFailed: "Something went wrong during this interaction!",

            insufficientPermissions:
                "You don't have enough permissions to use this command!",

            commandNotFound: (command: string) =>
                `Command ${inlineCode(`/${command}`)} was not found!`,

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
        help: { description: "Get information about the available commands" },
        user: {
            description: "Get information about an user",

            subcommands: {
                avatar: { description: "Get the avatar from a user" },
                banner: { description: "Get the banner from a user" }
            },

            options: {
                user: {
                    name: "user",
                    description: "The user you want to get information from"
                }
            }
        }
    },

    say: { invalidMessage: "The specified message is not valid" },

    help: {
        intro: (name: string) =>
            `Hello, I'm ${bold(`${name}!`)} ${en.bot.description}`,

        usage: "To get started, select a command category from the menu below",

        category: {
            select: "Select a category",
            notExists: "The selected category does not exist!",
            noDescription: "This category does not have a description"
        }
    },

    status: {
        title: "Nano Status",
        pinging: "Pinging...",
        wait: "Please wait...",

        latency: {
            ws: "WebSocket Latency",
            roundtrip: "Roundtrip Response",
            error: "Could not gather bot's latency data"
        },

        uptime: {
            title: "Uptime",
            value: (uptime: string) => `Nano has been awake for ${bold(uptime)}`
        }
    },

    user: {
        info: {
            title: (name: string) => `${name}'s info`,
            globalName: "Global Name",
            username: "Username",
            date: "Creation date",
            id: "User ID",
            roles: "Server Roles"
        },

        avatar: {
            title: (name: string) => `${name}'s avatar`,
            notAvailable: (user: string) =>
                `${bold(`${user} does not have an avatar!`)} ...maybe try with someone else?`
        },

        banner: {
            title: (name: string) => `${name}'s banner`,
            notAvailable: (user: string) =>
                `${bold(`${user} does not have a banner!`)} ...maybe try with someone else?`
        }
    }
};
