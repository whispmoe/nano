import type { NanoConfig } from "@/types/config.ts";
import type { Client, ColorResolvable, Locale, PresenceData } from "discord.js";

import type { buildCategory } from "@/utils/builders/buildCategory.js";
import type { buildCommand } from "@/utils/builders/buildCommand.js";
import type { buildEvent } from "@/utils/builders/buildEvent.js";

declare global {
    type Command = ReturnType<typeof buildCommand>;
    type Category = ReturnType<typeof buildCategory>;
    type EventHandler = ReturnType<typeof buildEvent>;
}

declare module "discord.js" {
    interface Client {
        commands: Map<string, Command>;
        categories: Map<string, Category>;
    }
}
