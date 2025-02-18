import type { NanoConfig } from "@/types/config.js";

import { info } from "@/utils/logging.js";
import { deploy } from "@/utils/deploy.js";

import { loadCommands } from "@/core/loadCommands.js";
import { loadEvents } from "@/core/loadEvents.js";

import pc from "picocolors";
import { Client, type ClientOptions } from "discord.js";

interface Arguments {
    /** Wether to start the bot in developer mode, regardless of the
     * configuration value `dev.enabled` */
    dev: boolean;

    /** Wether commands will be deployed before the bot starts */
    deploy: boolean;
}

export class Nano {
    constructor(
        args: Arguments,
        config: NanoConfig,
        options: ClientOptions = { intents: [] }
    ) {
        info("starting nano bot...");
        this.client = new Client(options);
        this.config = config;
        this.args = args;
        this.init(args);
    }

    client: Client;
    config: NanoConfig;
    args: Arguments;

    private async init(args: Arguments) {
        if (args.dev) this.config.dev.enabled = args.dev;
        if (this.config.dev.enabled) info(pc.yellow("dev mode is enabled"));

        if (args.deploy)
            if (this.config.dev.enabled) await deploy.dev();
            else await deploy.global();

        await loadEvents(this.client);
        await loadCommands(this.client);
        await this.client.login(this.config.credentials.token);
    }
}
