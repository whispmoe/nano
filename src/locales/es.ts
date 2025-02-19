import type { LocaleObject } from "@/utils/locale.js";
import { bold, inlineCode, italic } from "discord.js";

export const es: LocaleObject = {
    bot: {
        shortName: "Nano",
        fullName: "Nano Shinonome"
    },

    general: {
        servers: "Servidores",
        notAvailable: "No disponible"
    },

    error: {
        default: "Algo ha salido mal...",
        interactionFailed: "Algo salio mal durante esta interacción!",
        unknown: "Un error desconocido ha ocurrido!",

        commandNotFound: (command: string) =>
            `No se ha encontrado el comando ${inlineCode(`/${command}`)}!`,

        insufficientPermissions:
            "No tienes permisos suficientes para usar este comando!",

        scope: {
            dm: "Este comando solo puede ser usado en MD!",
            guild: "Este comando solo puede ser usado en un servidor!"
        }
    },

    categories: {
        about: {
            name: "Acerca de",
            description: "Obtén mas información sobre mi"
        },

        utility: {
            name: "Utilidad",
            description: "Comandos que podrían ser útiles"
        },

        fun: {
            name: "Diversion",
            description: "Comandos para divertirte con Nano"
        }
    },

    commands: {
        anilist: {
            description: "Navegar AniList",
            subcommands: {
                anime: {
                    description: "Busca algún anime en AniList",
                    options: {
                        anime: {
                            name: "anime",
                            description: "El anime que quieres buscar"
                        }
                    }
                },

                character: {
                    description: "Busca algún personaje en AniList",
                    options: {
                        character: {
                            name: "personaje",
                            description: "El personaje que quieres buscar"
                        }
                    }
                },

                user: {
                    description: "Busca algún usuario en AniList",
                    options: {
                        user: {
                            name: "usuario",
                            description: "El usuario que quieres buscar"
                        }
                    }
                }
            }
        },

        cake: { description: "Obtén un rollo de pastel de Nano" },

        help: {
            description: "Obtén información sobre los comandos disponibles"
        },

        say: {
            description: "Permite a Nano decir algo por ti",
            options: {
                message: {
                    name: "mensaje",
                    description: "El mensaje que quieres que Nano repita"
                }
            }
        },

        status: {
            description:
                "Asegúrate de que el bot este funcionando correctamente"
        },

        user: {
            description: "Obtén información sobre un usuario",
            subcommands: {
                avatar: { description: "Obtén el avatar de un usuario" },
                banner: { description: "Obtén el banner de un usuario" }
            },

            options: {
                user: {
                    name: "usuario",
                    description:
                        "El usuario del cual quieres obtener información"
                }
            }
        }
    },

    say: {
        error: {
            invalidMessage: "El mensaje especificado no es valido"
        }
    },

    help: {
        intro: `Hola, soy ${bold("Nano Shinonome!")} Soy una robot que busca ser de ayuda y brindar diversion a tu servidor de Discord!`,
        usage: "Para obtener ayuda, selecciona una categoría del menu abajo",
        error: { categoryNotExists: "La categoria seleccionada no existe!" },

        category: {
            select: "Selecciona una categoría",
            noDescription: "Esta categoría no tiene una descripción"
        }
    },

    status: {
        title: "Estado",
        pinging: "Esperando ping...",
        wait: "Por favor espera...",
        latency: {
            ws: "Latencia del WebSocket",
            roundtrip: "Latencia de respuesta",
            error: "No se pudo obtener la latencia del bot"
        },

        uptime: {
            title: "Tiempo en linea",
            value: (uptime: string) =>
                `Nano ha estado despierta por ${bold(uptime)}`
        }
    },

    user: {
        info: {
            title: (name: string) => `Información de ${name}`,
            globalName: "Nombre global",
            username: "Nombre de usuario",
            date: "Fecha de creación",
            id: "ID del usuario",
            roles: "Roles del servidor"
        },

        avatar: {
            title: (name: string) => `Avatar de ${name}`,
            notAvailable: (user: string) =>
                `${bold(
                    `El usuario ${user} no tiene un avatar!`
                )} ...tal vez deberías intentar con alguien mas?`
        },

        banner: {
            title: (name: string) => `Banner de ${name}`,
            notAvailable: (user: string) =>
                `${bold(
                    `El usuario ${user} no tiene un banner!`
                )} ...tal vez deberias intentar con alguien mas?`
        }
    },

    anilist: {
        viewOnAniList: "Ver en AniList",
        error: {
            failedSearch: `${bold(
                "Algo ha salido mal durante la búsqueda!"
            )} ...Tal vez deberás intentar mas tarde?`,

            invalidSearch:
                "No se ha proporcionado un termino de búsqueda valido!",

            noResults:
                "No se han encontrado resultados validos para tu búsqueda!"
        },

        mediaType: {
            anime: "Anime",
            manga: "Manga"
        },

        anime: {
            averageScore: "Calificación promedio",
            episodes: "Episodios",
            genres: "Géneros",

            rankedAllTime: (rank: number) =>
                `calificado #${rank} de todos los tiempos`,

            released: "Lanzado",
            status: "Estado",
            totalEpisodes: "Total de episodios",
            trailer: "Ver trailer",

            season: {
                fall: "Otoño",
                spring: "Primavera",
                summer: "Verano",
                winter: "Invierno"
            },

            statuses: {
                cancelled: "Cancelado",
                finished: "Finalizado",
                hiatus: "En hiatus",
                notReleasedYet: "Aun no disponible",
                releasing: "En emisión"
            }
        },

        list: {
            statuses: {
                dropped: "Abandonado",
                finished: "Finalizado",
                hold: "En espera",
                planning: "Planeando",
                reading: "Leyendo",
                rereading: "Volviendo a leer",
                rewatching: "Volviendo a ver",
                watching: "Viendo"
            }
        },

        user: {
            latestActivity: "Ultima actividad",
            noActivity: "Este usuario no tiene actividad!",
            stats: {
                anime: "Estadisticas de anime",
                manga: "Estadisticas de manga"
            }
        },

        character: {
            age: "Edad",
            alternativeNames: "Nombres alternativos",
            birthday: "Cumpleaños",
            favorites: "Favoritos",
            related: {
                title: "Medios relacionados",
                summary: (media: string, count: number) =>
                    `${media}, ${italic(`y ${count} mas...`)}`
            }
        }
    },

    cake: { eating: user => `${bold(user)} esta comiendo un rollo de pastel!` }
};
