import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";
import MyLatestCompnent from "../../../Pages/Funding/MyLatestCompnent";


const DashboardHome = () => {
  const { user, loading } = useAuth()

  if (loading) return <div className="p-6">Loading...</div>;

  const name =
    user?.displayName ||
    user?.name ||
    (user?.email ? user.email.split("@")[0] : "Donor");

  return (
    <div className="w-full">
      {/* Full-width banner */}
      <section className="w-full bg-gradient-to-r from-rose-50 via-white to-emerald-50 border-b border-slate-200">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            {/* Left content */}
            <div className="lg:col-span-8">
              <p className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Donor Dashboard
              </p>

              <h1 className="mt-3 text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
                Welcome,{" "}
                <span className="text-emerald-600 break-words">{name}</span> 👋
              </h1>

              <p className="mt-3 text-slate-600 leading-relaxed max-w-2xl">
                Thanks for being a donor. Manage your donation requests, track statuses,
                and help save lives—quickly and easily.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/dashboard/my-donation-requests"
                  className="btn btn-primary rounded-xl w-full sm:w-auto"
                >
                  My Donation Requests
                </Link>

                <Link
                  to="/dashboard/creatDonerRequest"
                  className="btn btn-outline rounded-xl w-full sm:w-auto"
                >
                  Create Request
                </Link>
              </div>

              <div className="mt-6 rounded-xl bg-white/70 backdrop-blur border border-slate-200 p-4 w-full sm:w-fit">
                <p className="text-sm text-slate-600">
                  Logged in as:{" "}
                  <span className="font-semibold text-slate-900 break-all">
                    {user?.email || "—"}
                  </span>
                </p>
              </div>
            </div>

            {/* Right side “stats/cards” */}
            <div className="lg:col-span-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
                  <p className="text-sm text-slate-500">Quick Tip</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    Keep your profile updated
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Correct phone & location helps recipients contact you faster.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
                  <p className="text-sm text-slate-500">Next Step</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    View your requests
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Track pending/inprogress/done requests from one place.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Optional: below-banner content area */}
      <section className="w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
            <h2 className="text-lg font-bold text-slate-800">What you can do here</h2>
            <ul className="mt-3 text-slate-600 text-sm space-y-2 list-disc pl-5">
              <li>Create a blood donation request</li>
              <li>Manage and delete your requests</li>
              <li>Track request status updates</li>
            </ul>
          </div>
        </div>
      </section>

      <MyLatestCompnent></MyLatestCompnent>
    </div>
  );
};

export default DashboardHome;
