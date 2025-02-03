import type { NanoConfig } from "@/types/config.js";

import { locale } from "@/utils/messages/locale.js";

import path from "path";
import { ActivityType, Locale } from "discord.js";

process.loadEnvFile();
const { TOKEN, CLIENT_ID, GUILD_ID, DEVELOPER_ID, YOUTUBE_COOKIES } =
    process.env;

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

    paths: {
        commands: path.join(__dirname, "commands"),
        events: path.join(__dirname, "events")
    },

    music: {
        youtube: {
            cookies: JSON.parse(YOUTUBE_COOKIES ?? "[]")
        }
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
                        "common.servers",
                        config.defaultLocale
                    ).toLowerCase(),
                type: ActivityType.Watching
            }
        ]
    }),

    embedColors: {
        default: "#ecc7a7",
        success: "#9fc594",
        warning: "#e29d73",
        error: "#DC6F6D"
    },

    emojis: {
        cd: "<:cd:1335095283566252062>",
        bubble: "<a:bubble:1334331685608624268>",
        plus: "<:plus:1334331680613335040>",
        dotGreen: "<:dot_green:1334246736117501993>",
        dotOrange: "<:dot_orange:1334246730233024604>",
        dotRed: "<:dot_red:1334246740425183273>",
        checkmark: "<:checkmark:1334246752349458473>",
        clock: "<:clock:1334246743520317502>",
        sakamotoFear: "<:sakamoto_fear:1333258784289849424>",
        hakaseButton: "<a:hakase_button:1333258749275799663>",
        mogura: "<:mogura:1333251845874909294>",
        kamakura: "<:kamakura:1333251577468948501>"
    },

    img: {
        sleepy: getImage("sleepy.gif"),
        nervous: getImage("nervous.gif"),
        walking: getImage("walking.gif")
    }
};

export default config;
