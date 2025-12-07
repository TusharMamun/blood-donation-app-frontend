import React, { use } from 'react'
import { AuthContext } from '../Authcomponents/providers/Authcontext'





const useAuth = () => {
    const AuthInfo =use(AuthContext)
  return   AuthInfo


}

export default useAuth