import React, { useMemo, useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const UpdateDonationRequest = () => {
  const { user } = useAuth();
  const locaitondata = useLoaderData(); // 👈 only locations, like registration
  const AxiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { id } = useParams(); // 👈 request id from route /:id

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
      bloodGroup: "",
      recipientDistrict: "",
      recipientUpazila: "",
      hospitalName: "",
      fullAddress: "",
      donationDate: "",
      donationTime: "",
      requestMessage: "",
    },
  });

  // 🔁 district -> upazila (same pattern as Regestration)
  const districtId = useWatch({ control, name: "recipientDistrict" });

  const selectedDistrict = useMemo(() => {
    return locaitondata?.find((d) => String(d.id) === String(districtId));
  }, [locaitondata, districtId]);

  const upazilas = selectedDistrict?.upazilas ?? [];

  useEffect(() => {
    setValue("recipientUpazila", "");
  }, [districtId, setValue]);

  const handleUpdate = async (data) => {
    const districtObj = locaitondata?.find(
      (d) => String(d.id) === String(data.recipientDistrict)
    );
    const districtName = districtObj?.name || "";

    const payload = {
      requesterName: data.requesterName,
      requesterEmail: data.requesterEmail,
      recipientName: data.recipientName,
      recipientDistrict: districtName,
      recipientUpazila: data.recipientUpazila,
      hospitalName: data.hospitalName,
      fullAddress: data.fullAddress,
      bloodGroup: data.bloodGroup,
      donationDate: data.donationDate,
      donationTime: data.donationTime,
      requestMessage: data.requestMessage,
      // if backend sets status by default, you can omit status here
    };

    const confirm = await Swal.fire({
      title: "Update Request?",
      text: "Do you want to update this donation request?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Update",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      setSubmitting(true);

      await AxiosSecure.patch(`/blood-donation-requests-updateData/${id}`, payload);

      await Swal.fire({
        icon: "success",
        title: "Request Updated!",
        text: "Your donation request has been updated.",
        timer: 1600,
        showConfirmButton: false,
      });

      navigate("/dashboard");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong while updating",
      });
      console.error("Update error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-base-200">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-2xl bg-base-100 p-7 shadow">
          <form className="space-y-4" onSubmit={handleSubmit(handleUpdate)}>
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-extrabold">
                  Update Donation Request
                </h2>
                <p className="text-sm text-base-content/70">
                  Edit your blood donation request
                </p>
              </div>
            </div>

            {/* Requester Name + Email (readonly) */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">
                    Requester Name
                  </span>
                </div>
                <input
                  className="input input-bordered w-full bg-slate-100"
                  {...register("requesterName")}
                  readOnly
                />
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">
                    Requester Email
                  </span>
                </div>
                <input
                  className="input input-bordered w-full bg-slate-100"
                  {...register("requesterEmail")}
                  readOnly
                />
              </label>
            </div>

            {/* Recipient + Blood Group */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">
                    Recipient Name
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Recipient full name"
                  className={`input input-bordered w-full ${
                    errors.recipientName ? "input-error" : ""
                  }`}
                  {...register("recipientName", {
                    required: "Recipient name is required",
                  })}
                />
                {errors.recipientName && (
                  <div className="label">
                    <span className="label-text-alt text-error">
                      {errors.recipientName.message}
                    </span>
                  </div>
                )}
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Blood Group</span>
                </div>
                <select
                  className={`select select-bordered w-full ${
                    errors.bloodGroup ? "select-error" : ""
                  }`}
                  defaultValue=""
                  {...register("bloodGroup", {
                    required: "Blood group is required",
                  })}
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
                  <div className="label">
                    <span className="label-text-alt text-error">
                      {errors.bloodGroup.message}
                    </span>
                  </div>
                )}
              </label>
            </div>

            {/* District + Upazila (same as registration) */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* District */}
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">District</span>
                </div>

                <select
                  className={`select select-bordered w-full ${
                    errors.recipientDistrict ? "select-error" : ""
                  }`}
                  defaultValue=""
                  {...register("recipientDistrict", {
                    required: "District is required",
                  })}
                >
                  <option value="" disabled>
                    Select district
                  </option>

                  {locaitondata?.map((dis) => (
                    <option key={dis.id} value={dis.id}>
                      {dis.name}
                    </option>
                  ))}
                </select>

                {errors.recipientDistrict && (
                  <div className="label">
                    <span className="label-text-alt text-error">
                      {errors.recipientDistrict.message}
                    </span>
                  </div>
                )}
              </label>

              {/* Upazila */}
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Upazila</span>
                </div>

                <select
                  className={`select select-bordered w-full ${
                    errors.recipientUpazila ? "select-error" : ""
                  }`}
                  disabled={!districtId}
                  defaultValue=""
                  {...register("recipientUpazila", {
                    required: "Upazila is required",
                  })}
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
                  <div className="label">
                    <span className="label-text-alt text-error">
                      {errors.recipientUpazila.message}
                    </span>
                  </div>
                )}
              </label>
            </div>

            {/* Hospital + Address */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Hospital Name</span>
                </div>
                <input
                  type="text"
                  placeholder="Dhaka Medical College Hospital"
                  className={`input input-bordered w-full ${
                    errors.hospitalName ? "input-error" : ""
                  }`}
                  {...register("hospitalName", {
                    required: "Hospital name is required",
                  })}
                />
                {errors.hospitalName && (
                  <div className="label">
                    <span className="label-text-alt text-error">
                      {errors.hospitalName.message}
                    </span>
                  </div>
                )}
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Full Address</span>
                </div>
                <input
                  type="text"
                  placeholder="Zahir Raihan Rd, Dhaka"
                  className={`input input-bordered w-full ${
                    errors.fullAddress ? "input-error" : ""
                  }`}
                  {...register("fullAddress", {
                    required: "Full address is required",
                  })}
                />
                {errors.fullAddress && (
                  <div className="label">
                    <span className="label-text-alt text-error">
                      {errors.fullAddress.message}
                    </span>
                  </div>
                )}
              </label>
            </div>

            {/* Date + Time */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Donation Date</span>
                </div>
                <input
                  type="date"
                  className={`input input-bordered w-full ${
                    errors.donationDate ? "input-error" : ""
                  }`}
                  {...register("donationDate", {
                    required: "Donation date is required",
                  })}
                />
                {errors.donationDate && (
                  <div className="label">
                    <span className="label-text-alt text-error">
                      {errors.donationDate.message}
                    </span>
                  </div>
                )}
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Donation Time</span>
                </div>
                <input
                  type="time"
                  className={`input input-bordered w-full ${
                    errors.donationTime ? "input-error" : ""
                  }`}
                  {...register("donationTime", {
                    required: "Donation time is required",
                  })}
                />
                {errors.donationTime && (
                  <div className="label">
                    <span className="label-text-alt text-error">
                      {errors.donationTime.message}
                    </span>
                  </div>
                )}
              </label>
            </div>

            {/* Message */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">Request Message</span>
              </div>
              <textarea
                className={`textarea textarea-bordered w-full min-h-[120px] ${
                  errors.requestMessage ? "textarea-error" : ""
                }`}
                placeholder="Write details why blood is needed..."
                {...register("requestMessage", {
                  required: "Request message is required",
                  minLength: {
                    value: 10,
                    message: "Write at least 10 characters",
                  },
                })}
              />
              {errors.requestMessage && (
                <div className="label">
                  <span className="label-text-alt text-error">
                    {errors.requestMessage.message}
                  </span>
                </div>
              )}
            </label>

            <button
              type="submit"
              className="btn btn-primary w-full rounded-xl"
              disabled={submitting}
            >
              {submitting ? "Updating..." : "Update Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateDonationRequest;
