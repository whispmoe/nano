import type { NanoConfig } from "@/types/config.ts";

import type { Command } from "@/classes/command.ts";
import type { Category } from "@/classes/category.ts";
import type { Event } from "@/classes/event.ts";

import type { buildEvent } from "@/utils/builders/buildEvent.js";
import type { buildCommand } from "@/utils/builders/buildCommand.js";
import type { buildCategory } from "@/utils/builders/buildCategory.js";

import type { Client, ColorResolvable, Locale, PresenceData } from "discord.js";

declare global {
    type BotCategory = Category;
    type BotCommand = Command;
    type BotEvent = Event;
}

declare module "discord.js" {
    interface Client {
        commands: Map<string, BotCommand>;
        categories: Map<string, BotCategory>;
    }
}
