import type { AniListMedia } from "@/commands/utility/anilist/api/media.js";

import config from "@/config.js";
import { error } from "@/utils/logging.js";

import { gql, GraphQLClient } from "graphql-request";

const QUERY = gql`
    query searchCharacters($query: String!) {
        Page {
            characters(search: $query) {
                name {
                    full
                    native
                    alternative
                }

                description

                dateOfBirth {
                    year
                    month
                    day
                }

                image {
                    large
                }

                media {
                    nodes {
                        type

                        title {
                            romaji
                        }

                        siteUrl
                    }
                }

                favourites
                siteUrl
            }
        }
    }
`;

export type AniListCharacterName = {
    full: string | null;
    native: string | null;
    alternative: string[] | null;
};

export type AniListFuzzyDate = {
    year: number | null;
    month: number | null;
    day: number | null;
};

export type AniListCharacter = {
    name: AniListCharacterName | null;
    description: string | null;
    dateOfBirth: AniListFuzzyDate | null;
    image: { large: string | null } | null;
    media: { nodes: AniListMedia[] | null } | null;
    age: string | null;
    favourites: number | null;
    siteUrl: string | null;
};

export const searchCharacters = async (searchQuery: string) => {
    const client = new GraphQLClient(config.api.anilist.url);

    try {
        const response = (await client.request(QUERY, {
            query: searchQuery
        })) as { Page: { characters: AniListCharacter[] } } | null;

        if (!response) return null;
        return response.Page.characters;
    } catch (err) {
        error(`anilist request error: ${err}`);
        return null;
    }
};
