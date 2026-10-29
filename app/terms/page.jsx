import LegalPage, {
  Email,
  Item,
  List,
  Note,
  Out,
  P,
  SubHeading,
  Term,
  In,
} from "@/components/legal/LegalPage";
import { COMPANY, COMPANY_LOCATION, PROCESSOR } from "@/components/legal/company";

export const metadata = {
  title: "Terms of Service · ComboStore",
  description:
    "The agreement between ComboStore and the merchants who run their stores on it: plans, billing, what each side is responsible for, and the limits of both.",
};

/*
  ComboStore's own terms, written around the one fact that shapes every clause:
  the software runs on the customer's infrastructure, not ours. Their WordPress
  install holds the data, their Vercel project serves the storefront, their
  payment gateway agreements take the money from their shoppers. So these terms
  grant a licence and promise maintenance and support - they do not promise an
  uptime we have no way to deliver, and they are careful not to imply we are a
  party to the customer's own sales.
*/
const SECTIONS = [
  {
    id: "who-we-are",
    heading: "Who these terms are between",
    content: (
      <>
        <P>
          These terms are an agreement between {COMPANY.legalName}
          {COMPANY_LOCATION ? `, ${COMPANY_LOCATION}` : ""} (
          <Term>“we”</Term>, <Term>“us”</Term>), which operates{" "}
          {COMPANY.tradingName}, and the person or business that subscribes to
          it (<Term>“you”</Term>). They cover the {COMPANY.tradingName} website,
          the subscription plans, the onboarding wizard, and the software we
          licence to you.
        </P>
        <P>
          By subscribing to a plan, deploying {COMPANY.tradingName}, or using
          any part of it, you accept these terms. If you are agreeing on behalf
          of a company, you confirm you are allowed to bind it.
        </P>
        <Note>
          Registered as {COMPANY.registration}. Written notice reaches us at{" "}
          <Email address={COMPANY.supportEmail} /> or at {COMPANY.address}
          {COMPANY_LOCATION ? `, ${COMPANY_LOCATION}` : ""}.
        </Note>
      </>
    ),
  },
  {
    id: "the-service",
    heading: "What ComboStore is, and what it is not",
    content: (
      <>
        <P>
          {COMPANY.tradingName} is a headless commerce platform. We licence you
          software in two halves: WordPress plugins that hold your catalogue,
          orders and customers and expose them over a REST API, and a Next.js
          application that serves your storefront and an admin dashboard. The
          onboarding wizard creates a project on your own Vercel account from
          our repository and points it at your own WordPress install.
        </P>
        <P>
          That architecture decides who is responsible for what, so it is worth
          being blunt about the parts we do <Term>not</Term> provide:
        </P>
        <List>
          <Item>
            <Term>Hosting.</Term> Your Vercel account and your WordPress hosting
            are yours, contracted with and billed by those providers under their
            own terms. Our plan prices do not include them.
          </Item>
          <Item>
            <Term>Domains and DNS.</Term> You register and point your own domain.
            Until its records reach Vercel, nothing we deploy will resolve.
          </Item>
          <Item>
            <Term>Payment gateways for your shoppers.</Term> bKash, Nagad,
            Rocket, cash on delivery and any card gateway are agreements between
            you and those providers. We integrate with them; we never hold or
            move your shoppers' money.
          </Item>
          <Item>
            <Term>Couriers and logistics.</Term> Integrations are built to the
            couriers' APIs under your own accounts with them.
          </Item>
        </List>
        <P>
          We may change, add or withdraw features. If we withdraw something you
          depend on, we will say so by email before it happens where we can.
        </P>
      </>
    ),
  },
  {
    id: "accounts-tokens",
    heading: "Your account, your API token",
    content: (
      <>
        <P>
          Keep your dashboard credentials and your store's API token to
          yourself. The onboarding wizard generates that token in your browser,
          shows it once, writes it into your Vercel project's environment
          variables, and offers it as an <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px]">.env</code>{" "}
          download — after that we cannot show it to you again, because we never
          had a copy.
        </P>
        <P>
          You are responsible for everything done through your account or with
          that token, including by your staff. Tell us promptly at{" "}
          <Email address={COMPANY.supportEmail} /> if you think either has
          leaked, and regenerate the token from your own deployment.
        </P>
      </>
    ),
  },
  {
    id: "plans-billing",
    heading: "Plans, trial and billing",
    content: (
      <>
        <P>
          Plans and their limits are as published on our pricing page. Starter
          covers one website and up to 300 products; Business covers up to five
          websites with unlimited products; Enterprise is scoped and priced per
          agreement. Every plan includes all business modules — we do not
          licence features individually or take a commission on your orders.
        </P>
        <SubHeading>Trial</SubHeading>
        <P>
          Every plan starts with a 14-day trial. You can stop within the trial
          and owe nothing.
        </P>
        <SubHeading>Who charges you</SubHeading>
        <P>
          Subscriptions are sold and charged through {PROCESSOR.name}, which
          acts as merchant of record. {PROCESSOR.name} is the name you will see
          on your statement, and it issues your invoice and handles any tax it
          is required to collect. Its{" "}
          <Out href={PROCESSOR.termsUrl}>buyer terms</Out> apply to the payment
          itself alongside these terms. We never see or store your card
          details.
        </P>
        <SubHeading>Prices</SubHeading>
        <P>
          Published prices exclude VAT and any other tax, which is added at
          checkout where it applies. Fees recur for the billing period you
          chose until you cancel. We may change prices for future periods with
          at least 30 days' notice by email; the price of a period you have
          already paid for does not change.
        </P>
        <P>
          If a payment fails, we may suspend updates and support until it
          clears. Refunds are covered by our <In href="/refund">Refund Policy</In>.
        </P>
      </>
    ),
  },
  {
    id: "your-store",
    heading: "Your store is yours",
    content: (
      <>
        <P>
          You are the merchant in every sale you make. Your products, prices,
          descriptions, images, delivery promises, returns handling and customer
          service are yours, as are the legal duties that come with selling:
          consumer law, product compliance, tax, and your own published policies
          to your shoppers.
        </P>
        <P>
          We are not a party to those sales and we do not take payment for them.
          A dispute between you and one of your shoppers — a refund, a late
          delivery, a chargeback — is between the two of you and your gateway or
          courier.
        </P>
        <Note>
          A refund you owe one of your own shoppers is not a refund of your
          {" "}{COMPANY.tradingName} subscription, and the reverse is also true.
          The two are unrelated.
        </Note>
      </>
    ),
  },
  {
    id: "your-data",
    heading: "Your data and your content",
    content: (
      <>
        <P>
          Your catalogue, orders, customers and content stay yours. They live in
          your WordPress install, on hosting you control — not in a database of
          ours — so you can export or delete them at any time without asking us.
        </P>
        <P>
          You grant us only the access we need to do what you have asked for:
          deploying your project, and looking at something with you when you
          raise a support request. What we hold about you as a customer, and
          why, is set out in our <In href="/privacy">Privacy Policy</In>.
        </P>
      </>
    ),
  },
  {
    id: "acceptable-use",
    heading: "Acceptable use",
    content: (
      <>
        <P>You agree not to use {COMPANY.tradingName} to:</P>
        <List>
          <Item>
            sell what you are not allowed to sell where you sell it, or run a
            store designed to defraud shoppers;
          </Item>
          <Item>
            infringe anyone's intellectual property, or publish content that is
            unlawful, defamatory or obscene;
          </Item>
          <Item>
            resell, sublicense or redistribute the software itself as a product
            of your own, or run more websites on a plan than it allows;
          </Item>
          <Item>
            remove or obscure licence or attribution notices in the code, or
            work around a plan's technical limits;
          </Item>
          <Item>
            attack, overload or probe our systems or anyone else's, or use the
            platform to send unsolicited bulk messages.
          </Item>
        </List>
        <P>
          We may suspend an account that is doing serious or repeated harm. We
          will tell you why, and give you a chance to put it right where the
          circumstances allow.
        </P>
      </>
    ),
  },
  {
    id: "third-parties",
    heading: "Third-party services",
    content: (
      <>
        <P>
          {COMPANY.tradingName} depends on services we do not run. Vercel serves
          your project; your WordPress host runs the server side;{" "}
          {PROCESSOR.name} takes subscription payments; couriers, payment
          gateways and AI providers each have their own terms, prices and
          availability.
        </P>
        <P>
          Your use of those services is governed by your agreements with them.
          We are not responsible for their outages, pricing changes or decisions
          about your account, though we will help you work around them where we
          reasonably can.
        </P>
      </>
    ),
  },
  {
    id: "ai-features",
    heading: "AI features",
    content: (
      <>
        <P>
          Where {COMPANY.tradingName} offers AI assistance — product
          descriptions, translations, summaries, suggestions — treat the output
          as a draft. It can be wrong, out of date, or unsuitable for your
          catalogue, and it is generated by a model we do not control.
        </P>
        <P>
          You are responsible for what you publish. Check anything that carries
          a legal or factual claim: pricing, measurements, ingredients, safety
          or compliance text, and anything a shopper might rely on.
        </P>
      </>
    ),
  },
  {
    id: "licence",
    heading: "Licence and intellectual property",
    content: (
      <>
        <P>
          While your subscription is active and paid, you may install, run and
          modify {COMPANY.tradingName} for the number of websites your plan
          allows. The software, its source, our name and our branding remain
          ours, along with any improvement we make to the platform.
        </P>
        <P>
          Modifications you write for your own store are yours. If you send us a
          fix or suggestion, you allow us to use it in the product without owing
          you anything for it.
        </P>
        <P>
          When your subscription ends, the code you have already deployed does
          not stop working — it is on your own infrastructure — but your right
          to new versions, updates and support ends with it.
        </P>
      </>
    ),
  },
  {
    id: "support",
    heading: "Support and availability",
    content: (
      <>
        <P>
          Support comes with your plan at the level published on the pricing
          page: email on Starter, priority phone and WhatsApp on Business, and a
          named contact with an uptime commitment on Enterprise.
        </P>
        <P>
          We keep our own website and services up as best we reasonably can, but
          we do not promise uninterrupted availability and we give no uptime
          guarantee outside an Enterprise agreement that says otherwise. Your
          storefront's uptime is a matter for your hosting providers.
        </P>
      </>
    ),
  },
  {
    id: "termination",
    heading: "Cancelling and ending the agreement",
    content: (
      <>
        <P>
          You can cancel at any time. Your plan then runs to the end of the
          period you have paid for and does not renew; see the{" "}
          <In href="/refund">Refund Policy</In> for what is refundable.
        </P>
        <P>
          We may end this agreement if you break these terms materially and do
          not fix it within 14 days of being asked, if your payments stop, or if
          we stop offering {COMPANY.tradingName} altogether — in which case we
          will give you as much notice as we can and refund the unused part of
          any period you have paid for.
        </P>
        <P>
          Because your store runs on your own infrastructure, ending the
          agreement does not switch it off. Updates, support and the right to
          use new versions stop.
        </P>
      </>
    ),
  },
  {
    id: "warranties",
    heading: "Warranties and what we do not promise",
    content: (
      <>
        <P>
          We provide {COMPANY.tradingName} with reasonable skill and care. Past
          that, and to the extent the law allows, it is provided{" "}
          <Term>as is</Term>: we do not warrant that it is free of bugs, that it
          will suit a particular purpose of yours, that it will keep working
          unchanged with every third-party service it touches, or that using it
          will produce any particular commercial result.
        </P>
        <P>
          Nothing here excludes a liability that cannot lawfully be excluded,
          including for death or personal injury caused by negligence, or for
          fraud.
        </P>
      </>
    ),
  },
  {
    id: "liability",
    heading: "Limitation of liability",
    content: (
      <>
        <P>
          Neither of us is liable to the other for lost profit, lost revenue,
          lost or corrupted data, lost goodwill, or any indirect or
          consequential loss, however it arises.
        </P>
        <P>
          Our total liability to you for all claims connected to{" "}
          {COMPANY.tradingName} is limited to the subscription fees you paid us
          in the 12 months before the claim arose.
        </P>
        <Note>
          Keep your own backups. Your store's data lives on your hosting, which
          means its safety depends on your provider and your backup routine, not
          on us.
        </Note>
      </>
    ),
  },
  {
    id: "indemnity",
    heading: "Indemnity",
    content: (
      <>
        <P>
          You will cover us against claims, losses and reasonable costs arising
          from what you sell, what you publish, how you handle your shoppers'
          data, or your breach of these terms. We will tell you promptly about
          any such claim and let you take part in defending it.
        </P>
      </>
    ),
  },
  {
    id: "changes",
    heading: "Changes to these terms",
    content: (
      <>
        <P>
          We may update these terms. If a change materially affects your rights,
          we will email the address on your account at least 30 days before it
          takes effect, and the effective date at the top of this page will
          change. Carrying on using {COMPANY.tradingName} after that date means
          you accept the new wording; if you would rather not, cancel before it.
        </P>
      </>
    ),
  },
  {
    id: "governing-law",
    heading: "Governing law and disputes",
    content: (
      <>
        <P>
          These terms are governed by the laws of {COMPANY.governingLaw}, and the
          courts of {COMPANY.courts} have exclusive jurisdiction over any
          dispute — without affecting any right you have as a consumer to bring
          a claim where you live.
        </P>
        <P>
          Before going to court, please write to{" "}
          <Email address={COMPANY.supportEmail} />. Most disputes turn out to be
          a misunderstanding about a plan limit or an invoice, and are settled
          in a day.
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
        </P>
        <List>
          <Item>
            General and support: <Email address={COMPANY.supportEmail} />
          </Item>
          <Item>
            Billing: <Email address={COMPANY.billingEmail} />
          </Item>
          <Item>Phone: {COMPANY.phone}</Item>
        </List>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      current="terms"
      title="Terms of Service"
      summary={`The agreement between you and ${COMPANY.tradingName}. The short version: we licence you the software and keep it maintained, you run your store on your own hosting and remain the merchant in your own sales, and each of us is responsible for the half we control.`}
      sections={SECTIONS}
    />
  );
}
