"use client";
import Login from '../components/Login';

import Register from '../components/Register';

import Dashboard from '../components/Dashboard';
import ComboshopVercelOnboarding from "../components/vercel/ComboshopVercelOnboarding";


import { useCounterStore } from '../store/useCounterStore'
import { AuthProvider } from '../components/auth-context';



export default function Home() {




  const { token, settings, appData, notifications, addNotification, userDataX, setUserDataX } = useCounterStore()






  return (

    <AuthProvider>

      {/* {!token && (
        <div className="grid xl:grid-cols-2 md:grid-cols-1 gap-20 w-full xl:w-[1200px] px-3 xl:px-10 mx-auto mt-10">
          <div className="bg-white p-5 rounded-sm">
            <h2 className="my-5 text-2xl">{("Register")}</h2>

            <Register />
          </div>
          <div className="bg-white p-5 rounded-sm">
            <h2 className="my-5 text-2xl">{("Login")}</h2>
            <Login />


          </div>
        </div>
      )} */}

      {/* {token && (

        <Dashboard />

      )} */}

      <ComboshopVercelOnboarding />


    </AuthProvider>
  );
}
