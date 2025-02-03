import config from "@/config.js";
import { error, info, success, warn } from "@/utils/logging.js";

import fs from "fs";
import path from "path";
import pc from "picocolors";

import { Collection, type Client } from "discord.js";

export const loadCommands = async (client: Client) => {
    if (!config.paths.commands)
        return error(
            "failed to load commands, config value",
            `${pc.bold(pc.cyan("paths.commands"))} is missing`
        );

    if (!fs.existsSync(config.paths.commands))
        return error(
            "failed to load commands, path",
            `${pc.bold(config.paths.commands)} does not exist`
        );

    info("loading commands");
    client.commands = new Collection();
    const categoryFolders = fs.readdirSync(config.paths.commands);

    for (const categoryFolder of categoryFolders) {
        const categoryPath = path.join(config.paths.commands, categoryFolder);
        const commandFiles = fs.readdirSync(categoryPath);

        const category = client.categories.get(categoryFolder);
        if (!category)
            warn(`category ${pc.bold(pc.cyan(categoryFolder))} not found`);

        for (const commandFile of commandFiles) {
            if (
                !commandFile.endsWith(".ts") ||
                !commandFile.startsWith("_") ||
                commandFile.includes("index")
            )
                continue;

            const commandPath = path.join(categoryPath, commandFile);
            const command: BotCommand = (await import(commandPath)).default;

            if (!command.data || !command.execute) {
                warn(
                    pc.bold(`${categoryFolder}/${commandFile}`),
                    "is not a valid command, missing required",
                    `${pc.bold(pc.cyan("data"))} or`,
                    `${pc.bold(pc.cyan("execute"))} property`
                );
            } else {
                if (category) category.commands.set(command.data.name, command);
                client.commands.set(command.data.name, command);

                success(
                    "loaded command",
                    pc.bold(pc.cyan(`/${command.data.name}`))
                );
            }
        }
    }
};
