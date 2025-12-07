import React from "react";



const DashboardHome = () => {
  // TODO: replace with real stats from API
  const stats = {
    totalUsers: 0,
    totalFunding: 0,
    totalRequests: 0,
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white shadow-sm">
        <h1 className="text-2xl font-extrabold">Welcome to Dashboard 🩸</h1>
        <p className="mt-1 text-white/80 text-sm">
          Manage users, donation requests, and platform statistics.
        </p>
      </div>

      {/* 3 cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Users (Donors)"
          value={stats.totalUsers}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 20a6 6 0 0112 0" />
            </svg>
          }
        />
        <StatCard
          title="Total Funding"
          value={stats.totalFunding}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-3 0-5 1.5-5 4s2 4 5 4 5 1.5 5 4-2 4-5 4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v2m0 16v2" />
            </svg>
          }
        />
        <StatCard
          title="Total Blood Donation Requests"
          value={stats.totalRequests}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-6-4.35-6-10a6 6 0 1112 0c0 5.65-6 10-6 10z" />
            </svg>
          }
        />
      </div>
    </div>
  );
};

export default DashboardHome;
