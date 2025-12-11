import React, { useState } from "react";
import useAuth from "../../Hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const  DonationRequestDetails=()=> {
  const { id } = useParams();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
const axiosSecure =useAxiosSecure()
 const navigate = useNavigate();

const handleInProgress = async (id) => {
  try {
    const res = await axiosSecure.patch(`/update-status/${id}`, {
      status: "inprogress",
    });

    const modifiedCount =
      res?.data?.modifiedCount ?? res?.data?.result?.modifiedCount ?? 0;

    if (modifiedCount === 1) {
      await Swal.fire({
        icon: "success",
        title: "Thank you for donating blood ❤️",
        text: "Your donation has been booked successfully.",
        timer: 1400,
        showConfirmButton: false,
      });

      setOpen(false);
  
      navigate("/donation-requests"); // 
    } else {
      await Swal.fire({
        icon: "error",
        title: "Sorry 😔",
        text: "Your donation was not booked. Please try again.",
        confirmButtonText: "OK",
      });
    }
  } catch (err) {
    await Swal.fire({
      icon: "error",
      title: "Sorry 😔",
      text:
        err?.response?.data?.message ||
        err?.message ||
        "Your donation was not booked. Please try again.",
      confirmButtonText: "OK",
    });
  }
};



  // Replace this with real data later


const { data: request, isLoading,refetch } = useQuery({
  queryKey: ["donationRequestDetails", id],
  enabled: !!id,
  queryFn: async () => {
    refetch()
    const res = await axiosSecure.get(`/blood-donation-requests-details/${id}`);
    return res.data;
  },
});

  if (isLoading) return <div>Loading...</div>;

  const badgeClass = (s) => {
    if (s === "pending") return "badge badge-warning badge-outline";
    if (s === "approved") return "badge badge-success badge-outline";
    if (s === "done") return "badge badge-info badge-outline";
    if (s === "cancelled") return "badge badge-error badge-outline";
    if (s === "inprogress") return "badge badge-primary badge-outline";
    return "badge badge-ghost";
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Blood Donation Request Details 🩸
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Review all information, then confirm donation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={badgeClass(request.status)}>
            {/* {request.status} */}
          </span>
          <button  onClick={() => navigate(-1)} className="btn btn-outline btn-sm rounded-xl" type="button">
            Back
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Main details */}
        <div className="lg:col-span-2 rounded-2xl border bg-white p-5 shadow-sm">
          <h3 className="text-lg font-extrabold text-slate-900 mb-4">
            Request Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Info label="Requester Name" value={request.requesterName} />
            <Info label="Requester Email" value={request.requesterEmail} />

            <Info label="Recipient Name" value={request.recipientName} />
            <Info
              label="District / Upazila"
              value={`${request.recipientDistrict}, ${request.recipientUpazila}`}
            />

            <Info label="Hospital Name" value={request.hospitalName} />
            <Info label="Blood Group" value={request.bloodGroup} />

            <Info label="Donation Date" value={request.donationDate} />
            <Info label="Donation Time" value={request.donationTime} />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3">
            <Info label="Full Address" value={request.fullAddress} />
            <Info label="Request Message" value={request.requestMessage} />
          </div>

          <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-xs text-slate-500">
              Created:{" "}
              <span className="font-semibold text-slate-700">
                {new Date(request.createdAt).toLocaleString()}
              </span>
            </p>

      {request.status === "pending" && (
  <button
    className="btn btn-primary rounded-xl"
    type="button"
    onClick={() => setOpen(true)}
    disabled={!user?.email}
    title={!user?.email ? "Login required" : ""}
  >
    Donate
  </button>
)}
          </div>

          {!user?.email && (
            <p className="mt-2 text-xs text-red-600">
              Please login to confirm donation.
            </p>
          )}
        </div>

        {/* Right: Sticky summary card */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm h-fit lg:sticky lg:top-6">
          <h3 className="text-lg font-extrabold text-slate-900">
            Quick Summary
          </h3>

          <div className="mt-4 space-y-3 text-sm">
            {/* <SummaryRow label="Status" value={request.status} /> */}
            <SummaryRow label="Blood Group" value={request.bloodGroup} />
            <SummaryRow
              label="When"
              value={`${request.donationDate} • ${request.donationTime}`}
            />
            <SummaryRow
              label="Where"
              value={`${request.recipientDistrict}, ${request.recipientUpazila}`}
            />
            <SummaryRow label="Hospital" value={request.hospitalName} />
          </div>

          <div className="mt-5 rounded-xl border bg-slate-50 p-4">
            <p className="text-xs text-slate-500">
              Tip: Confirm donation only if you can reach the recipient on time.
            </p>
          </div>
        </div>
      </div>

      {/* Donate Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Confirm Donation
                </h3>
                <p className="text-sm text-slate-500">
                  This will change status from <b>pending</b> to <b>inprogress</b>.
                </p>
              </div>

              <button
                className="btn btn-ghost btn-sm"
                type="button"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-sm font-semibold text-slate-800">
                  Donor Name
                </label>
                <input
                  className="input input-bordered w-full rounded-xl bg-white mt-1"
                  value={user?.displayName || user?.name || "Your Name"}
                  readOnly
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-800">
                  Donor Email
                </label>
                <input
                  className="input input-bordered w-full rounded-xl bg-white mt-1"
                  value={user?.email || "your@email.com"}
                  readOnly
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  className="btn btn-outline rounded-xl"
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary rounded-xl"
                  type="button"
              onClick={()=>{handleInProgress(request._id)}}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-900 break-words">
        {value || "—"}
      </p>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-900 text-right break-words">
        {value || "—"}
      </span>
    </div>
  );
}
export default DonationRequestDetails