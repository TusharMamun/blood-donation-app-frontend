import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FiUserCheck, FiUserX, FiShield, FiUsers, FiSearch } from "react-icons/fi";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const AllUser = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [status, setStatus] = useState("all");      // all | active | blocked
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    enabled: !loading && !!user,
    queryKey: ["AllUserForAllUserPage", status, search, page, limit],
    queryFn: async () => {
      const res = await axiosSecure.get("/regesterDoner", {
        params: { status, search, page, limit },
      });
      return res.data; // {result,total,totalPages,...}
    },
    keepPreviousData: true,
  });

  const users = data?.result || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800">
            All Users
          </h1>
          <p className="text-sm text-slate-500">View and manage all registered users.</p>
        </div>

        {/* Filter */}
        <div className="join w-full sm:w-auto">
          <button
            className={`btn btn-sm join-item ${status === "all" ? "btn-primary" : "btn-outline"}`}
            type="button"
            onClick={() => { setStatus("all"); setPage(1); }}
          >
            All
          </button>
          <button
            className={`btn btn-sm join-item ${status === "active" ? "btn-primary" : "btn-outline"}`}
            type="button"
            onClick={() => { setStatus("active"); setPage(1); }}
          >
            Active
          </button>
          <button
            className={`btn btn-sm join-item ${status === "blocked" ? "btn-primary" : "btn-outline"}`}
            type="button"
            onClick={() => { setStatus("blocked"); setPage(1); }}
          >
            Blocked
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-slate-700">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <FiUsers className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <p className="font-semibold">Users Table</p>
              <p className="text-xs text-slate-500">
                {isLoading ? "Loading..." : `Showing: ${users.length} users`}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2">
            <label className="input input-bordered input-sm flex items-center gap-2 w-full sm:w-72">
              <FiSearch className="opacity-60" />
              <input
                type="text"
                className="grow"
                placeholder="Search name/email"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </label>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="text-slate-600">
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const photo = u?.photo || u?.photoUrl || "";
                  const uname = u?.name || "Unknown";
                  const email = u?.email || "—";
                  const role = u?.role || "donor";
                  const status = u?.status || "active";

                  return (
                    <tr key={u?._id || email} className="hover">
                      <td>
                        <div className="flex items-center gap-3">
                          {photo ? (
                            <div className="avatar">
                              <div className="w-10 rounded-full ring-2 ring-indigo-100">
                                <img src={photo} alt="avatar" />
                              </div>
                            </div>
                          ) : (
                            <div className="avatar placeholder">
                              <div className="w-10 rounded-full bg-indigo-100 text-indigo-700 font-bold ring-2 ring-indigo-100">
                                <span>{uname?.[0]?.toUpperCase() || "U"}</span>
                              </div>
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="font-semibold text-slate-800 truncate">
                              {uname}
                            </div>
                            <div className="text-xs text-slate-500 truncate">
                              ID: {u?._id || "—"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="text-slate-700">{email}</td>

                      <td>
                        <span className="badge badge-ghost badge-outline">
                          {role}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`badge badge-outline ${
                            status === "blocked" ? "badge-error" : "badge-success"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="text-right">
                        <div className="dropdown dropdown-end">
                          <button className="btn btn-ghost btn-sm" type="button">
                            <HiOutlineDotsVertical className="h-5 w-5" />
                          </button>
                          <ul className="dropdown-content menu rounded-xl border border-slate-200 bg-white p-2 shadow-lg w-56">
                            <li>
                              <button type="button" disabled className="gap-2">
                                {status === "blocked" ? (
                                  <>
                                    <FiUserCheck className="h-4 w-4 text-green-600" />
                                    Unblock user (UI)
                                  </>
                                ) : (
                                  <>
                                    <FiUserX className="h-4 w-4 text-red-600" />
                                    Block user (UI)
                                  </>
                                )}
                              </button>
                            </li>
                            <div className="my-1 h-px bg-slate-100" />
                            <li>
                              <button type="button" disabled className="gap-2">
                                <FiUsers className="h-4 w-4 text-indigo-600" />
                                Make volunteer (UI)
                              </button>
                            </li>
                            <li>
                              <button type="button" disabled className="gap-2">
                                <FiShield className="h-4 w-4 text-purple-600" />
                                Make admin (UI)
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </p>

          <div className="join">
            <button
              className="btn btn-sm join-item btn-outline"
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </button>

            <button className="btn btn-sm join-item btn-primary" type="button" disabled>
              {page}
            </button>

            <button
              className="btn btn-sm join-item btn-outline"
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllUser;
