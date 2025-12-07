import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import { router } from './Routes/Route.jsx'
import AuthProvider from './Authcomponents/providers/AuthProvider.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
<AuthProvider>
        <RouterProvider router={router} />
        {/* <Toaster position='top-right' reverseOrder={false} /> */}
      </AuthProvider>
 
  </StrictMode>,
)
