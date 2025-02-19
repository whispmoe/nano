import type { NanoConfig } from "@/types/config.js";

import { locale } from "@/utils/locale.js";

import path from "path";
import { ActivityType, Locale } from "discord.js";

process.loadEnvFile();
const { TOKEN, CLIENT_ID, GUILD_ID, DEVELOPER_ID } = process.env;

const __dirname = import.meta.dirname;
const imgBaseURL = "https://nano.whisp.moe/img";
const getImage = (name: string) => `${imgBaseURL}/${name}`;

/** The bot's default configuration and settings */
const config: NanoConfig = {
    credentials: {
        token: TOKEN ?? "",
        clientID: CLIENT_ID ?? ""
    },

    dev: {
        enabled: false,
        id: DEVELOPER_ID ?? "",
        guild: GUILD_ID ?? ""
    },

    api: {
        anilist: {
            url: "https://graphql.anilist.co"
        }
    },

    paths: {
        commands: path.join(__dirname, "commands"),
        events: path.join(__dirname, "events")
    },

    defaultLocale: Locale.EnglishUS,
    componentTimeout: 120_000,

    presence: client => ({
        status: "idle",
        activities: [
            {
                name:
                    `${client.guilds.cache.size} ` +
                    locale(
                        "general.servers",
                        config.defaultLocale
                    ).toLowerCase(),
                type: ActivityType.Watching
            }
        ]
    }),

    colors: {
        default: "#ecc7a7",
        success: "#9fc594",
        warning: "#e29d73",
        error: "#DC6F6D"
    },

    emojis: {
        /* ------------- arrows ------------- */
        arrowLeft: "<:ArrowLeft:1337129432556769291>",
        arrowRight: "<:ArrowRight:1337129440756629589>",
        /* ------------- status ------------- */
        dotGreen: "<:dot_green:1334246736117501993>",
        dotOrange: "<:dot_orange:1334246730233024604>",
        dotRed: "<:dot_red:1334246740425183273>",
        /* ----------- categories ----------- */
        bubble: "<a:bubble:1334331685608624268>",
        cd: "<:cd:1335095283566252062>",
        plus: "<:plus:1334331680613335040>",
        /* -------------- icons ------------- */
        checkmark: "<:checkmark:1334246752349458473>",
        clock: "<:clock:1334246743520317502>",
        close: "<:close:1337183387789561896>",
        dot: "<:dot:1337170066302832691>",
        star: "<:star:1337150034164191345>",
        /* ------------ reactions ----------- */

        nanoKey: "<a:NanoKey:1336011460220031088>",
        kamakura: "<:kamakura:1333251577468948501>",
        hakaseButton: "<a:hakase_button:1333258749275799663>"
    },

    img: {
        sleepy: getImage("sleepy.gif"),
        nervous: getImage("nervous.gif"),
        walking: getImage("walking.gif"),
        smile: getImage("smile.gif"),
        cake: getImage("cake.gif")
    }
};

export default config;
