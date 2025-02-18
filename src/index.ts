import config from "@/config.js";
import { Nano } from "@/core/nano.js";
import { info } from "@/utils/logging.js";

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { GatewayIntentBits } from "discord.js";

const args = await yargs(hideBin(process.argv))
    .option("dev", {
        alias: "d",
        type: "boolean",
        description:
            "Start in development mode, ignoring the config value dev.enabled",
        default: false
    })
    .option("deploy", {
        alias: "D",
        type: "boolean",
        description: "Deploy bot commands before initializing the bot",
        default: false
    })
    .help(false)
    .parse();

new Nano(args, config, {
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers
    ]
});

process.on("SIGINT", function () {
    process.stdout.write("\r");
    info("exiting... goodbye!");
    process.exit();
});
