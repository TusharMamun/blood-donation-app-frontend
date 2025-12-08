import { useEffect, useMemo, useState } from "react";

import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import { app } from "../../Firabse/firebase.config";
import Loading from "../../components/Uicomponent/Loadding";
import { AuthContext } from "./Authcontext";


const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
 
 
  const createUser = async (email, password) => {
    setLoading(true);
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);

    try {
      return await signOut(auth);

    } finally {
      setLoading(false);
    
    }
  };

  const updateUserProfile = async ({ displayName, photoURL }) => {
    if (!auth.currentUser) return;
    return await updateProfile(auth.currentUser, { displayName, photoURL });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const authInfo = useMemo(
    () => ({
      user,
      loading,
      createUser,
      signIn,
      logOut,
      updateUserProfile,
      setUser,
      setLoading,
    }),
    [user, loading]
  );

  // ✅ HERE: show Loading while checking auth state
  if (loading) {
    return <Loading label="Checking authentication..." />;
  }

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
