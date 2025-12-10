import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (!sessionId) {
      setError("No session_id found in URL.");
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/checkout-session/${sessionId}`);
        setData(res.data);
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || "Failed to verify payment");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [axiosSecure, sessionId]);
  const transactionId = data?.payment_intent || data?.id || "—";
  const paid = data?.payment_status === "paid";
  const amount =
    data?.amount_total != null ? (data.amount_total / 100).toFixed(2) : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white shadow-xl border border-black/5 overflow-hidden">
        <div className="p-8">
          {loading && (
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">Verifying payment…</div>
              <p className="mt-2 text-slate-600">Please wait.</p>
            </div>
          )}

          {!loading && error && (
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">Verification failed</div>
              <p className="mt-2 text-slate-600">{error}</p>
              <Link
                to="/dashboard"
                className="inline-flex mt-6 justify-center items-center rounded-2xl px-5 py-3 bg-slate-900 text-white font-semibold hover:bg-black"
              >
                Go to Dashboard
              </Link>
            </div>
          )}

          {!loading && !error && (
            <div className="text-center">
              <div className="text-5xl">{paid ? "🎉" : "⚠️"}</div>
              <h1 className="mt-4 text-3xl font-bold text-slate-900">
                {paid ? "Payment Successful" : "Payment Not Completed"}
              </h1>

              <p className="mt-2 text-slate-600">
                {paid
                  ? "Thanks for your donation. Your payment has been confirmed."
                  : "We couldn’t confirm a completed payment for this session."}
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="rounded-2xl bg-slate-50 p-4 border border-black/5">
                  <p className="text-xs font-semibold text-slate-500">Email</p>
                  <p className="mt-1 font-semibold text-slate-800">{data?.customer_email}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-black/5">
                  <p className="text-xs font-semibold text-slate-500">Amount</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {amount} {data?.currency?.toUpperCase()}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-black/5 sm:col-span-2">
                  <p className="text-xs font-semibold text-slate-500">Session</p>
                  <p className="mt-1 font-mono text-sm text-slate-800 break-all">{data?.id}</p>
                </div>
              </div>
  <div className="rounded-2xl bg-slate-50 p-4 border border-black/5 sm:col-span-2">
                  <p className="text-xs font-semibold text-slate-500">
                    Transaction ID
                  </p>
                  <p className="mt-1 font-mono text-sm text-slate-800 break-all">
                    {transactionId}
                  </p>
                </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/dashboard"
                  className="inline-flex justify-center items-center rounded-2xl px-5 py-3 bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
                >
                  Go to Dashboard
                </Link>

                <Link
                  to="/"
                  className="inline-flex justify-center items-center rounded-2xl px-5 py-3 bg-white border border-black/10 text-slate-800 font-semibold hover:bg-slate-50"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="h-2 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />
      </div>
    </div>
  );
}
