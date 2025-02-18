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
    client.categories = new Collection();

    const categoryFolders = fs.readdirSync(config.paths.commands);
    for (const categoryFolder of categoryFolders) {
        const categoryPath = path.join(config.paths.commands, categoryFolder);
        if (!fs.statSync(categoryPath).isDirectory()) continue;

        // load category metadata
        const categoryIndex = path.join(categoryPath, "index.ts");
        let category: BotCategory | undefined = undefined;

        if (fs.existsSync(categoryIndex)) {
            try {
                category = (await import(categoryIndex)).default;
                if (!category) continue;

                client.categories.set(category.id, {
                    ...category,
                    commands: new Collection()
                });
                success(`found category ${pc.bold(pc.cyan(category.id))}`);
            } catch (err) {
                error(
                    `failed to load category ${pc.bold(
                        pc.cyan(categoryFolder)
                    )}`,
                    err
                );
            }
        }

        const commandFiles = fs.readdirSync(categoryPath);
        for (const commandFile of commandFiles) {
            // ignore index.ts at category level when loading commands
            if (commandFile === "index.ts") continue;

            const commandPath = path.join(categoryPath, commandFile);
            const stat = fs.statSync(commandPath);

            if (stat.isFile() && commandFile.endsWith(".ts")) {
                // load individual commands
                await loadCommand(
                    client,
                    commandPath,
                    category?.id ?? categoryFolder
                );
            } else if (stat.isDirectory()) {
                // if the command its a folder, load its entry point
                const entryFile = path.join(commandPath, "index.ts");
                if (fs.existsSync(entryFile))
                    await loadCommand(
                        client,
                        entryFile,
                        category?.id ?? categoryFolder
                    );
            }
        }
    }
};

const loadCommand = async (
    client: Client,
    commandPath: string,
    categoryId: string
) => {
    try {
        const command = (await import(commandPath)).default;
        if (!command.data || !command.execute) {
            return warn(
                pc.bold(`${categoryId}/${path.basename(commandPath)}`),
                "is not a valid command, missing required",
                `${pc.bold(pc.cyan("data"))} or`,
                `${pc.bold(pc.cyan("execute"))} property`
            );
        }

        client.commands.set(command.data.name, command);
        const category = client.categories.get(categoryId);
        if (category) category.commands.set(command.data.name, command);
        success(`loaded command ${pc.bold(pc.cyan(`/${command.data.name}`))}`);
    } catch (err) {
        error(`failed to load command ${pc.bold(pc.cyan(commandPath))}`, err);
    }
};
