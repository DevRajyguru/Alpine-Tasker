import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const categories = ["Moving", "Delivery", "Cleaning"];
const locations = ["Singapur", "Dubai", "New York"];

const statCards = [
  { icon: "garden.svg", name: "Gardening/...", count: "6500+" },
  { icon: "snow.svg", name: "Snow Cleaning", count: "9500+" },
  { icon: "cloud.svg", name: "Mounting", count: "5600+" },
  { icon: "assembly.svg", name: "Assembly", count: "4562+" },
  { icon: "move.svg", name: "Moving", count: "4590+" },
  { icon: "balloon.svg", name: "Decoration", count: "7000+" },
];

const popularProjects = [
  { image: "cleaning.svg", title: "Snow Cleaning", price: "$45.00/hr" },
  { image: "gardening.svg", title: "Gardening/ Lawn", price: "$85.00/hr" },
  { image: "mouting.svg", title: "Mounting", price: "$25.00/hr" },
  { image: "assemble.svg", title: "Assembly", price: "$40.00/hr" },
  { image: "moving.svg", title: "Moving", price: "$50.00/hr" },
  { image: "decoration.svg", title: "Decoration", price: "$45.00/hr" },
];

const taskers = [
  { avatar: "snowman.svg", name: "Snow", service: "Snow Cleaning" },
  { avatar: "john.svg", name: "John Smith", service: "Moving" },
  { avatar: "antoneete.svg", name: "Antoinette", service: "Decoration" },
  { avatar: "thompson.svg", name: "Thompson", service: "Assembly" },
];

const blogs = [
  { image: "home.svg", day: "05", title: "Popular Home Services Online", text: "Short guide to the most booked home services and why people prefer ...." },
  { image: "online.svg", day: "15", title: "Benefits of Online Service Booking", text: "Key advantages of booking home services online, from convenience ...." },
  { image: "maintenence.svg", day: "25", title: "Easy Home Maintenance Tips", text: "Quick and practical tips to keep your home clean, safe, and well ...." },
];

const blogSlides = [
  blogs,
  [blogs[1], blogs[2], blogs[0]],
  [blogs[2], blogs[0], blogs[1]],
];

const topCategories = [
  { icon: "cleaned.svg", name: "Snow Cleaning" },
  { icon: "jug.svg", name: "Gardening/ Lawn Care" },
  { icon: "cloud.svg", name: "Mounting" },
  { icon: "assembly.svg", name: "Assembly" },
  { icon: "moved.svg", name: "Moving" },
  { icon: "balloon.svg", name: "Decoration" },
];

const testimonialSlides = [
  {
    top: {
      name: "Adam Das",
      text: "Excellent service, fast delivery, and top-quality product! The team was responsive, helpful, and exceeded expectations. I'm delighted with my purchase and will definitely recommend this company to friends.",
      image: "/images/frontman.svg",
    },
    bottom: {
      name: "Don Lee",
      text: "Excellent service, fast delivery, and top-quality product! The team was responsive, helpful, and exceeded expectations. I'm delighted with my purchase and will definitely recommend this company to friends.",
      image: "/images/sideman.svg",
    },
  },
  {
    top: {
      name: "Sophia Kim",
      text: "Booking was super easy and the tasker arrived on time. The whole experience felt smooth, reliable, and professional from start to finish.",
      image: "/images/sideman.svg",
    },
    bottom: {
      name: "Michael Ross",
      text: "Great quality work and friendly support team. I liked the clear pricing and fast confirmation. I will absolutely use this service again.",
      image: "/images/frontman.svg",
    },
  },
  {
    top: {
      name: "Riya Patel",
      text: "I was impressed with how quickly everything was arranged. Communication was clear, and the final result exceeded my expectations.",
      image: "/images/frontman.svg",
    },
    bottom: {
      name: "Daniel Cruz",
      text: "Very trustworthy platform with skilled professionals. The process was simple, and the task got done exactly the way I wanted.",
      image: "/images/sideman.svg",
    },
  },
];

function HomePage() {
  const [category, setCategory] = useState("Moving");
  const [location, setLocation] = useState("Singapur");
  const [catOpen, setCatOpen] = useState(false);
  const [locOpen, setLocOpen] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [testimonialDirection, setTestimonialDirection] = useState("next");
  const [blogIndex, setBlogIndex] = useState(0);
  const catRef = useRef(null);
  const locRef = useRef(null);

  useEffect(() => {
    const onOutside = (event) => {
      if (catRef.current && !catRef.current.contains(event.target)) setCatOpen(false);
      if (locRef.current && !locRef.current.contains(event.target)) setLocOpen(false);
    };
    window.addEventListener("click", onOutside);
    return () => window.removeEventListener("click", onOutside);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setBlogIndex((prev) => (prev + 1) % blogSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <section className="relative overflow-hidden pb-24 pt-8">
        <div className="absolute inset-x-0 bottom-6 mx-auto max-w-7xl px-6">
          <div className="h-44 lg:h-52 bg-[#1e2756] rounded-[2.5rem]"></div>
        </div>
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 relative">
            <div
              className="hidden lg:block w-[300px] xl:w-[340px] 2xl:w-[380px] h-[560px] rounded-3xl overflow-hidden border-4 border-white shadow-xl lg:absolute lg:top-4 lg:z-10 lg:left-[-320px] xl:left-[-260px] 2xl:left-[-220px]"
            >
              <img src="/images/main1.svg" alt="Office scene" className="w-full h-full object-cover" />
            </div>
            <div className="relative w-full lg:max-w-[860px] lg:mx-auto lg:mt-2">
              <div className="relative z-10 w-full bg-[#1e2756] rounded-3xl p-8 lg:p-12 pb-14 border border-blue-800 shadow-2xl">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">Smart Task Posting &amp;<br />Talent Selection</h1>
                <div className="bg-white rounded-2xl p-3 flex flex-col md:flex-row md:items-center gap-4 shadow-lg">
                  <div ref={catRef} className="relative w-full md:flex-1 md:min-w-[220px] border-b md:border-b-0 md:border-r border-gray-100 px-4 py-2">
                    <button onClick={(e) => { e.stopPropagation(); setCatOpen((v) => !v); setLocOpen(false); }} className="flex items-center gap-3 w-full text-left cursor-pointer">
                      <div className="bg-blue-50 p-2 rounded-lg"><i className="fa-solid fa-grip text-blue-600"></i></div>
                      <div className="flex-1"><p className="text-xs text-gray-400 font-semibold uppercase">Category</p><p className="text-sm font-bold text-gray-700">{category}</p></div>
                      <i className="fa-solid fa-chevron-down w-4 h-4 text-gray-400"></i>
                    </button>
                    <div className={`${catOpen ? "block" : "hidden"} absolute left-0 top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 z-50`}>
                      <div className="py-2">
                        {categories.map((item) => (
                          <button key={item} onClick={(e) => { e.stopPropagation(); setCategory(item); setCatOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">{item}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div ref={locRef} className="relative w-full md:flex-1 md:min-w-[220px] px-4 py-2">
                    <button onClick={(e) => { e.stopPropagation(); setLocOpen((v) => !v); setCatOpen(false); }} className="flex items-center gap-3 w-full text-left cursor-pointer">
                      <div className="bg-blue-50 p-2 rounded-lg"><i className="fa-solid fa-location-dot text-blue-600"></i></div>
                      <div className="flex-1"><p className="text-xs text-gray-400 font-semibold uppercase">Location</p><p className="text-sm font-bold text-gray-700">{location}</p></div>
                      <i className="fa-solid fa-chevron-down w-4 h-4 text-gray-400"></i>
                    </button>
                    <div className={`${locOpen ? "block" : "hidden"} absolute left-0 top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 z-50`}>
                      <div className="py-2">
                        {locations.map((item) => (
                          <button key={item} onClick={(e) => { e.stopPropagation(); setLocation(item); setLocOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">{item}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button className="w-full md:w-[170px] md:ml-auto bg-[#3288e6] text-white px-8 py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition shadow-md"><i className="fa-solid fa-magnifying-glass"></i>Search</button>
                </div>
                <div className="mt-8 bg-white rounded-[2rem] p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden lg:overflow-visible md:min-h-[210px] lg:min-h-0">
                  <div className="lg:pr-40">
                    <p className="text-gray-600 font-medium mb-5 text-lg">Turn Your Skills Into Earnings and Start Working on Your Own Schedule</p>
                    <Link to="/register" className="inline-flex items-center gap-2 bg-[#3288e6] text-white px-6 py-3 rounded-full font-bold hover:bg-blue-500 transition">Earn Money as Tasker <span>&rarr;</span></Link>
                  </div>
                  <img
                    src="/images/man.svg"
                    alt="Tasker"
                    className="hidden md:block absolute right-2 md:right-4 lg:right-8 bottom-0 h-[165px] lg:h-[216px] xl:h-[232px] object-contain z-20"
                  />
                </div>
              </div>
              <div className="absolute right-2 bottom-24 h-16 w-16 rounded-full border-[8px] border-white bg-[#1e2756] z-20 flex items-center justify-center shadow-xl sm:-right-10 sm:bottom-10 sm:h-20 sm:w-20 sm:border-[10px]"><img src="/images/Arrow.svg" alt="Arrow" className="h-7 w-7 -rotate-45 sm:h-9 sm:w-9" /></div>
            </div>
            <div
              className="hidden lg:block w-[300px] xl:w-[340px] 2xl:w-[380px] h-[560px] rounded-3xl overflow-hidden border-4 border-white shadow-xl lg:absolute lg:top-4 lg:z-10 lg:right-[-320px] xl:right-[-260px] 2xl:right-[-220px]"
            >
              <img src="/images/main2.svg" alt="Kitchen interior" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="relative max-w-[520px] mx-auto lg:mx-0">
              <img src="/images/bluemen.svg" alt="Trust person" className="w-full max-w-[520px] mx-auto" />
              <div className="absolute -top-3 left-2 sm:left-0 bg-white shadow-lg rounded-2xl px-4 py-3 flex items-center gap-3 border scale-90 sm:scale-100 origin-top-left">
                <img src="/images/girl.svg" alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
                <div className="text-sm"><div className="flex items-center gap-1 font-semibold text-slate-800">5.0<img src="/images/yellowstar.svg" alt="star" className="w-4 h-4" /></div><div className="text-xs py-1 rounded-lg inline-block">Overall Rating</div></div>
              </div>
              <div className="absolute bottom-12 right-2 sm:right-4 bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2 text-xs sm:text-sm text-slate-700 mb-2 scale-90 sm:scale-100 origin-bottom-right">
                <img src="/images/like.svg" alt="check" className="w-4 h-4" />
                <span>Job Completed</span><span className="text-xs text-slate-400 ml-2">2m ago</span>
              </div>
              <div className="absolute bottom-1 right-10 sm:right-16 bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2 text-xs sm:text-sm text-slate-700 scale-90 sm:scale-100 origin-bottom-right">
                <div className="relative w-4 h-4"><img src="/images/round.svg" alt="payment" className="w-4 h-4" /><img src="/images/right.svg" alt="rupee" className="w-2 h-2 absolute inset-0 m-auto" /></div>
                <span>Payment released</span><span className="text-xs text-slate-400 ml-2">2m ago</span>
              </div>
            </div>
            <div className="mt-8 lg:mt-0 lg:-mt-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#2f87d6] leading-tight">Trust and Safety Features <br className="hidden lg:block" /> For Your Protection</h2>
              <div className="mt-6 space-y-5">
                <div className="flex gap-3"><img src="/images/rupees.svg" alt="Secure Payments" className="w-6 h-6 mt-1" /><div><h4 className="font-semibold text-slate-800">Secure Payments</h4><p className="text-slate-600 text-sm">Only release payment when the task is completed to your satisfaction</p></div></div>
                <div className="flex gap-3"><img src="/images/star.svg" alt="Ratings" className="w-6 h-6 mt-1" /><div><h4 className="font-semibold text-slate-800">Trusted ratings and reviews</h4><p className="text-slate-600 text-sm">Pick the right person for the task based on real ratings and reviews from other users</p></div></div>
                <div className="flex gap-3"><img src="/images/tick.svg" alt="Insurance" className="w-6 h-6 mt-1" /><div><h4 className="font-semibold text-slate-800">Insurance for peace of mind</h4><p className="text-slate-600 text-sm">We provide liability insurance for Taskers performing most task activities</p></div></div>
              </div>
              <Link
                to="/verified-tasker"
                state={{ openBooking: true, returnTo: "/" }}
                className="mt-8 inline-flex items-center rounded-full bg-[#2f87d6] px-6 py-3 font-semibold text-white transition hover:bg-[#2478c4]"
              >
                Post Your task for free &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-[28px] border border-slate-200 bg-[#f6f7f9] px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#2f87d6]">Be Your Own Boss</h2>
                <p className="mt-4 text-base sm:text-lg text-[#1f2d6e] max-w-[520px]">Whether you're a genius spreadsheet guru or a diligent carpenter, find your next job on Task Service</p>
                <ul className="mt-6 space-y-3 text-base sm:text-lg text-[#1f2d6e]">
                  <li className="flex items-start gap-3"><span className="mt-1.5 h-3.5 w-3.5 rounded-full border-2 border-[#1f2d6e]"></span>Free access to thousands of job opportunities</li>
                  <li className="flex items-start gap-3"><span className="mt-1.5 h-3.5 w-3.5 rounded-full border-2 border-[#1f2d6e]"></span>No subscription or credit fees</li>
                  <li className="flex items-start gap-3"><span className="mt-1.5 h-3.5 w-3.5 rounded-full border-2 border-[#1f2d6e]"></span>Earn extra income on a flexible schedule</li>
                  <li className="flex items-start gap-3"><span className="mt-1.5 h-3.5 w-3.5 rounded-full border-2 border-[#1f2d6e]"></span>Grow your business and client base</li>
                </ul>
                <Link to="/register" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#2f87d6] px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-sm transition hover:bg-[#2478c4]">Earn Money as a Tasker <span>&rarr;</span></Link>
              </div>
              <div className="relative w-full max-w-[520px] mx-auto lg:mx-0 lg:ml-auto">
                <div className="rounded-2xl bg-[#f0f1f4] p-4 sm:p-6">
                  <div className="relative h-[300px] sm:h-[320px] rounded-2xl bg-[#0c182c] overflow-visible">
                    <img src="/images/girl-tasker.png" alt="Tasker" className="absolute right-3 bottom-0 h-full w-auto object-cover -translate-y-3" />
                    <div className="absolute -bottom-2 right-4 flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-white"></span><span className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs sm:text-sm text-[#1f2d6e]">Tasker</span></div>
                  </div>
                </div>
                <div className="hidden sm:flex absolute left-4 top-10 flex-col gap-3">
                  <div className="w-[150px] rounded-2xl bg-white px-4 py-3 shadow-md border border-slate-100 border-b-4 border-b-[#2f87d6] text-center"><p className="text-sm text-[#1f2d6e]">Happy Users</p><p className="text-base font-semibold text-[#1f2d6e]">2M+ User</p></div>
                  <div className="w-[150px] rounded-2xl bg-white px-4 py-3 shadow-md border border-slate-100 border-b-4 border-b-[#2f87d6] flex flex-col items-center text-center"><img src="/images/bell.svg" alt="Alert" className="h-5 w-5" /><p className="mt-2 text-sm font-semibold text-[#1f2d6e]">New Job Alert</p></div>
                  <div className="w-[150px] rounded-2xl bg-white px-4 py-3 shadow-md border border-slate-100 border-b-4 border-b-[#2f87d6] text-center"><p className="text-sm text-[#1f2d6e]">Total Earning</p><p className="text-base font-semibold text-[#1f2d6e]">$13,066</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {statCards.map((card) => (
              <div key={card.name} className="rounded-2xl border border-slate-200 bg-[#f6f7fb] px-5 py-6 text-center shadow-sm">
                <img src={`/images/${card.icon}`} alt={card.name} className="mx-auto h-9 w-9 mb-3 rounded-xl bg-white p-2" />
                <p className="text-sm text-[#1f2d6e]">{card.name}</p>
                <p className="text-lg font-semibold text-[#2f87d6]">{card.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2f87d6]">Popular Project</h2>
            <p className="mt-3 text-sm sm:text-base text-[#1f2d6e]">Our platform is designed with a range of innovative features that cater to your specific needs</p>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularProjects.map((item) => (
              <div key={item.title} className="rounded-[14px] bg-[#1f3f88] p-[2px] shadow-sm">
                <div className="rounded-[12px] overflow-hidden bg-[#1f3f88]">
                  <img src={`/images/${item.image}`} alt={item.title} className="h-[250px] w-full object-cover" />
                  <div className="-mt-4 px-3 pb-3 relative z-10">
                    <div className="h-12 rounded-[12px] bg-[#f1f4fa] px-5 flex items-center justify-between font-semibold text-[#1f2d6e]">
                      <span>{item.title}</span>
                      {item.price}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-[#f7f8fb] overflow-hidden">
        <div className="relative w-full bg-[#0f172a] px-6 py-10 lg:px-10 overflow-visible">
          <div className="max-w-7xl mx-auto px-6">
            <img
              src="/images/waves.svg"
              alt=""
              className="pointer-events-none absolute left-0 top-0 w-56 opacity-25"
            />
            <img
              src="/images/waves.svg"
              alt=""
              className="pointer-events-none absolute right-0 top-0 w-72 scale-x-[-1] opacity-25"
            />
            <img
              src="/images/waves.svg"
              alt=""
              className="pointer-events-none absolute right-44 top-24 w-72 scale-x-[-1] opacity-20"
            />
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="h-10 w-[3px] bg-white/80 rounded-full"></span>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">Available Taskers</h2>
                  <p className="text-sm text-white/70">Browse our top Providers to appoint for your service</p>
                </div>
              </div>
              <Link to="/tasker" className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1f2d6e] shadow-sm">View All &rarr;</Link>
            </div>
            <div className="-mt-2 grid translate-y-20 grid-cols-1 gap-5 sm:translate-y-28 sm:grid-cols-2 lg:grid-cols-4">
              {taskers.map((tasker) => (
                <div key={tasker.name} className="bg-white rounded-2xl shadow-sm px-4 pb-4 pt-12 text-center relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-16 bg-white rounded-t-xl"></div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
                    <img src={`/images/${tasker.avatar}`} alt={tasker.name} className="h-20 w-20 rounded-full border-4 border-white object-cover shadow" />
                  </div>
                  <div className="flex items-center justify-start gap-2 text-left">
                    <h4 className="font-semibold text-[#1f2d6e]">{tasker.name}</h4>
                    <img src="/images/tick.svg" alt="Verified" className="h-4 w-4" />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-[#1f2d6e]">
                    <span>{tasker.service}</span>
                    <span className="font-semibold">$45.00/hr</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-[#1f2d6e] bg-[#f1f5fb] px-2 py-1 rounded-full"><img src="/images/yellowstar.svg" alt="Star" className="h-4 w-4" />4.8</div>
                    <Link to="/tasker" className="rounded-full bg-[#2f87d6] px-4 py-2 text-xs font-semibold text-white">View Details</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2f87d6]">What Our Customers Say</h2>
            <p className="mt-3 text-sm sm:text-base text-[#1f2d6e]">Real customers share honest feedback and experiences, helping others trust our services and book confidently with complete peace of mind.</p>
          </div>

          <div
            key={testimonialIndex}
            className="mt-10"
            style={{ animation: `${testimonialDirection === "next" ? "testimonialSlideNext" : "testimonialSlidePrev"} 420ms ease` }}
          >
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-stretch">
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 border-l-[4px] border-l-[#2f87d6] bg-white p-6 shadow-[0_8px_24px_rgba(16,24,40,0.12)]">
                <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 opacity-20" style={{ background: "url('/images/wave.svg') no-repeat center / contain" }}></div>
                <div className="flex items-center gap-3"><img src="/images/Ellipse.svg" alt="" className="h-4 w-4" /><p className="text-lg font-semibold text-[#1f2d6e]">{testimonialSlides[testimonialIndex].top.name}</p></div>
                <p className="mt-3 text-[#1f2d6e] leading-7">{testimonialSlides[testimonialIndex].top.text}</p>
                <div className="mt-4 flex items-center gap-1">{[1,2,3,4,5].map((s)=><img key={`t1-${testimonialIndex}-${s}`} src="/images/yellowstar.svg" alt="star" className="h-4 w-4" />)}</div>
              </div>
              <div className="rounded-2xl overflow-hidden h-[180px] lg:h-auto"><img src={testimonialSlides[testimonialIndex].top.image} alt="Customer" className="h-full w-full object-cover" /></div>
            </div>

            <div className="mt-6 grid lg:grid-cols-[0.8fr_1.2fr] gap-6 items-stretch">
              <div className="rounded-2xl overflow-hidden h-[180px] lg:h-auto"><img src={testimonialSlides[testimonialIndex].bottom.image} alt="Customer" className="h-full w-full object-cover" /></div>
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 border-l-[4px] border-l-[#2f87d6] bg-white p-6 shadow-[0_8px_24px_rgba(16,24,40,0.12)]">
                <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 opacity-20" style={{ background: "url('/images/wave.svg') no-repeat center / contain" }}></div>
                <div className="flex items-center gap-3"><img src="/images/Ellipse.svg" alt="" className="h-4 w-4" /><p className="text-lg font-semibold text-[#1f2d6e]">{testimonialSlides[testimonialIndex].bottom.name}</p></div>
                <p className="mt-3 text-[#1f2d6e] leading-7">{testimonialSlides[testimonialIndex].bottom.text}</p>
                <div className="mt-4 flex items-center gap-1">{[1,2,3,4,5].map((s)=><img key={`t2-${testimonialIndex}-${s}`} src="/images/yellowstar.svg" alt="star" className="h-4 w-4" />)}</div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-[#1f2d6e]">
            <button
              type="button"
              className="text-4xl font-semibold leading-none"
              onClick={() => {
                setTestimonialDirection("prev");
                setTestimonialIndex((prev) => (prev === 0 ? testimonialSlides.length - 1 : prev - 1));
              }}
            >
              &larr;
            </button>
            <button
              type="button"
              className="text-4xl font-semibold leading-none text-[#2f87d6]"
              onClick={() => {
                setTestimonialDirection("next");
                setTestimonialIndex((prev) => (prev + 1) % testimonialSlides.length);
              }}
            >
              &rarr;
            </button>
          </div>

          <style>{`
            @keyframes testimonialSlideNext {
              from { opacity: 0; transform: translateX(28px); }
              to { opacity: 1; transform: translateX(0); }
            }
            @keyframes testimonialSlidePrev {
              from { opacity: 0; transform: translateX(-28px); }
              to { opacity: 1; transform: translateX(0); }
            }
          `}</style>
        </div>
      </section>

      <section className="py-16 bg-[#f7f8fb]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2f87d6]">Read Our Blog</h2>
              <p className="mt-2 max-w-2xl text-sm sm:text-base text-[#1f2d6e]">Discover practical how-to guides, service tips, and updates written to help you save time, choose better services, and stay informed with reliable, easy-to-read content.</p>
            </div>
            <Link to="blog" className="mt-1 inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-full bg-[#2f87d6] px-4 py-2 text-sm font-semibold text-white">View All &rarr;</Link>
          </div>
          <div className="mt-8 overflow-hidden">
            <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${blogIndex * 100}%)` }}>
              {blogSlides.map((slide, slideIdx) => (
                <div key={slideIdx} className="w-full shrink-0">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {slide.map((blog) => (
                      <div key={`${slideIdx}-${blog.title}`} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="relative">
                          <img src={`/images/${blog.image}`} alt={blog.title} className="h-48 w-full object-cover" />
                          <div className="absolute top-3 right-3 rounded-lg bg-white px-2 py-1 text-xs font-semibold text-[#1f2d6e] text-center leading-none">{blog.day}<br /><span className="text-[10px] font-normal">Dec</span></div>
                        </div>
                        <div className="p-4">
                          <h4 className="text-sm font-semibold text-[#2f87d6]">{blog.title}</h4>
                          <p className="mt-2 text-xs text-[#1f2d6e]">{blog.text}</p>
                          <div className="mt-4 flex items-center justify-between rounded-xl border border-[#e7ebf3] bg-[#f5f7fb] px-3 py-2">
                            <div className="flex items-center gap-2 text-xs text-[#1f2d6e]"><img src="/images/avtar.svg" alt="Adam Das" className="h-6 w-6 rounded-full object-cover" />Adam Das</div>
                            <Link to="/blog" className="text-xs font-semibold text-[#2f87d6] inline-flex items-center gap-1">Read More<img src="/images/darkarrow.svg" alt="" className="h-3 w-3" /></Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex justify-center gap-3">
            {blogSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to blog slide ${i + 1}`}
                onClick={() => setBlogIndex(i)}
                className={`h-3 w-3 rounded-full transition-colors ${blogIndex === i ? "bg-[#2f87d6]" : "bg-[#cbd5e1]"}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16 lg:py-20 bg-[#f7f8fb] overflow-hidden">
        <img src="/images/wave-lines.svg" alt="" className="pointer-events-none absolute left-0 bottom-8 w-full opacity-40" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2f87d6]">Top Categories</h2>
            <p className="mt-3 text-base text-[#1f2d6e]">Our platform is designed with a range of innovative features that cater to your specific needs</p>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topCategories.map((item) => (
              <div key={item.name} className="rounded-2xl border border-slate-200 bg-white shadow-sm px-6 py-7 text-center border-b-[4px] border-b-[#2f87d6]">
                <div className="mx-auto h-24 w-24 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-[#f8fafc]"><img src={`/images/${item.icon}`} alt={item.name} className="h-10 w-10" /></div>
                <h3 className="mt-4 text-xl font-semibold text-[#1f2d6e]">{item.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20 bg-[#f7f8fb]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-[30px] bg-[#2f87d6] overflow-visible min-h-[260px] lg:min-h-[300px]">
            <div className="pointer-events-none absolute inset-0 rounded-[30px] overflow-hidden z-0"><div className="absolute -right-2 -bottom-2 w-28 h-20 opacity-90" style={{ backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.95) 2px, transparent 2px)", backgroundSize: "12px 12px" }}></div></div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[320px_1fr] items-end gap-6 px-6 lg:px-10 pt-8 pb-0">
              <div className="relative h-[240px] lg:h-[300px] overflow-visible"><img src="/images/whiteman.svg" alt="Worker" className="absolute left-0 bottom-0 h-[300px] lg:h-[360px] w-auto object-contain" /></div>
              <div className="text-white lg:pb-12">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">Ready to Book a Service?</h2>
                <p className="mt-3 text-md lg:text-xl text-white/90 max-w-3xl">Book trusted services in minutes with simple scheduling, transparent pricing, and secure payments.</p>
                <Link to="/register" className="mt-6 mb-4 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-[#1f2d6e]">Become A Tasker<img src="/images/darkarrow.svg" alt="" className="h-3 w-3" /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;

