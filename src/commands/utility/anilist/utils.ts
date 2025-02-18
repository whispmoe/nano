import type { AniListMediaTrailer } from "@/commands/utility/anilist/api/media.js";

import he from "he";
import { italic, spoiler } from "discord.js";

/** Form a valid video link from a `AniListMediaTrailer` object */
export const trailerVideoURL = (
    trailer: AniListMediaTrailer | null
): string | null => {
    if (!trailer || !trailer.id || !trailer.site) return null;
    switch (trailer.site) {
        case "youtube":
            return `https://www.youtube.com/watch?v=${trailer.id}`;

        case "dailymotion":
            return `https://www.dailymotion.com/video/${trailer.id}`;

        default:
            return null;
    }
};

/**
 * Parse AniList markdown with tweaks to display it properly on Discord
 *
 * @param input A string containing AniList markdown syntax
 *
 * @returns     A Discord markdown formatted string
 */
export const anilistMarkdownParser = (input: string) => {
    let output = input;

    // convert anilist spoilers to discord spoilers
    output = output.replace(/~!(.*?)!~/g, (_, content) => {
        return spoiler(italic(content));
    });

    // decode html entities
    output = he.decode(output);

    return output;
};
