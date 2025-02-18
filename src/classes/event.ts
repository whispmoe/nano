import type { ClientEvents } from "discord.js";

type EventName = keyof ClientEvents;
interface EventProperties {
    /** Wether this event will only fire once */
    once?: boolean;
}

export class Event {
    constructor(name: EventName, prop?: EventProperties) {
        this.name = name;
        this.prop = prop ?? {};
    }

    name: EventName;
    prop: EventProperties;
    execute: (...args: any[]) => void = () => {};
}
