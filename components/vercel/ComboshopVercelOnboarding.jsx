"use client";

import { useState, useCallback, useEffect } from "react";
import crypto from "crypto";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  KeyRound,
  LayoutDashboard,
  Loader2,
  Plus,
  RefreshCw,
  Rocket,
  Server,
  Store,
  Trash2,
} from "lucide-react";

/*
  One repo, one project. combostore-storefront is retired: the dashboard repo
  serves the storefront at `/` and the admin screens under `/dashboard`, so
  there is nothing left to deploy separately and the project takes the root
  domain rather than a `dashboard.` subdomain.
*/
const DASHBOARD_REPO = "pickplugins/combostore";

const WP_PLUGINS = [
  {
    name: "Combo Store — Server",
    note: "The commerce models and REST layer",
    href: "https://github.com/pickplugins/combostore-server",
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

const STEPS = [
  { n: 1, label: "Credentials" },
  { n: 2, label: "Configure" },
  { n: 3, label: "Review" },
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
      <div className="flex items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-xl bg-emerald-600 text-[13px] font-bold text-white">
          CS
        </span>
        <span className="text-[17px] font-semibold tracking-tight text-zinc-900">
          ComboStore
        </span>
      </div>
      {step ? (
        <span className="text-xs text-zinc-500">Step {step} of 3</span>
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

  const buildEnvPayload = (envs) =>
    envs
      .filter((e) => e.key.trim())
      .map((e) => ({
        key: e.key.trim(),
        value: e.value,
        type: "plain",
        target: ["production", "preview", "development"],
      }));

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

  const reset = () => {
    setStep(1);
    setDeployed(false);
    setDeploying(false);
    setVercelToken("");
    setMainDomain("");
    setLogs([]);
    setDeployError("");
    setErrors({});
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
                onClick={() => { setDeploying(false); setStep(3); }}
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
                  href={p.href}
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

          <div className="flex justify-end gap-2.5">
            <button type="button" onClick={() => setStep(1)} className={BTN_SECONDARY}>
              <ArrowLeft size={15} />
              Back
            </button>
            <button type="button" onClick={() => setStep(3)} className={BTN_PRIMARY}>
              Review &amp; deploy
              <ArrowRight size={15} />
            </button>
          </div>
        </>
      )}

      {/* Step 3 — Review */}
      {step === 3 && (
        <>
          <h1 className="mb-1.5 text-2xl font-semibold tracking-tight text-zinc-900">
            Review &amp; deploy
          </h1>
          <p className="mb-7 text-sm text-zinc-500">
            Confirm the details before the project is created through the Vercel API.
          </p>

          <Stepper step={3} />

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
            <SectionHeading>WHAT WILL HAPPEN</SectionHeading>
            <ul className="space-y-3">
              {[
                <>Create the project from <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">{DASHBOARD_REPO}</code> and assign it to <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">{mainDomain}</code></>,
                <>Serve the storefront at <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">/</code> and the dashboard at <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">/dashboard</code> from that one project</>,
                "Inject the environment variables before the first build",
                "Vercel triggers the initial deployment automatically on creation",
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
            <button type="button" onClick={() => setStep(2)} className={BTN_SECONDARY}>
              <ArrowLeft size={15} />
              Edit
            </button>
            <button type="button" onClick={deploy} className={BTN_PRIMARY}>
              <Rocket size={15} />
              Deploy project
            </button>
          </div>
        </>
      )}
    </Shell>
  );
}
