import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  FiSearch,
  FiTrash2,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

const normalizeResponse = (payload, fallbackPage, fallbackLimit) => {
  // If backend returns array
  if (Array.isArray(payload)) {
    const total = payload.length;
    return {
      result: payload,
      total,
      page: 1,
      limit: total || fallbackLimit,
      totalPages: 1,
    };
  }

  // If backend returns {result,total,page,limit,totalPages}
  const result = Array.isArray(payload?.result) ? payload.result : [];
  const total = Number.isFinite(payload?.total) ? payload.total : 0;
  const page = Number.isFinite(payload?.page) ? payload.page : fallbackPage;
  const limit = Number.isFinite(payload?.limit) ? payload.limit : fallbackLimit;

  const totalPages =
    Number.isFinite(payload?.totalPages) && payload.totalPages > 0
      ? payload.totalPages
      : Math.max(1, Math.ceil((total || 0) / (limit || fallbackLimit || 10)));

  return { result, total, page, limit, totalPages };
};

const MyDonationRequests = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  // pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // reset to page 1 when filter/search/limit changes
  useEffect(() => {
    setPage(1);
  }, [status, search, limit]);

  const {
    data: normalized,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    enabled: !loading && !!user?.email,
    queryKey: ["myDonationRequests", user?.email, status, search, page, limit],
    queryFn: async () => {
      const res = await axiosSecure.get("/my-blood-donation-requests", {
        params: { email: user.email, status, search, page, limit },
      });
      return normalizeResponse(res.data, page, limit);
    },
    keepPreviousData: true, // for react-query v4
  });

  const rows = normalized?.result || [];
  const total = normalized?.total ?? 0;
  const totalPages = normalized?.totalPages ?? 1;

  // ✅ Ensure local page never exceeds totalPages (important after search/filter)
  useEffect(() => {
    if (!normalized) return;
    const safe = clamp(page, 1, totalPages);
    if (safe !== page);
  }, [normalized, page, totalPages]);

  // page buttons
  const pageButtons = useMemo(() => {
    const pages = [];
    const add = (p) => pages.push(p);

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) add(i);
      return pages;
    }

    add(1);
    if (page > 4) add("...");

    const start = Math.max(2, page - 2);
    const end = Math.min(totalPages - 1, page + 2);
    for (let i = start; i <= end; i++) add(i);

    if (page < totalPages - 3) add("...");
    add(totalPages);

    return pages;
  }, [page, totalPages]);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete this request?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.delete(`/my-blood-donation-requests/${id}`);

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        timer: 1200,
        showConfirmButton: false,
      });

      // If last item on current page deleted -> go back a page
      if (rows.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        refetch();
      }
    } catch (err) {
      Swal.fire(
        "Failed!",
        err?.response?.data?.message || err?.message || "Delete failed",
        "error"
      );
    }
  };

  if (loading || isLoading) return <div className="p-6">Loading...</div>;
  if (isError) return <div className="p-6">Error: {error?.message}</div>;

  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800">
            My Donation Requests
          </h1>
          <p className="text-sm text-slate-500">
            Requests by: <span className="font-semibold">{user?.email}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 text-slate-700">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <FiFilter className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <p className="font-semibold">Requests</p>
            <p className="text-xs text-slate-500">
              {isFetching ? "Updating..." : `Showing ${from}-${to} of ${total}`}
            </p>
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-slate-700">
            <p className="font-semibold">Requests Table</p>
            <p className="text-xs text-slate-500">
              Page {page} of {totalPages}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {/* Status Filter */}
            <div className="join">
              {["all", "pending", "inprogress", "done", "canceled"].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`btn btn-sm join-item ${
                    status === s ? "btn-primary" : "btn-outline"
                  }`}
                  onClick={() => setStatus(s)}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Search */}
            <label className="input input-bordered input-sm flex items-center gap-2 w-full sm:w-80">
              <FiSearch className="opacity-60" />
              <input
                type="text"
                className="grow"
                placeholder="Search recipient / hospital / address / blood / status"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>

            {/* Page size */}
            <select
              className="select select-bordered select-sm"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}/page
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="text-slate-600">
                <th>Recipient</th>
                <th>Blood</th>
                <th>Hospital</th>
                <th>Location</th>
                <th>Status</th>
                <th className="text-right">Created</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    No donation requests found.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r._id} className="hover">
                    <td className="font-semibold text-slate-800">
                      {r.recipientName || "—"}
                      <div className="text-xs text-slate-500">
                        Requested by: {r.requesterName || "—"} (
                        {r.requesterEmail || "—"})
                      </div>
                    </td>

                    <td>
                      <span className="badge badge-outline">
                        {r.bloodGroup || "—"}
                      </span>
                    </td>

                    <td className="text-slate-700">{r.hospitalName || "—"}</td>

                    <td className="text-slate-700">
                      {[r.recipientUpazila, r.recipientDistrict, r.fullAddress]
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </td>

                    <td>
                      <span className="badge badge-outline">{r.status || "—"}</span>
                    </td>

                    <td className="text-right text-slate-600">
                      {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
                    </td>

                    <td className="text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(r._id)}
                        className="btn btn-error btn-sm rounded-xl gap-2"
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200 p-4">
          <div className="text-sm text-slate-600">
            Showing <span className="font-semibold">{from}</span> to{" "}
            <span className="font-semibold">{to}</span> of{" "}
            <span className="font-semibold">{total}</span> results
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button
              className="btn btn-sm btn-outline"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <FiChevronLeft /> Prev
            </button>

            <div className="join">
              {pageButtons.map((p, idx) =>
                p === "..." ? (
                  <button
                    key={`${p}-${idx}`}
                    className="btn btn-sm join-item btn-disabled"
                  >
                    ...
                  </button>
                ) : (
                  <button
                    key={p}
                    className={`btn btn-sm join-item ${
                      page === p ? "btn-primary" : "btn-outline"
                    }`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                )
              )}
            </div>

            <button
              className="btn btn-sm btn-outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDonationRequests;
