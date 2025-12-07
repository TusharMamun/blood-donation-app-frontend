import React from 'react'
import Navbar from '../../common/Navber'
import { Outlet } from 'react-router-dom'


const MainLayout = () => {
  return (
<div>
     <Navbar></Navbar>
      <div className='pt-24 min-h-[calc(100vh-68px)]'>
        <Outlet />
      </div>
      {/* <Footer /> */}
    </div>
  )
}

export default MainLayout