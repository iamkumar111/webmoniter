export default function CookiePage() {
  return (
    <article className="prose prose-indigo max-w-none">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
      <p className="text-gray-600 mb-6">Last updated: January 9, 2026</p>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">1. Use of Cookies</h2>
        <p className="text-gray-700 leading-relaxed">
          WebsMoniter uses cookies to improve your experience on our site. Cookies are small text files that are placed on your machine to help the site provide a better user experience. 
          In general, cookies are used to retain user preferences, store information for things like shopping carts, and provide anonymized tracking data to third party applications like Google Analytics.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">2. Types of Cookies We Use</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-gray-900">Essential Cookies</h3>
            <p className="text-sm text-gray-700 font-medium leading-none">These are necessary for the website to function properly and cannot be disabled.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Analytics Cookies</h3>
            <p className="text-sm text-gray-700 font-medium leading-none">We use Google Analytics to understand how our website is being used and to identify areas for improvement.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Functional Cookies</h3>
            <p className="text-sm text-gray-700 font-medium leading-none">These allow us to remember choices you make (such as your user name) to provide a more personalized experience.</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">3. Managing Cookies</h2>
        <p className="text-gray-700 leading-relaxed">
          As a rule, cookies will make your browsing experience better. However, you may prefer to disable cookies on this site and on others. 
          The most effective way to do this is to disable cookies in your browser. We suggest consulting the Help section of your browser or taking a look at the About Cookies website which offers guidance for all modern browsers.
        </p>
      </section>
    </article>
  );
}
