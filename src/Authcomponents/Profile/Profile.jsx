import React from "react";
import { FaCamera, FaEdit } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";
import cover from "../.././assets/CoverPhoto.jpg";
import useUserRole from "../../Hooks/useUserRole";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const Profile = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [role, isRoleLoading] = useUserRole();

  const { data: Profil, isLoading } = useQuery({
    enabled: !loading && !!user?.email,
    queryKey: ["Profile", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/profile/${user.email}`);
      return data;
    },
  });

  // ✅ Use DB data first, fallback to firebase user
  const name = Profil?.name || user?.displayName || "User";
  const email = Profil?.email || user?.email || "";
  const photo = Profil?.photo || Profil?.photoUrl || user?.photoURL || "";
  const district = Profil?.district || "—";
  const upazila = Profil?.upazila || "—";
  const bloodGroup = Profil?.bloodGroup || "—";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
          {/* Cover */}
          <div className="relative h-44 sm:h-56">
            <img className="h-full w-full object-cover" src={cover} alt="cover" />
            <div className="absolute inset-0 bg-black/25" />

            <button
              type="button"
              className="btn btn-sm absolute right-4 top-4 gap-2 rounded-xl bg-white/90 hover:bg-white"
              title="Update cover (UI only)"
            >
              <FaCamera className="text-slate-700" />
              <span className="hidden sm:inline">Update cover</span>
            </button>
          </div>

          {/* Content */}
          <div className="relative px-5 pb-6 sm:px-8">
            {/* Avatar */}
            <div className="-mt-12 flex flex-col items-center sm:-mt-14 sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="flex flex-col items-center sm:flex-row sm:items-end gap-4">
                <div className="relative">
                  {photo ? (
                    <img
                      src={photo}
                      alt="profile"
                      className="h-24 w-24 sm:h-28 sm:w-28 rounded-3xl object-cover ring-4 ring-white"
                    />
                  ) : (
                    <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-3xl bg-indigo-100 ring-4 ring-white grid place-items-center">
                      <span className="text-3xl font-extrabold text-indigo-700">
                        {name?.[0] || "U"}
                      </span>
                    </div>
                  )}

                  <button
                    type="button"
                    title="Update profile photo (UI only)"
                    className="btn btn-xs absolute -right-2 -bottom-2 rounded-xl bg-white hover:bg-slate-100 border"
                  >
                    <FaCamera className="text-slate-700" />
                  </button>
                </div>

                {/* Name */}
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {isLoading ? "Loading..." : name}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">{email}</p>
                </div>
              </div>

              <Link
                to="/dashboard/updateProfile"
                state={{
                  name,
                  email,
                  district,
                  upazila,
                  photoUrl: photo,
                  bloodGroup, // ✅ pass if you need in update form later
                }}
                className="btn btn-primary rounded-xl gap-2"
                title="Edit profile"
              >
                <FaEdit />
                Edit Profile
              </Link>
            </div>

            {/* Cards */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Role</p>
                <p className="font-semibold text-slate-900">
                  {isRoleLoading ? "Loading..." : role || Profil?.role || "—"}
                </p>
              </div>

              <div className="rounded-2xl border bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Status</p>
                <p className="font-semibold text-slate-900">
                  {Profil?.status || "Active"}
                </p>
              </div>

              {/* ✅ Blood Group card */}
              <div className="rounded-2xl border bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Blood Group</p>
                <p className="font-semibold text-slate-900">{bloodGroup}</p>
              </div>

              {/* Location */}
              <div className="rounded-2xl border bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Location</p>
                <div className="mt-1 space-y-1">
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">District:</span>{" "}
                    {district}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">Upazila:</span>{" "}
                    {upazila}
                  </p>
                </div>
              </div>
            </div>

            {/* NOTE: cards are UI. keep/remove as you want */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;