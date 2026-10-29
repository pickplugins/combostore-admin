import Link from "next/link";
import { AlertTriangle, ArrowLeft, Mail } from "lucide-react";

import { COMPANY, COMPANY_PLACEHOLDERS } from "./company";

/*
  Shared frame for the three legal documents: Terms of Service, Privacy Policy
  and Refunds.

  They are server components - nothing here is interactive, and a legal page is
  the one part of this site that should still be readable, printable and
  indexable with JavaScript switched off. That is also why each page exports
  its own `metadata`: the root layout is a client component and cannot.

  ENGLISH ONLY, deliberately. The landing page is bilingual through
  `components/i18n.jsx`, but a machine-translated contract is a liability
  rather than a courtesy: the Bangla wording of a limitation of liability needs
  a person who can be held to it. The footer links to these pages stay
  translated; the documents themselves do not. If they are ever translated,
  both versions need a stated order of precedence - add it here.

  `globals.css` styles bare `button`, `input` and `table` with unlayered rules
  that outrank utilities, so this page uses none of them: every control is a
  link. It also paints `body` from a `prefers-color-scheme` variable, so the
  background and text colour are set explicitly here rather than inherited.
*/

/* Content primitives, so a page is readable as prose rather than as a wall of
   class attributes. */

export function P({ children }) {
  return <p className="mb-4 text-[15px] leading-relaxed text-zinc-700">{children}</p>;
}

export function List({ children }) {
  return <ul className="mb-4 space-y-2">{children}</ul>;
}

export function Item({ children }) {
  return (
    <li className="flex gap-2.5 text-[15px] leading-relaxed text-zinc-700">
      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-500" />
      <span className="min-w-0">{children}</span>
    </li>
  );
}

export function SubHeading({ children }) {
  return (
    <h3 className="mb-2 mt-6 text-sm font-semibold tracking-tight text-zinc-900">
      {children}
    </h3>
  );
}

/* A pulled-out paragraph for the thing in a section most likely to be skipped
   over and then argued about. */
export function Note({ children }) {
  return (
    <p className="mb-4 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-[13px] leading-relaxed text-zinc-600">
      {children}
    </p>
  );
}

export function Term({ children }) {
  return <strong className="font-semibold text-zinc-900">{children}</strong>;
}

export function Email({ address, children }) {
  return (
    <a
      href={`mailto:${address}`}
      className="font-medium text-emerald-700 underline decoration-emerald-200 underline-offset-2 hover:decoration-emerald-500">
      {children || address}
    </a>
  );
}

export function Out({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-medium text-emerald-700 underline decoration-emerald-200 underline-offset-2 hover:decoration-emerald-500">
      {children}
    </a>
  );
}

export function In({ href, children }) {
  return (
    <Link
      href={href}
      className="font-medium text-emerald-700 underline decoration-emerald-200 underline-offset-2 hover:decoration-emerald-500">
      {children}
    </Link>
  );
}

const DOCUMENTS = [
  { key: "terms", href: "/terms", label: "Terms of Service" },
  { key: "privacy", href: "/privacy", label: "Privacy Policy" },
  { key: "refund", href: "/refund", label: "Refund Policy" },
];

function Logo() {
  return (
    <span className="flex items-center gap-2.5 text-[17px] font-semibold tracking-tight text-zinc-900">
      <span className="flex size-8 items-center justify-center rounded-xl bg-emerald-600 text-[13px] font-bold text-white">
        CS
      </span>
      ComboStore
    </span>
  );
}

/*
  While any value in `company.js` is still a placeholder the document says so,
  at the top, where nobody can miss it. A half-filled contract that looks
  finished is the failure mode worth shouting about: these pages are the ones a
  payment processor, a customer and a court all read.
*/
function DraftBanner() {
  if (!COMPANY_PLACEHOLDERS.length) return null;

  return (
    <div className="mb-8 rounded-2xl border border-amber-300 bg-amber-50 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle size={17} className="mt-0.5 shrink-0 text-amber-600" />
        <div className="min-w-0 text-[13px] leading-relaxed text-amber-900">
          <p className="font-semibold">Draft — not in force yet</p>
          <p className="mt-1">
            This document still has {COMPANY_PLACEHOLDERS.length} unfilled
            detail{COMPANY_PLACEHOLDERS.length === 1 ? "" : "s"} (
            {COMPANY_PLACEHOLDERS.join(", ")}) and has not been reviewed by a
            lawyer. Fill them in at{" "}
            <code className="rounded bg-amber-100 px-1.5 py-0.5 text-[11px]">
              components/legal/company.js
            </code>{" "}
            and have the wording checked before relying on it or pointing a
            payment processor at it. This notice removes itself.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LegalPage({ title, summary, sections, current }) {
  const others = DOCUMENTS.filter((doc) => doc.key !== current);

  return (
    <div
      className="min-h-screen w-full bg-white text-zinc-900 antialiased"
      style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}>

      <header className="border-b border-zinc-200">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-6 py-5">
          <Link href="/" aria-label="ComboStore home">
            <Logo />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-emerald-700">
            <ArrowLeft size={15} />
            Back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <DraftBanner />

        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          {title}
        </h1>

        <p className="mt-3 text-sm text-zinc-500">
          {COMPANY.tradingName}
          {COMPANY_PLACEHOLDERS.includes("legalName")
            ? ""
            : `, operated by ${COMPANY.legalName}`}{" "}
          · Effective {COMPANY.effectiveDate}
        </p>

        <p className="mt-6 text-base leading-relaxed text-zinc-600">{summary}</p>

        {/* Plain anchors, not a sticky sidebar: these documents are read on a
            phone, printed, and sent as a PDF attachment at least as often as
            they are browsed. */}
        <nav aria-label="On this page" className="mt-10 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
          <p className="mb-3 text-xs font-semibold tracking-wider text-zinc-400">
            ON THIS PAGE
          </p>
          <ol className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {sections.map((section, i) => (
              <li key={section.id} className="flex gap-2 text-sm">
                <span className="w-5 shrink-0 text-right text-zinc-400 tabular-nums">
                  {i + 1}.
                </span>
                <a
                  href={`#${section.id}`}
                  className="text-zinc-700 hover:text-emerald-700 hover:underline">
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-12">
          {sections.map((section, i) => (
            <section key={section.id} id={section.id} className="mb-10 scroll-mt-6">
              <h2 className="mb-3 text-lg font-semibold tracking-tight text-zinc-900">
                <span className="mr-2 text-zinc-300 tabular-nums">{i + 1}</span>
                {section.heading}
              </h2>
              {section.content}
            </section>
          ))}
        </div>

        <div className="mt-14 border-t border-zinc-200 pt-8">
          <h2 className="text-sm font-semibold tracking-tight text-zinc-900">
            Questions about this document
          </h2>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-[15px] text-zinc-700">
            <Mail size={15} className="shrink-0 text-zinc-400" />
            <Email address={COMPANY.supportEmail} />
          </p>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {others.map((doc) => (
              <In key={doc.key} href={doc.href}>
                {doc.label}
              </In>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-3xl px-6 py-8 text-xs text-zinc-500">
          © 2026 {COMPANY.tradingName}. Effective {COMPANY.effectiveDate}.
        </div>
      </footer>

    </div>
  );
}
