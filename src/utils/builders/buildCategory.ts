import { localeMap, type LocaleKey } from "@/utils/messages/locale.js";
import { Collection } from "discord.js";

interface CategoryProperties {
    id: string;
    emoji: string;
    name: LocaleKey;
    description: LocaleKey;
}

export const buildCategory = (prop: CategoryProperties) => {
    const { id, emoji } = prop;
    const name = localeMap(prop.name);
    const description = localeMap(prop.description);

    return {
        id,
        name,
        emoji,
        description,
        commands: new Collection<string, Command>()
    };
};
