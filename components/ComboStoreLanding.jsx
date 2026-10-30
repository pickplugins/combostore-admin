"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Hind_Siliguri } from "next/font/google";
import {
  ArrowRight,
  Banknote,
  Bike,
  Boxes,
  Antenna,
  ChartColumn,
  ChartPie,
  Check,
  ChevronDown,
  ClipboardList,
  Code,
  CreditCard,
  Eye,
  FileText,
  Globe,
  Headset,
  Image as ImageIcon,
  Landmark,
  Layers,
  LayoutTemplate,
  MapPin,
  Map as MapIcon,
  Megaphone,
  Menu,
  Minus,
  MousePointerClick,
  Package,
  PanelsTopLeft,
  Percent,
  Plug,
  Plus,
  Puzzle,
  Receipt,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Star,
  Store,
  Tag,
  TriangleAlert,
  Truck,
  Undo2,
  Upload,
  Users,
  Video,
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

/*
  An element id built from a translated feature name. Bengali is stripped by
  the ASCII filter, so the fallback keeps ids unique by position rather than
  emitting the same empty string twice.
*/
function slug(text) {
  const ascii = String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return ascii || `k${String(text).length}-${String(text).codePointAt(0) || 0}`;
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

/*
  A week of bars - decorative, so the shape is fixed rather than computed,
  and shared with the Insights band's own preview so the two panels do not
  report two different weeks.
*/
const WEEK_BARS = [38, 52, 44, 68, 59, 83, 72];

function DemoInsights() {
  const { t, tList } = useI18n();

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
        {WEEK_BARS.map((height, index) => (
          <span
            key={index}
            style={{ height: `${height}%` }}
            className={`flex-1 rounded-sm ${
              index === WEEK_BARS.length - 1 ? "bg-emerald-500" : "bg-emerald-200"
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

/* ─────────────────── band showcases ─────────────────── */

/*
  A module band's visual side: a window you click through rather than a list
  you read. All twelve bands have one.

  It started as four - catalogue, orders, stock, insights - on the argument
  that those carry what a shop owner cares most about. The rest were asked
  for afterwards, and the honest note is that twelve identical windows cost
  the page some of the rhythm the bands were built for: the shading and the
  alternating sides are now the only thing separating one from the next, and
  a feature grid between them was a change of pace. `FeatureGrid` is still
  here and still the fallback, so dropping `BAND_VISUALS` entries is how a
  band goes back to a list. Each feature opens an illustration of the screen it belongs
  to - greeked, the way a product shot is, with the few real values (a
  price, a stock badge, an order number, the assistant's own sample answer)
  borrowed from mock listings that are already translated. Nothing here adds
  a string a translator has to find.

  The illustrations are decorative and marked so: the information is the
  list of feature names in the tabs, which a screen reader reads in full
  whether or not it can make sense of a bar chart. The panel repeats the
  selected name as its own heading, so the panel is never announced empty
  and the preview is captioned on a phone, where the tabs scroll away.

  Each previews array is indexed by position, mirroring that module's
  `landing.modules.groups.<key>.items`. That is a coupling between this file
  and the catalogue, so a reorder has to happen in both - the panel falls
  back to a plain card if the lists ever drift apart, rather than drawing
  the wrong screen for a feature.
*/

function Line({ w = "w-24", h = "h-2", tone = "bg-zinc-200" }) {
  return <span className={`block rounded-full ${h} ${w} ${tone}`} />;
}

function Field({ label, value }) {
  return (
    <div className="rounded-lg border border-zinc-200 px-3 py-2">
      <Line w={label} h="h-1.5" />
      <p className="mt-2 truncate text-sm font-semibold text-zinc-900">{value}</p>
    </div>
  );
}

/* The first mock product, reused so the preview and the hero agree. */
function useSampleProduct() {
  const { tList } = useI18n();
  const rows = tList("landing.demo.products.rows");
  const [name, sku, price, stock] = cells(rows[0] || "|||");
  return { name, sku, price, stock };
}

function PreviewProducts() {
  const product = useSampleProduct();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-xl border border-zinc-200 p-3">
        <span className="size-11 shrink-0 rounded-lg bg-emerald-100" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-zinc-900">
            {product.name}
          </span>
          <span className="mt-1.5 block">
            <Line w="w-20" h="h-1.5" />
          </span>
        </span>
        <Chip tone="emerald">{product.stock}</Chip>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="w-8" value={product.price} />
        <Field label="w-10" value={product.sku} />
      </div>
    </div>
  );
}

function PreviewCategories() {
  const rows = [
    { indent: "", w: "w-28", on: true },
    { indent: "pl-6", w: "w-20", on: true },
    { indent: "pl-6", w: "w-24", on: false },
    { indent: "", w: "w-24", on: false },
  ];

  return (
    <div className="space-y-2.5">
      {rows.map((row, index) => (
        <div key={index} className={`flex items-center gap-3 ${row.indent}`}>
          <span
            className={`flex size-4 shrink-0 items-center justify-center rounded border ${
              row.on ? "border-emerald-600 bg-emerald-600" : "border-zinc-300"
            }`}>
            {row.on && <Check size={11} className="text-white" />}
          </span>
          <Line w={row.w} />
        </div>
      ))}
      <div className="flex items-center gap-2 pt-1 text-zinc-300">
        <Plus size={13} />
        <Line w="w-12" h="h-1.5" tone="bg-zinc-100" />
      </div>
    </div>
  );
}

function PreviewTags() {
  const widths = ["w-14", "w-20", "w-12", "w-16", "w-24", "w-10"];

  return (
    <div className="rounded-xl border border-zinc-200 p-3">
      <div className="flex flex-wrap gap-2">
        {widths.map((width, index) => (
          <span
            key={width}
            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 ${
              index < 3 ? "bg-emerald-50" : "bg-zinc-100"
            }`}>
            <Tag size={10} className={index < 3 ? "text-emerald-600" : "text-zinc-400"} />
            <Line w={width} h="h-1.5" tone={index < 3 ? "bg-emerald-200" : "bg-zinc-300"} />
          </span>
        ))}
        <span className="inline-flex items-center gap-1 rounded-md border border-dashed border-zinc-300 px-2 py-1.5 text-zinc-300">
          <Plus size={11} />
        </span>
      </div>
    </div>
  );
}

function PreviewBrands() {
  const tones = [
    "bg-emerald-100",
    "bg-sky-100",
    "bg-amber-100",
    "bg-violet-100",
    "bg-rose-100",
    "bg-zinc-100",
  ];

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {tones.map((tone) => (
        <div
          key={tone}
          className="flex flex-col items-center gap-2 rounded-xl border border-zinc-200 px-2 py-3">
          <span className={`size-7 rounded-lg ${tone}`} />
          <Line w="w-10" h="h-1.5" />
        </div>
      ))}
    </div>
  );
}

function PreviewAttributes() {
  const rows = [
    { label: "w-10", options: ["w-5", "w-5", "w-6"] },
    { label: "w-14", options: ["w-10", "w-12", "w-8"] },
  ];

  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <div key={index} className="rounded-xl border border-zinc-200 p-3">
          <Line w={row.label} h="h-1.5" />
          <div className="mt-2.5 flex flex-wrap gap-2">
            {row.options.map((option, spot) => (
              <span
                key={spot}
                className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1.5">
                <Line w={option} h="h-1.5" tone="bg-zinc-300" />
              </span>
            ))}
          </div>
        </div>
      ))}
      <div className="flex items-center gap-2 text-zinc-300">
        <Plus size={13} />
        <Line w="w-16" h="h-1.5" tone="bg-zinc-100" />
      </div>
    </div>
  );
}

function PreviewReviews() {
  const rows = [
    { stars: 5, lines: ["w-32", "w-24"] },
    { stars: 4, lines: ["w-28", "w-16"] },
    { stars: 5, lines: ["w-24", "w-20"] },
  ];

  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <div key={index} className="flex gap-3">
          <span className="size-8 shrink-0 rounded-full bg-zinc-100" />
          <div className="min-w-0 flex-1 space-y-2">
            <span className="flex gap-0.5">
              {[0, 1, 2, 3, 4].map((spot) => (
                <Star
                  key={spot}
                  size={11}
                  className={spot < row.stars ? "text-amber-400" : "text-zinc-200"}
                  fill="currentColor"
                />
              ))}
            </span>
            {row.lines.map((width) => (
              <Line key={width} w={width} h="h-1.5" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function PreviewCoupons() {
  const { n } = useI18n();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/50 p-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
          <Percent size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xl font-semibold text-zinc-900">{n(20)}%</p>
          <span className="mt-1.5 block">
            <Line w="w-24" h="h-1.5" tone="bg-emerald-200" />
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2.5">
        <Line w="w-20" h="h-1.5" />
        <Line w="w-10" h="h-1.5" tone="bg-zinc-300" />
      </div>
    </div>
  );
}

function PreviewBulk() {
  const { n } = useI18n();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-xl border border-zinc-200 p-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          <Upload size={16} />
        </span>
        <div className="min-w-0 flex-1 space-y-2">
          <Line w="w-28" h="h-1.5" />
          <Line w="w-16" h="h-1.5" tone="bg-zinc-100" />
        </div>
        <Chip tone="emerald">CSV</Chip>
      </div>

      <div>
        <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
          <span className="block h-full w-[72%] rounded-full bg-emerald-500" />
        </div>
        <p className="mt-2 text-[11px] font-medium text-zinc-500">
          {n(216)} / {n(300)}
        </p>
      </div>
    </div>
  );
}

/*
  A prompt and what came back, for one of the three samples the AI section
  already carries - "product", "blog" or "template". Three bands draw the
  assistant, and this is the one that knows how.
*/
function AiSample({ sample }) {
  const { t } = useI18n();

  return (
    <div className="space-y-3">
      <p className="rounded-lg bg-zinc-100 px-3 py-2 text-[11px] leading-relaxed text-zinc-500">
        {t(`landing.ai.samples.${sample}.prompt`)}
      </p>
      <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 px-3 py-2.5">
        <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-wide text-emerald-700 uppercase">
          <Sparkles size={11} />
          {t("landing.builder.ai.note")}
        </span>
        <p className="line-clamp-4 text-[11px] leading-relaxed text-zinc-700">
          {t(`landing.ai.samples.${sample}.answer`)}
        </p>
      </div>
    </div>
  );
}

function PreviewAiContent() {
  return <AiSample sample="product" />;
}

/* Index by index, the order of the catalogue's own feature list. */
const CATALOGUE_PREVIEWS = [
  PreviewProducts,
  PreviewCategories,
  PreviewTags,
  PreviewBrands,
  PreviewAttributes,
  PreviewReviews,
  PreviewCoupons,
  PreviewBulk,
  PreviewAiContent,
];

/*
  The window itself, shared by both bands: a vertical tab strip of the
  module's own feature names beside the illustration of whichever one is
  open. `previews` is indexed by the feature's position in the module, and
  `chrome` names the admin screen the window is pretending to be - left out
  where the module is its own screen, so the module's name titles it and no
  band has to invent a key to opt in.
*/
function ShowcaseWindow({ group, needle, previews, chrome }) {
  const { t, n } = useI18n();
  const base = useId();
  const [active, setActive] = useState(group.items[0]);

  /*
    The search can take the selected feature off the list, so the open panel
    is worked out from what is showing rather than stored - no effect to
    keep the two in step, and nothing to go stale.
  */
  const panels = group.hits.map((item) => ({ item, index: group.items.indexOf(item) }));
  const current = panels.find((panel) => panel.item === active) || panels[0];

  const prefix = `${base}-c-`;
  const tabId = useCallback((item) => `${prefix}${slug(item)}`, [prefix]);
  const panelId = (item) => `${base}-cp-${slug(item)}`;

  const onKeyDown = useTabKeys(
    useMemo(() => panels.map((panel) => tabId(panel.item)), [panels, tabId]),
    current ? tabId(current.item) : "",
    useCallback(
      (id) => {
        const hit = panels.find((panel) => tabId(panel.item) === id);
        if (hit) setActive(hit.item);
      },
      [panels, tabId],
    ),
    { vertical: true },
  );

  /*
    Support ships exactly one feature, and the search can narrow any band to
    one hit, so a window with a single-tab tab strip is a real case. It gets
    the illustration on its own instead: a tablist of one navigates nothing,
    and a tabpanel with no tablist to label it is not a tabpanel at all.
  */
  const single = panels.length === 1;

  if (!current) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-900/5">

      {/* Window chrome */}
      <div className="flex items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50 px-4 py-3">
        <span className="flex items-center gap-2 text-[11px] font-medium text-zinc-500">
          <span className="flex size-5 items-center justify-center rounded-md bg-emerald-600 text-[8px] font-bold text-white">
            CS
          </span>
          {chrome ? t(chrome) : group.name}
        </span>
        <span className="hidden items-center gap-1.5 text-[10px] text-zinc-400 sm:flex">
          <MousePointerClick size={11} className="text-emerald-500" />
          {t("landing.demo.hint")}
        </span>
      </div>

      <div className={single ? undefined : "grid grid-cols-1 sm:grid-cols-[11.5rem_1fr]"}>

        {/* The features, as the window's own navigation */}
        {!single && (
        <div
          role="tablist"
          aria-orientation="vertical"
          aria-label={group.name}
          onKeyDown={onKeyDown}
          className="flex min-w-0 gap-1 overflow-x-auto border-b border-zinc-200 p-2 sm:flex-col sm:overflow-visible sm:border-b-0 sm:border-r">
          {panels.map((panel) => {
            const selected = panel.item === current.item;

            return (
              <button
                key={panel.item}
                id={tabId(panel.item)}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={panelId(panel.item)}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(panel.item)}
                className={`shrink-0 !rounded-lg !border-0 !px-2.5 !py-2 !text-left !text-[11px] !font-medium !shadow-none transition-colors sm:w-full ${
                  selected
                    ? "!bg-zinc-900 !text-white"
                    : "!bg-transparent !text-zinc-600 hover:!bg-zinc-100 hover:!text-zinc-900"
                }`}>
                <Highlight text={panel.item} needle={group.matchedName ? "" : needle} />
              </button>
            );
          })}
        </div>
        )}

        {/*
          Every panel is rendered and the inactive ones hidden, so every
          feature name sits in the HTML on first paint. The fixed minimum
          height stops the band resizing as you click down the list.
        */}
        <div className="min-h-[15.5rem] p-4 sm:p-5">
          {panels.map((panel) => {
            const Preview = previews[panel.index];
            const selected = panel.item === current.item;

            return (
              <div
                key={panel.item}
                id={panelId(panel.item)}
                role={single ? undefined : "tabpanel"}
                aria-labelledby={single ? undefined : tabId(panel.item)}
                hidden={!selected}
                tabIndex={single ? undefined : selected ? 0 : -1}
                className={selected ? "cs-rise" : undefined}>
                <p className="mb-3.5 flex items-center justify-between gap-3 text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">
                  {panel.item}
                  <span className="font-medium normal-case">
                    {n(panel.index + 1)}/{n(group.items.length)}
                  </span>
                </p>
                {/* An illustration, not a screenshot: the tabs carry the facts. */}
                <div aria-hidden="true">{Preview ? <Preview /> : <Line w="w-32" />}</div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

function CatalogueShowcase(props) {
  return (
    <ShowcaseWindow
      {...props}
      previews={CATALOGUE_PREVIEWS}
      chrome="landing.demo.tabs.products"
    />
  );
}

/* ─────────────────── orders showcase ─────────────────── */

/*
  The Orders band's side of the page - the left one, since Orders is the
  second module and the bands alternate.

  Four features, and each is a different screen rather than a different view
  of the same one: an order on its way out, a checkout that stopped halfway,
  money going back, and a charge that repeats. A list of four names says
  none of that, so they are drawn.

  The numbers are borrowed where the page already states them - the order
  rows from the hero's own listing, so #1042 is packed here and packed
  there - and invented only where nothing exists to borrow (the recovered
  count, the billing cycle), the way the bulk-upload preview invents its
  progress. Everything else is greeked.
*/

/* An order's own row from the hero listing: "#1042|bKash|৳1,450|Packed". */
function useSampleOrder(index) {
  const { tList } = useI18n();
  const rows = tList("landing.demo.orders.rows");
  const [no, payment, total, status] = cells(rows[index] || "|||");
  return { no, payment, total, status };
}

/* Placed, paid, packed - delivery still open, which is the usual state. */
function PreviewOrderDetail() {
  const order = useSampleOrder(0);
  const steps = [true, true, true, false];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-xl border border-zinc-200 p-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          <ClipboardList size={17} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-zinc-900">{order.no}</span>
          <span className="mt-1.5 block">
            <Line w="w-20" h="h-1.5" />
          </span>
        </span>
        <Chip tone="amber">{order.status}</Chip>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="w-8" value={order.total} />
        <Field label="w-12" value={order.payment} />
      </div>

      {/*
        The fulfilment steps, as a rail: a dot per step and the joining bar
        filled only as far as the order has actually got.
      */}
      <div className="flex items-center rounded-xl border border-zinc-200 px-3 py-3.5">
        {steps.map((done, index) => (
          <span key={index} className="flex min-w-0 flex-1 items-center gap-1.5 last:flex-none">
            <span
              className={`size-2.5 shrink-0 rounded-full ${
                done ? "bg-emerald-500" : "border border-zinc-300 bg-white"
              }`}
            />
            {index < steps.length - 1 && (
              <span
                className={`h-0.5 min-w-0 flex-1 rounded-full ${
                  steps[index + 1] ? "bg-emerald-500" : "bg-zinc-200"
                }`}
              />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

/* Two carts that stopped at checkout, and how many were talked back. */
function PreviewIncomplete() {
  const { n } = useI18n();
  const first = useSampleOrder(1);
  const second = useSampleOrder(2);

  return (
    <div className="space-y-3">
      {[first, second].map((order, index) => (
        <div
          key={order.no}
          className="flex items-center gap-3 rounded-xl border border-zinc-200 p-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <ShoppingCart size={15} />
          </span>
          <div className="min-w-0 flex-1 space-y-2">
            <Line w={index ? "w-20" : "w-28"} h="h-1.5" />
            <Line w={index ? "w-12" : "w-16"} h="h-1.5" tone="bg-zinc-100" />
          </div>
          <span className="shrink-0 text-[11px] font-semibold text-zinc-800">{order.total}</span>
        </div>
      ))}

      {/* Recovered against abandoned - the one pair of invented numbers. */}
      <div>
        <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
          <span className="block h-full w-[64%] rounded-full bg-amber-500" />
        </div>
        <p className="mt-2 text-[11px] font-medium text-zinc-500">
          {n(9)} / {n(14)}
        </p>
      </div>
    </div>
  );
}

/* The refunded order from the hero listing, with the money going back. */
function PreviewRefunds() {
  const order = useSampleOrder(3);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 rounded-xl border border-dashed border-rose-300 bg-rose-50/50 p-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white">
          <Undo2 size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xl font-semibold text-zinc-900">{order.total}</p>
          <span className="mt-1.5 block">
            <Line w="w-24" h="h-1.5" tone="bg-rose-200" />
          </span>
        </div>
        <Chip tone="rose">{order.status}</Chip>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 px-3 py-2.5 text-[11px] font-medium">
        <span className="truncate text-zinc-900">{order.no}</span>
        <span className="truncate text-zinc-500">{order.payment}</span>
      </div>
    </div>
  );
}

/* A plan that charges itself: three cycles taken, the rest still to come. */
function PreviewSubscriptions() {
  const { t, n } = useI18n();
  const taken = 3;
  const cycles = 6;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-xl border border-zinc-200 p-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
          <RefreshCw size={15} />
        </span>
        <div className="min-w-0 flex-1 space-y-2">
          <Line w="w-28" h="h-1.5" />
          <Line w="w-16" h="h-1.5" tone="bg-zinc-100" />
        </div>
        <Chip tone="sky">{n(30)}</Chip>
      </div>

      <Field label="w-14" value={t("landing.mock.price1")} />

      <div className="rounded-xl border border-zinc-200 p-3">
        <div className="flex items-center justify-between gap-3">
          <Line w="w-20" h="h-1.5" />
          <span className="text-[11px] font-medium text-zinc-500">
            {n(taken)} / {n(12)}
          </span>
        </div>
        <div className="mt-2.5 flex gap-1.5">
          {Array.from({ length: cycles }, (_, index) => (
            <span
              key={index}
              className={`h-6 flex-1 rounded-md ${
                index < taken ? "bg-sky-500" : "border border-dashed border-zinc-300 bg-zinc-50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* Index by index, the order of `landing.modules.groups.orders.items`. */
const ORDERS_PREVIEWS = [
  PreviewOrderDetail,
  PreviewIncomplete,
  PreviewRefunds,
  PreviewSubscriptions,
];

function OrdersShowcase(props) {
  return (
    <ShowcaseWindow {...props} previews={ORDERS_PREVIEWS} chrome="landing.demo.tabs.orders" />
  );
}

/* ─────────────────── stock showcase ─────────────────── */

/*
  The Stock band's side, which is the right one: Stock is the third module,
  so the alternation hands it back the side Catalogue had.

  Three features and three different answers to "how much is there?" - the
  live count you edit, the ledger behind it, and the shelf that is about to
  go empty. The band's own claim is that the count has a history, and a
  ledger is the one thing a list of three names cannot show.

  Products and their stock phrases come from the hero's catalogue listing,
  so the saree is forty-two in stock here and forty-two there, and the low
  count is the one the insights tile already prints. The adjustments in the
  ledger are invented - nothing on the page states them - and the rest is
  greeked.
*/

/* Live counts: the first product as the admin edits it, then the shelf. */
function PreviewStockLevels() {
  const { n, tList } = useI18n();
  const [name] = cells(tList("landing.demo.products.rows")[0] || "|||");

  /* Three shelves at a glance - the third is the one in trouble. */
  const levels = [
    { bar: "w-[88%]", fill: "bg-emerald-500", label: "w-12", value: n(42) },
    { bar: "w-[64%]", fill: "bg-emerald-500", label: "w-16", value: n(88) },
    { bar: "w-[12%]", fill: "bg-amber-500", label: "w-10", value: n(6) },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-xl border border-zinc-200 p-3">
        <span className="size-10 shrink-0 rounded-lg bg-emerald-100" />
        <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-zinc-900">
          {name}
        </span>
        {/* The count as a stepper, because this is the screen you type into. */}
        <span className="flex shrink-0 items-center gap-2 rounded-lg border border-zinc-200 px-2 py-1.5">
          <Minus size={11} className="text-zinc-300" />
          <span className="text-[12px] font-semibold text-zinc-900">{n(42)}</span>
          <Plus size={11} className="text-emerald-600" />
        </span>
      </div>

      <div className="space-y-2.5 rounded-xl border border-zinc-200 p-3">
        {levels.map((level) => (
          <div key={level.label} className="flex items-center gap-2.5">
            <Line w={level.label} h="h-1.5" />
            <span className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-zinc-100">
              <span className={`block h-full rounded-full ${level.bar} ${level.fill}`} />
            </span>
            <span className="shrink-0 text-[10px] font-semibold text-zinc-500">
              {level.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* The ledger behind the count, as a rail of adjustments. */
function PreviewStockHistory() {
  const { n } = useI18n();

  const entries = [
    { delta: `+${n(60)}`, tone: "emerald", w: "w-20" },
    { delta: `−${n(3)}`, tone: "rose", w: "w-24" },
    { delta: `+${n(24)}`, tone: "emerald", w: "w-16" },
  ];

  return (
    <div className="rounded-xl border border-zinc-200 p-3.5">
      {entries.map((entry, index) => {
        const last = index === entries.length - 1;

        return (
          <div key={entry.delta} className="flex gap-2.5">
            <span className="flex flex-col items-center">
              <span
                className={`size-2 shrink-0 rounded-full ${
                  index ? "bg-zinc-300" : "bg-emerald-500"
                }`}
              />
              {!last && <span className="w-px flex-1 bg-zinc-200" />}
            </span>

            <div className={`min-w-0 flex-1 ${last ? "" : "pb-4"}`}>
              <span className="flex items-center justify-between gap-2">
                <Line w={entry.w} h="h-1.5" />
                <Chip tone={entry.tone}>{entry.delta}</Chip>
              </span>
              <span className="mt-2 block">
                <Line w="w-10" h="h-1.5" tone="bg-zinc-100" />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* The seven the insights tile counts, and the two worst of them named. */
function PreviewLowStock() {
  const { n, tList } = useI18n();
  const rows = tList("landing.demo.products.rows");
  const low = [1, 3].map((index) => cells(rows[index] || "|||"));

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 rounded-xl border border-dashed border-amber-300 bg-amber-50/50 p-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white">
          <TriangleAlert size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xl font-semibold text-zinc-900">{n(7)}</p>
          <span className="mt-1.5 block">
            <Line w="w-20" h="h-1.5" tone="bg-amber-200" />
          </span>
        </div>
      </div>

      {low.map(([name, , , stock], index) => (
        <div
          key={name}
          className="flex items-center gap-2.5 rounded-lg border border-zinc-200 px-3 py-2.5">
          <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-zinc-900">
            {name}
          </span>
          <Chip tone={index ? "rose" : "amber"}>{stock}</Chip>
        </div>
      ))}
    </div>
  );
}

/* Index by index, the order of `landing.modules.groups.inventory.items`. */
const STOCK_PREVIEWS = [PreviewStockLevels, PreviewStockHistory, PreviewLowStock];

/* No `chrome`: Stock is its own screen, so the module's name titles it. */
function StockShowcase(props) {
  return <ShowcaseWindow {...props} previews={STOCK_PREVIEWS} />;
}

/* ─────────────────── insights showcase ─────────────────── */

/*
  The Insights band's side, the left one again - fourth module.

  Four features that are four different reports, which is exactly what a
  list of four names flattens: a dashboard of totals, a log of who changed
  what, a league table of customers and one of products. Drawn, they read
  as four screens; named, they read as one.

  The totals, the week of bars and the product names are the ones the hero's
  own insights and catalogue panels already print, so the revenue here is
  the revenue there. Order counts and units sold are invented - no string
  on the page states them - and the staff, the names and the timestamps are
  greeked, because a product shot of a customer list should not put words in
  a made-up customer's mouth.
*/

/* A tile from the hero's own insights: "Revenue|৳38,400|+12%". */
function StatTile({ tile }) {
  const [label, value, change] = cells(tile);
  const tone = change.startsWith("+")
    ? "text-emerald-600"
    : change.startsWith("−") || change.startsWith("-")
      ? "text-rose-600"
      : "text-zinc-400";

  return (
    <div className="min-w-0 rounded-xl border border-zinc-200 px-3 py-2.5">
      <p className="truncate text-[10px] font-medium tracking-wide text-zinc-400 uppercase">
        {label}
      </p>
      <p className="mt-0.5 truncate text-sm font-semibold text-zinc-900">{value}</p>
      <p className={`text-[10px] font-semibold ${tone}`}>{change}</p>
    </div>
  );
}

/* The dashboard: two of the hero's four tiles, over the same week. */
function PreviewStats() {
  const { t, tList } = useI18n();
  const tiles = tList("landing.demo.insights.tiles");

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-semibold tracking-wide text-zinc-400 uppercase">
        {t("landing.demo.insights.heading")}
      </p>

      <div className="grid grid-cols-2 gap-2.5">
        {tiles.slice(0, 2).map((tile) => (
          <StatTile key={tile} tile={tile} />
        ))}
      </div>

      <div className="flex h-16 items-end gap-1.5 rounded-xl border border-zinc-200 px-3 py-2.5">
        {WEEK_BARS.map((height, index) => (
          <span
            key={index}
            style={{ height: `${height}%` }}
            className={`flex-1 rounded-sm ${
              index === WEEK_BARS.length - 1 ? "bg-emerald-500" : "bg-emerald-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* Who changed what: a staff member, the thing, and when. */
function PreviewActivityLog() {
  const rows = [
    { tone: "bg-emerald-100", w: "w-24", meta: "w-12", chip: "emerald" },
    { tone: "bg-sky-100", w: "w-28", meta: "w-10", chip: "sky" },
    { tone: "bg-amber-100", w: "w-20", meta: "w-14", chip: "zinc" },
  ];

  return (
    <div className="space-y-2.5">
      {rows.map((row) => (
        <div
          key={row.w}
          className="flex items-center gap-3 rounded-xl border border-zinc-200 px-3 py-2.5">
          <span className={`size-8 shrink-0 rounded-full ${row.tone}`} />
          <div className="min-w-0 flex-1 space-y-2">
            <Line w={row.w} h="h-1.5" />
            <Line w={row.meta} h="h-1.5" tone="bg-zinc-100" />
          </div>
          <span className="shrink-0">
            <Chip tone={row.chip}>
              <Line w="w-6" h="h-1" tone="bg-current" />
            </Chip>
          </span>
        </div>
      ))}
    </div>
  );
}

/* The league table of buyers: rank, who, and how often they came back. */
function PreviewTopCustomers() {
  const { n } = useI18n();

  const rows = [
    { tone: "bg-emerald-100", w: "w-24", orders: 12 },
    { tone: "bg-sky-100", w: "w-20", orders: 9 },
    { tone: "bg-rose-100", w: "w-28", orders: 7 },
  ];

  return (
    <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 px-3">
      {rows.map((row, index) => (
        <div key={row.w} className="flex items-center gap-2.5 py-3">
          <span className="w-3 shrink-0 text-[11px] font-semibold text-zinc-400">
            {n(index + 1)}
          </span>
          <span className={`size-8 shrink-0 rounded-full ${row.tone}`} />
          <div className="min-w-0 flex-1 space-y-2">
            <Line w={row.w} h="h-1.5" />
            <Line w="w-10" h="h-1.5" tone="bg-zinc-100" />
          </div>
          <span className="shrink-0">
            <Chip tone={index ? "zinc" : "emerald"}>{n(row.orders)}</Chip>
          </span>
        </div>
      ))}
    </div>
  );
}

/* What actually sold, from the hero's catalogue - the three it names. */
function PreviewTopSelling() {
  const { n, tList } = useI18n();
  const rows = tList("landing.demo.products.rows");

  const sellers = [
    { index: 0, bar: "w-[92%]", units: 48 },
    { index: 1, bar: "w-[61%]", units: 31 },
    { index: 3, bar: "w-[44%]", units: 22 },
  ];

  return (
    <div className="space-y-3 rounded-xl border border-zinc-200 p-3.5">
      {sellers.map((seller) => {
        const [name] = cells(rows[seller.index] || "|||");

        return (
          <div key={name}>
            <div className="flex items-center justify-between gap-2.5">
              <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-zinc-900">
                {name}
              </span>
              <span className="shrink-0 text-[10px] font-semibold text-zinc-500">
                {n(seller.units)}
              </span>
            </div>
            <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-zinc-100">
              <span className={`block h-full rounded-full bg-emerald-500 ${seller.bar}`} />
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* Index by index, the order of `landing.modules.groups.insights.items`. */
const INSIGHTS_PREVIEWS = [
  PreviewStats,
  PreviewActivityLog,
  PreviewTopCustomers,
  PreviewTopSelling,
];

function InsightsShowcase(props) {
  return (
    <ShowcaseWindow
      {...props}
      previews={INSIGHTS_PREVIEWS}
      chrome="landing.demo.tabs.insights"
    />
  );
}

/* ─────────── shared preview pieces ─────────── */

/*
  Two shapes the remaining bands keep needing: a settings switch, and a sum
  of money the page has to invent.

  `Taka` is the one place a preview writes currency itself. Both catalogues
  spell the symbol ৳ and group thousands with a comma, so the digits go
  through `n` and the rest is the same string in either locale - which is
  why an invented sum can live here without a translator ever seeing it.
*/
function Toggle({ on = true }) {
  return (
    <span
      className={`flex h-4 w-7 shrink-0 items-center rounded-full px-0.5 ${
        on ? "justify-end bg-emerald-500" : "justify-start bg-zinc-200"
      }`}>
      <span className="size-3 rounded-full bg-white" />
    </span>
  );
}

function Taka({ amount }) {
  const { n } = useI18n();
  return <>৳{n(amount)}</>;
}

/* ─────────────────── accounting showcase ─────────────────── */

/*
  The Accounting band's side, the right one - fifth module.

  The band's claim is that margin is a number you read rather than one you
  work out, so the first panel is that subtraction: the revenue the hero
  already reports, the costs under it, the margin at the bottom. The other
  two are where those costs come from - a running expense list and a
  supplier invoice.

  Revenue is the insights tile's own figure. The costs, the margin and the
  invoice total are invented, because nothing on the page states them, and
  they are the one set of sums a preview writes itself - see `Taka`.
*/

/* Revenue, less costs, equals margin - the subtraction in one card. */
function PreviewLedger() {
  const { n, tList } = useI18n();
  const [label, revenue] = cells(tList("landing.demo.insights.tiles")[0] || "||");

  const lines = [
    { w: "w-16", value: <Taka amount="12,480" />, tone: "text-zinc-900" },
    { w: "w-12", value: <Taka amount="3,150" />, tone: "text-zinc-900" },
  ];

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-zinc-200 p-3.5">
        <p className="truncate text-[10px] font-medium tracking-wide text-zinc-400 uppercase">
          {label}
        </p>
        <p className="mt-0.5 truncate text-xl font-semibold text-zinc-900">{revenue}</p>

        <div className="mt-3 space-y-2.5 border-t border-zinc-100 pt-3">
          {lines.map((line) => (
            <div key={line.w} className="flex items-center justify-between gap-3">
              <Line w={line.w} h="h-1.5" />
              <span className={`text-[11px] font-medium ${line.tone}`}>−{line.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/50 px-3.5 py-3">
        <Line w="w-14" h="h-1.5" tone="bg-emerald-200" />
        <span className="flex items-center gap-2">
          <span className="text-sm font-semibold text-zinc-900">
            <Taka amount="22,770" />
          </span>
          <Chip tone="emerald">{n(59)}%</Chip>
        </span>
      </div>
    </div>
  );
}

/* What the shop spent, by category, with the month's total on top. */
function PreviewExpenses() {
  const rows = [
    { w: "w-20", meta: "w-10", amount: "4,200", tone: "bg-rose-100 text-rose-600" },
    { w: "w-24", meta: "w-12", amount: "2,850", tone: "bg-amber-100 text-amber-600" },
    { w: "w-16", meta: "w-8", amount: "1,430", tone: "bg-sky-100 text-sky-600" },
  ];

  return (
    <div className="space-y-2.5">
      {rows.map((row) => (
        <div
          key={row.w}
          className="flex items-center gap-3 rounded-xl border border-zinc-200 px-3 py-2.5">
          <span
            className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${row.tone}`}>
            <Banknote size={14} />
          </span>
          <div className="min-w-0 flex-1 space-y-2">
            <Line w={row.w} h="h-1.5" />
            <Line w={row.meta} h="h-1.5" tone="bg-zinc-100" />
          </div>
          <span className="shrink-0 text-[11px] font-semibold text-zinc-800">
            <Taka amount={row.amount} />
          </span>
        </div>
      ))}
    </div>
  );
}

/* A supplier invoice: one paid, one still open. */
function PreviewPurchases() {
  const { n } = useI18n();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 rounded-xl border border-zinc-200 p-3.5">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white">
          <Receipt size={17} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-semibold text-zinc-900">
            <Taka amount="18,600" />
          </p>
          <span className="mt-1.5 block">
            <Line w="w-20" h="h-1.5" />
          </span>
        </div>
        <Chip tone="amber">{n(14)}</Chip>
      </div>

      {[
        { w: "w-24", tone: "emerald" },
        { w: "w-16", tone: "zinc" },
      ].map((row) => (
        <div
          key={row.w}
          className="flex items-center gap-2.5 rounded-lg border border-zinc-200 px-3 py-2.5">
          <Landmark size={13} className="shrink-0 text-zinc-400" />
          <span className="min-w-0 flex-1">
            <Line w={row.w} h="h-1.5" />
          </span>
          <Chip tone={row.tone}>
            <Line w="w-7" h="h-1" tone="bg-current" />
          </Chip>
        </div>
      ))}
    </div>
  );
}

/* Index by index, the order of `landing.modules.groups.accounting.items`. */
const ACCOUNTING_PREVIEWS = [PreviewLedger, PreviewExpenses, PreviewPurchases];

function AccountingShowcase(props) {
  return <ShowcaseWindow {...props} previews={ACCOUNTING_PREVIEWS} />;
}

/* ─────────────────── delivery showcase ─────────────────── */

/*
  The Delivery band's side, the left one - sixth module.

  Four features and four screens: the rider carrying an order, the courier
  companies the shop can hand it to instead, the zones that decide what
  checkout charges, and the methods a customer picks between. The couriers
  are the four the page already names in its own section - `COURIERS` - with
  their own icons, so nothing is invented but the rates.
*/

/* The order already out with a rider, from the hero's own listing. */
function PreviewDeliveryJob() {
  const order = useSampleOrder(1);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-xl border border-zinc-200 p-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          <Bike size={17} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-zinc-900">{order.no}</span>
          <span className="mt-1.5 block">
            <Line w="w-16" h="h-1.5" />
          </span>
        </span>
        <Chip tone="sky">{order.status}</Chip>
      </div>

      <Field label="w-10" value={order.total} />

      {/* Picked up, on the way, not yet handed over. */}
      <div className="flex items-center gap-2.5 rounded-xl border border-zinc-200 px-3 py-3.5">
        <MapPin size={13} className="shrink-0 text-emerald-600" />
        <span className="h-0.5 w-6 shrink-0 rounded-full bg-emerald-500" />
        <Bike size={13} className="shrink-0 text-emerald-600" />
        <span className="h-0.5 min-w-0 flex-1 rounded-full bg-zinc-200" />
        <MapPin size={13} className="shrink-0 text-zinc-300" />
      </div>
    </div>
  );
}

/* The four courier companies the page already names, as switches. */
function PreviewCouriers() {
  const { t } = useI18n();

  return (
    <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 px-3">
      {COURIERS.map((courier, index) => {
        const Icon = courier.icon;

        return (
          <div key={courier.key} className="flex items-center gap-2.5 py-2.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Icon size={13} />
            </span>
            <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-zinc-900">
              {t(`landing.couriers.items.${courier.key}.name`)}
            </span>
            <Toggle on={index < 3} />
          </div>
        );
      })}
    </div>
  );
}

/* Zones, each with the rate checkout will charge for it. */
function PreviewZones() {
  const zones = [
    { w: "w-16", rate: "60", tone: "bg-emerald-100" },
    { w: "w-20", rate: "120", tone: "bg-sky-100" },
    { w: "w-14", rate: "180", tone: "bg-amber-100" },
  ];

  return (
    <div className="space-y-2.5">
      {zones.map((zone) => (
        <div
          key={zone.w}
          className="flex items-center gap-3 rounded-xl border border-zinc-200 px-3 py-2.5">
          <span
            className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${zone.tone} text-zinc-600`}>
            <MapPin size={13} />
          </span>
          <div className="min-w-0 flex-1 space-y-2">
            <Line w={zone.w} h="h-1.5" />
            <Line w="w-10" h="h-1.5" tone="bg-zinc-100" />
          </div>
          <span className="shrink-0 text-[11px] font-semibold text-zinc-800">
            <Taka amount={zone.rate} />
          </span>
        </div>
      ))}
    </div>
  );
}

/* What the customer picks between at checkout - one of them chosen. */
function PreviewShippingMethods() {
  const methods = [
    { w: "w-20", rate: "60", on: false, icon: Truck },
    { w: "w-24", rate: "120", on: true, icon: Zap },
    { w: "w-16", rate: "0", on: false, icon: Store },
  ];

  return (
    <div className="space-y-2.5">
      {methods.map((method) => {
        const Icon = method.icon;

        return (
          <div
            key={method.w}
            className={`flex items-center gap-3 rounded-xl border px-3 py-3 ${
              method.on ? "border-emerald-500 bg-emerald-50/50" : "border-zinc-200"
            }`}>
            <span
              className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${
                method.on ? "border-emerald-600 bg-emerald-600" : "border-zinc-300"
              }`}>
              {method.on && <span className="size-1.5 rounded-full bg-white" />}
            </span>
            <Icon size={14} className={method.on ? "text-emerald-600" : "text-zinc-400"} />
            <span className="min-w-0 flex-1">
              <Line w={method.w} h="h-1.5" />
            </span>
            <span className="shrink-0 text-[11px] font-semibold text-zinc-800">
              <Taka amount={method.rate} />
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* Index by index, the order of `landing.modules.groups.delivery.items`. */
const DELIVERY_PREVIEWS = [
  PreviewDeliveryJob,
  PreviewCouriers,
  PreviewZones,
  PreviewShippingMethods,
];

function DeliveryShowcase(props) {
  return <ShowcaseWindow {...props} previews={DELIVERY_PREVIEWS} />;
}

/* ─────────────────── team showcase ─────────────────── */

/*
  The Team band's side, the right one - seventh module, and the longest list
  after the catalogue.

  Five of its eight features are a person with a job: a manager, an agent, a
  supplier, a rider, an affiliate. They are the same screen with a different
  icon and a different set of boxes ticked, which is exactly the band's
  claim - everyone gets the screens their job needs - so they share one
  component rather than five near-copies of it. The other three are their
  own screens: the permission matrix, the customer list, and the CSV that
  adds a hundred users at once.

  Nobody is named. A product shot of a staff list that invents a person is
  worse than one that greeks them, so every name, email and address here is
  a grey bar.
*/

/*
  One job, its badge, and the screens it can open. `allowed` is the tick
  list - a width per row so the greeked screen names are not all one length.
*/
function RoleCard({ icon: Icon, tone, chip, count, allowed }) {
  const { n } = useI18n();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-xl border border-zinc-200 p-3">
        <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${tone}`}>
          <Icon size={17} />
        </span>
        <div className="min-w-0 flex-1 space-y-2">
          <Line w="w-24" h="h-1.5" />
          <Line w="w-14" h="h-1.5" tone="bg-zinc-100" />
        </div>
        <Chip tone={chip}>{n(count)}</Chip>
      </div>

      <div className="space-y-2.5 rounded-xl border border-zinc-200 p-3">
        {allowed.map((row) => (
          <div key={row.w} className="flex items-center gap-2.5">
            <span
              className={`flex size-4 shrink-0 items-center justify-center rounded border ${
                row.on ? "border-emerald-600 bg-emerald-600" : "border-zinc-300"
              }`}>
              {row.on && <Check size={11} className="text-white" />}
            </span>
            <Line w={row.w} h="h-1.5" tone={row.on ? "bg-zinc-200" : "bg-zinc-100"} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* Who can open what, as a grid of three roles against four screens. */
function PreviewRoles() {
  const rows = [
    { w: "w-16", on: [true, true, true] },
    { w: "w-20", on: [true, true, false] },
    { w: "w-14", on: [true, false, false] },
    { w: "w-24", on: [true, false, false] },
  ];

  return (
    <div className="rounded-xl border border-zinc-200 p-3.5">
      {/* The column heads, greeked: the roles are the page's own copy. */}
      <div className="mb-3 flex items-center gap-2.5 border-b border-zinc-100 pb-3">
        <span className="min-w-0 flex-1" />
        {["w-5", "w-5", "w-5"].map((width, index) => (
          <span key={index} className="flex w-6 justify-center">
            <Line w={width} h="h-1.5" tone="bg-zinc-200" />
          </span>
        ))}
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.w} className="flex items-center gap-2.5">
            <span className="min-w-0 flex-1">
              <Line w={row.w} h="h-1.5" />
            </span>
            {row.on.map((on, index) => (
              <span key={index} className="flex w-6 justify-center">
                {on ? (
                  <Check size={13} className="text-emerald-600" />
                ) : (
                  <Minus size={13} className="text-zinc-300" />
                )}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* The customer list, searchable - orders each, nobody named. */
function PreviewCustomers() {
  const { n } = useI18n();

  const rows = [
    { tone: "bg-emerald-100", w: "w-24", orders: 6 },
    { tone: "bg-sky-100", w: "w-20", orders: 3 },
    { tone: "bg-amber-100", w: "w-28", orders: 1 },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2">
        <Search size={13} className="shrink-0 text-zinc-400" />
        <Line w="w-16" h="h-1.5" tone="bg-zinc-100" />
      </div>

      <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 px-3">
        {rows.map((row) => (
          <div key={row.w} className="flex items-center gap-2.5 py-2.5">
            <span className={`size-8 shrink-0 rounded-full ${row.tone}`} />
            <div className="min-w-0 flex-1 space-y-2">
              <Line w={row.w} h="h-1.5" />
              <Line w="w-12" h="h-1.5" tone="bg-zinc-100" />
            </div>
            <Chip tone="zinc">{n(row.orders)}</Chip>
          </div>
        ))}
      </div>
    </div>
  );
}

/* The five jobs, each the same screen with a different set of keys. */
function PreviewManager() {
  return (
    <RoleCard
      icon={Store}
      tone="bg-emerald-50 text-emerald-600"
      chip="emerald"
      count={12}
      allowed={[
        { w: "w-20", on: true },
        { w: "w-16", on: true },
        { w: "w-24", on: true },
        { w: "w-14", on: true },
      ]}
    />
  );
}

function PreviewAgent() {
  return (
    <RoleCard
      icon={Headset}
      tone="bg-sky-50 text-sky-600"
      chip="sky"
      count={8}
      allowed={[
        { w: "w-24", on: true },
        { w: "w-16", on: true },
        { w: "w-20", on: false },
        { w: "w-14", on: false },
      ]}
    />
  );
}

function PreviewSuppliers() {
  return (
    <RoleCard
      icon={Boxes}
      tone="bg-amber-50 text-amber-600"
      chip="amber"
      count={5}
      allowed={[
        { w: "w-16", on: true },
        { w: "w-24", on: true },
        { w: "w-20", on: false },
        { w: "w-12", on: false },
      ]}
    />
  );
}

function PreviewRiders() {
  return (
    <RoleCard
      icon={Bike}
      tone="bg-emerald-50 text-emerald-600"
      chip="emerald"
      count={3}
      allowed={[
        { w: "w-20", on: true },
        { w: "w-14", on: false },
        { w: "w-24", on: false },
        { w: "w-16", on: false },
      ]}
    />
  );
}

function PreviewAffiliates() {
  return (
    <RoleCard
      icon={Megaphone}
      tone="bg-violet-50 text-violet-600"
      chip="zinc"
      count={9}
      allowed={[
        { w: "w-24", on: true },
        { w: "w-16", on: true },
        { w: "w-20", on: false },
        { w: "w-12", on: false },
      ]}
    />
  );
}

/* A hundred users from one file - the catalogue's upload, for people. */
function PreviewBulkUsers() {
  const { n } = useI18n();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-xl border border-zinc-200 p-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          <Users size={16} />
        </span>
        <div className="min-w-0 flex-1 space-y-2">
          <Line w="w-24" h="h-1.5" />
          <Line w="w-14" h="h-1.5" tone="bg-zinc-100" />
        </div>
        <Chip tone="emerald">CSV</Chip>
      </div>

      <div>
        <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
          <span className="block h-full w-[84%] rounded-full bg-emerald-500" />
        </div>
        <p className="mt-2 text-[11px] font-medium text-zinc-500">
          {n(84)} / {n(100)}
        </p>
      </div>
    </div>
  );
}

/* Index by index, the order of `landing.modules.groups.people.items`. */
const PEOPLE_PREVIEWS = [
  PreviewRoles,
  PreviewCustomers,
  PreviewManager,
  PreviewAgent,
  PreviewSuppliers,
  PreviewRiders,
  PreviewBulkUsers,
  PreviewAffiliates,
];

function PeopleShowcase(props) {
  return <ShowcaseWindow {...props} previews={PEOPLE_PREVIEWS} />;
}

/* ─────────────────── content showcase ─────────────────── */

/*
  The Content band's side, the left one - ninth module.

  Three features: the posts, the assistant that drafts them, and the library
  the photos live in. The assistant panel is the catalogue's own, pointed at
  the blog sample the AI section already carries, so the draft shown here is
  the draft shown there.
*/

/* The post list: one published, one scheduled, one still a draft. */
function PreviewBlog() {
  const posts = [
    { tone: "bg-emerald-100", w: "w-24", chip: "emerald" },
    { tone: "bg-sky-100", w: "w-20", chip: "sky" },
    { tone: "bg-zinc-100", w: "w-28", chip: "zinc" },
  ];

  return (
    <div className="space-y-2.5">
      {posts.map((post) => (
        <div
          key={post.w}
          className="flex items-center gap-3 rounded-xl border border-zinc-200 p-2.5">
          <span className={`size-10 shrink-0 rounded-lg ${post.tone}`} />
          <div className="min-w-0 flex-1 space-y-2">
            <Line w={post.w} h="h-1.5" />
            <Line w="w-12" h="h-1.5" tone="bg-zinc-100" />
          </div>
          <span className="shrink-0">
            <Chip tone={post.chip}>
              <Line w="w-6" h="h-1" tone="bg-current" />
            </Chip>
          </span>
        </div>
      ))}
    </div>
  );
}

function PreviewAiBlog() {
  return <AiSample sample="blog" />;
}

/* Everything the shop has shot, and the tile that takes more. */
function PreviewMedia() {
  const tones = [
    "bg-emerald-100",
    "bg-sky-100",
    "bg-amber-100",
    "bg-rose-100",
    "bg-violet-100",
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2.5">
        {tones.map((tone) => (
          <span key={tone} className={`aspect-square rounded-lg ${tone}`} />
        ))}
        <span className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-zinc-300 text-zinc-300">
          <Plus size={16} />
        </span>
      </div>

      <div className="flex items-center gap-2.5 rounded-lg border border-zinc-200 px-3 py-2.5">
        <Upload size={13} className="shrink-0 text-emerald-600" />
        <Line w="w-20" h="h-1.5" />
      </div>
    </div>
  );
}

/* Index by index, the order of `landing.modules.groups.content.items`. */
const CONTENT_PREVIEWS = [PreviewBlog, PreviewAiBlog, PreviewMedia];

function ContentShowcase(props) {
  return <ShowcaseWindow {...props} previews={CONTENT_PREVIEWS} />;
}

/* ─────────────────── support showcase ─────────────────── */

/*
  The Support band's side, the right one - tenth module, and the only one
  with a single feature, so the window drops its tab strip entirely.

  The band's claim is that the order history is attached to the ticket, and
  that is the whole illustration: the question on top, the order it is about
  underneath, taken from the hero's own listing.
*/
function PreviewTickets() {
  const { n } = useI18n();
  const order = useSampleOrder(2);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-xl border border-zinc-200 p-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
          <Headset size={17} />
        </span>
        <div className="min-w-0 flex-1 space-y-2">
          <Line w="w-28" h="h-1.5" />
          <Line w="w-16" h="h-1.5" tone="bg-zinc-100" />
        </div>
        <Chip tone="sky">{n(2)}</Chip>
      </div>

      {/* The order the ticket is about, attached rather than asked for. */}
      <div className="rounded-xl border border-zinc-200 p-3">
        <div className="flex items-center justify-between gap-3">
          <span className="truncate text-[11px] font-semibold text-zinc-900">{order.no}</span>
          <Chip tone="emerald">{order.status}</Chip>
        </div>
        <div className="mt-2.5 flex items-center justify-between gap-3 border-t border-zinc-100 pt-2.5">
          <Line w="w-16" h="h-1.5" />
          <span className="text-[11px] font-medium text-zinc-800">{order.total}</span>
        </div>
      </div>

      <div className="space-y-2 rounded-xl bg-zinc-50 px-3 py-2.5">
        <Line w="w-24" h="h-1.5" tone="bg-zinc-200" />
        <Line w="w-16" h="h-1.5" tone="bg-zinc-200" />
      </div>
    </div>
  );
}

/* Index by index, the order of `landing.modules.groups.support.items`. */
const SUPPORT_PREVIEWS = [PreviewTickets];

function SupportShowcase(props) {
  return <ShowcaseWindow {...props} previews={SUPPORT_PREVIEWS} />;
}

/* ─────────────────── page builder showcase ─────────────────── */

/*
  The Page builder band's side, the right one - eighth module, and the
  longest list on the page after the catalogue.

  Ten features, and nine of them are a page: a canvas, a palette, a library
  of templates, a landing page, a product page, a header and footer, a
  generated section, a generated layout. So nine of them are drawn as pages
  - blocks on a board, which is what the builder actually shows you - and
  the tenth, the Tailwind classes, is drawn as the classes themselves.

  The page already has a working builder demo further down (#builder); this
  is deliberately the flat version of it, because a band that animates while
  you read the one below it is two demos fighting.
*/

/*
  A page as the builder draws it: a stack of blocks, each with a height and
  either a tone of its own or a row of columns. `tone` carries whatever
  classes the block needs, so a dashed drop target is just another tone.
*/
function Wireframe({ blocks, className = "" }) {
  return (
    <div className={`space-y-2 rounded-xl border border-zinc-200 p-2.5 ${className}`}>
      {blocks.map((block, index) =>
        block.cols ? (
          <span key={index} className="flex gap-2">
            {block.cols.map((tone, spot) => (
              <span key={spot} className={`flex-1 rounded-md ${block.h} ${tone}`} />
            ))}
          </span>
        ) : (
          <span key={index} className={`block rounded-md ${block.h} ${block.tone}`} />
        ),
      )}
    </div>
  );
}

/* The canvas, with the palette beside it and a block mid-drop. */
function PreviewBuilderCanvas() {
  return (
    <div className="flex gap-2.5">
      <div className="w-12 shrink-0 space-y-2 rounded-xl border border-zinc-200 p-2">
        {BUILDER_CATEGORIES.slice(0, 4).map((category) => {
          const Icon = category.icon;

          return (
            <span
              key={category.key}
              className="flex h-7 items-center justify-center rounded-md bg-zinc-100 text-zinc-500">
              <Icon size={13} />
            </span>
          );
        })}
      </div>

      <Wireframe
        className="min-w-0 flex-1"
        blocks={[
          { h: "h-10", tone: "bg-emerald-100" },
          { h: "h-5", cols: ["bg-zinc-100", "bg-zinc-100"] },
          { h: "h-6", tone: "border border-dashed border-emerald-400 bg-emerald-50" },
          { h: "h-8", tone: "bg-sky-100" },
          { h: "h-4", tone: "bg-zinc-100" },
        ]}
      />
    </div>
  );
}

/* The palette itself: the elements, as many as fit, and more behind the plus. */
function PreviewElements() {
  const icons = [
    LayoutTemplate,
    FileText,
    ImageIcon,
    Store,
    Megaphone,
    Star,
    Percent,
    Tag,
  ];

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {icons.map((Icon, index) => (
        <span
          key={index}
          className="flex aspect-square items-center justify-center rounded-xl border border-zinc-200 text-zinc-500">
          <Icon size={16} />
        </span>
      ))}
      <span className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-zinc-300 text-zinc-300">
        <Plus size={16} />
      </span>
    </div>
  );
}

/* The library: four templates, the first one picked. */
function PreviewTemplates() {
  const templates = [
    { key: "a", blocks: ["h-5 bg-emerald-100", "h-2 bg-zinc-100", "h-3 bg-zinc-100"] },
    { key: "b", blocks: ["h-3 bg-sky-100", "h-5 bg-zinc-100", "h-2 bg-zinc-100"] },
    { key: "c", blocks: ["h-2 bg-amber-100", "h-3 bg-zinc-100", "h-5 bg-zinc-100"] },
    { key: "d", blocks: ["h-4 bg-rose-100", "h-4 bg-zinc-100", "h-2 bg-zinc-100"] },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {templates.map((template, index) => (
        <div
          key={template.key}
          className={`space-y-1.5 rounded-lg border p-2 ${
            index ? "border-zinc-200" : "border-emerald-500 ring-2 ring-emerald-100"
          }`}>
          {template.blocks.map((block) => (
            <span key={block} className={`block rounded ${block}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

function PreviewAiTemplate() {
  return <AiSample sample="template" />;
}

/* A landing page end to end, which is why this one is the tall stack. */
function PreviewLandingPage() {
  return (
    <Wireframe
      blocks={[
        { h: "h-12", tone: "bg-emerald-100" },
        { h: "h-3", tone: "bg-zinc-100" },
        { h: "h-7", cols: ["bg-zinc-100", "bg-zinc-100", "bg-zinc-100"] },
        { h: "h-9", tone: "bg-sky-100" },
        { h: "h-5", tone: "bg-zinc-200" },
      ]}
    />
  );
}

/* The product page template: gallery, price, the button that matters. */
function PreviewProductTemplate() {
  return (
    <div className="space-y-2.5 rounded-xl border border-zinc-200 p-2.5">
      <div className="flex gap-2.5">
        <span className="size-16 shrink-0 rounded-md bg-emerald-100" />
        <div className="min-w-0 flex-1 space-y-2">
          <Line w="w-20" h="h-1.5" />
          <Line w="w-12" h="h-2" tone="bg-zinc-300" />
          <span className="block h-5 w-16 rounded-md bg-zinc-900" />
        </div>
      </div>
      <span className="block h-3 rounded-md bg-zinc-100" />
      <div className="flex gap-2">
        {["a", "b", "c"].map((spot) => (
          <span key={spot} className="h-8 flex-1 rounded-md bg-zinc-100" />
        ))}
      </div>
    </div>
  );
}

/* Header and footer are the two blocks you edit once for every page. */
function PreviewHeaderFooter() {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500 bg-emerald-50/40 px-3 py-2.5 ring-2 ring-emerald-100">
        <span className="size-6 shrink-0 rounded-md bg-emerald-600" />
        <span className="flex min-w-0 flex-1 gap-2">
          <Line w="w-8" h="h-1.5" tone="bg-emerald-200" />
          <Line w="w-10" h="h-1.5" tone="bg-emerald-200" />
          <Line w="w-6" h="h-1.5" tone="bg-emerald-200" />
        </span>
        <Store size={13} className="shrink-0 text-emerald-600" />
      </div>

      <div className="space-y-2 rounded-xl border border-dashed border-zinc-200 p-3">
        <span className="block h-3 rounded-md bg-zinc-100" />
        <span className="block h-8 rounded-md bg-zinc-100" />
      </div>

      <div className="rounded-xl border border-emerald-500 bg-emerald-50/40 p-3 ring-2 ring-emerald-100">
        <div className="flex gap-3">
          {["a", "b", "c"].map((column) => (
            <div key={column} className="flex-1 space-y-1.5">
              <Line w="w-full" h="h-1.5" tone="bg-emerald-200" />
              <Line w="w-2/3" h="h-1.5" tone="bg-emerald-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/*
  The one feature that is not a page: the classes the builder writes as you
  drag. Tailwind utilities are code rather than copy, so they are the same
  four strings under either locale - and showing them is the whole claim.
*/
function PreviewTailwind() {
  const classes = ["rounded-xl", "bg-emerald-600", "px-6", "py-3"];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center rounded-xl border border-zinc-200 p-4">
        <span className="rounded-xl bg-emerald-600 px-6 py-3">
          <Line w="w-10" h="h-1.5" tone="bg-emerald-200" />
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 rounded-xl border border-zinc-200 p-3">
        {classes.map((name) => (
          <span
            key={name}
            className="rounded-md bg-zinc-100 px-1.5 py-1 font-mono text-[10px] text-zinc-600">
            {name}
          </span>
        ))}
        <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-1 text-[10px] font-semibold text-emerald-700">
          <Code size={10} />
        </span>
      </div>
    </div>
  );
}

/*
  A described section and the blocks it came back as - the same prompt and
  the same block list the builder demo further down uses, so the two agree.
*/
function PreviewAiSection() {
  const { t, tList } = useI18n();

  return (
    <div className="space-y-3">
      <p className="rounded-lg bg-zinc-100 px-3 py-2 text-[11px] leading-relaxed text-zinc-500">
        {t("landing.builder.ai.prompt")}
      </p>

      <div className="space-y-2 rounded-xl border border-emerald-200 bg-emerald-50/40 p-3">
        <span className="mb-0.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-wide text-emerald-700 uppercase">
          <Sparkles size={11} />
          {t("landing.builder.ai.note")}
        </span>
        {tList("landing.builder.ai.blocks").map((block) => (
          <span
            key={block}
            className="block truncate rounded-md bg-white px-2 py-1.5 text-[10px] font-medium text-zinc-700 ring-1 ring-emerald-100">
            {block}
          </span>
        ))}
      </div>
    </div>
  );
}

/* Three layouts offered for the same page, and the one taken. */
function PreviewLayoutGen() {
  const layouts = [
    ["h-6 bg-emerald-100", "h-3 bg-zinc-100", "h-8 bg-zinc-100", "h-2 bg-zinc-100"],
    ["h-3 bg-sky-100", "h-8 bg-zinc-100", "h-3 bg-zinc-100", "h-4 bg-zinc-100"],
    ["h-8 bg-amber-100", "h-2 bg-zinc-100", "h-4 bg-zinc-100", "h-4 bg-zinc-100"],
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles size={12} className="shrink-0 text-emerald-600" />
        <Line w="w-24" h="h-1.5" />
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {layouts.map((blocks, index) => (
          <div
            key={index}
            className={`space-y-1.5 rounded-lg border p-2 ${
              index ? "border-zinc-200" : "border-emerald-500 ring-2 ring-emerald-100"
            }`}>
            {blocks.map((block) => (
              <span key={block} className={`block rounded ${block}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* Index by index, the order of `landing.modules.groups.builder.items`. */
const BUILDER_PREVIEWS = [
  PreviewBuilderCanvas,
  PreviewElements,
  PreviewTemplates,
  PreviewAiTemplate,
  PreviewLandingPage,
  PreviewProductTemplate,
  PreviewHeaderFooter,
  PreviewTailwind,
  PreviewAiSection,
  PreviewLayoutGen,
];

function BuilderBandShowcase(props) {
  return <ShowcaseWindow {...props} previews={BUILDER_PREVIEWS} />;
}

/* ─────────────────── payments showcase ─────────────────── */

/*
  The Payments band's side, the left one - eleventh module.

  Here the feature names are the brands, and the tab strip prints all eight
  of them at once, so nothing a visitor is scanning for ("do they take
  bKash?") moves behind a click. What the panel adds is the thing the band
  claims: each one is a settings screen in the dashboard, not a plugin - a
  switch, the credentials it needs, and the method sitting in checkout.

  The brand's colour and the group it belongs to come from PAYMENT_GROUPS,
  which already holds both, so a wallet shows a wallet's fields and the two
  offline methods show instructions instead of keys.
*/

/* The module lists its methods in this order; the groups hold the colours. */
const PAYMENT_ORDER = ["cod", "bkash", "nagad", "rocket", "bank", "paystation", "sslcommerz", "aamarpay"];

function paymentMeta(key) {
  for (const group of PAYMENT_GROUPS) {
    const hit = group.items.find((item) => item.key === key);
    if (hit) return { ...hit, icon: group.icon, group: group.key };
  }

  return { key, accent: "text-zinc-700", ring: "ring-zinc-200", icon: Wallet, group: "offline" };
}

function PaymentSetting({ methodKey }) {
  const { t } = useI18n();
  const meta = paymentMeta(methodKey);
  const Icon = meta.icon;
  const offline = meta.group === "offline";

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-xl border border-zinc-200 p-3">
        <span
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ${meta.ring} ${meta.accent}`}>
          <Icon size={17} />
        </span>
        <span className={`min-w-0 flex-1 truncate text-sm font-semibold ${meta.accent}`}>
          {t(`landing.payments.items.${methodKey}.name`)}
        </span>
        <Toggle on />
      </div>

      {/*
        A gateway and a wallet are configured with keys; cash and a bank
        slip are configured with words, so that panel shows a note instead.
      */}
      {offline ? (
        <div className="space-y-2 rounded-xl border border-zinc-200 p-3">
          <Line w="w-28" h="h-1.5" />
          <Line w="w-20" h="h-1.5" tone="bg-zinc-100" />
          <Line w="w-24" h="h-1.5" tone="bg-zinc-100" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-zinc-200 px-3 py-2">
            <Line w="w-8" h="h-1.5" />
            <span className="mt-2 block">
              <Line w="w-16" h="h-1.5" tone="bg-zinc-300" />
            </span>
          </div>
          <div className="rounded-lg border border-zinc-200 px-3 py-2">
            <Line w="w-10" h="h-1.5" />
            <span className="mt-2 block">
              <Line w="w-12" h="h-1.5" tone="bg-zinc-300" />
            </span>
          </div>
        </div>
      )}

      {/* The same method, as the customer meets it at checkout. */}
      <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500 bg-emerald-50/50 px-3 py-3">
        <span className="flex size-4 shrink-0 items-center justify-center rounded-full border border-emerald-600 bg-emerald-600">
          <span className="size-1.5 rounded-full bg-white" />
        </span>
        <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-zinc-900">
          {t(`landing.payments.items.${methodKey}.name`)}
        </span>
        <ShieldCheck size={13} className="shrink-0 text-emerald-600" />
      </div>
    </div>
  );
}

/* One preview per method, named rather than inlined so React has a name. */
function paymentPreview(key) {
  function PaymentPreview() {
    return <PaymentSetting methodKey={key} />;
  }

  return PaymentPreview;
}

/* Index by index, the order of `landing.modules.groups.payments.items`. */
const PAYMENTS_PREVIEWS = PAYMENT_ORDER.map(paymentPreview);

function PaymentsShowcase(props) {
  return <ShowcaseWindow {...props} previews={PAYMENTS_PREVIEWS} />;
}

/* ─────────────────── integrations showcase ─────────────────── */

/*
  The Integrations band's side, the right one - the twelfth and last module.

  Same reasoning as payments: the names are the products, the tab strip
  keeps all eight of them visible, and the panel shows what the band claims
  - that each one is an ID you paste and a switch you flip, not a code edit.
  The id is greeked, because a real-looking pixel id in a product shot is a
  number somebody will try to use.

  The last two are not pastable ids, so they are not drawn as one: custom
  extensions get a slot you install into, and the courier APIs get the four
  couriers the page already names, each with its own connection.
*/

/* A tracking id pasted into the dashboard, and live on the storefront. */
function IntegrationSetting({ icon: Icon, name }) {
  const { t } = useI18n();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-xl border border-zinc-200 p-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-zinc-900">
          <Icon size={16} className="text-emerald-400" />
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900">
          {t(`landing.integrations.items.${name}.name`)}
        </span>
        <Toggle on />
      </div>

      <div className="rounded-xl border border-zinc-200 px-3 py-2.5">
        <Line w="w-10" h="h-1.5" />
        <div className="mt-2.5 flex items-center gap-2 rounded-md bg-zinc-50 px-2 py-1.5">
          <Line w="w-24" h="h-1.5" tone="bg-zinc-300" />
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/50 px-3 py-2.5">
        <span className="cs-pulse size-2 shrink-0 rounded-full bg-emerald-500" />
        <Line w="w-20" h="h-1.5" tone="bg-emerald-200" />
      </div>
    </div>
  );
}

/* The five pasteable ids, in the module's own order. */
const INTEGRATION_PREVIEW_ICONS = {
  facebook: Megaphone,
  tiktok: Video,
  analytics: ChartPie,
  maps: MapIcon,
  clarity: Eye,
  claude: Sparkles,
};

function integrationPreview(key) {
  function IntegrationPreview() {
    return <IntegrationSetting icon={INTEGRATION_PREVIEW_ICONS[key]} name={key} />;
  }

  return IntegrationPreview;
}

/* An extension dropped into the slot, and two more waiting. */
function PreviewExtensions() {
  const { t } = useI18n();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-xl border border-zinc-200 p-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-zinc-900">
          <Puzzle size={16} className="text-emerald-400" />
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900">
          {t("landing.integrations.items.extensions.name")}
        </span>
        <Toggle on />
      </div>

      {[
        { w: "w-24", on: true },
        { w: "w-16", on: false },
      ].map((row) => (
        <div
          key={row.w}
          className="flex items-center gap-2.5 rounded-lg border border-zinc-200 px-3 py-2.5">
          <Plug size={13} className={`shrink-0 ${row.on ? "text-emerald-600" : "text-zinc-300"}`} />
          <span className="min-w-0 flex-1">
            <Line w={row.w} h="h-1.5" />
          </span>
          <Toggle on={row.on} />
        </div>
      ))}

      <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 py-3 text-zinc-300">
        <Plus size={14} />
      </div>
    </div>
  );
}

/* The courier APIs: the four the page names, three of them wired up. */
function PreviewCourierApis() {
  const { t } = useI18n();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-xl border border-zinc-200 p-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-zinc-900">
          <Antenna size={16} className="text-emerald-400" />
        </span>
        <div className="min-w-0 flex-1 space-y-2">
          <Line w="w-20" h="h-1.5" />
          <Line w="w-12" h="h-1.5" tone="bg-zinc-100" />
        </div>
      </div>

      <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 px-3">
        {COURIERS.map((courier, index) => {
          const Icon = courier.icon;
          const live = index < 3;

          return (
            <div key={courier.key} className="flex items-center gap-2.5 py-2.5">
              <Icon size={13} className={`shrink-0 ${live ? "text-emerald-600" : "text-zinc-300"}`} />
              <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-zinc-900">
                {t(`landing.couriers.items.${courier.key}.name`)}
              </span>
              <span
                className={`size-2 shrink-0 rounded-full ${live ? "bg-emerald-500" : "bg-zinc-200"}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Index by index, the order of `landing.modules.groups.integrations.items`. */
const INTEGRATIONS_PREVIEWS = [
  ...["facebook", "tiktok", "analytics", "maps", "clarity", "claude"].map(integrationPreview),
  PreviewExtensions,
  PreviewCourierApis,
];

function IntegrationsShowcase(props) {
  return <ShowcaseWindow {...props} previews={INTEGRATIONS_PREVIEWS} />;
}

/* Which bands trade their feature grid for a window of their own. */
const BAND_VISUALS = {
  catalog: CatalogueShowcase,
  orders: OrdersShowcase,
  inventory: StockShowcase,
  insights: InsightsShowcase,
  accounting: AccountingShowcase,
  delivery: DeliveryShowcase,
  people: PeopleShowcase,
  content: ContentShowcase,
  support: SupportShowcase,
  builder: BuilderBandShowcase,
  payments: PaymentsShowcase,
  integrations: IntegrationsShowcase,
};

/*
  A module with three features or fewer keeps one column, so its handful of
  cards read as a deliberate short list rather than as a two-column grid
  with the right half missing.
*/
function FeatureGrid({ group, needle, shaded }) {
  return (
    <ul
      className={`grid grid-cols-1 gap-2.5 ${group.hits.length > 3 ? "sm:grid-cols-2" : ""}`}>
      {group.hits.map((item) => (
        <li
          key={item}
          className={`flex items-start gap-2.5 rounded-xl border border-zinc-200 px-3.5 py-3 text-sm text-zinc-800 ${
            shaded ? "bg-white" : "bg-zinc-50"
          }`}>
          <Check size={14} className="mt-0.5 shrink-0 text-emerald-600" />
          <span>
            <Highlight text={item} needle={group.matchedName ? "" : needle} />
          </span>
        </li>
      ))}
    </ul>
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
        const Visual = BAND_VISUALS[group.key];
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
                Every module now trades its grid for a window you can click
                through. `BAND_VISUALS` is still the switch, so a band drops
                back to `FeatureGrid` by leaving that map.
              */}
              <div className={flipped ? "lg:order-1" : undefined}>
                {Visual ? (
                  <Visual group={group} needle={needle} />
                ) : (
                  <FeatureGrid group={group} needle={needle} shaded={flipped} />
                )}
              </div>

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
