import type { Client } from "discord.js";

import config from "@/config.js";
import { error, info } from "@/utils/logging.js";

import fs from "fs";
import path from "path";
import pc from "picocolors";

export const loadEvents = async (client: Client) => {
    if (!config.paths.events)
        return error(
            "failed to load events, config value",
            `${pc.bold(pc.cyan("paths.events"))} is missing`
        );

    if (!fs.existsSync(config.paths.events))
        return error(
            "failed to load events, path",
            `${pc.bold(config.paths.events)} does not exist`
        );

    info("loading events");
    const eventFiles = fs.readdirSync(config.paths.events);

    for (const eventFile of eventFiles) {
        const eventPath = path.join(config.paths.events, eventFile);
        const event: BotEvent = (await import(eventPath)).default;

        if (event.prop.once)
            client.once(event.name, (...args) => event.execute(...args));
        else client.on(event.name, (...args) => event.execute(...args));
    }
};
