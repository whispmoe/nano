import type { LocaleObject } from "@/utils/locale.js";
import { bold, inlineCode } from "discord.js";

export const es: LocaleObject = {
    bot: {
        shortName: "Nano",
        fullName: "Nano Shinonome",
        description:
            "Soy una robot que busca ayudar y brindar diversion a tu servidor de Discord!"
    },

    common: {
        servers: "Servidores",
        expired: "Este comando ha expirado",
        notAvailable: "No disponible",

        error: {
            default: "Algo ha salido mal...",
            interactionFailed: "Ha ocurrido un error durante la interacción!",
            unknown: "Un error desconocido ha ocurrido!",

            insufficientPermissions:
                "No tienes suficientes permisos para usar este comando!",

            commandNotFound: command =>
                `No se ha encontrado el commando ${inlineCode(`/${command}`)}!`,

            scope: {
                guild: "Este comando solo puede ser usando en un servidor!",
                dm: "Este comando solo puede ser usando en un DM!"
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
            description: "Obtén mas información sobre mi"
        }
    },

    commands: {
        say: {
            description: "Permite a Nano decir algo por ti",
            options: {
                message: {
                    name: "mensaje",
                    description: "El mensaje que quieres que nano repita por ti"
                }
            }
        },

        status: { description: "Devuelve información sobre el estado del bot" },

        help: {
            description: "Obtén información sobre los comandos disponibles"
        },

        user: {
            description: "Obtén la información sobre un usuario",

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

    say: { invalidMessage: "El mensaje especificado no es valido" },

    help: {
        intro: name => `Hola, soy ${bold(`${name}!`)} ${es.bot.description}`,
        usage: "Para obtener ayuda, selecciona una categoría a traves del menu",

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
        }
    }
};
