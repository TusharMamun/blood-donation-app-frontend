import React from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { NavLink,useNavigate } from 'react-router-dom';
import Loading from '../../components/Uicomponent/Loadding';


const DonationRequest = () => {
 
  const axiosSecure = useAxiosSecure();
const navigate =useNavigate()
  const { data: pendingRequests = [], isLoading, refetch } = useQuery({
    queryKey: ["donation-requests", "pending"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/donation-requests", {
        params: { status: "pending" },
      });
      return data;
    },
  });

  if (isLoading) return <Loading />;

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Pending Donation Requests
          </h2>
          <p className="text-sm text-slate-500">
            Only requests with status <b>pending</b>.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="btn btn-outline btn-sm rounded-xl"
          type="button"
        >
          Refresh
        </button>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="rounded-2xl border bg-white p-10 text-center text-slate-500">
          No pending requests found.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pendingRequests.map((r) => (
            <div key={r._id} className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-500">Recipient</p>
                  <h3 className="text-lg font-bold text-slate-900">
                    {r.recipientName || "—"}
                  </h3>
                </div>
                <span className="badge badge-warning badge-outline">pending</span>
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-700">
                <p>
                  <span className="font-semibold text-slate-900">Location:</span>{" "}
                  {r.recipientDistrict || "—"}
                  {r.recipientUpazila ? `, ${r.recipientUpazila}` : ""}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Blood Group:</span>{" "}
                  {r.bloodGroup || "—"}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Date:</span>{" "}
                  {r.donationDate || "—"}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Time:</span>{" "}
                  {r.donationTime || "—"}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                     <button
                            type="button"
                            className="btn  btn-outline rounded-xl gap-2"
                            onClick={() =>
                              navigate(`/donation-requests/${r._id}`)
                            }
                            // /donation-requests/:id
                          >
                             View
                          </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationRequest;
