"use client";

import { useState } from "react";
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

/*
  Marketing landing page for ComboStore.

  Positioned as a headless commerce platform - WordPress for the admin and
  content, Next.js for the storefront - rather than the receipt/cash-memo
  styling this page used to carry. The local payment rails are still the
  differentiator and keep a section of their own; they are no longer the
  page's whole visual identity.

  Typography comes from the Geist variables the root layout already loads, so
  there is no render-blocking @import here. `globals.css` sets `body` to Arial
  and styles every bare `<button>`, so the root sets its own font-family and
  the one real button carries `!` overrides.
*/

const FEATURES = [
  {
    icon: ClipboardList,
    title: "Order management",
    desc: "Every order from placed to delivered, with status your team and your customer both see.",
  },
  {
    icon: Package,
    title: "Product management",
    desc: "Variants, categories and pricing in the WordPress editor, published straight to the storefront.",
  },
  {
    icon: Boxes,
    title: "Stock management",
    desc: "Live counts across warehouses, with low-stock alerts before a listing goes dark.",
  },
  {
    icon: Receipt,
    title: "Purchases & expenses",
    desc: "Log supplier invoices and running costs so margin is a number, not a guess.",
  },
  {
    icon: Truck,
    title: "Delivery management",
    desc: "Assign riders or courier partners, print labels, and push live status to buyers.",
  },
  {
    icon: Wallet,
    title: "Local payments",
    desc: "Cash on Delivery, bKash, Nagad and Rocket wired into checkout — no plugin stack to assemble.",
  },
  {
    icon: Headset,
    title: "Support tickets",
    desc: "Questions and complaints in one queue, with the full order history attached.",
  },
  {
    icon: Sparkles,
    title: "AI content assistant",
    desc: "Draft product descriptions and blog posts in seconds, in Bangla or English.",
  },
  {
    icon: ImageIcon,
    title: "Media library",
    desc: "Product photos and video in one place, optimised automatically for fast pages.",
  },
];

const NAV_LINKS = [
  { label: "Platform", href: "#platform" },
  { label: "Features", href: "#features" },
  { label: "AI", href: "#ai" },
  { label: "Payments", href: "#payments" },
];

const STACK = [
  {
    step: "01",
    kicker: "Admin & content",
    title: "WordPress",
    desc: "Your team works in the editor it already knows. The ComboStore plugin adds the commerce models, roles and a REST layer on top of it.",
  },
  {
    step: "02",
    kicker: "Commerce engine",
    title: "ComboStore API",
    desc: "Order logic, stock sync, payment rails and delivery routing run through one API layer — the storefront never touches the database.",
  },
  {
    step: "03",
    kicker: "Customer-facing",
    title: "Next.js storefront",
    desc: "Server-rendered category and product pages, incremental revalidation, and a checkout that still works on a slow connection.",
  },
];

const PAYMENTS = [
  {
    name: "bKash",
    desc: "Direct checkout integration, no separate plugin to license.",
    accent: "text-pink-600",
    ring: "ring-pink-100",
  },
  {
    name: "Nagad",
    desc: "Instant payment confirmation the moment checkout completes.",
    accent: "text-orange-600",
    ring: "ring-orange-100",
  },
  {
    name: "Rocket",
    desc: "Mobile banking, configured and ready from day one.",
    accent: "text-violet-600",
    ring: "ring-violet-100",
  },
  {
    name: "Cash on Delivery",
    desc: "With delivery confirmation built into the rider workflow.",
    accent: "text-emerald-600",
    ring: "ring-emerald-100",
  },
];

/*
  Counts taken from what the platform actually ships, not benchmark numbers -
  nothing here is a performance claim the page cannot stand behind.
*/
const PROOF = [
  { value: "9", label: "Modules included" },
  { value: "4", label: "Payment methods" },
  { value: "1", label: "Click to deploy" },
  { value: "2", label: "Languages supported" },
];

const AI_POINTS = [
  "Product descriptions drafted from photos and specs",
  "Blog posts for SEO and seasonal campaigns",
  "Writes in Bangla and English",
  "Every draft stays editable before it publishes",
];

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

/* Illustrative storefront UI. Decorative, so it is hidden from screen
   readers rather than described - the copy beside it carries the meaning. */
function StorefrontMock() {
  const products = [
    { tone: "bg-emerald-100", bar: "w-3/4", price: "৳1,450" },
    { tone: "bg-amber-100", bar: "w-2/3", price: "৳890" },
    { tone: "bg-sky-100", bar: "w-4/5", price: "৳2,100" },
    { tone: "bg-rose-100", bar: "w-1/2", price: "৳640" },
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
            yourstore.com
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
                  IN STOCK
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
            Order #1042
          </span>
          <span className="block text-[10px] text-zinc-500">
            Paid with bKash
          </span>
        </span>
      </div>

      <div className="absolute -right-3 -top-4 hidden items-center gap-2.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 shadow-xl shadow-zinc-900/10 sm:flex lg:-right-8">
        <span className="flex size-7 items-center justify-center rounded-lg bg-zinc-900">
          <Zap size={14} className="text-emerald-400" />
        </span>
        <span className="text-left">
          <span className="block text-[11px] font-semibold text-zinc-900">
            Static + revalidated
          </span>
          <span className="block text-[10px] text-zinc-500">
            Served from the edge
          </span>
        </span>
      </div>

    </div>
  );
}

export default function ComboStoreLanding() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="min-h-screen w-full bg-white text-zinc-900 antialiased"
      style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}>

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
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href="/onboard"
              className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700">
              Deploy on Vercel
              <ArrowRight size={14} />
            </a>
          </div>

          {/* `globals.css` styles every bare <button>, hence the overrides. */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
            className="!rounded-lg !border !border-zinc-200 !bg-white !p-2 !text-zinc-700 !shadow-none md:!hidden">
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

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
                  {link.label}
                </a>
              ))}
              <a
                href="/onboard"
                onClick={() => setMenuOpen(false)}
                className="mt-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-center text-sm font-medium text-white">
                Deploy on Vercel
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
              <SectionLabel>Headless commerce · WordPress + Next.js</SectionLabel>

              <h1 className="mb-5 text-4xl font-semibold leading-[1.08] tracking-tight text-zinc-900 sm:text-5xl lg:text-[3.4rem]">
                The ecommerce platform that keeps{" "}
                <span className="text-emerald-600">WordPress</span> behind the
                counter.
              </h1>

              <p className="mb-8 max-w-lg text-lg leading-relaxed text-zinc-600">
                ComboStore puts a Next.js storefront in front of the WordPress
                admin your team already runs — one deploy, nine business
                modules, and the payment methods your customers actually use.
              </p>

              <div className="mb-6 flex flex-wrap gap-3">
                <a
                  href="/onboard"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-colors hover:bg-emerald-700">
                  Deploy on Vercel
                  <ArrowRight size={16} />
                </a>
                <a
                  href="#platform"
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-6 py-3.5 text-sm font-semibold text-zinc-800 transition-colors hover:border-zinc-400 hover:bg-zinc-50">
                  See how it works
                </a>
              </div>

              <p className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-zinc-500">
                <span className="inline-flex items-center gap-1.5">
                  <Check size={14} className="text-emerald-600" />
                  No card required
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check size={14} className="text-emerald-600" />
                  Setup support in Bangla &amp; English
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
            {PROOF.map((item) => (
              <div key={item.label} className="px-2 text-center lg:text-left">
                <div className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                  {item.value}
                </div>
                <div className="mt-1 text-sm text-zinc-500">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Platform / architecture ── */}
        <section id="platform" className="bg-zinc-950 text-white">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">

            <div className="mb-14 max-w-2xl">
              <SectionLabel tone="dark">The architecture</SectionLabel>
              <h2 className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Headless, without the integration project
              </h2>
              <p className="text-lg leading-relaxed text-zinc-400">
                Most headless builds mean stitching a CMS, a commerce API and a
                frontend together yourself. ComboStore ships all three as one
                platform — and deploys them as a single Vercel project.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {STACK.map((item) => (
                <div
                  key={item.step}
                  className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-colors hover:border-white/20">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="text-xs font-medium tracking-widest text-emerald-400">
                      {item.step}
                    </span>
                    <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-zinc-400">
                      {item.kicker}
                    </span>
                  </div>
                  <h3 className="mb-2.5 text-xl font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-2xl border border-white/10 bg-white/[0.03] px-7 py-5 text-sm text-zinc-400">
              <span className="inline-flex items-center gap-2">
                <Globe size={15} className="text-emerald-400" />
                SEO-ready server rendering
              </span>
              <span className="inline-flex items-center gap-2">
                <Layers size={15} className="text-emerald-400" />
                Storefront and dashboard in one deploy
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck size={15} className="text-emerald-400" />
                JWT-authenticated admin API
              </span>
            </div>

          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="mx-auto max-w-6xl px-6 py-20 sm:py-24">

          <div className="mb-14 max-w-2xl">
            <SectionLabel>Everything included</SectionLabel>
            <h2 className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              One dashboard, every part of the business
            </h2>
            <p className="text-lg leading-relaxed text-zinc-600">
              From the first product photo to the last delivery confirmation —
              orders, stock, money and customers stay in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-900/5">
                  <span className="mb-4 flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                    <Icon size={18} />
                  </span>
                  <h3 className="mb-2 text-base font-semibold tracking-tight text-zinc-900">
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-600">
                    {f.desc}
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
              <SectionLabel>AI, built in</SectionLabel>
              <h2 className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Let AI write the first draft, every time
              </h2>
              <p className="mb-7 text-lg leading-relaxed text-zinc-600">
                Give the assistant a few details and it drafts a product
                description, an SEO title, or a full blog post — ready to edit
                and publish from the same screen.
              </p>
              <ul className="space-y-3.5">
                {AI_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-zinc-700">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                      <Check size={12} className="text-emerald-700" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-900/5">
              <div className="flex items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-3">
                <Sparkles size={13} className="text-emerald-600" />
                <span className="text-xs font-medium text-zinc-500">
                  Content assistant
                </span>
              </div>
              <div className="p-6">
                <div className="mb-5 rounded-xl bg-zinc-100 px-4 py-3 text-sm text-zinc-600">
                  Write a description for: handloom cotton saree, navy blue,
                  Tangail weave
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 px-4 py-3.5 text-sm leading-relaxed text-zinc-800">
                  A handwoven Tangail saree in deep navy cotton, finished with a
                  traditional border and a soft, breathable drape built for
                  everyday wear. Perfect for office, festivals, or gifting.
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white">
                    Use draft
                  </span>
                  <span className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600">
                    Regenerate
                  </span>
                  <span className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600">
                    বাংলায় লিখুন
                  </span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── Payments ── */}
        <section id="payments" className="mx-auto max-w-6xl px-6 py-20 sm:py-24">

          <div className="mb-14 max-w-2xl">
            <SectionLabel>Checkout that fits Bangladesh</SectionLabel>
            <h2 className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Get paid the way your customers pay
            </h2>
            <p className="text-lg leading-relaxed text-zinc-600">
              Local payment methods come configured out of the box — there is no
              plugin stack to license, wire up and keep in sync.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PAYMENTS.map((p) => (
              <div
                key={p.name}
                className="rounded-2xl border border-zinc-200 bg-white p-6">
                <div
                  className={`mb-3 inline-flex rounded-lg px-2.5 py-1 text-lg font-semibold tracking-tight ring-1 ${p.accent} ${p.ring}`}>
                  {p.name}
                </div>
                <p className="text-sm leading-relaxed text-zinc-600">{p.desc}</p>
              </div>
            ))}
          </div>

        </section>

        {/* ── CTA ── */}
        <section id="contact" className="mx-auto max-w-6xl px-6 pb-20 sm:pb-24">
          <div className="relative overflow-hidden rounded-3xl bg-zinc-950 px-8 py-16 text-center sm:px-12">

            <div className="pointer-events-none absolute -bottom-32 left-1/2 size-[520px] -translate-x-1/2 rounded-full bg-emerald-600/20 blur-3xl" />

            <div className="relative">
              <h2 className="mb-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Your shop, live in days — not months
              </h2>
              <p className="mx-auto mb-8 max-w-lg text-lg leading-relaxed text-zinc-400">
                Point it at a domain and deploy. We will walk you through setup,
                migration and payment configuration.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href="/onboard"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500">
                  Deploy on Vercel
                  <ArrowRight size={16} />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5">
                  Talk to sales
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
                Headless ecommerce for Bangladeshi sellers, built on WordPress
                and Next.js.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-14 gap-y-8">
              <div>
                <h4 className="mb-3.5 text-xs font-semibold tracking-wider text-zinc-400">
                  PLATFORM
                </h4>
                <div className="flex flex-col gap-2.5 text-sm">
                  <a href="#platform" className="text-zinc-600 hover:text-emerald-700">
                    Architecture
                  </a>
                  <a href="#features" className="text-zinc-600 hover:text-emerald-700">
                    Features
                  </a>
                  <a href="#ai" className="text-zinc-600 hover:text-emerald-700">
                    AI assistant
                  </a>
                </div>
              </div>
              <div>
                <h4 className="mb-3.5 text-xs font-semibold tracking-wider text-zinc-400">
                  PAYMENTS
                </h4>
                <div className="flex flex-col gap-2.5 text-sm">
                  <a href="#payments" className="text-zinc-600 hover:text-emerald-700">
                    bKash
                  </a>
                  <a href="#payments" className="text-zinc-600 hover:text-emerald-700">
                    Nagad
                  </a>
                  <a href="#payments" className="text-zinc-600 hover:text-emerald-700">
                    Rocket
                  </a>
                </div>
              </div>
              <div>
                <h4 className="mb-3.5 text-xs font-semibold tracking-wider text-zinc-400">
                  COMPANY
                </h4>
                <div className="flex flex-col gap-2.5 text-sm">
                  <a href="#contact" className="text-zinc-600 hover:text-emerald-700">
                    Contact
                  </a>
                  <a href="/onboard" className="text-zinc-600 hover:text-emerald-700">
                    Deploy on Vercel
                  </a>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-12 flex flex-wrap justify-between gap-3 border-t border-zinc-200 pt-6 text-xs text-zinc-500">
            <span>© 2026 ComboStore. Made for Bangladesh.</span>
            <span>Dhaka · Bangladesh</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
