"use client";

import { useState } from "react";
import { Hind_Siliguri } from "next/font/google";
import {
  ArrowRight,
  Boxes,
  Check,
  ClipboardList,
  Globe,
  Headset,
  Image as ImageIcon,
  Layers,
  Menu,
  Package,
  Receipt,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
  Wallet,
  X,
  Zap,
} from "lucide-react";

import { LocaleProvider, LOCALES, useI18n } from "./i18n";

/*
  Marketing landing page for ComboStore.

  Positioned as a headless commerce platform - WordPress for the admin and
  content, Next.js for the storefront - rather than the receipt/cash-memo
  styling this page used to carry. The local payment rails are still the
  differentiator and keep a section of their own; they are no longer the
  page's whole visual identity.

  BILINGUAL

  Every string comes from `messages/en.json` and `messages/bn.json` through
  `components/i18n.jsx`; nothing user-facing is hard-coded here. The arrays
  below keep only what is not copy - the icon, the anchor, the ordering - and
  name a key the catalogue fills in.

  Two things change with the locale beyond the words:

    - Geist carries no Bengali glyphs, so Hind Siliguri is loaded and sits
      first in the font stack under `bn`. It stays last in the stack under
      `en` so the one Bangla string on the English page (the AI panel's
      "write in Bangla" chip) still has a real font to resolve against.
    - Bangla needs more leading and no negative tracking: `tracking-tight` on
      a 3.4rem headline clips the ascenders, so the heading classes swap.

  Typography otherwise comes from the Geist variables the root layout already
  loads, so there is no render-blocking @import here. `globals.css` sets `body`
  to Arial and styles every bare `<button>`, so the root sets its own
  font-family and the real buttons carry `!` overrides.
*/

const bangla = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bangla",
  display: "swap",
});

/* Icon and catalogue key only - the title and description are translated. */
const FEATURES = [
  { key: "orders", icon: ClipboardList },
  { key: "products", icon: Package },
  { key: "stock", icon: Boxes },
  { key: "purchases", icon: Receipt },
  { key: "delivery", icon: Truck },
  { key: "payments", icon: Wallet },
  { key: "support", icon: Headset },
  { key: "ai", icon: Sparkles },
  { key: "media", icon: ImageIcon },
];

const NAV_LINKS = [
  { key: "platform", href: "#platform" },
  { key: "features", href: "#features" },
  { key: "ai", href: "#ai" },
  { key: "payments", href: "#payments" },
  { key: "pricing", href: "#pricing" },
];

const STACK = [
  { key: "wordpress", step: "01" },
  { key: "api", step: "02" },
  { key: "storefront", step: "03" },
];

const PAYMENTS = [
  { key: "bkash", accent: "text-pink-600", ring: "ring-pink-100" },
  { key: "nagad", accent: "text-orange-600", ring: "ring-orange-100" },
  { key: "rocket", accent: "text-violet-600", ring: "ring-violet-100" },
  { key: "cod", accent: "text-emerald-600", ring: "ring-emerald-100" },
];

/*
  Pricing tiers. Only the shape lives here - the plan name, the amount, the
  period and every checklist row come from the catalogue, so Bangla gets
  Bengali numerals and its own taka formatting rather than one number
  formatted in English for both. `points` names its rows one by one because
  `t` resolves strings, not arrays.

  `featured` marks the recommended tier, and `points` reads in order - each
  plan opens by inheriting the one above it.
*/
const PLANS = [
  {
    key: "starter",
    href: "/onboard",
    points: ["modules", "products", "payments", "deploy", "ai", "support"],
  },
  {
    key: "business",
    href: "/onboard",
    featured: true,
    points: ["everything", "products", "staff", "ai", "courier", "support"],
  },
  {
    key: "enterprise",
    href: "#contact",
    points: ["everything", "warehouses", "integrations", "migration", "sla", "support"],
  },
];

const PRICING_NOTES = ["trial", "vat", "hosting"];

/*
  Counts taken from what the platform actually ships, not benchmark numbers -
  nothing here is a performance claim the page cannot stand behind. The values
  live in the catalogue too, so Bangla gets Bengali numerals.
*/
const PROOF = ["modules", "payments", "deploy", "languages"];

const AI_POINTS = ["descriptions", "blog", "bilingual", "editable"];

function SectionLabel({ children, tone = "light" }) {
  const styles =
    tone === "dark"
      ? "border-white/15 bg-white/5 text-emerald-300"
      : "border-zinc-200 bg-white text-emerald-700";

  return (
    <span
      className={`mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-wide ${styles}`}>
      <span className="size-1.5 rounded-full bg-emerald-500" />
      {children}
    </span>
  );
}

function Logo({ tone = "light" }) {
  return (
    <div
      className={`flex items-center gap-2.5 text-[17px] font-semibold tracking-tight ${tone === "dark" ? "text-white" : "text-zinc-900"
        }`}>
      <span className="flex size-8 items-center justify-center rounded-xl bg-emerald-600 text-[13px] font-bold text-white">
        CS
      </span>
      ComboStore
    </div>
  );
}

/*
  Language switch. A two-option segmented control rather than a dropdown: with
  exactly two locales a select costs an extra click and hides the alternative.
  `globals.css` styles every bare <button>, hence the `!` overrides.
*/
function LanguageSwitch({ className = "" }) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t("landing.nav.language")}
      className={`inline-flex shrink-0 items-center rounded-lg border border-zinc-200 bg-zinc-50 p-0.5 ${className}`}>
      {LOCALES.map((item) => {
        const active = item.code === locale;
        return (
          <button
            key={item.code}
            type="button"
            lang={item.code}
            onClick={() => setLocale(item.code)}
            aria-pressed={active}
            title={item.label}
            className={`!rounded-md !border-0 !px-2.5 !py-1 !text-xs !font-medium !shadow-none transition-colors ${active
              ? "!bg-white !text-zinc-900 !shadow-sm"
              : "!bg-transparent !text-zinc-500 hover:!text-zinc-800"
              }`}>
            {item.short}
          </button>
        );
      })}
    </div>
  );
}

/* Illustrative storefront UI. Decorative, so it is hidden from screen
   readers rather than described - the copy beside it carries the meaning. */
function StorefrontMock() {
  const { t } = useI18n();

  const products = [
    { tone: "bg-emerald-100", bar: "w-3/4", price: t("landing.mock.price1") },
    { tone: "bg-amber-100", bar: "w-2/3", price: t("landing.mock.price2") },
    { tone: "bg-sky-100", bar: "w-4/5", price: t("landing.mock.price3") },
    { tone: "bg-rose-100", bar: "w-1/2", price: t("landing.mock.price4") },
  ];

  return (
    <div aria-hidden="true" className="relative">

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-900/10">

        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-3">
          <span className="size-2.5 rounded-full bg-zinc-300" />
          <span className="size-2.5 rounded-full bg-zinc-300" />
          <span className="size-2.5 rounded-full bg-zinc-300" />
          <div className="ml-2 flex flex-1 items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-[11px] text-zinc-400 ring-1 ring-zinc-200">
            <ShieldCheck size={11} className="text-emerald-500" />
            {t("landing.mock.url")}
          </div>
        </div>

        {/* Storefront header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span className="size-5 rounded-md bg-emerald-600" />
            <span className="h-2 w-16 rounded-full bg-zinc-200" />
          </div>
          <div className="flex items-center gap-3">
            <Search size={13} className="text-zinc-300" />
            <div className="relative">
              <span className="block size-4 rounded-sm border-[1.5px] border-zinc-300" />
              <span className="absolute -right-1 -top-1 flex size-3.5 items-center justify-center rounded-full bg-emerald-600 text-[8px] font-bold text-white">
                3
              </span>
            </div>
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-3 p-5 sm:gap-4">
          {products.map((p, i) => (
            <div key={i} className="rounded-xl border border-zinc-100 p-2.5">
              <div className={`mb-2.5 h-16 rounded-lg sm:h-20 ${p.tone}`} />
              <div className={`mb-1.5 h-1.5 rounded-full bg-zinc-200 ${p.bar}`} />
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-zinc-800">
                  {p.price}
                </span>
                <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[8px] font-semibold tracking-wide text-emerald-700">
                  {t("landing.mock.inStock")}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/*
        Floating callouts. Hidden below `sm`, where there is not enough room
        for them to sit outside the card without covering the grid.
      */}
      <div className="absolute -left-4 bottom-8 hidden items-center gap-2.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 shadow-xl shadow-zinc-900/10 sm:flex lg:-left-10">
        <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-50">
          <Check size={14} className="text-emerald-600" />
        </span>
        <span className="text-left">
          <span className="block text-[11px] font-semibold text-zinc-900">
            {t("landing.mock.orderNo")}
          </span>
          <span className="block text-[10px] text-zinc-500">
            {t("landing.mock.paidWith")}
          </span>
        </span>
      </div>

      <div className="absolute -right-3 -top-4 hidden items-center gap-2.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 shadow-xl shadow-zinc-900/10 sm:flex lg:-right-8">
        <span className="flex size-7 items-center justify-center rounded-lg bg-zinc-900">
          <Zap size={14} className="text-emerald-400" />
        </span>
        <span className="text-left">
          <span className="block text-[11px] font-semibold text-zinc-900">
            {t("landing.mock.staticTitle")}
          </span>
          <span className="block text-[10px] text-zinc-500">
            {t("landing.mock.staticDesc")}
          </span>
        </span>
      </div>

    </div>
  );
}

function LandingContent() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, isBangla } = useI18n();

  /*
    Bangla sits lower on the line and has no use for negative tracking, so the
    display sizes relax rather than tighten. Everything else is shared.
  */
  const h1Type = isBangla
    ? "leading-[1.35] tracking-normal"
    : "leading-[1.08] tracking-tight";
  const h2Type = isBangla ? "leading-snug tracking-normal" : "tracking-tight";
  const headingType = isBangla ? "tracking-normal" : "tracking-tight";
  const footerHeadingType = isBangla
    ? "tracking-normal"
    : "tracking-wider";

  const fontStack = isBangla
    ? "var(--font-bangla), var(--font-geist-sans), system-ui, sans-serif"
    : "var(--font-geist-sans), var(--font-bangla), system-ui, sans-serif";

  return (
    <div
      className={`${bangla.variable} min-h-screen w-full bg-white text-zinc-900 antialiased`}
      style={{ fontFamily: fontStack }}>

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">

          <a href="#top" className="shrink-0">
            <Logo />
          </a>

          <div className="hidden items-center gap-8 text-sm text-zinc-600 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-zinc-900">
                {t(`landing.nav.${link.key}`)}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <LanguageSwitch />
            <a
              href="/onboard"
              className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700">
              {t("landing.nav.deploy")}
              <ArrowRight size={14} />
            </a>
          </div>

          {/*
            On phones the switch sits beside the menu toggle rather than inside
            the drawer, so changing language never costs an extra tap.
          */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitch />
            {/* `globals.css` styles every bare <button>, hence the overrides. */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={t("landing.nav.toggleMenu")}
              className="!rounded-lg !border !border-zinc-200 !bg-white !p-2 !text-zinc-700 !shadow-none">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

        </nav>

        {menuOpen && (
          <div className="border-t border-zinc-200 bg-white px-6 py-4 md:hidden">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-2 py-2.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900">
                  {t(`landing.nav.${link.key}`)}
                </a>
              ))}
              <a
                href="/onboard"
                onClick={() => setMenuOpen(false)}
                className="mt-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-center text-sm font-medium text-white">
                {t("landing.nav.deploy")}
              </a>
            </div>
          </div>
        )}
      </header>

      <main id="top">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden border-b border-zinc-200">

          <div className="pointer-events-none absolute -top-48 left-1/2 size-[760px] -translate-x-1/2 rounded-full bg-emerald-100/50 blur-3xl" />

          <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">

            <div>
              <SectionLabel>{t("landing.hero.label")}</SectionLabel>

              <h1
                className={`mb-5 text-4xl font-semibold text-zinc-900 sm:text-5xl lg:text-[3.4rem] ${h1Type}`}>
                {t("landing.hero.titleBefore")}
                <span className="text-emerald-600">
                  {t("landing.hero.titleHighlight")}
                </span>
                {t("landing.hero.titleAfter")}
              </h1>

              <p className="mb-8 max-w-lg text-lg leading-relaxed text-zinc-600">
                {t("landing.hero.body")}
              </p>

              <div className="mb-6 flex flex-wrap gap-3">
                <a
                  href="/onboard"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-colors hover:bg-emerald-700">
                  {t("landing.hero.ctaPrimary")}
                  <ArrowRight size={16} />
                </a>
                <a
                  href="#platform"
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-6 py-3.5 text-sm font-semibold text-zinc-800 transition-colors hover:border-zinc-400 hover:bg-zinc-50">
                  {t("landing.hero.ctaSecondary")}
                </a>
              </div>

              <p className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-zinc-500">
                <span className="inline-flex items-center gap-1.5">
                  <Check size={14} className="text-emerald-600" />
                  {t("landing.hero.noCard")}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check size={14} className="text-emerald-600" />
                  {t("landing.hero.support")}
                </span>
              </p>
            </div>

            <div className="lg:pl-4">
              <StorefrontMock />
            </div>

          </div>
        </section>

        {/* ── Proof band ── */}
        <section className="border-b border-zinc-200 bg-zinc-50">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden px-6 py-10 sm:py-12 lg:grid-cols-4">
            {PROOF.map((key) => (
              <div key={key} className="px-2 text-center lg:text-left">
                <div
                  className={`text-3xl font-semibold text-zinc-900 sm:text-4xl ${headingType}`}>
                  {t(`landing.proof.${key}Value`)}
                </div>
                <div className="mt-1 text-sm text-zinc-500">
                  {t(`landing.proof.${key}Label`)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Platform / architecture ── */}
        <section id="platform" className="bg-zinc-950 text-white">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">

            <div className="mb-14 max-w-2xl">
              <SectionLabel tone="dark">{t("landing.platform.label")}</SectionLabel>
              <h2
                className={`mb-4 text-3xl font-semibold sm:text-4xl ${h2Type}`}>
                {t("landing.platform.title")}
              </h2>
              <p className="text-lg leading-relaxed text-zinc-400">
                {t("landing.platform.body")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {STACK.map((item) => (
                <div
                  key={item.key}
                  className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-colors hover:border-white/20">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="text-xs font-medium tracking-widest text-emerald-400">
                      {item.step}
                    </span>
                    <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-zinc-400">
                      {t(`landing.stack.${item.key}.kicker`)}
                    </span>
                  </div>
                  <h3
                    className={`mb-2.5 text-xl font-semibold ${headingType}`}>
                    {t(`landing.stack.${item.key}.title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    {t(`landing.stack.${item.key}.desc`)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-2xl border border-white/10 bg-white/[0.03] px-7 py-5 text-sm text-zinc-400">
              <span className="inline-flex items-center gap-2">
                <Globe size={15} className="text-emerald-400" />
                {t("landing.platform.seo")}
              </span>
              <span className="inline-flex items-center gap-2">
                <Layers size={15} className="text-emerald-400" />
                {t("landing.platform.oneDeploy")}
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck size={15} className="text-emerald-400" />
                {t("landing.platform.jwt")}
              </span>
            </div>

          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="mx-auto max-w-6xl px-6 py-20 sm:py-24">

          <div className="mb-14 max-w-2xl">
            <SectionLabel>{t("landing.features.label")}</SectionLabel>
            <h2 className={`mb-4 text-3xl font-semibold sm:text-4xl ${h2Type}`}>
              {t("landing.features.title")}
            </h2>
            <p className="text-lg leading-relaxed text-zinc-600">
              {t("landing.features.body")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.key}
                  className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-900/5">
                  <span className="mb-4 flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                    <Icon size={18} />
                  </span>
                  <h3
                    className={`mb-2 text-base font-semibold text-zinc-900 ${headingType}`}>
                    {t(`landing.features.items.${f.key}.title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-600">
                    {t(`landing.features.items.${f.key}.desc`)}
                  </p>
                </div>
              );
            })}
          </div>

        </section>

        {/* ── AI assistant ── */}
        <section id="ai" className="border-y border-zinc-200 bg-zinc-50">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 py-20 sm:py-24 lg:grid-cols-2">

            <div>
              <SectionLabel>{t("landing.ai.label")}</SectionLabel>
              <h2 className={`mb-4 text-3xl font-semibold sm:text-4xl ${h2Type}`}>
                {t("landing.ai.title")}
              </h2>
              <p className="mb-7 text-lg leading-relaxed text-zinc-600">
                {t("landing.ai.body")}
              </p>
              <ul className="space-y-3.5">
                {AI_POINTS.map((key) => (
                  <li key={key} className="flex items-start gap-3 text-sm text-zinc-700">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                      <Check size={12} className="text-emerald-700" />
                    </span>
                    {t(`landing.ai.points.${key}`)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-900/5">
              <div className="flex items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-3">
                <Sparkles size={13} className="text-emerald-600" />
                <span className="text-xs font-medium text-zinc-500">
                  {t("landing.ai.panelTitle")}
                </span>
              </div>
              <div className="p-6">
                <div className="mb-5 rounded-xl bg-zinc-100 px-4 py-3 text-sm text-zinc-600">
                  {t("landing.ai.prompt")}
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 px-4 py-3.5 text-sm leading-relaxed text-zinc-800">
                  {t("landing.ai.answer")}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white">
                    {t("landing.ai.useDraft")}
                  </span>
                  <span className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600">
                    {t("landing.ai.regenerate")}
                  </span>
                  {/*
                    The chip advertises the assistant's other language, so it
                    reads "বাংলায় লিখুন" on the English page and "Write in
                    English" on the Bangla one. `lang` flips with it so the
                    right font and hyphenation rules apply.
                  */}
                  <span
                    lang={isBangla ? "en" : "bn"}
                    className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600">
                    {t("landing.ai.otherLanguage")}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── Payments ── */}
        <section id="payments" className="mx-auto max-w-6xl px-6 py-20 sm:py-24">

          <div className="mb-14 max-w-2xl">
            <SectionLabel>{t("landing.payments.label")}</SectionLabel>
            <h2 className={`mb-4 text-3xl font-semibold sm:text-4xl ${h2Type}`}>
              {t("landing.payments.title")}
            </h2>
            <p className="text-lg leading-relaxed text-zinc-600">
              {t("landing.payments.body")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PAYMENTS.map((p) => (
              <div
                key={p.key}
                className="rounded-2xl border border-zinc-200 bg-white p-6">
                <div
                  className={`mb-3 inline-flex rounded-lg px-2.5 py-1 text-lg font-semibold ring-1 ${headingType} ${p.accent} ${p.ring}`}>
                  {t(`landing.payments.items.${p.key}.name`)}
                </div>
                <p className="text-sm leading-relaxed text-zinc-600">
                  {t(`landing.payments.items.${p.key}.desc`)}
                </p>
              </div>
            ))}
          </div>

        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="border-y border-zinc-200 bg-zinc-50">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">

            <div className="mb-14 max-w-2xl">
              <SectionLabel>{t("landing.pricing.label")}</SectionLabel>
              <h2 className={`mb-4 text-3xl font-semibold sm:text-4xl ${h2Type}`}>
                {t("landing.pricing.title")}
              </h2>
              <p className="text-lg leading-relaxed text-zinc-600">
                {t("landing.pricing.body")}
              </p>
            </div>

            {/*
              The featured card takes the dark treatment the architecture
              section and the closing CTA already use, so the middle tier reads
              as the recommended one without introducing a second accent. It
              only breaks out of the row from `lg` up, where the three cards
              sit side by side - stacked on a phone there is no row to break.
            */}
            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
              {PLANS.map((plan) => {
                const featured = Boolean(plan.featured);
                const base = `landing.pricing.plans.${plan.key}`;

                return (
                  <div
                    key={plan.key}
                    className={`relative flex flex-col rounded-2xl border p-7 ${
                      featured
                        ? "border-zinc-950 bg-zinc-950 text-white shadow-xl shadow-zinc-900/20 lg:-my-3 lg:py-10"
                        : "border-zinc-200 bg-white"
                    }`}>

                    {featured && (
                      <span className="absolute right-7 top-7 rounded-full border border-emerald-400/25 bg-emerald-500/15 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
                        {t("landing.pricing.popular")}
                      </span>
                    )}

                    <h3 className={`text-lg font-semibold ${headingType}`}>
                      {t(`${base}.name`)}
                    </h3>
                    <p
                      className={`mt-1.5 max-w-[15rem] text-sm leading-relaxed ${
                        featured ? "text-zinc-400" : "text-zinc-600"
                      }`}>
                      {t(`${base}.tagline`)}
                    </p>

                    <div className="mt-7 flex flex-wrap items-baseline gap-x-1.5">
                      <span className={`text-4xl font-semibold ${headingType}`}>
                        {t(`${base}.price`)}
                      </span>
                      <span
                        className={`text-sm ${featured ? "text-zinc-400" : "text-zinc-500"}`}>
                        {t(`${base}.period`)}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-zinc-500">
                      {t(`${base}.note`)}
                    </p>

                    <a
                      href={plan.href}
                      className={`mt-7 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors ${
                        featured
                          ? "bg-emerald-600 text-white hover:bg-emerald-500"
                          : "border border-zinc-300 bg-white text-zinc-800 hover:border-zinc-400 hover:bg-zinc-50"
                      }`}>
                      {t(`${base}.cta`)}
                      <ArrowRight size={15} />
                    </a>

                    <div className={`my-7 h-px ${featured ? "bg-white/10" : "bg-zinc-200"}`} />

                    <p
                      className={`mb-4 text-xs font-semibold ${footerHeadingType} ${
                        featured ? "text-zinc-500" : "text-zinc-400"
                      }`}>
                      {t("landing.pricing.includes")}
                    </p>
                    <ul className="space-y-3.5">
                      {plan.points.map((point) => (
                        <li
                          key={point}
                          className={`flex items-start gap-3 text-sm leading-relaxed ${
                            featured ? "text-zinc-300" : "text-zinc-700"
                          }`}>
                          <span
                            className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
                              featured ? "bg-emerald-500/15" : "bg-emerald-100"
                            }`}>
                            <Check
                              size={12}
                              className={featured ? "text-emerald-300" : "text-emerald-700"}
                            />
                          </span>
                          {t(`${base}.points.${point}`)}
                        </li>
                      ))}
                    </ul>

                  </div>
                );
              })}
            </div>

            <p className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-2.5 text-sm text-zinc-500">
              {PRICING_NOTES.map((key) => (
                <span key={key} className="inline-flex items-center gap-1.5">
                  <Check size={14} className="text-emerald-600" />
                  {t(`landing.pricing.notes.${key}`)}
                </span>
              ))}
            </p>

          </div>
        </section>

        {/* ── CTA ── */}
        <section id="contact" className="mx-auto max-w-6xl px-6 pb-20 sm:pb-24">
          <div className="relative overflow-hidden rounded-3xl bg-zinc-950 px-8 py-16 text-center sm:px-12">

            <div className="pointer-events-none absolute -bottom-32 left-1/2 size-[520px] -translate-x-1/2 rounded-full bg-emerald-600/20 blur-3xl" />

            <div className="relative">
              <h2
                className={`mb-4 text-3xl font-semibold text-white sm:text-4xl ${h2Type}`}>
                {t("landing.cta.title")}
              </h2>
              <p className="mx-auto mb-8 max-w-lg text-lg leading-relaxed text-zinc-400">
                {t("landing.cta.body")}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href="/onboard"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500">
                  {t("landing.cta.primary")}
                  <ArrowRight size={16} />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5">
                  {t("landing.cta.secondary")}
                </a>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-6 py-14">

          <div className="flex flex-wrap justify-between gap-10">

            <div className="max-w-xs">
              <Logo />
              <p className="mt-3.5 text-sm leading-relaxed text-zinc-600">
                {t("landing.footer.tagline")}
              </p>
            </div>

            <div className="flex flex-wrap gap-x-14 gap-y-8">
              <div>
                <h4
                  className={`mb-3.5 text-xs font-semibold text-zinc-400 ${footerHeadingType}`}>
                  {t("landing.footer.platformHeading")}
                </h4>
                <div className="flex flex-col gap-2.5 text-sm">
                  <a href="#platform" className="text-zinc-600 hover:text-emerald-700">
                    {t("landing.footer.architecture")}
                  </a>
                  <a href="#features" className="text-zinc-600 hover:text-emerald-700">
                    {t("landing.footer.features")}
                  </a>
                  <a href="#ai" className="text-zinc-600 hover:text-emerald-700">
                    {t("landing.footer.aiAssistant")}
                  </a>
                  <a href="#pricing" className="text-zinc-600 hover:text-emerald-700">
                    {t("landing.footer.pricing")}
                  </a>
                </div>
              </div>
              <div>
                <h4
                  className={`mb-3.5 text-xs font-semibold text-zinc-400 ${footerHeadingType}`}>
                  {t("landing.footer.paymentsHeading")}
                </h4>
                <div className="flex flex-col gap-2.5 text-sm">
                  <a href="#payments" className="text-zinc-600 hover:text-emerald-700">
                    {t("landing.payments.items.bkash.name")}
                  </a>
                  <a href="#payments" className="text-zinc-600 hover:text-emerald-700">
                    {t("landing.payments.items.nagad.name")}
                  </a>
                  <a href="#payments" className="text-zinc-600 hover:text-emerald-700">
                    {t("landing.payments.items.rocket.name")}
                  </a>
                </div>
              </div>
              <div>
                <h4
                  className={`mb-3.5 text-xs font-semibold text-zinc-400 ${footerHeadingType}`}>
                  {t("landing.footer.companyHeading")}
                </h4>
                <div className="flex flex-col gap-2.5 text-sm">
                  <a href="#contact" className="text-zinc-600 hover:text-emerald-700">
                    {t("landing.footer.contact")}
                  </a>
                  <a href="/onboard" className="text-zinc-600 hover:text-emerald-700">
                    {t("landing.footer.deploy")}
                  </a>
                </div>
              </div>
              {/*
                The documents live at their own routes rather than in this
                bilingual catalogue: a machine-translated contract is a
                liability, so only these labels are translated - see the note
                in `components/legal/LegalPage.jsx`.
              */}
              <div>
                <h4
                  className={`mb-3.5 text-xs font-semibold text-zinc-400 ${footerHeadingType}`}>
                  {t("landing.footer.legalHeading")}
                </h4>
                <div className="flex flex-col gap-2.5 text-sm">
                  <a href="/terms" className="text-zinc-600 hover:text-emerald-700">
                    {t("landing.footer.terms")}
                  </a>
                  <a href="/privacy" className="text-zinc-600 hover:text-emerald-700">
                    {t("landing.footer.privacy")}
                  </a>
                  <a href="/refund" className="text-zinc-600 hover:text-emerald-700">
                    {t("landing.footer.refund")}
                  </a>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-6 text-xs text-zinc-500">
            <span>{t("landing.footer.copyright")}</span>
            <span className="flex items-center gap-4">
              {t("landing.footer.location")}
              <LanguageSwitch />
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
}

export default function ComboStoreLanding() {
  return (
    <LocaleProvider>
      <LandingContent />
    </LocaleProvider>
  );
}
