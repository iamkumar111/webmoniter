export default function GDPRPage() {
  return (
    <article className="prose prose-indigo max-w-none">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">GDPR Compliance</h1>
      <p className="text-gray-600 mb-6">Last updated: January 9, 2026</p>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">1. Our Commitment</h2>
        <p className="text-gray-700 leading-relaxed">
          WebsMonitor is fully committed to compliance with the General Data Protection Regulation (GDPR).
          We believe that your data belongs to you, and we take every precaution to ensure it is handled securely and transparently.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">2. Data Subject Rights</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Under the GDPR, individuals have specific rights regarding their personal data:
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li><strong>Right to be informed:</strong> We must be transparent about how we use your data.</li>
          <li><strong>Right of access:</strong> You can request a copy of the data we hold about you.</li>
          <li><strong>Right to rectification:</strong> You can request that we correct inaccurate data.</li>
          <li><strong>Right to erasure:</strong> You can request that we delete your data.</li>
          <li><strong>Right to data portability:</strong> You can request your data in a machine-readable format.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">3. Data Protection Measures</h2>
        <p className="text-gray-700 leading-relaxed">
          We use industry-standard encryption, firewalls, and secure data centers to protect your information.
          Our internal policies ensure that only authorized personnel have access to personal data, and only when necessary for their job functions.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">4. Sub-processors</h2>
        <p className="text-gray-700 leading-relaxed">
          We use a limited number of trusted sub-processors to help provide our services (e.g., cloud hosting providers, payment processors).
          All sub-processors are vetted for GDPR compliance and operate under strict data processing agreements.
        </p>
      </section>
    </article>
  );
}
