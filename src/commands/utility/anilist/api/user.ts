import config from "@/config.js";
import { error } from "@/utils/logging.js";

import { gql, GraphQLClient } from "graphql-request";

const QUERY = gql`
    query SearchUser($query: String!) {
        Page {
            users(search: $query) {
                id
                name
                bannerImage
                siteUrl

                avatar {
                    medium
                }

                statistics {
                    anime {
                        statuses {
                            count
                            status
                        }
                    }

                    manga {
                        statuses {
                            count
                            status
                        }
                    }
                }
            }
        }
    }
`;

export type AniListUserStatuses = {
    count: number;
    status: AniListMediaListStatus | null;
};

export type AniListUserStatistics = {
    statuses: AniListUserStatuses[] | null;
};

export type AniListUser = {
    id: number;
    name: string;
    avatar: { medium: string | null } | null;
    bannerImage: string | null;
    siteUrl: string | null;

    statistics: {
        anime: AniListUserStatistics | null;
        manga: AniListUserStatistics | null;
    } | null;
};

export const AniListMediaListStatuses = [
    "COMPLETED",
    "CURRENT",
    "DROPPED",
    "PAUSED",
    "PLANNING",
    "REPEATING"
] as const;

export type AniListMediaListStatus = (typeof AniListMediaListStatuses)[number];

/**
 * Searches for users on AniList based on the provided query
 *
 * @param query The search query string
 *
 * @returns     A promise that resolves to an array of `AniListUser` objects if
 *              the search was successful, `null` otherwise
 */
export const searchUsers = async (
    searchQuery: string
): Promise<AniListUser[] | null> => {
    try {
        const client = new GraphQLClient(config.api.anilist.url);

        const response = (await client.request(QUERY, {
            query: searchQuery
        })) as { Page: { users: AniListUser[] } } | null;

        if (!response) return null;
        return response.Page.users;
    } catch (err) {
        error(`anilist request error: ${err}`);
        return null;
    }
};
