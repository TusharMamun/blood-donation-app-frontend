import axios from 'axios';
import React, { useEffect } from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const AxiosSecure = axios.create({
  baseURL: 'http://localhost:3000', // Replace with your API base
});

const useAxiosSecure = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Request interceptor
    const reqInterceptor = AxiosSecure.interceptors.request.use(
      async (config) => {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
          const token = await currentUser.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    const resInterceptor = AxiosSecure.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error?.response?.status;

        if (status === 401 || status === 403) {
          logOut().then(() => {
            navigate('/loging');
          });
        }

        return Promise.reject(error);
      }
    );

    // Clean up interceptors on unmount
    return () => {
      AxiosSecure.interceptors.request.eject(reqInterceptor);
      AxiosSecure.interceptors.response.eject(resInterceptor);
    };
  }, [logOut, navigate]);

  return AxiosSecure;
};

export default useAxiosSecure;
