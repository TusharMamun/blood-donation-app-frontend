import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-50 via-white to-indigo-50">
      {/* soft background shapes */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-red-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,0,0.08),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(79,70,229,0.10),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(255,0,0,0.06),transparent_40%)]" />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white/70 px-3 py-1 text-sm text-red-700 shadow-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
              Donate blood • Save lives
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Be a hero today.
              <span className="block text-red-600">Join as a donor</span>
            </h1>

            <p className="mt-4 max-w-xl text-base text-slate-600 sm:text-lg">
              Connect donors with people who need blood fast. Register as a donor or search
              donors by location and blood group.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* ✅ Join as a donor -> /regester */}
              <Link
                to="/regester"
                className="btn btn-error rounded-2xl text-white shadow-lg shadow-red-200"
              >
                Join as a donor
              </Link>

              {/* ✅ Search Donors -> /search-donors (make this route) */}
              <Link
                to="/search-donors"
                className="btn btn-outline rounded-2xl border-slate-300 text-slate-800 hover:bg-white"
              >
                Search Donors
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="rounded-xl bg-white/70 px-3 py-2 shadow-sm">
                ✅ Fast donor search
              </span>
              <span className="rounded-xl bg-white/70 px-3 py-2 shadow-sm">
                ✅ Verified profiles
              </span>
              <span className="rounded-xl bg-white/70 px-3 py-2 shadow-sm">
                ✅ Location-based requests
              </span>
            </div>
          </div>

          {/* Right */}
          <div className="relative">
            <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-xl backdrop-blur">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-red-600">
                  {/* heart icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.687-4.5-1.935 0-3.597 1.126-4.313 2.733-.716-1.607-2.378-2.733-4.313-2.733C5.099 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-slate-900">
                    Emergency ready donors
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Keep your profile updated so patients can find you quickly.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-xs text-slate-500">Most needed</p>
                      <p className="mt-1 text-xl font-extrabold text-red-600">O-</p>
                      <p className="mt-1 text-xs text-slate-500">Universal donor</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-xs text-slate-500">Search by</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        District • Upazila
                      </p>
                      <p className="mt-1 text-xs text-slate-500">Find nearby donors</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-gradient-to-r from-red-600 to-indigo-600 p-[1px]">
                <div className="rounded-2xl bg-white p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">Tip</p>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                      Safety first
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Donate only when you’re healthy, and follow local guidelines for safe donation.
                  </p>
                </div>
              </div>
            </div>

            {/* floating badge */}
            <div className="absolute -bottom-5 left-6 rounded-2xl bg-white px-4 py-3 shadow-lg">
              <p className="text-xs text-slate-500">Trusted community</p>
              <p className="text-sm font-bold text-slate-900">Blood Donation Network</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
