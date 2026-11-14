import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Home as HomeIcon,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const inquiryTypes = [
  "General Inquiry",
  "Order & Tracking",
  "Returns & Refunds",
  "Vendor Partnership",
  "Technical Support",
];

function Contact() {
  const [selectedType, setSelectedType] = useState("General Inquiry");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Thank you! Your message has been received. We'll reply shortly.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2"
      >
        <ol className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
          <li>
            <Link
              to="/"
              className="inline-flex items-center gap-1 hover:text-red-600 transition-colors"
            >
              <HomeIcon className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
          </li>
          <li className="text-slate-300">
            <ChevronRight className="w-3.5 h-3.5" />
          </li>
          <li className="text-slate-900 font-semibold">Contact Us</li>
        </ol>
      </nav>

      {/* Hero Header */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            We're Here To Help
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Get in Touch with <span className="text-red-600">Our Team</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Have a question about an order, seller inquiry, or feedback? Send us a message
            and our customer care team will get back to you promptly.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Contact Information Cards */}
          <div className="lg:col-span-5 space-y-5">
            {/* Call Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-red-200 hover:shadow-md transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Call Support</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-xs font-semibold text-emerald-600">
                      Live 24/7 Available
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mb-3 leading-relaxed">
                Speak directly with an agent for urgent inquiries or ordering assistance.
              </p>
              <a
                href="tel:+8801611112222"
                className="inline-block text-sm font-bold text-slate-900 hover:text-red-600 transition-colors"
              >
                +880 1611 112 222
              </a>
            </div>

            {/* Email Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-red-200 hover:shadow-md transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Email Support</h3>
                  <p className="text-xs text-slate-400">Response within 2 hours</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mb-3 leading-relaxed">
                Send your documents, orders, or partner inquiries straight to our inbox.
              </p>
              <div className="space-y-1 text-sm font-semibold">
                <div>
                  <a
                    href="mailto:support@moccomart.com"
                    className="text-slate-900 hover:text-red-600 transition-colors"
                  >
                    support@moccomart.com
                  </a>
                </div>
                <div>
                  <a
                    href="mailto:customer@moccomart.com"
                    className="text-slate-600 hover:text-red-600 transition-colors text-xs"
                  >
                    customer@moccomart.com
                  </a>
                </div>
              </div>
            </div>

            {/* Office & Operating Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Headquarters</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Mocco Mart Central, Tech Boulevard, Sector 4, Commercial District
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-3 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Quick Answers</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Looking for fast answers?{" "}
                    <Link
                      to="/faq"
                      className="text-red-600 font-bold hover:underline"
                    >
                      Visit our FAQ page &rarr;
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Send us a Message
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Select your inquiry type and provide your details below.
                </p>
              </div>

              {/* Inquiry Type Chips */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Topic of Interest:
                </label>
                <div className="flex flex-wrap gap-2">
                  {inquiryTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedType(type)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedType === type
                          ? "bg-red-600 text-white shadow-sm shadow-red-600/30"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Elements */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Your Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Alex Morgan"
                      required
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none text-sm text-slate-900 transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Email Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. alex@example.com"
                      required
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none text-sm text-slate-900 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +1 (555) 000-0000"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none text-sm text-slate-900 transition-all placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Your Message <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you today..."
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none text-sm text-slate-900 transition-all placeholder:text-slate-400 resize-y"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Your privacy is protected. No spam ever.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-red-600/30 hover:scale-102 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Contact;
