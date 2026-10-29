import LegalPage, {
  Email,
  In,
  Item,
  List,
  Note,
  Out,
  P,
  SubHeading,
  Term,
} from "@/components/legal/LegalPage";
import { COMPANY, COMPANY_LOCATION, PROCESSOR } from "@/components/legal/company";

export const metadata = {
  title: "Privacy Policy · ComboStore",
  description:
    "What ComboStore collects about the merchants who subscribe to it, why, who it is shared with, and how long it is kept — and why your shoppers' data never reaches us.",
};

/*
  The distinction this policy has to make early and keep making: there are two
  sets of people whose data is in play, and we only hold one of them.

    - Merchants who subscribe to ComboStore. We hold their contact details,
      their store's domain, their plan and their order metadata. This policy is
      about them.
    - Their shoppers. That data lives in the merchant's own WordPress install
      and their own payment gateways. We are not a processor for it, because it
      never reaches us.

  Everything claimed here is traceable to something the code actually does:
  the onboarding wizard's contact fields, `record_subscription`, the generated
  API token, the `combostore.locale` key in localStorage, the JWT the dashboard
  signs in with. If a claim here cannot be pointed at a line of code or a named
  provider, it does not belong in a privacy policy.
*/
const SECTIONS = [
  {
    id: "scope",
    heading: "Who this covers, and who it does not",
    content: (
      <>
        <P>
          This policy explains what {COMPANY.legalName} does with personal data
          as the operator of {COMPANY.tradingName}: the website at{" "}
          {COMPANY.website}, the onboarding wizard, and your subscription with
          us.
        </P>
        <P>
          It does not cover the people who shop at the stores our customers run.
          Because {COMPANY.tradingName} is deployed onto the merchant's own
          WordPress install and their own Vercel project, their customers'
          names, addresses, orders and payment records stay in their systems —{" "}
          <Term>we have no copy and no access</Term>. If you are a shopper
          looking for a store's privacy policy, it is published by that store,
          not by us.
        </P>
        <Note>
          If you are a merchant, this also means the duty to publish a privacy
          policy to your own shoppers, and to answer their data requests, is
          yours. We cannot answer them for you; the data is not ours to reach.
        </Note>
      </>
    ),
  },
  {
    id: "what-we-collect",
    heading: "What we collect",
    content: (
      <>
        <SubHeading>Details you give us when you sign up or deploy</SubHeading>
        <P>
          The onboarding wizard asks for the store owner's name and email
          address, which are required, and a phone number and postal address,
          which are optional. It also records the store's domain, the Vercel
          project name and the plan chosen. These travel with the deployment
          record so that support and billing can tell one store from another.
        </P>
        <SubHeading>Billing details</SubHeading>
        <P>
          Subscription payments go through {PROCESSOR.name} as merchant of
          record. You enter your card details on their checkout, not ours — we
          never receive them. What comes back to us is order metadata: the order
          number and reference, a customer id, the plan and variant bought, the
          amount, the email used, and whether it was a test order.
        </P>
        <SubHeading>Credentials</SubHeading>
        <P>
          Your store's API token is generated in your own browser during
          onboarding and written into your Vercel project. We do not receive or
          store it. Your Vercel access token, which the wizard needs to create
          the project, is used by your browser to call Vercel's API directly and
          is not sent to us either.
        </P>
        <SubHeading>Support correspondence</SubHeading>
        <P>
          Emails, chat and call notes, and anything you choose to attach — a
          screenshot, a log, an export — for as long as we need them to deal
          with the issue and to understand recurring faults.
        </P>
        <SubHeading>Technical data</SubHeading>
        <P>
          Our servers log the usual request data — IP address, user agent, the
          page requested, the time — to keep the service secure and working.
          Your browser also keeps your chosen language in local storage under{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px]">
            combostore.locale
          </code>
          , and a sign-in token while you are logged into a dashboard. Both stay
          on your device.
        </P>
      </>
    ),
  },
  {
    id: "why",
    heading: "Why we use it",
    content: (
      <>
        <List>
          <Item>
            <Term>To give you what you subscribed to</Term> — create your
            project, deploy it to your domain, keep your plan and its limits
            straight, and answer your support requests. This is to perform our
            contract with you.
          </Item>
          <Item>
            <Term>To take payment</Term> and to tie an order to the right store,
            raise invoices and handle refunds. Also contractual.
          </Item>
          <Item>
            <Term>To keep the service safe and working</Term> — spotting abuse,
            debugging failures, preventing fraud. This is our legitimate
            interest, balanced against your privacy.
          </Item>
          <Item>
            <Term>To tell you things you need to know</Term> — a breaking change,
            a price change, a security notice. Service messages, not marketing.
          </Item>
          <Item>
            <Term>To send you product news</Term>, only if you have asked for it.
            Every such email has an unsubscribe link, and unsubscribing does not
            stop the service messages above.
          </Item>
          <Item>
            <Term>To meet legal duties</Term> — tax records, accounting, and
            responding to lawful requests.
          </Item>
        </List>
      </>
    ),
  },
  {
    id: "sharing",
    heading: "Who we share it with",
    content: (
      <>
        <P>
          We do not sell personal data and we do not share it for anyone else's
          advertising. We use these providers to run the service, and they
          receive only what their job requires:
        </P>
        <List>
          <Item>
            <Out href="https://vercel.com/legal/privacy-policy">Vercel</Out> —
            hosts our site, and is where your own project is created under your
            account.
          </Item>
          <Item>
            <Out href={PROCESSOR.privacyUrl}>{PROCESSOR.name}</Out> — sells and
            charges the subscription as merchant of record, and runs its own
            scripts on its checkout overlay. Its privacy policy governs what it
            collects there.
          </Item>
          <Item>
            Email and support tooling, to receive and answer your messages.
          </Item>
          <Item>
            AI providers, where you use an AI feature — the text you submit for
            that feature is sent to the model to answer it. We do not send them
            your customer records.
          </Item>
          <Item>
            Professional advisers, and authorities where the law requires it.
          </Item>
        </List>
        <P>
          If the business is ever sold or reorganised, customer records may pass
          to the buyer, who would be bound by a policy no weaker than this one.
        </P>
      </>
    ),
  },
  {
    id: "transfers",
    heading: "Where your data goes",
    content: (
      <>
        <P>
          We are based in {COMPANY.country}, and several of the providers above
          operate outside it, which means some of your data is processed abroad.
          Where we send personal data out of {COMPANY.country} we rely on the
          provider's own contractual safeguards and keep what is sent to the
          minimum the service needs.
        </P>
      </>
    ),
  },
  {
    id: "retention",
    heading: "How long we keep it",
    content: (
      <>
        <List>
          <Item>
            <Term>Account and deployment records</Term> — while your
            subscription is active, and for up to 24 months after it ends, so we
            can help if you come back or query an old invoice.
          </Item>
          <Item>
            <Term>Billing and tax records</Term> — for as long as tax and
            accounting law requires, typically six years.
          </Item>
          <Item>
            <Term>Support correspondence</Term> — up to 24 months after the
            issue is closed.
          </Item>
          <Item>
            <Term>Server logs</Term> — a short rolling window, normally no more
            than 90 days, unless a log is part of investigating an incident.
          </Item>
        </List>
        <P>
          After that we delete it or strip it of anything that identifies you.
        </P>
      </>
    ),
  },
  {
    id: "your-rights",
    heading: "Your rights",
    content: (
      <>
        <P>You can ask us to:</P>
        <List>
          <Item>tell you what we hold about you, and give you a copy;</Item>
          <Item>correct it, if it is wrong or out of date;</Item>
          <Item>
            delete it, where we do not have to keep it for tax, accounting or
            legal reasons;
          </Item>
          <Item>stop using it for something you object to;</Item>
          <Item>
            withdraw a consent you gave — for marketing, for example — at any
            time.
          </Item>
        </List>
        <P>
          Write to <Email address={COMPANY.privacyEmail} />. We answer within 30
          days, and we may need to confirm who you are first so that we do not
          hand your records to someone else.
        </P>
        <Note>
          Deleting your records with us does not delete your store. Your
          catalogue, orders and customers are in your own WordPress install, and
          removing them is something you do there — or ask your host to do.
        </Note>
      </>
    ),
  },
  {
    id: "cookies",
    heading: "Cookies and local storage",
    content: (
      <>
        <P>
          Our site does not run advertising or cross-site tracking cookies. What
          it does keep is functional:
        </P>
        <List>
          <Item>
            your language choice, in local storage under{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px]">
              combostore.locale
            </code>
            , so the site opens in the language you picked;
          </Item>
          <Item>
            a sign-in token while you are logged into a dashboard, so you are
            not asked for your password on every page.
          </Item>
        </List>
        <P>
          The {PROCESSOR.name} checkout overlay is their page inside ours and
          sets its own cookies under their policy. Clearing your browser's site
          data removes everything we keep on your device; the site still works,
          and opens in English.
        </P>
      </>
    ),
  },
  {
    id: "security",
    heading: "How we protect it",
    content: (
      <>
        <P>
          Traffic to our site and APIs is encrypted in transit. Access to
          customer records is limited to the people who need it to do their job.
          Card details never reach us, and your store's API token is generated
          on your device and shown once — which is inconvenient by design, and
          the reason the wizard offers you a file to keep.
        </P>
        <P>
          No system is perfectly secure. If a breach affects your personal data
          we will tell you and any regulator we must, without undue delay, and
          say what we know and what we are doing about it.
        </P>
      </>
    ),
  },
  {
    id: "children",
    heading: "Children",
    content: (
      <>
        <P>
          {COMPANY.tradingName} is a business tool and is not intended for
          children. We do not knowingly collect data from anyone under 18. If
          you believe a child has given us personal data, write to{" "}
          <Email address={COMPANY.privacyEmail} /> and we will delete it.
        </P>
      </>
    ),
  },
  {
    id: "changes",
    heading: "Changes to this policy",
    content: (
      <>
        <P>
          When this policy changes, the effective date at the top of the page
          changes with it. If a change materially affects how we use your data,
          we will email the address on your account rather than relying on you
          noticing a new date.
        </P>
      </>
    ),
  },
  {
    id: "contact",
    heading: "Contact",
    content: (
      <>
        <P>
          {COMPANY.legalName}
          {COMPANY_LOCATION ? ` · ${COMPANY_LOCATION}` : ""}
          {COMPANY.address ? ` · ${COMPANY.address}` : ""}
        </P>
        <List>
          <Item>
            Privacy and data requests: <Email address={COMPANY.privacyEmail} />
          </Item>
          <Item>
            Anything else: <Email address={COMPANY.supportEmail} />
          </Item>
        </List>
        <P>
          See also our <In href="/terms">Terms of Service</In> and{" "}
          <In href="/refund">Refund Policy</In>.
        </P>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      current="privacy"
      title="Privacy Policy"
      summary={`What ${COMPANY.tradingName} does with your data as a subscriber. The short version: we hold your contact details, your store's domain and your billing records, and almost nothing else — your shoppers' data stays in your own WordPress install, where we cannot reach it.`}
      sections={SECTIONS}
    />
  );
}
