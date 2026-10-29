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
  title: "Refund Policy · ComboStore",
  description:
    "ComboStore's refund terms: a 14-day trial, a 14-day money-back window on your first payment, and cancel-anytime after that — plus what is never refundable, and why.",
};

/*
  The policy in one line: 14-day trial, then 14 days to change your mind about
  the first payment, then cancel-anytime with the paid period running out.

  Two boundaries this page exists to draw, because both come up as support
  tickets:

    - Hosting is not ours to refund. Vercel and WordPress hosting are the
      customer's own contracts, and a plan fee refund does not touch them.
    - A refund the merchant owes their own shopper has nothing to do with their
      ComboStore subscription. Different money, different contract.
*/
const SECTIONS = [
  {
    id: "summary",
    heading: "The short version",
    content: (
      <>
        <List>
          <Item>
            <Term>14-day trial on every plan.</Term> Nothing is charged during
            it, so there is nothing to refund.
          </Item>
          <Item>
            <Term>14 days to change your mind about your first payment.</Term>{" "}
            Ask within 14 days of that charge and you get all of it back, no
            reason needed.
          </Item>
          <Item>
            <Term>Cancel whenever you like after that.</Term> Your plan runs to
            the end of the period you have paid for and does not renew. We do
            not refund part-used periods.
          </Item>
          <Item>
            <Term>Hosting, domains and gateway fees are not ours.</Term> They
            are billed by Vercel, your WordPress host, your registrar and your
            payment providers, under their own refund rules.
          </Item>
        </List>
      </>
    ),
  },
  {
    id: "trial",
    heading: "The trial comes first",
    content: (
      <>
        <P>
          Every plan starts with a 14-day trial, and that is the window to find
          out whether {COMPANY.tradingName} fits your catalogue, your couriers
          and your payment rails. Deploy a real store, import real products,
          take a test order through bKash or cash on delivery — the trial is not
          a demo.
        </P>
        <P>
          If you stop before the trial ends, you are not charged and there is
          nothing to claim back.
        </P>
      </>
    ),
  },
  {
    id: "money-back",
    heading: "14-day money-back on your first payment",
    content: (
      <>
        <P>
          If your first paid period turns out not to work for you, write to{" "}
          <Email address={COMPANY.billingEmail} /> within{" "}
          <Term>14 days of that first charge</Term> and we will refund it in
          full. You do not have to give a reason, though telling us what went
          wrong genuinely helps.
        </P>
        <P>
          This applies once per customer, to the first payment on your account —
          whether it was a monthly or an annual one. Later renewals are covered
          by the cancellation rules below rather than by this window.
        </P>
        <Note>
          Annual plans are not an exception: if you paid for a year and ask
          within 14 days of that charge, the whole year comes back, not a
          month's worth.
        </Note>
      </>
    ),
  },
  {
    id: "after-14-days",
    heading: "After the 14 days: cancel anytime",
    content: (
      <>
        <P>
          Cancel whenever you want. Your subscription stays active until the end
          of the period you have already paid for, and then stops renewing — so
          cancelling three days into a month does not switch your store off
          three days in.
        </P>
        <P>
          We do not refund the remainder of a period that has started, and we do
          not refund earlier periods you used. There is no penalty or notice
          period for cancelling, and no minimum term outside an Enterprise
          agreement that says otherwise.
        </P>
      </>
    ),
  },
  {
    id: "how-to-ask",
    heading: "How to cancel or ask for a refund",
    content: (
      <>
        <SubHeading>To cancel</SubHeading>
        <P>
          Use the link in any {PROCESSOR.name} receipt email to manage your
          subscription, or write to <Email address={COMPANY.billingEmail} /> and
          we will do it for you. Ask us at least 48 hours before a renewal date
          so it does not go through while we are reading your email.
        </P>
        <SubHeading>To ask for a refund</SubHeading>
        <P>
          Email <Email address={COMPANY.billingEmail} /> from the address on the
          account, with the order number from your receipt and your store's
          domain. We answer within 3 working days.
        </P>
        <SubHeading>When the money arrives</SubHeading>
        <P>
          Approved refunds go back through {PROCESSOR.name} to the card or
          account that paid, because that is where the charge came from — we
          cannot send it anywhere else. {PROCESSOR.name} releases it within a few
          days; your bank then takes its own time, usually 5 to 10 working days,
          and for some local card issuers longer. Any tax collected is refunded
          with it.
        </P>
      </>
    ),
  },
  {
    id: "not-refundable",
    heading: "What is not refundable",
    content: (
      <>
        <List>
          <Item>
            <Term>Hosting and infrastructure.</Term> Your Vercel usage and your
            WordPress hosting are your own contracts, billed by those providers
            and never by us. Cancelling with us does not cancel them — do that
            yourself, or you will keep paying for them.
          </Item>
          <Item>
            <Term>Domains.</Term> Registrations and renewals are rarely
            refundable by anyone, and they are bought from your registrar.
          </Item>
          <Item>
            <Term>Payment gateway and courier fees</Term> that bKash, Nagad,
            Rocket, a card gateway or a courier has charged you on your own
            orders.
          </Item>
          <Item>
            <Term>Custom work.</Term> Migration, integrations, training and
            Enterprise onboarding are refundable only as the written agreement
            covering that work says.
          </Item>
          <Item>
            <Term>Periods that have already run</Term>, and the unused part of
            the period you are in when you cancel.
          </Item>
        </List>
      </>
    ),
  },
  {
    id: "your-shoppers",
    heading: "Refunds to your own shoppers",
    content: (
      <>
        <P>
          This page is only about your {COMPANY.tradingName} subscription. When
          one of <Term>your</Term> customers wants their money back for
          something they bought in your store, that refund is yours to make,
          through your own payment gateway and under your own store's published
          policy. We never held that money, so we cannot return it.
        </P>
        <P>
          Your store needs its own refund and returns policy, written for your
          shoppers — your payment providers will expect one, and so will
          consumer law.
        </P>
      </>
    ),
  },
  {
    id: "exceptions",
    heading: "When we refund outside this policy",
    content: (
      <>
        <P>We will put it right regardless of the windows above if:</P>
        <List>
          <Item>
            you were charged twice for the same period, or charged after a
            cancellation we had confirmed;
          </Item>
          <Item>
            a fault on our side left the platform unusable for a meaningful
            stretch of a paid period and we could not fix it — we refund that
            part pro rata;
          </Item>
          <Item>
            we withdraw {COMPANY.tradingName}, or a feature your plan was sold
            on, mid-period;
          </Item>
          <Item>
            the payment was fraudulent and not made by you. Tell us as soon as
            you see it.
          </Item>
        </List>
      </>
    ),
  },
  {
    id: "chargebacks",
    heading: "Chargebacks and failed payments",
    content: (
      <>
        <P>
          If something looks wrong on your statement, please email us before
          raising a chargeback. A chargeback takes weeks, usually ends in your
          account being suspended while it runs, and is slower than a refund we
          can approve the same week.
        </P>
        <P>
          If a renewal payment fails, {PROCESSOR.name} will retry it and let you
          know. We may pause updates and support while a payment is outstanding;
          your deployed store keeps running, because it is on your own hosting.
        </P>
      </>
    ),
  },
  {
    id: "enterprise",
    heading: "Enterprise agreements",
    content: (
      <>
        <P>
          Enterprise is priced and scoped per customer, and its contract governs
          refunds, notice periods and service credits. Where that agreement and
          this page disagree, the agreement wins.
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
            Billing, cancellations and refunds:{" "}
            <Email address={COMPANY.billingEmail} />
          </Item>
          <Item>
            Anything else: <Email address={COMPANY.supportEmail} />
          </Item>
          <Item>
            Payment processor:{" "}
            <Out href={PROCESSOR.termsUrl}>{PROCESSOR.name} buyer terms</Out>
          </Item>
        </List>
        <P>
          See also our <In href="/terms">Terms of Service</In> and{" "}
          <In href="/privacy">Privacy Policy</In>.
        </P>
      </>
    ),
  },
];

export default function RefundPage() {
  return (
    <LegalPage
      current="refund"
      title="Refund Policy"
      summary={`A 14-day trial, then 14 days to change your mind about your first payment, then cancel whenever you like with the period you have paid for running out. Hosting, domains and gateway fees are billed by other companies and are not ours to refund.`}
      sections={SECTIONS}
    />
  );
}
