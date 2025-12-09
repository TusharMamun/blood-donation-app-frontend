import React, { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const CreateDonationRequest = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const locationData = useLoaderData(); 
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const bloodGroups = useMemo(
    () => ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    []
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      requesterName: user?.displayName || "",
      requesterEmail: user?.email || "",
      recipientName: "",
      recipientDistrict: "",
      recipientUpazila: "",
      hospitalName: "",
      fullAddress: "",
      bloodGroup: "",
      donationDate: "",
      donationTime: "",
      requestMessage: "",
    },
  });

  // district->upazila
  const districtId = useWatch({ control, name: "recipientDistrict" });

  const selectedDistrict = useMemo(() => {
    return locationData?.find((d) => String(d.id) === String(districtId));
  }, [locationData, districtId]);

  const upazilas = selectedDistrict?.upazilas ?? [];

  useEffect(() => {
    setValue("recipientUpazila", "");
  }, [districtId, setValue]);

  const onSubmit = async (data) => {
    // ✅ status default pending (no input)
    const districtObj = locationData?.find(
      (d) => String(d.id) === String(data.recipientDistrict)
    );

    const payload = {
      requesterName: data.requesterName,
      requesterEmail: data.requesterEmail,
      recipientName: data.recipientName,
      recipientDistrict: districtObj?.name || "",
      recipientUpazila: data.recipientUpazila,
      hospitalName: data.hospitalName,
      fullAddress: data.fullAddress,
      bloodGroup: data.bloodGroup,
      donationDate: data.donationDate,
      donationTime: data.donationTime,
      requestMessage: data.requestMessage,
      status: "pending",
      createdAt: new Date(),
    };

    // ✅ confirmation alert
    const confirm = await Swal.fire({
      title: "Confirm Request?",
      text: "Do you want to create this donation request?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Request",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      setSubmitting(true);

      // 🔥 change endpoint as your backend route
      const res = await axiosSecure.post("/CreatedBloadDonation", payload);

      await Swal.fire({
        icon: "success",
        title: "Request Created!",
        text: "Your donation request has been submitted (pending).",
        timer: 1600,
        showConfirmButton: false,
      });

      // navigate where you want (example: my requests page)
      navigate("/dashboard");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err?.response?.data?.message || err?.message || "Something went wrong",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Create Donation Request
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Fill in the details to request blood donation.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
            {/* requester */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Requester Name</span>
                </div>
                <input
             
                  className="input input-bordered w-full rounded-xl bg-slate-100"
                  {...register("requesterName")}
                />
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Requester Email</span>
                </div>
                <input
               
                  className="input input-bordered w-full rounded-xl bg-slate-100"
                  {...register("requesterEmail")}
                />
              </label>
            </div>

            {/* recipient */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Recipient Name</span>
                </div>
                <input
                  className={`input input-bordered w-full rounded-xl ${
                    errors.recipientName ? "input-error" : ""
                  }`}
                  placeholder="Recipient full name"
                  {...register("recipientName", { required: "Recipient name is required" })}
                />
                {errors.recipientName && (
                  <p className="mt-1 text-xs text-error">{errors.recipientName.message}</p>
                )}
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Blood Group</span>
                </div>
                <select
                  className={`select select-bordered w-full rounded-xl ${
                    errors.bloodGroup ? "select-error" : ""
                  }`}
                  defaultValue=""
                  {...register("bloodGroup", { required: "Blood group is required" })}
                >
                  <option value="" disabled>
                    Select blood group
                  </option>
                  {bloodGroups.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
                {errors.bloodGroup && (
                  <p className="mt-1 text-xs text-error">{errors.bloodGroup.message}</p>
                )}
              </label>
            </div>

            {/* district/upazila */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Recipient District</span>
                </div>
                <select
                  className={`select select-bordered w-full rounded-xl ${
                    errors.recipientDistrict ? "select-error" : ""
                  }`}
                  defaultValue=""
                  {...register("recipientDistrict", { required: "District is required" })}
                >
                  <option value="" disabled>
                    Select district
                  </option>
                  {locationData?.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                {errors.recipientDistrict && (
                  <p className="mt-1 text-xs text-error">{errors.recipientDistrict.message}</p>
                )}
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Recipient Upazila</span>
                </div>
                <select
                  className={`select select-bordered w-full rounded-xl ${
                    errors.recipientUpazila ? "select-error" : ""
                  }`}
                  disabled={!districtId}
                  defaultValue=""
                  {...register("recipientUpazila", { required: "Upazila is required" })}
                >
                  <option value="" disabled>
                    {districtId ? "Select upazila" : "Select district first"}
                  </option>
                  {upazilas.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
                {errors.recipientUpazila && (
                  <p className="mt-1 text-xs text-error">{errors.recipientUpazila.message}</p>
                )}
              </label>
            </div>

            {/* hospital + address */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Hospital Name</span>
                </div>
                <input
                  className={`input input-bordered w-full rounded-xl ${
                    errors.hospitalName ? "input-error" : ""
                  }`}
                  placeholder="Dhaka Medical College Hospital"
                  {...register("hospitalName", { required: "Hospital name is required" })}
                />
                {errors.hospitalName && (
                  <p className="mt-1 text-xs text-error">{errors.hospitalName.message}</p>
                )}
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Full Address Line</span>
                </div>
                <input
                  className={`input input-bordered w-full rounded-xl ${
                    errors.fullAddress ? "input-error" : ""
                  }`}
                  placeholder="Zahir Raihan Rd, Dhaka"
                  {...register("fullAddress", { required: "Full address is required" })}
                />
                {errors.fullAddress && (
                  <p className="mt-1 text-xs text-error">{errors.fullAddress.message}</p>
                )}
              </label>
            </div>

            {/* date + time */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Donation Date</span>
                </div>
                <input
                  type="date"
                  className={`input input-bordered w-full rounded-xl ${
                    errors.donationDate ? "input-error" : ""
                  }`}
                  {...register("donationDate", { required: "Donation date is required" })}
                />
                {errors.donationDate && (
                  <p className="mt-1 text-xs text-error">{errors.donationDate.message}</p>
                )}
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Donation Time</span>
                </div>
                <input
                  type="time"
                  className={`input input-bordered w-full rounded-xl ${
                    errors.donationTime ? "input-error" : ""
                  }`}
                  {...register("donationTime", { required: "Donation time is required" })}
                />
                {errors.donationTime && (
                  <p className="mt-1 text-xs text-error">{errors.donationTime.message}</p>
                )}
              </label>
            </div>

            {/* message */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">Request Message</span>
              </div>
              <textarea
                className={`textarea textarea-bordered w-full rounded-xl min-h-[120px] ${
                  errors.requestMessage ? "textarea-error" : ""
                }`}
                placeholder="Write details why blood is needed..."
                {...register("requestMessage", {
                  required: "Request message is required",
                  minLength: { value: 10, message: "Write at least 10 characters" },
                })}
              />
              {errors.requestMessage && (
                <p className="mt-1 text-xs text-error">{errors.requestMessage.message}</p>
              )}
            </label>

            {/* submit */}
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary w-full rounded-xl"
            >
              {submitting ? "Requesting..." : "Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDonationRequest;
