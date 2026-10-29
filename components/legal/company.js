/*
  The one place the legal pages get their facts from.

  Terms of Service, Privacy Policy and Refunds all name the same entity,
  address, contact and jurisdiction, and a document that names the wrong one is
  worse than no document - so they are filled in here once rather than typed
  into three files.

  ─────────────────────────────────────────────────────────────────────────
  FILL THESE IN. Every value still wrapped in [SQUARE BRACKETS] is a
  placeholder, and `COMPANY_PLACEHOLDERS` below finds them: while any remain,
  all three pages render a visible "draft" banner saying the document is not
  final. Replace the brackets and the banner disappears by itself.
  ─────────────────────────────────────────────────────────────────────────
*/
export const COMPANY = {
  /* The registered entity that bills customers and is party to the terms. */
  legalName: "ComboStore",
  /* The product name. This one is not a placeholder. */
  tradingName: "ComboStore",
  /* Registered address, as it appears on the trade licence or incorporation. */
  address: "New Shalbon",
  city: "Rangpur",
  postcode: "5400",
  country: "Bangladesh",
  /* Company registration / trade licence number, if you have one to quote. */
  registration: "",
  /* Where support, privacy requests and refund requests are read. One address
     is fine - point all three at it if that is how you work. */
  supportEmail: "support@combostore.bd",
  privacyEmail: "support@combostore.bd",
  billingEmail: "support@combostore.bd",
  phone: "8801537034053",
  /* The law these documents are read under, and the courts that hear a
     dispute. */
  governingLaw: "Bangladesh",
  courts: "Rangpur, Bangladesh",
  website: "https://combostore.bd",
  /* The date the current wording takes effect. Bump it when you change the
     substance of any of the three documents, not for a typo. */
  effectiveDate: "29 October 2026",
};

/*
  The payment processor is named in all three documents - it is the entity on
  the customer's bank statement, the one that invoices and charges VAT, and the
  one a refund has to pass through - so it is stated once here too.
*/
export const PROCESSOR = {
  name: "Lemon Squeezy",
  /* Merchant of record: Lemon Squeezy sells the subscription to the customer
     and we are paid by Lemon Squeezy, which is why its name, not ours, is what
     a cardholder sees. Say so plainly rather than making people work it out
     from a statement line they do not recognise. */
  merchantOfRecord: true,
  privacyUrl: "https://www.lemonsqueezy.com/privacy",
  termsUrl: "https://www.lemonsqueezy.com/buyer-terms",
};

/* The customer's own accounts, named in the terms as things billed separately
   and governed by their own agreements. */
export const INFRASTRUCTURE = [
  { name: "Vercel", role: "hosts the storefront and dashboard the wizard deploys", url: "https://vercel.com/legal/terms" },
  { name: "WordPress hosting", role: "runs the Combo Store — Server plugin and holds the store's data", url: "" },
];

/*
  Which values are still unfilled. Derived rather than a hand-kept flag: a
  hand-kept one goes stale the moment someone fills in three fields out of
  four and forgets the banner.
*/
export const COMPANY_PLACEHOLDERS = Object.entries(COMPANY)
  .filter(([, value]) => typeof value === "string" && /\[.+\]/.test(value))
  .map(([key]) => key);

/* `[CITY], Bangladesh` reads badly while `[CITY]` is still a placeholder, so
   the parts are joined only when they are real. */
export const COMPANY_LOCATION = [COMPANY.city, COMPANY.postcode, COMPANY.country]
  .filter((part) => part && !/\[.+\]/.test(part))
  .join(", ");
