export const f = {
    h1: (str: string) => `# ${str}`,
    h2: (str: string) => `## ${str}`,
    h3: (str: string) => `### ${str}`,
    small: (str: string) => `-# ${str}`,

    bold: (str: string) => `**${str}**`,
    italic: (str: string) => `*${str}*`,
    under: (str: string) => `__${str}__`,

    quote: (str: string) => `> ${str}`,
    spoiler: (str: string) => `||${str}||`,
    link: (str: string, link: string) => `[${str}](${link})`,

    code: (str: string) => `\`${str}\``,
    block: (str: string, lang?: string) =>
        [lang ? "```" + lang : "```", str, "```"].join("\n"),

    list: (items: string[], ordered: boolean = false) =>
        ordered
            ? items.map((item, index) => `${index + 1}. ${item}`).join("\n")
            : items.map(item => `- ${item}`).join("\n"),

    channel: (id: string) => `<#${id}>`,
    command: (str: string, id?: string) =>
        id ? `</${str}:${id}>` : f.code(`/${str}`)
};
