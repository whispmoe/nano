import { localeMap, type LocaleKey } from "@/utils/locale.js";
import { Collection, type LocalizationMap } from "discord.js";

interface CategoryProperties {
    emoji: string;
    name: LocaleKey;
    description: LocaleKey;
}

export class Category {
    constructor(id: string, prop: CategoryProperties) {
        this.name = localeMap(prop.name);
        this.description = localeMap(prop.description);
        this.emoji = prop.emoji;
        this.id = id;
    }

    id: string;
    emoji: string;
    name: LocalizationMap;
    description: LocalizationMap;
    commands = new Collection<string, BotCommand>();
}
