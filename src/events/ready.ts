import config from "@/config.js";
import { buildEvent } from "@/utils/builders/buildEvent.js";

import pc from "picocolors";
import { Events, type Client } from "discord.js";

export default buildEvent(
    { name: Events.ClientReady, once: true },
    (client: Client<true>) => {
        console.log(
            pc.bold(pc.green("ready!")),
            `logged in as ${pc.bold(client.user.tag)}`
        );

        if (client.user && config.presence)
            client.user.setPresence(config.presence(client));
    }
);
