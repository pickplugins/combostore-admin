"use client";
import { useState, useEffect, Component } from "react";
import { IconChevronDown, IconChevronUp, IconKey, IconTriangleSquareCircle, IconCreditCardPay, IconUserPentagon, IconMailSpark, IconBuildingStore, IconShip, IconStar, IconCashRegister, IconTrash, IconDiscount, IconAlien, IconTruckDelivery, IconSquareRoundedCheck } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

import { APIProvider, Map, useMapsLibrary, useMap } from '@vis.gl/react-google-maps';


import { useCounterStore } from '../store/useCounterStore'
import { useUtilsStore } from '../store/useUtilsStore';
import PopoverButton from '../components/PopoverButton';
import Spinner from '../components/Spinner';
import WidgetWrapper from '../components/WidgetWrapper';
import Tabs from '../components/Tabs';
import Tab from '../components/Tab';

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;





const SettingsGlobal = (props) => {
  const { formatDate, wrapCurrency } = useUtilsStore()


  const { token, cartToggle, setcartToggle, notifications, addNotification, cartItems, addCartItems, resetCartItems, userDataX, setUserDataX, navToggle, setnavToggle, lang, setlang } = useCounterStore()

  // var orderId = props?.order_id
  var [loading, setloading] = useState(false);

  var [settingsData, setsettingsData] = useState({ couriers: {}, fraudCheck: {}, apiKeys: {}, socialLinks: {}, emailTemplates: {}, productAttributes: [], shippingClasses: [], shippingZones: [], paymentGateways: { enable: false, accounts: [] } });




  useEffect(() => {
    get_settings();
  }, []);



  var apiKeysPrams = {

    "googleMap": {
      "label": "Google Map",
      args: {
        "key": "",
        "map_id": ""
      }
    },
    "facebookPixel": {
      "label": "Facebook Pixel",
      args: {
        "pixel_id": "",
        "events": [],
      }
    },
    "googleAnalytics": {
      "label": "Google Analytics",
      args: {
        "measurement_id": "",
      }
    },
    "googleLogin": {
      "label": "Google Login",
      args: {
        "client_id": "",
      }
    },


    "gemini": {
      "label": "Gemini",
      args: {
        "key": "",
        "model": ""
      }
    },
    "pollinations": {
      "label": "Pollinations",
      args: {
        "key": "",
        "model": ""
      }
    },



  }


  var geminiModelxPrams = [
    {
      "name": "Gemini 3 Flash (Preview)",
      "model_id": "gemini-3.0-flash-preview",
      "tier": "Free (rate limited)",
      "type": "Multimodal",
      "status": "Preview"
    },
    {
      "name": "Gemini 2.5 Flash",
      "model_id": "gemini-2.5-flash",
      "tier": "Free",
      "type": "Balanced reasoning + speed",
      "status": "Stable"
    },
    {
      "name": "Gemini 2.5 Flash-Lite",
      "model_id": "gemini-2.5-flash-lite",
      "tier": "Free",
      "type": "Lightweight / High quota",
      "status": "Stable"
    },
    {
      "name": "Gemini 2.0 Flash",
      "model_id": "gemini-2.0-flash",
      "tier": "Free",
      "type": "Fast production model",
      "status": "Stable"
    },
    {
      "name": "Gemini 2.5 Pro",
      "model_id": "gemini-2.5-pro",
      "tier": "Limited Free Tier",
      "type": "Advanced reasoning",
      "status": "Stable"
    },
    {
      "name": "Gemini 2.0 Pro (Experimental)",
      "model_id": "gemini-2.0-pro-exp",
      "tier": "Free (limited access)",
      "type": "Advanced reasoning",
      "status": "Experimental"
    },
    {
      "name": "Gemini 2.0 Flash Thinking (Experimental)",
      "model_id": "gemini-2.0-flash-thinking-exp",
      "tier": "Free (preview)",
      "type": "Enhanced reasoning",
      "status": "Experimental"
    }
  ]

  var pollinationsModelPrams = [
    {
      "name": "Flux",
      "model_id": "flux",
      "type": "Image Generation",
      "access": "Free",
      "description": "High-quality image generation model"
    },
    {
      "name": "GPT Image Large",
      "model_id": "gptimage-large",
      "type": "Image Generation",
      "access": "Free (basic usage)",
      "description": "Large Image model with good detail"
    },
    {
      "name": "Seedream",
      "model_id": "seedream",
      "type": "Image Generation",
      "access": "Free",
      "description": "Creative image generation model"
    },
    {
      "name": "Kontext",
      "model_id": "kontext",
      "type": "Image Generation",
      "access": "Free",
      "description": "Context-aware image generator"
    },
    {
      "name": "GPT-5",
      "model_id": "gpt-5",
      "type": "Text Generation",
      "access": "Free",
      "description": "General advanced text model"
    },
    {
      "name": "Claude",
      "model_id": "claude",
      "type": "Text Generation",
      "access": "Free",
      "description": "Conversational & analysis AI model"
    },
    {
      "name": "Gemini",
      "model_id": "gemini",
      "type": "Text Generation",
      "access": "Free",
      "description": "Google Gemini with agent tools"
    },
    {
      "name": "DeepSeek V3.2",
      "model_id": "deepseek-v3.2",
      "type": "Text Generation",
      "access": "Free",
      "description": "Smarter reasoning model"
    },
    {
      "name": "Qwen3-Coder-30B",
      "model_id": "qwen3-coder-30b",
      "type": "Text Generation",
      "access": "Free",
      "description": "Advanced code generation model"
    },
    {
      "name": "Seedance",
      "model_id": "seedance",
      "type": "Video Generation",
      "access": "Free",
      "description": "Text-to-video generation model"
    },
    {
      "name": "Veo (Alpha)",
      "model_id": "veo",
      "type": "Video Generation",
      "access": "Free (alpha)",
      "description": "Video generation model in alpha"
    },
    {
      "name": "OpenAI Audio",
      "model_id": "openai-audio",
      "type": "Audio (TTS/STT)",
      "access": "Free",
      "description": "Text-to-speech and speech-to-text"
    }
  ]


  var fraudCheckPrams = {

    "bdcourier": {
      "label": "BD Courier(bdcourier.com)",
      args: {
        "key": "",
      }
    },
    "fraudchecker": {
      "label": "Fraud Checker(fraudchecker.link)",
      args: {
        "key": "",
      }
    },
  }
  var couriersPrams = {
    "steadfast": {
      "label": "Steadfast",
      args: {
        "key": "",
        "secret": ""
      }
    },
    "pathao": {
      "label": "Pathao",
      args: {
        "key": "",
      }
    },
    "redx": {
      "label": "Redx",
      args: {
        "token": "",
      }
    },


  }










  var productAttributesPrams = {
    color: {
      "label": "Color",
      "slug": "color",
      "args": {
        "public": true,
        "publicly_queryable": true,
        "hierarchical": true,
        "show_in_rest": true,
      },
      "conditions": [
        {
          "post_type": ["product"],
          "categories": [],
        }
      ],
    },
    size: {
      "label": "Size",
      "slug": "size",
      "args": {
        "public": true,
        "publicly_queryable": true,
        "hierarchical": true,
        "show_in_rest": true,
      },
      "conditions": [
        {
          "post_type": ["product"],
          "categories": [],
        }
      ],
    },
    material: {
      "label": "Material",
      "slug": "material",
      "args": {
        "public": true,
        "publicly_queryable": true,
        "hierarchical": true,
        "show_in_rest": true,
      },
      "conditions": [
        {
          "post_type": ["product"],
          "categories": [],
        }
      ],
    },
    brand: {
      "label": "Brand",
      "slug": "brand",
      "args": {
        "public": true,
        "publicly_queryable": true,
        "hierarchical": true,
        "show_in_rest": true,
      },
      "conditions": [
        {
          "post_type": ["product"],
          "categories": [],
        }
      ],
    },
  }

  var paymentGatewaysPrams = {
    "cod": {
      "label": "Cash On Delivery",
      args: {
        "key": "",
        "secret": ""
      }
    },
    "bank_transfer": {
      "label": "Bank Transfer",
      args: {
        "key": "",
        "secret": ""
      }
    },
    "bkash": {
      "label": "Bkash",
      args: {
        "key": "",
        "secret": ""
      }
    },
    "bkashPersonal": {
      "label": "Bkash Personal",
      args: {
        "key": "",
        "secret": ""
      }
    },
    "nagad": {
      "label": "Nagad",
      args: {
        "key": "",
        "secret": ""
      }
    },
    "nagadPersonal": {
      "label": "Nagad Personal",
      args: {
        "key": "",
        "secret": ""
      }
    },
    "sslcommerz": {
      "label": "SSLCommerz",
      args: {
        "key": "",
        "secret": ""
      }
    },
    "aamarpay": {
      "label": "aamarPay",
      args: {
        "key": "",
        "secret": ""
      }
    },
  }

  var rolesPrams = {
    "administrator": {
      "label": "Administrator",
      args: {
        'read': true,
        'edit_posts': true,
        'publish_posts': true,
        'manage_options': true,
      }
    },
    "editor": {
      "label": "Editor",
      args: {
        'read': true,
        'edit_posts': true,
        'publish_posts': true,
        'manage_options': true,
      }
    },
    "author": {
      "label": "Author",
      args: {
        'read': true,
        'edit_posts': true,
        'publish_posts': true,
        'manage_options': true,
      }
    },
    "contributor": {
      "label": "Contributor",
      args: {
        'read': true,
        'edit_posts': true,
        'publish_posts': true,
        'manage_options': true,
      }
    },
    "subscriber": {
      "label": "Subscriber",
      args: {
        'read': true,
        'edit_posts': true,
        'publish_posts': true,
        'manage_options': true,
      }
    },
    "affiliate": {
      "label": "Affiliate",
      args: {
        'read': true,
        'edit_posts': true,
        'publish_posts': true,
        'manage_options': true,
      }
    },
    "customer": {
      "label": "Customer",
      args: {
        'read': true,
        'edit_posts': true,
        'publish_posts': true,
        'manage_options': true,
      }
    },
    "supplier": {
      "label": "Supplier",
      args: {
        'read': true,
        'edit_posts': true,
        'publish_posts': true,
        'manage_options': true,
      }
    },
    "seller": {
      "label": "Seller",
      args: {
        'read': true,
        'edit_posts': true,
        'publish_posts': true,
        'manage_options': true,
      }
    },
    "rider": {
      "label": "Rider",
      args: {
        'read': true,
        'edit_posts': true,
        'publish_posts': true,
        'manage_options': true,
      }
    },








  }











  var socialLinksPrams = {
    "facebook": {
      "url": "",
    },
    "youtube": {
      "url": "",
    },
    "instagram": {
      "url": "",
    },
    "twitter": {
      "url": "",
    },
    "linkedin": {
      "url": "",
    },
    "tiktok": {
      "url": "",
    },
    "messenger": {
      "url": "",
    },
  }






  var emailTemplatesPrams = {
    "order_confirmation": {
      "subject": "Order Confirmation",
      "body": "Order Confirmation",
    },
    "order_shipped": {
      "subject": "Order Shipped",
      "body": "Order Shipped",
    },
    "order_delivered": {
      "subject": "Order Delivered",
      "body": "Order Delivered",
    },
    "order_cancelled": {
      "subject": "Order Cancelled",
      "body": "Order Cancelled",
    },
    "order_refunded": {
      "subject": "Order Refunded",
      "body": "Order Refunded",
    },
    "low_stock_alert": {
      "subject": "Low Stock Alert",
      "body": "Low Stock Alert",
    },

  }







  function get_settings() {


    // if (!token) {
    //   throw new Error("No token found");
    // }

    setloading(true);

    var postData = {
    };
    postData = JSON.stringify(postData);





    setloading(true);
    fetch(
      serverUrl + "wp-json/combo-store/v2/get_settings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: postData,
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Token validation failed");
        }

        if (response.ok && response.status < 400) {
          response.json().then((res) => {





            // var errors = res?.errors;
            // var success = res?.success;


            setloading(false);
            setsettingsData({ ...settingsData, ...res })



            // setTimeout(() => {
            // 	setaddTask({ ...addTask, title: "", success: null, errors: null })

            // }, 3000);
          });
        }
      })
      .catch((_error) => {
        //this.saveAsStatus = 'error';
        // handle the error
      });
  }

  function update_settings() {

    setloading(true)



    var postData = JSON.stringify(settingsData);

    fetch(serverUrl + "wp-json/combo-store/v2/update_settings", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: postData,
    })
      .then((response) => {

        if (!response.ok) {
          throw new Error('Token validation failed');
        }

        if (response.ok && response.status < 400) {
          response.json().then((res) => {




            var status = res?.status;
            var message = res?.message;

            if (status == 'success') {
              addNotification({ type: 'success', title: 'Settings update', content: message })
            }
            if (status == 'failed') {
              addNotification({ type: 'error', title: 'Settings update failed', content: message })
            }



            setTimeout(() => {
              setloading(false)

            }, 500);
          });
        }
      })
      .catch((_error) => {
        //this.saveAsStatus = 'error';
        // handle the error
      });

  }

  function onPickFeaturedImage(item) {


    var site_logo = { id: item.id, title: item.title, src: item.src }
    // setcurrentObject({ ...currentObject, post_thumbnail: post_thumbnail });
    setsettingsData({ ...settingsData, site_logo: site_logo })
  }
  function onPickFaviconImage(item) {


    var favicon = { id: item.id, title: item.title, src: item.src }
    // setcurrentObject({ ...currentObject, post_thumbnail: post_thumbnail });
    setsettingsData({ ...settingsData, favicon: favicon })
  }




  const requiredRoles = ["administrator", "rider", ""];
  const hasAccess = requiredRoles.some(role => userDataX?.roles?.includes(role));

  function PaymentGatewaysItemTitle({ item, index }) {
    return (

      <div className="flex items-center justify-between w-full">


        <div>{item?.bankName}</div>
        <div onClick={ev => {
          ev.stopPropagation();
          ev.preventDefault();

          console.log(item);
          console.log(index);


          setsettingsData(prev => {
            const updatedAccounts = [...prev.paymentGateways.accounts];



            updatedAccounts.splice(index, 1);
            return {
              ...prev,
              paymentGateways: { ...prev.paymentGateways, accounts: updatedAccounts }
            };
          });

          // setsettingsData(prev => {
          //   const remainingPaymentGateways = prev.paymentGateways.accounts.filter((_, i) => i !== index);
          //   return {
          //     ...prev,
          //     paymentGateways: { ...prev.paymentGateways, accounts: remainingPaymentGateways }
          //   }
          // })


        }}>
          <div className="bg-red-400 hover:bg-red-500 text-white rounded-sm cursor-pointer p-2">
            <IconTrash size={18} />
          </div>

        </div>
      </div>

    );
  }

  function ShippingClassesItemTitle({ item, index }) {
    return (

      <div className="flex items-center justify-between w-full">
        <div>{item?.name}</div>
        <div onClick={ev => {
          ev.stopPropagation();
          ev.preventDefault();

          console.log(item);
          console.log(index);


          setsettingsData(prev => {
            const remainingShippingClasses = prev.shippingClasses.filter((_, i) => i !== index);
            return {
              ...prev,
              shippingClasses: remainingShippingClasses
            }
          })


        }}>
          <div className="bg-red-400 hover:bg-red-500 text-white rounded-sm cursor-pointer p-2">
            <IconTrash size={18} />
          </div>

        </div>
      </div>

    );
  }









  function ShippingZonesItemTitle({ item, index }) {
    return (

      <div className="flex items-center justify-between w-full">
        <div>{item?.label}</div>
        <div onClick={ev => {
          ev.stopPropagation();
          ev.preventDefault();

          console.log(item);
          console.log(index);


          setsettingsData(prev => {
            const remainingShippingZones = prev.shippingZones.filter((_, i) => i !== index);
            return {
              ...prev,
              shippingZones: remainingShippingZones
            }
          })


        }}>
          <div className="bg-red-400 hover:bg-red-500 text-white rounded-sm cursor-pointer p-2">
            <IconTrash size={18} />
          </div>

        </div>
      </div>

    );
  }
  function ProductAttributesItemTitle({ item, index }) {
    return (

      <div className="flex items-center justify-between w-full">
        <div>{item?.label}</div>
        <div onClick={ev => {
          ev.stopPropagation();
          ev.preventDefault();

          console.log(item);
          console.log(index);


          setsettingsData(prev => {
            const remainingProductAttributs = prev.productAttributes.filter((_, i) => i !== index);
            return {
              ...prev,
              productAttributes: remainingProductAttributs
            }
          })


        }}>
          <div className="bg-red-400 hover:bg-red-500 text-white rounded-sm cursor-pointer p-2">
            <IconTrash size={18} />
          </div>

        </div>
      </div>

    );
  }


  return (
    <div className="flex flex-col gap-5">


      {/* {JSON.stringify(settingsData)} */}


      <div className='flex flex-wrap lg:justify-end items-center'>


        <div className='flex flex-wrap gap-2 items-center'>
          {loading && (

            <Spinner />

          )}

          <div className='p-2  rounded-sm cursor-pointer px-4 bg-red-400 text-white'

            onClick={ev => {
              setsettingsData({ apiKeys: {}, socialLinks: {}, emailTemplates: {}, productAttributes: [], shippingClasses: [], shippingZones: [], paymentGateways: { enable: false, accounts: [] } })
            }}
          >Reset</div>
          <div className='p-2  rounded-sm cursor-pointer px-4 bg-[#1b0e9f] text-white'

            onClick={ev => {
              update_settings()
            }}
          >Save</div>







        </div>
      </div>


      {/* {JSON.stringify(settingsData)} */}




      <Tabs activeTab={0}
        orientation="vertical"
        activeClass="active-tab "
        wrapperClass=" gap-5"
        navsItemClass=" flex items-center gap-2 rounded-sm p-2 cursor-pointer px-4 hover:bg-gray-700 hover:text-white"
        navsItemActiveClass="  bg-gray-700 text-white"
        navsWrapperClass="flex lg:w-[250px] gap-1 "

        tabs={[
          { label: "Store", icon: <IconBuildingStore size={18} /> },


        ]}>


        <Tab index={0}>

          <div className="flex flex-col gap-5">

            <WidgetWrapper title="Store Details">


              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                <div className="  py-2 lg:w-60 ">{("Site Title")}</div>
                <div className="">
                  <input type="text" className="lg:w-auto w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0" value={settingsData?.site_title} onChange={ev => {
                    var value = ev.target.value;
                    setsettingsData({ ...settingsData, site_title: value })
                  }} />
                </div>
              </div>
              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                <div className="  py-2 lg:w-60 ">{("Site Description")}</div>
                <div className="">
                  <input type="text" className="lg:w-auto w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0" value={settingsData?.site_description} onChange={ev => {
                    var value = ev.target.value;
                    setsettingsData({ ...settingsData, site_description: value })
                  }} />
                </div>
              </div>
              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                <div className="  py-2 lg:w-60 ">{("Site Logo")}</div>
                <div className="">

                  <div className="flex flex-col gap-3">
                    {settingsData?.site_logo?.src && (
                      <div className="border border-solid border-gray-400 rounded-sm overflow-hidden">
                        <Image src={settingsData?.site_logo?.src} width={100} height={100} alt={``} />
                      </div>
                    )}
                    <GalleryPicker popupClass="right-full top-0" onPick={onPickFeaturedImage} />

                  </div>
                </div>
              </div>
              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                <div className="  py-2 lg:w-60 ">{("Favicon")}</div>
                <div className="">

                  <div className="flex flex-col gap-3">
                    {settingsData?.favicon?.src && (
                      <div className="border border-solid border-gray-400 rounded-sm overflow-hidden">
                        <Image src={settingsData?.favicon?.src} width={100} height={100} alt={``} />
                      </div>
                    )}
                    <GalleryPicker popupClass="right-full top-0" onPick={onPickFaviconImage} />

                  </div>
                </div>
              </div>






              {/* 
              <div className="border-0 border-b border-solid border-gray-200 lg:flex flex-wrap py-3 gap-3 items-center ">
                <div className="  py-2 lg:w-60 ">{('Status')}</div>



                <select name="status" className="!border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0" value={settingsData?.site_title} id="" onChange={ev => {
                  var value = ev.target.value;
                  setsettingsData({ ...settingsData, site_title: value })
                }}>

                  <option value="">Choose</option>
                  <option value="hold">On hold</option>
                  <option value="processing">Processing </option>
                  <option value="completed">Completed</option>
                  <option value="canceled">Canceled</option>
                  <option value="refunded">Refunded</option>
                  <option value="failed">Failed</option>

                </select>



              </div>

              <div className="border-0 border-b border-solid border-gray-200 lg:flex flex-wrap gap-3 py-3 items-center ">
                <div className="  py-2 lg:w-60 ">{('Payment Method')}</div>


                <select name="payment_method" className="lg:w-auto w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0" value={settingsData?.payment_method} id="" onChange={ev => {
                  var value = ev.target.value;
                  setsettingsData({ ...settingsData, payment_method: value })
                }}>

                  <option value="">Choose</option>
                  <option value="COD">COD</option>
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>


                </select>




              </div>

              <div className="border-0 border-b border-solid border-gray-200 lg:flex flex-wrap gap-3 py-3 items-center ">
                <div className="  py-2 lg:w-60 ">{('Payment status')}</div>


                <select name="payment_status" className="lg:w-auto w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0" value={settingsData?.payment_status} id="" onChange={ev => {
                  var value = ev.target.value;
                  setsettingsData({ ...settingsData, payment_status: value })
                }}>

                  <option value="">Choose</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="delayed">Delayed</option>

                </select>




              </div>

 */}



            </WidgetWrapper>


            <WidgetWrapper title="Store Contact">


              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                <div className="  py-2 lg:w-60 ">{("Address")}</div>
                <div className="">
                  <input type="text" className="lg:w-auto w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0" value={settingsData?.address} onChange={ev => {
                    var value = ev.target.value;
                    setsettingsData({ ...settingsData, address: value })
                  }} />
                </div>
              </div>
              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                <div className="  py-2 lg:w-60 ">{("Email")}</div>
                <div className="">
                  <input type="text" className="lg:w-auto w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0" value={settingsData?.email} onChange={ev => {
                    var value = ev.target.value;
                    setsettingsData({ ...settingsData, email: value })
                  }} />
                </div>
              </div>
              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                <div className="  py-2 lg:w-60 ">{("Phone")}</div>
                <div className="">
                  <input type="text" className="lg:w-auto w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0" value={settingsData?.phone} onChange={ev => {
                    var value = ev.target.value;
                    setsettingsData({ ...settingsData, phone: value })
                  }} />
                </div>
              </div>
              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                <div className="  py-2 lg:w-60 ">{("WhatsApp")}</div>
                <div className="">
                  <input type="text" className="lg:w-auto w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0" value={settingsData?.whatsapp} onChange={ev => {
                    var value = ev.target.value;
                    setsettingsData({ ...settingsData, whatsapp: value })
                  }} />
                </div>
              </div>



              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                <div className="  py-2 lg:w-60 ">{("Mobile Banking")}</div>
                <div className="">
                  <input type="text" className="lg:w-auto w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0" value={settingsData?.mobilebanking} onChange={ev => {
                    var value = ev.target.value;
                    setsettingsData({ ...settingsData, mobilebanking: value })
                  }} />
                </div>
              </div>




              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                <div className="  py-2 lg:w-60 ">{("Social Links")}</div>
                <div className="flex flex-col gap-2">


                  <select name="apiKeys" className="rounded-sm px-2 py-1 !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"

                    onChange={(ev) => {
                      const { name, value } = ev.target;


                      setsettingsData(prev => {
                        return {
                          ...prev,
                          socialLinks: { ...prev?.socialLinks, [value]: socialLinksPrams[value] }
                        }
                      })







                    }}
                  >
                    <option value="">Choose</option>
                    <option value="facebook">Facebook</option>
                    <option value="youtube">Youtube</option>
                    <option value="instagram">Instagram</option>
                    <option value="twitter">Twitter</option>
                    <option value="linkedin">Linkedin</option>
                    <option value="tiktok">Tiktok</option>

                  </select>


                  <div className="flex gap-5 flex-col">
                    {Object.entries(settingsData?.socialLinks)?.map((args, index) => {

                      var providerKey = args[0];
                      var item = args[1];




                      return (
                        <div className="flex gap-3 bg-gray-200 p-2">
                          <div key={providerKey} className="flex flex-col gap-2">
                            <div className="flex gap-2 flex-col" >


                              {Object.keys(item).map((fieldName, fieldIndex) => {
                                return (
                                  <input
                                    type="text"
                                    name={fieldName}
                                    placeholder={providerKey + " " + fieldName}
                                    className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                    value={item[fieldName]}
                                    onChange={(ev) => {
                                      const { name, value } = ev.target;
                                      setsettingsData(prev => ({
                                        ...prev,
                                        socialLinks: {
                                          ...prev.socialLinks,
                                          [providerKey]: {
                                            ...prev.socialLinks[providerKey],
                                            [name]: value
                                          }
                                        }
                                      }));

                                    }}
                                  />
                                )
                              })}





                            </div>










                          </div>
                          <div>

                            <div className="bg-red-400 text-white px-2 py-1 rounded-sm cursor-pointer" onClick={ev => {

                              setsettingsData(prev => {
                                const { [providerKey]: removed, ...remainingApiKeys } = prev.socialLinks;
                                return {
                                  ...prev,
                                  socialLinks: remainingApiKeys
                                }
                              })

                            }} >X</div>

                          </div>

                        </div>
                      )
                    }
                    )}
                  </div>
                </div>
              </div>






            </WidgetWrapper>
          </div>

        </Tab>



      </Tabs >













    </div >

  );
};

export default SettingsGlobal;