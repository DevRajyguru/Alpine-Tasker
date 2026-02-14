import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="relative mt-20 bg-[#1e2b78] text-white overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -bottom-40 h-[420px] w-[720px] rotate-[28deg] bg-[#172a6a]/80"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div>
            <Link to="/" className="inline-block">
              <img src="/images/logo.svg" alt="Alpine Tasker" className="h-10 w-auto rounded" />
            </Link>
            <div className="mt-4 flex items-center gap-3">
              <a href="#" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center"><i className="fa-brands fa-x-twitter text-lg"></i></a>
              <a href="#" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center"><i className="fa-brands fa-linkedin-in text-lg"></i></a>
              <a href="#" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center"><i className="fa-brands fa-facebook-f text-lg"></i></a>
              <a href="#" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center"><i className="fa-brands fa-instagram text-lg"></i></a>
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

        <div className="mt-6 border-t border-white/20 pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-base text-white/90">
          <p>Copyright 2026. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
