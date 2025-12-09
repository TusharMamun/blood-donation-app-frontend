import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const STATUSES = ["", "inprogress", "pending", "approved", "done", "cancelled"];

const BLOOD = ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const AllDonerRequestes = () => {
  const axiosSecure = useAxiosSecure();

  const [status, setStatus] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const params = useMemo(
    () => ({ status, bloodGroup, search, page, limit }),
    [status, bloodGroup, search, page]
  );

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["blood-donation-requests", params],
    queryFn: async () => {
      const res = await axiosSecure.get("/blood-donation-requests", { params });
      return res.data; // {result,total,page,totalPages}
    },
    keepPreviousData: true,
  });

  // optional: update status from table dropdown
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) =>
      axiosSecure.patch(`/blood-donation-requests/${id}/status`, { status }),
    onSuccess: () => refetch(),
  });

  const list = data?.result || [];
  const totalPages = data?.totalPages || 1;

  const badgeClass = (s) => {
    if (s === "pending") return "badge badge-warning badge-outline";
    if (s === "approved") return "badge badge-success badge-outline";
    if (s === "done") return "badge badge-info badge-outline";
    if (s === "cancelled") return "badge badge-error badge-outline";
        if (s === "inprogress") return "badge badge-success badge-outline";
   
    return "badge badge-ghost";
  };

  const onReset = () => {
    setStatus("");
    setBloodGroup("");
    setSearch("");
    setPage(1);
  };
 refetch()
  if (isLoading) return <div className="p-10 text-center text-slate-500">Loading...</div>;
  if (isError) return <div className="p-10 text-center text-red-600">Error: {error?.message}</div>;

  return (
    <div className="p-4 sm:p-6">
      {/* Header (same vibe like your cards page) */}
      <div className="mb-5 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            All Blood Donation Requests
          </h2>
          <p className="text-sm text-slate-500">
     {isFetching ? " • Updating..." : ""}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            className="btn btn-outline btn-sm rounded-xl"
            type="button"
          >
            Refresh
          </button>
          <button
            onClick={onReset}
            className="btn btn-outline btn-sm rounded-xl"
            type="button"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          className="input input-bordered rounded-xl bg-white"
          placeholder="Search: requester/recipient/hospital/district/email"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="select select-bordered rounded-xl bg-white"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s ? `Status: ${s}` : "All Status"}
            </option>
          ))}
        </select>

        <select
          className="select select-bordered rounded-xl bg-white"
          value={bloodGroup}
          onChange={(e) => {
            setBloodGroup(e.target.value);
            setPage(1);
          }}
        >
          {BLOOD.map((b) => (
            <option key={b} value={b}>
              {b ? `Blood: ${b}` : "All Blood Groups"}
            </option>
          ))}
        </select>

        <div className="rounded-xl border bg-white px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-slate-500">Total</span>
          <span className="font-bold text-slate-900">{data?.total ?? 0}</span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border bg-white shadow-sm overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Requester</th>
              <th>Recipient</th>
              <th>District/Upazila</th>
              <th>Hospital</th>
              <th>Blood</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-10 text-center text-slate-500">
                  No requests found.
                </td>
              </tr>
            ) : (
              list.map((r) => (
                <tr key={r._id}>
                  <td>
                    <div className="leading-tight">
                      <div className="font-bold text-slate-900">{r.requesterName || "—"}</div>
                      <div className="text-xs text-slate-500">{r.requesterEmail || "—"}</div>
                    </div>
                  </td>

                  <td className="font-semibold">{r.recipientName || "—"}</td>

                  <td>
                    {r.recipientDistrict || "—"}
                    {r.recipientUpazila ? `, ${r.recipientUpazila}` : ""}
                  </td>

                  <td>{r.hospitalName || "—"}</td>
                  <td className="font-bold">{r.bloodGroup || "—"}</td>
                  <td>{r.donationDate || "—"}</td>
                  <td>{r.donationTime || "—"}</td>

                  <td>
                    <span className={badgeClass(r.status)}>{r.status || "—"}</span>
                  </td>

                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/dashboard/donation-request/${r._id}`}
                        className="btn btn-primary btn-sm rounded-xl"
                      >
                        View
                      </Link>

                      {/* optional status update */}
                      <select
                        className="select select-bordered select-sm rounded-xl bg-white"
                        defaultValue={r.status}
                        disabled={statusMutation.isPending}
                        onChange={(e) =>
                          statusMutation.mutate({ id: r._id, status: e.target.value })
                        }
                        title="Update status"
                      >
                        <option value="pending">pending</option>
                        <option value="approved">approved</option>
                        <option value="done">done</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <button
          className="btn btn-outline btn-sm rounded-xl disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>

        <div className="text-sm text-slate-500">
          Page <b className="text-slate-900">{data?.page || page}</b> of{" "}
          <b className="text-slate-900">{totalPages}</b>
        </div>

        <button
          className="btn btn-outline btn-sm rounded-xl disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllDonerRequestes;
