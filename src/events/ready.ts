import config from "@/config.js";
import { Event } from "@/classes/event.js";

import pc from "picocolors";
import { Events, type Client } from "discord.js";

const ready = new Event(Events.ClientReady, { once: true });
ready.execute = (client: Client<true>) => {
    console.log(
        pc.bold(pc.green("ready!")),
        `logged in as ${pc.bold(client.user.tag)}`
    );

    if (client.user && config.presence)
        client.user.setPresence(config.presence(client));
};

export default ready;
