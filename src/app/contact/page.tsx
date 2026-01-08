import { Mail, MapPin, Phone } from "lucide-react";
import LandingHeader from "@/components/layout/landing-header";
import Footer from "@/components/layout/footer";
import ContactForm from "@/components/contact-form";
import { generatePageMetadata } from "@/lib/seo";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
   return generatePageMetadata("contact", {
      title: "Contact Us - WebsMonitor",
      description: "Get in touch with the WebsMonitor team. We are here to help with your monitoring needs.",
      keywords: ["contact WebsMonitor", "support", "help center", "customer service"],
   });
}

export default function ContactPage() {
   return (
      <div className="flex flex-col min-h-screen bg-white font-sans">
         <LandingHeader />

         <main className="flex-1 pt-32 pb-16 md:pt-40 md:pb-24">
            <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-6xl">
               <div className="grid lg:grid-cols-2 gap-12">
                  {/* Contact Info */}
                  <div>
                     <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">Get in touch</h1>
                     <p className="text-xl text-gray-600 mb-12">
                        Have a question about our pricing, features, or need support? We're here to help.
                     </p>

                     <div className="space-y-8">
                        <div className="flex items-start gap-4">
                           <div className="p-3 bg-indigo-50 rounded-lg">
                              <Mail className="w-6 h-6 text-indigo-600" />
                           </div>
                           <div>
                              <h3 className="font-bold text-gray-900 mb-1">Email Us</h3>
                              <p className="text-gray-600">Our team typically responds within 2 hours.</p>
                              <a href="mailto:support@WebsMonitor.online" className="text-indigo-600 font-medium hover:underline mt-2 inline-block">support@WebsMonitor.online</a>
                           </div>
                        </div>

                        <div className="flex items-start gap-4">
                           <div className="p-3 bg-indigo-50 rounded-lg">
                              <MapPin className="w-6 h-6 text-indigo-600" />
                           </div>
                           <div>
                              <h3 className="font-bold text-gray-900 mb-1">Visit Us</h3>
                              <p className="text-gray-600">
                                 28 Sandy Pond Pky<br />
                                 Bedford, New Hampshire(NH), 03110
                              </p>
                           </div>
                        </div>

                        <div className="flex items-start gap-4">
                           <div className="p-3 bg-indigo-50 rounded-lg">
                              <Phone className="w-6 h-6 text-indigo-600" />
                           </div>
                           <div>
                              <h3 className="font-bold text-gray-900 mb-1">Call Us</h3>
                              <p className="text-gray-600">Mon-Fri from 8am to 5pm.</p>
                              <a href="tel:+16036275557" className="text-indigo-600 font-medium hover:underline mt-2 inline-block">+1 (603) 627-5557</a>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Contact Form */}
                  <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                     <ContactForm />
                  </div>
               </div>
            </div>
         </main>

         <Footer />
      </div>
   );
}
