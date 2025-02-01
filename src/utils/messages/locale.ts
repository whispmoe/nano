import type { NestedKeyPaths } from "@/types/nestedKeyPaths.js";

import config from "@/config.js";
import { Locale, type LocalizationMap } from "discord.js";

import { en } from "@/locales/en.js";
import { es } from "@/locales/es.js";

export type LocaleObject = typeof en;
export type LocaleKey = NestedKeyPaths<LocaleObject>;

const locales: Partial<Record<Locale, LocaleObject>> = {
    "en-US": en,
    "en-GB": en,
    "es-ES": es,
    "es-419": es
};

/**
 * Dynamically builds a localization map for the specified key by iterating over
 * it for all available locales
 *
 * @param key The key to build the localization map for
 *
 * @returns   A localization map for the specified key
 */
export const localeMap = (key: LocaleKey): LocalizationMap => {
    const localizations: Record<string, string> = {};

    for (const [localeKey, localeObject] of Object.entries(locales)) {
        const keys = key.split(".");
        let value: any = localeObject;
        for (const key of keys) value = value?.[key];

        // throw if the specified key requires templates
        if (typeof value === "function")
            throw new Error(
                `The key ${key} requires templates. However, locale maps can only be built for string keys`
            );

        if (typeof value === "string") localizations[localeKey] = value;
    }

    return localizations;
};

/**
 * Get a string in the specified locale
 *
 * @param key    The key to get the localized string from
 *
 * @param locale The locale to get the string as. If not provided, will fallback
 *               to `config.defaultLocale`, and ultimately `Locale.EnglishUS`
 *
 * @param args   Any additional arguments to pass to the specified locale key,
 *               if it has any templates
 *
 * @returns      A string corresponding to the specified key and locale, or any
 *               of the fallback locales if not available. If the specified key
 *               is not available at all, returns the specified key as a string
 */
export const locale = (
    key: LocaleKey,
    locale?: Locale | null,
    ...args: unknown[]
): string => {
    if (!locale) locale = config.defaultLocale;
    const fallbackLocales = [locale, config.defaultLocale, Locale.EnglishUS];

    for (const fallbackLocale of fallbackLocales) {
        const localeData = locales[fallbackLocale];
        if (!localeData) continue;

        let value: any = localeData;

        // traverse the locale object for the specified key
        for (const keySegment of key.split(".")) value = value?.[keySegment];
        if (typeof value === "string") return value;

        // if the locale key is a function (a string with templates)...
        if (typeof value === "function")
            // spread any additional arguments to it
            return value(...args);
    }

    return key;
};
