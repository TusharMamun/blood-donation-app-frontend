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
import AllUser from "../Pages/DashbordPages/AllUser";
import UpdateProfile from "../Authcomponents/Profile/UpdateProfile";
import CreataDonationRequest from "../Pages/DashbordPages/CreataDonationRequest";
import AllDonerRequestes from "../Pages/DashbordPages/AllDonerRequestes";
import MyDonationPage from "../Pages/DonationRequest/MyDonationPage";
import DonationRequestDetails from "../Pages/DashbordPages/DonationRequestDetails";
import PaymentSuccess from "../Pages/Funding/PaymentSuccess";
import DashboardHome from "../components/layout/DashboardPages/DashboardHome";
import UpdateDonationRequest from "../Pages/DonationRequest/UPdateRequest";



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
        path:"/donation-requests/:id", // default route for "/"
      element:<DonationRequestDetails></DonationRequestDetails>
      },
      {
        path:'/updateDonation/:id',
        element:<UpdateDonationRequest></UpdateDonationRequest>,
             loader:()=>fetch("/LocationData.json")
  

      },
      {
        path:"/funding", // default route for "/"
      element:<Funding></Funding>
      },
      {
      path:"/dashboard/payment-success",
element:<PaymentSuccess></PaymentSuccess>
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
      { index: true, 
        element: <DashboardHome></DashboardHome>
      }
        ,
      {
path:"/dashboard/profile",
element:<Profile></Profile>

      } ,
      {
path:"/dashboard/updateProfile",
element:<UpdateProfile></UpdateProfile>,
  loader:()=>fetch("/LocationData.json")

      } ,
        
      {
path:"/dashboard/all-users",
element:<AllUser></AllUser>

      } ,
      {
path:"/dashboard/all-blood-donation-request",
element:<AllDonerRequestes></AllDonerRequestes>

      } ,
      {
path:"/dashboard/my-donation-requests",
element:<MyDonationPage></MyDonationPage>

      } ,
      {
path:"/dashboard/creatDonerRequest",
element:<CreataDonationRequest></CreataDonationRequest>,
  loader:()=>fetch("/LocationData.json")

      } ,
    ],
  },
]);