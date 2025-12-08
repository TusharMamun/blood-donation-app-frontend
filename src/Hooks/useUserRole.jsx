import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();



  const {data:role,isLoading:IsRoleLoadding} =useQuery(
    {
      enabled:!loading && !!user?.email,
      queryKey:["role",user?.email],


      queryFn:async()=>{
        const {data} =await axiosSecure(`/regesterDoner/role/${user.email}`)
        return data.role
      }
    }
  )
return [role,IsRoleLoadding]
};

export default useUserRole;
