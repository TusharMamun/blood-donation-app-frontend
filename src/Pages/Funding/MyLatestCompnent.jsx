import React from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import {
  FiTrash2,
  FiEye,
  FiEdit,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const MyLatestCompnent = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const donorName =
    user?.displayName ||
    user?.name ||
    (user?.email ? user.email.split("@")[0] : "Donor");

  const {
    data: requests = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    enabled: !loading && !!user?.email,
    queryKey: ["dashboardLatest3Requests", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/my-blood-donation-requests", {
        params: { email: user.email },
      });
      return Array.isArray(res.data) ? res.data : [];
    },
  });

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
      refetch();
    } catch (err) {
      Swal.fire(
        "Failed!",
        err?.response?.data?.message || err?.message || "Delete failed",
        "error"
      );
    }
  };
const updateRequestStatus = async (id, newStatus) => {
  const confirm = await Swal.fire({
    title: `Set status to "${newStatus}"?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, update",
    cancelButtonText: "Cancel",
  });

  if (!confirm.isConfirmed) return;

  try {
    await axiosSecure.patch(`/my-blood-donation-requests-to-processing/${id}`, {
      status: newStatus
    });

    await Swal.fire({
      icon: "success",
      title: `Status updated to "${newStatus}"!`,
      timer: 1200,
      showConfirmButton: false,
    });

    refetch();
  } catch (err) {
    Swal.fire(
      "Update failed!",
      err?.response?.data?.message || err?.message || "Something went wrong.",
      "error"
    );
  }
};

  // const handleStatusChange = async (id, nextStatus) => {
  //   const confirm = await Swal.fire({
  //     title: `Change status to "${nextStatus}"?`,
  //     icon: "question",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes",
  //     cancelButtonText: "No",
  //   });

  //   if (!confirm.isConfirmed) return;

  //   try {
  //     await axiosSecure.patch(`/my-blood-donation-requests/${id}`, {
  //       status: nextStatus, // "done" | "canceled"
  //     });

  //     await Swal.fire({
  //       icon: "success",
  //       title: "Updated!",
  //       timer: 1100,
  //       showConfirmButton: false,
  //     });

  //     refetch();
  //   } catch (err) {
  //     Swal.fire(
  //       "Failed!",
  //       err?.response?.data?.message || err?.message || "Update failed",
  //       "error"
  //     );
  //   }
  // };

  if (loading || isLoading) return <div className="p-6">Loading...</div>;
  if (isError) return <div className="p-6">Error: {error?.message}</div>;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* ✅ Simple welcome text (no banner) */}
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800">
          Welcome, <span className="text-emerald-600">{donorName}</span>
        </h1>
        <p className="text-sm text-slate-500">
          {isFetching ? "Updating..." : "Here are your latest donation requests."}
        </p>
      </div>

      {/* ✅ Latest 3 Requests (HIDDEN if none) */}
      {requests.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 p-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                My Recent Donation Requests (Max 3)
              </h2>
              <p className="text-sm text-slate-500">
                Requested by you ({requests.length} shown)
              </p>
            </div>

            <Link
              to="/dashboard/my-donation-requests"
              className="btn btn-outline btn-sm rounded-xl"
            >
              View My All Request
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="text-slate-600">
                  <th>Recipient</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Blood</th>
                  <th>Status</th>
                  <th>Donor Info</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((r) => {
                  const status = (r?.status || "").toLowerCase();
                  const isInProgress = status === "inprogress";

                  return (
                    <tr key={r._id} className="hover">
                      <td className="font-semibold text-slate-800">
                        {r?.recipientName || "—"}
                      </td>

                      <td className="text-slate-700">
                        {[r?.recipientUpazila, r?.recipientDistrict]
                          .filter(Boolean)
                          .join(", ") || "—"}
                      </td>

                      <td className="text-slate-700">{r?.donationDate || "—"}</td>

                      <td className="text-slate-700">{r?.donationTime || "—"}</td>

                      <td>
                        <span className="badge badge-outline">
                          {r?.bloodGroup || "—"}
                        </span>
                      </td>

                      <td>
                        <span className="badge badge-outline">
                          {r?.status || "—"}
                        </span>
                      </td>

                      <td className="text-slate-700">
                        {isInProgress ? (
                          <div className="text-sm">
                            <div className="font-semibold text-slate-800">
                              {r?.donorName || user?.displayName || "—"}
                            </div>
                            <div className="text-xs text-slate-500 break-all">
                              {r?.donorEmail || user?.email || "—"}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-sm">—</span>
                        )}
                      </td>

                      <td className="text-right">
                        <div className="flex flex-wrap gap-2 justify-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline rounded-xl gap-2"
                            onClick={() =>
                              navigate(`/donation-requests/${r._id}`)
                            }
                            // /donation-requests/:id
                          >
                            <FiEye /> View
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline rounded-xl gap-2"
                            onClick={() =>
                              navigate(`/updateDonation/${r._id}`)
                            }
                          >
                            <FiEdit /> Edit
                          </button>

                          
                          {isInProgress && (
                            <>
                              <button
                                type="button"
                                className="btn btn-sm btn-success rounded-xl gap-2"
                                onClick={() => handleStatusChange(r._id, "done")}
                              >
                                <FiCheckCircle /> Done
                              </button>
    <button
                                type="button"
                                className="btn btn-sm btn-warning rounded-xl gap-2"
                    onClick={() => updateRequestStatus(r._id, 'pending')}
                              >
                                <FiXCircle /> Cancel
                              </button>

                          
                            </>
                          )}

                          <button
                            type="button"
                            className="btn btn-sm btn-error rounded-xl gap-2"
                            onClick={() => handleDelete(r._id)}
                          >
                            <FiTrash2 /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ✅ Bottom “View my all request” button */}
          <div className="border-t border-slate-200 p-4 flex justify-end">
            <Link
              to="/dashboard/my-donation-requests"
              className="btn btn-primary rounded-xl"
            >
              View My All Request
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLatestCompnent;
