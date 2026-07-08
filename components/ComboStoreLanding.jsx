import { useState } from "react";
import {
  Check,
  ClipboardList,
  Package,
  Boxes,
  Receipt,
  Truck,
  Wallet,
  Headset,
  Sparkles,
  Image,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";

const FEATURES = [
  {
    code: "ITM-01",
    icon: ClipboardList,
    title: "Order Management",
    desc: "Track every order from placed to delivered, with status updates your team and customers can both see.",
  },
  {
    code: "ITM-02",
    icon: Package,
    title: "Product Management",
    desc: "Add variants, categories, and pricing through a familiar WordPress editor, published instantly to your storefront.",
  },
  {
    code: "ITM-03",
    icon: Boxes,
    title: "Stock Management",
    desc: "Real-time stock counts across warehouses, with low-stock alerts before you run out.",
  },
  {
    code: "ITM-04",
    icon: Receipt,
    title: "Purchase & Expense Management",
    desc: "Log supplier purchases and running costs so your margins are never a guess.",
  },
  {
    code: "ITM-05",
    icon: Truck,
    title: "Delivery Management",
    desc: "Assign riders or courier partners, print labels, and share live delivery status with buyers.",
  },
  {
    code: "ITM-06",
    icon: Wallet,
    title: "Local Payment Methods",
    desc: "Accept Cash on Delivery, bKash, Nagad, and Rocket at checkout — the way your customers already pay.",
  },
  {
    code: "ITM-07",
    icon: Headset,
    title: "Support Tickets",
    desc: "Handle customer questions and complaints in one queue, with a full history per order.",
  },
  {
    code: "ITM-08",
    icon: Sparkles,
    title: "AI Content Assistant",
    desc: "Generate product descriptions and blog posts in seconds, in Bangla or English.",
  },
  {
    code: "ITM-09",
    icon: Image,
    title: "Media Manager",
    desc: "Organize product photos and videos in one library, auto-optimized for fast page loads.",
  },
];

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "AI Assistant", href: "#ai" },
  { label: "Payments", href: "#payments" },
];

const FLOW_STEPS = [
  {
    num: "01",
    title: "WordPress backend",
    desc: "Manage products, orders, stock, and content in the editor your team already knows.",
  },
  {
    num: "02",
    title: "ComboStore engine",
    desc: "Order logic, stock sync, local payments, and delivery routing run through one API layer.",
  },
  {
    num: "03",
    title: "Next.js storefront",
    desc: "A fast, SEO-friendly shop your customers can browse and check out from on any connection.",
  },
];

const PAYMENT_BAND = [
  { name: "Cash", desc: "Cash on Delivery, with delivery confirmation built in" },
  { name: "bKash", desc: "Direct checkout integration, no separate plugin" },
  { name: "Nagad", desc: "Instant payment confirmation at checkout" },
  { name: "Rocket", desc: "Mobile banking, ready from day one" },
];

export default function ComboStoreLanding() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-emerald-950 text-stone-100 font-sans antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');

        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-receipt { font-family: 'IBM Plex Mono', monospace; }
        body, .font-body { font-family: 'Inter', sans-serif; }

        .memo-card {
          clip-path: polygon(
            0% 0%, 100% 0%, 100% 96%, 95% 100%, 90% 96%, 85% 100%, 80% 96%,
            75% 100%, 70% 96%, 65% 100%, 60% 96%, 55% 100%, 50% 96%, 45% 100%,
            40% 96%, 35% 100%, 30% 96%, 25% 100%, 20% 96%, 15% 100%, 10% 96%,
            5% 100%, 0% 96%
          );
        }
        .memo-perforation::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 14px;
          background-image: radial-gradient(circle 6px at 10px 0px, #022c22 6px, transparent 0);
          background-size: 20px 14px;
          background-repeat: repeat-x;
        }
        .stamp-tilt-left { transform: rotate(-4deg); }
        .stamp-tilt-right { transform: rotate(3deg); }
        .caret-blink { animation: caretBlink 1s steps(1) infinite; }
        @keyframes caretBlink { 50% { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) {
          .caret-blink { animation: none; }
        }
      `}</style>

      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[700px] w-[1100px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-emerald-800/60 bg-emerald-950/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="font-display flex items-center gap-2.5 text-lg font-bold tracking-tight">
            <span className="font-receipt flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-700 text-sm font-semibold text-emerald-950">
              CS
            </span>
            ComboStore
          </div>

          <div className="hidden gap-8 text-sm text-emerald-200/70 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-stone-100"
              >
                {link.label}
              </a>
            ))}
          </div>

          <a
            href="#contact"
            className="hidden rounded-lg bg-stone-100 px-5 py-2.5 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 md:inline-block"
          >
            Book a Demo
          </a>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="text-stone-100 md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {menuOpen && (
          <div className="border-t border-emerald-800/60 bg-emerald-950 px-6 py-4 md:hidden">
            <div className="flex flex-col gap-4 text-sm text-emerald-200/70">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-stone-100"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="mt-2 rounded-lg bg-stone-100 px-4 py-2.5 text-center font-semibold text-emerald-950"
              >
                Book a Demo
              </a>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 py-16 md:grid-cols-2 md:py-24">
          <div className="order-2 md:order-1">
            <span className="font-receipt mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-800 bg-emerald-900/50 px-3 py-1.5 text-xs uppercase tracking-wider text-emerald-400">
              <span className="text-[10px]">●</span>
              Headless commerce · WordPress + Next.js
            </span>
            <h1 className="font-display mb-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
              Run your dokan online,{" "}
              <span className="text-emerald-400">receipt-fast.</span>
            </h1>
            <p className="mb-8 max-w-md text-lg text-emerald-200/70">
              ComboStore pairs a WordPress backend with a Next.js storefront
              so Bangladeshi sellers get a shop that loads instantly, sells
              everywhere, and settles the way your customers actually pay —
              cash, bKash, Nagad, or Rocket.
            </p>
            <div className="mb-6 flex flex-wrap gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-6 py-3.5 text-sm font-semibold text-emerald-950 transition-transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/25"
              >
                Book a Demo <ArrowRight size={16} />
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-800 px-6 py-3.5 text-sm font-semibold text-stone-100 transition-colors hover:border-emerald-400 hover:text-emerald-400"
              >
                See what's inside
              </a>
            </div>
            <p className="font-receipt text-xs text-emerald-200/50">
              No card required · Setup support in Bangla &amp; English
            </p>
          </div>

          {/* Cash memo hero visual */}
          <div className="order-1 flex justify-center md:order-2">
            <div className="relative w-full max-w-sm">
              <div className="font-receipt absolute -right-3 -top-4 z-10 flex h-[70px] w-[70px] rotate-12 items-center justify-center rounded-full bg-red-500 p-1.5 text-center text-[10px] font-bold leading-tight text-white shadow-lg shadow-red-500/30">
                HEADLESS
                <br />
                &amp; FAST
              </div>

              <div className="memo-card memo-perforation relative bg-stone-100 px-7 pb-10 pt-8 text-emerald-950 shadow-2xl">
                <div className="mb-4 border-b-2 border-dashed border-emerald-950/30 pb-4 text-center">
                  <div className="font-display text-xl font-bold">
                    ComboStore
                  </div>
                  <div className="font-receipt mt-1 text-[11px] tracking-wide text-emerald-950/50">
                    CASH MEMO · EVERYTHING INCLUDED
                  </div>
                </div>

                <div className="font-receipt mb-4 flex justify-between text-[11px] text-emerald-950/50">
                  <span>NO. CS-2026-014</span>
                  <span>DHAKA, BD</span>
                </div>

                <div className="font-receipt space-y-0 text-[13px]">
                  {[
                    "Order Management",
                    "Product Management",
                    "Stock Management",
                    "Purchase & Expense",
                    "Delivery Management",
                    "Support Tickets",
                    "AI Content Assistant",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-baseline justify-between gap-2 border-b border-dotted border-emerald-950/20 py-1.5"
                    >
                      <span className="whitespace-nowrap">{item}</span>
                      <span className="mx-1.5 -translate-y-0.5 flex-1 border-b border-dotted border-emerald-950/30" />
                      <span className="whitespace-nowrap font-semibold text-emerald-700">
                        ✓
                      </span>
                    </div>
                  ))}
                </div>

                <div className="font-receipt mt-4 flex justify-between border-t-2 border-dashed border-emerald-950/30 pt-4 text-sm font-semibold">
                  <span>TOTAL</span>
                  <span className="text-red-500">Everything, one platform</span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="font-receipt stamp-tilt-left rounded border-[1.5px] border-pink-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-pink-600">
                    bKash
                  </span>
                  <span className="font-receipt stamp-tilt-left rounded border-[1.5px] border-orange-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-orange-500">
                    Nagad
                  </span>
                  <span className="font-receipt stamp-tilt-left rounded border-[1.5px] border-purple-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-purple-600">
                    Rocket
                  </span>
                  <span className="font-receipt stamp-tilt-right rounded border-[1.5px] border-emerald-700 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                    COD
                  </span>
                </div>

                <div className="font-receipt mt-5 text-center text-[10px] tracking-wide text-emerald-950/50">
                  THANK YOU FOR CHOOSING COMBOSTORE
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <div className="border-y border-emerald-800/60 bg-emerald-900/20 py-6">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6">
            <span className="font-receipt text-xs uppercase tracking-wider text-emerald-200/50">
              Built-in local payments
            </span>
            <div className="flex flex-wrap gap-3">
              <span className="font-receipt rounded-full border border-pink-600/40 px-3.5 py-1.5 text-xs font-semibold text-pink-300">
                bKash
              </span>
              <span className="font-receipt rounded-full border border-orange-500/40 px-3.5 py-1.5 text-xs font-semibold text-orange-300">
                Nagad
              </span>
              <span className="font-receipt rounded-full border border-purple-600/40 px-3.5 py-1.5 text-xs font-semibold text-purple-300">
                Rocket
              </span>
              <span className="font-receipt rounded-full border border-emerald-500/40 px-3.5 py-1.5 text-xs font-semibold text-emerald-300">
                Cash on Delivery
              </span>
            </div>
          </div>
        </div>

        {/* Features ledger */}
        <section id="features" className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-12 max-w-xl">
            <span className="font-receipt mb-4 inline-block rounded-full border border-emerald-800 bg-emerald-900/50 px-3 py-1.5 text-xs uppercase tracking-wider text-emerald-400">
              The full ledger
            </span>
            <h2 className="font-display mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
              One dashboard, every part of the business
            </h2>
            <p className="text-emerald-200/70">
              From the first product photo to the last delivery confirmation
              — ComboStore keeps order, stock, money, and customers in one
              place.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-emerald-800/60 bg-emerald-900/20">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.code}
                  className={`grid grid-cols-1 items-center gap-4 px-7 py-6 transition-colors hover:bg-emerald-900/30 sm:grid-cols-[80px_1fr_auto] ${
                    i !== FEATURES.length - 1
                      ? "border-b border-emerald-800/60"
                      : ""
                  }`}
                >
                  <span className="font-receipt text-sm font-semibold text-emerald-400">
                    {f.code}
                  </span>
                  <div className="flex items-start gap-3">
                    <Icon
                      size={20}
                      className="mt-0.5 flex-shrink-0 text-emerald-400"
                    />
                    <div>
                      <h3 className="font-display mb-1 text-base font-semibold">
                        {f.title}
                      </h3>
                      <p className="max-w-md text-sm text-emerald-200/60">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                  <span className="font-receipt flex items-center gap-1.5 whitespace-nowrap text-sm text-emerald-400 sm:justify-end">
                    Included <Check size={14} />
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* AI spotlight */}
        <section
          id="ai"
          className="border-y border-emerald-800/60 bg-emerald-900/20"
        >
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 py-24 md:grid-cols-2">
            <div>
              <span className="font-receipt mb-4 inline-block rounded-full border border-emerald-800 bg-emerald-900/50 px-3 py-1.5 text-xs uppercase tracking-wider text-emerald-400">
                AI, built in
              </span>
              <h2 className="font-display mb-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                Let AI write the first draft, every time
              </h2>
              <p className="mb-5 text-emerald-200/70">
                Stuck staring at a blank product page? Give ComboStore's
                assistant a few details and it drafts a description, SEO
                title, or full blog post — ready to edit and publish.
              </p>
              <ul className="space-y-3">
                {[
                  "Product descriptions generated from photos and specs",
                  "Blog posts for SEO and seasonal campaigns",
                  "Works in Bangla and English",
                  "Every draft stays editable before it goes live",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="overflow-hidden rounded-2xl border border-emerald-800/60 bg-emerald-900/40 shadow-2xl">
              <div className="font-receipt flex items-center gap-2 border-b border-emerald-800/60 px-4 py-3 text-xs text-emerald-200/50">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-800" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-800" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-800" />
                <span className="ml-1">product-description.ai</span>
              </div>
              <div className="font-receipt min-h-[210px] p-6 text-sm">
                <div className="mb-4 text-emerald-200/50">
                  <span className="text-emerald-400">&gt;</span> Write a
                  description for: Handloom cotton saree, navy blue, Tangail
                  weave
                </div>
                <div className="border-l-2 border-emerald-700 pl-4 leading-relaxed text-stone-100">
                  A handwoven Tangail saree in deep navy cotton, finished with
                  a traditional border and a soft, breathable drape built for
                  everyday wear. Perfect for office, festivals, or gifting.
                  <span className="caret-blink ml-0.5 inline-block h-4 w-1.5 bg-emerald-400 align-text-bottom" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-12 max-w-xl">
            <span className="font-receipt mb-4 inline-block rounded-full border border-emerald-800 bg-emerald-900/50 px-3 py-1.5 text-xs uppercase tracking-wider text-emerald-400">
              Under the hood
            </span>
            <h2 className="font-display mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Headless by design
            </h2>
            <p className="text-emerald-200/70">
              Your team manages content the way it always has. Your customers
              get a storefront that feels instant.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3">
            {FLOW_STEPS.map((step, i) => (
              <div key={step.num} className="relative">
                <div
                  className={`h-full border border-emerald-800/60 bg-emerald-900/20 p-7 ${
                    i > 0 ? "md:-ml-px" : ""
                  } ${i > 0 ? "-mt-px md:mt-0" : ""} rounded-2xl md:rounded-none md:first:rounded-l-2xl md:last:rounded-r-2xl`}
                >
                  <span className="font-receipt mb-3 block text-xs text-emerald-400">
                    {step.num}
                  </span>
                  <h3 className="font-display mb-2 text-lg font-semibold">
                    {step.title}
                  </h3>
                  <p className="text-sm text-emerald-200/60">{step.desc}</p>
                </div>
                {i < FLOW_STEPS.length - 1 && (
                  <div className="font-receipt absolute right-0 top-1/2 z-10 hidden h-7 w-7 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-emerald-800 bg-emerald-950 text-emerald-400 md:flex">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Payments band */}
        <section id="payments" className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-12 max-w-xl">
            <span className="font-receipt mb-4 inline-block rounded-full border border-emerald-800 bg-emerald-900/50 px-3 py-1.5 text-xs uppercase tracking-wider text-emerald-400">
              Checkout that fits Bangladesh
            </span>
            <h2 className="font-display mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Get paid the way your customers pay
            </h2>
            <p className="text-emerald-200/70">
              No plugins to wire together — local payment methods come
              configured out of the box.
            </p>
          </div>

          <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-emerald-800/60 sm:grid-cols-2 lg:grid-cols-4">
            {PAYMENT_BAND.map((p, i) => (
              <div
                key={p.name}
                className={`p-7 ${
                  i !== PAYMENT_BAND.length - 1
                    ? "border-b border-emerald-800/60 sm:border-b-0 sm:border-r"
                    : ""
                } ${
                  i % 2 === 0 ? "border-b border-emerald-800/60 sm:border-b-0" : ""
                }`}
              >
                <div className="font-display mb-1.5 text-2xl font-bold text-emerald-400">
                  {p.name}
                </div>
                <div className="text-sm text-emerald-200/60">{p.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section id="contact" className="mx-auto max-w-6xl px-6 py-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 to-emerald-950 px-8 py-16 text-center">
            <h2 className="font-display relative mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Your shop, ready in days — not months.
            </h2>
            <p className="relative mx-auto mb-8 max-w-md text-emerald-100/80">
              Talk to us about moving your store to ComboStore. We'll walk
              you through setup, migration, and payment configuration.
            </p>
            <div className="relative flex flex-wrap justify-center gap-3">
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-6 py-3.5 text-sm font-semibold text-emerald-950 transition-transform hover:-translate-y-0.5"
              >
                Book a Demo <ArrowRight size={16} />
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-100/30 px-6 py-3.5 text-sm font-semibold text-stone-100 transition-colors hover:border-emerald-100"
              >
                Talk to Sales
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-emerald-800/60 px-6 py-14">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-10">
          <div className="max-w-xs">
            <div className="font-display flex items-center gap-2.5 text-lg font-bold tracking-tight">
              <span className="font-receipt flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-700 text-sm font-semibold text-emerald-950">
                CS
              </span>
              ComboStore
            </div>
            <p className="mt-3 text-sm text-emerald-200/60">
              Headless ecommerce for Bangladeshi sellers, built on WordPress
              and Next.js.
            </p>
          </div>

          <div className="flex flex-wrap gap-14">
            <div>
              <h4 className="font-receipt mb-3.5 text-xs uppercase tracking-wider text-emerald-200/50">
                Product
              </h4>
              <div className="flex flex-col gap-2.5 text-sm">
                <a href="#features" className="text-stone-100/85 hover:text-emerald-400">
                  Features
                </a>
                <a href="#how" className="text-stone-100/85 hover:text-emerald-400">
                  How it works
                </a>
                <a href="#ai" className="text-stone-100/85 hover:text-emerald-400">
                  AI Assistant
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-receipt mb-3.5 text-xs uppercase tracking-wider text-emerald-200/50">
                Payments
              </h4>
              <div className="flex flex-col gap-2.5 text-sm">
                <a href="#payments" className="text-stone-100/85 hover:text-emerald-400">
                  bKash
                </a>
                <a href="#payments" className="text-stone-100/85 hover:text-emerald-400">
                  Nagad
                </a>
                <a href="#payments" className="text-stone-100/85 hover:text-emerald-400">
                  Rocket
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-receipt mb-3.5 text-xs uppercase tracking-wider text-emerald-200/50">
                Company
              </h4>
              <div className="flex flex-col gap-2.5 text-sm">
                <a href="#contact" className="text-stone-100/85 hover:text-emerald-400">
                  Contact
                </a>
                <a href="#contact" className="text-stone-100/85 hover:text-emerald-400">
                  Book a Demo
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 flex max-w-6xl flex-wrap justify-between gap-3 border-t border-emerald-800/60 pt-6 text-xs text-emerald-200/50">
          <span>© 2026 ComboStore. Made for Bangladesh.</span>
          <span>Dhaka · Bangladesh</span>
        </div>
      </footer>
    </div>
  );
}
