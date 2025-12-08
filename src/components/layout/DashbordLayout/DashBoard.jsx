import React, { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";

const navClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-3 py-2 transition w-full ${
    isActive ? "bg-indigo-600 text-white" : "text-slate-700 hover:bg-indigo-100"
  }`;

const Icon = ({ children }) => (
  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 shadow-sm shrink-0">
    {children}
  </span>
);

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ close drawer on route change (mobile)
  useEffect(() => {
    const el = document.getElementById("dash-drawer");
    if (el) el.checked = false;
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logOut?.();
      navigate("/", { replace: true });
    } catch (e) {
      console.log("Logout error:", e?.message);
    }
  };

  const sidebarWidth = collapsed ? "lg:w-24" : "lg:w-72";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="drawer lg:drawer-open">
        <input id="dash-drawer" type="checkbox" className="drawer-toggle" />

        {/* MAIN */}
        <div className="drawer-content flex min-w-0 flex-col">
          {/* Top bar */}
          <div className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <label htmlFor="dash-drawer" className="btn btn-ghost btn-sm lg:hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </label>

                <div className="leading-tight">
                  <p className="text-sm text-slate-500">Dashboard</p>
                  <p className="font-bold text-slate-800">Control Panel</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <main className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>

        {/* SIDEBAR */}
        <div className="drawer-side">
          <label htmlFor="dash-drawer" className="drawer-overlay" />

          <aside
            className={`h-full w-72 ${sidebarWidth} bg-indigo-50 border-r border-indigo-100 p-3 transition-all duration-300`}
          >
            <div className="flex h-full flex-col">
              {/* header */}
              <div className="flex items-center justify-between gap-2 px-2 py-2">
               
         <Link to="/" className={`flex items-center gap-3 font-extrabold text-indigo-800 ${collapsed ? "hidden" : "block"}  `}>
              <div className="grid h-11 w-11 place-items-center rounded-full bg-primary/10">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path
                    d="M12 2s6 6.6 6 12a6 6 0 1 1-12 0c0-5.4 6-12 6-12z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M12 9v6" strokeLinecap="round" />
                  <path d="M9 12h6" strokeLinecap="round" />
                </svg>
              </div>

              <div className="leading-tight">
                <div className="text-lg font-extrabold uppercase text-primary">Blood</div>
                <div className="text-lg font-extrabold uppercase -mt-1">Donation</div>
              </div>
            </Link>







                <button
                  onClick={() => setCollapsed((v) => !v)}
                  className="btn btn-ghost btn-sm"
                  title="Collapse"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {/* menu */}
              <div className="mt-2 flex-1 overflow-y-auto pr-1">
                <div className="space-y-2">
                  {/* Dashboard Home */}
                  <NavLink to="/dashboard" className={navClass} title="Dashboard Home">
                    <Icon>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V9h6v12" />
                      </svg>
                    </Icon>
                    <span className={`${collapsed ? "hidden" : "block"} font-medium`}>Dashboard Home</span>
                  </NavLink>

                  {/* ✅ My Donation Requests */}
                  <NavLink
                    to="/dashboard/my-donation-requests"
                    className={navClass}
                    title="My Donation Requests"
                  >
                    <Icon>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 21s-6-4.35-6-10a6 6 0 1112 0c0 5.65-6 10-6 10z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v3" />
                      </svg>
                    </Icon>
                    <span className={`${collapsed ? "hidden" : "block"} font-medium`}>
                      My Donation Requests
                    </span>
                  </NavLink>
{/* creat Donation Request */}



                  <NavLink
                    to="/dashboard/creatDonerRequest"
                    className={navClass}
                    title="Creat Doner Request"
                  >
                    <Icon>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 21s-6-4.35-6-10a6 6 0 1112 0c0 5.65-6 10-6 10z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v3" />
                      </svg>
                    </Icon>
                    <span className={`${collapsed ? "hidden" : "block"} font-medium`}>
               Creat Doner Request
                    </span>
                  </NavLink>

                  {/* All Blood Donation Request */}
                  <NavLink
                    to="/dashboard/all-blood-donation-request"
                    className={navClass}
                    title="All Blood Donation Request"
                  >
                    <Icon>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 21s-6-4.35-6-10a6 6 0 1112 0c0 5.65-6 10-6 10z"
                        />
                      </svg>
                    </Icon>
                    <span className={`${collapsed ? "hidden" : "block"} font-medium`}>
                      All Blood Donation Request
                    </span>
                  </NavLink>

                  {/* All Users */}
                  <NavLink to="/dashboard/all-users" className={navClass} title="All Users">
                    <Icon>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20H2v-2a4 4 0 014-4h1" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
                      </svg>
                    </Icon>
                    <span className={`${collapsed ? "hidden" : "block"} font-medium`}>All Users</span>
                  </NavLink>
                </div>
              </div>

              {/* bottom profile + logout */}
              <div className="pt-4">
                <div className="h-px bg-indigo-100 mb-3" />

                <div
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 bg-white/60 border border-indigo-100 ${
                    collapsed ? "justify-center" : ""
                  }`}
                >
                  {user?.photoURL ? (
                    <img className="h-10 w-10 rounded-full object-cover" src={user.photoURL} alt="avatar" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-indigo-100 grid place-items-center font-bold text-indigo-700">
                      {user?.displayName?.[0] || "U"}
                    </div>
                  )}

                  <div className={`${collapsed ? "hidden" : "block"} min-w-0`}>
                 <Link to='/dashboard/profile'>
                    <h1>  Profile</h1>
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {user?.displayName || "User"}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p></Link>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="mt-3 flex items-center gap-3 rounded-xl px-3 py-2 transition w-full text-red-600 hover:bg-red-50"
                  type="button"
                  title="Logout"
                >
                  <Icon>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H9m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </Icon>
                  <span className={`${collapsed ? "hidden" : "block"} font-medium`}>Logout</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
