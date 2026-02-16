import { useEffect, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const pricingTable = {
  Wedding: { Small: 140, Medium: 160, Large: 210 },
  Birthday: { Small: 120, Medium: 150, Large: 190 },
  Corporate: { Small: 180, Medium: 220, Large: 280 },
  Engagement: { Small: 160, Medium: 200, Large: 250 },
};

const taskers = [
  { image: "/images/micheal.svg", name: "Michael Reed" },
  { image: "/images/dannieal.svg", name: "Daniel Cooper" },
  { image: "/images/james.svg", name: "James Walker" },
  { image: "/images/robert.svg", name: "Robert Hughes" },
  { image: "/images/david.svg", name: "David Turner" },
  { image: "/images/ryan.svg", name: "Ryan Mitchell" },
];

const faqItems = [
  {
    question: "1. How do I book a service?",
    answer: "Absolutely! You can enroll in multiple courses simultaneously and access them at your convenience.",
  },
  {
    question: "2. Are the service professionals verified?",
    answer: "Yes, all professionals go through identity and background checks before activation.",
  },
  {
    question: "3. How can I make a payment?",
    answer: "You can pay securely by card, wallet, or online banking through our checkout.",
  },
  {
    question: "4. Can I cancel or reschedule a booking?",
    answer: "Yes, you can cancel or reschedule from your booking dashboard based on policy.",
  },
  {
    question: "5.Will I receive a booking confirmation?",
    answer: "Yes, you receive instant confirmation via app and email after successful booking.",
  },
];

function PosterPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const estimatedPrice = useMemo(() => pricingTable[selectedEvent]?.[selectedSize] ?? 160, [selectedEvent, selectedSize]);

  useEffect(() => {
    const onDocClick = () => setOpenDropdown(null);
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const toggleDropdown = (name, event) => {
    event.stopPropagation();
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const selectDropdownValue = (type, value, event) => {
    event.stopPropagation();
    if (type === "event") setSelectedEvent(value);
    if (type === "size") setSelectedSize(value);
    setOpenDropdown(null);
  };

  return (
    <div className="bg-[#f5f6f8] text-slate-900">
      <nav className="top-0 z-50 bg-white px-6 py-5 lg:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
          <Link to="/" className="flex items-center">
            <img src="/images/logo.svg" alt="Alpine Tasker" className="h-9 w-auto" />
          </Link>

          <ul className="hidden items-center gap-10 font-medium text-slate-600 lg:flex">
            <li>
              <Link to="/" className="border-b-2 border-[#4a9c2e] pb-1 text-[#4a9c2e]">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="transition hover:text-slate-900">
                About
              </Link>
            </li>
            <li>
              <Link to="/services" className="transition hover:text-slate-900">
                Service
              </Link>
            </li>
            <li><Link to="/blog" className="transition hover:text-slate-900">Blog</Link></li>
            <li><Link to="/contact" className="transition hover:text-slate-900">Contact</Link></li>
            <li><Link to="/login" className="transition hover:text-slate-900">Login</Link></li>
          </ul>

          <div className="hidden lg:block">
            <Link to="/register" className="flex items-center gap-2 rounded-full bg-[#1e2756] px-6 py-2.5 text-white shadow-md transition hover:bg-opacity-90">
              <i className="fa-regular fa-user"></i>
              <span>Become A Tasker</span>
            </Link>
          </div>

          <button type="button" onClick={() => setMobileMenuOpen((v) => !v)} className="text-slate-600 focus:outline-none lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h12M4 18h8" />
            </svg>
          </button>
        </div>

        <div className={`${mobileMenuOpen ? "block" : "hidden"} mt-4 border-t border-gray-100 bg-white lg:hidden`}>
          <ul className="flex flex-col space-y-4 py-4 font-medium text-slate-600">
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? "text-[#59b847]" : "")}>Home</NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => (isActive ? "text-[#59b847]" : "")}>About</NavLink>
            </li>
            <li>
              <NavLink to="/services" className={({ isActive }) => (isActive ? "text-[#59b847]" : "")}>Service</NavLink>
            </li>
            <li>
              <NavLink to="/blog" className={({ isActive }) => (isActive ? "text-[#59b847]" : "")}>Blog</NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={({ isActive }) => (isActive ? "text-[#59b847]" : "")}>Contact</NavLink>
            </li>
            <li>
              <NavLink to="/login" className={({ isActive }) => (isActive ? "text-[#59b847]" : "")}>Login</NavLink>
            </li>
            <li>
              <Link to="/register" className="inline-block w-full rounded-full bg-[#1e2756] px-6 py-2 text-center text-white">
                Become A Tasker
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <main className="py-8 lg:py-12">
        <section className="mx-auto max-w-7xl px-6">
          <div className="relative min-h-[420px] overflow-hidden rounded-[24px] lg:min-h-[520px]">
            <img src="/images/banner.png" alt="Decorator Banner" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/45"></div>

            <div className="relative z-10 grid h-full items-center gap-8 p-8 lg:grid-cols-[1fr_420px] lg:p-12">
              <div className="text-white">
                <h1 className="text-4xl font-bold leading-tight lg:text-5xl">
                  Find a Decorator
                  <br />
                  Near You
                </h1>
                <p className="mt-4 max-w-xl text-lg sm:text-xl text-white/95">Fill a Short form and get free quotes for a local Installer Near You</p>
              </div>

              <div className="overflow-hidden rounded-[24px] bg-white/90 shadow-xl backdrop-blur-sm">
                <h2 className="py-5 text-center text-2xl font-semibold text-[#163475]">Decorator Ready to Help</h2>
                <div className="h-px w-full bg-[#c8d2e4]"></div>

                <div className="space-y-4 p-5">
                  <div className="relative" data-dropdown-root>
                    <button
                      type="button"
                      className="w-full h-14 rounded-xl border border-[#d7deea] bg-white px-4 flex items-center justify-between text-[#163475]"
                      aria-expanded={openDropdown === "event"}
                      onClick={(event) => toggleDropdown("event", event)}
                    >
                      <span className="flex items-center gap-3 text-md">
                        <i className="fa-regular fa-calendar-check text-base"></i>
                        <span>{selectedEvent || "Event Type"}</span>
                      </span>
                      <i className={`fa-solid fa-chevron-down text-sm transition-transform ${openDropdown === "event" ? "rotate-180" : ""}`}></i>
                    </button>
                    <div className={`${openDropdown === "event" ? "" : "hidden"} absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-xl border border-[#d7deea] bg-white shadow-lg`}>
                      {["Wedding", "Birthday", "Corporate", "Engagement"].map((value) => (
                        <button key={value} type="button" className="w-full px-4 py-3 text-left hover:bg-[#f1f6ff]" onClick={(event) => selectDropdownValue("event", value, event)}>
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative" data-dropdown-root>
                    <button
                      type="button"
                      className="w-full h-14 rounded-xl border border-[#d7deea] bg-white px-4 flex items-center justify-between text-[#163475]"
                      aria-expanded={openDropdown === "size"}
                      onClick={(event) => toggleDropdown("size", event)}
                    >
                      <span className="flex items-center gap-3 text-md">
                        <i className="fa-regular fa-image text-base"></i>
                        <span>{selectedSize || "Decoration Size"}</span>
                      </span>
                      <i className={`fa-solid fa-chevron-down text-sm transition-transform ${openDropdown === "size" ? "rotate-180" : ""}`}></i>
                    </button>
                    <div className={`${openDropdown === "size" ? "" : "hidden"} absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-xl border border-[#d7deea] bg-white shadow-lg`}>
                      {["Small", "Medium", "Large"].map((value) => (
                        <button key={value} type="button" className="w-full px-4 py-3 text-left hover:bg-[#f1f6ff]" onClick={(event) => selectDropdownValue("size", value, event)}>
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 text-center">
                    <p className="text-4xl font-bold text-[#163475]">${estimatedPrice}</p>
                    <p className="mt-1 text-xl text-[#163475]">Estimated Price</p>
                    <a href="#" className="mt-5 inline-flex items-center justify-center rounded-full bg-[#2f87d6] px-5 py-3 text-md font-semibold text-white">
                      Continue
                      <i className="fa-solid fa-arrow-right ml-2 text-lg"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <section className="bg-[#f2f4f8] py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="max-w-3xl border-l-[5px] border-[#2f87d6] py-1 pl-4 lg:pl-5">
                <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-[#2f87d6] lg:text-5xl">Top Decorator Near You</h2>
              <p className="mt-3 max-w-2xl text-base leading-snug text-[#1f2d6e] sm:text-lg">
                Discover flexible earning opportunities, secure payments, and nearby tasks that let you work on your schedule with complete freedom.
              </p>
            </div>
            <div className="hidden items-center gap-3 pt-4 sm:flex">
              <button className="h-11 w-11 rounded-full bg-[#e6eaf2] text-[#95a3bd]"><i className="fa-solid fa-arrow-left"></i></button>
              <button className="h-11 w-11 rounded-full bg-[#2f87d6] text-white"><i className="fa-solid fa-arrow-right"></i></button>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-14">
            {taskers.map((tasker) => (
              <article key={tasker.name} className="relative rounded-xl border border-slate-200 bg-white px-5 pb-5 pt-14 shadow-sm">
                <img src={tasker.image} alt={tasker.name} className="absolute -top-10 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full object-cover ring-4 ring-white" />
                <h3 className="text-xl font-semibold text-[#1f2d6e]">
                  {tasker.name} <i className="fa-solid fa-circle-check text-sm text-[#2f87d6]"></i>
                </h3>
                <div className="mt-1 flex items-center justify-between text-sm text-[#1f2d6e]"><span>Decorator</span><span>Starting at $20/hr</span></div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full bg-[#eef3fb] px-3 py-1 text-sm text-[#1f2d6e]"><i className="fa-solid fa-star mr-1 text-yellow-400"></i>4.8</span>
                  <button className="rounded-full bg-[#2f87d6] px-5 py-2 text-sm font-semibold text-white">Selected Tasker</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-18 lg:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="testimonial-title text-4xl font-bold sm:text-5xl">What Our Customers Say</h2>
            <p className="testimonial-subtitle mt-3 text-sm sm:text-base">
              Real customers share honest feedback and experiences, helping others trust our services and book confidently with complete peace of mind.
            </p>
          </div>

          <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="testimonial-card testimonial-card--left">
              <div className="flex items-center gap-3">
                <img src="/images/Ellipse.svg" alt="" className="h-4 w-4" />
                <p className="testimonial-name">Adam Das</p>
              </div>
              <p className="testimonial-text mt-3">
                Excellent service, fast delivery, and top-quality product! The team was responsive, helpful, and exceeded expectations. I&apos;m delighted with my purchase and will definitely recommend this company to friends.
              </p>
              <div className="testimonial-stars">
                <img src="/images/yellowstar.svg" alt="star" className="h-4 w-4" />
                <img src="/images/yellowstar.svg" alt="star" className="h-4 w-4" />
                <img src="/images/yellowstar.svg" alt="star" className="h-4 w-4" />
                <img src="/images/yellowstar.svg" alt="star" className="h-4 w-4" />
                <img src="/images/yellowstar.svg" alt="star" className="h-4 w-4" />
              </div>
            </div>

            <div className="testimonial-photo h-[180px] lg:h-auto">
              <img src="/images/frontman.svg" alt="Customer" />
            </div>
          </div>

          <div className="mt-6 grid items-stretch gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="testimonial-photo h-[180px] lg:h-auto">
              <img src="/images/sideman.svg" alt="Customer" />
            </div>

            <div className="testimonial-card testimonial-card--left">
              <div className="flex items-center gap-3">
                <img src="/images/Ellipse.svg" alt="" className="h-4 w-4" />
                <p className="testimonial-name">Adam Das</p>
              </div>
              <p className="testimonial-text mt-3">
                Excellent service, fast delivery, and top-quality product! The team was responsive, helpful, and exceeded expectations. I&apos;m delighted with my purchase and will definitely recommend this company to friends.
              </p>
              <div className="testimonial-stars">
                <img src="/images/yellowstar.svg" alt="star" className="h-4 w-4" />
                <img src="/images/yellowstar.svg" alt="star" className="h-4 w-4" />
                <img src="/images/yellowstar.svg" alt="star" className="h-4 w-4" />
                <img src="/images/yellowstar.svg" alt="star" className="h-4 w-4" />
                <img src="/images/yellowstar.svg" alt="star" className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-[#1f2d6e]">
            <button className="text-4xl font-semibold leading-none">←</button>
            <button className="text-4xl font-semibold leading-none text-[#2f87d6]">→</button>
          </div>
        </div>
      </section>
      <section className="bg-[#f7f8fb] py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative min-h-[260px] overflow-visible rounded-[30px] bg-[#2f87d6] lg:min-h-[300px]">
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[30px]">
              <div
                className="absolute -bottom-2 -right-2 h-20 w-28 opacity-90"
                style={{ backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.95) 2px, transparent 2px)", backgroundSize: "12px 12px" }}
              ></div>
            </div>
            <div className="relative z-10 grid grid-cols-1 items-end gap-6 px-6 pb-0 pt-8 lg:grid-cols-[320px_1fr] lg:px-10">
              <div className="relative h-[240px] overflow-visible lg:h-[300px]"><img src="/images/whiteman.svg" alt="Worker" className="absolute bottom-0 left-0 h-[300px] w-auto object-contain lg:h-[360px]" /></div>
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
            {faqItems.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <article key={item.question} className="rounded-xl border border-[#d7dde9] border-l-[5px] border-l-[#1f3c87] bg-white px-6 py-5">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-sm font-semibold text-[#1f2d6e] sm:text-xl lg:text-[20px]">{item.question}</h3>
                    <button
                      type="button"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-[#2b4d9a] to-[#163475] text-3xl leading-none text-white shadow-md sm:h-12 sm:w-12 sm:text-4xl"
                      aria-expanded={isOpen}
                      aria-label="Toggle FAQ"
                      onClick={() => setOpenFaqIndex((prev) => (prev === index ? -1 : index))}
                    >
                      <span className="relative -translate-y-[2px]">{isOpen ? "×" : "+"}</span>
                    </button>
                  </div>
                  <div className={`mt-4 ${isOpen ? "" : "hidden"}`}>
                    <div className="h-px w-full bg-[#d8dce5]"></div>
                    <p className="mt-4 text-base text-[#1f2d6e] sm:text-lg lg:text-[16px]">{item.answer}</p>
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
              <ul className="mt-4 space-y-2 text-lg text-white/90"><li><a href="#">Post a task</a></li><li><a href="#">Browse tasks</a></li><li><a href="#">All Service</a></li><li><a href="#">Help</a></li></ul>
            </div>
            <div>
              <h4 className="text-2xl font-semibold">Company</h4>
              <ul className="mt-4 space-y-2 text-lg text-white/90"><li><a href="#">About us</a></li><li><a href="#">Careers</a></li><li><a href="#">Contact us</a></li><li><a href="#">Blog</a></li></ul>
            </div>
            <div>
              <h4 className="text-2xl font-semibold">Solutions</h4>
              <ul className="mt-4 space-y-2 text-lg text-white/90"><li><a href="#">Compliance</a></li><li><a href="#">Payments</a></li><li><a href="#">For Finance Teams</a></li><li><a href="#">For Legal Teams</a></li><li><a href="#">For Hiring Managers</a></li></ul>
            </div>
            <div>
              <h4 className="text-2xl font-semibold">Popular Location</h4>
              <ul className="mt-4 space-y-2 text-lg text-white/90"><li><a href="#">Sydney</a></li><li><a href="#">Melbourne</a></li><li><a href="#">Brisbane</a></li><li><a href="#">Perth</a></li><li><a href="#">Adelaide</a></li></ul>
            </div>
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

export default PosterPage;
