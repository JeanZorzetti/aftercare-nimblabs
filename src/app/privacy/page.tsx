import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How AftercareGen collects, uses, and protects your personal information.',
  alternates: {
    canonical: 'https://aftercare.nimblabs.com/privacy',
  },
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 animate-rise">
      <h1 className="font-serif text-4xl font-semibold text-[var(--foreground)] mb-2">Privacy Policy</h1>
      <p className="text-sm text-[var(--muted-foreground)] mb-10">Last updated: June 6, 2026</p>

      <div className="prose prose-neutral max-w-none space-y-8 text-[var(--foreground)]">

        <section>
          <h2 className="font-serif text-2xl font-semibold mb-3">1. Who we are</h2>
          <p className="text-[var(--muted-foreground)] leading-relaxed">
            AftercareGen is a B2B SaaS product operated by Nimblabs, accessible at{' '}
            <span className="font-medium text-[var(--foreground)]">aftercare.nimblabs.com</span>. We build
            tools that help aesthetic clinics generate professional aftercare documentation for their patients.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold mb-3">2. What data we collect</h2>
          <ul className="list-disc pl-5 space-y-2 text-[var(--muted-foreground)] leading-relaxed">
            <li>
              <strong className="text-[var(--foreground)]">Account data:</strong> your email address and name,
              collected when you sign in via Google OAuth or email magic link (handled by NextAuth).
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Usage data:</strong> which procedures you generate
              aftercare sheets for, and basic funnel events (visit, generate, paywall, subscribe). No
              behavioral tracking or fingerprinting.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Payment data:</strong> billing is processed entirely
              by Stripe. We never store or see your card details.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Clinic name:</strong> the name you enter when
              generating a sheet, used solely to personalise your PDF output.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold mb-3">3. How we use your data</h2>
          <ul className="list-disc pl-5 space-y-2 text-[var(--muted-foreground)] leading-relaxed">
            <li>To authenticate you and maintain your account.</li>
            <li>To generate personalised aftercare PDF documents.</li>
            <li>To manage your subscription and process payments via Stripe.</li>
            <li>To understand how the product is used so we can improve it.</li>
          </ul>
          <p className="text-[var(--muted-foreground)] leading-relaxed mt-3">
            We do not sell, rent, or share your personal data with third parties for marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold mb-3">4. Third-party services</h2>
          <ul className="list-disc pl-5 space-y-2 text-[var(--muted-foreground)] leading-relaxed">
            <li>
              <strong className="text-[var(--foreground)]">Stripe</strong> — payment processing. Governed by
              Stripe&apos;s privacy policy.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Google OAuth</strong> — optional sign-in method.
              We receive only your email and name.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Pexels</strong> — stock photography served on
              blog pages. No personal data is shared.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold mb-3">5. Data retention</h2>
          <p className="text-[var(--muted-foreground)] leading-relaxed">
            We retain your account data for as long as your account is active. You may request deletion of
            your account and associated data at any time by emailing us at the address below.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold mb-3">6. Your rights</h2>
          <p className="text-[var(--muted-foreground)] leading-relaxed">
            Depending on your location, you may have rights to access, correct, or delete your personal data.
            To exercise these rights, contact us at{' '}
            <a
              href="mailto:privacy@nimblabs.com"
              className="text-[var(--primary)] hover:underline"
            >
              privacy@nimblabs.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold mb-3">7. Cookies</h2>
          <p className="text-[var(--muted-foreground)] leading-relaxed">
            We use a single session cookie to keep you signed in. We do not use advertising cookies or
            third-party tracking cookies.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold mb-3">8. Changes to this policy</h2>
          <p className="text-[var(--muted-foreground)] leading-relaxed">
            We may update this policy from time to time. The date at the top of this page reflects the most
            recent revision. Continued use of the service after changes constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold mb-3">9. Contact</h2>
          <p className="text-[var(--muted-foreground)] leading-relaxed">
            Questions about this policy? Email us at{' '}
            <a
              href="mailto:privacy@nimblabs.com"
              className="text-[var(--primary)] hover:underline"
            >
              privacy@nimblabs.com
            </a>
            .
          </p>
        </section>

      </div>
    </div>
  )
}
