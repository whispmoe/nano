import { bold, inlineCode, italic } from "discord.js";

export const en = {
    bot: {
        shortName: "Nano",
        fullName: "Nano Shinonome"
    },

    general: {
        servers: "Servers",
        notAvailable: "Not available"
    },

    error: {
        default: "Something went wrong...",
        interactionFailed: "Something went wrong during this interaction!",
        unknown: "An unknown error occurred!",

        commandNotFound: (command: string) =>
            `Command ${inlineCode(`/${command}`)} not found!`,

        insufficientPermissions:
            "You don't have enough permissions to use this command!",

        scope: {
            dm: "This command can only be used in a DM!",
            guild: "This command can only be used in a server!"
        }
    },

    categories: {
        about: {
            name: "About",
            description: "Get more information about me"
        },

        utility: {
            name: "Utility",
            description: "Commands that may be useful"
        },

        fun: {
            name: "Fun",
            description: "Commands to have fun with Nano"
        }
    },

    commands: {
        anilist: {
            description: "Browse AniList",
            subcommands: {
                anime: {
                    description: "Search for an anime in AniList",
                    options: {
                        anime: {
                            name: "anime",
                            description: "The anime you want to search for"
                        }
                    }
                },

                character: {
                    description: "Search for a character in AniList",
                    options: {
                        character: {
                            name: "character",
                            description: "The character you want to search for"
                        }
                    }
                },

                user: {
                    description: "Search for a user in AniList",
                    options: {
                        user: {
                            name: "user",
                            description: "The user you want to search for"
                        }
                    }
                }
            }
        },

        help: { description: "Get information about available commands" },

        say: {
            description: "Let Nano say something for you",
            options: {
                message: {
                    name: "message",
                    description: "The message you want Nano to repeat"
                }
            }
        },

        status: { description: "Ensure the bot is running properly" },

        user: {
            description: "Get user information",
            subcommands: {
                avatar: { description: "Get the avatar from a user" },
                banner: { description: "Get the banner from a user" }
            },

            options: {
                user: {
                    name: "user",
                    description: "The user to get information about"
                }
            }
        }
    },

    say: {
        error: {
            invalidMessage: "The specified message is not valid"
        }
    },

    help: {
        /*
         * this line references the well known image:
         * https://files.filebeam.xyz/fiJZik.png
         *
         * this joke only works on english, for now this string will be kept as
         * is. other languages may include a more simple description about the
         * bot, it can be freely translated as long it fits the bot. the spanish
         * translation for this string can be used as a reference
         */
        intro: `Hello, I'm ${bold("Nano Shinonome!")} I am a robot. I live with the doctor who created me`,
        usage: "To get started, select a command category from the menu below",
        error: { categoryNotExists: "Selected category does not exist!" },

        category: {
            select: "Select a category",
            noDescription: "This category does not have a description"
        }
    },

    status: {
        title: "Status",
        pinging: "Pinging...",
        wait: "Please wait...",
        latency: {
            ws: "WebSocket Latency",
            roundtrip: "Roundtrip Response",
            error: "Could not gather bot latency data"
        },

        uptime: {
            title: "Uptime",
            value: (uptime: string) => `Nano has been awake for ${bold(uptime)}`
        }
    },

    user: {
        info: {
            title: (name: string) => `${name}'s info`,
            globalName: "Global name",
            username: "Username",
            date: "Creation date",
            id: "User ID",
            roles: "Server roles"
        },

        avatar: {
            title: (name: string) => `${name}'s avatar`,
            notAvailable: (user: string) =>
                `${bold(
                    `${user} does not have an avatar!`
                )} ...maybe you should try someone else?`
        },

        banner: {
            title: (name: string) => `${name}'s banner`,
            notAvailable: (user: string) =>
                `${bold(
                    `${user} does not have a banner!`
                )} ...maybe you should try someone else?`
        }
    },

    anilist: {
        viewOnAniList: "View on AniList",
        error: {
            failedSearch: `${bold(
                "Something went wrong during the search!"
            )} ...maybe you should try later?`,
            invalidSearch: "No valid search query was given!",
            noResults: "No results found for the given search term!"
        },

        mediaType: {
            anime: "Anime",
            manga: "Manga"
        },

        anime: {
            averageScore: "Average score",
            episodes: "Episodes",
            genres: "Genres",
            rankedAllTime: (rank: number) => `ranked #${rank} all time`,
            released: "Released",
            status: "Status",
            totalEpisodes: "Total episodes",
            trailer: "Watch trailer",

            season: {
                fall: "Fall",
                spring: "Spring",
                summer: "Summer",
                winter: "Winter"
            },

            statuses: {
                cancelled: "Cancelled",
                finished: "Finished",
                hiatus: "On hiatus",
                notReleasedYet: "Not released yet",
                releasing: "Releasing"
            }
        },

        list: {
            statuses: {
                dropped: "Dropped",
                finished: "Finished",
                hold: "On Hold",
                planning: "Planning",
                reading: "Reading",
                rereading: "Re-reading",
                rewatching: "Re-watching",
                watching: "Watching"
            }
        },

        user: {
            latestActivity: "Latest activity",
            noActivity: "This user has no activity!",
            stats: { anime: "Anime stats", manga: "Manga stats" }
        },

        character: {
            age: "Age",
            alternativeNames: "Alternative names",
            birthday: "Birthday",
            favorites: "Favorites",
            related: {
                title: "Related media",
                summary: (media: string, count: number) =>
                    `${media}, ${italic(`and ${count} more...`)}`
            }
        }
    }
};
