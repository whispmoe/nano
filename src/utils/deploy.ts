import config from "@/config.js";
import { error, info, success, warn } from "@/utils/logging.js";

import fs from "fs";
import path from "path";
import pc from "picocolors";

import {
    REST,
    Routes,
    type RESTPostAPIChatInputApplicationCommandsJSONBody
} from "discord.js";

const rest = new REST().setToken(config.credentials.token);

const loadCommands = async (
    options: {
        /** Wether commands set as private will be skipped */
        skipPrivate?: boolean;
    } = {}
) => {
    const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

    if (!fs.existsSync(config.paths.commands))
        return error(
            "could not get command files,",
            `config value ${pc.bold(pc.cyan("paths.commands"))} is missing`
        );

    const categoryFolders = fs
        .readdirSync(config.paths.commands)
        .filter(folder =>
            fs.statSync(path.join(config.paths.commands, folder)).isDirectory()
        );

    for (const categoryFolder of categoryFolders) {
        const categoryPath = path.join(config.paths.commands, categoryFolder);
        const commandFiles = fs.readdirSync(categoryPath);

        for (const commandFile of commandFiles) {
            // skip category index file
            if (commandFile === "index.ts") continue;

            const categoryEntry = path.join(categoryPath, commandFile);
            const isDirectory = fs.statSync(categoryEntry).isDirectory();

            let commandPath: string;
            if (isDirectory) {
                // if the command is a folder, use index.ts
                commandPath = path.join(categoryEntry, "index.ts");
                if (!fs.existsSync(commandPath)) continue;
            } else {
                if (!commandFile.endsWith(".ts")) continue;
                commandPath = categoryEntry;
            }

            const command: BotCommand = (await import(commandPath)).default;
            if (!command.data || !command.execute) {
                warn(
                    pc.bold(`${categoryFolder}/${commandFile}`),
                    "is not a valid command, missing required",
                    `${pc.bold(pc.cyan("data"))} or`,
                    `${pc.bold(pc.cyan("execute"))} property`
                );
            } else {
                if (options.skipPrivate && command.private) {
                    info(
                        "skipping private command",
                        pc.bold(pc.cyan(`/${command.data.name}`))
                    );
                } else commands.push(command.data.toJSON());
            }
        }
    }

    return commands;
};

export const deploy = {
    dev: async () => {
        if (!config.dev.guild)
            return error(
                "tried to deploy commands to development guild, but",
                `config value ${pc.bold(pc.cyan("dev.guild"))} is missing`
            );

        info("deploying commands to development guild...");
        const commands = await loadCommands();

        if (Array.isArray(commands)) {
            if (commands.length === 0) return error("no valid commands found!");
            else info(`${commands.length} commands ready`);
        } else return error("failed to load commands");

        try {
            const data = (await rest.put(
                Routes.applicationGuildCommands(
                    config.credentials.clientID,
                    config.dev.guild
                ),
                { body: commands }
            )) as unknown[];
            success(`deployed ${data.length} commands!`);
        } catch (err) {
            error(err);
        }
    },

    global: async () => {
        info("deploying commands to all guilds...");
        const commands = await loadCommands({ skipPrivate: true });

        if (Array.isArray(commands)) {
            if (commands.length === 0) return error("no valid commands found!");
            else info(`${commands.length} commands ready`);
        } else return error("failed to load commands");

        try {
            const data = (await rest.put(
                Routes.applicationCommands(config.credentials.clientID),
                { body: commands }
            )) as unknown[];
            success(`deployed ${data.length} commands!`);
        } catch (err) {
            error(err);
        }
    }
};
