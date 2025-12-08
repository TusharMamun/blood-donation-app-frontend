import React, { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { updateProfile } from "firebase/auth";

import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

import { imageUpload } from "../../utils";
import Loading from "../../components/Uicomponent/Loadding";

const UpdateProfile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const locationData = useLoaderData(); // districts with upazilas
  const navigate = useNavigate();

  const [pageLoading, setPageLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.displayName || "",
      email: user?.email || "",
      district: "",
      upazila: user?.upazila || "",
      photoFile: null,
    },
  });

  const districtId = useWatch({ control, name: "district" });

  const selectedDistrict = useMemo(() => {
    return locationData?.find((d) => String(d.id) === String(districtId));
  }, [locationData, districtId]);

  const upazilas = selectedDistrict?.upazilas ?? [];

  // set initial district from user's saved district name (DB)
  useEffect(() => {
    if (!locationData?.length) return;

    const matched = locationData.find(
      (d) => d.name?.toLowerCase() === (user?.district || "").toLowerCase()
    );

    if (matched?.id) setValue("district", String(matched.id));
  }, [locationData, user?.district, setValue]);

  // reset upazila when district changes
  useEffect(() => {
    setValue("upazila", "");
  }, [districtId, setValue]);

  const onSubmit = async (data) => {
    try {
      setPageLoading(true);

      // district name from districtId
      const districtObj = locationData?.find(
        (d) => String(d.id) === String(data.district)
      );
      const districtName = districtObj?.name || "";

      // upload photo (optional)
      let photoURL = user?.photoURL || "";
      const imageFile = data.photoFile?.[0];
      if (imageFile) {
        photoURL = await imageUpload(imageFile);
      }

      // update firebase profile (name + photo)
      if (user) {
        await updateProfile(user, {
          displayName: data.name,
          photoURL: photoURL,
        });
      }

      // update database
      const payload = {
        email: user?.email, // ✅ required by backend
        name: data.name,
        district: districtName,
        upazila: data.upazila,
        photoUrl: photoURL, // ✅ backend supports photoUrl
      };

      await axiosSecure.put("/update/profile", payload);

      await Swal.fire({
        icon: "success",
        title: "Profile updated!",
        timer: 1400,
        showConfirmButton: false,
      });

      navigate(-1);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: err?.response?.data?.message || err?.message || "Something went wrong",
      });
    } finally {
      setPageLoading(false);
    }
  };

  if (pageLoading) return <Loading></Loading>

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Update Profile
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Update your name, district, upazila and photo.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            {/* Name */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">Name</span>
              </div>
              <input
                className={`input input-bordered w-full rounded-xl ${
                  errors.name ? "input-error" : ""
                }`}
                placeholder="Your name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <div className="label">
                  <span className="label-text-alt text-error">
                    {errors.name.message}
                  </span>
                </div>
              )}
            </label>

            {/* Email */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">Email</span>
              </div>
              <input
                type="email"
                readOnly
                className="input input-bordered w-full rounded-xl bg-slate-100"
                {...register("email")}
              />
            </label>

            {/* Photo Upload */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">Profile Photo</span>
                <span className="label-text-alt text-base-content/60">
                  (optional)
                </span>
              </div>
              <input
                type="file"
                className="file-input file-input-bordered w-full"
                accept="image/*"
                {...register("photoFile")}
              />
            </label>

            {/* District + Upazila */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">District</span>
                </div>

                <select
                  className={`select select-bordered w-full ${
                    errors.district ? "select-error" : ""
                  }`}
                  defaultValue=""
                  {...register("district", { required: "District is required" })}
                >
                  <option value="" disabled>
                    Select district
                  </option>
                  {locationData?.map((dis) => (
                    <option key={dis.id} value={dis.id}>
                      {dis.name}
                    </option>
                  ))}
                </select>

                {errors.district && (
                  <div className="label">
                    <span className="label-text-alt text-error">
                      {errors.district.message}
                    </span>
                  </div>
                )}
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Upazila</span>
                </div>

                <select
                  className={`select select-bordered w-full ${
                    errors.upazila ? "select-error" : ""
                  }`}
                  disabled={!districtId}
                  defaultValue=""
                  {...register("upazila", { required: "Upazila is required" })}
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

                {errors.upazila && (
                  <div className="label">
                    <span className="label-text-alt text-error">
                      {errors.upazila.message}
                    </span>
                  </div>
                )}
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                className="btn btn-ghost rounded-xl"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary rounded-xl flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
