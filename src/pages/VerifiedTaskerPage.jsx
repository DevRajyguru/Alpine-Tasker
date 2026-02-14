import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

const taskers = [
  { image: "/images/micheal.svg", name: "Michael Reed", role: "Decorator", rate: "Starting at $20/hr", rating: "4.8" },
  { image: "/images/dannieal.svg", name: "Daniel Cooper", role: "Decorator", rate: "Starting at $20/hr", rating: "4.8" },
  { image: "/images/james.svg", name: "James Walker", role: "Decorator", rate: "Starting at $20/hr", rating: "4.8" },
  { image: "/images/robert.svg", name: "Robert Hughes", role: "Decorator", rate: "Starting at $20/hr", rating: "4.8" },
  { image: "/images/david.svg", name: "David Turner", role: "Decorator", rate: "Starting at $20/hr", rating: "4.8" },
  { image: "/images/ryan.svg", name: "Ryan Mitchell", role: "Decorator", rate: "Starting at $20/hr", rating: "4.8" },
];

const categories = [
  { image: "/images/cleaned.svg", title: "Snow Cleaning" },
  { image: "/images/jug.svg", title: "Gardening/ Lawn Care" },
  { image: "/images/cloud.svg", title: "Mounting" },
  { image: "/images/assembly.svg", title: "Assembly" },
  { image: "/images/moved.svg", title: "Moving" },
  { image: "/images/balloon.svg", title: "Decoration" },
];

const faqData = [
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

const defaultTasker = { image: "/images/ryan.svg", name: "Kevin Anderson", rate: "$20/hr", rating: "4.8" };
const randomOtp = () => Array.from({ length: 4 }, () => `${Math.floor(Math.random() * 10)}`);

function VerifiedTaskerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const returnToRef = useRef(location.state?.returnTo || null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(Boolean(location.state?.openBooking));
  const [bookingSummaryOpen, setBookingSummaryOpen] = useState(false);
  const [taskArrivedOpen, setTaskArrivedOpen] = useState(false);
  const [customerOtpOpen, setCustomerOtpOpen] = useState(false);
  const [selectedTasker, setSelectedTasker] = useState(defaultTasker);
  const [eventType, setEventType] = useState("");
  const [decorationSize, setDecorationSize] = useState("");
  const [faqOpenIndex, setFaqOpenIndex] = useState(0);
  const [arrivedOtp, setArrivedOtp] = useState(["3", "4", "1", "3"]);
  const [customerOtp, setCustomerOtp] = useState(["5", "5", "2", "3"]);
  const arrivedToCustomerTimerRef = useRef(null);

  const anyModalOpen = bookingOpen || bookingSummaryOpen || taskArrivedOpen || customerOtpOpen;

  useEffect(() => {
    if (anyModalOpen) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [anyModalOpen]);

  useEffect(() => {
    const onEscape = (event) => {
      if (event.key !== "Escape") return;
      if (customerOtpOpen) return setCustomerOtpOpen(false);
      if (taskArrivedOpen) {
        if (arrivedToCustomerTimerRef.current) {
          clearTimeout(arrivedToCustomerTimerRef.current);
          arrivedToCustomerTimerRef.current = null;
        }
        return setTaskArrivedOpen(false);
      }
      if (bookingSummaryOpen) return setBookingSummaryOpen(false);
      if (bookingOpen) {
        setBookingOpen(false);
        if (returnToRef.current) navigate(returnToRef.current);
      }
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [bookingOpen, bookingSummaryOpen, taskArrivedOpen, customerOtpOpen, navigate]);

  useEffect(() => {
    return () => {
      if (arrivedToCustomerTimerRef.current) clearTimeout(arrivedToCustomerTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!location.state?.openBooking) return;
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.pathname, location.state, navigate]);

  const openBooking = (tasker) => {
    setSelectedTasker({
      image: tasker.image,
      name: tasker.name,
      rate: tasker.rate.replace("Starting at ", ""),
      rating: tasker.rating,
    });
    setBookingOpen(true);
  };

  const confirmBooking = () => {
    if (!eventType.trim() || !decorationSize.trim()) {
      alert("Please select Event Type and Decoration Size.");
      return;
    }
    setBookingOpen(false);
    setBookingSummaryOpen(true);
  };

  const payNow = () => {
    if (arrivedToCustomerTimerRef.current) {
      clearTimeout(arrivedToCustomerTimerRef.current);
      arrivedToCustomerTimerRef.current = null;
    }
    setArrivedOtp(randomOtp());
    setCustomerOtp(randomOtp());
    setBookingSummaryOpen(false);
    setTaskArrivedOpen(true);
    arrivedToCustomerTimerRef.current = setTimeout(() => {
      setTaskArrivedOpen((isOpen) => {
        if (!isOpen) return isOpen;
        setCustomerOtpOpen(true);
        return false;
      });
      arrivedToCustomerTimerRef.current = null;
    }, 1200);
  };

  const closeTaskArrived = () => {
    if (arrivedToCustomerTimerRef.current) {
      clearTimeout(arrivedToCustomerTimerRef.current);
      arrivedToCustomerTimerRef.current = null;
    }
    setTaskArrivedOpen(false);
  };

  const closeBookingModal = () => {
    setBookingOpen(false);
    if (returnToRef.current) {
      navigate(returnToRef.current);
    }
  };

  return (
    <div className="bg-[#f3f5f9] text-slate-900">
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

          <button type="button" className="text-slate-600 focus:outline-none lg:hidden" onClick={() => setMobileMenuOpen((v) => !v)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h12M4 18h8" />
            </svg>
          </button>
        </div>

        <div className={`${mobileMenuOpen ? "block" : "hidden"} mt-4 border-t border-gray-100 bg-white lg:hidden`}>
          <ul className="flex flex-col space-y-4 py-4 font-medium text-slate-600">
            <li><NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => (isActive ? "text-[#59b847]" : "")}>Home</NavLink></li>
            <li><NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => (isActive ? "text-[#59b847]" : "")}>About</NavLink></li>
            <li><NavLink to="/services" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => (isActive ? "text-[#59b847]" : "")}>Service</NavLink></li>
            <li><NavLink to="/blog" className={({ isActive }) => (isActive ? "text-[#59b847]" : "")}>Blog</NavLink></li>
            <li><NavLink to="/contact" className={({ isActive }) => (isActive ? "text-[#59b847]" : "")}>Contact</NavLink></li>
            <li><NavLink to="/login" className={({ isActive }) => (isActive ? "text-[#59b847]" : "")}>Login</NavLink></li>
            <li>
              <Link to="/register" className="inline-block w-full rounded-full bg-[#1e2756] px-6 py-2 text-center text-white">
                Become A Tasker
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <main className="py-16 lg:py-20">
        <section className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2f87d6] lg:text-5xl">Verified Decoration Taskers</h1>
            <p className="mt-3 text-base text-[#1f2d6e] sm:text-lg">Skilled local professionals ready to help you with your task immediately.</p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {taskers.map((tasker) => (
              <article key={tasker.name} className="relative rounded-xl border border-slate-200 bg-white px-5 pb-5 pt-14 shadow-sm">
                <img src={tasker.image} alt={tasker.name} className="absolute -top-10 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full object-cover ring-4 ring-white" />
                <h3 className="flex items-center gap-2 text-xl font-semibold text-[#1f2d6e]">
                  {tasker.name}
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#2f87d6] text-white">
                    <i className="fa-solid fa-check-double text-[7px]"></i>
                  </span>
                </h3>
                <div className="mt-1 flex items-center justify-between text-sm text-[#1f2d6e]">
                  <span>{tasker.role}</span><span>{tasker.rate}</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full bg-[#eef3fb] px-3 py-1 text-sm text-[#1f2d6e]"><i className="fa-solid fa-star mr-1 text-yellow-400"></i>{tasker.rating}</span>
                  <button type="button" className="selected-tasker-btn rounded-full bg-[#2f87d6] px-5 py-2 text-sm font-semibold text-white" onClick={() => openBooking(tasker)}>
                    Selected Tasker
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <section className="relative overflow-hidden bg-[#f7f8fb] py-16 lg:py-20">
        <img src="/images/wave-lines.svg" alt="" className="pointer-events-none absolute bottom-8 left-0 w-full opacity-40" />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2f87d6]">Top Categories</h2>
            <p className="mt-3 text-base text-[#1f2d6e]">Our platform is designed with a range of innovative features that cater to your specific needs</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div key={category.title} className="rounded-2xl border border-b-[4px] border-slate-200 border-b-[#2f87d6] bg-white px-6 py-7 text-center shadow-sm">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-[#f8fafc]">
                  <img src={category.image} alt={category.title} className="h-10 w-10" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-[#1f2d6e]">{category.title}</h3>
              </div>
            ))}
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
              <div className="relative h-[240px] overflow-visible lg:h-[300px]">
                <img src="/images/whiteman.svg" alt="Worker" className="absolute bottom-0 left-0 h-[300px] w-auto object-contain lg:h-[360px]" />
              </div>
              <div className="text-white lg:pb-12">
                <h2 className="text-3xl sm:text-4xl font-bold leading-tight lg:text-6xl">Ready to Book a Service?</h2>
                <p className="mt-3 max-w-3xl text-lg text-white/90 lg:text-xl">Book trusted services in minutes with simple scheduling, transparent pricing, and secure payments.</p>
                <Link to="/register" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-[#1f2d6e]">
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

          <div className="mt-10 space-y-5" id="faq-accordion">
            {faqData.map((faq, index) => {
              const isOpen = faqOpenIndex === index;
              return (
                <article key={faq.question} className="faq-item rounded-xl border border-[#d7dde9] border-l-[5px] border-l-[#1f3c87] bg-white px-6 py-5" data-open={isOpen ? "true" : "false"}>
                  <div className="flex items-center justify-between gap-4">
                    <h3 className={`${index === 0 ? "text-sm" : "text-xl"} font-semibold text-[#1f2d6e] sm:text-xl lg:text-[20px]`}>{faq.question}</h3>
                    <button
                      type="button"
                      className="faq-toggle flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-[#2b4d9a] to-[#163475] text-3xl leading-none text-white shadow-md sm:h-12 sm:w-12 sm:text-4xl"
                      aria-expanded={isOpen}
                      aria-label="Toggle FAQ"
                      onClick={() => setFaqOpenIndex((prev) => (prev === index ? -1 : index))}
                    >
                      <span className="faq-symbol relative -translate-y-[2px]">{isOpen ? "×" : "+"}</span>
                    </button>
                  </div>
                  <div className={`faq-answer mt-4 ${isOpen ? "" : "hidden"}`}>
                    <div className="h-px w-full bg-[#d8dce5]"></div>
                    <p className="mt-4 text-base text-[#1f2d6e] sm:text-lg lg:text-[16px]">{faq.answer}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <div id="booking-modal" className={`${bookingOpen ? "flex" : "hidden"} fixed inset-0 z-[100] items-center justify-center bg-black/45 px-4`} aria-hidden={bookingOpen ? "false" : "true"} onClick={(event) => { if (event.target === event.currentTarget) closeBookingModal(); }}>
        <div className="w-full max-w-[660px] rounded-[18px] bg-white px-5 py-5 shadow-2xl sm:px-6" role="dialog" aria-modal="true" aria-labelledby="booking-modal-title">
          <div className="flex items-start justify-between gap-4">
            <h3 id="booking-modal-title" className="text-2xl font-semibold text-[#2f87d6] sm:text-3xl">Let&apos;s Start With Basics</h3>
            <button id="booking-modal-close" type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#d5dfef] bg-[#f4f8ff] text-[#2f87d6]" aria-label="Close booking popup" onClick={closeBookingModal}>
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <form className="mt-4 space-y-3" onSubmit={(event) => event.preventDefault()}>
            <div className="relative">
              <select id="booking-event-type" className="h-12 w-full appearance-none rounded-xl border border-[#dbe3f0] bg-[#f8fafc] px-4 pr-10 text-base text-[#1f2d6e] outline-none focus:border-[#2f87d6]" value={eventType} onChange={(event) => setEventType(event.target.value)}>
                <option value="" disabled>Event Type</option>
                <option>Wedding</option>
                <option>Birthday</option>
                <option>Corporate</option>
                <option>Engagement</option>
              </select>
              <i className="fa-solid fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#1f3c87]"></i>
            </div>

            <div className="relative">
              <select id="booking-decoration-size" className="h-12 w-full appearance-none rounded-xl border border-[#dbe3f0] bg-[#f8fafc] px-4 pr-10 text-base text-[#1f2d6e] outline-none focus:border-[#2f87d6]" value={decorationSize} onChange={(event) => setDecorationSize(event.target.value)}>
                <option value="" disabled>Decoration Size</option>
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
              </select>
              <i className="fa-solid fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#1f3c87]"></i>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="relative"><input type="date" className="h-12 w-full rounded-xl border border-[#dbe3f0] bg-[#f8fafc] px-4 pr-10 text-base text-[#1f2d6e] outline-none focus:border-[#2f87d6]" /></div>
              <div className="relative"><input type="time" className="h-12 w-full rounded-xl border border-[#dbe3f0] bg-[#f8fafc] px-4 pr-4 text-base text-[#1f2d6e] outline-none focus:border-[#2f87d6]" /></div>
            </div>

            <textarea placeholder="Description" rows="3" className="w-full resize-none rounded-xl border border-[#dbe3f0] bg-[#f8fafc] px-4 py-3 text-base text-[#1f2d6e] outline-none placeholder:text-[#1f2d6e] focus:border-[#2f87d6]"></textarea>

            <button id="booking-confirm-btn" type="button" className="mt-1 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#2f87d6] text-lg font-semibold text-white hover:bg-[#2678bf]" onClick={confirmBooking}>
              Confirm Book
            </button>
          </form>
        </div>
      </div>

      <div id="booking-summary-modal" className={`${bookingSummaryOpen ? "flex" : "hidden"} fixed inset-0 z-[110] items-center justify-center bg-black/45 px-4`} aria-hidden={bookingSummaryOpen ? "false" : "true"} onClick={(event) => { if (event.target === event.currentTarget) setBookingSummaryOpen(false); }}>
        <div className="w-full max-w-[760px] rounded-[20px] bg-white px-6 py-6 shadow-2xl sm:px-7" role="dialog" aria-modal="true" aria-labelledby="booking-summary-title">
          <div className="relative">
            <h3 id="booking-summary-title" className="text-center text-2xl font-semibold text-[#2f87d6]">Booking Summary</h3>
            <button id="booking-summary-close" type="button" className="absolute -top-1 right-0 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#d5dfef] bg-[#f4f8ff] text-[#2f87d6]" aria-label="Close booking summary" onClick={() => setBookingSummaryOpen(false)}>
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <article className="rounded-xl border border-[#d7dde9] bg-white shadow-sm">
              <div id="summary-event-title" className="rounded-t-xl bg-[#eef3fb] px-5 py-3 text-md font-semibold text-[#2f87d6]">{eventType || "Gardening / Law Care"}</div>
              <div className="px-5 py-4 text-[#1f2d6e]">
                <h4 className="text-md font-semibold">Selected Options</h4>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex items-center gap-2"><img src="/images/toggle.svg" alt="" className="h-4 w-4" /> <span id="summary-event-option">Event Type: {eventType || "Wedding"}</span></li>
                  <li className="flex items-center gap-2"><img src="/images/toggle.svg" alt="" className="h-4 w-4" /> <span id="summary-size-option">Decoration Size: {decorationSize || "Medium"}</span></li>
                </ul>
              </div>
            </article>

            <article className="rounded-xl border border-[#d7dde9] bg-white shadow-sm">
              <div className="rounded-t-xl bg-[#eef3fb] px-5 py-3 text-md font-semibold text-[#2f87d6]">Selected Tasker</div>
              <div className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <img id="summary-tasker-image" src={selectedTasker.image} alt="Tasker" className="h-24 w-24 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p id="summary-tasker-name" className="text-md font-semibold text-[#1f2d6e]">
                      {selectedTasker.name} <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#2f87d6] align-middle text-white"><i className="fa-solid fa-check-double text-[7px]"></i></span>
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[#1f2d6e]">
                      <span className="rounded-full bg-[#eef3fb] px-3 py-1 text-sm"><i className="fa-solid fa-star mr-1 text-yellow-400"></i>{selectedTasker.rating}</span>
                      <span id="summary-tasker-rate" className="text-md font-semibold">{selectedTasker.rate}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 h-px w-full bg-[#d8dce5]"></div>
                <p className="mt-3 text-md font-semibold text-[#1f2d6e]">Total Price : $20</p>
              </div>
            </article>
          </div>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button id="pay-now-btn" type="button" className="inline-flex h-12 min-w-[190px] items-center justify-center rounded-full bg-[#2f87d6] px-8 text-md font-semibold text-white" onClick={payNow}>Pay Now</button>
            <span className="text-4xl text-[#2f87d6]">Or</span>
            <button type="button" className="inline-flex h-12 min-w-[260px] items-center justify-center rounded-full border-2 border-[#2f87d6] px-8 text-md font-semibold text-[#2f87d6]">Pay After Service</button>
          </div>
        </div>
      </div>

      <div id="task-arrived-modal" className={`${taskArrivedOpen ? "flex" : "hidden"} fixed inset-0 z-[120] items-center justify-center bg-black/45 px-4`} aria-hidden={taskArrivedOpen ? "false" : "true"} onClick={(event) => { if (event.target !== event.currentTarget) return; closeTaskArrived(); }}>
        <div className="w-full max-w-[680px] rounded-[22px] bg-white px-5 py-6 shadow-2xl sm:px-8" role="dialog" aria-modal="true" aria-labelledby="task-arrived-title">
          <div className="flex justify-end">
            <button id="task-arrived-close" type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d5dfef] bg-white text-[#2f87d6] shadow" aria-label="Close task arrived popup" onClick={closeTaskArrived}>
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>
          <div className="-mt-2 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#2f87d6] text-white"><i className="fa-solid fa-check relative -translate-y-[2px] text-5xl"></i></div>
            <h3 id="task-arrived-title" className="mt-4 text-4xl font-semibold text-[#1f2d6e]">Task Arrived</h3>
            <p className="mt-3 text-2xl font-semibold text-[#1f2d6e]">Your OTP</p>
            <div className="mt-5 grid grid-cols-4 gap-3 sm:mx-auto sm:max-w-[420px] sm:gap-3">
              {arrivedOtp.map((digit, idx) => (
                <div key={`arrived-${idx}`} id={`arrived-digit-${idx + 1}`} className="flex h-[72px] items-center justify-center rounded-[18px] border border-[#e2e6ef] text-3xl font-semibold text-[#364154] shadow-[0_10px_18px_rgba(47,135,214,0.12)]">{digit}</div>
              ))}
            </div>
            <p className="mt-5 text-2xl text-[#3f5a91]">Share This OTP With The Tasker</p>
          </div>
        </div>
      </div>

      <div id="customer-otp-modal" className={`${customerOtpOpen ? "flex" : "hidden"} fixed inset-0 z-[130] items-center justify-center bg-black/45 px-4`} aria-hidden={customerOtpOpen ? "false" : "true"} onClick={(event) => { if (event.target === event.currentTarget) setCustomerOtpOpen(false); }}>
        <div className="w-full max-w-[680px] rounded-[22px] bg-white px-5 py-6 shadow-2xl sm:px-8" role="dialog" aria-modal="true" aria-labelledby="customer-otp-title">
          <div className="flex justify-end">
            <button id="customer-otp-close" type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d5dfef] bg-white text-[#2f87d6] shadow" aria-label="Close customer OTP popup" onClick={() => setCustomerOtpOpen(false)}>
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>
          <div className="mt-1 text-center">
            <h3 id="customer-otp-title" className="text-4xl font-semibold text-[#1f2d6e]">Enter Customer OTP</h3>
            <p className="mt-3 text-2xl font-semibold text-[#1f2d6e]">Your OTP</p>
            <div className="mt-5 grid grid-cols-4 gap-3 sm:mx-auto sm:max-w-[420px] sm:gap-3">
              {customerOtp.map((digit, idx) => (
                <div key={`customer-${idx}`} id={`customer-digit-${idx + 1}`} className="flex h-[72px] items-center justify-center rounded-[18px] border border-[#e2e6ef] text-3xl font-semibold text-[#364154] shadow-[0_10px_18px_rgba(47,135,214,0.12)]">{digit}</div>
              ))}
            </div>
            <p className="mt-5 text-2xl text-[#3f5a91]">Share This OTP With The Tasker</p>
            <button type="button" className="mt-4 inline-flex h-12 min-w-[210px] items-center justify-center rounded-full bg-[#2f87d6] px-7 text-md font-semibold text-white hover:bg-[#2678bf]">Verify & Start Work</button>
          </div>
        </div>
      </div>

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

export default VerifiedTaskerPage;
