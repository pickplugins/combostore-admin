"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import en from "../messages/en.json";
import bn from "../messages/bn.json";

/*
  Client-side locale switching for the marketing site.

  `next-intl` is in package.json but nothing is wired to it: there is no
  i18n request config, no middleware and no locale segment in `app/`, and
  `app/layout.jsx` is a client component, so the server-side
  `NextIntlClientProvider` route is not available without restructuring the
  app directory. This keeps the switch self-contained.

  The message files are namespaced the way next-intl expects, so moving to it
  later is a matter of mounting the provider and swapping `useI18n().t` for
  `useTranslations("landing")` -- the JSON does not have to change.
*/

export const DEFAULT_LOCALE = "en";

export const LOCALES = [
  { code: "en", label: "English", short: "EN" },
  { code: "bn", label: "বাংলা", short: "বাং" },
];

const MESSAGES = { en, bn };

const STORAGE_KEY = "combostore.locale";

const LocaleContext = createContext(null);

function lookup(tree, path) {
  return path
    .split(".")
    .reduce((node, key) => (node == null ? undefined : node[key]), tree);
}

export function LocaleProvider({ children, defaultLocale = DEFAULT_LOCALE }) {
  /*
    The server render and the first client render have to agree, so the stored
    choice is read after mount rather than during render. A returning Bangla
    reader therefore sees English for one paint -- the alternative is a locale
    cookie read on the server, which this app has no server component to do.
  */
  const [locale, setLocaleState] = useState(defaultLocale);

  useEffect(() => {
    /*
      `?lang=bn` wins over the stored choice, so a campaign link, a QR code or
      a share can open the page in a given language, and it is then remembered
      like any other choice.
    */
    let fromQuery = null;
    try {
      fromQuery = new URLSearchParams(window.location.search).get("lang");
    } catch {
      // Nothing to read: fall through to storage.
    }

    if (fromQuery && MESSAGES[fromQuery]) {
      setLocaleState(fromQuery);
      try {
        window.localStorage.setItem(STORAGE_KEY, fromQuery);
      } catch {
        // Not remembered, but this visit still honours the link.
      }
      return;
    }

    let stored = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Private mode or blocked storage: stay on the default.
    }
    if (stored && MESSAGES[stored]) setLocaleState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next) => {
    if (!MESSAGES[next]) return;
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // The switch still works for this visit, it just will not be remembered.
    }
  }, []);

  const value = useMemo(() => {
    /*
      A key missing from the active locale falls back to English rather than
      printing the raw path, so a half-finished translation degrades to a
      readable page.
    */
    function t(path) {
      const hit = lookup(MESSAGES[locale], path);
      if (typeof hit === "string") return hit;

      const fallback = lookup(MESSAGES[DEFAULT_LOCALE], path);
      if (typeof fallback === "string") {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`[i18n] missing ${locale} string: ${path}`);
        }
        return fallback;
      }

      if (process.env.NODE_ENV !== "production") {
        console.warn(`[i18n] unknown string: ${path}`);
      }
      return path;
    }

    return { locale, setLocale, t, isBangla: locale === "bn" };
  }, [locale, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useI18n must be used inside <LocaleProvider>");
  }
  return ctx;
}
