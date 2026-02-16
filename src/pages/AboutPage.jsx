import { useState } from "react";
import { Link } from "react-router-dom";

const serviceList = [
  "Snow Cleaning",
  "Assembly",
  "Gardening/ Lawn Care",
  "Moving",
  "Mounting",
  "Decoration",
];

const bestServices = [
  { icon: "/images/garden.svg", title: "Gardening/...", count: "6500+" },
  { icon: "/images/snow.svg", title: "Snow Cleaning", count: "9500+" },
  { icon: "/images/cloud.svg", title: "Mounting", count: "5600+" },
  { icon: "/images/assembly.svg", title: "Assembly", count: "4562+" },
  { icon: "/images/move.svg", title: "Moving", count: "4590+" },
  { icon: "/images/balloon.svg", title: "Decoration", count: "7000+" },
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

function AboutPage() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <>
      <section className="py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-[22px] border border-[#c9dff8] bg-[#eef3fa] p-6 lg:p-9 overflow-hidden">
            <img src="/images/biground.svg" alt="" className="pointer-events-none absolute -left-16 -bottom-16 w-56 opacity-95" />

            <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="rounded-2xl border border-[#d8e3f3] bg-[#f8fbff] p-3 sm:p-4">
                  <div className="h-6 rounded-lg bg-slate-100 flex items-center gap-2 px-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400"></span>
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400"></span>
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span>
                  </div>
                  <img src="/images/main1.svg" alt="Team workspace" className="mt-4 h-[300px] sm:h-[340px] lg:h-[360px] w-full rounded-xl object-cover object-center bg-white" />
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <img src="/images/about1.svg" alt="Office" className="h-28 sm:h-32 w-full rounded-xl object-cover object-center" />
                    <img src="/images/about2.svg" alt="Working" className="h-28 sm:h-32 w-full rounded-xl object-cover object-center" />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2f87d6]">Our Services</h2>
                <p className="mt-3 text-lg text-[#1f2d6e] max-w-xl">
                  Teachers don't get lost in the grid view and have a dedicated Podium space.
                </p>
                <div className="mt-6 grid sm:grid-cols-2 gap-4 text-[#1f2d6e]">
                  {serviceList.map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="h-5 w-5 rounded-full inline-flex items-center justify-center">
                        <img src="/images/darkround.svg" alt="" />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
                <Link to="/services" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#2f87d6] px-6 py-3 text-white font-semibold">
                  Get Started &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="relative max-w-[520px] mx-auto">
              <img src="/images/bluemen.svg" alt="Trust person" className="w-full max-w-[520px] mx-auto" />
              <div className="absolute -top-3 left-2 sm:left-0 bg-white shadow-lg rounded-2xl px-4 py-3 flex items-center gap-3 border scale-90 sm:scale-100 origin-top-left">
                <img src="/images/girl.svg" alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
                <div className="text-sm">
                  <div className="flex items-center gap-1 font-semibold text-slate-800">5.0 <img src="/images/yellowstar.svg" alt="star" className="w-4 h-4" /></div>
                  <div className="text-xs py-1 rounded-lg inline-block">Overall Rating</div>
                </div>
              </div>
              <div className="absolute bottom-12 right-2 sm:right-4 bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2 text-xs sm:text-sm text-slate-700 mb-2 scale-90 sm:scale-100 origin-bottom-right">
                <img src="/images/like.svg" alt="check" className="w-4 h-4" />
                <span>Job Completed</span>
                <span className="text-xs text-slate-400 ml-2">2m ago</span>
              </div>
              <div className="absolute bottom-1 right-10 sm:right-16 bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2 text-xs sm:text-sm text-slate-700 scale-90 sm:scale-100 origin-bottom-right">
                <div className="relative w-4 h-4">
                  <img src="/images/round.svg" alt="payment" className="w-4 h-4" />
                  <img src="/images/right.svg" alt="rupee" className="w-2 h-2 absolute inset-0 m-auto" />
                </div>
                <span>Payment released</span>
                <span className="text-xs text-slate-400 ml-2">2m ago</span>
              </div>
            </div>

            <div className="mt-8 lg:mt-0 lg:-mt-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#2f87d6] leading-tight">
                Trust and Safety Features <br className="hidden lg:block" />
                For Your Protection
              </h2>
              <div className="mt-6 space-y-5">
                <div className="flex gap-3">
                  <img src="/images/rupees.svg" alt="Secure Payments" className="w-6 h-6 mt-1" />
                  <div>
                    <h4 className="font-semibold text-slate-800">Secure Payments</h4>
                    <p className="text-slate-600 text-sm">Only release payment when the task is completed to your satisfaction</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <img src="/images/star.svg" alt="Ratings" className="w-6 h-6 mt-1" />
                  <div>
                    <h4 className="font-semibold text-slate-800">Trusted ratings and reviews</h4>
                    <p className="text-slate-600 text-sm">Pick the right person for the task based on real ratings and reviews from other users</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <img src="/images/tick.svg" alt="Insurance" className="w-6 h-6 mt-1" />
                  <div>
                    <h4 className="font-semibold text-slate-800">Insurance for peace of mind</h4>
                    <p className="text-slate-600 text-sm">We provide liability insurance for Taskers performing most task activities</p>
                  </div>
                </div>
              </div>
              <Link
                to="/verified-tasker"
                state={{ openBooking: true, returnTo: "/about" }}
                className="mt-8 inline-flex rounded-full bg-[#2f87d6] px-6 py-3 font-semibold text-white transition hover:bg-[#2478c4]"
              >
                Post Your task for free &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-20 bg-[#f7f8fb]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-[26px] bg-[#2f87d6] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-7 lg:gap-8 items-center">
              <div className="text-white">
                <h2 className="text-[34px] sm:text-4xl lg:text-5xl font-bold leading-tight">Be Your Own Boss</h2>
                <p className="mt-3 sm:mt-4 text-lg sm:text-xl text-white/95 max-w-2xl">
                  Whether you're a genius spreadsheet guru or a diligent carpenter, find your next job on Task Service
                </p>
                <ul className="mt-5 sm:mt-6 space-y-2.5 sm:space-y-3 text-lg sm:text-xl">
                  <li className="flex items-center gap-3"><span className="h-4 w-4 rounded-full border-2 border-white"></span>Free access to thousands of job opportunities</li>
                  <li className="flex items-center gap-3"><span className="h-4 w-4 rounded-full border-2 border-white"></span>No subscription or credit fees</li>
                  <li className="flex items-center gap-3"><span className="h-4 w-4 rounded-full border-2 border-white"></span>Earn extra income on a flexible schedule</li>
                  <li className="flex items-center gap-3"><span className="h-4 w-4 rounded-full border-2 border-white"></span>Grow your business and client base</li>
                </ul>
                <Link to="/register" className="mt-6 sm:mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[#1f2d6e] text-lg sm:text-xl font-semibold">
                  Earn Money as a Tasker &rarr;
                </Link>
              </div>

              <div className="relative w-full max-w-[520px] mx-auto lg:ml-auto">
                <div className="rounded-3xl bg-[#86b4da] p-3 sm:p-5">
                  <div className="relative rounded-3xl bg-[#2f87d6] h-[430px] sm:h-[360px] overflow-hidden">
                    <img src="/images/girl-tasker.png" alt="Tasker" className="absolute right-[-18px] sm:right-0 bottom-0 h-[76%] sm:h-[95%] w-auto object-contain" />
                    <div className="absolute right-2 sm:right-4 bottom-2 sm:bottom-0 flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-white"></span>
                      <span className="rounded-lg bg-white px-2.5 sm:px-3 py-1 text-[#1f2d6e] text-base sm:text-xl">Tasker</span>
                    </div>
                  </div>
                </div>

                <div className="absolute left-2.5 sm:left-4 top-3 sm:top-10 space-y-2 sm:space-y-3 z-20">
                  <div className="w-[136px] sm:w-[170px] rounded-2xl bg-white border border-slate-200 border-b-[3px] border-b-[#2f87d6] px-2.5 sm:px-3 py-2 sm:py-2.5 shadow-md text-center">
                    <p className="text-xs sm:text-base text-[#1f2d6e]">Happy Users</p>
                    <p className="text-base sm:text-xl font-semibold text-[#1f2d6e] whitespace-nowrap">2M+ User</p>
                  </div>
                  <div className="w-[136px] sm:w-[170px] rounded-2xl bg-white border border-slate-200 border-b-[3px] border-b-[#2f87d6] px-2.5 sm:px-3 py-2 sm:py-2.5 shadow-md text-center">
                    <img src="/images/bell.svg" alt="" className="h-3.5 w-3.5 sm:h-4 sm:w-4 mx-auto" />
                    <p className="mt-1.5 sm:mt-2 text-base sm:text-xl font-semibold text-[#1f2d6e] whitespace-nowrap">New Job Alert</p>
                  </div>
                  <div className="w-[136px] sm:w-[170px] rounded-2xl bg-white border border-slate-200 border-b-[3px] border-b-[#2f87d6] px-2.5 sm:px-3 py-2 sm:py-2.5 shadow-md text-center">
                    <p className="text-xs sm:text-base text-[#1f2d6e]">Total Earning</p>
                    <p className="text-base sm:text-xl font-semibold text-[#1f2d6e]">$13,066</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20 bg-[#f7f8fb]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2f87d6]">Designed for trust</h2>
            <p className="mt-5 max-w-4xl mx-auto text-xl text-[#1f2d6e] leading-relaxed">
              Select a service, confirm your booking, and get it done. We simplify every step with easy scheduling, trusted support, and seamless service delivery you can count on.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <div className="relative">
              <div className="absolute left-1/2 -translate-x-1/2 -top-[29px] z-20 h-[58px] w-[58px] rounded-full bg-[#2f87d6] flex items-center justify-center"><div className="h-7 w-7 rounded-full bg-white"></div></div>
              <div className="rounded-2xl border-t-[3px] border-[#2f87d6] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)] px-8 pt-16 pb-10 text-center min-h-[250px]">
                <h3 className="text-2xl font-bold text-[#2f87d6] leading-tight">Two-way OTP on arrival</h3>
                <p className="mt-5 text-sm text-[#1f2d6e] leading-relaxed">Customer receives a one-time code. Tasker must enter it to start work.</p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute left-1/2 -translate-x-1/2 -top-[29px] z-20 h-[58px] w-[58px] rounded-full bg-[#2f87d6] flex items-center justify-center"><div className="h-7 w-7 rounded-full bg-white"></div></div>
              <div className="rounded-2xl border-t-[3px] border-[#2f87d6] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)] px-8 pt-16 pb-10 text-center min-h-[250px]">
                <h3 className="text-2xl font-bold text-[#2f87d6] leading-tight">Provider verification</h3>
                <p className="mt-5 text-sm text-[#1f2d6e] leading-relaxed">ID document checks and admin approvals before providers go live.</p>
              </div>
            </div>
            <div className="relative md:col-span-2 xl:col-span-1">
              <div className="absolute left-1/2 -translate-x-1/2 -top-[29px] z-20 h-[58px] w-[58px] rounded-full bg-[#2f87d6] flex items-center justify-center"><div className="h-7 w-7 rounded-full bg-white"></div></div>
              <div className="rounded-2xl border-t-[3px] border-[#2f87d6] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)] px-8 pt-16 pb-10 text-center min-h-[250px]">
                <h3 className="text-2xl font-bold text-[#2f87d6] leading-tight">Heavy-task safety logic</h3>
                <p className="mt-5 text-sm text-[#1f2d6e] leading-relaxed">Build a leading platform delivering reliable, convenient services for everyone.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 lg:py-20 bg-[#f7f8fb] overflow-hidden">
        <img src="/images/halfcircle.svg" alt="" className="pointer-events-none absolute -left-24 top-8 w-52 h-52 object-contain" />
        <img src="/images/secondhalf.svg" alt="" className="pointer-events-none absolute right-0 bottom-0 w-52 h-52 lg:w-56 lg:h-56 object-contain" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2f87d6]">Task Service Best Services</h2>
            <p className="mt-4 text-[#1f2d6e] text-xl">Love by airtrave all services and amzine trip booked plane</p>
          </div>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
            {bestServices.map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-200 bg-white px-3 py-4 text-center shadow-sm min-h-[178px]">
                <div className="mx-auto h-10 w-10 rounded-xl bg-[#f4f8ff] flex items-center justify-center">
                  <img src={item.icon} alt="" className="h-5 w-5 object-contain" />
                </div>
                <p className="mt-3 text-[#1f2d6e] text-[18px] leading-tight">{item.title}</p>
                <p className="mt-1 text-[#2f87d6] text-[28px] font-semibold leading-tight">{item.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20 bg-[#f7f8fb]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-[30px] bg-[#2f87d6] overflow-visible min-h-[260px] lg:min-h-[300px]">
            <div className="pointer-events-none absolute inset-0 rounded-[30px] overflow-hidden z-0">
              <div
                className="absolute -right-2 -bottom-2 w-28 h-20 opacity-90"
                style={{
                  backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.95) 2px, transparent 2px)",
                  backgroundSize: "12px 12px",
                }}
              ></div>
            </div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[320px_1fr] items-end gap-6 px-6 lg:px-10 pt-8 pb-0">
              <div className="relative h-[240px] lg:h-[300px] overflow-visible">
                <img src="/images/whiteman.svg" alt="Worker" className="absolute left-0 bottom-0 h-[300px] lg:h-[360px] w-auto object-contain" />
              </div>
              <div className="text-white lg:pb-12">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">Ready to Book a Service?</h2>
                <p className="mt-3 text-lg lg:text-xl text-white/90 max-w-3xl">
                  Book trusted services in minutes with simple scheduling, transparent pricing, and secure payments.
                </p>
                <Link to="/register" className="mt-6 mb-4 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-[#1f2d6e] sm:mb-0">
                  Become A Tasker
                  <img src="/images/darkarrow.svg" alt="" className="h-3 w-3" />
                </Link>
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
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? -1 : i)}
                      className="h-11 w-11 sm:h-12 sm:w-12 shrink-0 rounded-xl bg-gradient-to-b from-[#2b4d9a] to-[#163475] text-white text-3xl sm:text-4xl leading-none flex items-center justify-center shadow-md"
                      aria-expanded={isOpen}
                      aria-label="Toggle FAQ"
                    >
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

export default AboutPage;
