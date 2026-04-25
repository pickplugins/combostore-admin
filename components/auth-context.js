"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useCounterStore } from '../store/useCounterStore'
import { useRouter } from "next/navigation";


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  // const { setToken } = useCounterStore.getState();

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  const { token, setToken, appData, notifications, addNotification, cartItems, addCartItems, removeCartItems, resetCartItems, updateCartItems, userDataX, setUserDataX, } = useCounterStore()

  const [user, setUser] = useState(null);



  const [error, setError] = useState(null);
  const [logging, setlogging] = useState(null);
  const [loading, setLoading] = useState(null);



  function fetchUser() {
    const token = localStorage.getItem("token");




    if (!token) {
      return;
      //throw new Error("No token found");
    }

    var postData = {};
    postData = JSON.stringify(postData);

    fetch(serverUrl + "wp-json/combo-store/v2/get_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: postData,
    })
      .then((response) => {
        if (response.status == 429) {
          setLoading(false);

          throw new Error("Too Many Requests");
        }
        if (!response.ok) {
          throw new Error("Token validation failed");
        }

        if (response.ok && response.status < 400) {
          response.json().then((res) => {


            var roles = res.user.roles;



            if (!roles?.includes("administrator")) {

              // setTimeout(() => {


              //   setUser(null)
              //   localStorage.removeItem("token");
              //   setToken(null);
              //   setUserDataX(null);
              //   router.push("/activity");

              // }, 500);



            }

            setUserDataX(res.user);

          });
        }
      })
      .catch((_error) => {
        //this.saveAsStatus = 'error';
        // handle the error
      });
  }
  useEffect(() => {
    fetchUser();
  }, []);




  const handleLogin = (username, password) => {



    // 📝 Fake login (replace with API call)
    // if (username === "admin" && password === "123456") {
    //   setUser({ name: "Admin User" });
    //   return true;
    // }
    // return false;
    setlogging(true);

    var postData = {
      username: username,
      password: password,
    };
    postData = JSON.stringify(postData);


    fetch(serverUrl + "wp-json/jwt-auth/v1/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: postData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Token validation failed");
        }

        if (response.ok && response.status < 400) {
          response.json().then((res) => {



            setToken(res.token);

            localStorage.setItem("token", res.token);

            setTimeout(() => {
              fetchUser()
              router.push("/");

            }, 500);
          });
        }
        setlogging(false);
      })
      .catch((_error) => {
        setError("Invalid credentials. Please try again.");
        setlogging(false);
      });
  };


  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("token");
    setToken(null);
    setUserDataX(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, logging, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
