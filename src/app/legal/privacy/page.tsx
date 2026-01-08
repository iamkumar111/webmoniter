export default function PrivacyPage() {
  return (
    <article className="prose prose-indigo max-w-none">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      <p className="text-gray-600 mb-6">Last updated: January 9, 2026</p>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">1. Introduction</h2>
        <p className="text-gray-700 leading-relaxed">
          Welcome to WebsMonitor ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy.
          If you have any questions or concerns about this privacy notice or our practices with regards to your personal information,
          please contact us at privacy@WebsMonitor.online.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">2. Information We Collect</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We collect personal information that you voluntarily provide to us when you register on the website,
          express an interest in obtaining information about us or our products and services,
          when you participate in activities on the website, or otherwise when you contact us.
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li><strong>Personal Data:</strong> Name, email address, password, and contact preferences.</li>
          <li><strong>Payment Data:</strong> We may collect data necessary to process your payment if you make purchases, such as your payment instrument number.</li>
          <li><strong>Technical Data:</strong> IP address, browser type, and operating system collected automatically during site visits.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">3. How We Use Your Information</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We process your information for purposes based on legitimate business interests, the fulfillment of our contract with you, compliance with our legal obligations, and/or your consent.
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>To facilitate account creation and logon process.</li>
          <li>To send administrative information to you.</li>
          <li>To fulfill and manage your orders.</li>
          <li>To post testimonials with your consent.</li>
          <li>To protect our Services from fraudulent activities.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">4. Data Security</h2>
        <p className="text-gray-700 leading-relaxed">
          We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process.
          However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology
          can be guaranteed to be 100% secure.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">5. Your Privacy Rights</h2>
        <p className="text-gray-700 leading-relaxed">
          In some regions (like the EEA and UK), you have certain rights under applicable data protection laws.
          These may include the right (i) to request access and obtain a copy of your personal information,
          (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information;
          and (iv) if applicable, to data portability.
        </p>
      </section>
    </article>
  );
}
