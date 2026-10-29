"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Hind_Siliguri } from "next/font/google";
import {
  ArrowRight,
  Banknote,
  Bike,
  Boxes,
  ChartColumn,
  Check,
  ChevronDown,
  ClipboardList,
  CreditCard,
  FileText,
  Globe,
  Headset,
  Image as ImageIcon,
  Layers,
  LayoutTemplate,
  MapPin,
  Megaphone,
  Menu,
  MousePointerClick,
  Package,
  PanelsTopLeft,
  Plug,
  Receipt,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Store,
  Truck,
  Users,
  Wallet,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";

import { LocaleProvider, LOCALES, useI18n } from "./i18n";

/*
  Marketing landing page for ComboStore.

  Positioned as a headless commerce platform - WordPress for the admin and
  content, Next.js for the storefront. The platform ships twelve modules and
  sixty-five named features, which is the whole problem this page has to
  solve: a flat grid of sixty-five cards is a wall nobody reads, and hiding
  them behind tabs asks the visitor to work for the one claim that sells the
  product.

  So the page is built around three places where the visitor drives:

    - The hero mock is a tab strip. Orders, catalogue, insights and the
      storefront are four screens of the same product, and letting someone
      click between them says "one dashboard" better than a sentence can.
    - The modules (#features) are the centrepiece: twelve bands, the copy
      changing sides as you go down, each one's features listed beside it in
      a grid. A search box over the lot narrows it to the bands that answer
      - type "refund", "courier" or "pixel" and only the modules holding
      them are drawn. That search is the only honest way to make sixty-five
      features findable; the bands are what make them readable.
    - The page builder, payments, AI and FAQ sections each switch between
      groups in place rather than printing every group at once.

  INTERACTIVITY RULES THAT APPLY THROUGHOUT

    - Everything is keyboard-operable. The four tab strips - the hero mock,
      the element palette, the payment groups and the assistant - follow the
      ARIA tabs pattern with a roving tabindex and arrow keys.
    - Nothing animates for someone who asked it not to: `useReducedMotion`
      gates the counters, the hero's auto-advance and the builder's fake
      latency, and the keyframes in `PAGE_CSS` are turned off by a media
      query as well, so even a mid-flight animation stops.
    - The hero stops rotating for good the moment a visitor picks a tab -
      fighting someone's click is worse than no motion at all.
    - No interaction is load-bearing: every feature name, price and answer is
      in the DOM on first paint behind `hidden`, so the page still reads with
      JS broken and a crawler still indexes the lot.

  BILINGUAL

  Every string comes from `messages/en.json` and `messages/bn.json` through
  `components/i18n.jsx`; nothing user-facing is hard-coded here. The arrays
  below keep only what is not copy - the icon, the anchor, the ordering, the
  accent colour - and name a key the catalogue fills in. `tList` reads the
  lists (a module's features, a mock table's rows) and `n` renders numbers
  the page works out for itself, so a counter counts up in Bengali numerals
  under `bn`.

  Three things change with the locale beyond the words:

    - Geist carries no Bengali glyphs, so Hind Siliguri is loaded and sits
      first in the font stack under `bn`. It stays last in the stack under
      `en` so the one Bangla string on the English page (the AI panel's
      "write in Bangla" chip) still has a real font to resolve against.
    - Bangla needs more leading and no negative tracking: `tracking-tight` on
      a 3.4rem headline clips the ascenders, so the heading classes swap.
    - Search is case-folded with `toLowerCase`, which is a no-op for Bengali
      script and still correct for the Latin feature names beside it.

  Typography otherwise comes from the Geist variables the root layout already
  loads, so there is no render-blocking @import here. `globals.css` sets `body`
  to Arial and styles every bare `<button>`, `<input>` and `<table>`, so the
  root sets its own font-family, the real controls carry `!` overrides, and
  the mock listings are built from divs rather than fighting a global
  `table { border: 1px solid #ccc }`.
*/

const bangla = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bangla",
  display: "swap",
});

/*
  The three keyframes the page needs, and the one global it sets.

  Tailwind v4 reads its theme from `globals.css`, which this page does not
  own, so rather than register animations app-wide for one route they live
  here beside the markup that uses them. Each one is switched off under
  `prefers-reduced-motion`, which also stops an animation already running -
  something a JS media-query check cannot do on its own.
*/
const PAGE_CSS = `
@keyframes cs-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes cs-rise { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@keyframes cs-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
.cs-marquee { animation: cs-marquee 34s linear infinite; }
.cs-rise { animation: cs-rise 0.32s ease-out both; }
.cs-pulse { animation: cs-pulse 1.1s ease-in-out infinite; }
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) {
  .cs-marquee, .cs-rise, .cs-pulse { animation: none !important; }
  html { scroll-behavior: auto; }
}
`;

/* Icon and catalogue key only - every name and description is translated. */
const MODULES = [
  { key: "catalog", icon: Package },
  { key: "orders", icon: ClipboardList },
  { key: "inventory", icon: Boxes },
  { key: "insights", icon: ChartColumn },
  { key: "accounting", icon: Receipt },
  { key: "delivery", icon: Truck },
  { key: "people", icon: Users },
  { key: "builder", icon: LayoutTemplate },
  { key: "content", icon: FileText },
  { key: "support", icon: Headset },
  { key: "payments", icon: Wallet },
  { key: "integrations", icon: Plug },
];

const NAV_LINKS = [
  { key: "platform", href: "#platform" },
  { key: "features", href: "#features" },
  { key: "builder", href: "#builder" },
  { key: "payments", href: "#payments" },
  { key: "pricing", href: "#pricing" },
];

/* The ids `useActiveSection` watches - the nav targets, in page order. */
const SECTION_IDS = NAV_LINKS.map((link) => link.href.slice(1));

const STACK = [
  { key: "wordpress", step: "01" },
  { key: "api", step: "02" },
  { key: "storefront", step: "03" },
];

const DEMO_TABS = [
  { key: "orders", icon: ClipboardList },
  { key: "products", icon: Package },
  { key: "insights", icon: ChartColumn },
  { key: "storefront", icon: Store },
];

const BUILDER_CATEGORIES = [
  { key: "layout", icon: PanelsTopLeft },
  { key: "content", icon: FileText },
  { key: "commerce", icon: Store },
  { key: "media", icon: ImageIcon },
  { key: "marketing", icon: Megaphone },
];

/*
  Payment methods, grouped the way a shop owner thinks about them: the wallet
  everyone pays with, the card gateway behind it, and the money that arrives
  without a gateway at all. The accent is per brand and stays out of the
  catalogue - a colour is not a translation.
*/
const PAYMENT_GROUPS = [
  {
    key: "wallets",
    icon: Smartphone,
    items: [
      { key: "bkash", accent: "text-pink-600", ring: "ring-pink-100" },
      { key: "nagad", accent: "text-orange-600", ring: "ring-orange-100" },
      { key: "rocket", accent: "text-violet-600", ring: "ring-violet-100" },
    ],
  },
  {
    key: "gateways",
    icon: CreditCard,
    items: [
      { key: "sslcommerz", accent: "text-sky-700", ring: "ring-sky-100" },
      { key: "aamarpay", accent: "text-indigo-600", ring: "ring-indigo-100" },
      { key: "paystation", accent: "text-teal-700", ring: "ring-teal-100" },
    ],
  },
  {
    key: "offline",
    icon: Banknote,
    items: [
      { key: "cod", accent: "text-emerald-700", ring: "ring-emerald-100" },
      { key: "bank", accent: "text-zinc-700", ring: "ring-zinc-200" },
    ],
  },
];

const COURIERS = [
  { key: "steadfast", icon: Truck },
  { key: "pathao", icon: Bike },
  { key: "redx", icon: Package },
  { key: "carrybee", icon: MapPin },
];

const INTEGRATIONS = [
  "facebook",
  "tiktok",
  "analytics",
  "maps",
  "clarity",
  "claude",
  "extensions",
];

/* The strip under the hero: names already translated in their own sections. */
const PARTNER_KEYS = [
  "landing.payments.items.bkash.name",
  "landing.payments.items.nagad.name",
  "landing.payments.items.rocket.name",
  "landing.payments.items.sslcommerz.name",
  "landing.payments.items.aamarpay.name",
  "landing.payments.items.paystation.name",
  "landing.couriers.items.steadfast.name",
  "landing.couriers.items.pathao.name",
  "landing.couriers.items.redx.name",
  "landing.couriers.items.carrybee.name",
  "landing.integrations.items.facebook.name",
  "landing.integrations.items.analytics.name",
];

const PLANS = [
  {
    key: "starter",
    href: "/onboard",
    points: ["modules", "websites", "products", "payments", "builder", "ai", "deploy", "support"],
  },
  {
    key: "business",
    href: "/onboard",
    featured: true,
    points: ["everything", "websites", "products", "staff", "gateways", "courier", "ai", "support"],
  },
  {
    key: "enterprise",
    href: "#contact",
    points: ["everything", "warehouses", "integrations", "migration", "sla", "support"],
  },
];

const PRICING_NOTES = ["trial", "vat", "hosting"];

const AI_TABS = ["product", "blog", "template"];

const AI_POINTS = ["descriptions", "blog", "bilingual", "editable"];

const FAQ_KEYS = ["wordpress", "hosting", "domain", "payments", "migration", "ai"];

/*
  The proof band counts what the page itself contains rather than quoting a
  figure that can drift away from the truth: add a feature to the catalogue
  and the headline number follows it the same day. The fallback only matters
  if the lists ever fail to resolve, where a zero would read as a bug.
*/
const FEATURE_TOTAL_FALLBACK = 65;

/* A mock listing row: "cell|cell|cell|cell". */
function cells(row) {
  return row.split("|").map((cell) => cell.trim());
}

/* ──────────────────────────── hooks ──────────────────────────── */

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return reduced;
}

/* True once the element has been scrolled into view, and true from then on. */
function useInView(ref) {
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || seen) return;

    /* No observer (old browser, jsdom): show the final state, not nothing. */
    if (typeof IntersectionObserver !== "function") {
      setSeen(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setSeen(true);
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, seen]);

  return seen;
}

/*
  Which section the reader is looking at, for the nav underline. The band is
  the middle of the viewport, so a section counts as current while its body
  is on screen rather than the moment its top edge appears.
*/
function useActiveSection(ids) {
  const [active, setActive] = useState("");

  useEffect(() => {
    if (typeof IntersectionObserver !== "function") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    ids.forEach((id) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

function useScrolled() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return scrolled;
}

/*
  Arrow-key movement for the tab strips, per the ARIA tabs pattern: the
  selected tab is the only one in the tab order, and the arrows move the
  selection rather than the focus ring alone - "automatic activation", which
  is the right choice for panels this cheap to swap.

  It works in element ids rather than keys so that it can both select and
  focus with one value.
*/
function useTabKeys(ids, activeId, select, { vertical = false } = {}) {
  return useCallback(
    (event) => {
      const forward = vertical ? "ArrowDown" : "ArrowRight";
      const back = vertical ? "ArrowUp" : "ArrowLeft";

      let index = ids.indexOf(activeId);
      if (index < 0) return;

      if (event.key === forward) index += 1;
      else if (event.key === back) index -= 1;
      else if (event.key === "Home") index = 0;
      else if (event.key === "End") index = ids.length - 1;
      else return;

      event.preventDefault();
      const target = ids[(index + ids.length) % ids.length];
      select(target);
      /* Focus follows the selection, or the next arrow press starts over. */
      document.getElementById(target)?.focus();
    },
    [ids, activeId, select, vertical],
  );
}

/* ──────────────────────────── pieces ──────────────────────────── */

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
      className={`flex items-center gap-2.5 text-[17px] font-semibold tracking-tight ${
        tone === "dark" ? "text-white" : "text-zinc-900"
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
            className={`!rounded-md !border-0 !px-2.5 !py-1 !text-xs !font-medium !shadow-none transition-colors ${
              active
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

/* A figure that counts up the first time it is scrolled past. */
function CountUp({ value, suffix = "" }) {
  const { n } = useI18n();
  const ref = useRef(null);
  const seen = useInView(ref);
  const reduced = useReducedMotion();
  /*
    It starts on the answer rather than on zero. The server renders this
    too, so the band reads "12 business modules" in the HTML, for a crawler
    and for a reader with no JavaScript - and the first animation frame
    sets it back to zero to count up from, which is the one frame nobody
    sees anyway.
  */
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (!seen) return;
    if (reduced) {
      setShown(value);
      return;
    }

    let frame = 0;
    const started = performance.now();
    const step = (now) => {
      const progress = Math.min(1, (now - started) / 900);
      /* Eased, so it lands on the number rather than stopping dead. */
      setShown(Math.round(value * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [seen, reduced, value]);

  return (
    <span ref={ref}>
      {n(shown)}
      {suffix}
    </span>
  );
}

/* The matched run of a feature name, marked rather than merely coloured. */
function Highlight({ text, needle }) {
  if (!needle) return text;

  const at = text.toLowerCase().indexOf(needle);
  if (at < 0) return text;

  return (
    <>
      {text.slice(0, at)}
      <mark className="rounded bg-emerald-100 px-0.5 text-emerald-900">
        {text.slice(at, at + needle.length)}
      </mark>
      {text.slice(at + needle.length)}
    </>
  );
}

function Chip({ children, tone = "zinc" }) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    sky: "bg-sky-50 text-sky-700",
    rose: "bg-rose-50 text-rose-700",
    zinc: "bg-zinc-100 text-zinc-600",
  };

  return (
    <span
      className={`inline-block rounded-md px-1.5 py-0.5 text-[10px] font-semibold whitespace-nowrap ${tones[tone]}`}>
      {children}
    </span>
  );
}

/* ─────────────────────── hero: admin preview ─────────────────────── */

/*
  A four-column mock listing. Built from divs: `globals.css` gives every
  <table> a grey border, a collapsed grid and a mobile card layout, none of
  which belongs in a product shot.
*/
function MockTable({ cols, rows, tones }) {
  /*
    The status column is `auto`, so it is as wide as its chip and never
    clips "Out of stock" mid-word on a phone. The three flexible columns
    carry `truncate`, which both ellipsises them and - because a grid item
    with hidden overflow has an automatic minimum size of zero - lets them
    give up the room.
  */
  const grid = "grid grid-cols-[1.5fr_1fr_0.7fr_auto] gap-2";

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200">
      <div
        className={`${grid} border-b border-zinc-200 bg-zinc-50 px-3 py-2 text-[10px] font-semibold tracking-wide text-zinc-400 uppercase`}>
        {cols.map((col) => (
          <span key={col} className="truncate">
            {col}
          </span>
        ))}
      </div>

      {rows.map((row, index) => {
        const [first, second, third, fourth] = cells(row);

        return (
          <div
            key={row}
            className={`${grid} items-center border-b border-zinc-100 px-3 py-2.5 text-[11px] text-zinc-600 last:border-0`}>
            <span className="truncate font-medium text-zinc-900">{first}</span>
            <span className="truncate">{second}</span>
            <span className="truncate font-medium text-zinc-900">{third}</span>
            <span className="truncate">
              <Chip tone={tones[index % tones.length]}>{fourth}</Chip>
            </span>
          </div>
        );
      })}
    </div>
  );
}

function DemoOrders() {
  const { t, tList } = useI18n();

  return (
    <div>
      <p className="mb-3 text-xs font-semibold text-zinc-500">
        {t("landing.demo.orders.heading")}
      </p>
      <MockTable
        cols={tList("landing.demo.orders.cols")}
        rows={tList("landing.demo.orders.rows")}
        tones={["amber", "sky", "emerald", "zinc"]}
      />
    </div>
  );
}

function DemoProducts() {
  const { t, tList } = useI18n();

  return (
    <div>
      <p className="mb-3 text-xs font-semibold text-zinc-500">
        {t("landing.demo.products.heading")}
      </p>
      <MockTable
        cols={tList("landing.demo.products.cols")}
        rows={tList("landing.demo.products.rows")}
        tones={["emerald", "amber", "emerald", "rose"]}
      />
    </div>
  );
}

function DemoInsights() {
  const { t, tList } = useI18n();

  /* A week of bars - decorative, so the shape is fixed here and hidden. */
  const bars = [38, 52, 44, 68, 59, 83, 72];

  return (
    <div>
      <p className="mb-3 text-xs font-semibold text-zinc-500">
        {t("landing.demo.insights.heading")}
      </p>

      <div className="mb-3 grid grid-cols-2 gap-2.5">
        {tList("landing.demo.insights.tiles").map((tile) => {
          const [label, value, change] = cells(tile);
          const tone = change.startsWith("+")
            ? "text-emerald-600"
            : change.startsWith("−") || change.startsWith("-")
              ? "text-rose-600"
              : "text-zinc-400";

          return (
            <div key={tile} className="rounded-xl border border-zinc-200 px-3 py-2.5">
              <p className="text-[10px] font-medium tracking-wide text-zinc-400 uppercase">
                {label}
              </p>
              <p className="mt-0.5 text-base font-semibold text-zinc-900">{value}</p>
              <p className={`text-[10px] font-semibold ${tone}`}>{change}</p>
            </div>
          );
        })}
      </div>

      <div
        aria-hidden="true"
        className="flex h-14 items-end gap-1.5 rounded-xl border border-zinc-200 px-3 py-2.5">
        {bars.map((height, index) => (
          <span
            key={index}
            style={{ height: `${height}%` }}
            className={`flex-1 rounded-sm ${
              index === bars.length - 1 ? "bg-emerald-500" : "bg-emerald-200"
            }`}
          />
        ))}
      </div>

      <p className="mt-3 text-[11px] text-zinc-500">{t("landing.demo.insights.caption")}</p>
    </div>
  );
}

function DemoStorefront() {
  const { t } = useI18n();

  const products = [
    { tone: "bg-emerald-100", bar: "w-3/4", price: t("landing.mock.price1") },
    { tone: "bg-amber-100", bar: "w-2/3", price: t("landing.mock.price2") },
    { tone: "bg-sky-100", bar: "w-4/5", price: t("landing.mock.price3") },
    { tone: "bg-rose-100", bar: "w-1/2", price: t("landing.mock.price4") },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200">
      <div className="flex items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-3 py-2">
        <span className="size-2 rounded-full bg-zinc-300" />
        <span className="size-2 rounded-full bg-zinc-300" />
        <div className="ml-1 flex flex-1 items-center gap-1.5 rounded-md bg-white px-2 py-0.5 text-[10px] text-zinc-400 ring-1 ring-zinc-200">
          <ShieldCheck size={10} className="text-emerald-500" />
          {t("landing.mock.url")}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-3.5">
        {products.map((product) => (
          <div key={product.price} className="rounded-lg border border-zinc-100 p-2">
            <div className={`mb-2 h-14 rounded-md ${product.tone}`} />
            <div className={`mb-1.5 h-1.5 rounded-full bg-zinc-200 ${product.bar}`} />
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-semibold text-zinc-800">{product.price}</span>
              <Chip tone="emerald">{t("landing.mock.inStock")}</Chip>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const DEMO_PANES = {
  orders: DemoOrders,
  products: DemoProducts,
  insights: DemoInsights,
  storefront: DemoStorefront,
};

/*
  The hero's product shot, as a tab strip.

  It advances on its own so the page is not dead on arrival, and stops for
  good the first time the visitor picks a tab - a carousel that keeps moving
  under someone's cursor is worse than one that never moved. Hovering or
  tabbing into it also pauses it, so a screen being read is not swapped out
  mid-sentence.
*/
function AdminDemo() {
  const { t } = useI18n();
  const reduced = useReducedMotion();
  const base = useId();

  const [active, setActive] = useState(DEMO_TABS[0].key);
  const [taken, setTaken] = useState(false);
  const [paused, setPaused] = useState(false);

  const keys = useMemo(() => DEMO_TABS.map((tab) => tab.key), []);
  const prefix = `${base}-tab-`;
  const tabId = useCallback((key) => `${prefix}${key}`, [prefix]);
  const panelId = (key) => `${base}-panel-${key}`;

  useEffect(() => {
    if (taken || paused || reduced) return;

    const timer = setInterval(() => {
      setActive((current) => keys[(keys.indexOf(current) + 1) % keys.length]);
    }, 4200);
    return () => clearInterval(timer);
  }, [taken, paused, reduced, keys]);

  const pick = useCallback((key) => {
    setActive(key);
    setTaken(true);
  }, []);

  /* Arrowing through the tabs counts as taking control too, hence `pick`. */
  const onKeyDown = useTabKeys(
    useMemo(() => keys.map(tabId), [keys, tabId]),
    tabId(active),
    useCallback((id) => pick(id.slice(prefix.length)), [pick, prefix]),
  );

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-900/10">

        {/* Window chrome */}
        <div className="flex items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50 px-4 py-3">
          <span className="flex items-center gap-2 text-[11px] font-medium text-zinc-500">
            <span className="flex size-5 items-center justify-center rounded-md bg-emerald-600 text-[8px] font-bold text-white">
              CS
            </span>
            {t("landing.demo.title")}
          </span>
          <span className="hidden items-center gap-1.5 text-[10px] text-zinc-400 sm:flex">
            <MousePointerClick size={11} className="text-emerald-500" />
            {t("landing.demo.hint")}
          </span>
        </div>

        {/* Tabs */}
        <div
          role="tablist"
          aria-label={t("landing.demo.title")}
          onKeyDown={onKeyDown}
          className="flex flex-wrap gap-1 border-b border-zinc-200 px-2 py-2">
          {DEMO_TABS.map((tab) => {
            const Icon = tab.icon;
            const selected = tab.key === active;

            return (
              <button
                key={tab.key}
                id={tabId(tab.key)}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={panelId(tab.key)}
                tabIndex={selected ? 0 : -1}
                onClick={() => pick(tab.key)}
                className={`inline-flex shrink-0 items-center gap-1.5 !rounded-lg !border-0 !px-2.5 !py-1.5 !text-[11px] !font-medium !shadow-none transition-colors ${
                  selected
                    ? "!bg-zinc-900 !text-white"
                    : "!bg-transparent !text-zinc-500 hover:!bg-zinc-100 hover:!text-zinc-800"
                }`}>
                <Icon size={13} />
                {t(`landing.demo.tabs.${tab.key}`)}
              </button>
            );
          })}
        </div>

        {/*
          Every pane is rendered and the inactive ones are hidden, so the mock
          is in the HTML on first paint and a tab switch costs no new layout.
        */}
        <div className="p-4">
          {DEMO_TABS.map((tab) => {
            const Pane = DEMO_PANES[tab.key];
            const selected = tab.key === active;

            return (
              <div
                key={tab.key}
                id={panelId(tab.key)}
                role="tabpanel"
                aria-labelledby={tabId(tab.key)}
                hidden={!selected}
                tabIndex={selected ? 0 : -1}
                className={selected ? "cs-rise" : undefined}>
                <Pane />
              </div>
            );
          })}
        </div>

      </div>

      {/*
        Floating callouts. Hidden below `sm`, where there is not enough room
        for them to sit outside the card without covering it.
      */}
      <div className="absolute -bottom-6 -left-4 hidden items-center gap-2.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 shadow-xl shadow-zinc-900/10 sm:flex lg:-left-10">
        <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-50">
          <Check size={14} className="text-emerald-600" />
        </span>
        <span className="text-left">
          <span className="block text-[11px] font-semibold text-zinc-900">
            {t("landing.mock.orderNo")}
          </span>
          <span className="block text-[10px] text-zinc-500">{t("landing.mock.paidWith")}</span>
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
          <span className="block text-[10px] text-zinc-500">{t("landing.mock.staticDesc")}</span>
        </span>
      </div>

    </div>
  );
}

/* ─────────────────────── module bands ─────────────────────── */

/*
  The twelve modules, one band each, the copy changing sides as you go down.

  This was a tabbed explorer, which hid eleven modules behind a click and so
  made the page's biggest claim - that all of this is included - the one
  thing a visitor had to work for. As bands it reads top to bottom, every
  feature is on screen as you pass it, and alternating the sides keeps
  sixty-five list items from reading as one wall.

  The search survives the change: it now decides which bands are drawn
  rather than which tab is open. The alternation is worked out over what
  survives the filter, so a filtered page keeps the same rhythm as the full
  one, while the number beside each heading stays the module's own - filter
  down to three and they still read 02, 08, 11, which is the honest answer
  to "where does this live?".
*/
function ModuleSections() {
  const { t, tList, n, isBangla } = useI18n();
  const base = useId();
  const [query, setQuery] = useState("");

  const headingType = isBangla ? "tracking-normal" : "tracking-tight";
  const h2Type = isBangla ? "leading-snug tracking-normal" : "tracking-tight";

  const needle = query.trim().toLowerCase();

  const groups = useMemo(
    () =>
      MODULES.map((module, index) => {
        const name = t(`landing.modules.groups.${module.key}.name`);
        const items = tList(`landing.modules.groups.${module.key}.items`);

        /* A module whose own name matches surfaces all of its features. */
        const matchedName = Boolean(needle) && name.toLowerCase().includes(needle);
        const hits = !needle || matchedName
          ? items
          : items.filter((item) => item.toLowerCase().includes(needle));

        return { ...module, name, items, hits, matchedName, number: index + 1 };
      }),
    [needle, t, tList],
  );

  const found = groups.filter((group) => group.hits.length);
  const total = found.reduce((sum, group) => sum + group.hits.length, 0);

  return (
    /*
      The id sits on the wrapper rather than on the heading band, so the nav
      underline stays lit for the whole run of modules instead of only for
      the paragraph that introduces them.
    */
    <div id="features" className="scroll-mt-16">

      {/* ── Heading and search ── */}
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-14 sm:pt-24">

          <div className="max-w-2xl">
            <SectionLabel>{t("landing.modules.label")}</SectionLabel>
            <h2 className={`mb-4 text-3xl font-semibold sm:text-4xl ${h2Type}`}>
              {t("landing.modules.title")}
            </h2>
            <p className="text-lg leading-relaxed text-zinc-600">{t("landing.modules.body")}</p>
          </div>

          <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search
                size={15}
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              {/*
                `type="search"` sidesteps the global `input[type="text"]` rules
                in `globals.css`, but its native clear button would then sit
                beside ours, so that is turned off.
              */}
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label={t("landing.modules.search.label")}
                aria-describedby={`${base}-count`}
                placeholder={t("landing.modules.search.placeholder")}
                className="w-full !appearance-none !rounded-xl !border !border-zinc-200 !bg-white !py-2.5 !pl-9 !pr-9 !text-sm !text-zinc-900 !shadow-none placeholder:!text-zinc-400 focus:!border-emerald-500 focus:!outline-none [&::-webkit-search-cancel-button]:appearance-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label={t("landing.modules.search.clear")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 !rounded-md !border-0 !bg-transparent !p-1 !text-zinc-400 !shadow-none hover:!text-zinc-700">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Announced, so a screen reader hears the search doing something. */}
            <p
              id={`${base}-count`}
              aria-live="polite"
              className="text-xs text-zinc-500 sm:text-right">
              {needle
                ? `${n(total)} ${t("landing.modules.search.matches")}`
                : `${n(MODULES.length)} ${t("landing.proof.items.modules")}`}
            </p>
          </div>

          {total === 0 && (
            <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-14 text-center">
              <p className="text-sm font-semibold text-zinc-900">
                {t("landing.modules.search.empty")}
              </p>
              <p className="mx-auto mt-1.5 max-w-sm text-sm text-zinc-500">
                {t("landing.modules.search.emptyHint")}
              </p>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="mt-5 !rounded-lg !border !border-zinc-300 !bg-white !px-4 !py-2 !text-sm !font-medium !text-zinc-800 !shadow-none hover:!bg-zinc-50">
                {t("landing.modules.search.clear")}
              </button>
            </div>
          )}

        </div>
      </section>

      {/* ── One band per module ── */}
      {found.map((group, index) => {
        const Icon = group.icon;
        /*
          Odd bands shade and flip. `lg:order-2` moves the copy across only
          where there are two columns to move it between - stacked on a
          phone the copy always comes first, because a list of features
          above its own heading is nobody's idea of reading order.
        */
        const flipped = index % 2 === 1;

        return (
          <section
            key={group.key}
            id={`module-${group.key}`}
            aria-labelledby={`${base}-h-${group.key}`}
            className={`scroll-mt-16 border-b border-zinc-200 ${
              flipped ? "bg-zinc-50" : "bg-white"
            }`}>
            <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-9 px-6 py-14 sm:py-16 lg:grid-cols-2 lg:gap-16">

              <div className={flipped ? "lg:order-2" : undefined}>
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Icon size={20} />
                  </span>
                  <span className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">
                    {n(String(group.number).padStart(2, "0"))}
                    <span className="mx-2 text-zinc-300">/</span>
                    {t(`landing.modules.groups.${group.key}.kicker`)}
                  </span>
                </div>

                <h3
                  id={`${base}-h-${group.key}`}
                  className={`mb-3 text-2xl font-semibold text-zinc-900 sm:text-3xl ${headingType}`}>
                  {group.name}
                </h3>

                <p className="max-w-lg leading-relaxed text-zinc-600">
                  {t(`landing.modules.groups.${group.key}.desc`)}
                </p>

                {/* Support ships exactly one feature, so "1 features" is a real case. */}
                <p className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-500">
                  <Check size={12} className="text-emerald-600" />
                  {n(group.hits.length)}{" "}
                  {t(
                    group.hits.length === 1
                      ? "landing.modules.countLabelOne"
                      : "landing.modules.countLabel",
                  )}
                </p>
              </div>

              {/*
                A module with three features or fewer keeps one column, so
                its handful of cards read as a deliberate short list rather
                than as a two-column grid with the right half missing.
              */}
              <ul
                className={`grid grid-cols-1 gap-2.5 ${
                  group.hits.length > 3 ? "sm:grid-cols-2" : ""
                } ${flipped ? "lg:order-1" : ""}`}>
                {group.hits.map((item) => (
                  <li
                    key={item}
                    className={`flex items-start gap-2.5 rounded-xl border border-zinc-200 px-3.5 py-3 text-sm text-zinc-800 ${
                      flipped ? "bg-white" : "bg-zinc-50"
                    }`}>
                    <Check size={14} className="mt-0.5 shrink-0 text-emerald-600" />
                    <span>
                      <Highlight text={item} needle={group.matchedName ? "" : needle} />
                    </span>
                  </li>
                ))}
              </ul>

            </div>
          </section>
        );
      })}

    </div>
  );
}

/* ─────────────────────── page builder ─────────────────────── */

function BuilderShowcase() {
  const { t, tList } = useI18n();
  const reduced = useReducedMotion();
  const base = useId();

  const [category, setCategory] = useState(BUILDER_CATEGORIES[0].key);
  const [state, setState] = useState("idle");
  const timer = useRef(null);

  const prefix = `${base}-b-`;
  const tabId = useCallback((key) => `${prefix}${key}`, [prefix]);
  const panelId = (key) => `${base}-bp-${key}`;

  const onKeyDown = useTabKeys(
    useMemo(() => BUILDER_CATEGORIES.map((item) => tabId(item.key)), [tabId]),
    tabId(category),
    useCallback((id) => setCategory(id.slice(prefix.length)), [prefix]),
  );

  /* A pending timeout must not fire into an unmounted component. */
  useEffect(() => () => clearTimeout(timer.current), []);

  /*
    The wait before the blocks appear is theatre, and theatre is exactly what
    somebody who asked for reduced motion does not want, so they get the
    result immediately instead.
  */
  const generate = useCallback(() => {
    clearTimeout(timer.current);
    if (reduced) {
      setState("done");
      return;
    }
    setState("working");
    timer.current = setTimeout(() => setState("done"), 950);
  }, [reduced]);

  const blocks = tList("landing.builder.ai.blocks");

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

      {/* ── Element palette ── */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6">
        <p className="mb-4 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
          {t("landing.builder.elementsLabel")}
        </p>

        <div
          role="tablist"
          aria-label={t("landing.builder.elementsLabel")}
          onKeyDown={onKeyDown}
          className="mb-5 flex flex-wrap gap-1.5">
          {BUILDER_CATEGORIES.map((item) => {
            const Icon = item.icon;
            const selected = item.key === category;

            return (
              <button
                key={item.key}
                id={tabId(item.key)}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={panelId(item.key)}
                tabIndex={selected ? 0 : -1}
                onClick={() => setCategory(item.key)}
                className={`inline-flex items-center gap-1.5 !rounded-lg !border !px-2.5 !py-1.5 !text-xs !font-medium !shadow-none transition-colors ${
                  selected
                    ? "!border-emerald-600 !bg-emerald-50 !text-emerald-700"
                    : "!border-zinc-200 !bg-white !text-zinc-600 hover:!bg-zinc-50"
                }`}>
                <Icon size={13} />
                {t(`landing.builder.categories.${item.key}.name`)}
              </button>
            );
          })}
        </div>

        {BUILDER_CATEGORIES.map((item) => {
          const selected = item.key === category;

          return (
            <div
              key={item.key}
              id={panelId(item.key)}
              role="tabpanel"
              aria-labelledby={tabId(item.key)}
              hidden={!selected}
              tabIndex={selected ? 0 : -1}
              className={`flex flex-wrap gap-2 ${selected ? "cs-rise" : ""}`}>
              {tList(`landing.builder.categories.${item.key}.items`).map((element) => (
                <span
                  key={element}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs text-zinc-700">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  {element}
                </span>
              ))}
            </div>
          );
        })}
      </div>

      {/* ── AI section generation ── */}
      <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-zinc-900">
            <WandSparkles size={14} className="text-emerald-400" />
          </span>
          <h3 className="text-sm font-semibold text-zinc-900">{t("landing.builder.ai.title")}</h3>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-zinc-600">{t("landing.builder.ai.body")}</p>

        <p className="rounded-xl bg-zinc-100 px-3.5 py-2.5 text-[13px] text-zinc-600">
          {t("landing.builder.ai.prompt")}
        </p>

        <button
          type="button"
          onClick={generate}
          aria-busy={state === "working"}
          className="mt-3 inline-flex w-fit items-center gap-2 !rounded-xl !border-0 !bg-zinc-900 !px-4 !py-2.5 !text-sm !font-semibold !text-white !shadow-none transition-colors hover:!bg-zinc-700">
          {state === "working" ? (
            <>
              <Sparkles size={15} className="cs-pulse text-emerald-400" />
              {t("landing.builder.ai.working")}
            </>
          ) : (
            <>
              <WandSparkles size={15} className="text-emerald-400" />
              {state === "done" ? t("landing.builder.ai.again") : t("landing.builder.ai.button")}
            </>
          )}
        </button>

        {/*
          The generated section. `aria-live` carries the result to a screen
          reader, since the button that produced it does not move focus.
        */}
        <div aria-live="polite" className="mt-5 flex-1">
          {state !== "idle" && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3.5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-semibold tracking-wide text-emerald-700 uppercase">
                  {t("landing.builder.ai.note")}
                </span>
                <Layers size={13} className="text-emerald-600" />
              </div>

              <div className="space-y-2">
                {blocks.map((block, index) => (
                  <div
                    key={block}
                    style={state === "done" ? { animationDelay: `${index * 70}ms` } : undefined}
                    className={`flex items-center gap-2.5 rounded-lg border border-emerald-100 bg-white px-3 py-2 text-xs text-zinc-700 ${
                      state === "done" ? "cs-rise" : "cs-pulse"
                    }`}>
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-[9px] font-bold text-emerald-700">
                      {index + 1}
                    </span>
                    {state === "done" ? (
                      block
                    ) : (
                      <span className="h-2 w-24 rounded-full bg-zinc-200" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

/* ─────────────────────── payments ─────────────────────── */

function PaymentTabs() {
  const { t } = useI18n();
  const base = useId();
  const [group, setGroup] = useState(PAYMENT_GROUPS[0].key);

  const prefix = `${base}-pay-`;
  const tabId = useCallback((key) => `${prefix}${key}`, [prefix]);
  const panelId = (key) => `${base}-payp-${key}`;

  const onKeyDown = useTabKeys(
    useMemo(() => PAYMENT_GROUPS.map((item) => tabId(item.key)), [tabId]),
    tabId(group),
    useCallback((id) => setGroup(id.slice(prefix.length)), [prefix]),
  );

  return (
    <div>
      <div
        role="tablist"
        aria-label={t("landing.payments.title")}
        onKeyDown={onKeyDown}
        className="mb-6 inline-flex flex-wrap gap-1.5 rounded-xl border border-zinc-200 bg-white p-1">
        {PAYMENT_GROUPS.map((item) => {
          const Icon = item.icon;
          const selected = item.key === group;

          return (
            <button
              key={item.key}
              id={tabId(item.key)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId(item.key)}
              tabIndex={selected ? 0 : -1}
              onClick={() => setGroup(item.key)}
              className={`inline-flex items-center gap-2 !rounded-lg !border-0 !px-3.5 !py-2 !text-sm !font-medium !shadow-none transition-colors ${
                selected
                  ? "!bg-zinc-900 !text-white"
                  : "!bg-transparent !text-zinc-500 hover:!text-zinc-800"
              }`}>
              <Icon size={15} className={selected ? "text-emerald-400" : "text-zinc-400"} />
              {t(`landing.payments.tabs.${item.key}`)}
            </button>
          );
        })}
      </div>

      {PAYMENT_GROUPS.map((item) => {
        const selected = item.key === group;

        return (
          <div
            key={item.key}
            id={panelId(item.key)}
            role="tabpanel"
            aria-labelledby={tabId(item.key)}
            hidden={!selected}
            tabIndex={selected ? 0 : -1}
            className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${
              selected ? "cs-rise" : ""
            }`}>
            {item.items.map((method) => (
              <div
                key={method.key}
                className="rounded-2xl border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-300">
                <div
                  className={`mb-3 inline-flex rounded-lg px-2.5 py-1 text-lg font-semibold ring-1 ${method.accent} ${method.ring}`}>
                  {t(`landing.payments.items.${method.key}.name`)}
                </div>
                <p className="text-sm leading-relaxed text-zinc-600">
                  {t(`landing.payments.items.${method.key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────── AI assistant ─────────────────────── */

function AssistantPanel() {
  const { t, isBangla } = useI18n();
  const base = useId();
  const [sample, setSample] = useState(AI_TABS[0]);

  const prefix = `${base}-ai-`;
  const tabId = useCallback((key) => `${prefix}${key}`, [prefix]);
  const panelId = (key) => `${base}-aip-${key}`;

  const onKeyDown = useTabKeys(
    useMemo(() => AI_TABS.map(tabId), [tabId]),
    tabId(sample),
    useCallback((id) => setSample(id.slice(prefix.length)), [prefix]),
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-900/5">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50 px-4 py-3">
        <span className="flex items-center gap-2 text-xs font-medium text-zinc-500">
          <Sparkles size={13} className="text-emerald-600" />
          {t("landing.ai.panelTitle")}
        </span>

        <div
          role="tablist"
          aria-label={t("landing.ai.panelTitle")}
          onKeyDown={onKeyDown}
          className="flex gap-0.5 rounded-lg bg-white p-0.5 ring-1 ring-zinc-200">
          {AI_TABS.map((key) => {
            const selected = key === sample;

            return (
              <button
                key={key}
                id={tabId(key)}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={panelId(key)}
                tabIndex={selected ? 0 : -1}
                onClick={() => setSample(key)}
                className={`!rounded-md !border-0 !px-2.5 !py-1 !text-[11px] !font-medium !shadow-none transition-colors ${
                  selected
                    ? "!bg-zinc-900 !text-white"
                    : "!bg-transparent !text-zinc-500 hover:!text-zinc-800"
                }`}>
                {t(`landing.ai.tabs.${key}`)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6">
        {AI_TABS.map((key) => {
          const selected = key === sample;

          return (
            <div
              key={key}
              id={panelId(key)}
              role="tabpanel"
              aria-labelledby={tabId(key)}
              hidden={!selected}
              tabIndex={selected ? 0 : -1}
              className={selected ? "cs-rise" : undefined}>
              <div className="mb-5 rounded-xl bg-zinc-100 px-4 py-3 text-sm text-zinc-600">
                {t(`landing.ai.samples.${key}.prompt`)}
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 px-4 py-3.5 text-sm leading-relaxed text-zinc-800">
                {t(`landing.ai.samples.${key}.answer`)}
              </div>
            </div>
          );
        })}

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white">
            {t("landing.ai.useDraft")}
          </span>
          <span className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600">
            {t("landing.ai.regenerate")}
          </span>
          {/*
            The chip advertises the assistant's other language, so it reads
            "বাংলায় লিখুন" on the English page and "Write in English" on the
            Bangla one. `lang` flips with it so the right font and hyphenation
            rules apply.
          */}
          <span
            lang={isBangla ? "en" : "bn"}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600">
            {t("landing.ai.otherLanguage")}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── pricing ─────────────────────── */

function PricingCards() {
  const { t, isBangla } = useI18n();
  const [yearly, setYearly] = useState(false);

  const headingType = isBangla ? "tracking-normal" : "tracking-tight";
  const labelType = isBangla ? "tracking-normal" : "tracking-wider";

  return (
    <div>

      {/*
        Monthly or yearly. A two-option segmented control rather than a
        checkbox: the saving is the point, and a switch cannot carry a label
        that says so.
      */}
      <div className="mb-10 flex flex-wrap items-center gap-3">
        <div
          role="group"
          aria-label={t("landing.pricing.billing.label")}
          className="inline-flex items-center rounded-xl border border-zinc-200 bg-white p-1">
          {[false, true].map((value) => {
            const selected = value === yearly;

            return (
              <button
                key={String(value)}
                type="button"
                onClick={() => setYearly(value)}
                aria-pressed={selected}
                className={`!rounded-lg !border-0 !px-4 !py-2 !text-sm !font-medium !shadow-none transition-colors ${
                  selected
                    ? "!bg-zinc-900 !text-white"
                    : "!bg-transparent !text-zinc-500 hover:!text-zinc-800"
                }`}>
                {t(`landing.pricing.billing.${value ? "yearly" : "monthly"}`)}
              </button>
            );
          })}
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          <Check size={13} />
          {t("landing.pricing.billing.save")}
        </span>
      </div>

      {/*
        The featured card takes the dark treatment the architecture section
        and the closing CTA already use, so the middle tier reads as the
        recommended one without introducing a second accent. It only breaks
        out of the row from `lg` up, where the three cards sit side by side -
        stacked on a phone there is no row to break.
      */}
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const featured = Boolean(plan.featured);
          const prefix = `landing.pricing.plans.${plan.key}`;

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

              <h3 className={`text-lg font-semibold ${headingType}`}>{t(`${prefix}.name`)}</h3>
              <p
                className={`mt-1.5 max-w-[15rem] text-sm leading-relaxed ${
                  featured ? "text-zinc-400" : "text-zinc-600"
                }`}>
                {t(`${prefix}.tagline`)}
              </p>

              {/*
                Both prices are in the markup and the one you are not looking
                at is hidden, so the yearly figure reaches a crawler and a
                reader with JS off - the rule the tab panels follow as well.
                Tailwind's preflight makes `[hidden]` `display: none`
                important, so a `flex` child still disappears.
              */}
              {[false, true].map((period) => (
                <div key={String(period)} hidden={period !== yearly}>
                  <div className="mt-7 flex flex-wrap items-baseline gap-x-1.5">
                    <span className={`text-4xl font-semibold ${headingType}`}>
                      {t(`${prefix}.${period ? "priceYear" : "price"}`)}
                    </span>
                    <span className={`text-sm ${featured ? "text-zinc-400" : "text-zinc-500"}`}>
                      {t(`${prefix}.${period ? "periodYear" : "period"}`)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">
                    {t(`${prefix}.${period ? "noteYear" : "note"}`)}
                  </p>
                </div>
              ))}

              <a
                href={plan.href}
                className={`mt-7 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors ${
                  featured
                    ? "bg-emerald-600 text-white hover:bg-emerald-500"
                    : "border border-zinc-300 bg-white text-zinc-800 hover:border-zinc-400 hover:bg-zinc-50"
                }`}>
                {t(`${prefix}.cta`)}
                <ArrowRight size={15} />
              </a>

              <div className={`my-7 h-px ${featured ? "bg-white/10" : "bg-zinc-200"}`} />

              <p
                className={`mb-4 text-xs font-semibold ${labelType} ${
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
                    {t(`${prefix}.points.${point}`)}
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
  );
}

/* ─────────────────────── FAQ ─────────────────────── */

/*
  One answer open at a time, and the open one can be closed again. Buttons
  rather than <details>, because a disclosure needs `aria-expanded` for the
  arrow to mean anything either way, and this page already overrides the
  global button styling everywhere else.
*/
function Faq() {
  const { t } = useI18n();
  const base = useId();
  const [open, setOpen] = useState(FAQ_KEYS[0]);

  return (
    <div className="divide-y divide-zinc-200 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      {FAQ_KEYS.map((key) => {
        const expanded = key === open;

        return (
          <div key={key}>
            <h3>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={`${base}-faq-${key}`}
                onClick={() => setOpen(expanded ? "" : key)}
                className="flex w-full items-center justify-between gap-4 !rounded-none !border-0 !bg-white !px-6 !py-5 !text-left !shadow-none transition-colors hover:!bg-zinc-50">
                <span className="text-[15px] font-semibold text-zinc-900">
                  {t(`landing.faq.items.${key}.q`)}
                </span>
                <ChevronDown
                  size={17}
                  aria-hidden="true"
                  className={`shrink-0 text-zinc-400 transition-transform ${
                    expanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            </h3>
            <div id={`${base}-faq-${key}`} hidden={!expanded} className="px-6 pb-5">
              <p className="max-w-3xl text-sm leading-relaxed text-zinc-600">
                {t(`landing.faq.items.${key}.a`)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────── page ─────────────────────── */

function LandingContent() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, tList, isBangla } = useI18n();
  const scrolled = useScrolled();
  const activeSection = useActiveSection(SECTION_IDS);

  /*
    Bangla sits lower on the line and has no use for negative tracking, so the
    display sizes relax rather than tighten. Everything else is shared.
  */
  const h1Type = isBangla ? "leading-[1.35] tracking-normal" : "leading-[1.08] tracking-tight";
  const h2Type = isBangla ? "leading-snug tracking-normal" : "tracking-tight";
  const headingType = isBangla ? "tracking-normal" : "tracking-tight";
  const footerHeadingType = isBangla ? "tracking-normal" : "tracking-wider";

  const fontStack = isBangla
    ? "var(--font-bangla), var(--font-geist-sans), system-ui, sans-serif"
    : "var(--font-geist-sans), var(--font-bangla), system-ui, sans-serif";

  /* Counted from the catalogue, so the headline figures cannot go stale. */
  const featureTotal = useMemo(() => {
    const total = MODULES.reduce(
      (sum, module) => sum + tList(`landing.modules.groups.${module.key}.items`).length,
      0,
    );
    return total || FEATURE_TOTAL_FALLBACK;
  }, [tList]);

  const proof = [
    { key: "modules", value: MODULES.length, suffix: "" },
    { key: "features", value: featureTotal, suffix: "+" },
    {
      key: "payments",
      value: PAYMENT_GROUPS.reduce((sum, group) => sum + group.items.length, 0),
      suffix: "",
    },
    { key: "couriers", value: COURIERS.length, suffix: "" },
  ];

  const partners = PARTNER_KEYS.map((key) => t(key));

  return (
    <div
      className={`${bangla.variable} min-h-screen w-full bg-white text-zinc-900 antialiased`}
      style={{ fontFamily: fontStack }}>

      <style>{PAGE_CSS}</style>

      {/* ── Header ── */}
      <header
        className={`sticky top-0 z-50 border-b bg-white/85 backdrop-blur-md transition-colors ${
          scrolled ? "border-zinc-200 shadow-sm shadow-zinc-900/5" : "border-transparent"
        }`}>
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">

          <a href="#top" className="shrink-0">
            <Logo />
          </a>

          {/*
              Tighter at `md` than above it. A media query counts the
              scrollbar and the layout does not, so at exactly 768px the row
              has four pixels less than it asked for - and a sticky header
              that overflows takes the whole document sideways with it.
            */}
            <div className="hidden items-center gap-6 text-sm text-zinc-600 md:flex lg:gap-7">
            {NAV_LINKS.map((link) => {
              const current = activeSection === link.href.slice(1);

              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={current ? "true" : undefined}
                  className={`relative py-1 transition-colors hover:text-zinc-900 ${
                    current ? "text-zinc-900" : ""
                  }`}>
                  {t(`landing.nav.${link.key}`)}
                  {/* The underline tracks the section the reader is in. */}
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-0.5 left-0 h-0.5 rounded-full bg-emerald-500 transition-all ${
                      current ? "w-full opacity-100" : "w-0 opacity-0"
                    }`}
                  />
                </a>
              );
            })}
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
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
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

          <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 py-16 lg:grid-cols-[1.02fr_1fr] lg:py-24">

            <div>
              <SectionLabel>{t("landing.hero.label")}</SectionLabel>

              <h1
                className={`mb-5 text-4xl font-semibold text-zinc-900 sm:text-5xl lg:text-[3.4rem] ${h1Type}`}>
                {t("landing.hero.titleBefore")}
                <span className="text-emerald-600">{t("landing.hero.titleHighlight")}</span>
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
                  href="#features"
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-6 py-3.5 text-sm font-semibold text-zinc-800 transition-colors hover:border-zinc-400 hover:bg-zinc-50">
                  {t("landing.hero.ctaSecondary")}
                  <Search size={15} />
                </a>
              </div>

              <p className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-zinc-500">
                {["noCard", "trial", "support"].map((key) => (
                  <span key={key} className="inline-flex items-center gap-1.5">
                    <Check size={14} className="text-emerald-600" />
                    {t(`landing.hero.${key}`)}
                  </span>
                ))}
              </p>
            </div>

            <div className="lg:pl-4">
              <AdminDemo />
            </div>

          </div>
        </section>

        {/* ── Partner strip ── */}
        <section className="overflow-hidden border-b border-zinc-200 bg-white py-6">
          <p className="mb-4 text-center text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
            {t("landing.partners.label")}
          </p>

          {/*
            Two identical runs side by side, shifted by half the track, so the
            loop has no seam. The second run is hidden from screen readers -
            one reading of the list is plenty - and the whole thing stops
            under `prefers-reduced-motion`, where it simply reads as a row.

            The track is positioned out of flow on purpose, and the strip has
            a fixed height because of it. An in-flow `w-max` row reports its
            whole width as a minimum size, and that minimum travels up to the
            `flex-1` <main> in `app/layout.jsx`: a flex item's `min-width` is
            `auto`, so <main> grows to fit the widest thing inside it and the
            entire document scrolls sideways. `overflow-hidden` here cannot
            save it, because by then this strip is as wide as the track too.
            An absolutely positioned child contributes nothing to its
            parent's intrinsic width, so the strip stays exactly as wide as
            the page and the overflow is clipped.
          */}
          <div className="relative h-6 overflow-hidden">
            <div className="cs-marquee absolute inset-y-0 left-0 flex w-max items-center">
              {[0, 1].map((run) => (
                <div
                  key={run}
                  aria-hidden={run === 1 ? "true" : undefined}
                  className="flex shrink-0 items-center gap-10 px-5">
                  {partners.map((name) => (
                    <span
                      key={name}
                      className="text-sm font-semibold whitespace-nowrap text-zinc-400">
                      {name}
                    </span>
                  ))}
                </div>
              ))}
            </div>

            {/* Fades the track into the page edges instead of cutting it. */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent" />
          </div>
        </section>

        {/* ── Proof band ── */}
        <section className="border-b border-zinc-200 bg-zinc-50">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-10 sm:py-12 lg:grid-cols-4">
            {proof.map((item) => (
              <div key={item.key} className="text-center lg:text-left">
                <div className={`text-3xl font-semibold text-zinc-900 sm:text-4xl ${headingType}`}>
                  <CountUp value={item.value} suffix={item.suffix} />
                </div>
                <div className="mt-1 text-sm text-zinc-500">
                  {t(`landing.proof.items.${item.key}`)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Platform / architecture ── */}
        <section id="platform" className="scroll-mt-16 bg-zinc-950 text-white">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">

            <div className="mb-14 max-w-2xl">
              <SectionLabel tone="dark">{t("landing.platform.label")}</SectionLabel>
              <h2 className={`mb-4 text-3xl font-semibold sm:text-4xl ${h2Type}`}>
                {t("landing.platform.title")}
              </h2>
              <p className="text-lg leading-relaxed text-zinc-400">{t("landing.platform.body")}</p>
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
                  <h3 className={`mb-2.5 text-xl font-semibold ${headingType}`}>
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

        {/* ── Modules: a band each, heading and search of their own ── */}
        <ModuleSections />

        {/* ── Page builder ── */}
        <section id="builder" className="scroll-mt-16 border-b border-zinc-200 bg-zinc-50">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">

            <div className="mb-10 max-w-2xl">
              <SectionLabel>{t("landing.builder.label")}</SectionLabel>
              <h2 className={`mb-4 text-3xl font-semibold sm:text-4xl ${h2Type}`}>
                {t("landing.builder.title")}
              </h2>
              <p className="text-lg leading-relaxed text-zinc-600">{t("landing.builder.body")}</p>
            </div>

            <BuilderShowcase />

          </div>
        </section>

        {/* ── AI assistant ── */}
        <section id="ai" className="scroll-mt-16 border-b border-zinc-200">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 py-20 sm:py-24 lg:grid-cols-2">

            <div>
              <SectionLabel>{t("landing.ai.label")}</SectionLabel>
              <h2 className={`mb-4 text-3xl font-semibold sm:text-4xl ${h2Type}`}>
                {t("landing.ai.title")}
              </h2>
              <p className="mb-7 text-lg leading-relaxed text-zinc-600">{t("landing.ai.body")}</p>
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

            <AssistantPanel />

          </div>
        </section>

        {/* ── Payments ── */}
        <section id="payments" className="scroll-mt-16 border-b border-zinc-200 bg-zinc-50">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">

            <div className="mb-10 max-w-2xl">
              <SectionLabel>{t("landing.payments.label")}</SectionLabel>
              <h2 className={`mb-4 text-3xl font-semibold sm:text-4xl ${h2Type}`}>
                {t("landing.payments.title")}
              </h2>
              <p className="text-lg leading-relaxed text-zinc-600">{t("landing.payments.body")}</p>
            </div>

            <PaymentTabs />

            <p className="mt-6 text-sm text-zinc-500">{t("landing.payments.note")}</p>

          </div>
        </section>

        {/* ── Couriers ── */}
        <section id="couriers" className="scroll-mt-16 border-b border-zinc-200">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">

            <div className="mb-10 max-w-2xl">
              <SectionLabel>{t("landing.couriers.label")}</SectionLabel>
              <h2 className={`mb-4 text-3xl font-semibold sm:text-4xl ${h2Type}`}>
                {t("landing.couriers.title")}
              </h2>
              <p className="text-lg leading-relaxed text-zinc-600">{t("landing.couriers.body")}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {COURIERS.map((courier) => {
                const Icon = courier.icon;

                return (
                  <div
                    key={courier.key}
                    className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-900/5">
                    <span className="mb-4 flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                      <Icon size={18} />
                    </span>
                    <h3 className={`mb-2 text-base font-semibold text-zinc-900 ${headingType}`}>
                      {t(`landing.couriers.items.${courier.key}.name`)}
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-600">
                      {t(`landing.couriers.items.${courier.key}.desc`)}
                    </p>
                  </div>
                );
              })}
            </div>

            <p className="mt-6 flex items-start gap-2 text-sm text-zinc-500">
              <Truck size={16} className="mt-0.5 shrink-0 text-emerald-600" />
              {t("landing.couriers.own")}
            </p>

          </div>
        </section>

        {/* ── Integrations ── */}
        <section id="integrations" className="scroll-mt-16 border-b border-zinc-200 bg-zinc-50">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">

            <div className="mb-10 max-w-2xl">
              <SectionLabel>{t("landing.integrations.label")}</SectionLabel>
              <h2 className={`mb-4 text-3xl font-semibold sm:text-4xl ${h2Type}`}>
                {t("landing.integrations.title")}
              </h2>
              <p className="text-lg leading-relaxed text-zinc-600">
                {t("landing.integrations.body")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {INTEGRATIONS.map((key) => (
                <div
                  key={key}
                  className="flex items-start gap-3.5 rounded-2xl border border-zinc-200 bg-white p-5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-zinc-900">
                    <Plug size={15} className="text-emerald-400" />
                  </span>
                  <div>
                    <h3 className={`text-sm font-semibold text-zinc-900 ${headingType}`}>
                      {t(`landing.integrations.items.${key}.name`)}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-600">
                      {t(`landing.integrations.items.${key}.desc`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="scroll-mt-16 border-b border-zinc-200">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">

            <div className="mb-10 max-w-2xl">
              <SectionLabel>{t("landing.pricing.label")}</SectionLabel>
              <h2 className={`mb-4 text-3xl font-semibold sm:text-4xl ${h2Type}`}>
                {t("landing.pricing.title")}
              </h2>
              <p className="text-lg leading-relaxed text-zinc-600">{t("landing.pricing.body")}</p>
            </div>

            <PricingCards />

          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="scroll-mt-16 border-b border-zinc-200 bg-zinc-50">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">

            <div className="mb-10 max-w-2xl">
              <SectionLabel>{t("landing.faq.label")}</SectionLabel>
              <h2 className={`text-3xl font-semibold sm:text-4xl ${h2Type}`}>
                {t("landing.faq.title")}
              </h2>
            </div>

            <Faq />

          </div>
        </section>

        {/* ── CTA ── */}
        <section id="contact" className="mx-auto max-w-6xl scroll-mt-16 px-6 py-20 sm:py-24">
          <div className="relative overflow-hidden rounded-3xl bg-zinc-950 px-8 py-16 text-center sm:px-12">

            <div className="pointer-events-none absolute -bottom-32 left-1/2 size-[520px] -translate-x-1/2 rounded-full bg-emerald-600/20 blur-3xl" />

            <div className="relative">
              <h2 className={`mb-4 text-3xl font-semibold text-white sm:text-4xl ${h2Type}`}>
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
                  href="#pricing"
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
                <h4 className={`mb-3.5 text-xs font-semibold text-zinc-400 ${footerHeadingType}`}>
                  {t("landing.footer.platformHeading")}
                </h4>
                <div className="flex flex-col gap-2.5 text-sm">
                  <a href="#platform" className="text-zinc-600 hover:text-emerald-700">
                    {t("landing.footer.architecture")}
                  </a>
                  <a href="#features" className="text-zinc-600 hover:text-emerald-700">
                    {t("landing.footer.modules")}
                  </a>
                  <a href="#builder" className="text-zinc-600 hover:text-emerald-700">
                    {t("landing.footer.builderLink")}
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
                <h4 className={`mb-3.5 text-xs font-semibold text-zinc-400 ${footerHeadingType}`}>
                  {t("landing.footer.paymentsHeading")}
                </h4>
                <div className="flex flex-col gap-2.5 text-sm">
                  <a href="#payments" className="text-zinc-600 hover:text-emerald-700">
                    {t("landing.payments.items.bkash.name")}
                  </a>
                  <a href="#payments" className="text-zinc-600 hover:text-emerald-700">
                    {t("landing.payments.items.sslcommerz.name")}
                  </a>
                  <a href="#couriers" className="text-zinc-600 hover:text-emerald-700">
                    {t("landing.footer.couriers")}
                  </a>
                  <a href="#integrations" className="text-zinc-600 hover:text-emerald-700">
                    {t("landing.footer.integrations")}
                  </a>
                </div>
              </div>
              <div>
                <h4 className={`mb-3.5 text-xs font-semibold text-zinc-400 ${footerHeadingType}`}>
                  {t("landing.footer.companyHeading")}
                </h4>
                <div className="flex flex-col gap-2.5 text-sm">
                  <a href="#faq" className="text-zinc-600 hover:text-emerald-700">
                    {t("landing.footer.faq")}
                  </a>
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
                <h4 className={`mb-3.5 text-xs font-semibold text-zinc-400 ${footerHeadingType}`}>
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
