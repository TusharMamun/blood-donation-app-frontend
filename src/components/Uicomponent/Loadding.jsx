import React from "react";

const Loading = ({ label = "Loading..." }) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-base-200">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center px-4">
        <div className="relative w-full max-w-md">
          {/* glow */}
          <div className="pointer-events-none absolute -inset-1 rounded-[2rem] bg-primary/25 blur-2xl" />

          <div className="relative overflow-hidden rounded-[2rem] border border-base-200 bg-base-100 p-8 shadow">
            {/* animated top bar */}
            <div className="absolute left-0 top-0 h-1 w-full overflow-hidden">
              <div className="h-full w-1/3 animate-[slide_1.2s_linear_infinite] rounded-full bg-primary" />
            </div>

            <div className="flex items-center gap-4">
              {/* droplet pulse */}
              <div className="relative grid h-14 w-14 place-items-center">
                <span className="absolute inline-flex h-14 w-14 animate-ping rounded-full bg-primary/20" />
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-8 w-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      d="M12 2s6 6.6 6 12a6 6 0 1 1-12 0c0-5.4 6-12 6-12z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex-1">
                <div className="text-lg font-extrabold uppercase">
                  Blood <span className="text-primary">Donation</span>
                </div>
                <div className="mt-1 text-sm text-base-content/70">{label}</div>
              </div>
            </div>

            {/* heartbeat */}
            <div className="mt-7 rounded-2xl bg-base-200/70 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-base-content/70">
                  Please wait...
                </span>
                <span className="loading loading-dots loading-sm" />
              </div>

              <svg viewBox="0 0 600 90" className="mt-3 h-10 w-full" fill="none">
                <path
                  d="M0 45 H120 L150 20 L190 70 L230 45 H330 L360 30 L395 60 L430 45 H600"
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-primary/30"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M0 45 H120 L150 20 L190 70 L230 45 H330 L360 30 L395 60 L430 45 H600"
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-primary"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength="100"
                  style={{
                    strokeDasharray: 20,
                    animation: "dash 1.1s linear infinite",
                  }}
                />
              </svg>

              <div className="mt-2 grid grid-cols-3 gap-2">
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-full" />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <div className="badge badge-primary badge-outline">Donate</div>
              <div className="badge badge-outline">Requests</div>
              <div className="badge badge-outline">Funding</div>
              <div className="badge badge-outline">Dashboard</div>
            </div>
          </div>

          <style>{`
            @keyframes slide {
              0% { transform: translateX(-120%); }
              100% { transform: translateX(360%); }
            }
            @keyframes dash {
              0% { stroke-dashoffset: 0; opacity: 0.8; }
              100% { stroke-dashoffset: -40; opacity: 1; }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default Loading;
