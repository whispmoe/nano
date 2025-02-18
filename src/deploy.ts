import config from "@/config.js";
import { deploy } from "@/utils/deploy.js";

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const args = await yargs(hideBin(process.argv))
    .option("dev", {
        alias: "d",
        type: "boolean",
        description:
            "Deploy to the development guild, instead of the global application commands",
        default: false
    })
    .help(false)
    .parse();

if (args.dev || config.dev.enabled) await deploy.dev();
else await deploy.global();
