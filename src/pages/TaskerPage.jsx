import { useState } from "react";
import { Link } from "react-router-dom";

const topTaskers = [
  { image: "micheal.svg", name: "Michael Reed" },
  { image: "dannieal.svg", name: "Daniel Cooper" },
  { image: "james.svg", name: "James Walker" },
  { image: "robert.svg", name: "Robert Hughes" },
  { image: "david.svg", name: "David Turner" },
  { image: "ryan.svg", name: "Ryan Mitchell" },
];

const faqItems = [
  { q: "1. How do I book a service?", a: "Absolutely! You can enroll in multiple courses simultaneously and access them at your convenience." },
  { q: "2. Are the service professionals verified?", a: "Yes, all professionals go through identity and background checks before activation." },
  { q: "3. How can I make a payment?", a: "You can pay securely by card, wallet, or online banking through our checkout." },
  { q: "4. Can I cancel or reschedule a booking?", a: "Yes, you can cancel or reschedule from your booking dashboard based on policy." },
  { q: "5.Will I receive a booking confirmation?", a: "Yes, you receive instant confirmation via app and email after successful booking." },
];

const earnWays = [
  { bg: "assemble.svg", icon: "assembly.svg", title: "Assembly", earn: "Earn $140 per Day" },
  { bg: "mouting.svg", icon: "cloud.svg", title: "Mounting", earn: "Earn $190 per Day" },
  { bg: "moving.svg", icon: "moved.svg", title: "moving", earn: "Earn $100 per Day" },
  { bg: "banner.png", icon: "balloon.svg", title: "Decoration", earn: "Earn $180 per Day" },
];

function TaskerPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [topTaskersSlide, setTopTaskersSlide] = useState(0);
  const topTaskerSlides = [
    topTaskers,
    [...topTaskers.slice(3), ...topTaskers.slice(0, 3)],
  ];

  return (
    <>
      <section className="py-10 lg:py-12 bg-[#f7f8fb]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-[22px] min-h-[420px]">
            <img src="/images/banner.png" alt="Decoration Jobs" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[#1f2d6e]/45"></div>
            <div className="relative z-10 grid lg:grid-cols-[1fr_430px] gap-8 items-center h-full px-8 py-10 lg:px-12">
              <div className="text-white">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">Decoration Jobs<br />in Your Area</h1>
                <p className="mt-4 text-xl text-white/95">Browse through over 1500 Snow Cleaning Jobs.</p>
              </div>
              <div className="rounded-3xl bg-white/90 p-7 backdrop-blur-sm">
                <h3 className="text-3xl font-semibold text-[#1f2d6e] text-center">Decoration Services</h3>
                <div className="mt-5 h-px w-full bg-[#d6dce8]"></div>
                <ul className="mt-5 space-y-3 text-[#1f2d6e] text-base">
                  {["Wall art & frame hanging", "Festive & event decorations", "Curtain & lighting setup", "Room styling & arrangement", "Decoration setup services"].map((item) => (
                    <li key={item} className="flex items-center gap-3"><img src="/images/toggle.svg" alt="" className="h-5 w-5 shrink-0" /><span>{item}</span></li>
                  ))}
                </ul>
                <Link to="/register" className="mt-7 inline-flex items-center justify-center rounded-full bg-[#2f87d6] px-7 py-3 text-base font-semibold text-white">Join As a Tasker</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-[#f2f4f8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="max-w-3xl border-l-[5px] border-[#2f87d6] pl-4 lg:pl-5 py-1">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-[#2f87d6]">Top Mounting Taskers</h2>
              <p className="mt-3 max-w-2xl text-base sm:text-lg leading-snug text-[#1f2d6e]">Discover flexible earning opportunities, secure payments, and nearby tasks that let you work on your schedule with complete freedom.</p>
            </div>
            <div className="hidden sm:flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={() =>
                  setTopTaskersSlide((prev) => (prev === 0 ? topTaskerSlides.length - 1 : prev - 1))
                }
                className="h-11 w-11 rounded-full bg-[#e6eaf2] text-[#95a3bd]"
              >
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <button
                type="button"
                onClick={() =>
                  setTopTaskersSlide((prev) => (prev + 1) % topTaskerSlides.length)
                }
                className="h-11 w-11 rounded-full bg-[#2f87d6] text-white"
              >
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 lg:gap-y-14">
            {topTaskerSlides[topTaskersSlide].map((t) => (
              <article
                key={`${t.name}-${topTaskersSlide}`}
                className="relative rounded-xl border border-slate-200 bg-white px-5 pb-5 pt-14 shadow-sm"
              >
                <img src={`/images/${t.image}`} alt={t.name} className="absolute -top-10 left-1/2 -translate-x-1/2 h-24 w-24 rounded-full object-cover ring-4 ring-white" />
                <h3 className="text-xl font-semibold text-[#1f2d6e]">{t.name} <i className="fa-solid fa-circle-check text-[#2f87d6] text-sm"></i></h3>
                <div className="mt-1 flex items-center justify-between text-sm text-[#1f2d6e]"><span>Decorator</span><span>Starting at $20/hr</span></div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full bg-[#eef3fb] px-3 py-1 text-sm text-[#1f2d6e]"><i className="fa-solid fa-star text-yellow-400 mr-1"></i>4.8</span>
                  <Link to="/verified-tasker" className="rounded-full bg-[#2f87d6] px-5 py-2 text-sm font-semibold text-white">Selected Tasker</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20 bg-[#f7f8fb]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2f87d6]">Why Join Alpine Tasker</h2>
            <p className="mt-4 max-w-3xl mx-auto text-base sm:text-lg leading-snug text-[#1f2d6e]">Discover flexible earning opportunities, secure payments, and nearby tasks that let you work on your schedule with complete freedom.</p>
          </div>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              ["Earn for Your Skills", "From repairs to cleaning, delivery to assembly, get paid for what you’re already good at with fair, transparent payouts."],
              ["Jobs Near You", "Find nearby tasks using location-based listings. Spend less time traveling and more time earning."],
              ["Safe & Secure Platform", "Secure payments protect you and customers, ensuring safe transactions throughout every task completed together."],
            ].map(([title, text]) => (
              <article key={title} className="relative rounded-2xl bg-white border border-slate-200 border-t-[3px] border-t-[#2f87d6] shadow-sm px-8 py-10 text-center">
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 h-14 w-14 rounded-full bg-[#2f87d6] flex items-center justify-center"><div className="h-7 w-7 rounded-full bg-[#f7f8fb]"></div></div>
                <h3 className="text-2xl font-semibold text-[#2f87d6]">{title}</h3>
                <p className="mt-4 text-base leading-relaxed text-[#1f2d6e]">{text}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 text-center"><Link to="/register" className="inline-flex items-center rounded-full bg-[#2f87d6] px-8 py-3 text-base font-semibold text-white">Become A Tasker</Link></div>
        </div>
      </section>

      <section className="py-14 lg:py-20 bg-[#eef1f6]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2f87d6]">Find More Ways to Earn</h2>
            <p className="mt-4 text-base sm:text-lg text-[#1f2d6e]">Discover more earning opportunities by completing different tasks using your skills.</p>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {earnWays.map((item) => (
              <article key={item.title} className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                <div className="relative">
                  <img src={`/images/${item.bg}`} alt={item.title} className="h-24 w-full object-cover" />
                  <img src={`/images/${item.icon}`} alt="" className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 object-contain brightness-0 invert drop-shadow-[0_0_1px_rgba(255,255,255,0.9)]" />
                </div>
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between gap-3"><h3 className="text-2xl font-semibold text-[#1f2d6e]">{item.title}</h3><button className="h-8 w-8 rounded-full bg-[#2f87d6] text-white text-xs"><i className="fa-solid fa-chevron-right"></i></button></div>
                  <p className="mt-1 text-base text-[#1f2d6e]">{item.earn}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 text-center"><Link to="/services" className="inline-flex items-center rounded-full bg-[#2f87d6] px-8 py-3 text-base font-semibold text-white">Explore More Jobs</Link></div>
        </div>
      </section>

      <section className="py-14 lg:py-20 bg-[#f7f8fb]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-[30px] bg-[#2f87d6] overflow-visible min-h-[260px] lg:min-h-[300px]">
            <div className="pointer-events-none absolute inset-0 rounded-[30px] overflow-hidden z-0">
              <div className="absolute -right-2 -bottom-2 w-28 h-20 opacity-90" style={{ backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.95) 2px, transparent 2px)", backgroundSize: "12px 12px" }}></div>
            </div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[320px_1fr] items-end gap-6 px-6 lg:px-10 pt-8 pb-0">
              <div className="relative h-[240px] lg:h-[300px] overflow-visible"><img src="/images/whiteman.svg" alt="Worker" className="absolute left-0 bottom-0 h-[300px] lg:h-[360px] w-auto object-contain" /></div>
              <div className="text-white lg:pb-12">
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight">Ready to Book a Service?</h2>
                <p className="mt-3 text-lg lg:text-xl text-white/90 max-w-3xl">Book trusted services in minutes with simple scheduling, transparent pricing, and secure payments.</p>
                <Link to="/register" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-[#1f2d6e]">Become A Tasker<img src="/images/darkarrow.svg" alt="" className="h-3 w-3" /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-[#f7f8fb]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2f87d6]">Frequently Asked Questions</h2>
            <p className="mt-5 text-base sm:text-lg lg:text-xl text-[#1f2d6e]">Still you have any questions? Contact our Team via support@taskservice.com</p>
          </div>
          <div className="mt-10 space-y-5">
            {faqItems.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <article key={faq.q} className="rounded-xl border border-[#d7dde9] bg-white border-l-[5px] border-l-[#1f3c87] px-6 py-5">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-sm sm:text-xl lg:text-[20px] font-semibold text-[#1f2d6e]">{faq.q}</h3>
                    <button type="button" onClick={() => setOpenFaq(isOpen ? -1 : i)} className="h-11 w-11 sm:h-12 sm:w-12 shrink-0 rounded-xl bg-gradient-to-b from-[#2b4d9a] to-[#163475] text-white text-3xl sm:text-4xl leading-none flex items-center justify-center shadow-md" aria-expanded={isOpen} aria-label="Toggle FAQ">
                      <span className="relative inline-block -translate-y-[4px]">{isOpen ? "x" : "+"}</span>
                    </button>
                  </div>
                  {isOpen && (
                    <div className="mt-4">
                      <div className="h-px w-full bg-[#d8dce5]"></div>
                      <p className="mt-4 text-base sm:text-lg lg:text-[16px] text-[#1f2d6e]">{faq.a}</p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

export default TaskerPage;
