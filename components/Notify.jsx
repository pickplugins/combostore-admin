"use client";
import { useState, useEffect, Component } from "react";
import { IconArrowLeft, IconX, IconAlertSquare, IconCheck } from '@tabler/icons-react';



import { useCounterStore } from '../store/useCounterStore'




const Notify = (props) => {




  const { notifications, addNotification, cartItems, addCartItems, removeCartItems, resetCartItems, updateCartItems, userDataX, setUserDataX, navToggle, setnavToggle, lang, setlang } = useCounterStore()


  var [notificationsX, setnotificationsX] = useState(props.notifications); // Using the hook.



  useEffect(() => {

    var slicedArray = props.notifications.slice(-1);
    setnotificationsX(slicedArray)

    setTimeout(() => {
      setnotificationsX([]);
    }, 5000);

  }, [notifications]);



  return (
    <div className={`${notificationsX.length > 0 ? "" : "hidden"} fixed right-6  bottom-6 z-50`}>





      {notificationsX?.map((item, index) => {

        var type = item.type

        return (
          <div className={`max-w-72 min-w-64 mb-2 animate__animated animate__backInRight overflow-hidden relative rounded-sm shadow-md bg-white p-3 border-l-4 border-0 ${type == 'success' ? "   border-l-green-700 border-solid " : ""} ${type == 'error' ? "   border-l-red-700 border-solid" : ""} ${type == 'warnning' ? "  border-l-yellow-500 border-solid" : ""}`} key={index}>

            <span
              className="cursor-pointer px-1 bg-red-500 hover:bg-red-700 hover:text-white absolute top-0 right-0"
              onClick={(ev) => {
                var notificationsY = [...notifications];
                var notificationX = notificationsY.splice(index, 1);

                setnotificationsX(notificationX);
              }}>
              <IconX fill={"#fff"} />
            </span>

            <div className="flex items-center gap-3 ">
              <div>
                {type == "warnning" && (
                  <IconAlertSquare />
                )}
                {type == "error" && (
                  <IconX />
                )}
                {type == "success" && (
                  <IconCheck />
                )}
              </div>
              <div className="text-base mb-2">
                {item?.title}
              </div>
            </div>
            <div className="text-xs">{item?.content}</div>

          </div>
        )

      })}




    </div>
  );
};

export default Notify;