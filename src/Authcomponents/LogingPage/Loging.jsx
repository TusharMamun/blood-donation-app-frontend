import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";

const Loging = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: "", password: "", remember: false },
  });

  const onSubmit = async (data) => {
    try {
      const res = await signIn(data.email, data.password);
      console.log("Logged in user:", res.user);

      await Swal.fire({
        icon: "success",
        title: "Login successful!",
        text: "Welcome back 🙂",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate(from, { replace: true });
    } catch (err) {
      console.log("Login error:", err?.message);

      Swal.fire({
        icon: "error",
        title: "Login failed!",
        text: err?.message || "Invalid email or password",
        confirmButtonText: "Try again",
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-base-200">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          {/* Left: Attractive side panel */}
          <div className="hidden lg:block">
            <div className="rounded-2xl bg-base-100 p-8 shadow">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-7 w-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      d="M12 2s6 6.6 6 12a6 6 0 1 1-12 0c0-5.4 6-12 6-12z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path d="M12 9v6" strokeLinecap="round" />
                    <path d="M9 12h6" strokeLinecap="round" />
                  </svg>
                </div>

                <div className="leading-tight">
                  <div className="text-xl font-extrabold uppercase text-primary">
                    Blood
                  </div>
                  <div className="-mt-1 text-xl font-extrabold uppercase">
                    Donation
                  </div>
                </div>
              </div>

              <h1 className="mt-6 text-3xl font-extrabold">Welcome Back</h1>
              <p className="mt-2 text-base-content/70">
                Log in to manage requests, funding, and your dashboard.
              </p>

              <div className="mt-6 grid gap-3">
                <div className="rounded-xl bg-base-200 p-4">
                  <div className="flex items-start gap-3">
                    <div className="badge badge-primary badge-lg mt-0.5">
                      Tip
                    </div>
                    <p className="text-sm leading-relaxed text-base-content/80">
                      Keep your account secure. Use a strong password.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-base-200 p-4">
                  <p className="text-sm text-base-content/70">
                    New here?
                    <Link to="/regester" className="link link-primary ml-2">
                      Create an account
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Login card */}
          <div className="rounded-2xl bg-base-100 p-7 shadow">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <h2 className="text-2xl font-extrabold">Login</h2>
                <p className="mt-1 text-sm text-base-content/70">
                  Enter your email and password to continue.
                </p>
              </div>

              {/* Email */}
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Email</span>
                </div>
                <input
                  type="email"
                  placeholder="you@email.com"
                  className={`input input-bordered w-full rounded-xl ${
                    errors.email ? "input-error" : ""
                  }`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email",
                    },
                  })}
                />
                {errors.email && (
                  <div className="label">
                    <span className="label-text-alt text-error">
                      {errors.email.message}
                    </span>
                  </div>
                )}
              </label>

              {/* Password (Show/Hide) */}
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Password</span>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`input input-bordered w-full rounded-xl pr-12 ${
                      errors.password ? "input-error" : ""
                    }`}
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Min 6 characters" },
                    })}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="btn btn-ghost btn-sm absolute right-1 top-1/2 -translate-y-1/2"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {errors.password && (
                  <div className="label">
                    <span className="label-text-alt text-error">
                      {errors.password.message}
                    </span>
                  </div>
                )}
              </label>

              {/* Remember me */}
              <div className="flex items-center justify-between gap-3">
                <label className="label cursor-pointer gap-2 p-0">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    {...register("remember")}
                  />
                  <span className="label-text">Remember me</span>
                </label>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="btn btn-primary w-full rounded-xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>

              <div className="divider text-sm">New user?</div>

              <p className="text-center text-sm text-base-content/70">
                Don’t have an account?{" "}
                  <Link to="/regester" className="link link-primary" >
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loging;
