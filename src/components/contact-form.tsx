"use client";

import { useState, useTransition } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { submitEnquiry } from "@/lib/actions";

export default function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };

    startTransition(async () => {
      await submitEnquiry(data);
      setSuccess(true);
    });
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
        <p className="text-gray-600">Thank you for reaching out. We will get back to you shortly.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-6 text-indigo-600 font-semibold hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium text-gray-900">First Name</label>
            <input required name="firstName" type="text" id="firstName" className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="John" />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium text-gray-900">Last Name</label>
            <input required name="lastName" type="text" id="lastName" className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Doe" />
          </div>
      </div>
      
      <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-900">Email</label>
          <input required name="email" type="email" id="email" className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="john@company.com" />
      </div>
      
      <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium text-gray-900">Message</label>
          <textarea required name="message" id="message" rows={4} className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="How can we help you?"></textarea>
      </div>
      
      <button 
        disabled={isPending}
        type="submit" 
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-70"
      >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
          Send Message
      </button>
    </form>
  );
}
