import React, { useMemo } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";

 const  Navbar=() =>{

 const { logOut,user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/loging"); // বা "/"
    } catch (err) {
      console.log("Logout error:", err.message);
    }
  };
 
 


  const navClass = ({ isActive }) =>
    [
      "px-3 py-2 rounded-none !bg-transparent font-semibold tracking-wide text-sm uppercase",
      isActive
        ? "text-base-content border-b-2 border-primary"
        : "text-base-content/80 hover:text-base-content border-b-2 border-transparent hover:border-base-300",
    ].join(" ");

  // center menu (desktop)
  const centerLinks = useMemo(
    () => [
      { key: "home", label: "Home", to: "/" , end: true },
      { key: "about", label: "About", to: "/about" },
      { key: "requests", label: "Donation Requests", to: "/donation-requests" },
      { key: "funding", label: "Funding", to: "/funding" },
    ],
    []
  );

  // right side buttons (desktop)
  const authLinks = useMemo(
    () => [
      { key: "login", label: "Login", to: "/loging", btnClass: "btn btn-outline" },
      { key: "register", label: "Register", to: "/regester", btnClass: "btn btn-ghost" },
    ],
    []
  );

  // avatar dropdown items
  const avatarMenu = useMemo(
    () => [
      { key: "dashboard", label: "Dashboard", to: "/dashboard" },
      { key: "Profile", label: "Profile", to: "/Profile", className: "text-error" },
      // { key: "logout", label: "Logout", to: "/logout", className: "text-error" },
    ],
    []
  );

  return (
    <div className="w-full">
      <div className="h-2 w-full bg-primary" />

      <div className="bg-base-100">
        <div className="navbar mx-auto max-w-7xl px-4">
          {/* LEFT: Logo */}
          <div className="navbar-start gap-2">
            {/* Mobile */}
            <div className="dropdown lg:hidden">
              <label tabIndex={0} className="btn btn-ghost btn-circle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </label>

              <ul tabIndex={0} className="menu dropdown-content z-[1] mt-3 w-72 rounded-box bg-base-100 p-2 shadow">
                {centerLinks.map((l) => (
                  <li key={l.key}>
                    <NavLink to={l.to} end={!!l.end} className={navClass}>
                      {l.label}
                    </NavLink>
                  </li>
                ))}

                <li className="mt-2 opacity-70 px-2 text-xs">Auth</li>
                {authLinks.map((l) => (
                  <li key={l.key}>
                    <NavLink to={l.to} className={navClass}>
                      {l.label}
                    </NavLink>
                  </li>

                ))}

                <li className="mt-2 opacity-70 px-2 text-xs">User</li>
                {avatarMenu.map((m) => (
                  <li key={m.key}>
                    <NavLink to={m.to} className={m.className || ""}>
                      {m.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Brand */}
            <Link to="/" className="flex items-center gap-3">
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
          </div>

          {/* CENTER: Desktop menu (map) */}
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal gap-2">
              {centerLinks.map((l) => (
                <li key={l.key}>
                  <NavLink to={l.to} end={!!l.end} className={navClass}>
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT: Desktop auth buttons + avatar (map) */}
    <div className="navbar-end flex items-center gap-2">
  {/* ✅ user না থাকলে Desktop only: Login/Register buttons */}
  {!user && (
    <div className="hidden lg:flex items-center gap-2">
      {authLinks.map((l) => (
        <NavLink key={l.key} to={l.to} className={l.btnClass}>
          {l.label}
        </NavLink>
      ))}
    </div>
  )}

  {/* ✅ user থাকলে Avatar dropdown দেখাবে (mobile + desktop) */}
  {user && (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full ring-2 ring-base-200 ring-offset-2 ring-offset-base-100 overflow-hidden">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="User"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-base-200 text-sm font-bold">
              U
            </div>
          )}
        </div>
      </label>

      <ul
        tabIndex={0}
        className="menu dropdown-content z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
      >
        {avatarMenu.map((m) => (
          <li key={m.key}>
            <NavLink to={m.to} className={m.className || ""}>
              {m.label}
            </NavLink>
          </li>
        ))}

        <li className="mt-1">
          <button onClick={handleLogout} className="text-error">
            Logout
          </button>
        </li>
      </ul>
    </div>
  )}
</div>

        </div>
      </div>

      <div className="h-2 w-full bg-red-500" />
    </div>
  );
}
export default Navbar