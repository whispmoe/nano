import type { LocaleObject } from "@/utils/locale.js";
import { bold, inlineCode } from "discord.js";

export const es: LocaleObject = {
    bot: {
        shortName: "Nano",
        fullName: "Nano Shinonome",
        description:
            "Soy una robot que busca ayudar y brindar diversión a tu servidor de Discord!"
    },

    common: {
        servers: "Servidores",
        expired: "Este comando ha expirado",
        notAvailable: "No disponible",

        error: {
            default: "Algo ha salido mal...",
            unknown: "Un error desconocido ha ocurrido!",
            interactionFailed: "Ha ocurrido un error durante la interacción!",

            insufficientPermissions:
                "No tienes suficientes permisos para usar este comando!",

            commandNotFound: (command: string) =>
                `No se ha encontrado el comando ${inlineCode(`/${command}`)}!`,

            scope: {
                guild: "Este comando solo puede ser usado en un servidor!",
                dm: "Este comando solo puede ser usado en un DM!"
            }
        }
    },

    categories: {
        utility: {
            name: "Utilidad",
            description: "Comandos que podrían ser útiles"
        },

        about: {
            name: "Acerca de",
            description: "Obtén más información sobre mí"
        },

        music: {
            name: "Música",
            description: "Permite a Nano reproducir música por ti"
        }
    },

    commands: {
        say: {
            description: "Permite a Nano decir algo por ti",
            options: {
                message: {
                    name: "mensaje",
                    description: "El mensaje que quieres que Nano repita por ti"
                }
            }
        },

        status: { description: "Devuelve información sobre el estado del bot" },

        help: {
            description: "Obtén información sobre los comandos disponibles"
        },

        join: { description: "Pide a Nano unirse a tu canal de voz" },

        play: {
            description: "Reproduce una canción de alguna fuente válida",
            options: {
                song: {
                    name: "canción",
                    description:
                        "El nombre de la canción que quieres reproducir o un enlace válido"
                }
            }
        },

        search: {
            description: "Busca una canción en YouTube",
            options: {
                song: {
                    name: "canción",
                    description: "El nombre de la canción que quieres buscar"
                }
            }
        },

        user: {
            description: "Obtén información sobre un usuario",

            subcommands: {
                avatar: { description: "Obtén el avatar de un usuario" }
            },

            options: {
                user: {
                    name: "usuario",
                    description:
                        "El usuario del cual deseas obtener información"
                }
            }
        }
    },

    say: { invalidMessage: "El mensaje especificado no es válido" },

    help: {
        intro: (name: string) =>
            `Hola, soy ${bold(`${name}!`)} ${es.bot.description}`,
        usage: "Para obtener ayuda, selecciona una categoría a través del menú",

        category: {
            select: "Seleccionar una categoría",
            notExists: "La categoría seleccionada no existe!",
            noDescription: "Esta categoría no tiene una descripción"
        }
    },

    status: {
        title: "Estado de Nano",
        pinging: "Enviando ping...",
        wait: "Por favor espera...",

        latency: {
            ws: "Latencia del WebSocket",
            roundtrip: "Latencia de la respuesta",
            error: "No se pudo obtener información sobre la latencia del bot"
        },

        uptime: {
            title: "Tiempo en línea",
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
            id: "ID del usuario"
        }
    },

    voice: {
        couldNotJoin: "No me he podido unir a tu canal de voz!",
        notInVoice: "No estás dentro de un canal de voz!",
        alreadyInVoice: "Ya estoy conectada a un canal de voz!",
        joined: (channel: string) => `Unida al canal ${channel} con éxito!`
    },

    music: {
        stopped: "Reproducción detenida",
        playing: "Reproduciendo",
        paused: "Pausado",

        error: {
            noSong: "No se ha proporcionado ninguna canción o enlace válido!",
            unknown:
                "Ha ocurrido un error desconocido durante la reproducción!",

            couldNotPlay:
                "No pude reproducir esa canción! Qué tal probar con alguna otra...?"
        },

        search: {
            results: "Resultados de la búsqueda",
            noResults: "No se encontró ningún resultado para la búsqueda!",

            menu: {
                select: "Selecciona una canción",
                back: "Anterior",
                next: "Siguiente"
            }
        }
    }
};
