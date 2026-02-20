import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

const featuredCategories = [
  { image: "/images/cleaning.svg", title: "Snow Cleaning", price: "$45.00/hr", type: "Cleaning", location: "Dubai" },
  { image: "/images/gardening.svg", title: "Gardening/ Lawn", price: "$85.00/hr", type: "Gardening", location: "Sydney" },
  { image: "/images/mouting.svg", title: "Mounting", price: "$25.00/hr", type: "Mounting", location: "New York" },
  { image: "/images/assemble.svg", title: "Assembly", price: "$40.00/hr", type: "Assembly", location: "Melbourne" },
  { image: "/images/moving.svg", title: "Moving", price: "$50.00/hr", type: "Moving", location: "Singapore" },
  { image: "/images/decoration.svg", title: "Decoration", price: "$45.00/hr", type: "Decoration", location: "Perth" },
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

function ServicesPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All Category");
  const [locationSearch, setLocationSearch] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([
    "All Category",
    "Cleaning",
    "Gardening",
    "Mounting",
    "Assembly",
    "Moving",
    "Decoration",
  ]);

  useEffect(() => {
    const token = localStorage.getItem("alpine_token");
    if (!token) return;

    (async () => {
      try {
        const res = await api.get("/categories");
        const rows = Array.isArray(res.data?.categories) ? res.data.categories : [];
        const names = rows.map((row) => row?.name).filter(Boolean);
        if (names.length) {
          setCategoryOptions(["All Category", ...names]);
        }
      } catch {
        // Keep default category options for guest/non-consented sessions.
      }
    })();
  }, []);

  const filteredCategories = useMemo(() => {
    return featuredCategories.filter((item) => {
      const byType = selectedCategory === "All Category" || item.type === selectedCategory;
      const byLocation =
        locationSearch.trim() === "" ||
        item.location.toLowerCase().includes(locationSearch.trim().toLowerCase());
      return byType && byLocation;
    });
  }, [selectedCategory, locationSearch]);

  const handleSearch = () => {
    const guestToken = (() => {
      const existing = localStorage.getItem("alpine_guest_token");
      if (existing) return existing;
      const created = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem("alpine_guest_token", created);
      return created;
    })();

    api
      .post("/search-events", {
        category: selectedCategory,
        location: locationSearch || "",
        source: "services_search",
        guest_token: localStorage.getItem("alpine_token") ? null : guestToken,
      })
      .catch(() => {
        // Keep UX moving even if analytics logging fails.
      })
      .finally(() => {
        navigate("/verified-tasker", {
          state: {
            searchCategory: selectedCategory === "All Category" ? "" : selectedCategory,
            searchLocation: locationSearch || "",
          },
        });
      });
  };

  return (
    <>
      <section className="relative overflow-hidden bg-[#e7e9ee]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 bottom-6 h-72 w-[420px] rounded-[999px] border-t border-[#bdd6f0]"></div>
          <div className="absolute -left-28 bottom-0 h-72 w-[480px] rounded-[999px] border-t border-[#bdd6f0]"></div>
          <div className="absolute -right-24 top-56 h-52 w-[360px] rounded-[999px] border-t border-[#bdd6f0]"></div>
          <div className="absolute -right-16 top-64 h-48 w-[320px] rounded-[999px] border-t border-[#bdd6f0]"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-14">
          <div className="mb-8 flex flex-col gap-6 lg:mb-9 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h1 className="text-3xl font-bold leading-tight text-[#2d86d8] sm:text-[44px]">Featured Categories</h1>
              <p className="mt-2.5 max-w-lg text-lg leading-tight text-[#1f437c] sm:text-[24px]">
                Our platform is designed with a range of innovative features that cater to your specific needs
              </p>
            </div>

            <div className="flex w-full flex-col gap-2.5 sm:flex-row lg:w-auto lg:items-center">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-11 w-full appearance-none rounded-full border border-[#d9dfeb] bg-white px-4 pr-10 text-sm text-[#1f437c] outline-none transition focus:border-[#2d86d8] sm:w-40"
                >
                  {categoryOptions.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                <i className="fa-solid fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#1f437c]"></i>
              </div>

              <div className="flex h-12 items-center rounded-full border border-[#d7deea] bg-white pl-4 pr-1.5 sm:w-[360px]">
                <i className="fa-solid fa-magnifying-glass text-sm text-[#2d4f8f]"></i>
                <input
                  type="text"
                  placeholder="Search Location"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="ml-2 w-full bg-transparent text-sm text-[#2d4f8f] placeholder:text-[#2d4f8f] outline-none"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="inline-flex h-10 min-w-[122px] items-center justify-center gap-1 rounded-full bg-[#2d86d8] px-5 text-sm font-medium leading-none text-white whitespace-nowrap transition hover:bg-[#2578c4]"
                >
                  <i className="fa-solid fa-magnifying-glass text-xs"></i>
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCategories.map((item) => (
              <div
                key={`${item.title}-${item.location}`}
                className="rounded-[10px] bg-[#1f3f88] p-[2px] shadow-sm"
              >
                <img src={item.image} alt={item.title} className="h-56 w-full rounded-[8px] object-cover" />
                <div className="-mt-4 px-[10px] pb-[10px] relative z-10">
                  <div className="h-11 rounded-[10px] bg-[#f1f4fa] px-4 flex items-center justify-between font-semibold text-[#1f2d6e]">
                    <span>{item.title}</span>
                    {item.price}
                  </div>
                </div>
              </div>
            ))}
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
                <Link to="/register" className="mt-6 mb-4 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-[#1f2d6e]">
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
            <p className="mt-5 text-base sm:text-lg lg:text-xl text-[#1f2d6e]">
              Still you have any questions? Contact our Team via support@taskservice.com
            </p>
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

export default ServicesPage;

