"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import crypto from "crypto";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  Copy,
  CreditCard,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  KeyRound,
  LayoutDashboard,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plus,
  RefreshCw,
  Rocket,
  Server,
  ShieldAlert,
  ShieldCheck,
  Store,
  Trash2,
  User,
} from "lucide-react";

import enMessages from "../../messages/en.json";


const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

/*
  Lemon Squeezy, from the browser only. This wizard has no API routes of its
  own - whatever it does not do against the Vercel API it posts to WordPress -
  so checkout is a hosted Lemon Squeezy link opened as an overlay by Lemon.js,
  and the finished order is handed to WordPress afterwards. Nothing here is
  proof of payment on its own: the record to trust is the `order_created`
  webhook arriving at the WordPress side, which is also where the API key
  belongs. There is no publishable key to set - a checkout link is the whole
  front-end credential.
*/
const LEMON_JS_SRC = "https://app.lemonsqueezy.com/js/lemon.js";

/*
  Test or live is a property of the Lemon Squeezy store and of the link pasted
  below, not something this page can impose - so this only decides whether the
  step warns that real cards are in play. It defaults to `test` so an unset
  value cannot quietly imply a live checkout; a finished order reports its own
  `test_mode`, and that is what gets recorded.
*/
const LEMON_MODE = process.env.NEXT_PUBLIC_LEMONSQUEEZY_MODE || "test";

/*
  ComboStore's two Lemon Squeezy subscriptions, by plan key - the checkout link
  each product's Share panel hands out, pasted whole. Enterprise is absent on
  purpose: its price is "Custom", so it is a sales conversation rather than a
  checkout, and a plan missing from this map is treated as unbilled.

  Whole links rather than a store slug and a variant id: that is what the
  dashboard gives you, it survives Lemon Squeezy changing its URL shapes, and a
  link already distinguishes a test-mode product from a live one. `envKey` is
  carried so a plan whose link was never set can name the variable that is
  missing instead of opening an empty overlay. The `process.env` reads are
  written out one by one because Next.js inlines `NEXT_PUBLIC_*` by static text
  match - `process.env[key]` would arrive undefined in the browser.
*/
const LEMON_PLAN_LINKS = {
  starter: {
    envKey: "NEXT_PUBLIC_LEMONSQUEEZY_LINK_STARTER",
    link: process.env.NEXT_PUBLIC_LEMONSQUEEZY_LINK_STARTER || "",
  },
  business: {
    envKey: "NEXT_PUBLIC_LEMONSQUEEZY_LINK_BUSINESS",
    link: process.env.NEXT_PUBLIC_LEMONSQUEEZY_LINK_BUSINESS || "",
  },
};

/* Nothing to load if no plan has a link: the step says so instead of pulling
   in a script that would have nothing to open. */
const LEMON_CONFIGURED = Object.values(LEMON_PLAN_LINKS).some(
  (plan) => plan.link
);

/*
  One repo, one project. combostore-storefront is retired: the dashboard repo
  serves the storefront at `/` and the admin screens under `/dashboard`, so
  there is nothing left to deploy separately and the project takes the root
  domain rather than a `dashboard.` subdomain.
*/
const DASHBOARD_REPO = "pickplugins/combostore";

/*
  WordPress lives on a subdomain of the store's main domain - the root domain
  belongs to the Vercel project. Step 1 already shows the operator this split,
  and `NEXT_PUBLIC_SERVER_URL` is built from it.
*/
const WP_SUBDOMAIN = "server";

/*
  Where ComboStore itself lives: the header wordmark links here, and it is the
  origin clients have to allow-list.

  The connection check runs from this page, so the browser sends a CORS
  preflight to WordPress before the POST ever arrives. WordPress answers REST
  requests without CORS headers by default, which the browser reports as an
  opaque network failure - indistinguishable from a domain that does not
  resolve. So this origin has to be on the Enable CORS allow list, and a
  failed check says so first.
*/
const COMBOSTORE_ORIGIN = "https://combostore.bd/";

const WP_PLUGINS = [
  {
    name: "Combo Store — Server",
    note: "The commerce models and REST layer",
    href: "https://github.com/pickplugins/combostore-server",
    download: "https://github.com/pickplugins/combostore-server/archive/refs/heads/master.zip",
  },
  {
    name: "Enable CORS",
    note: "Lets the storefront read the WordPress API",
    href: "https://wordpress.org/plugins/enable-cors/",
  },
  {
    name: "JWT Authentication for WP REST API",
    note: "Signs in dashboard users",
    href: "https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/",
  },
];

const CORS_PLUGIN = WP_PLUGINS.find((plugin) => plugin.name === "Enable CORS");

/*
  The plans come from the same catalogue the landing page's pricing section
  reads, so the wizard cannot quote a price the site has stopped offering -
  changing a tier means editing `messages/*.json` and nothing else.

  This wizard is English-only: it has no `LocaleProvider` above it and every
  string in it is hard-coded, so `en.json` is read directly rather than through
  `useI18n`. If the wizard is ever translated, this is the line to revisit.

  Only the first three checklist rows are carried over. The landing page has
  the room for all six; here they are a reminder of what the tier is, under a
  row that has to stay one glance tall.
*/
const PLAN_ORDER = ["starter", "business", "enterprise"];

const PLAN_OPTIONS = PLAN_ORDER.map((key) => {
  const plan = enMessages.landing.pricing.plans[key];
  const lemon = LEMON_PLAN_LINKS[key];

  return {
    key,
    name: plan.name,
    tagline: plan.tagline,
    price: plan.price,
    period: plan.period,
    points: Object.values(plan.points).slice(0, 3),
    /* `billed` is "this tier is sold through Lemon Squeezy at all", which is
       not the same as having a usable link - an empty `checkoutLink` on a
       billed plan is a configuration gap, and the two read differently on
       screen. */
    billed: Boolean(lemon),
    checkoutLink: lemon?.link || "",
    linkEnvKey: lemon?.envKey || "",
  };
});

/*
  Step 4 is optional in that no plan has to be picked - the project deploys
  either way. Picking one that Lemon Squeezy sells does gate the wizard:
  checkout has to finish before the review opens, which is the reason the plan
  sits ahead of the review rather than after it. Paying for a store and then
  abandoning the deploy is a support ticket; reviewing a deployment whose plan
  is already paid for is just the summary telling the truth.
*/
const STEPS = [
  { n: 1, label: "Credentials" },
  { n: 2, label: "Configure" },
  { n: 3, label: "Contact" },
  { n: 4, label: "Plan", optional: true },
  { n: 5, label: "Review" },
];

/* The store owner Combo Store writes into the project's records. */
const EMPTY_CONTACT = { name: "", email: "", phone: "", address: "" };

const CONTACT_FIELDS = [
  {
    id: "contact-name",
    field: "name",
    label: "Full name",
    placeholder: "Jane Doe",
    type: "text",
    autoComplete: "name",
    icon: User,
  },
  {
    id: "contact-email",
    field: "email",
    label: "Email address",
    placeholder: "jane@mystore.com",
    type: "email",
    autoComplete: "email",
    icon: Mail,
  },
  {
    id: "contact-phone",
    field: "phone",
    label: "Phone number",
    placeholder: "+1 555 010 2030",
    type: "tel",
    autoComplete: "tel",
    icon: Phone,
    optional: true,
  },
];

const FONT_SANS = { fontFamily: "var(--font-geist-sans), system-ui, sans-serif" };
const FONT_MONO = {
  fontFamily: "var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace",
};

/*
  `globals.css` styles bare `input`, `select` and `button` with UNLAYERED rules.
  Unlayered CSS outranks everything in `@layer utilities` regardless of
  specificity, so without `!` on radius, border, padding and colour these
  controls silently fall back to the global gray-400 / `rounded-sm` / 5px look
  no matter what Tailwind classes they carry. `!` is only applied to the
  properties that rule actually sets - everything else is a plain utility.

  Box-shadow is deliberately left alone: the global rule sets `--tw-shadow`
  but `focus:ring-*` writes `--tw-ring-shadow`, a different variable in the
  same composite, so focus rings still land.
*/
const INPUT =
  "w-full !cursor-text !rounded-lg !border !border-zinc-300 bg-white !px-3.5 !py-2.5 text-sm !text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:!border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const INPUT_READONLY =
  "w-full !cursor-default !rounded-lg !border !border-zinc-200 bg-zinc-100 !px-3.5 !py-2.5 text-sm !text-zinc-500 outline-none";

const INPUT_INVALID =
  "!border-red-400 focus:!border-red-500 focus:ring-red-100";

const SELECT =
  "w-full appearance-none !cursor-pointer !rounded-lg !border !border-zinc-300 bg-white !px-3.5 !py-2.5 text-sm !text-zinc-900 outline-none transition-colors focus:!border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const BTN =
  "inline-flex items-center justify-center gap-2 !rounded-xl !border !border-transparent !px-5 !py-2.5 text-sm font-semibold !shadow-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const BTN_PRIMARY = `${BTN} bg-emerald-600 !text-white hover:bg-emerald-700 focus-visible:outline-emerald-600`;

const BTN_SECONDARY = `${BTN} !border-zinc-300 bg-white !text-zinc-700 hover:bg-zinc-50 focus-visible:outline-zinc-400`;

const BTN_ICON =
  "inline-flex shrink-0 items-center justify-center gap-1.5 !rounded-lg !border !border-transparent !bg-transparent !px-2 !py-1.5 text-xs font-medium !shadow-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-1";

/*
  Serialise the editor rows as a `.env` file. Values are left bare when they
  are a single safe token and quoted otherwise, because a value holding a
  space, a `#` or a newline would otherwise be truncated or read as a comment
  by anything sourcing the file.
*/
function serializeEnvFile(envs, header = []) {
  const lines = header.map((h) => (h ? `# ${h}` : "#"));
  if (lines.length) lines.push("");

  for (const { key, value } of envs) {
    const k = key.trim();
    if (!k) continue;
    const v = value ?? "";
    const needsQuotes = v === "" || /[\s#'"\\$`]/.test(v);
    lines.push(
      needsQuotes
        ? `${k}="${v.replace(/([\\"$`])/g, "\\$1").replace(/\n/g, "\\n")}"`
        : `${k}=${v}`
    );
  }

  return `${lines.join("\n")}\n`;
}

/*
  Hand the text to the browser as a file. An object URL rather than a
  `data:` URL so large payloads are not capped, and it is revoked on the next
  tick - revoking synchronously can race the download in Safari.
*/
function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
















/*
  Lemon.js is fetched on demand rather than from the page `<head>`: three steps
  are filled in before the plan exists, and a wizard that never reaches it
  should not pull a payment script in at all.

  The promise is cached at module scope so a remount - or two clicks racing the
  first load - share one script tag and one `Setup` call.
*/
let lemonPromise = null;

/*
  `Setup` takes its event handler once and keeps it, so what it gets is a
  trampoline into whatever wizard is currently mounted. Without the indirection
  the first mount's closure would go on receiving checkout events after a
  remount and set state on a component that no longer exists.
*/
let lemonEventSink = null;

function initLemon() {
  return new Promise((resolve, reject) => {
    /*
      Running lemon.js does not create `window.LemonSqueezy`. The script only
      defines `window.createLemonSqueezy()` and registers
      `window.addEventListener("load", createLemonSqueezy)`, so the global
      appears when the window load event fires - which a script injected on
      demand, at the plan step, has missed by minutes. The factory has to be
      called by hand; that is what the docs mean when they tell React apps to
      call `createLemonSqueezy()` after their component mounts, and calling it
      again later is a refresh rather than a second instance.
    */
    const createLemon = () => {
      window.createLemonSqueezy?.();
      return window.LemonSqueezy || null;
    };

    /* Already loaded, by an earlier visit to this step or by the page itself:
       the factory may still be waiting to be called. */
    const loaded = window.LemonSqueezy || createLemon();
    if (loaded) {
      resolve(loaded);
      return;
    }

    /*
      A request held open by a proxy, or a `<script>` an extension neutered
      without failing it, fires neither event - and a checkout stuck on
      "loading" reads as a broken wizard rather than a blocked script. So the
      wait is cut off, the same way the WordPress probe cuts off a domain that
      never answers.
    */
    const timer = setTimeout(
      () =>
        reject(
          new Error(
            "Lemon.js did not load within 15 seconds - app.lemonsqueezy.com is unreachable from this browser."
          )
        ),
      15000
    );
    const settle = (done, value) => {
      clearTimeout(timer);
      done(value);
    };

    const existing = document.querySelector(`script[src="${LEMON_JS_SRC}"]`);
    const script = existing || document.createElement("script");

    script.addEventListener("load", () => {
      const lemon = createLemon();
      lemon
        ? settle(resolve, lemon)
        : settle(
            reject,
            new Error(
              "Lemon.js loaded but createLemonSqueezy() did not produce window.LemonSqueezy."
            )
          );
    });
    script.addEventListener("error", () =>
      settle(
        reject,
        new Error(
          "Lemon.js could not be loaded - app.lemonsqueezy.com was blocked by the network or a browser extension."
        )
      )
    );

    if (!existing) {
      script.src = LEMON_JS_SRC;
      script.defer = true;
      document.head.appendChild(script);
    }
  }).then((lemon) => {
    /* Setup only stores the handler, so it has to come after the instance
       exists - and it throws on anything but an object. */
    lemon.Setup({ eventHandler: (event) => lemonEventSink?.(event) });
    return lemon;
  });
}

function loadLemon() {
  if (lemonPromise) return lemonPromise;

  /* A failed load is not cached: the usual causes are a blocked script or a
     dropped connection, and both are worth the retry button. */
  lemonPromise = initLemon().catch((error) => {
    lemonPromise = null;
    throw error;
  });

  return lemonPromise;
}

/*
  Hand a finished order to WordPress. Everything it needs is passed in, which
  is why this lives out here: it reads no component state, so an overlay that
  sat open for minutes - or a wizard that remounted behind it - cannot post a
  stale project, domain or contact.

  Fire and forget, like `create_project`: Lemon Squeezy has taken the money
  either way, the order number is on screen and in the `.env` download, and the
  record WordPress trusts is the one its own `order_created` webhook writes. A
  store whose REST route is not deployed yet must not break a checkout.
*/
function record_subscription(payload) {
  fetch(serverUrl + "wp-json/combostore-admin/v2/record_subscription", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        console.warn(
          `record_subscription: WordPress answered HTTP ${response.status}. The order is only in this browser and in Lemon Squeezy.`
        );
      }
    })
    .catch(() => {
      console.warn(
        "record_subscription: WordPress could not be reached. The order is only in this browser and in Lemon Squeezy."
      );
    });
}

/* ── Primitives ─────────────────────────────────────────────────── */

function Card({ children, className = "" }) {
  return (
    <div
      className={`mb-4 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

function CardHead({ icon: Icon, title, desc, tone = "emerald" }) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
    zinc: "bg-zinc-100 text-zinc-600",
    red: "bg-red-50 text-red-600",
  };
  return (
    <div className="mb-5 flex items-start gap-3">
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
        <Icon size={17} />
      </span>
      <div className="min-w-0">
        <div className="text-sm font-semibold tracking-tight text-zinc-900">
          {title}
        </div>
        <div className="mt-0.5 text-xs text-zinc-500">{desc}</div>
      </div>
    </div>
  );
}

function FieldLabel({ children, htmlFor }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-xs font-medium text-zinc-600">
      {children}
    </label>
  );
}

function FieldError({ children }) {
  if (!children) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
      <CircleAlert size={13} className="shrink-0" />
      {children}
    </p>
  );
}

function SectionHeading({ children, action }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <p className="text-xs font-semibold tracking-wider text-zinc-400">
        {children}
      </p>
      {action}
    </div>
  );
}

function Stepper({ step }) {
  return (
    <div className="mb-8 flex items-center">
      {STEPS.map((s, i) => {
        const done = step > s.n;
        const current = step === s.n;
        return (
          <div key={s.n} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2.5">
              <span
                className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${done
                  ? "bg-emerald-600 text-white"
                  : current
                    ? "bg-zinc-900 text-white"
                    : "border border-zinc-300 bg-white text-zinc-400"
                  }`}>
                {done ? <Check size={13} /> : s.n}
              </span>
              <span
                className={`hidden text-sm transition-colors sm:block ${current ? "font-semibold text-zinc-900" : "text-zinc-500"
                  }`}>
                {s.label}
                {/* Held back to `md` so five labels and this one never have to
                    share a 640px row. */}
                {s.optional && (
                  <span className="hidden font-normal text-zinc-400 md:inline">
                    {" "}(optional)
                  </span>
                )}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span
                className={`mx-3 h-px flex-1 transition-colors ${done ? "bg-emerald-500" : "bg-zinc-200"
                  }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function BrandBar({ step }) {
  return (
    <div className="mb-8 flex items-center justify-between gap-4">
      <a
        href={COMBOSTORE_ORIGIN}
        target="_blank"
        rel="noreferrer"
        aria-label="ComboStore home"
        className="group flex items-center gap-2.5 !rounded-xl no-underline outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600">
        <span className="flex size-8 items-center justify-center rounded-xl bg-emerald-600 text-[13px] font-bold text-white transition-colors group-hover:bg-emerald-700">
          CS
        </span>
        <span className="text-[17px] font-semibold tracking-tight text-zinc-900 transition-colors group-hover:text-emerald-700">
          ComboStore
        </span>
      </a>
      {step ? (
        <span className="text-xs text-zinc-500">
          Step {step} of {STEPS.length}
        </span>
      ) : null}
    </div>
  );
}

/* A URL row with copy-to-clipboard and an open-in-new-tab control. */
function UrlRow({ icon: Icon, label, url, copied, onCopy }) {
  return (
    <div className="rounded-xl border border-zinc-200 p-3.5">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-zinc-500">
        <Icon size={13} />
        {label}
      </div>
      <div className="flex items-center gap-2">
        <span
          style={FONT_MONO}
          className="min-w-0 flex-1 truncate text-sm text-zinc-800">
          {url}
        </span>
        <button
          type="button"
          onClick={onCopy}
          aria-label={`Copy ${label} URL`}
          className={`${BTN_ICON} !text-zinc-500 hover:!bg-zinc-100 hover:!text-zinc-900 focus-visible:outline-zinc-400`}>
          {copied ? (
            <>
              <Check size={13} className="text-emerald-600" />
              Copied
            </>
          ) : (
            <>
              <Copy size={13} />
              Copy
            </>
          )}
        </button>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${label}`}
          className="inline-flex shrink-0 items-center justify-center rounded-lg px-2 py-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900">
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}

function EnvVarEditor({ envs, onChange, onRegenerateToken }) {
  const addRow = () => onChange([...envs, { key: "", value: "" }]);
  const removeRow = (i) => onChange(envs.filter((_, idx) => idx !== i));
  const updateRow = (i, field, val) =>
    onChange(envs.map((r, idx) => (idx === i ? { ...r, [field]: val } : r)));

  return (
    <div>
      <SectionHeading
        action={
          <button
            type="button"
            onClick={onRegenerateToken}
            className={`${BTN_ICON} !text-zinc-500 hover:!bg-zinc-100 hover:!text-zinc-900 focus-visible:outline-zinc-400`}>
            <RefreshCw size={12} />
            New API token
          </button>
        }>
        ENVIRONMENT VARIABLES
      </SectionHeading>

      <p className="mb-3 text-xs text-zinc-500">
        Injected before the first build. The URLs follow the domain you entered —
        editing it rewrites them.
      </p>

      <div className="space-y-2">
        {envs.map((row, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              aria-label={`Variable ${i + 1} name`}
              style={FONT_MONO}
              className={`${INPUT} !w-40 shrink-0 !px-2.5 !py-2 text-xs`}
              placeholder="KEY"
              value={row.key}
              onChange={(e) => updateRow(i, "key", e.target.value)}
            />
            <input
              aria-label={`Variable ${i + 1} value`}
              style={FONT_MONO}
              className={`${INPUT} !px-2.5 !py-2 text-xs`}
              placeholder="value"
              value={row.value}
              onChange={(e) => updateRow(i, "value", e.target.value)}
            />
            <button
              type="button"
              onClick={() => removeRow(i)}
              aria-label={`Remove ${row.key || "variable"}`}
              className={`${BTN_ICON} !text-zinc-400 hover:!bg-red-50 hover:!text-red-600 focus-visible:outline-red-400`}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        className={`${BTN_ICON} mt-3 !text-emerald-700 hover:!bg-emerald-50 focus-visible:outline-emerald-500`}>
        <Plus size={13} />
        Add variable
      </button>
    </div>
  );
}

/*
  A confirmation the wizard can style and word properly. `window.confirm` was
  the other option, but it blocks the whole tab, cannot offer the third
  "download it first" choice this needs, and the rest of the wizard already
  avoids native dialogs for the same reason inline field errors beat `alert()`.
*/
function ConfirmDialog({ title, desc, children, onCancel }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      {/* Backdrop is its own element so a click outside the panel cancels. */}
      <div
        className="absolute inset-0 bg-zinc-900/40"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        style={FONT_SANS}
        className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl sm:p-6">
        <div className="mb-4 flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <CircleAlert size={17} />
          </span>
          <div className="min-w-0">
            <h2
              id="confirm-title"
              className="text-sm font-semibold tracking-tight text-zinc-900">
              {title}
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">{desc}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-end">
          {children}
        </div>
      </div>
    </div>
  );
}

/*
  Page frame. Declared at module scope on purpose: a component defined inside
  the wizard body would be a new type on every render, so React would unmount
  and remount the whole form - losing focus out of the field being typed into.
*/
function Shell({ children, step }) {
  return (
    <div
      className="min-h-screen w-full bg-zinc-50 text-zinc-900 antialiased"
      style={FONT_SANS}>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <BrandBar step={step} />
        {children}
      </div>
    </div>
  );
}

/* ── Wizard ─────────────────────────────────────────────────────── */

export default function ComboshopVercelOnboarding() {
  const [step, setStep] = useState(1);
  const [tokenVisible, setTokenVisible] = useState(false);
  const [vercelToken, setVercelToken] = useState("");
  const [teamId, setTeamId] = useState("");
  const [framework, setFramework] = useState("nextjs");
  const [mainDomain, setMainDomain] = useState("");
  const [errors, setErrors] = useState({});
  const [copied, setCopied] = useState("");
  const [envDownloaded, setEnvDownloaded] = useState(false);
  const [contact, setContact] = useState(EMPTY_CONTACT);
  /*
    What the last download actually contained, not a boolean: editing a
    variable - or the domain, which rewrites two of them - makes the saved file
    stale, and a flag would still read "saved" for a file that no longer
    matches what is about to be deployed.
  */
  const [savedEnvText, setSavedEnvText] = useState("");
  const [confirmingDeploy, setConfirmingDeploy] = useState(false);
  /* Empty until step 4, and allowed to stay that way - the plan is optional. */
  const [plan, setPlan] = useState("");

  /*
    Lemon.js, loaded when the plan step opens. "unavailable" is a checkout that
    cannot be reached - a blocked script, or a `.env` with no checkout links -
    and is kept distinct from "idle" because it is the one case where a paid
    plan does not gate the review: stranding a deploy behind an overlay that
    will never open is worse than recording a plan and billing it afterwards.
  */
  const [lemonStatus, setLemonStatus] = useState("idle");
  const [lemonError, setLemonError] = useState("");
  /*
    Which plan the open overlay is for. A ref, not state, and read back in the
    event handler because Lemon Squeezy's `Checkout.Success` carries the Order
    object alone - the `custom_data` sent with the link comes back on the
    webhook, not to this page - so the plan has to be remembered here.
  */
  const pendingPlan = useRef("");
  /*
    What Lemon Squeezy reported for a completed order. The order number and
    identifier are the handles anything downstream has on the subscription, so
    they travel into the review, the deployment record and the `.env` download
    rather than living for only as long as this tab is open.
  */
  const [subscription, setSubscription] = useState(null);

  /*
    What the overlay was opened against, captured by `openCheckout` for the
    event handler to post. Refs rather than state because nothing renders them
    and a change must not re-render: they exist only because the handler is
    installed once and cannot see the current values through a closure.
  */
  const dbNameRef = useRef("");
  const mainDomainRef = useRef("");
  const contactRef = useRef(EMPTY_CONTACT);

  /*
    Whether the WordPress side has answered. Nothing after step 2 is worth
    filling in until it has: a domain pointing somewhere else, a missing
    combostore-server plugin or a CORS header that was never added all produce
    a project that builds cleanly and then serves an empty store.
  */
  const [wpStatus, setWpStatus] = useState("idle");
  const [wpError, setWpError] = useState("");

  const [dbName, setDbName] = useState("combostore");
  const [dbBuild, setDbBuild] = useState("");
  const [dbOutput, setDbOutput] = useState("");
  const [dbInstall, setDbInstall] = useState("");
  const [dbRoot, setDbRoot] = useState("");
  /*
    APP_URL is what the storefront builds its canonical URLs and sitemaps from
    and STORE_URL is what the admin screens link out to, so with one project
    serving both they are the same origin - the root domain.

    API_TOKEN came over with the storefront and now belongs to this project.
  */
  const [dbEnvs, setDbEnvs] = useState([
    { key: "NEXT_PUBLIC_STORE_URL", value: `${mainDomain}` },
    { key: "NEXT_PUBLIC_SERVER_URL", value: `server.${mainDomain}` },
    { key: "API_TOKEN", value: "" },
  ]);

  /*
    Generated once after mount rather than during render. It used to be a bare
    `crypto.randomBytes()` call in the component body, so every render minted a
    different token and each keystroke in the domain field rewrote the one the
    operator was about to deploy with.
  */
  const [apiToken, setApiToken] = useState("");

  useEffect(() => {
    setApiToken(crypto.randomBytes(32).toString("hex"));
  }, []);

  useEffect(() => {

    setDbEnvs([
      { key: "NEXT_PUBLIC_STORE_URL", value: `${mainDomain}` },
      { key: "NEXT_PUBLIC_SERVER_URL", value: `server.${mainDomain}` },
      { key: "API_TOKEN", value: apiToken },
    ])

  }, [mainDomain, apiToken]);

  const [logs, setLogs] = useState([]);
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [deployError, setDeployError] = useState("");

  const addLog = useCallback((msg, type = "info") => {
    setLogs((prev) => [...prev, { msg, type }]);
  }, []);

  /*
    Pasting a URL into a domain field is the common slip, and Vercel rejects
    `https://x.com/` with an opaque error - so the protocol, any path and a
    trailing dot are trimmed off when the field loses focus rather than while
    someone is still typing.
  */
  const normalizeDomain = () =>
    setMainDomain((d) =>
      d
        .trim()
        .replace(/^https?:\/\//i, "")
        .replace(/\/.*$/, "")
        .replace(/\.$/, "")
        .toLowerCase()
    );

  /* Inline field errors, rather than an alert() that says one thing at a time
     and leaves no marker on the field it is talking about. */
  const goStep2 = () => {
    const next = {};
    if (!vercelToken.trim()) next.vercelToken = "A Vercel API token is required.";
    if (!mainDomain.trim()) next.mainDomain = "Enter the domain this store will run on.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setStep(2);
  };

  const updateContact = (field, value) => {
    setContact((c) => ({ ...c, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  /*
    Name and email are what the store is actually reachable at, so they are
    required; phone and address are recorded when given but a store can be run
    without either. The email check is deliberately loose - a stricter pattern
    rejects valid addresses more often than it catches typos.
  */
  const goStep4 = () => {
    const next = {};
    if (!contact.name.trim()) next.name = "Enter the store owner's name.";
    if (!contact.email.trim()) next.email = "An email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim()))
      next.email = "That does not look like an email address.";
    setErrors(next);
    if (Object.keys(next).length) return;




    setStep(4);
  };

  const buildEnvPayload = (envs) =>
    envs
      .filter((e) => e.key.trim())
      .map((e) => ({
        key: e.key.trim(),
        value: e.value,
        type: "plain",
        target: ["production", "preview", "development"],
      }));

  /* Only the contact fields that were filled in, one `Label: value` per line.
     A multi-line address is flattened so each line stays a comment. */
  const contactLines = [
    ["Name", contact.name],
    ["Email", contact.email],
    ["Phone", contact.phone],
    ["Address", contact.address.replace(/\s*\n\s*/g, ", ")],
  ]
    .filter(([, v]) => v.trim())
    .map(([k, v]) => `${`${k}:`.padEnd(9)} ${v.trim()}`);

  /*
    The variables the operator is about to deploy with, as a `.env` they can
    keep: API_TOKEN is generated here and shown nowhere else once the wizard is
    closed, so without this the only copy of it lives in the Vercel project.
  */
  const envFileText = () =>
    serializeEnvFile(dbEnvs, [
      "ComboStore environment variables",
      `Project:    ${dbName || "combostore"}`,
      `Repository: ${DASHBOARD_REPO}`,
      ...(mainDomain ? [`Domain:     ${mainDomain}`] : []),
      `Generated:  ${new Date().toISOString()}`,
      /*
        The contact goes in as comments rather than variables: the store owner
        is a record of who this deployment belongs to, not configuration the
        build reads, and inventing `OWNER_EMAIL`-style keys would ship it to
        every runtime that reads the environment.
      */
      ...(contactLines.length ? ["", "Store contact", ...contactLines] : []),
      /*
        A comment, not a variable, for the same reason the contact is: the plan
        is a record of what this deployment was signed up for, not something
        the build reads.
      */
      ...(planChoice ? ["", `Plan:      ${planSummary}`] : []),
      /*
        The order number, for much the same reason the API token is here: it is
        minted outside this wizard, shown once, and it is what support needs to
        tie a store to a subscription.
      */
      ...(subscription
        ? [
            `Billing:   Lemon Squeezy${subscription.testMode ? " (test mode)" : ""}`,
            ...(subscription.orderNumber
              ? [`Order:     #${subscription.orderNumber}`]
              : []),
            ...(subscription.identifier
              ? [`Order ref: ${subscription.identifier}`]
              : []),
            ...(subscription.customerId
              ? [`Customer:  ${subscription.customerId}`]
              : []),
          ]
        : []),
      "",
      "Keep this file private - it contains the store's API token.",
    ]);

  const envFileName = `${(dbName || "combostore")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "combostore"}.env`;

  /*
    The body alone - no header - is what "already saved" is measured against,
    so a second download differing only by its `Generated:` timestamp does not
    read as a change.
  */
  const planChoice = PLAN_OPTIONS.find((option) => option.key === plan) || null;
  const planSummary = planChoice
    ? `${planChoice.name} — ${planChoice.price}${planChoice.period ? ` ${planChoice.period}` : ""}`
    : "";

  /*
    A selected plan Lemon Squeezy can actually sell has to be paid for before
    the review. The three ways past the gate are all deliberate: no plan at
    all, Enterprise - quoted by hand, so there is no link to charge against -
    and a checkout that could not be reached, which is a configuration problem
    on this side rather than something to hold a deploy hostage over.
  */
  const planNeedsPayment =
    Boolean(planChoice?.checkoutLink) && lemonStatus !== "unavailable";
  const planPaid = Boolean(subscription && subscription.plan === plan);
  const canLeavePlanStep = !planNeedsPayment || planPaid;

  const envBody = serializeEnvFile(dbEnvs);
  const hasEnvs = buildEnvPayload(dbEnvs).length > 0;
  const envSaved = hasEnvs && savedEnvText === envBody;

  const downloadEnvFile = () => {
    downloadTextFile(envFileName, envFileText());
    setSavedEnvText(envBody);
    setEnvDownloaded(true);
    setTimeout(() => setEnvDownloaded(false), 1600);
  };

  const deploy = async () => {
    setDeploying(true);
    setLogs([]);
    setDeployError("");

    const headers = {
      Authorization: `Bearer ${vercelToken}`,
      "Content-Type": "application/json",
    };
    const teamParam = teamId.trim() ? `?teamId=${teamId.trim()}` : "";







    try {
      addLog("Creating ComboStore project…", "info");
      const dbRes = await fetch(`https://api.vercel.com/v10/projects${teamParam}`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: dbName,
          framework: framework || null,
          gitRepository: { type: "github", repo: DASHBOARD_REPO },
          environmentVariables: buildEnvPayload(dbEnvs),
          ...(dbBuild && { buildCommand: dbBuild }),
          ...(dbOutput && { outputDirectory: dbOutput }),
          ...(dbInstall && { installCommand: dbInstall }),
          ...(dbRoot && { rootDirectory: dbRoot }),
        }),
      });
      const dbData = await dbRes.json();
      if (!dbRes.ok) throw new Error(`ComboStore: ${dbData.error?.message || JSON.stringify(dbData)}`);
      addLog(`Project created — id: ${dbData.id}`, "ok");

      addLog(`Assigning ${mainDomain}…`, "info");
      const dbDomRes = await fetch(`https://api.vercel.com/v10/projects/${dbData.id}/domains${teamParam}`, {
        method: "POST", headers, body: JSON.stringify({ name: mainDomain }),
      });
      const dbDomData = await dbDomRes.json();
      if (!dbDomRes.ok) throw new Error(`Domain: ${dbDomData.error?.message || JSON.stringify(dbDomData)}`);
      addLog(`${mainDomain} assigned`, "ok");
      addLog("All done", "ok");

      setTimeout(() => { setDeploying(false); setDeployed(true); }, 700);
    } catch (err) {
      addLog(err.message, "err");
      setDeployError(err.message);
      setDeploying(false);
    }
  };



  function create_project() {


    // if (!token) {
    //   throw new Error("No token found");
    // }



    var postData = JSON.stringify({ ...contact, domain: mainDomain, project: dbName });

    console.log('create_project 1');
    console.log(postData);


    fetch(
      serverUrl + "wp-json/combostore-admin/v2/create_project",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: postData,
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Token validation failed");
        }

        if (response.ok && response.status < 400) {
          response.json().then((res) => {


            console.log(res);



          });
        }
      })
      .catch((_error) => {
        //this.saveAsStatus = 'error';
        // handle the error
      });
  }
  /*
    combostore-server's own reachability probe: it answers `{ success: true }`
    and nothing else, so a 200 carrying that body is the plugin confirming it
    is installed and serving REST requests on that host. Everything else is
    a failed connection - a 404 is a WordPress without the plugin, a thrown
    request is a domain resolving elsewhere or a preflight with no CORS header.

    The probe goes to `server.<domain>`, not the root domain: step 1 assigns
    the root domain to this Vercel project and WordPress to the `server.`
    subdomain, which is what `NEXT_PUBLIC_SERVER_URL` points at. Probing the
    root domain would reach the storefront - or, before the first deploy,
    nothing at all.

    `mainDomain` is stored bare (`normalizeDomain` strips the protocol), so the
    scheme and the leading slash are put back here rather than concatenating
    the domain straight onto the path.
  */
  const combo_store_connection = useCallback(async () => {
    const domain = mainDomain
      .trim()
      .replace(/^https?:\/\//i, "")
      .replace(/\/.*$/, "");

    if (!domain) {
      setWpStatus("failed");
      setWpError("No domain to check - go back and enter the store domain.");
      return false;
    }

    const host = `${WP_SUBDOMAIN}.${domain}`;

    setWpStatus("checking");
    setWpError("");

    console.log(host);


    /* A domain pointing at nothing can hang until the browser gives up, so the
       probe is cut off rather than leaving the step spinning indefinitely. */
    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), 15000);

    try {
      const response = await fetch(
        `https://${host}/wp-json/combo-store/v2/combo_store_connection`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domain }),
          signal: abort.signal,
        }
      );

      if (!response.ok) {
        setWpStatus("failed");
        setWpError(
          response.status === 404
            ? `${host} answered, but the Combo Store - Server plugin is not active there (no REST route).`
            : `${host} answered with HTTP ${response.status}.`
        );
        return false;
      }

      const result = await response.json().catch(() => null);

      console.log(result);


      if (!result?.success) {
        setWpStatus("failed");
        setWpError("The REST route answered but did not confirm the connection.");
        return false;
      }

      setWpStatus("ok");
      setWpError("");
      return true;
    } catch (error) {
      setWpStatus("failed");
      setWpError(
        error?.name === "AbortError"
          ? `${host} did not answer within 15 seconds.`
          : `Could not reach ${host}. WordPress either blocked the request (CORS) or the subdomain does not point at the install.`
      );
      return false;
    } finally {
      clearTimeout(timer);
    }
  }, [mainDomain]);

  /* An edited domain is unverified: without this a changed domain inherits the
     previous one's green check. Dropping back to `idle` is also what re-arms
     the probe below. */
  useEffect(() => {
    setWpStatus("idle");
    setWpError("");
  }, [mainDomain]);

  /* Run the check when step 2 opens so the operator does not have to ask for
     it, and leave a failed result alone until they retry by hand. */
  useEffect(() => {
    if (step === 2 && wpStatus === "idle") combo_store_connection();
  }, [step, wpStatus, combo_store_connection]);






  /*
    Every Lemon.js event arrives here. Only `Checkout.Success` matters - the
    others are the payment-method overlay, which this wizard never opens.

    There is no "overlay closed" event to pair with it, which is why opening a
    checkout sets no busy flag: a spinner started on open would have nothing to
    clear it when someone dismisses the overlay without paying.
  */
  const onLemonEvent = useCallback((event) => {
    if (event?.event !== "Checkout.Success") return;

    const order = event.data || {};
    const attrs = order.attributes || {};
    const record = {
      plan: pendingPlan.current,
      orderId: order.id || "",
      identifier: attrs.identifier || "",
      orderNumber: attrs.order_number ?? "",
      customerId: attrs.customer_id ?? "",
      variantId: attrs.first_order_item?.variant_id ?? "",
      email: attrs.user_email || "",
      total: attrs.total_formatted || "",
      receipt: attrs.urls?.receipt || "",
      /* The order's own word on test or live, rather than `LEMON_MODE` - the
         env var is an expectation, this is what actually happened. */
      testMode: Boolean(attrs.test_mode),
      at: new Date().toISOString(),
    };

    setSubscription(record);
    setLemonError("");

    /* The overlay is left alone on purpose: Lemon Squeezy shows its own
       receipt, and tearing it down the instant a card clears reads as a
       crash. */
    record_subscription({
      plan: record.plan,
      project: dbNameRef.current,
      domain: mainDomainRef.current,
      contact_name: contactRef.current.name.trim(),
      contact_email: contactRef.current.email.trim(),
      order_id: record.orderId,
      order_number: record.orderNumber,
      order_identifier: record.identifier,
      customer_id: record.customerId,
      variant_id: record.variantId,
      test_mode: record.testMode,
    });
  }, []);

  /* Point the module-level trampoline at this mount, and let go of it on the
     way out so a stale handler cannot outlive the component. */
  useEffect(() => {
    lemonEventSink = onLemonEvent;
    return () => {
      if (lemonEventSink === onLemonEvent) lemonEventSink = null;
    };
  }, [onLemonEvent]);

  /*
    Fetch and initialise Lemon.js. A callback rather than inline in the effect
    below, and with no cancel flag: the effect watches `lemonStatus` and also
    sets it, so a flag cleared on cleanup would kill the load's own result
    every time - which is exactly how this once sat on "Loading checkout" for
    good. A resolved load is a fact about the page, not about one render.
  */
  const loadCheckout = useCallback(() => {
    if (!LEMON_CONFIGURED) {
      setLemonStatus("unavailable");
      setLemonError(
        "No Lemon Squeezy checkout links are set in .env, so checkout cannot open. A plan can still be recorded with this deployment and billed afterwards."
      );
      return;
    }

    setLemonStatus("loading");
    setLemonError("");

    loadLemon()
      .then(() => setLemonStatus("ready"))
      .catch((error) => {
        setLemonStatus("unavailable");
        setLemonError(error?.message || "Lemon.js could not be initialised.");
      });
  }, []);

  /* Load Lemon.js when the plan step opens, and leave a failure alone until
     the operator retries - the same shape as the WordPress probe above. */
  useEffect(() => {
    if (step === 4 && lemonStatus === "idle") loadCheckout();
  }, [step, lemonStatus, loadCheckout]);

  /*
    Open one plan's checkout as an overlay. `Url.Open` adds the `embed=1` that
    renders the link inside the page rather than navigating away, so only the
    wizard's own parameters are set here: the email and name from step 3, so
    the order lands on the same person the deployment is recorded to, and
    `checkout[custom][...]`, which is what lets the `order_created` webhook
    match an order to a store long after this page has closed.
  */
  const openCheckout = (option) => {
    if (!option?.checkoutLink || lemonStatus !== "ready" || !window.LemonSqueezy)
      return;

    const email = contact.email.trim();
    const name = contact.name.trim();

    let url;
    try {
      url = new URL(option.checkoutLink);
    } catch {
      setLemonStatus("unavailable");
      setLemonError(
        `${option.linkEnvKey} is not a valid URL - paste the checkout link from the product's Share panel in Lemon Squeezy.`
      );
      return;
    }

    if (email) url.searchParams.set("checkout[email]", email);
    if (name) url.searchParams.set("checkout[name]", name);
    url.searchParams.set("checkout[custom][plan]", option.key);
    if (dbName) url.searchParams.set("checkout[custom][project]", dbName);
    if (mainDomain) url.searchParams.set("checkout[custom][domain]", mainDomain);

    setLemonError("");
    /*
      Read back by `onLemonEvent`, which is installed once and so cannot see
      any of this through a closure. The success payload is the Order object
      and carries nothing of what was sent with the link, so what the overlay
      was opened against is remembered here instead.
    */
    pendingPlan.current = option.key;
    dbNameRef.current = dbName;
    mainDomainRef.current = mainDomain;
    contactRef.current = contact;

    try {
      window.LemonSqueezy.Url.Open(url.toString());
    } catch (error) {
      setLemonStatus("unavailable");
      setLemonError(error?.message || "Lemon.js refused to open the checkout.");
    }
  };

  /*
    Deploying is the last point at which the generated API token and the store
    contact are recoverable from the browser, so an unsaved `.env` gets a
    confirmation first rather than being lost in silence.
  */
  const requestDeploy = () => {
    /*
      Belt and braces. Step 5 is only reachable through the plan gate, but a
      deploy that quietly ships a paid plan nobody paid for is the kind of bug
      a later edit to the navigation would introduce in silence.
    */
    if (!canLeavePlanStep) {
      setStep(4);
      return;
    }

    console.log(envSaved);
    console.log(hasEnvs);

    if (envSaved || !hasEnvs) {
      deploy();
      return;
    }




    setConfirmingDeploy(true);
  };

  const downloadThenDeploy = () => {
    downloadEnvFile();
    setConfirmingDeploy(false);
    deploy();
  };

  const reset = () => {
    setStep(1);
    setDeployed(false);
    setDeploying(false);
    setVercelToken("");
    setMainDomain("");
    setContact(EMPTY_CONTACT);
    setPlan("");
    /* The loaded script survives a reset - it is page-level - but the order
       must not: the next store is a different subscription. */
    setSubscription(null);
    setLemonStatus("idle");
    setLemonError("");
    pendingPlan.current = "";
    setSavedEnvText("");
    setConfirmingDeploy(false);
    setLogs([]);
    setDeployError("");
    setErrors({});
    setWpStatus("idle");
    setWpError("");
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(""), 1600);
    } catch {
      /* Clipboard is blocked without a secure context or permission; the URL
         is on screen and selectable either way. */
    }
  };

  const storeUrl = `https://${mainDomain}`;
  const dashUrl = `https://${mainDomain}/dashboard`;

  /* ── Success screen ── */
  if (deployed) {
    return (
      <Shell>
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Check size={26} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Project deployed
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            The Vercel project is live and {mainDomain} is assigned.
          </p>
          {planChoice ? (
            <>
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                <Check size={12} />
                {planSummary}
              </p>
              {subscription && (
                <p
                  style={FONT_MONO}
                  className="mt-2 text-[11px] text-zinc-500">
                  Lemon Squeezy{subscription.testMode ? " (test)" : ""} · order #
                  {subscription.orderNumber || subscription.orderId}
                </p>
              )}
            </>
          ) : (
            <p className="mt-3 text-xs text-zinc-500">
              No plan chosen — one can be picked later from the dashboard.
            </p>
          )}
        </div>

        <Card>
          <SectionHeading>PROJECT URLS</SectionHeading>
          <div className="space-y-2.5">
            <UrlRow
              icon={Store}
              label="Storefront"
              url={storeUrl}
              copied={copied === "store"}
              onCopy={() => copyToClipboard(storeUrl, "store")}
            />
            <UrlRow
              icon={LayoutDashboard}
              label="Dashboard"
              url={dashUrl}
              copied={copied === "dash"}
              onCopy={() => copyToClipboard(dashUrl, "dash")}
            />
          </div>

          <div className="mt-4 rounded-xl bg-amber-50 px-3.5 py-3 text-xs leading-relaxed text-amber-900">
            DNS still has to point at Vercel before these resolve. Vercel shows
            the exact records on the project's Domains tab.
          </div>
        </Card>

        <div className="flex flex-wrap justify-end gap-2.5">
          <button type="button" onClick={reset} className={BTN_SECONDARY}>
            Deploy another
          </button>
          <a href={storeUrl} target="_blank" rel="noreferrer" className={BTN_PRIMARY}>
            Open storefront
            <ExternalLink size={15} />
          </a>
        </div>
      </Shell>
    );
  }

  /* ── Deploying screen ── */
  if (deploying) {
    return (
      <Shell>
        <div className="mb-7 flex items-start gap-3.5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white">
            <Loader2 size={18} className="animate-spin" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Deploying…
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Creating the project and assigning the domain through the Vercel API.
            </p>
          </div>
        </div>

        <Card>
          <SectionHeading>DEPLOY LOG</SectionHeading>
          <div
            style={FONT_MONO}
            className="max-h-56 space-y-2 overflow-y-auto rounded-xl bg-zinc-950 p-4 text-xs">
            {logs.length === 0 && (
              <div className="text-zinc-500">Starting…</div>
            )}
            {logs.map((l, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="mt-0.5 shrink-0">
                  {l.type === "ok" ? (
                    <Check size={12} className="text-emerald-400" />
                  ) : l.type === "err" ? (
                    <CircleAlert size={12} className="text-red-400" />
                  ) : (
                    <span className="block size-1.5 translate-y-1 rounded-full bg-zinc-500" />
                  )}
                </span>
                <span
                  className={
                    l.type === "ok"
                      ? "text-emerald-300"
                      : l.type === "err"
                        ? "text-red-300"
                        : "text-zinc-400"
                  }>
                  {l.msg}
                </span>
              </div>
            ))}
          </div>

          {deployError && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => { setDeploying(false); setStep(5); }}
                className={BTN_SECONDARY}>
                <ArrowLeft size={15} />
                Back to review
              </button>
            </div>
          )}
        </Card>
      </Shell>
    );
  }

  /* ── Main wizard ── */
  return (
    <Shell step={step}>

      {/* Step 1 — Credentials & domain */}
      {step === 1 && (
        <>
          <h1 className="mb-1.5 text-2xl font-semibold tracking-tight text-zinc-900">
            Deploy ComboStore to Vercel
          </h1>
          <p className="mb-7 text-sm text-zinc-500">
            One project, created from your GitHub repo and wired to your domain.
          </p>

          <Stepper step={1} />

          <Card>
            <CardHead
              icon={Server}
              tone="zinc"
              title="Set up WordPress first"
              desc="ComboStore reads its data from a WordPress install — add these three plugins before deploying."
            />
            <div className="space-y-2">
              {WP_PLUGINS.map((p) => (
                <a
                  key={p.href}
                  href={p.download ?? p.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 px-3.5 py-3 transition-colors hover:border-zinc-300 hover:bg-zinc-50">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-zinc-900">
                      {p.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-zinc-500">
                      {p.note}
                    </span>
                  </span>
                  <ExternalLink size={14} className="shrink-0 text-zinc-400" />
                </a>
              ))}
            </div>
          </Card>

          <Card>
            <CardHead
              icon={KeyRound}
              title="Vercel credentials"
              desc="Used to create the project and assign the domain through the API."
            />

            <div className="mb-4">
              <FieldLabel htmlFor="vercel-token">Vercel API token</FieldLabel>
              <div className="flex gap-2">
                <input
                  id="vercel-token"
                  type={tokenVisible ? "text" : "password"}
                  value={vercelToken}
                  onChange={(e) => {
                    setVercelToken(e.target.value);
                    if (errors.vercelToken) setErrors((p) => ({ ...p, vercelToken: "" }));
                  }}
                  placeholder="paste your Vercel token…"
                  aria-invalid={!!errors.vercelToken}
                  style={FONT_MONO}
                  className={`${INPUT} ${errors.vercelToken ? INPUT_INVALID : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setTokenVisible((v) => !v)}
                  aria-label={tokenVisible ? "Hide token" : "Show token"}
                  className={`${BTN_SECONDARY} !px-3`}>
                  {tokenVisible ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <FieldError>{errors.vercelToken}</FieldError>
              <p className="mt-1.5 text-xs text-zinc-500">
                Create one at{" "}
                <a
                  href="https://vercel.com/account/tokens"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-emerald-700 hover:underline">
                  vercel.com/account/tokens
                </a>
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="team-id">
                  Team ID{" "}
                  <span className="font-normal text-zinc-400">(optional)</span>
                </FieldLabel>
                <input
                  id="team-id"
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                  placeholder="team_xxxxxxxxxxxx"
                  style={FONT_MONO}
                  className={INPUT}
                />
              </div>
              <div>
                <FieldLabel htmlFor="framework">Framework preset</FieldLabel>
                <div className="relative">
                  <select
                    id="framework"
                    value={framework}
                    onChange={(e) => setFramework(e.target.value)}
                    className={`${SELECT} !pr-9`}>
                    <option value="nextjs">Next.js</option>
                    <option value="nuxtjs">Nuxt.js</option>
                    <option value="remix">Remix</option>
                    <option value="vite">Vite</option>
                    <option value="">Other / auto-detect</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    ▾
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHead
              icon={Globe}
              tone="violet"
              title="Main domain"
              desc="The root domain your customer's store will run on."
            />

            <FieldLabel htmlFor="main-domain">Domain name</FieldLabel>
            <input
              id="main-domain"
              value={mainDomain}
              onChange={(e) => {
                setMainDomain(e.target.value);
                if (errors.mainDomain) setErrors((p) => ({ ...p, mainDomain: "" }));
              }}
              onBlur={normalizeDomain}
              placeholder="mystore.com"
              aria-invalid={!!errors.mainDomain}
              className={`${INPUT} ${errors.mainDomain ? INPUT_INVALID : ""}`}
            />
            <FieldError>{errors.mainDomain}</FieldError>

            {mainDomain && !errors.mainDomain && (
              <div className="mt-4 space-y-2 rounded-xl bg-zinc-50 p-3.5">
                {[
                  { icon: Store, label: "Storefront", value: mainDomain },
                  { icon: LayoutDashboard, label: "Dashboard", value: `${mainDomain}/dashboard` },
                  { icon: Server, label: "Server", value: `server.${mainDomain}`, hint: "WordPress" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-2.5 text-xs">
                    <row.icon size={13} className="shrink-0 text-zinc-400" />
                    <span className="w-20 shrink-0 text-zinc-500">{row.label}</span>
                    <span
                      style={FONT_MONO}
                      className="min-w-0 flex-1 truncate font-medium text-zinc-800">
                      {row.value}
                    </span>
                    {row.hint && (
                      <span className="shrink-0 text-zinc-400">{row.hint}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          <div className="flex justify-end">
            <button type="button" onClick={goStep2} className={BTN_PRIMARY}>
              Continue
              <ArrowRight size={15} />
            </button>
          </div>
        </>
      )}

      {/* Step 2 — Configure the project */}
      {step === 2 && (
        <>
          <h1 className="mb-1.5 text-2xl font-semibold tracking-tight text-zinc-900">
            Configure project
          </h1>
          <p className="mb-7 text-sm text-zinc-500">
            The repo becomes one Vercel project on your main domain, serving the
            storefront and the dashboard.
          </p>

          <Stepper step={2} />

          <Card>
            <CardHead
              icon={Server}
              title="WordPress connection"
              desc={`Combo Store has to answer on ${WP_SUBDOMAIN}.${mainDomain || "your-domain.com"} before the project is created.`}
              tone={
                wpStatus === "ok"
                  ? "emerald"
                  : wpStatus === "failed"
                    ? "red"
                    : wpStatus === "checking"
                      ? "violet"
                      : "zinc"
              }
            />

            <div className="flex flex-wrap items-center gap-3">
              {wpStatus === "ok" ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                  <Check size={13} className="shrink-0" />
                  Connected
                </span>
              ) : wpStatus === "checking" ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700">
                  <Loader2 size={13} className="shrink-0 animate-spin" />
                  Checking connection
                </span>
              ) : wpStatus === "failed" ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700">
                  <CircleAlert size={13} className="shrink-0" />
                  Not connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600">
                  <Server size={13} className="shrink-0" />
                  Not checked yet
                </span>
              )}

              <button
                type="button"
                onClick={combo_store_connection}
                disabled={wpStatus === "checking"}
                className={BTN_SECONDARY}>
                <RefreshCw
                  size={14}
                  className={wpStatus === "checking" ? "animate-spin" : ""}
                />
                {wpStatus === "checking" ? "Checking" : "Check again"}
              </button>
            </div>

            <p style={FONT_MONO} className="mt-3 truncate text-xs text-zinc-400">
              POST https://{WP_SUBDOMAIN}.{mainDomain || "your-domain.com"}/wp-json/combo-store/v2/combo_store_connection
            </p>

            <FieldError>{wpError}</FieldError>

            {/* A blocked preflight is by far the most common cause and the one
                the browser cannot report properly, so it leads - with the exact
                value to paste - and the rest follows as a checklist. */}
            {wpStatus === "failed" && (
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5">
                  <div className="mb-2 flex items-start gap-2">
                    <ShieldAlert size={14} className="mt-px shrink-0 text-amber-600" />
                    <p className="text-xs font-semibold text-amber-900">
                      Most likely: WordPress is blocking this check (CORS)
                    </p>
                  </div>
                  <p className="mb-3 text-xs leading-relaxed text-amber-800">
                    The check runs from your browser, so WordPress has to allow
                    requests from this site. Install and activate{" "}
                    <a
                      href={CORS_PLUGIN.href}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-amber-900 underline hover:text-amber-950">
                      Enable CORS
                    </a>{" "}
                    on the WordPress install, then add this origin to its allow
                    list:
                  </p>

                  <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-white p-2.5">
                    <span
                      style={FONT_MONO}
                      className="min-w-0 flex-1 truncate text-xs font-medium text-zinc-800">
                      {COMBOSTORE_ORIGIN}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(COMBOSTORE_ORIGIN, "cors-origin")}
                      aria-label="Copy the origin to allow"
                      className={`${BTN_ICON} !text-zinc-500 hover:!bg-zinc-100 hover:!text-zinc-900 focus-visible:outline-zinc-400`}>
                      {copied === "cors-origin" ? (
                        <>
                          <Check size={13} className="text-emerald-600" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          Copy
                        </>
                      )}
                    </button>
                  </div>

                  <p className="mt-2.5 text-xs text-amber-700">
                    In Enable CORS this is the <em>Allow origin</em> setting -
                    paste the value above, save, then run the check again.
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5">
                  <p className="mb-2.5 text-xs font-medium text-zinc-700">
                    If it still fails, check on the WordPress install that:
                  </p>
                  <ul className="space-y-2">
                    {WP_PLUGINS.filter((plugin) => plugin !== CORS_PLUGIN).map((plugin) => (
                      <li key={plugin.name} className="flex items-start gap-2 text-xs">
                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-zinc-400" />
                        <span className="min-w-0">
                          <a
                            href={plugin.href}
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium text-zinc-700 hover:text-emerald-700 hover:underline">
                            {plugin.name}
                          </a>
                          <span className="text-zinc-500">
                            {" "}is installed and active - {plugin.note.toLowerCase()}.
                          </span>
                        </span>
                      </li>
                    ))}
                    <li className="flex items-start gap-2 text-xs">
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-zinc-400" />
                      <span className="text-zinc-500">
                        The subdomain resolves to that install over HTTPS with a valid certificate.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </Card>

          <Card>
            <div className="mb-5 flex flex-wrap items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Rocket size={17} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold tracking-tight text-zinc-900">
                  {dbName || "Untitled project"}
                </div>
                <a
                  href={`https://github.com/${DASHBOARD_REPO}`}
                  target="_blank"
                  rel="noreferrer"
                  style={FONT_MONO}
                  className="mt-0.5 inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-emerald-700 hover:underline">
                  {DASHBOARD_REPO}
                  <ExternalLink size={11} />
                </a>
              </div>
              <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
                main domain
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="project-name">Project name in Vercel</FieldLabel>
                <input
                  id="project-name"
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value)}
                  className={INPUT}
                />
              </div>
              <div>
                <FieldLabel htmlFor="assigned-domain">Assigned domain</FieldLabel>
                <input
                  id="assigned-domain"
                  value={mainDomain}
                  readOnly
                  className={INPUT_READONLY}
                />
              </div>
            </div>

            {/*
              Build overrides are empty for a stock Next.js repo and Vercel
              detects all four, so they are folded away rather than presented as
              four more fields to reason about.
            */}
            <details className="group mt-4 rounded-xl border border-zinc-200">
              <summary className="flex cursor-pointer list-none items-center justify-between px-3.5 py-3 text-xs font-medium text-zinc-600 transition-colors hover:text-zinc-900 [&::-webkit-details-marker]:hidden">
                Build &amp; output settings
                <span className="text-zinc-400 transition-transform group-open:rotate-180">
                  ▾
                </span>
              </summary>
              <div className="border-t border-zinc-200 p-3.5">
                <p className="mb-3 text-xs text-zinc-500">
                  Leave blank to let Vercel detect them from the repo.
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor="root-dir">Root directory</FieldLabel>
                    <input id="root-dir" value={dbRoot} onChange={(e) => setDbRoot(e.target.value)} placeholder="/ (default)" className={INPUT} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="build-cmd">Build command</FieldLabel>
                    <input id="build-cmd" value={dbBuild} onChange={(e) => setDbBuild(e.target.value)} placeholder="npm run build" className={INPUT} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="output-dir">Output directory</FieldLabel>
                    <input id="output-dir" value={dbOutput} onChange={(e) => setDbOutput(e.target.value)} placeholder=".next" className={INPUT} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="install-cmd">Install command</FieldLabel>
                    <input id="install-cmd" value={dbInstall} onChange={(e) => setDbInstall(e.target.value)} placeholder="npm install" className={INPUT} />
                  </div>
                </div>
              </div>
            </details>

            <div className="mt-5 border-t border-zinc-200 pt-5">
              <EnvVarEditor
                envs={dbEnvs}
                onChange={setDbEnvs}
                onRegenerateToken={() =>
                  setApiToken(crypto.randomBytes(32).toString("hex"))
                }
              />
            </div>
          </Card>

          <div className="flex flex-wrap items-center justify-end gap-2.5">
            {wpStatus !== "ok" && (
              <p className="mr-auto text-xs text-zinc-500">
                Verify the WordPress connection to continue.
              </p>
            )}
            <button type="button" onClick={() => setStep(1)} className={BTN_SECONDARY}>
              <ArrowLeft size={15} />
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              // disabled={wpStatus !== "ok"}
              className={BTN_PRIMARY}>
              Continue
              <ArrowRight size={15} />
            </button>
          </div>
        </>
      )}

      {/* Step 3 — Contact details */}
      {step === 3 && (
        <>
          <h1 className="mb-1.5 text-2xl font-semibold tracking-tight text-zinc-900">
            Contact details
          </h1>
          <p className="mb-7 text-sm text-zinc-500">
            Who this store belongs to — kept with the deployment record and
            written into the downloadable env file.
          </p>

          <Stepper step={3} />

          <Card>
            <CardHead
              icon={User}
              tone="violet"
              title="Store owner"
              desc="Used to reach whoever runs this store about the deployment."
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {CONTACT_FIELDS.map((f) => (
                <div key={f.field} className={f.field === "name" ? "sm:col-span-2" : ""}>
                  <FieldLabel htmlFor={f.id}>
                    {f.label}
                    {f.optional && (
                      <span className="font-normal text-zinc-400"> (optional)</span>
                    )}
                  </FieldLabel>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                      <f.icon size={14} />
                    </span>
                    <input
                      id={f.id}
                      type={f.type}
                      autoComplete={f.autoComplete}
                      value={contact[f.field]}
                      onChange={(e) => updateContact(f.field, e.target.value)}
                      placeholder={f.placeholder}
                      aria-invalid={!!errors[f.field]}
                      className={`${INPUT} !pl-9 ${errors[f.field] ? INPUT_INVALID : ""}`}
                    />
                  </div>
                  <FieldError>{errors[f.field]}</FieldError>
                </div>
              ))}

              <div className="sm:col-span-2">
                <FieldLabel htmlFor="contact-address">
                  Address{" "}
                  <span className="font-normal text-zinc-400">(optional)</span>
                </FieldLabel>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-3 text-zinc-400">
                    <MapPin size={14} />
                  </span>
                  <textarea
                    id="contact-address"
                    rows={3}
                    autoComplete="street-address"
                    value={contact.address}
                    onChange={(e) => updateContact("address", e.target.value)}
                    placeholder={"12 Market Street\nPortland, OR 97201\nUnited States"}
                    className={`${INPUT} !pl-9 resize-y`}
                  />
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-2.5">
            <button type="button" onClick={() => setStep(2)} className={BTN_SECONDARY}>
              <ArrowLeft size={15} />
              Back
            </button>
            <button type="button" onClick={ev => {
              goStep4()
              create_project()
            }} className={BTN_PRIMARY}>
              Plan
              <ArrowRight size={15} />
            </button>
          </div>
        </>
      )}

      {/* Step 4 — Plan (optional) */}
      {step === 4 && (
        <>
          <h1 className="mb-1.5 text-2xl font-semibold tracking-tight text-zinc-900">
            Choose a plan
          </h1>
          <p className="mb-7 text-sm text-zinc-500">
            Optional — skip it and the store still deploys. Picking Starter or
            Business opens Lemon Squeezy checkout, and that has to finish before
            the review.
          </p>

          <Stepper step={4} />

          <Card>
            <SectionHeading
              action={
                subscription ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                    <ShieldCheck size={13} />
                    Subscribed
                  </span>
                ) : plan ? (
                  <button
                    type="button"
                    onClick={() => setPlan("")}
                    className={`${BTN_ICON} !text-zinc-500 hover:!bg-zinc-100 hover:!text-zinc-900 focus-visible:outline-zinc-400`}>
                    Clear
                  </button>
                ) : null
              }>
              PLAN <span className="font-normal text-zinc-400">(optional)</span>
            </SectionHeading>

            {/*
              Buttons rather than real radios: `globals.css` restyles bare
              inputs, and a clickable row this tall is easier to hit than a
              13px dot. The roles are set by hand so it still reads as one
              group, and clicking the selected row clears it - that is the only
              way back to "no plan" once something is picked.

              Once Lemon Squeezy has taken a payment the group locks. These
              rows are a signup choice, not a billing screen: switching plans
              after a charge would leave the wizard recording a plan nobody
              paid for, and refunds and upgrades belong in the dashboard.
            */}
            <div role="radiogroup" aria-label="ComboStore plan" className="space-y-2.5">
              {PLAN_OPTIONS.map((option) => {
                const selected = plan === option.key;
                const paidFor = subscription?.plan === option.key;
                const locked = Boolean(subscription) && !paidFor;

                return (
                  <button
                    key={option.key}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={locked}
                    onClick={() => {
                      if (subscription) return;
                      setPlan(selected ? "" : option.key);
                    }}
                    className={`block w-full !rounded-xl !border !px-4 !py-3.5 text-left !shadow-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${selected
                      ? "!border-emerald-500 !bg-emerald-50/50"
                      : "!border-zinc-200 !bg-white hover:!border-zinc-300 hover:!bg-zinc-50"
                      }`}>
                    <span className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors ${selected
                          ? "border-emerald-600 bg-emerald-600"
                          : "border-zinc-300 bg-white"
                          }`}>
                        {selected && <Check size={12} className="text-white" />}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                          <span className="text-sm font-semibold text-zinc-900">
                            {option.name}
                            {paidFor && (
                              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 align-middle text-[10px] font-semibold tracking-wide text-emerald-700">
                                <Check size={9} />
                                PAID
                              </span>
                            )}
                          </span>
                          <span className="text-sm font-semibold text-zinc-900">
                            {option.price}
                            {option.period && (
                              <span className="font-normal text-zinc-500">
                                {" "}{option.period}
                              </span>
                            )}
                          </span>
                        </span>

                        <span className="mt-0.5 block text-xs text-zinc-500">
                          {option.tagline}
                        </span>

                        <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                          {option.points.map((point) => (
                            <span
                              key={point}
                              className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
                              <Check size={10} className="shrink-0 text-emerald-600" />
                              {point}
                            </span>
                          ))}
                        </span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/*
              Checkout only appears under a plan Lemon Squeezy can actually
              sell. Enterprise says why it cannot be bought here, and a billed
              plan whose link never made it into `.env` names the variable that
              is missing rather than opening an empty overlay.
            */}
            {planChoice && (
              <div className="mt-4">
                {planPaid ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5">
                    <div className="flex items-start gap-2.5">
                      <ShieldCheck size={15} className="mt-0.5 shrink-0 text-emerald-600" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-emerald-900">
                          Subscription active
                          {subscription.testMode && (
                            <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-800">
                              TEST ORDER
                            </span>
                          )}
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-emerald-800">
                          Lemon Squeezy took the payment for {planSummary}
                          {subscription.total ? ` (${subscription.total})` : ""}. The
                          plan is locked for the rest of this wizard — change it
                          later from the dashboard.
                        </p>
                        <div
                          style={FONT_MONO}
                          className="mt-2 space-y-1 text-[11px] text-emerald-900/80">
                          <div className="truncate">
                            order #{subscription.orderNumber || "—"}
                          </div>
                          {subscription.identifier && (
                            <div className="truncate">
                              ref {subscription.identifier}
                            </div>
                          )}
                          {subscription.email && (
                            <div className="truncate">{subscription.email}</div>
                          )}
                        </div>
                        {subscription.receipt && (
                          <a
                            href={subscription.receipt}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-900">
                            View receipt
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ) : !planChoice.billed ? (
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5">
                    <p className="text-xs leading-relaxed text-zinc-600">
                      <span className="font-medium text-zinc-800">
                        {planChoice.name}
                      </span>{" "}
                      is priced per store, so there is nothing to charge here. The
                      plan is recorded with the deployment and sales scope it with{" "}
                      {contact.email.trim() || "the store owner"}.
                    </p>
                  </div>
                ) : !planChoice.checkoutLink ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5">
                    <div className="flex items-start gap-2.5">
                      <ShieldAlert size={15} className="mt-0.5 shrink-0 text-amber-600" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-amber-900">
                          Checkout not configured
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-amber-800">
                          <code
                            style={FONT_MONO}
                            className="rounded bg-amber-100 px-1.5 py-0.5 text-[11px]">
                            {planChoice.linkEnvKey}
                          </code>{" "}
                          is missing, so this plan cannot be paid for here. It is
                          still recorded with the deployment and can be billed
                          afterwards.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : lemonStatus === "unavailable" ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5">
                    <div className="flex items-start gap-2.5">
                      <ShieldAlert size={15} className="mt-0.5 shrink-0 text-amber-600" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-amber-900">
                          Checkout unavailable
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-amber-800">
                          {lemonError}
                        </p>
                        {LEMON_CONFIGURED && (
                          <button
                            type="button"
                            onClick={() => {
                              setLemonStatus("idle");
                              setLemonError("");
                            }}
                            className={`${BTN_ICON} mt-2 !text-amber-800 hover:!bg-amber-100 focus-visible:outline-amber-500`}>
                            <RefreshCw size={12} />
                            Try again
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-900">
                          {planChoice.price}
                          {planChoice.period && (
                            <span className="font-normal text-zinc-500">
                              {" "}{planChoice.period}
                            </span>
                          )}
                        </p>
                        <p className="mt-0.5 text-xs text-zinc-500">
                          Charged by Lemon Squeezy
                          {contact.email.trim() ? ` to ${contact.email.trim()}` : ""} —
                          the receipt and the card details stay with them.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => openCheckout(planChoice)}
                        disabled={lemonStatus !== "ready"}
                        className={BTN_PRIMARY}>
                        {lemonStatus === "ready" ? (
                          <>
                            <CreditCard size={15} />
                            Subscribe
                          </>
                        ) : (
                          <>
                            <Loader2 size={15} className="animate-spin" />
                            Loading checkout…
                          </>
                        )}
                      </button>
                    </div>

                    {lemonError && (
                      <p className="mt-2.5 flex items-start gap-1.5 text-xs text-red-600">
                        <CircleAlert size={13} className="mt-0.5 shrink-0" />
                        {lemonError}
                      </p>
                    )}

                    {LEMON_MODE !== "live" && (
                      <p className="mt-2.5 text-[11px] leading-relaxed text-amber-700">
                        Expected to be a{" "}
                        <span className="font-semibold">test mode</span> checkout —
                        test cards only. Test or live follows the Lemon Squeezy
                        store and the link in{" "}
                        <code
                          style={FONT_MONO}
                          className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px]">
                          {planChoice.linkEnvKey}
                        </code>
                        , not this page; a finished order reports which it was. Set{" "}
                        <code
                          style={FONT_MONO}
                          className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px]">
                          NEXT_PUBLIC_LEMONSQUEEZY_MODE=live
                        </code>{" "}
                        to drop this notice.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <p className="mt-4 text-xs leading-relaxed text-zinc-500">
              {planChoice ? (
                <>
                  <span className="font-medium text-zinc-700">{planSummary}</span>{" "}
                  is recorded with this deployment and written into the{" "}
                  <code
                    style={FONT_MONO}
                    className="rounded bg-zinc-100 px-1.5 py-0.5 text-[11px] text-zinc-700">
                    {envFileName}
                  </code>{" "}
                  download
                  {subscription
                    ? ", with the Lemon Squeezy order number beside it."
                    : "."}
                  {planNeedsPayment && !planPaid
                    ? " Checkout has to finish before the review opens."
                    : ""}
                </>
              ) : (
                "Nothing selected. The store deploys without a plan and keeps working — pick one whenever the trial is up."
              )}
            </p>
          </Card>

          {!canLeavePlanStep && (
            <p className="mb-3 flex items-center justify-end gap-1.5 text-xs text-zinc-500">
              <CircleAlert size={13} className="shrink-0 text-amber-500" />
              Finish the Lemon Squeezy checkout for {planChoice?.name}, or clear
              the plan, to continue.
            </p>
          )}

          <div className="flex justify-end gap-2.5">
            <button type="button" onClick={() => setStep(3)} className={BTN_SECONDARY}>
              <ArrowLeft size={15} />
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(5)}
              disabled={!canLeavePlanStep}
              className={BTN_PRIMARY}>
              Review
              <ArrowRight size={15} />
            </button>
          </div>
        </>
      )}

      {/* Step 5 — Review */}
      {step === 5 && (
        <>
          <h1 className="mb-1.5 text-2xl font-semibold tracking-tight text-zinc-900">
            Review the project
          </h1>
          <p className="mb-7 text-sm text-zinc-500">
            Confirm the details — the project is created from here through the
            Vercel API.
          </p>

          <Stepper step={5} />

          <Card className="!bg-zinc-950 !border-zinc-800">
            <SectionHeading>
              <span className="text-zinc-500">SUMMARY</span>
            </SectionHeading>
            <dl className="space-y-2.5 text-sm">
              {[
                { k: "Project", v: dbName },
                { k: "Repository", v: DASHBOARD_REPO },
                { k: "Storefront", v: mainDomain },
                { k: "Dashboard", v: `${mainDomain}/dashboard` },
                { k: "Framework", v: framework || "auto-detect" },
                { k: "Variables", v: `${buildEnvPayload(dbEnvs).length} injected` },
                { k: "Plan", v: planSummary || "none chosen" },
                ...(subscription
                  ? [
                      {
                        k: "Billing",
                        v: `Lemon Squeezy${subscription.testMode ? " (test)" : ""} · order #${subscription.orderNumber || subscription.orderId}`,
                      },
                    ]
                  : []),
              ].map((row) => (
                <div key={row.k} className="flex items-baseline gap-3">
                  <dt className="w-24 shrink-0 text-xs text-zinc-500">{row.k}</dt>
                  <dd
                    style={FONT_MONO}
                    className="min-w-0 flex-1 truncate text-xs text-zinc-100">
                    {row.v}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card>
            <SectionHeading
              action={
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className={`${BTN_ICON} !text-zinc-500 hover:!bg-zinc-100 hover:!text-zinc-900 focus-visible:outline-zinc-400`}>
                  Edit
                </button>
              }>
              STORE CONTACT
            </SectionHeading>
            <dl className="space-y-2.5">
              {[
                { k: "Name", v: contact.name, icon: User },
                { k: "Email", v: contact.email, icon: Mail },
                { k: "Phone", v: contact.phone, icon: Phone },
                { k: "Address", v: contact.address, icon: MapPin },
              ].map((row) => (
                <div key={row.k} className="flex items-baseline gap-2.5 text-xs">
                  <row.icon size={13} className="shrink-0 translate-y-0.5 text-zinc-400" />
                  <dt className="w-16 shrink-0 text-zinc-500">{row.k}</dt>
                  <dd className="min-w-0 flex-1 whitespace-pre-line break-words font-medium text-zinc-800">
                    {row.v.trim() || (
                      <span className="font-normal text-zinc-400">not given</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card>
            <SectionHeading
              action={
                <button
                  type="button"
                  onClick={downloadEnvFile}
                  disabled={!buildEnvPayload(dbEnvs).length}
                  className={`${BTN_ICON} !text-emerald-700 hover:!bg-emerald-50 focus-visible:outline-emerald-500`}>
                  {envDownloaded ? (
                    <>
                      <Check size={13} className="text-emerald-600" />
                      Downloaded
                    </>
                  ) : (
                    <>
                      <Download size={13} />
                      Download .env
                    </>
                  )}
                </button>
              }>
              ENVIRONMENT VARIABLES
            </SectionHeading>

            <p className="mb-3 text-xs leading-relaxed text-zinc-500">
              These are injected before the first build. Download them as{" "}
              <code
                style={FONT_MONO}
                className="rounded bg-zinc-100 px-1.5 py-0.5 text-[11px] text-zinc-700">
                {envFileName}
              </code>{" "}
              and keep the file somewhere private — the API token is generated
              here and is not shown again after this wizard closes.
            </p>

            {buildEnvPayload(dbEnvs).length ? (
              <div
                style={FONT_MONO}
                className="space-y-1.5 rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 text-xs">
                {buildEnvPayload(dbEnvs).map((row) => (
                  <div key={row.key} className="flex items-baseline gap-2.5">
                    <span className="w-48 shrink-0 truncate text-zinc-500">
                      {row.key}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-zinc-800">
                      {row.value || (
                        <span className="text-zinc-400">(empty)</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 text-xs text-zinc-500">
                No variables defined — add them on the configure step.
              </p>
            )}
          </Card>

          <Card>
            <SectionHeading>WHAT WILL HAPPEN</SectionHeading>
            <ul className="space-y-3">
              {[
                <>Create the project from <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">{DASHBOARD_REPO}</code> and assign it to <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">{mainDomain}</code></>,
                <>Serve the storefront at <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">/</code> and the dashboard at <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">/dashboard</code> from that one project</>,
                "Inject the environment variables before the first build",
                "Vercel triggers the initial deployment automatically on creation",
                <>Keep the store contact with this deployment — Vercel has no field for it, so it travels in the <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">{envFileName}</code> download</>,
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-700">
                  <span className="mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <Check size={11} className="text-emerald-700" />
                  </span>
                  <span className="min-w-0">{text}</span>
                </li>
              ))}
            </ul>
          </Card>

          <div className="flex justify-end gap-2.5">
            <button type="button" onClick={() => setStep(4)} className={BTN_SECONDARY}>
              <ArrowLeft size={15} />
              Back
            </button>
            <button type="button" onClick={requestDeploy} className={BTN_PRIMARY}>
              <Rocket size={15} />
              Deploy project
            </button>
          </div>

          {confirmingDeploy && (
            <ConfirmDialog
              title={`Deploy without saving ${envFileName}?`}
              desc={`The ${buildEnvPayload(dbEnvs).length} environment variables have not been downloaded${savedEnvText ? " since you last changed them" : ""}. The API token is generated in this browser and is not shown again once the wizard closes.`}
              onCancel={() => setConfirmingDeploy(false)}>
              <button
                type="button"
                onClick={() => setConfirmingDeploy(false)}
                className={`${BTN_SECONDARY} sm:!px-4`}>
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmingDeploy(false);
                  deploy();
                }}
                className={`${BTN_SECONDARY} sm:!px-4`}>
                Deploy anyway
              </button>
              <button
                type="button"
                onClick={downloadThenDeploy}
                className={`${BTN_PRIMARY} sm:!px-4`}>
                <Download size={15} />
                Download &amp; deploy
              </button>
            </ConfirmDialog>
          )}
        </>
      )}
    </Shell>
  );
}
