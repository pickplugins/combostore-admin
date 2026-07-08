"use client";
import Login from '../components/Login';

import Register from '../components/Register';

import ComboStoreLanding from '../components/ComboStoreLanding';
import ComboshopVercelOnboarding from "../components/vercel/ComboshopVercelOnboarding";


import { useCounterStore } from '../store/useCounterStore'
import { AuthProvider } from '../components/auth-context';



export default function Home() {




  const { token, settings, appData, notifications, addNotification, userDataX, setUserDataX } = useCounterStore()






  return (

    <AuthProvider>


      <ComboStoreLanding />
      {/* <ComboshopVercelOnboarding /> */}


    </AuthProvider>
  );
}
