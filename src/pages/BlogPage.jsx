import { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const blogPosts = [
  {
    image: "/images/home.svg",
    alt: "Popular Home Services Online",
    day: "05",
    month: "Dec",
    title: "Popular Home Services Online",
    excerpt: "Short guide to the most booked home services and why people prefer ...",
  },
  {
    image: "/images/online.svg",
    alt: "Benefits of Online Service Booking",
    day: "15",
    month: "Dec",
    title: "Benefits of Online Service Booking",
    excerpt: "Key advantages of booking home services online, from convenience ...",
  },
  {
    image: "/images/moving.svg",
    alt: "Easy Home Maintenance Tips",
    day: "25",
    month: "Dec",
    title: "Easy Home Maintenance Tips",
    excerpt: "Discover how routine cleaning improves hygiene, comfort, and overall home ...",
  },
  {
    image: "/images/rightservice.svg",
    alt: "How to Choose the Right Service",
    day: "28",
    month: "Nov",
    title: "How to Choose the Right Service",
    excerpt: "Simple tips to find reliable professionals, compare options, and ensure quality ...",
  },
  {
    image: "/images/rupee.svg",
    alt: "Why Pricing Transparency Matters",
    day: "22",
    month: "Nov",
    title: "Why Pricing Transparency Matters",
    excerpt: "The importance of clear pricing and how it builds trust...",
  },
  {
    image: "/images/maintenence.svg",
    alt: "Benefits of Deep Cleaning",
    day: "12",
    month: "Nov",
    title: "Benefits of Deep Cleaning",
    excerpt: "Quick and practical tips to keep your home clean, safe, and well ...",
  },
  {
    image: "/images/mobile.svg",
    alt: "Digital Future of Services",
    day: "02",
    month: "Nov",
    title: "Digital Future of Services",
    excerpt: "Technology is transforming the way people book and experience services...",
  },
  {
    image: "/images/blogclean.svg",
    alt: "Choosing Cleaning Services",
    day: "25",
    month: "Oct",
    title: "Choosing Cleaning Services",
    excerpt: "How to select the best cleaning option for your needs...",
  },
  {
    image: "/images/time.svg",
    alt: "Save Time with Online Booking",
    day: "17",
    month: "Oct",
    title: "Save Time with Online Booking",
    excerpt: "Quick and practical tips to keep your home clean, safe, and well ...",
  },
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

const totalPages = 4;

function BlogPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openFaq, setOpenFaq] = useState(0);

  const pagedCards = useMemo(() => Array.from({ length: totalPages }, () => blogPosts), []);
  const cards = pagedCards[currentPage - 1];

  return (
    <div className="bg-white text-slate-900">
      <nav className="top-0 z-50 bg-white px-6 py-5 lg:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
          <Link to="/" className="flex items-center">
            <img src="/images/logo.svg" alt="Alpine Tasker" className="h-9 w-auto" />
          </Link>

          <ul className="hidden items-center gap-10 font-medium text-slate-600 lg:flex">
            <li><Link to="/" className="transition hover:text-slate-900">Home</Link></li>
            <li><Link to="/about" className="transition hover:text-slate-900">About</Link></li>
            <li><Link to="/services" className="transition hover:text-slate-900">Service</Link></li>
            <li><Link to="/blog" className="border-b-2 border-green-600 pb-1 text-green-600">Blog</Link></li>
            <li><Link to="/contact" className="transition hover:text-slate-900">Contact</Link></li>
            <li><Link to="/login" className="transition hover:text-slate-900">Login</Link></li>
          </ul>

          <div className="hidden lg:block">
            <Link to="/register" className="flex items-center gap-2 rounded-full bg-[#1e2756] px-6 py-2.5 text-white shadow-md transition hover:bg-opacity-90">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
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
            <li><NavLink to="/" className={({ isActive }) => (isActive ? "text-green-600" : "")}>Home</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => (isActive ? "text-green-600" : "")}>About</NavLink></li>
            <li><NavLink to="/services" className={({ isActive }) => (isActive ? "text-green-600" : "")}>Service</NavLink></li>
            <li><NavLink to="/blog" className={({ isActive }) => (isActive ? "text-green-600" : "")}>Blog</NavLink></li>
            <li><NavLink to="/contact" className={({ isActive }) => (isActive ? "text-green-600" : "")}>Contact</NavLink></li>
            <li><NavLink to="/login" className={({ isActive }) => (isActive ? "text-green-600" : "")}>Login</NavLink></li>
            <li>
              <Link to="/register" className="inline-block w-full rounded-full bg-[#1e2756] px-6 py-2 text-center text-white">
                Become A Tasker
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <main className="bg-[#eceef2] py-12">
        <section className="mx-auto max-w-5xl px-5">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2f87d6]">Read Our Blog</h1>
            <p className="mx-auto mt-3 max-w-3xl text-sm text-[#4f6691]">
              Discover practical how-to guides, service tips, and updates written to help you save time, choose better services, and stay informed with reliable, easy-to-read content.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((post, idx) => (
              <article key={`${post.title}-${idx}`} className="overflow-hidden rounded-xl border border-[#dbe2ef] bg-white shadow-sm">
                <div className="relative">
                  <img src={post.image} alt={post.alt} className="h-36 w-full object-cover" />
                  <div className="absolute right-2 top-2 rounded-md bg-white px-1.5 py-1 text-center shadow-sm">
                    <p className="text-xs font-semibold leading-none text-[#1f2d6e]">{post.day}</p>
                    <p className="text-[9px] text-[#6c81a6]">{post.month}</p>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-[#2f87d6]">{post.title}</h3>
                  <p className="mt-1 text-xs text-[#5a6f94]">{post.excerpt}</p>
                  <div className="mt-3 flex items-center justify-between rounded-xl border border-[#e7ebf3] bg-[#f5f7fb] px-3 py-2">
                    <div className="flex items-center gap-2">
                      <img src="/images/avtar.svg" alt="Adam Das" className="h-6 w-6 rounded-full" />
                      <span className="text-xs text-[#5a6f94]">Adam Das</span>
                    </div>
                    <a href="#" className="text-xs font-semibold text-[#2f87d6]">
                      Read More <i className="fa-solid fa-arrow-right text-[9px]"></i>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#3f5686]">
            <button type="button" className={`px-2 py-1 hover:text-[#2f87d6] ${currentPage === 1 ? "opacity-50" : ""}`} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
              ← Prev
            </button>
            {[1, 2, 3, 4].map((page) => (
              <button
                key={page}
                type="button"
                className={`h-7 w-7 rounded border border-[#cbd5e1] ${currentPage === page ? "border-[#2f87d6] bg-[#2f87d6] text-white" : "hover:border-[#2f87d6] hover:text-[#2f87d6]"}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button type="button" className={`px-2 py-1 hover:text-[#2f87d6] ${currentPage === totalPages ? "opacity-50" : ""}`} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>
              Next →
            </button>
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
            <p className="mt-5 text-base text-[#1f2d6e] sm:text-lg lg:text-xl">
              Still you have any questions? Contact our Team via support@taskservice.com
            </p>
          </div>

          <div className="mt-10 space-y-5">
            {faqItems.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <article key={item.q} className="faq-item rounded-xl border border-[#d7dde9] border-l-[5px] border-l-[#1f3c87] bg-white px-6 py-5" data-open={isOpen ? "true" : "false"}>
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-sm font-semibold text-[#1f2d6e] sm:text-xl lg:text-[20px]">{item.q}</h3>
                    <button
                      type="button"
                      className="faq-toggle flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-[#2b4d9a] to-[#163475] text-3xl leading-none text-white shadow-md sm:h-12 sm:w-12 sm:text-4xl"
                      aria-expanded={isOpen}
                      aria-label="Toggle FAQ"
                      onClick={() => setOpenFaq((prev) => (prev === i ? -1 : i))}
                    >
                      <span className="faq-symbol relative -translate-y-[2px]">{isOpen ? "×" : "+"}</span>
                    </button>
                  </div>
                  <div className={`faq-answer mt-4 ${isOpen ? "" : "hidden"}`}>
                    <div className="h-px w-full bg-[#d8dce5]"></div>
                    <p className="mt-4 text-base text-[#1f2d6e] sm:text-lg lg:text-[16px]">{item.a}</p>
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

            <div>
              <h4 className="text-2xl font-semibold">Discover</h4>
              <ul className="mt-4 space-y-2 text-lg text-white/90">
                <li><a href="#">Post a task</a></li>
                <li><a href="#">Browse tasks</a></li>
                <li><a href="#">All Service</a></li>
                <li><a href="#">Help</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-2xl font-semibold">Company</h4>
              <ul className="mt-4 space-y-2 text-lg text-white/90">
                <li><a href="#">About us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact us</a></li>
                <li><a href="#">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-2xl font-semibold">Solutions</h4>
              <ul className="mt-4 space-y-2 text-lg text-white/90">
                <li><a href="#">Compliance</a></li>
                <li><a href="#">Payments</a></li>
                <li><a href="#">For Finance Teams</a></li>
                <li><a href="#">For Legal Teams</a></li>
                <li><a href="#">For Hiring Managers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-2xl font-semibold">Popular Location</h4>
              <ul className="mt-4 space-y-2 text-lg text-white/90">
                <li><a href="#">Sydney</a></li>
                <li><a href="#">Melbourne</a></li>
                <li><a href="#">Brisbane</a></li>
                <li><a href="#">Perth</a></li>
                <li><a href="#">Adelaide</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-2 text-lg text-white/90">
            <i className="fa-solid fa-globe"></i>
            <span>English</span>
          </div>

          <div className="mt-6 flex flex-col items-start justify-between gap-3 border-t border-white/20 pt-5 text-base text-white/90 sm:flex-row sm:items-center">
            <p>© Copyright 2026. All Rights Reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default BlogPage;
