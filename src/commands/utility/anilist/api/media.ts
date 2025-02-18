import config from "@/config.js";
import { error } from "@/utils/logging.js";

import { gql, GraphQLClient } from "graphql-request";

const QUERY = gql`
    query searchMedia($query: String!) {
        Page {
            media(search: $query) {
                averageScore
                bannerImage
                episodes
                genres
                isAdult
                season
                seasonYear
                siteUrl
                status
                type

                coverImage {
                    color
                    medium
                }

                title {
                    romaji
                    english
                }

                trailer {
                    id
                    site
                }

                rankings {
                    rank
                    type
                    allTime
                }
            }
        }
    }
`;

export type AniListMediaType = "ANIME" | "MANGA";
export type AniListSeason = "WINTER" | "SPRING" | "SUMMER" | "FALL";
export type AniListMediaStatus =
    | "FINISHED"
    | "RELEASING"
    | "NOT_YET_RELEASED"
    | "CANCELLED"
    | "HIATUS";

export type AniListMediaRankType = "RATED" | "POPULAR";
export type AniListMediaRank = {
    rank: number;
    type: AniListMediaRankType;
    allTime: boolean | null;
};

export type AniListMedia = {
    averageScore: number | null;
    bannerImage: string | null;
    episodes: number | null;
    genres: string[] | null;
    isAdult: boolean | null;
    rankings: AniListMediaRank[] | null;
    season: AniListSeason | null;
    seasonYear: number | null;
    siteUrl: string | null;
    status: AniListMediaStatus | null;
    trailer: AniListMediaTrailer | null;
    type: AniListMediaType | null;

    coverImage: {
        medium: string | null;
        color: string | null;
    } | null;

    title: {
        romaji: string | null;
        english: string | null;
    } | null;
};

export type AniListMediaTrailer = {
    id: string | null;
    site: "youtube" | "dailymotion" | null;
};

/**
 * Searches for media on AniList based on the provided query
 *
 * @param searchQuery The search query string
 * @param filter      Wether to filter anime or media only
 *
 * @returns     A promise that resolves to an array of `AniListMedia` objects if
 *              the search was successful, `null` otherwise
 */
export const searchMedia = async (
    searchQuery: string,
    filter?: AniListMediaType
): Promise<AniListMedia[] | null> => {
    try {
        const client = new GraphQLClient(config.api.anilist.url);

        const response = (await client.request(QUERY, {
            query: searchQuery
        })) as { Page: { media: AniListMedia[] } } | null;

        if (!response) return null;
        return response.Page.media.filter(
            media => !media.isAdult && (!filter || media.type === filter)
        );
    } catch (err) {
        error(`anilist request error: ${err}`);
        return null;
    }
};
