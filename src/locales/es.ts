import type { LocaleObject } from "@/utils/messages/locale.js";
import { f } from "@/utils/messages/formatting.js";

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
        error: {
            default: "Algo ha salido mal...",
            insufficientPermissions:
                "No tienes suficientes permisos para usar este comando!",

            scope: {
                guild: "Este comando solo puede ser usando en un server!",
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
        }
    },

    say: { invalidMessage: "El mensaje especificado no es valido" },

    help: {
        intro: name => `Hola, soy ${f.bold(`${name}!`)} ${es.bot.description}`,
        usage: "Para obtener ayuda, selecciona una categoría a traves del menu",

        category: {
            select: "Seleccionar una categoría",
            notExists: "La categoría seleccionada no existe!",
            noDescription: "Esta categoría no tiene una descripción"
        }
    },

    status: {
        title: "Estado del bot",
        pinging: "Enviando ping...",

        latency: {
            api: "Latencia de la API",
            bot: "Latencia del bot",
            error: "No se pudo obtener información sobre la latencia del bot"
        },

        uptime: {
            title: "Tiempo en linea",
            value: (uptime: string) =>
                `Nano ha estado despierta por ${f.bold(uptime)}`
        }
    }
};
