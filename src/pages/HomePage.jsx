import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

const categories = [
  "Moving",
  "Delivery",
  "Cleaning",
  "Snow Cleaning",
  "Gardening",
  "Mounting",
  "Assembly",
  "Decoration",
];
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
  const navigate = useNavigate();
  const [category, setCategory] = useState("Moving");
  const [location, setLocation] = useState("Singapur");
  const [catOpen, setCatOpen] = useState(false);
  const [locOpen, setLocOpen] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [testimonialDirection, setTestimonialDirection] = useState("next");
  const [blogIndex, setBlogIndex] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingSummaryOpen, setBookingSummaryOpen] = useState(false);
  const [taskArrivedOpen, setTaskArrivedOpen] = useState(false);
  const [customerOtpOpen, setCustomerOtpOpen] = useState(false);
  const [eventType, setEventType] = useState("");
  const [decorationSize, setDecorationSize] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingDescription, setBookingDescription] = useState("");
  const [selectedTaskerId, setSelectedTaskerId] = useState("");
  const [apiTaskers, setApiTaskers] = useState([]);
  const [apiCategories, setApiCategories] = useState([]);
  const [loadingTaskers, setLoadingTaskers] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [arrivedOtp, setArrivedOtp] = useState(["0", "0", "0", "0"]);
  const [customerOtp, setCustomerOtp] = useState(["0", "0", "0", "0"]);
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [payingNow, setPayingNow] = useState(false);
  const [payingAfter, setPayingAfter] = useState(false);
  const [flowError, setFlowError] = useState("");
  const [flowSuccess, setFlowSuccess] = useState("");
  const catRef = useRef(null);
  const locRef = useRef(null);
  const arrivedToCustomerTimerRef = useRef(null);

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

  useEffect(() => {
    const token = localStorage.getItem("alpine_token");
    if (!token) return;
    (async () => {
      try {
        const categoryRowsRes = await api.get("/categories");
        const categoryRows = Array.isArray(categoryRowsRes.data?.categories) ? categoryRowsRes.data.categories : [];
        setApiCategories(categoryRows);
      } catch {
        // keep static UI if categories load fails
      }
    })();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("alpine_token");
    if (!token) {
      setApiTaskers([]);
      setSelectedTaskerId("");
      return;
    }
    (async () => {
      setLoadingTaskers(true);
      try {
        const taskerRes = await api.get("/taskers", {
          params: {
            category,
            location,
          },
        });
        const taskerRows = Array.isArray(taskerRes.data?.taskers) ? taskerRes.data.taskers : [];
        setApiTaskers(taskerRows);
        setSelectedTaskerId((prev) => {
          if (taskerRows.length === 0) return "";
          const hasCurrent = taskerRows.some((row) => String(row.id) === String(prev));
          return hasCurrent ? prev : String(taskerRows[0].id);
        });
      } catch {
        setApiTaskers([]);
        setSelectedTaskerId("");
      } finally {
        setLoadingTaskers(false);
      }
    })();
  }, [category, location]);

  useEffect(() => {
    const anyModalOpen = bookingOpen || bookingSummaryOpen || taskArrivedOpen || customerOtpOpen;
    if (anyModalOpen) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [bookingOpen, bookingSummaryOpen, taskArrivedOpen, customerOtpOpen]);

  useEffect(() => {
    return () => {
      if (arrivedToCustomerTimerRef.current) clearTimeout(arrivedToCustomerTimerRef.current);
    };
  }, []);

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
        category,
        location,
        source: "home_search",
        guest_token: localStorage.getItem("alpine_token") ? null : guestToken,
      })
      .catch(() => {
        // Do not block navigation if logging fails.
      })
      .finally(() => {
        navigate("/verified-tasker", {
          state: {
            searchCategory: category,
            searchLocation: location,
          },
        });
      });
  };

  const ensureCustomer = () => {
    const token = localStorage.getItem("alpine_token");
    const user = JSON.parse(localStorage.getItem("alpine_user") || "null");
    if (!token || !user) {
      navigate("/login", { state: { returnTo: "/" } });
      return null;
    }
    if (user.role !== "customer") {
      setFlowError("Please login with customer account to book task.");
      return null;
    }
    return user;
  };

  const resolveCategoryId = () => {
    const desired = (category || eventType || "general").toLowerCase();
    const exact = apiCategories.find((c) => String(c.name || "").toLowerCase() === desired);
    if (exact) return exact.id;
    const partial = apiCategories.find((c) => String(c.name || "").toLowerCase().includes(desired));
    if (partial) return partial.id;
    return apiCategories[0]?.id || 1;
  };

  const selectedTasker = apiTaskers.find((t) => String(t.id) === String(selectedTaskerId)) || apiTaskers[0] || null;
  const selectedPrice = Math.max(1, Number(selectedTasker?.hourly_rate || 20));

  const openBookingFlow = () => {
    const user = ensureCustomer();
    if (!user) return;
    setFlowError("");
    setFlowSuccess("");
    setEventType(category);
    setBookingOpen(true);
  };

  const confirmBooking = async () => {
    const user = ensureCustomer();
    if (!user) return;
    if (!eventType.trim() || !decorationSize.trim()) {
      setFlowError("Please select Event Type and Decoration Size.");
      return;
    }
    if (loadingTaskers) {
      setFlowError("Taskers are loading. Please wait a second and try again.");
      return;
    }
    if (!selectedTaskerId) {
      setFlowError("Please select tasker first.");
      return;
    }
    setLoadingBooking(true);
    setFlowError("");
    setFlowSuccess("");
    try {
      const scheduledAt = bookingDate && bookingTime ? `${bookingDate} ${bookingTime}:00` : null;
      const categoryId = resolveCategoryId();
      const taskRes = await api.post("/tasks", {
        category_id: categoryId,
        title: `${eventType} service booking`,
        description: bookingDescription || `${eventType} / ${decorationSize} booking`,
        budget_estimate: selectedPrice,
        scheduled_at: scheduledAt,
        address: `${location} - customer address`,
        city: location,
      });
      const taskId = taskRes.data?.task?.id;
      if (!taskId) throw new Error("Task creation failed.");

      await api.post(`/tasks/${taskId}/assign/${selectedTaskerId}`, {
        assigned_price: selectedPrice,
        event_type: eventType,
        service_level: decorationSize,
        preferred_date: bookingDate || null,
        preferred_time: bookingTime || null,
        booking_description: bookingDescription || null,
        payment_option: "pay_now",
        note: "Assigned from home booking popup",
      });

      setCurrentTaskId(taskId);
      setBookingOpen(false);
      setBookingSummaryOpen(true);
      setFlowSuccess("Booking created and tasker assigned.");
    } catch (err) {
      setFlowError(err?.response?.data?.message || "Booking failed. Check login/cookie consent.");
    } finally {
      setLoadingBooking(false);
    }
  };

  const payNow = async () => {
    if (!currentTaskId) {
      setFlowError("Task booking not ready.");
      return;
    }
    setPayingNow(true);
    setFlowError("");
    try {
      await api.post(`/payments/tasks/${currentTaskId}/authorize`, {
        task_amount: selectedPrice,
        currency: "USD",
      });
      const otpRes = await api.get(`/tasks/${currentTaskId}/otp`);
      const otp = String(otpRes.data?.otp || "0000").padStart(4, "0").slice(0, 4).split("");
      setArrivedOtp(otp);
      setCustomerOtp(otp);
      setBookingSummaryOpen(false);
      setTaskArrivedOpen(true);
      arrivedToCustomerTimerRef.current = setTimeout(() => {
        setTaskArrivedOpen(false);
        setCustomerOtpOpen(true);
      }, 1200);
    } catch (err) {
      setFlowError(err?.response?.data?.message || "Pay now failed.");
    } finally {
      setPayingNow(false);
    }
  };

  const payAfterService = async () => {
    if (!currentTaskId) {
      setFlowError("Task booking not ready.");
      return;
    }
    setPayingAfter(true);
    setFlowError("");
    try {
      await api.post(`/payments/tasks/${currentTaskId}/pay-after-service`, {
        task_amount: selectedPrice,
        currency: "USD",
      });
      setBookingSummaryOpen(false);
      setFlowSuccess("Pay-after-service selected successfully.");
    } catch (err) {
      setFlowError(err?.response?.data?.message || "Pay-after-service failed.");
    } finally {
      setPayingAfter(false);
    }
  };

  const closeAllBookingModals = () => {
    if (arrivedToCustomerTimerRef.current) {
      clearTimeout(arrivedToCustomerTimerRef.current);
      arrivedToCustomerTimerRef.current = null;
    }
    setBookingOpen(false);
    setBookingSummaryOpen(false);
    setTaskArrivedOpen(false);
    setCustomerOtpOpen(false);
  };

  return (
    <>
      <section className="relative overflow-hidden pb-24 pt-8">
        <div className="absolute inset-x-0 -bottom-5 lg:-bottom-6 2xl:-bottom-5 mx-auto max-w-7xl px-6 z-0">
          <div className="h-28 lg:h-32 xl:h-36 2xl:h-40 bg-[#1e2756] rounded-[2.5rem]"></div>
        </div>
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 relative">
            <div
              className="hidden lg:block w-[300px] xl:w-[380px] 2xl:w-[420px] min-[1900px]:w-[470px] h-[560px] rounded-3xl overflow-hidden border-4 border-white shadow-xl lg:absolute lg:top-4 lg:z-10 lg:left-[-320px] xl:left-[-255px] 2xl:left-[-318px] min-[1900px]:left-[-367px]"
            >
              <img src="/images/main1.svg" alt="Office scene" className="w-full h-full object-cover" />
            </div>
            <div className="relative w-full lg:max-w-[950px] 2xl:max-w-[1000px] lg:mx-auto lg:mt-2">
              <div className="relative z-30 w-full bg-[#1e2756] rounded-3xl p-[4.6rem] min-[1500px]:max-[1535px]:p-[4.4rem] min-[1700px]:p-[5rem] min-[1900px]:p-[5rem] pb-16 border border-blue-800 shadow-2xl">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">Smart Task Posting &amp;<br />Talent Selection</h1>
                <div className="bg-white rounded-2xl p-3 flex flex-col md:flex-row md:items-center gap-4 shadow-lg">
                  <div ref={catRef} className="relative w-full md:flex-1 md:min-w-[220px] border-b md:border-b-0 md:border-r border-gray-100 px-4 py-2">
                    <button onClick={(e) => { e.stopPropagation(); setCatOpen((v) => !v); setLocOpen(false); }} className="flex items-center gap-3 w-full text-left cursor-pointer">
                      <div className="bg-blue-50 p-2 rounded-lg"><i className="fa-solid fa-grip text-blue-600"></i></div>
                      <div className="flex-1"><p className="text-xs text-gray-400 font-semibold uppercase">Category</p><p className="text-sm font-bold text-gray-700">{category}</p></div>
                      <i className="fa-solid fa-chevron-down w-4 h-4 text-gray-400"></i>
                    </button>
                    <div className={`${catOpen ? "block" : "hidden"} absolute left-0 top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 z-50`}>
                      <div className="p-2">
                        {categories.map((item) => (
                          <button
                            key={item}
                            onClick={(e) => { e.stopPropagation(); setCategory(item); setCatOpen(false); }}
                            className={`mb-1 w-full rounded-xl px-4 py-2 text-left text-sm font-medium ${category === item ? "bg-[#eef3fb] text-[#1f2d6e]" : "bg-[#f7f9fd] text-[#334155] hover:bg-[#eef3fb]"}`}
                          >
                            {item}
                          </button>
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
                      <div className="p-2">
                        {locations.map((item) => (
                          <button
                            key={item}
                            onClick={(e) => { e.stopPropagation(); setLocation(item); setLocOpen(false); }}
                            className={`mb-1 w-full rounded-xl px-4 py-2 text-left text-sm font-medium ${location === item ? "bg-[#eef3fb] text-[#1f2d6e]" : "bg-[#f7f9fd] text-[#334155] hover:bg-[#eef3fb]"}`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button type="button" onClick={handleSearch} className="w-full md:w-[170px] md:ml-auto bg-[#3288e6] text-white px-8 py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition shadow-md"><i className="fa-solid fa-magnifying-glass"></i>Search</button>
                </div>
              </div>
              <div className="relative mt-3 lg:mt-4">
                <div className="bg-white rounded-[2rem] border border-slate-200 p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-visible md:min-h-[210px] lg:min-h-0">
                  <div className="lg:pr-40">
                    <p className="text-gray-600 font-medium mb-5 text-lg">Turn Your Skills Into Earnings and Start Working on Your Own Schedule</p>
                    <Link to="/register" className="inline-flex items-center gap-2 bg-[#3288e6] text-white px-6 py-3 rounded-full font-bold hover:bg-blue-500 transition">Earn Money as Tasker <span>&rarr;</span></Link>
                  </div>
                  <img
                    src="/images/man.svg"
                    alt="Tasker"
                    className="hidden md:block absolute right-2 md:right-4 lg:right-8 bottom-0 h-[170px] lg:h-[235px] xl:h-[246px] 2xl:h-[232px] object-contain z-40"
                  />
                </div>
              </div>
              <div className="absolute right-0 top-[75%] -translate-y-1/2 h-16 w-16 rounded-full border-[8px] border-white bg-[#1e2756] z-30 flex items-center justify-center shadow-xl sm:h-20 sm:w-20 sm:border-[10px] lg:top-[77%] lg:-right-9 xl:-right-11 2xl:-right-12">
                <img src="/images/Arrow.svg" alt="Arrow" className="h-7 w-7 -rotate-45 sm:h-9 sm:w-9" />
              </div>
            </div>
            <div
              className="hidden lg:block w-[300px] xl:w-[380px] 2xl:w-[420px] min-[1900px]:w-[470px] h-[560px] rounded-3xl overflow-hidden border-4 border-white shadow-xl lg:absolute lg:top-4 lg:z-10 lg:right-[-320px] xl:right-[-251px] 2xl:right-[-314px] min-[1900px]:right-[-368px]"
            >
              <img src="/images/main2.svg" alt="Kitchen interior" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          {flowError ? <p className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{flowError}</p> : null}
          {flowSuccess ? <p className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{flowSuccess}</p> : null}
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
              <button
                type="button"
                onClick={openBookingFlow}
                className="mt-8 inline-flex items-center rounded-full bg-[#2f87d6] px-6 py-3 font-semibold text-white transition hover:bg-[#2478c4]"
              >
                Post Your task for free &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className={`${bookingOpen ? "flex" : "hidden"} fixed inset-0 z-[120] items-center justify-center bg-black/45 px-4`} onClick={(event) => { if (event.target === event.currentTarget) closeAllBookingModals(); }}>
        <div className="w-full max-w-[660px] rounded-[18px] bg-white px-5 py-5 shadow-2xl sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-2xl font-semibold text-[#2f87d6] sm:text-3xl">Let&apos;s Start With Basics</h3>
            <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#d5dfef] bg-[#f4f8ff] text-[#2f87d6]" onClick={closeAllBookingModals}>
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <form className="mt-4 space-y-3" onSubmit={(event) => event.preventDefault()}>
            <div className="relative">
              <select className="h-12 w-full appearance-none rounded-xl border border-[#dbe3f0] bg-[#f8fafc] px-4 pr-10 text-base text-[#1f2d6e] outline-none focus:border-[#2f87d6]" value={eventType} onChange={(event) => setEventType(event.target.value)}>
                <option value="" disabled>Event Type</option>
                <option>Wedding</option>
                <option>Birthday</option>
                <option>Corporate</option>
                <option>Engagement</option>
                <option>Moving</option>
                <option>Cleaning</option>
              </select>
              <i className="fa-solid fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#1f3c87]"></i>
            </div>

            <div className="relative">
              <select className="h-12 w-full appearance-none rounded-xl border border-[#dbe3f0] bg-[#f8fafc] px-4 pr-10 text-base text-[#1f2d6e] outline-none focus:border-[#2f87d6]" value={decorationSize} onChange={(event) => setDecorationSize(event.target.value)}>
                <option value="" disabled>Decoration Size</option>
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
              </select>
              <i className="fa-solid fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#1f3c87]"></i>
            </div>

            <div className="relative">
              <select disabled={loadingTaskers} className="h-12 w-full appearance-none rounded-xl border border-[#dbe3f0] bg-[#f8fafc] px-4 pr-10 text-base text-[#1f2d6e] outline-none focus:border-[#2f87d6] disabled:cursor-not-allowed disabled:opacity-60" value={selectedTaskerId} onChange={(event) => setSelectedTaskerId(event.target.value)}>
                <option value="" disabled>
                  {loadingTaskers ? "Loading taskers..." : "Select Tasker"}
                </option>
                {apiTaskers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (${Number(t.hourly_rate || 20).toFixed(2)}/hr)
                  </option>
                ))}
              </select>
              <i className="fa-solid fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#1f3c87]"></i>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input type="date" value={bookingDate} onChange={(event) => setBookingDate(event.target.value)} className="h-12 w-full rounded-xl border border-[#dbe3f0] bg-[#f8fafc] px-4 text-base outline-none focus:border-[#2f87d6]" />
              <input type="time" value={bookingTime} onChange={(event) => setBookingTime(event.target.value)} className="h-12 w-full rounded-xl border border-[#dbe3f0] bg-[#f8fafc] px-4 text-base outline-none focus:border-[#2f87d6]" />
            </div>

            <textarea value={bookingDescription} onChange={(e) => setBookingDescription(e.target.value)} placeholder="Description" rows="3" className="w-full resize-none rounded-xl border border-[#dbe3f0] bg-[#f8fafc] px-4 py-3 text-base text-[#1f2d6e] outline-none placeholder:text-[#1f2d6e] focus:border-[#2f87d6]"></textarea>

            <button type="button" disabled={loadingBooking} className="mt-1 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#2f87d6] text-lg font-semibold text-white hover:bg-[#2678bf] disabled:opacity-70" onClick={confirmBooking}>
              {loadingBooking ? "Creating Booking..." : "Confirm Book"}
            </button>
          </form>
        </div>
      </div>

      <div className={`${bookingSummaryOpen ? "flex" : "hidden"} fixed inset-0 z-[130] items-center justify-center bg-black/45 px-4`} onClick={(event) => { if (event.target === event.currentTarget) closeAllBookingModals(); }}>
        <div className="w-full max-w-[760px] rounded-[20px] bg-white px-6 py-6 shadow-2xl sm:px-7">
          <div className="relative">
            <h3 className="text-center text-2xl font-semibold text-[#2f87d6]">Booking Summary</h3>
            <button type="button" className="absolute -top-1 right-0 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#d5dfef] bg-[#f4f8ff] text-[#2f87d6]" onClick={closeAllBookingModals}>
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <article className="rounded-xl border border-[#d7dde9] bg-white shadow-sm">
              <div className="rounded-t-xl bg-[#eef3fb] px-5 py-3 text-md font-semibold text-[#2f87d6]">{eventType || "Service"}</div>
              <div className="px-5 py-4 text-[#1f2d6e]">
                <h4 className="text-md font-semibold">Selected Options</h4>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>Event Type: {eventType || "-"}</li>
                  <li>Decoration Size: {decorationSize || "-"}</li>
                  <li>City: {location}</li>
                </ul>
              </div>
            </article>
            <article className="rounded-xl border border-[#d7dde9] bg-white shadow-sm">
              <div className="rounded-t-xl bg-[#eef3fb] px-5 py-3 text-md font-semibold text-[#2f87d6]">Selected Tasker</div>
              <div className="px-5 py-4">
                <p className="text-md font-semibold text-[#1f2d6e]">{selectedTasker?.name || "-"}</p>
                <p className="mt-2 text-sm text-[#1f2d6e]">Rating: {selectedTasker?.average_rating || "4.8"}</p>
                <p className="mt-1 text-sm text-[#1f2d6e]">Rate: ${selectedPrice.toFixed(2)}/hr</p>
                <div className="mt-3 h-px w-full bg-[#d8dce5]"></div>
                <p className="mt-3 text-md font-semibold text-[#1f2d6e]">Total Price : ${selectedPrice.toFixed(2)}</p>
              </div>
            </article>
          </div>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button type="button" disabled={payingNow} className="inline-flex h-12 min-w-[190px] items-center justify-center rounded-full bg-[#2f87d6] px-8 text-md font-semibold text-white disabled:opacity-70" onClick={payNow}>{payingNow ? "Processing..." : "Pay Now"}</button>
            <span className="text-4xl text-[#2f87d6]">Or</span>
            <button type="button" disabled={payingAfter} onClick={payAfterService} className="inline-flex h-12 min-w-[260px] items-center justify-center rounded-full border-2 border-[#2f87d6] px-8 text-md font-semibold text-[#2f87d6] disabled:opacity-70">{payingAfter ? "Processing..." : "Pay After Service"}</button>
          </div>
        </div>
      </div>

      <div className={`${taskArrivedOpen ? "flex" : "hidden"} fixed inset-0 z-[140] items-center justify-center bg-black/45 px-4`} onClick={(event) => { if (event.target === event.currentTarget) closeAllBookingModals(); }}>
        <div className="w-full max-w-[680px] rounded-[22px] bg-white px-5 py-6 shadow-2xl sm:px-8">
          <div className="flex justify-end">
            <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d5dfef] bg-white text-[#2f87d6] shadow" onClick={closeAllBookingModals}>
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>
          <div className="-mt-2 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#2f87d6] text-white"><i className="fa-solid fa-check relative -translate-y-[2px] text-5xl"></i></div>
            <h3 className="mt-4 text-4xl font-semibold text-[#1f2d6e]">Task Arrived</h3>
            <p className="mt-3 text-2xl font-semibold text-[#1f2d6e]">Your OTP</p>
            <div className="mt-5 grid grid-cols-4 gap-3 sm:mx-auto sm:max-w-[420px] sm:gap-3">
              {arrivedOtp.map((digit, idx) => (
                <div key={`arrived-${idx}`} className="flex h-[72px] items-center justify-center rounded-[18px] border border-[#e2e6ef] text-3xl font-semibold text-[#364154] shadow-[0_10px_18px_rgba(47,135,214,0.12)]">{digit}</div>
              ))}
            </div>
            <p className="mt-5 text-2xl text-[#3f5a91]">Share This OTP With The Tasker</p>
          </div>
        </div>
      </div>

      <div className={`${customerOtpOpen ? "flex" : "hidden"} fixed inset-0 z-[150] items-center justify-center bg-black/45 px-4`} onClick={(event) => { if (event.target === event.currentTarget) closeAllBookingModals(); }}>
        <div className="w-full max-w-[680px] rounded-[22px] bg-white px-5 py-6 shadow-2xl sm:px-8">
          <div className="flex justify-end">
            <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d5dfef] bg-white text-[#2f87d6] shadow" onClick={closeAllBookingModals}>
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>
          <div className="mt-1 text-center">
            <h3 className="text-4xl font-semibold text-[#1f2d6e]">Enter Customer OTP</h3>
            <p className="mt-3 text-2xl font-semibold text-[#1f2d6e]">Your OTP</p>
            <div className="mt-5 grid grid-cols-4 gap-3 sm:mx-auto sm:max-w-[420px] sm:gap-3">
              {customerOtp.map((digit, idx) => (
                <div key={`customer-${idx}`} className="flex h-[72px] items-center justify-center rounded-[18px] border border-[#e2e6ef] text-3xl font-semibold text-[#364154] shadow-[0_10px_18px_rgba(47,135,214,0.12)]">{digit}</div>
              ))}
            </div>
            <p className="mt-5 text-2xl text-[#3f5a91]">Share This OTP With The Tasker</p>
            <button type="button" className="mt-4 inline-flex h-12 min-w-[210px] items-center justify-center rounded-full bg-[#2f87d6] px-7 text-md font-semibold text-white hover:bg-[#2678bf]" onClick={() => { setCustomerOtpOpen(false); setFlowSuccess("OTP shared. Tasker can verify and start work from Tasker Dashboard."); }}>Verify & Start Work</button>
          </div>
        </div>
      </div>

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
                    <div className="h-12 rounded-[16px] bg-[#f1f4fa] px-3 flex items-center justify-between font-semibold text-[#1f2d6e]">
                      <span className="rounded-full border border-[#e2e8f4] bg-white px-4 py-1.5 shadow-sm">{item.title}</span>
                      <span className="rounded-full px-3 py-1">{item.price}</span>
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

