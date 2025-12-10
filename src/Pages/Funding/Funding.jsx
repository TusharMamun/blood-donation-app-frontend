import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const Funding = () => {
  const [open, setOpen] = useState(false);
const {user} =useAuth()
const axiosSecure =useAxiosSecure()

  // demo table data (static)
  const fundings = useMemo(
    () => [
      { id: "1", name: "Nadine Gregory", amount: 1200, date: "2025-12-01" },
      { id: "2", name: "Libby Porter", amount: 500, date: "2025-12-03" },
      { id: "3", name: "Channing House", amount: 2500, date: "2025-12-06" },
    ],
    []
  );

  const total = fundings.reduce((sum, f) => sum + (Number(f.amount) || 0), 0);

  const {
  
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: "", email: "", amount: "" },
    mode: "onTouched",
  });

  const closeModal = () => {
    setOpen(false);
    reset();
  };

  // ONLY get modal data (no functionality for counting/table update)
const onSubmit = async (data) => {
  try {
    const amount = Number(data.amount);
    if (!user?.email) throw new Error("User email missing");
    if (!amount || amount < 1) throw new Error("Amount must be at least 1");

    const paymentinfo = {
      name: user?.displayName || "Anonymous",
      email: user.email,
      amount,
    };

    const res = await axiosSecure.post("/create-checkout-session", paymentinfo);

    const url = res?.data?.url;
    console.log(url)
    if (!url) throw new Error("No checkout url returned from server");

    window.location.href = url; 
  } catch (err) {
    console.log("Checkout error:", err?.response?.data || err.message);
  }
};


  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-5 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Funding</h2>
          <p className="text-sm text-slate-500 mt-1">
            All funds made by users (tabular view).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-xl border bg-white px-4 py-2">
            <p className="text-xs text-slate-500">Total Fund</p>
            <p className="font-extrabold text-slate-900">
              ৳ {total.toLocaleString()}
            </p>
          </div>

          <button
            className="btn btn-primary rounded-xl"
            type="button"
            onClick={() => setOpen(true)}
          >
            Give Fund
          </button>
        </div>
      </div>

      {/* Table (static) */}
      <div className="rounded-2xl border bg-white shadow-sm overflow-x-auto">
        <table className="table">
          <thead>
            <tr className="bg-slate-50">
              <th>User Name</th>
              <th className="text-right">Fund Amount</th>
              <th>Funding Date</th>
              <th className="text-right">Receipt</th>
            </tr>
          </thead>

          <tbody>
            {fundings.map((f) => (
              <tr key={f.id}>
                <td className="font-semibold text-slate-900">{f.name}</td>
                <td className="text-right font-bold">
                  ৳ {Number(f.amount).toLocaleString()}
                </td>
                <td className="text-slate-700">{f.date}</td>
                <td className="text-right">
                  <button className="btn btn-outline btn-sm rounded-xl" type="button">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Give Fund Modal (Form only) */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            {/* Modal Header */}
            <div className="p-5 border-b flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Give Fund</h3>
                <p className="text-sm text-slate-500">
                  Pay securely using Stripe (UI only).
                </p>
              </div>
              <button className="btn btn-ghost btn-sm" type="button" onClick={closeModal}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Modal Body */}
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-slate-800">Your Name</label>
                    <input
                      className="input input-bordered w-full rounded-xl bg-white mt-1"
                      readOnly
                      placeholder={user?.displayName}
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-800">Email</label>
                    <input
                      className="input input-bordered w-full rounded-xl bg-white mt-1"
                      placeholder={user.email}
                      readOnly
                      {...register("email",)}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-800">Fund Amount (৳)</label>
                  <input
                    type="number"
                    className="input input-bordered w-full rounded-xl bg-white mt-1"
                    placeholder="e.g. 500"
                    min={1}
                    step="1"
                    {...register("amount", {
                      required: "Amount is required",
                      min: { value: 1, message: "Minimum amount is ৳ 1" },
                    })}
                  />
                  <p className="text-xs text-slate-500 mt-1">Minimum amount: ৳ 1</p>
                  {errors.amount && (
                    <p className="mt-1 text-xs text-red-600">{errors.amount.message}</p>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t flex items-center justify-end gap-2">
                <button className="btn btn-outline rounded-xl" type="button" onClick={closeModal}>
                  Cancel
                </button>
                <button className="btn btn-primary rounded-xl" type="submit" disabled={isSubmitting}>
                  Pay &amp; Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Funding;
