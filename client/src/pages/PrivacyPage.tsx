import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { PageShell } from "@/pages/Home";

export default function PrivacyPage() {
  return (
    <PageShell>
      <section className="page-hero privacy-hero">
        <p className="eyebrow">Legal / Privacy policy</p>
        <h1>Your information,<br /><em>handled with care.</em></h1>
        <p className="page-hero-copy">This policy explains what LUXHWORK collects when you browse the website or send a project enquiry.</p>
      </section>
      <section className="privacy-content">
        <div className="privacy-index"><span>Last updated</span><strong>10 September 2026</strong><Link href="/contact">Ask a question <ArrowUpRight size={15} /></Link></div>
        <div className="privacy-copy">
          <h2>Privacy at LUXHWORK</h2>
          <p>LUXHWORK Co., Ltd. respects your privacy. We collect only the information needed to respond to an enquiry, understand a potential project and communicate with you about our services.</p>
          <h3>Information we collect</h3>
          <p>When you use the enquiry form, we may receive your name, company, email address, phone or WhatsApp number, project type, location, approximate area, target opening date and project description. We may also receive technical information such as browser and device details through hosting or security services.</p>
          <h3>How we use it</h3>
          <p>We use enquiry information to review your brief, contact you about the requested project and provide a suitable next step, such as a site visit, feasibility review or design proposal. We do not sell your personal information.</p>
          <h3>Storage and retention</h3>
          <p>Project enquiries are stored using the website’s secure application services and are retained only for as long as reasonably necessary for follow-up, project administration, legal obligations or legitimate business records.</p>
          <h3>Sharing</h3>
          <p>We may use trusted hosting, database, analytics or communication providers to operate the website and respond to enquiries. They may process information only to provide those services. We may also disclose information where required by law.</p>
          <h3>Your choices</h3>
          <p>You may ask what personal information we hold, request a correction or ask us to stop further enquiry communications. Contact us at <a href="mailto:admin@luxhwork.com">admin@luxhwork.com</a> or call <a href="tel:+85589900300">+855 89 900 300</a>.</p>
          <h3>Cookies and external links</h3>
          <p>The website may use necessary technical storage and privacy-respecting analytics when configured. Links to WhatsApp, Telegram, social platforms, maps or other websites are governed by those services’ own policies.</p>
          <h3>Updates</h3>
          <p>We may update this policy when the website, services or legal requirements change. The latest version will always be published on this page.</p>
        </div>
      </section>
    </PageShell>
  );
}
