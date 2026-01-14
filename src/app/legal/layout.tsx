import LandingHeader from "@/components/layout/landing-header";
import Footer from "@/components/layout/footer";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <LandingHeader />
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl py-12">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
