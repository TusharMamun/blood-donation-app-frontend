import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <section className="w-full max-w-2xl text-center">
        {/* Header / Brand */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-red-600/10 flex items-center justify-center">
            <span className="text-red-600 text-xl font-bold">🩸</span>
          </div>
          <div className="text-left">
            <p className="text-lg font-semibold leading-5">Blood Donation</p>
            <p className="text-sm text-gray-500">Donate blood, save lives</p>
          </div>
        </div>

        {/* 404 */}
        <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight text-gray-900">
          404
        </h1>
        <p className="mt-3 text-xl sm:text-2xl font-semibold text-gray-900">
          Page not found
        </p>
        <p className="mt-2 text-gray-600">
          The page you requested doesn’t exist or may have been moved.
        </p>

        {/* Current path */}
        <div className="mt-4 inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2">
          <span className="text-sm text-gray-500">Requested:</span>
          <code className="ml-2 text-sm font-semibold text-gray-900">
            {location.pathname}
          </code>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-2.5 text-white font-semibold shadow-sm hover:bg-red-700 transition"
          >
            Go to Home
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-gray-200 px-5 py-2.5 text-gray-900 font-semibold hover:bg-gray-50 transition"
          >
            Go Back
          </button>
        </div>

        {/* Quick links */}
        <div className="mt-10 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-left">
          <p className="text-sm font-semibold text-gray-900">Quick links</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              to="/donation-requests"
              className="rounded-xl bg-white px-3 py-1.5 text-sm border border-gray-200 hover:bg-gray-50"
            >
              Donation Requests
            </Link>
            <Link
              to="/funding"
              className="rounded-xl bg-white px-3 py-1.5 text-sm border border-gray-200 hover:bg-gray-50"
            >
              Funding
            </Link>
            <Link
              to="/login"
              className="rounded-xl bg-white px-3 py-1.5 text-sm border border-gray-200 hover:bg-gray-50"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NotFoundPage;
