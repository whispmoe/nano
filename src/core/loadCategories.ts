import config from "@/config.js";
import { error, info, success } from "@/utils/logging.js";

import fs from "fs";
import path from "path";
import pc from "picocolors";

import { Collection, type Client } from "discord.js";

export const loadCategories = async (client: Client) => {
    if (!config.paths.commands)
        return error(
            "failed to load categories, config value",
            `${pc.bold(pc.cyan("paths.commands"))} is missing`
        );

    if (!fs.existsSync(config.paths.commands))
        return error(
            "failed to load categories, path",
            `${pc.bold(config.paths.commands)} does not exist`
        );

    info("loading categories");
    client.categories = new Collection();

    const categoryFolders = fs.readdirSync(config.paths.commands);

    for (const categoryFolder of categoryFolders) {
        const categoryPath = path.join(config.paths.commands, categoryFolder);
        const categoryData: Category = (
            await import(`${categoryPath}/index.ts`)
        ).default;

        client.categories.set(categoryData.id, categoryData);
        success(`loaded category ${pc.bold(pc.cyan(categoryData.id))}`);
    }
};
