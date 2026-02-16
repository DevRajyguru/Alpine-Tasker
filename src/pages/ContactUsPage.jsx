import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const contactInfo = [
  { icon: "fa-location-dot", title: "Mailing Address" },
  { icon: "fa-envelope", title: "Email Info" },
  { icon: "fa-phone", title: "Phone Number" },
];

const faqItems = [
  {
    q: "1. How do I book a service?",
    a: "Absolutely! You can enroll in multiple courses simultaneously and access them at your convenience.",
  },
  {
    q: "2. Are the service professionals verified?",
    a: "Yes, all professionals go through identity and background checks before activation.",
  },
  {
    q: "3. How can I make a payment?",
    a: "You can pay securely by card, wallet, or online banking through our checkout.",
  },
  {
    q: "4. Can I cancel or reschedule a booking?",
    a: "Yes, you can cancel or reschedule from your booking dashboard based on policy.",
  },
  {
    q: "5.Will I receive a booking confirmation?",
    a: "Yes, you receive instant confirmation via app and email after successful booking.",
  },
];

function ContactUsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="bg-[#eceef2] text-slate-900">
      <nav className="top-0 z-50 bg-white px-6 py-5 lg:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
          <Link to="/" className="flex items-center">
            <img src="/images/logo.svg" alt="Alpine Tasker" className="h-9 w-auto" />
          </Link>

          <ul className="hidden items-center gap-10 font-medium text-slate-600 lg:flex">
            <li><Link to="/" className="hover:text-slate-900 transition">Home</Link></li>
            <li><Link to="/about" className="hover:text-slate-900 transition">About</Link></li>
            <li><Link to="/services" className="hover:text-slate-900 transition">Service</Link></li>
            <li><Link to="/blog" className="hover:text-slate-900 transition">Blog</Link></li>
            <li><Link to="/contactus" className="border-b-2 border-[#59b847] pb-1 text-[#59b847]">Contact</Link></li>
            <li><Link to="/login" className="hover:text-slate-900 transition">Login</Link></li>
          </ul>

          <div className="hidden lg:block">
            <Link to="/register" className="flex items-center gap-2 rounded-full bg-[#1e2756] px-6 py-2.5 text-white shadow-md transition hover:bg-opacity-90">
              <i className="fa-regular fa-user"></i>
              <span>Become A Tasker</span>
            </Link>
          </div>

          <button type="button" className="text-slate-600 focus:outline-none lg:hidden" aria-label="Open menu" onClick={() => setMobileMenuOpen((v) => !v)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h12M4 18h8" />
            </svg>
          </button>
        </div>

        <div className={`${mobileMenuOpen ? "block" : "hidden"} mt-4 border-t border-gray-100 bg-white lg:hidden`}>
          <ul className="flex flex-col space-y-4 py-4 font-medium text-slate-600">
            <li><NavLink to="/" className={({ isActive }) => (isActive ? "text-[#59b847]" : "")}>Home</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => (isActive ? "text-[#59b847]" : "")}>About</NavLink></li>
            <li><NavLink to="/services" className={({ isActive }) => (isActive ? "text-[#59b847]" : "")}>Service</NavLink></li>
            <li><NavLink to="/blog" className={({ isActive }) => (isActive ? "text-[#59b847]" : "")}>Blog</NavLink></li>
            <li><NavLink to="/contactus" className={({ isActive }) => (isActive ? "text-[#59b847]" : "")}>Contact</NavLink></li>
            <li><NavLink to="/login" className={({ isActive }) => (isActive ? "text-[#59b847]" : "")}>Login</NavLink></li>
            <li>
              <Link to="/register" className="inline-block w-full rounded-full bg-[#1e2756] px-6 py-2 text-center text-white">
                Become A Tasker
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <main>
        <section className="relative h-[460px] overflow-hidden bg-[#3489d0]">
          <img src="/images/wave.svg" alt="" className="absolute left-0 top-0 h-full w-[520px] object-cover opacity-25" />
          <div className="relative mx-auto flex h-full max-w-7xl items-center px-6">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold">Contact Us</h1>
              <p className="mt-5 text-lg sm:text-xl leading-tight text-white/90">
                Have questions, need support, or want to partner with us? We&apos;re here to help. Reach out and our team will respond as quickly as possible.
              </p>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-14 lg:py-16">
          <img src="/images/wave.svg" alt="" className="pointer-events-none absolute -right-16 bottom-0 h-[220px] w-[360px] object-cover opacity-20" />
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <h2 className="text-center text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2f87d6]">Contact Information</h2>
            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
              {contactInfo.map((item) => (
                <article key={item.title} className="rounded-2xl border border-[#d8dde8] border-b-[4px] border-b-[#2f87d6] bg-white px-6 pb-6 pt-8 text-center shadow-sm">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-[#c9d5e8] bg-[#f8fbff]">
                    <i className={`fa-solid ${item.icon} text-5xl text-[#1f3c87]`}></i>
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold text-[#1f2d6e]">{item.title}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden pb-16 lg:pb-20">
          <img src="/images/wave.svg" alt="" className="pointer-events-none absolute left-0 top-0 h-[260px] w-[420px] object-cover opacity-20" />
          <img src="/images/wave.svg" alt="" className="pointer-events-none absolute right-0 top-0 h-[260px] w-[420px] scale-x-[-1] object-cover opacity-20" />
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <h2 className="text-center text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2f87d6]">Contact Form</h2>
            <form className="mt-8">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input type="text" placeholder="Name" className="h-14 rounded-xl border border-[#9dc8ef] bg-white px-5 text-base sm:text-lg text-[#1f2d6e] outline-none placeholder:text-slate-500 focus:border-[#2f87d6]" />
                <input type="email" placeholder="Email" className="h-14 rounded-xl border border-[#9dc8ef] bg-white px-5 text-base sm:text-lg text-[#1f2d6e] outline-none placeholder:text-slate-500 focus:border-[#2f87d6]" />
                <input type="text" placeholder="Phone" className="h-14 rounded-xl border border-[#9dc8ef] bg-white px-5 text-base sm:text-lg text-[#1f2d6e] outline-none placeholder:text-slate-500 focus:border-[#2f87d6]" />
                <input type="text" placeholder="Subject" className="h-14 rounded-xl border border-[#9dc8ef] bg-white px-5 text-base sm:text-lg text-[#1f2d6e] outline-none placeholder:text-slate-500 focus:border-[#2f87d6]" />
              </div>
              <textarea placeholder="Message" rows="4" className="mt-4 w-full resize-none rounded-xl border border-[#9dc8ef] bg-white px-5 py-4 text-base sm:text-lg text-[#1f2d6e] outline-none placeholder:text-slate-500 focus:border-[#2f87d6]"></textarea>
              <div className="mt-6 text-center">
                <button type="button" className="inline-flex h-12 items-center justify-center rounded-full bg-[#2f87d6] px-8 text-md font-semibold text-white hover:bg-[#2678bf]">
                  Contact Us
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="pb-16 lg:pb-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="relative min-h-[300px] rounded-[30px] border border-[#b9c7d8] bg-[#d7e3ee] shadow-md">
              <img src="/images/aboutavtar.svg" alt="" className="absolute -left-5 top-20 h-16 w-16 rounded-full object-cover ring-4 ring-white" />
              <img src="/images/aboutavtar.svg" alt="" className="absolute -top-4 left-[20%] h-16 w-16 rounded-full object-cover ring-4 ring-white" />
              <img src="/images/aboutavtar.svg" alt="" className="absolute -top-4 left-[64%] h-16 w-16 rounded-full object-cover ring-4 ring-white" />
              <img src="/images/aboutavtar.svg" alt="" className="absolute right-10 top-4 h-16 w-16 rounded-full object-cover ring-4 ring-white" />
              <img src="/images/aboutavtar.svg" alt="" className="absolute bottom-2 right-[-18px] h-16 w-16 rounded-full object-cover ring-4 ring-white" />
              <img src="/images/aboutavtar.svg" alt="" className="absolute -bottom-4 left-[32%] h-16 w-16 rounded-full object-cover ring-4 ring-white" />
              <div className="flex min-h-[300px] items-center justify-center px-6 text-center">
                <h3 className="max-w-4xl text-3xl sm:text-4xl font-bold leading-tight text-black lg:text-5xl">Trusted by thousands of people all over the world</h3>
              </div>
            </div>
          </div>
        </section>
      </main>

      <section className="bg-[#f7f8fb] pb-14 pt-4 lg:pb-20 lg:pt-6">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative min-h-[260px] overflow-visible rounded-[30px] bg-[#2f87d6] lg:min-h-[300px]">
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[30px]">
              <div
                className="absolute -bottom-2 -right-2 h-20 w-28 opacity-90"
                style={{ backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.95) 2px, transparent 2px)", backgroundSize: "12px 12px" }}
              ></div>
            </div>
            <div className="relative z-10 grid grid-cols-1 items-end gap-6 px-6 pb-0 pt-8 lg:grid-cols-[320px_1fr] lg:px-10">
              <div className="relative h-[240px] overflow-visible lg:h-[300px]">
                <img src="/images/whiteman.svg" alt="Worker" className="absolute bottom-0 left-0 h-[300px] w-auto object-contain lg:h-[360px]" />
              </div>
              <div className="text-white lg:pb-12">
                <h2 className="text-3xl sm:text-4xl font-bold leading-tight lg:text-6xl">Ready to Book a Service?</h2>
                <p className="mt-3 max-w-3xl text-lg text-white/90 lg:text-xl">Book trusted services in minutes with simple scheduling, transparent pricing, and secure payments.</p>
                <Link to="/register" className="mt-6 mb-4 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-[#1f2d6e] sm:mb-0">
                  Become A Tasker
                  <img src="/images/darkarrow.svg" alt="" className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f8fb] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2f87d6] lg:text-5xl">Frequently Asked Questions</h2>
            <p className="mt-5 text-base text-[#1f2d6e] sm:text-lg lg:text-xl">Still you have any questions? Contact our Team via support@taskservice.com</p>
          </div>
          <div className="mt-10 space-y-5">
            {faqItems.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <article key={faq.q} className="faq-item rounded-xl border border-[#d7dde9] border-l-[5px] border-l-[#1f3c87] bg-white px-6 py-5" data-open={isOpen ? "true" : "false"}>
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-sm font-semibold text-[#1f2d6e] sm:text-xl lg:text-[20px]">{faq.q}</h3>
                    <button type="button" className="faq-toggle flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-[#2b4d9a] to-[#163475] text-3xl leading-none text-white shadow-md sm:h-12 sm:w-12 sm:text-4xl" aria-expanded={isOpen} aria-label="Toggle FAQ" onClick={() => setOpenFaq((prev) => (prev === i ? -1 : i))}>
                      <span className="faq-symbol relative -translate-y-[2px]">{isOpen ? "×" : "+"}</span>
                    </button>
                  </div>
                  <div className={`faq-answer mt-4 ${isOpen ? "" : "hidden"}`}>
                    <div className="h-px w-full bg-[#d8dce5]"></div>
                    <p className="mt-4 text-base text-[#1f2d6e] sm:text-lg lg:text-[16px]">{faq.a}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="relative mt-20 overflow-hidden bg-[#1e2b78] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -bottom-40 -left-20 h-[420px] w-[720px] rotate-[28deg] bg-[#172a6a]/80"></div>
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
            <div>
              <Link to="/" className="inline-block">
                <img src="/images/logo.svg" alt="Alpine Tasker" className="h-10 w-auto rounded" />
              </Link>
              <div className="mt-4 flex items-center gap-3">
                <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"><i className="fa-brands fa-x-twitter text-lg"></i></a>
                <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"><i className="fa-brands fa-linkedin-in text-lg"></i></a>
                <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"><i className="fa-brands fa-facebook-f text-lg"></i></a>
                <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"><i className="fa-brands fa-instagram text-lg"></i></a>
              </div>
            </div>
            <div><h4 className="text-2xl font-semibold">Discover</h4><ul className="mt-4 space-y-2 text-lg text-white/90"><li><a href="#">Post a task</a></li><li><a href="#">Browse tasks</a></li><li><a href="#">All Service</a></li><li><a href="#">Help</a></li></ul></div>
            <div><h4 className="text-2xl font-semibold">Company</h4><ul className="mt-4 space-y-2 text-lg text-white/90"><li><a href="#">About us</a></li><li><a href="#">Careers</a></li><li><a href="#">Contact us</a></li><li><a href="#">Blog</a></li></ul></div>
            <div><h4 className="text-2xl font-semibold">Solutions</h4><ul className="mt-4 space-y-2 text-lg text-white/90"><li><a href="#">Compliance</a></li><li><a href="#">Payments</a></li><li><a href="#">For Finance Teams</a></li><li><a href="#">For Legal Teams</a></li><li><a href="#">For Hiring Managers</a></li></ul></div>
            <div><h4 className="text-2xl font-semibold">Popular Location</h4><ul className="mt-4 space-y-2 text-lg text-white/90"><li><a href="#">Sydney</a></li><li><a href="#">Melbourne</a></li><li><a href="#">Brisbane</a></li><li><a href="#">Perth</a></li><li><a href="#">Adelaide</a></li></ul></div>
          </div>
          <div className="mt-10 flex items-center gap-2 text-lg text-white/90"><i className="fa-solid fa-globe"></i><span>English</span></div>
          <div className="mt-6 flex flex-col items-start justify-between gap-3 border-t border-white/20 pt-5 text-base text-white/90 sm:flex-row sm:items-center">
            <p>© Copyright 2026. All Rights Reserved.</p>
            <div className="flex items-center gap-6"><a href="#">Privacy Policy</a><a href="#">Terms of Service</a></div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ContactUsPage;
