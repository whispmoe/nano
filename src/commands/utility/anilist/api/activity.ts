import type { AniListMedia } from "@/commands/utility/anilist/api/media.js";

import config from "@/config.js";
import { error } from "@/utils/logging.js";

import { gql, GraphQLClient } from "graphql-request";

const QUERY = gql`
    query GetLatestActivity($userID: Int!) {
        Activity(userId: $userID, type: MEDIA_LIST, sort: ID_DESC) {
            ... on ListActivity {
                replyCount
                likeCount
                status
                progress
                siteUrl
                createdAt

                media {
                    siteUrl

                    title {
                        romaji
                    }
                }
            }
        }
    }
`;

export type AniListListActivity = {
    createdAt: number;
    likeCount: number;
    media: AniListMedia | null;
    progress: string | null;
    replyCount: number;
    siteUrl: string | null;
    status: string | null;
};

/**
 * Get the last activity for the specified user
 *
 * @param userID The ID of the user to get the last activity for
 *
 * @returns      A promise that resolves to an `AniListListActivity` object if
 *               successful, `null` otherwise
 */
export const getLatestActivity = async (
    userID: number
): Promise<AniListListActivity | null> => {
    try {
        const client = new GraphQLClient(config.api.anilist.url);

        const response = (
            (await client.request(QUERY, {
                userID
            })) as { Activity: AniListListActivity | null }
        ).Activity;

        if (!response) return null;
        return response;
    } catch (err) {
        error(`anilist request error: ${err}`);
        return null;
    }
};
