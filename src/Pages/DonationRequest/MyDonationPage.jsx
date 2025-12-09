import React from "react";
import useAuth from "../../Hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const MyDonationPage = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: MyreqestedDonation = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    enabled: !loading && !!user?.email,
    queryKey: ["mydonationRequest", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/my-blood-donation-requests?email=${user.email}`
      );
      return res.data;
    },
  });

  if (loading || isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <div>
      <h1>Total: {MyreqestedDonation.length}</h1>

      <ul>
        {MyreqestedDonation.map((req) => (
          <li key={req._id}>
            {req.bloodGroup} - {req.status} - {req.createdAt}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyDonationPage;