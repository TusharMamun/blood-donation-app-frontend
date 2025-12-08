import React, { useMemo, useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Link, useLoaderData, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import Loading from "../../components/Uicomponent/Loadding";
import { imageUpload } from "../../utils";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const Regestration = () => {
  const { createUser, updateUserProfile } = useAuth();
  const locaitondata = useLoaderData();
  const AxiosSecure = useAxiosSecure()

  // const navigate = useNavigate();
  // const location = useLocation();
  // const from = location.state?.from?.pathname || "/";

  const bloodGroups = useMemo(
    () => ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    []
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      name: "",
      ProfileImage: null,
      bloodGroup: "",
      district: "",
      upazila: "",
      password: "",
      confirmPassword: "",
    },
  });

  // ✅ useWatch
  const password = useWatch({ control, name: "password" });
  const districtId = useWatch({ control, name: "district" });

  // ✅ selected district (safe compare)
  const selectedDistrict = useMemo(() => {
    return locaitondata?.find((d) => String(d.id) === String(districtId));
  }, [locaitondata, districtId]);

  const upazilas = selectedDistrict?.upazilas ?? [];

  // ✅ reset upazila when district changes
  useEffect(() => {
    setValue("upazila", "");
  }, [districtId, setValue]);

  const hendelRegestration = async (data) => {
    // ✅ add district name into submitted data
    const districtObj = locaitondata?.find(
      (d) => String(d.id) === String(data.district)
    );




    const finalData = {
      ...data,
      districtName: districtObj?.name || "",
    };

    const { name, email, password, ProfileImage } = finalData;






    const imageFile = ProfileImage?.[0];
    if (!imageFile) {
      Swal.fire({
        icon: "error",
        title: "Image required",
        text: "Please select a profile image!",
      });
      return;
    }

    try {
      setPageLoading(true);

      // 1) upload image
      const photoURL = await imageUpload(imageFile);

      // 2) create user
      const result = await createUser(email, password);
       const donorPayload = {
      email: data.email,
      name: data.name,
      bloodGroup: data.bloodGroup,
      district: finalData.districtName,
      upazila: data.upazila,
      photoUrl:photoURL,
      role: "donor",
      status: "active",
        };

      // 3) update profile
      await updateUserProfile({
        displayName: name,
        photoURL: photoURL || "",
      });

AxiosSecure.post('/regesterDoner',donorPayload)
.then(res=>{
console.log("after savign regesterDonerData",res.data)
})
      // console.log("Registered:", result.user);
      // console.log("FINAL DATA =>", finalData);

      // ✅ success alert only
      await Swal.fire({
        icon: "success",
        title: "Registration successful!",
        text: "Your account has been created.",
        timer: 1500,
        showConfirmButton: false,
      });

      reset();
      // navigate(from, { replace: true }); // ✅ same previous functionality
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Registration failed",
        text: err?.response?.data || err.message || "Something went wrong!",
      });




    } finally {
      setPageLoading(false);
    }
  };

  if (pageLoading) return <Loading label="Uploading photo & creating account..." />;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-base-200">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-2xl bg-base-100 p-7 shadow">
          <form className="space-y-4" onSubmit={handleSubmit(hendelRegestration)}>
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-extrabold">Registration</h2>
                <p className="text-sm text-base-content/70">Create your donor account</p>
              </div>

              <Link to="/loging" className="link link-primary text-sm">
                Already have an account?
              </Link>
            </div>

            {/* Email + Name */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Email</span>
                </div>
                <input
                  type="email"
                  placeholder="you@email.com"
                  className={`input input-bordered w-full ${errors.email ? "input-error" : ""}`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                />
                {errors.email && (
                  <div className="label">
                    <span className="label-text-alt text-error">{errors.email.message}</span>
                  </div>
                )}
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Name</span>
                </div>
                <input
                  type="text"
                  placeholder="Your full name"
                  className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`}
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <div className="label">
                    <span className="label-text-alt text-error">{errors.name.message}</span>
                  </div>
                )}
              </label>
            </div>

            {/* Profile Picture */}
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Profile Picture</span>
                  <span className="label-text-alt text-base-content/60">upload</span>
                </div>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full"
                  accept="image/*"
                  {...register("ProfileImage", { required: "Profile image is required" })}
                />
                {errors.ProfileImage && (
                  <div className="label">
                    <span className="label-text-alt text-error">
                      {errors.ProfileImage.message}
                    </span>
                  </div>
                )}
              </label>
            </div>

            {/* Blood Group */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">Blood Group</span>
              </div>
              <select
                className={`select select-bordered w-full ${
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
                <div className="label">
                  <span className="label-text-alt text-error">{errors.bloodGroup.message}</span>
                </div>
              )}
            </label>

            {/* District + Upazila */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* District */}
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

                  {locaitondata?.map((dis) => (
                    <option key={dis.id} value={dis.id}>
                      {dis.name}
                    </option>
                  ))}
                </select>

                {errors.district && (
                  <div className="label">
                    <span className="label-text-alt text-error">{errors.district.message}</span>
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
                    <span className="label-text-alt text-error">{errors.upazila.message}</span>
                  </div>
                )}
              </label>
            </div>

            {/* Password + Confirm */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Password</span>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`input input-bordered w-full pr-12 ${
                      errors.password ? "input-error" : ""
                    }`}
                    {...register("password", {
                      required: "Password is required",
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/,
                        message:
                          "Password must have uppercase, lowercase, number & special character (min 6)",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="btn btn-ghost btn-sm absolute right-1 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {errors.password && (
                  <div className="label">
                    <span className="label-text-alt text-error">{errors.password.message}</span>
                  </div>
                )}
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Confirm Password</span>
                </div>

                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    className={`input input-bordered w-full pr-12 ${
                      errors.confirmPassword ? "input-error" : ""
                    }`}
                    {...register("confirmPassword", {
                      required: "Confirm password is required",
                      validate: (value) => value === password || "Password does not match",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    className="btn btn-ghost btn-sm absolute right-1 top-1/2 -translate-y-1/2"
                  >
                    {showConfirm ? "Hide" : "Show"}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <div className="label">
                    <span className="label-text-alt text-error">
                      {errors.confirmPassword.message}
                    </span>
                  </div>
                )}
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-full rounded-xl">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Regestration;
