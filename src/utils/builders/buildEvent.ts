import type { ClientEvents } from "discord.js";

interface EventProperties {
    name: keyof ClientEvents;
    once?: boolean;
}

export const buildEvent = (
    prop: EventProperties,
    execute: (...args: any[]) => void
) => ({
    name: prop.name,
    once: prop.once,
    execute
});
