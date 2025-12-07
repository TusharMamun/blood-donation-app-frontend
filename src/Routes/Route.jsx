import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/ClintLayout/MainLayout";
import NotFoundPage from "../Pages/NotFoundPage";
import Home from "../Pages/Home";
import About from "../Pages/AboutPage/About";
import DonationRequest from "../Pages/DonationRequest/DonationRequest";
import Funding from "../Pages/Funding/Funding";
import Loging from "../Authcomponents/LogingPage/Loging";
import Regestration from "../Authcomponents/RegesterPage/Regestration";
import DashboardLayout from "../components/layout/DashbordLayout/DashBoard";
import Profile from "../Authcomponents/Profile/Profile";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    // errorElement: <NotFoundPage />,
    children: [
      {
        index: true, // default route for "/"
        element: <Home />,
      },
      {
        path:"/about", // default route for "/"
      element:<About></About> 
      },
      {
        path:"/donation-requests", // default route for "/"
      element:<DonationRequest></DonationRequest>
      },
      {
        path:"/donation-requests", // default route for "/"
      element:<DonationRequest></DonationRequest>
      },
      {
        path:"/funding", // default route for "/"
      element:<Funding></Funding>
      },
      {
        path:'/loging',
        Component:Loging

      },
      {
        path:'/regester',
        Component:Regestration,
        loader:()=>fetch("/LocationData.json")


      }
    ],

  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <h1>home</h1>},
      {
path:"/dashboard/profile",
element:<Profile></Profile>

      } // ✅ /dashboard
      // { path: "all-users", element: <AllUsers /> }, // ✅ /dashboard/all-users (admin)
      // { path: "all-blood-donation-request", element: <AllBloodDonationRequest /> }, // ✅ /dashboard/all-blood-donation-request
    ],
  },
]);