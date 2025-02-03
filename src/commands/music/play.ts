import type { Song } from "@/types/music/song.js";

import config from "@/config.js";
import { error } from "@/utils/logging.js";
import { f } from "@/utils/messages/formatting.js";
import { locale } from "@/utils/messages/locale.js";
import { buildEmbed } from "@/utils/builders/buildEmbed.js";
import { buildCommand } from "@/utils/builders/buildCommand.js";

import { joinVC } from "@/commands/music/join.js";
import { search } from "@/commands/music/search.js";

import type yts from "yt-search";
import ytdl from "@distube/ytdl-core";
import prettyMilliseconds from "pretty-ms";
import { createAudioPlayer, createAudioResource } from "@discordjs/voice";

export default buildCommand(
    {
        name: "play",
        description: "commands.play.description",
        options: [
            {
                type: "string",
                name: "commands.play.options.song.name",
                description: "commands.play.options.song.description",
                required: true
            }
        ]
    },

    async interaction => {
        await interaction.deferReply();
        const songRequest = interaction.options.getString(
            locale("commands.play.options.song.name")
        );

        const embedNoSong = buildEmbed(interaction, {
            style: "error",
            description: locale("music.error.noSong", interaction.guildLocale)
        });

        if (!songRequest)
            return interaction.editReply({
                embeds: [embedNoSong]
            });

        const member = interaction.guild?.members.cache.find(
            member => member.id === interaction.user.id
        );

        const vc = {
            user: member?.voice.channel,
            bot: interaction.guild?.members.me?.voice.channel
        };

        const embedNotInVoice = buildEmbed(interaction, {
            style: "error",
            description: locale("voice.notInVoice", interaction.guildLocale)
        });

        const embedCouldNotJoin = buildEmbed(interaction, {
            style: "error",
            description: locale("voice.couldNotJoin", interaction.guildLocale)
        });

        if (!vc.user) {
            return interaction.editReply({
                embeds: [embedNotInVoice]
            });
        }

        const connection = await joinVC(vc.user);
        if (!connection?.joinConfig.channelId)
            return interaction.editReply({
                embeds: [embedCouldNotJoin]
            });

        const embedNoResults = buildEmbed(interaction, {
            style: "error",
            description: locale(
                "music.search.noResults",
                interaction.guildLocale
            )
        });

        let song: Song | undefined;
        if (!ytdl.validateURL(songRequest)) {
            const searchResult = (await search(interaction, {
                getFirstResult: true
            })) as yts.VideoSearchResult;

            if (searchResult.url) {
                song = {
                    url: searchResult.url,
                    name: searchResult.title,
                    artist: searchResult.author.name,
                    duration: searchResult.duration.timestamp,
                    id: searchResult.videoId
                };
            } else
                return interaction.editReply({
                    embeds: [embedNoResults]
                });
        } else {
            const videoInfo = (await ytdl.getBasicInfo(songRequest))
                .videoDetails;

            song = {
                name: videoInfo.title,
                artist: videoInfo.ownerChannelName,
                thumbnail: videoInfo.thumbnails[0].url,
                id: videoInfo.videoId,
                url: songRequest,
                duration: prettyMilliseconds(Number(videoInfo.lengthSeconds), {
                    secondsDecimalDigits: 0,
                    colonNotation: true
                })
            };
        }

        /* validate again in case the url for the search result can't be
        validated */
        if (!ytdl.validateURL(songRequest) || !song)
            return interaction.editReply({
                embeds: [embedNoResults]
            });

        const agent = ytdl.createAgent(config.music?.youtube?.cookies);
        const stream = ytdl(song.url, { agent, filter: "audioonly" });
        const player = createAudioPlayer();

        const embedCouldNotPlay = buildEmbed(interaction, {
            style: "error",
            description: locale(
                "music.error.couldNotPlay",
                interaction.guildLocale
            )
        });

        const embedPlaying = buildEmbed(interaction, {
            style: "default",
            title: locale("music.playing", interaction.guildLocale),
            description:
                `${config.emojis.cd} ${f.code(song.duration)} ~ ` +
                f.bold(f.link(song.name, song.url))
        }).setThumbnail(song.thumbnail ?? null);

        const embedStopped = buildEmbed(interaction, {
            style: "error",
            title: locale("music.stopped", interaction.guildLocale),
            description: locale("music.error.unknown", interaction.guildLocale)
        });

        player.on("error", err => {
            error(err);
            if (interaction.channel?.isSendable())
                interaction.channel.send({
                    embeds: [embedStopped]
                });
        });

        try {
            player.play(createAudioResource(stream));
            connection.subscribe(player);
            interaction.editReply({ embeds: [embedPlaying] });
        } catch (err) {
            error(err);
            return interaction.editReply({
                embeds: [embedCouldNotPlay]
            });
        }
    }
);
