"use client";
import { useState, useEffect, Component } from "react";
import { IconChevronDown, IconChevronUp, IconKey, IconTriangleSquareCircle, IconCreditCardPay, IconUserPentagon, IconMailSpark, IconBuildingStore, IconShip, IconStar, IconCashRegister, IconTrash, IconDiscount, IconAlien, IconTruckDelivery, IconSquareRoundedCheck } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

import { APIProvider, Map, useMapsLibrary, useMap } from '@vis.gl/react-google-maps';


import { useCounterStore } from '../store/useCounterStore'
import { useUtilsStore } from '../store/useUtilsStore';
import LocationPicker from '../components/LocationPicker';
import GoogleMapDirections from '../components/GoogleMapDirections';
import PopoverButton from '../components/PopoverButton';
import Spinner from '../components/Spinner';
import WidgetWrapper from '../components/WidgetWrapper';
import UsersPicker from '../components/shop-elements/UsersPicker';
import ProductsPicker from '../components/shop-elements/ProductsPicker';
import Tabs from '../components/Tabs';
import Tab from '../components/Tab';
import ToggleContent from '../components/ToggleContent';
import GalleryPicker from "../components/shop-elements/GalleryPicker";

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
          { label: "Reviews", icon: <IconStar size={18} /> },
          { label: "Checkout", icon: <IconCashRegister size={18} /> },
          { label: "Emails", icon: <IconMailSpark size={18} /> },
          // { label: "Roles", icon: <IconUserPentagon size={18} /> },
          { label: "Payment Gateways", icon: <IconCreditCardPay size={18} /> },
          // { label: "Product Attributes", icon: <IconTriangleSquareCircle size={18} /> },
          // { label: "Shipping ", icon: <IconShip size={18} /> },
          { label: "API Keys", icon: <IconKey size={18} /> },
          // { label: "Trackings", icon: <IconRouteSquare size={18} /> },
          { label: "Discount", icon: <IconDiscount size={18} /> },
          { label: "Fraud Check", icon: <IconAlien size={18} /> },
          { label: "Couriers", icon: <IconTruckDelivery size={18} /> },
          { label: "License", icon: <IconTruckDelivery size={18} /> },

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
        <Tab index={1}>

          <div className="flex flex-col gap-5">

            <WidgetWrapper title="Store reviews">


              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                <div className="  py-2 lg:w-60 ">{("Enable Reviews")}</div>
                <div className="flex gap-3">
                  <input type="checkbox" name="enable" id="enable" checked={settingsData?.reviews?.enable} className=" !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0" value={settingsData?.reviews?.enable} onChange={ev => {
                    var value = ev.target.value;
                    setsettingsData({ ...settingsData, reviews: { ...settingsData?.reviews, enable: !settingsData?.reviews?.enable } })
                  }} />
                  <label htmlFor="enable" className="cursor-pointer">{settingsData?.reviews?.enable ? "Enabled" : "Disabled"}</label>
                </div>
              </div>
              {/* <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
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
                    <GalleryPicker popupClass="right-full top-0" onPick={onPickFeaturedImage} />

                  </div>
                </div>
              </div> */}








            </WidgetWrapper>



          </div>

        </Tab >
        <Tab index={2}>

          <WidgetWrapper title="Checkout Settings">


            <div className="flex flex-col gap-2">

              <ToggleContent key={'hello'} title={'Checkout Fields'}
                contentClass="bg-gray-200 !text-gray-800 p-4"
                headerClass=""
                headerTitleClass=""
                wrapperClass="w-full"
              >
                Hello

              </ToggleContent>


              <ToggleContent key={'hello'} title={'Checkout Guards'}
                contentClass="bg-gray-200 !text-gray-800 p-4"
                headerClass=""
                headerTitleClass=""
                wrapperClass="w-full"
              >
                Hello

              </ToggleContent>


            </div>





          </WidgetWrapper>


        </Tab>
        <Tab index={3}>

          <WidgetWrapper title="Email Templates">


            <div className="flex flex-col gap-2">


              <div className="flex gap-3 flex-col">
                {Object.entries(emailTemplatesPrams)?.map((args, index) => {

                  var providerKey = args[0];
                  var item = args[1];




                  return (
                    <div className="">

                      <ToggleContent key={index} title={item?.subject}
                        contentClass="bg-gray-200 !text-gray-800 p-4"
                        headerClass=""
                        headerTitleClass=""
                        wrapperClass="w-full"
                      >

                        <div className="flex flex-col gap-5">
                          <div className="flex gap-2 flex-col">

                            <label htmlFor="subject">Subject</label>

                            <input
                              type="text"
                              name={'subject'}
                              placeholder={'subject'}
                              className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                              value={settingsData?.emailTemplates?.[providerKey]?.['subject']}
                              onChange={(ev) => {
                                const { name, value } = ev.target;
                                setsettingsData(prev => ({
                                  ...prev,
                                  emailTemplates: {
                                    ...prev.emailTemplates,
                                    [providerKey]: {
                                      ...prev.emailTemplates[providerKey],
                                      [name]: value
                                    }
                                  }
                                }));

                              }}
                            />


                          </div>
                          <div className="flex gap-2 flex-col">

                            <label htmlFor="subject">Email Content</label>

                            <textarea
                              name={'body'}
                              placeholder={'body'}
                              className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                              value={settingsData?.emailTemplates?.[providerKey]?.['body']}
                              onChange={(ev) => {
                                const { name, value } = ev.target;
                                setsettingsData(prev => ({
                                  ...prev,
                                  emailTemplates: {
                                    ...prev.emailTemplates,
                                    [providerKey]: {
                                      ...prev.emailTemplates[providerKey],
                                      [name]: value
                                    }
                                  }
                                }));

                              }}
                            />


                          </div>
                        </div>

                      </ToggleContent>

                    </div>
                  )
                }
                )}
              </div>
            </div>





          </WidgetWrapper>


        </Tab>


        {/* <Tab index={3}>


          <WidgetWrapper title="Roles">


            <div className="flex flex-col gap-2">


              <div className="flex gap-3 flex-col">
                {Object.entries(rolesPrams)?.map((args, index) => {

                  var providerKey = args[0];
                  var item = args[1];




                  return (
                    <div className="">

                      <ToggleContent key={index} title={item?.label}
                        contentClass="bg-gray-200 !text-gray-800 p-4"
                        headerClass=""
                        headerTitleClass=""
                        wrapperClass="w-full"
                      >

                        <div className="flex flex-col gap-5">
                          <div className="flex gap-2 flex-col">

                            <label htmlFor="subject">Subject</label>

                            <input
                              type="text"
                              name={'subject'}
                              placeholder={'subject'}
                              className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                              value={settingsData?.emailTemplates?.[providerKey]?.['subject']}
                              onChange={(ev) => {
                                const { name, value } = ev.target;
                                setsettingsData(prev => ({
                                  ...prev,
                                  emailTemplates: {
                                    ...prev.emailTemplates,
                                    [providerKey]: {
                                      ...prev.emailTemplates[providerKey],
                                      [name]: value
                                    }
                                  }
                                }));

                              }}
                            />


                          </div>
                          <div className="flex gap-2 flex-col">

                            <label htmlFor="subject">Email Content</label>

                            <input
                              type="text"
                              name={'body'}
                              placeholder={'body'}
                              className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                              value={settingsData?.emailTemplates?.[providerKey]?.['body']}
                              onChange={(ev) => {
                                const { name, value } = ev.target;
                                setsettingsData(prev => ({
                                  ...prev,
                                  emailTemplates: {
                                    ...prev.emailTemplates,
                                    [providerKey]: {
                                      ...prev.emailTemplates[providerKey],
                                      [name]: value
                                    }
                                  }
                                }));

                              }}
                            />


                          </div>
                        </div>

                      </ToggleContent>

                    </div>
                  )
                }
                )}
              </div>
            </div>





          </WidgetWrapper>






        </Tab> */}
        <Tab index={4}>



          <WidgetWrapper title="Payment Gateways">



            {/* {JSON.stringify(settingsData?.paymentGateways.bank_transfer)} */}





            <div className="flex flex-col gap-2">


              <div className="flex gap-2 flex-col">
                {Object.entries(paymentGatewaysPrams)?.map((args, index) => {

                  var providerKey = args[0];
                  var item = args[1];




                  return (
                    <div className="" key={index}>

                      <ToggleContent key={index} title={item?.label}
                        contentClass="bg-gray-200 !text-gray-800 p-4"
                        headerClass=""
                        headerTitleClass=""
                        wrapperClass="w-full"
                      >

                        <div className="flex flex-col gap-5">



                          {providerKey == 'bank_transfer' && (

                            <>

                              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                <div className="  py-2 lg:w-60 ">{("Enable?")}</div>
                                <div className="flex gap-3">
                                  <input type="checkbox" name="enable" id={`enable-${providerKey}`}
                                    checked={settingsData?.paymentGateways?.[providerKey]?.['enable']}
                                    className=" !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"

                                    value={settingsData?.paymentGateways?.[providerKey]?.['enable']}
                                    onChange={(ev) => {
                                      const value = ev.target.value;

                                      console.log(value);


                                      setsettingsData(prev => ({
                                        ...prev,
                                        paymentGateways: {
                                          ...prev.paymentGateways,
                                          [providerKey]: {
                                            ...prev.paymentGateways[providerKey],
                                            ['enable']: !prev.paymentGateways[providerKey]?.['enable']
                                          }
                                        }
                                      }));

                                    }} />
                                  <label htmlFor={`enable-${providerKey}`} className="cursor-pointer">{settingsData?.paymentGateways?.[providerKey]?.['enable'] ? "Enabled" : "Disabled"}</label>
                                </div>
                              </div>
                              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                <div className="  py-2 lg:w-60 ">{("Bank Accounts")}</div>
                                <div className="flex flex-1 w-full gap-3">

                                  <div className="flex flex-col gap-5">

                                    <div className=" hover:bg-gray-400 w-fit rounded-sm cursor-pointer px-4 py-2 bg-gray-600 text-white" onClick={ev => {

                                      // setsettingsData(prev => ({
                                      //   ...prev,
                                      //   paymentGateways: {
                                      //     ...prev.paymentGateways,
                                      //     [providerKey]: {
                                      //       ...prev.paymentGateways[providerKey],
                                      //       ['enable']: !prev.paymentGateways[providerKey]?.['enable']
                                      //     }
                                      //   }
                                      // }));

                                      setsettingsData(prev => ({
                                        ...prev,
                                        paymentGateways: {
                                          ...prev.paymentGateways,
                                          [providerKey]: {
                                            ...prev.paymentGateways[providerKey],
                                            ['accounts']: [...(prev.paymentGateways[providerKey]?.['accounts'] || []), {
                                              "bankName": "Bank Name",
                                              "accountNumber": "Account Number",
                                              "accountType": "Account Type",
                                              "branch": "Branch",
                                              "swiftCode": "Swift Code",
                                              "routingNumber": "Routing Number",
                                            }]
                                          }
                                        }
                                      }));







                                    }}>Add</div>



                                    <div className="flex gap-3 flex-col">
                                      {settingsData?.paymentGateways?.[providerKey]?.['accounts'] && settingsData?.paymentGateways?.[providerKey]?.['accounts']?.map((item, index) => {




                                        return (
                                          <div className="flex-1 w-full">

                                            {/* {JSON.stringify(item)} */}


                                            <ToggleContent key={index} title={<PaymentGatewaysItemTitle item={item} index={index} />}
                                              contentClass="bg-gray-200 !text-gray-800 lg:p-4 py-4"
                                              headerClass=""
                                              headerTitleClass=""
                                              wrapperClass="w-full"
                                            >

                                              <div className="flex flex-col gap-5">
                                                <div className="flex flex-wrap gap-2 items-center">
                                                  <label htmlFor="label" className="lg:w-40">Bank Name</label>
                                                  <input
                                                    type="text"
                                                    name={'bankName'}
                                                    placeholder={'bankName'}
                                                    className=" px-2 py-1 lg:flex-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                                    value={settingsData?.paymentGateways?.accounts?.[index]?.bankName}
                                                    onChange={(ev) => {
                                                      const { name, value } = ev.target;
                                                      setsettingsData(prev => {
                                                        const updatedAttributs = [...prev.paymentGateways.accounts];
                                                        updatedAttributs[index] = {
                                                          ...updatedAttributs[index],
                                                          bankName: value
                                                        };

                                                        console.log(updatedAttributs);



                                                        return {
                                                          ...prev,
                                                          paymentGateways: { ...prev.paymentGateways, accounts: updatedAttributs }
                                                        };
                                                      });
                                                    }}
                                                  />
                                                </div>
                                                <div className="flex flex-wrap gap-2 items-center">
                                                  <label htmlFor="label" className="lg:w-40">Account Number</label>
                                                  <input
                                                    type="text"
                                                    name={'accountNumber'}
                                                    placeholder={'accountNumber'}
                                                    className=" px-2 py-1 lg:flex-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                                    value={settingsData?.paymentGateways?.accounts?.[index]?.['accountNumber']}
                                                    onChange={(ev) => {
                                                      const { name, value } = ev.target;
                                                      setsettingsData(prev => {
                                                        const updatedAttributs = [...prev.paymentGateways.accounts];
                                                        updatedAttributs[index] = {
                                                          ...updatedAttributs[index],
                                                          accountNumber: value
                                                        };
                                                        return {
                                                          ...prev,
                                                          paymentGateways: { ...prev.paymentGateways, accounts: updatedAttributs }
                                                        };
                                                      });
                                                    }}
                                                  />
                                                </div>
                                                <div className="flex flex-wrap gap-2 items-center">
                                                  <label htmlFor="label" className="lg:w-40">Account Type</label>
                                                  <input
                                                    type="text"
                                                    name={'accountType'}
                                                    placeholder={'accountType'}
                                                    className=" px-2 py-1 lg:flex-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                                    value={settingsData?.paymentGateways?.accounts?.[index]?.['accountType']}
                                                    onChange={(ev) => {
                                                      const { name, value } = ev.target;
                                                      setsettingsData(prev => {
                                                        const updatedAttributs = [...prev.paymentGateways.accounts];
                                                        updatedAttributs[index] = {
                                                          ...updatedAttributs[index],
                                                          accountType: value
                                                        };
                                                        return {
                                                          ...prev,
                                                          paymentGateways: { ...prev.paymentGateways, accounts: updatedAttributs }
                                                        };
                                                      });
                                                    }}
                                                  />
                                                </div>
                                                <div className="flex flex-wrap gap-2 items-center">
                                                  <label htmlFor="label" className="lg:w-40">Branch</label>
                                                  <input
                                                    type="text"
                                                    name={'branch'}
                                                    placeholder={'branch'}
                                                    className=" px-2 py-1 lg:flex-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                                    value={settingsData?.paymentGateways?.accounts?.[index]?.['branch']}
                                                    onChange={(ev) => {
                                                      const { name, value } = ev.target;
                                                      setsettingsData(prev => {
                                                        const updatedAttributs = [...prev.paymentGateways.accounts];
                                                        updatedAttributs[index] = {
                                                          ...updatedAttributs[index],
                                                          branch: value
                                                        };
                                                        return {
                                                          ...prev,
                                                          paymentGateways: { ...prev.paymentGateways, accounts: updatedAttributs }
                                                        };
                                                      });
                                                    }}
                                                  />
                                                </div>
                                                <div className="flex flex-wrap gap-2 items-center">
                                                  <label htmlFor="label" className="lg:w-40">Swift Code</label>
                                                  <input
                                                    type="text"
                                                    name={'swiftCode'}
                                                    placeholder={'swiftCode'}
                                                    className=" px-2 py-1 lg:flex-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                                    value={settingsData?.paymentGateways?.accounts?.[index]?.['swiftCode']}
                                                    onChange={(ev) => {
                                                      const { name, value } = ev.target;
                                                      setsettingsData(prev => {
                                                        const updatedAttributs = [...prev.paymentGateways.accounts];
                                                        updatedAttributs[index] = {
                                                          ...updatedAttributs[index],
                                                          swiftCode: value
                                                        };
                                                        return {
                                                          ...prev,
                                                          paymentGateways: { ...prev.paymentGateways, accounts: updatedAttributs }
                                                        };
                                                      });
                                                    }}
                                                  />
                                                </div>
                                                <div className="flex flex-wrap gap-2 items-center">
                                                  <label htmlFor="label" className="lg:w-40">Routing Number</label>
                                                  <input
                                                    type="text"
                                                    name={'routingNumber'}
                                                    placeholder={'routingNumber'}
                                                    className=" px-2 py-1 lg:flex-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                                    value={settingsData?.paymentGateways?.accounts?.[index]?.['routingNumber']}
                                                    onChange={(ev) => {
                                                      const { name, value } = ev.target;
                                                      setsettingsData(prev => {
                                                        const updatedAttributs = [...prev.paymentGateways.accounts];
                                                        updatedAttributs[index] = {
                                                          ...updatedAttributs[index],
                                                          routingNumber: value
                                                        };
                                                        return {
                                                          ...prev,
                                                          paymentGateways: { ...prev.paymentGateways, accounts: updatedAttributs }
                                                        };
                                                      });
                                                    }}
                                                  />
                                                </div>







                                              </div>

                                            </ToggleContent>

                                          </div>
                                        )
                                      }
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>











                            </>
                          )}
                          {providerKey == 'bkash' && (

                            <>

                              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                <div className="  py-2 lg:w-60 ">{("Sandbox")}</div>
                                <div className="flex gap-3">
                                  <input type="checkbox" name="sandbox" id={`sandbox-${providerKey}`}
                                    checked={settingsData?.paymentGateways?.[providerKey]?.['sandbox']}
                                    className="lg:w-auto w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"

                                    value={settingsData?.paymentGateways?.[providerKey]?.['sandbox']}
                                    onChange={(ev) => {
                                      const value = ev.target.value;

                                      console.log(value);


                                      setsettingsData(prev => ({
                                        ...prev,
                                        paymentGateways: {
                                          ...prev.paymentGateways,
                                          [providerKey]: {
                                            ...prev.paymentGateways[providerKey],
                                            ['sandbox']: !prev.paymentGateways[providerKey]?.['sandbox']
                                          }
                                        }
                                      }));

                                    }} />
                                  <label htmlFor={`sandbox-${providerKey}`} className="cursor-pointer">{settingsData?.paymentGateways?.[providerKey]?.['sandbox'] ? "Enabled" : "Disabled"}</label>
                                </div>
                              </div>

                              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                <div className="  py-2 lg:w-60 ">{("Store ID")}</div>
                                <div className="flex gap-3">
                                  <input
                                    type="text"
                                    name={'store_id'}
                                    placeholder={'store_id'}
                                    className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                    value={settingsData?.paymentGateways?.[providerKey]?.['store_id']}
                                    onChange={(ev) => {
                                      const { name, value } = ev.target;
                                      setsettingsData(prev => ({
                                        ...prev,
                                        paymentGateways: {
                                          ...prev.paymentGateways,
                                          [providerKey]: {
                                            ...prev.paymentGateways[providerKey],
                                            [name]: value
                                          }
                                        }
                                      }));

                                    }}
                                  />
                                </div>
                              </div>
                              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                <div className="  py-2 lg:w-60 ">{("Client ID")}</div>
                                <div className="flex gap-3">
                                  <input
                                    type="text"
                                    name={'client_id'}
                                    placeholder={'client_id'}
                                    className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                    value={settingsData?.paymentGateways?.[providerKey]?.['client_id']}
                                    onChange={(ev) => {
                                      const { name, value } = ev.target;
                                      setsettingsData(prev => ({
                                        ...prev,
                                        paymentGateways: {
                                          ...prev.paymentGateways,
                                          [providerKey]: {
                                            ...prev.paymentGateways[providerKey],
                                            [name]: value
                                          }
                                        }
                                      }));

                                    }}
                                  />
                                </div>
                              </div>

                              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                <div className="  py-2 lg:w-60 ">{("Client Secret")}</div>
                                <div className="flex gap-3">
                                  <input
                                    type="text"
                                    name={'client_secret'}
                                    placeholder={'client_secret'}
                                    className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                    value={settingsData?.paymentGateways?.[providerKey]?.['client_secret']}
                                    onChange={(ev) => {
                                      const { name, value } = ev.target;
                                      setsettingsData(prev => ({
                                        ...prev,
                                        paymentGateways: {
                                          ...prev.paymentGateways,
                                          [providerKey]: {
                                            ...prev.paymentGateways[providerKey],
                                            [name]: value
                                          }
                                        }
                                      }));

                                    }}
                                  />
                                </div>
                              </div>
                              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                <div className="  py-2 lg:w-60 ">{("Username")}</div>
                                <div className="flex gap-3">
                                  <input
                                    type="text"
                                    name={'username'}
                                    placeholder={'username'}
                                    className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                    value={settingsData?.paymentGateways?.[providerKey]?.['username']}
                                    onChange={(ev) => {
                                      const { name, value } = ev.target;
                                      setsettingsData(prev => ({
                                        ...prev,
                                        paymentGateways: {
                                          ...prev.paymentGateways,
                                          [providerKey]: {
                                            ...prev.paymentGateways[providerKey],
                                            [name]: value
                                          }
                                        }
                                      }));

                                    }}
                                  />
                                </div>
                              </div>
                              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                <div className="  py-2 lg:w-60 ">{("Password")}</div>
                                <div className="flex gap-3">
                                  <input
                                    type="text"
                                    name={'password'}
                                    placeholder={'password'}
                                    className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                    value={settingsData?.paymentGateways?.[providerKey]?.['password']}
                                    onChange={(ev) => {
                                      const { name, value } = ev.target;
                                      setsettingsData(prev => ({
                                        ...prev,
                                        paymentGateways: {
                                          ...prev.paymentGateways,
                                          [providerKey]: {
                                            ...prev.paymentGateways[providerKey],
                                            [name]: value
                                          }
                                        }
                                      }));

                                    }}
                                  />
                                </div>
                              </div>

                            </>
                          )}

                          {(providerKey == 'bkashPersonal' || providerKey == 'nagadPersonal') && (

                            <>

                              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                <div className="  py-2 lg:w-60 ">{("Phone Number")}</div>
                                <div className="flex gap-3">
                                  <input
                                    type="text"
                                    name={'phone_number'}
                                    placeholder={'phone_number'}
                                    className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                    value={settingsData?.paymentGateways?.[providerKey]?.['phone_number']}
                                    onChange={(ev) => {
                                      const { name, value } = ev.target;
                                      setsettingsData(prev => ({
                                        ...prev,
                                        paymentGateways: {
                                          ...prev.paymentGateways,
                                          [providerKey]: {
                                            ...prev.paymentGateways[providerKey],
                                            [name]: value
                                          }
                                        }
                                      }));

                                    }}
                                  />
                                </div>
                              </div>

                              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                <div className="  py-2 lg:w-60 ">{("Description")}</div>
                                <div className="flex gap-3">
                                  <input
                                    type="text"
                                    name={'description'}
                                    placeholder={'description'}
                                    className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                    value={settingsData?.paymentGateways?.[providerKey]?.['description']}
                                    onChange={(ev) => {
                                      const { name, value } = ev.target;
                                      setsettingsData(prev => ({
                                        ...prev,
                                        paymentGateways: {
                                          ...prev.paymentGateways,
                                          [providerKey]: {
                                            ...prev.paymentGateways[providerKey],
                                            [name]: value
                                          }
                                        }
                                      }));

                                    }}
                                  />
                                </div>
                              </div>
                            </>
                          )}

                          {providerKey == 'nagad' && (

                            <>

                              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                <div className="  py-2 lg:w-60 ">{("Sandbox")}</div>
                                <div className="flex gap-3">
                                  <input type="checkbox" name="sandbox" id={`sandbox-${providerKey}`}
                                    checked={settingsData?.paymentGateways?.[providerKey]?.['sandbox']}
                                    className="lg:w-auto w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"

                                    value={settingsData?.paymentGateways?.[providerKey]?.['sandbox']}
                                    onChange={(ev) => {
                                      const value = ev.target.value;

                                      console.log(value);


                                      setsettingsData(prev => ({
                                        ...prev,
                                        paymentGateways: {
                                          ...prev.paymentGateways,
                                          [providerKey]: {
                                            ...prev.paymentGateways[providerKey],
                                            ['sandbox']: !prev.paymentGateways[providerKey]?.['sandbox']
                                          }
                                        }
                                      }));

                                    }} />
                                  <label htmlFor={`sandbox-${providerKey}`} className="cursor-pointer">{settingsData?.paymentGateways?.[providerKey]?.['sandbox'] ? "Enabled" : "Disabled"}</label>
                                </div>
                              </div>

                              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                <div className="  py-2 lg:w-60 ">{("Store ID")}</div>
                                <div className="flex gap-3">
                                  <input
                                    type="text"
                                    name={'store_id'}
                                    placeholder={'store_id'}
                                    className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                    value={settingsData?.paymentGateways?.[providerKey]?.['store_id']}
                                    onChange={(ev) => {
                                      const { name, value } = ev.target;
                                      setsettingsData(prev => ({
                                        ...prev,
                                        paymentGateways: {
                                          ...prev.paymentGateways,
                                          [providerKey]: {
                                            ...prev.paymentGateways[providerKey],
                                            [name]: value
                                          }
                                        }
                                      }));

                                    }}
                                  />
                                </div>
                              </div>


                              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                <div className="  py-2 lg:w-60 ">{("token")}</div>
                                <div className="flex gap-3">
                                  <input
                                    type="text"
                                    name={'token'}
                                    placeholder={'token'}
                                    className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                    value={settingsData?.paymentGateways?.[providerKey]?.['token']}
                                    onChange={(ev) => {
                                      const { name, value } = ev.target;
                                      setsettingsData(prev => ({
                                        ...prev,
                                        paymentGateways: {
                                          ...prev.paymentGateways,
                                          [providerKey]: {
                                            ...prev.paymentGateways[providerKey],
                                            [name]: value
                                          }
                                        }
                                      }));

                                    }}
                                  />
                                </div>
                              </div>
                            </>
                          )}

                          {providerKey == 'sslcommerz' && (

                            <>

                              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                <div className="  py-2 lg:w-60 ">{("Sandbox")}</div>
                                <div className="flex gap-3">
                                  <input type="checkbox" name="sandbox" id={`sandbox-${providerKey}`}
                                    checked={settingsData?.paymentGateways?.[providerKey]?.['sandbox']}
                                    className="lg:w-auto w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"

                                    value={settingsData?.paymentGateways?.[providerKey]?.['sandbox']}
                                    onChange={(ev) => {
                                      const value = ev.target.value;

                                      console.log(value);


                                      setsettingsData(prev => ({
                                        ...prev,
                                        paymentGateways: {
                                          ...prev.paymentGateways,
                                          [providerKey]: {
                                            ...prev.paymentGateways[providerKey],
                                            ['sandbox']: !prev.paymentGateways[providerKey]?.['sandbox']
                                          }
                                        }
                                      }));

                                    }} />
                                  <label htmlFor={`sandbox-${providerKey}`} className="cursor-pointer">{settingsData?.paymentGateways?.[providerKey]?.['sandbox'] ? "Enabled" : "Disabled"}</label>
                                </div>
                              </div>

                              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                <div className="  py-2 lg:w-60 ">{("Store ID")}</div>
                                <div className="flex gap-3">
                                  <input
                                    type="text"
                                    name={'store_id'}
                                    placeholder={'store_id'}
                                    className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                    value={settingsData?.paymentGateways?.[providerKey]?.['store_id']}
                                    onChange={(ev) => {
                                      const { name, value } = ev.target;
                                      setsettingsData(prev => ({
                                        ...prev,
                                        paymentGateways: {
                                          ...prev.paymentGateways,
                                          [providerKey]: {
                                            ...prev.paymentGateways[providerKey],
                                            [name]: value
                                          }
                                        }
                                      }));

                                    }}
                                  />
                                </div>
                              </div>


                              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                <div className="  py-2 lg:w-60 ">{("token")}</div>
                                <div className="flex gap-3">
                                  <input
                                    type="text"
                                    name={'token'}
                                    placeholder={'token'}
                                    className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                    value={settingsData?.paymentGateways?.[providerKey]?.['token']}
                                    onChange={(ev) => {
                                      const { name, value } = ev.target;
                                      setsettingsData(prev => ({
                                        ...prev,
                                        paymentGateways: {
                                          ...prev.paymentGateways,
                                          [providerKey]: {
                                            ...prev.paymentGateways[providerKey],
                                            [name]: value
                                          }
                                        }
                                      }));

                                    }}
                                  />
                                </div>
                              </div>
                            </>
                          )}
                          {providerKey == 'cod' && (

                            <>
                              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                <div className="  py-2 lg:w-60 ">{("Enable?")}</div>
                                <div className="flex gap-3">
                                  <input type="checkbox" name="enable" id={`enable-${providerKey}`}
                                    checked={settingsData?.paymentGateways?.[providerKey]?.['enable']}
                                    className=" !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"

                                    value={settingsData?.paymentGateways?.[providerKey]?.['enable']}
                                    onChange={(ev) => {
                                      const value = ev.target.value;

                                      setsettingsData(prev => ({
                                        ...prev,
                                        paymentGateways: {
                                          ...prev.paymentGateways,
                                          [providerKey]: {
                                            ...prev.paymentGateways[providerKey],
                                            ['enable']: !prev.paymentGateways[providerKey]?.['enable']
                                          }
                                        }
                                      }));

                                    }} />
                                  <label htmlFor={`enable-${providerKey}`} className="cursor-pointer">{settingsData?.paymentGateways?.[providerKey]?.['enable'] ? "Enabled" : "Disabled"}</label>
                                </div>
                              </div>

                            </>
                          )}
                          {providerKey == 'aamarpay' && (

                            <>

                              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                <div className="  py-2 lg:w-60 ">{("Sandbox")}</div>
                                <div className="flex gap-3">
                                  <input type="checkbox" name="sandbox" id={`sandbox-${providerKey}`}
                                    checked={settingsData?.paymentGateways?.[providerKey]?.['sandbox']}
                                    className="lg:w-auto w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"

                                    value={settingsData?.paymentGateways?.[providerKey]?.['sandbox']}
                                    onChange={(ev) => {
                                      const value = ev.target.value;

                                      console.log(value);


                                      setsettingsData(prev => ({
                                        ...prev,
                                        paymentGateways: {
                                          ...prev.paymentGateways,
                                          [providerKey]: {
                                            ...prev.paymentGateways[providerKey],
                                            ['sandbox']: !prev.paymentGateways[providerKey]?.['sandbox']
                                          }
                                        }
                                      }));

                                    }} />
                                  <label htmlFor={`sandbox-${providerKey}`} className="cursor-pointer">{settingsData?.paymentGateways?.[providerKey]?.['sandbox'] ? "Enabled" : "Disabled"}</label>
                                </div>
                              </div>

                              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                <div className="  py-2 lg:w-60 ">{("Store ID")}</div>
                                <div className="flex gap-3">
                                  <input
                                    type="text"
                                    name={'store_id'}
                                    placeholder={'store_id'}
                                    className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                    value={settingsData?.paymentGateways?.[providerKey]?.['store_id']}
                                    onChange={(ev) => {
                                      const { name, value } = ev.target;
                                      setsettingsData(prev => ({
                                        ...prev,
                                        paymentGateways: {
                                          ...prev.paymentGateways,
                                          [providerKey]: {
                                            ...prev.paymentGateways[providerKey],
                                            [name]: value
                                          }
                                        }
                                      }));

                                    }}
                                  />
                                </div>
                              </div>


                              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                <div className="  py-2 lg:w-60 ">{("token")}</div>
                                <div className="flex gap-3">
                                  <input
                                    type="text"
                                    name={'token'}
                                    placeholder={'token'}
                                    className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                    value={settingsData?.paymentGateways?.[providerKey]?.['token']}
                                    onChange={(ev) => {
                                      const { name, value } = ev.target;
                                      setsettingsData(prev => ({
                                        ...prev,
                                        paymentGateways: {
                                          ...prev.paymentGateways,
                                          [providerKey]: {
                                            ...prev.paymentGateways[providerKey],
                                            [name]: value
                                          }
                                        }
                                      }));

                                    }}
                                  />
                                </div>
                              </div>
                            </>
                          )}



                        </div>

                      </ToggleContent>

                    </div>
                  )
                }
                )}
              </div>
            </div>













          </WidgetWrapper>



        </Tab>

        {/* <Tab index={5}>
          <WidgetWrapper title="Product Attributes">





            <div className="flex flex-col gap-5">

              <div className=" hover:bg-gray-400 w-fit rounded-sm cursor-pointer px-4 py-2 bg-gray-600 text-white" onClick={ev => {

                setsettingsData(prev => ({
                  ...prev,
                  productAttributes: [...prev.productAttributes, {
                    "label": "Custom Attribute",
                    "slug": "custom-attribute",
                    "args": {
                      "public": true,
                      "publicly_queryable": true,
                      "hierarchical": true,
                      "show_in_rest": true,
                    },
                    "conditions": {
                      "post_type": ["product"],
                      "categories": [],
                    },
                  }]
                }));

              }}>Add</div>


              <div className="flex gap-3 flex-col">
                {settingsData?.productAttributes && settingsData?.productAttributes?.map((item, index) => {




                  return (
                    <div className="">

                      <ToggleContent key={index} title={<ProductAttributesItemTitle item={item} index={index} />}
                        contentClass="bg-gray-200 !text-gray-800 p-4"
                        headerClass=""
                        headerTitleClass=""
                        wrapperClass="w-full"
                      >

                        <div className="flex flex-col gap-5">
                          <div className="flex gap-2 flex-col">
                            <label htmlFor="label">label</label>
                            <input
                              type="text"
                              name={'label'}
                              placeholder={'label'}
                              className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                              value={settingsData?.productAttributes?.[index]?.['label'] ?? productAttributesPrams?.[item?.slug]?.['label']}
                              onChange={(ev) => {
                                const { name, value } = ev.target;
                                setsettingsData(prev => {
                                  const updatedAttributs = [...prev.productAttributes];
                                  updatedAttributs[index] = {
                                    ...updatedAttributs[index],
                                    [name]: value
                                  };
                                  return {
                                    ...prev,
                                    productAttributes: updatedAttributs
                                  };
                                });
                              }}
                            />
                          </div>
                          <div className="flex gap-2 flex-col">
                            <label htmlFor="slug">Slug</label>
                            <input
                              type="text"
                              name={'slug'}
                              placeholder={'slug'}
                              className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                              value={settingsData?.productAttributes?.[index]?.['slug'] ?? productAttributesPrams?.[item?.slug]?.['slug']}
                              onChange={(ev) => {
                                const { name, value } = ev.target;
                                setsettingsData(prev => {
                                  const updatedAttributs = [...prev.productAttributes];
                                  updatedAttributs[index] = {
                                    ...updatedAttributs[index],
                                    [name]: value
                                  };
                                  return {
                                    ...prev,
                                    productAttributes: updatedAttributs
                                  };
                                });
                              }}
                            />
                          </div>









                          <div className="flex gap-2 justify-start items-center">
                            <label htmlFor="public">Public</label>
                            <div>
                              <input
                                type="checkbox"
                                name={'public'}
                                placeholder={'public'}
                                className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                value={settingsData?.productAttributes?.[index]?.args?.['public']}
                                onChange={(ev) => {
                                  const { name, checked } = ev.target;
                                  setsettingsData(prev => {
                                    const updatedAttributs = [...prev.productAttributes];
                                    updatedAttributs[index] = {
                                      ...updatedAttributs[index],
                                      args: {
                                        ...updatedAttributs[index].args,
                                        [name]: checked
                                      }
                                    };
                                    return {
                                      ...prev,
                                      productAttributes: updatedAttributs
                                    };
                                  });
                                }}
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 justify-start items-center">
                            <label htmlFor="publicly_queryable">Publicly queryable</label>
                            <div>
                              <input
                                type="checkbox"
                                name={'publicly_queryable'}
                                placeholder={'publicly_queryable'}
                                className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                value={settingsData?.productAttributes?.[index]?.args?.['publicly_queryable']}
                                onChange={(ev) => {
                                  const { name, checked } = ev.target;
                                  setsettingsData(prev => {
                                    const updatedAttributs = [...prev.productAttributes];
                                    updatedAttributs[index] = {
                                      ...updatedAttributs[index],
                                      args: {
                                        ...updatedAttributs[index].args,
                                        [name]: checked
                                      }
                                    };
                                    return {
                                      ...prev,
                                      productAttributes: updatedAttributs
                                    };
                                  });
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 justify-start items-center">
                            <label htmlFor="hierarchical">Hierarchical</label>
                            <div>
                              <input
                                type="checkbox"
                                name={'hierarchical'}
                                placeholder={'hierarchical'}
                                className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                value={settingsData?.productAttributes?.[index]?.args?.['hierarchical']}
                                onChange={(ev) => {
                                  const { name, checked } = ev.target;
                                  setsettingsData(prev => {
                                    const updatedAttributs = [...prev.productAttributes];
                                    updatedAttributs[index] = {
                                      ...updatedAttributs[index],
                                      args: {
                                        ...updatedAttributs[index].args,
                                        [name]: checked
                                      }
                                    };
                                    return {
                                      ...prev,
                                      productAttributes: updatedAttributs
                                    };
                                  });
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 justify-start items-center">
                            <label htmlFor="show_in_rest">Show in rest</label>
                            <div>
                              <input
                                type="checkbox"
                                name={'show_in_rest'}
                                placeholder={'show_in_rest'}
                                className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                value={settingsData?.productAttributes?.[index]?.args?.['show_in_rest']}
                                onChange={(ev) => {
                                  const { name, checked } = ev.target;
                                  setsettingsData(prev => {
                                    const updatedAttributs = [...prev.productAttributes];
                                    updatedAttributs[index] = {
                                      ...updatedAttributs[index],
                                      args: {
                                        ...updatedAttributs[index].args,
                                        [name]: checked
                                      }
                                    };
                                    return {
                                      ...prev,
                                      productAttributes: updatedAttributs
                                    };
                                  });
                                }}
                              />
                            </div>
                          </div>











                        </div>

                      </ToggleContent>

                    </div>
                  )
                }
                )}
              </div>
            </div>





          </WidgetWrapper>

        </Tab> */}

        {/* <Tab index={6}>
          <div className="flex flex-col gap-5">




            <WidgetWrapper title="Shipping Classes">





              <div className="flex flex-col gap-5">

                <div className=" hover:bg-gray-400 w-fit rounded-sm cursor-pointer px-4 py-2 bg-gray-600 text-white" onClick={ev => {

                  setsettingsData(prev => ({
                    ...prev,
                    shippingClasses: [...prev.shippingClasses, {
                      "name": "Custom Class",
                      "cost": "",
                      "type": "fixed",

                    }]
                  }));

                }}>Add</div>


                <div className="flex gap-3 flex-col">
                  {settingsData?.shippingClasses && settingsData?.shippingClasses?.map((item, index) => {




                    return (
                      <div className="">

                        <ToggleContent key={index} title={<ShippingClassesItemTitle item={item} index={index} />}
                          contentClass="bg-gray-200 !text-gray-800 p-4"
                          headerClass=""
                          headerTitleClass=""
                          wrapperClass="w-full"
                        >

                          <div className="flex flex-col gap-5">
                            <div className="flex flex-col lg:flex-row justify-start flex-wrap gap-2 lg:items-center">
                              <label htmlFor="label" className="lg:w-40">Name</label>
                              <input
                                type="text"
                                name={'name'}
                                placeholder={'name'}
                                className=" px-2 py-1 flex-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                value={settingsData?.shippingClasses?.[index]?.['name']}
                                onChange={(ev) => {
                                  const { name, value } = ev.target;
                                  setsettingsData(prev => {
                                    const updatedAttributs = [...prev.shippingClasses];
                                    updatedAttributs[index] = {
                                      ...updatedAttributs[index],
                                      [name]: value
                                    };
                                    return {
                                      ...prev,
                                      shippingClasses: updatedAttributs
                                    };
                                  });
                                }}
                              />
                            </div>
                            <div className="flex flex-col lg:flex-row justify-start flex-wrap gap-2 lg:items-center">
                              <label htmlFor="cost" className="lg:w-40">Cost</label>
                              <input
                                type="text"
                                name={'cost'}
                                placeholder={'10'}
                                className=" px-2 py-1 flex-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                value={settingsData?.shippingClasses?.[index]?.['cost']}
                                onChange={(ev) => {
                                  const { name, value } = ev.target;
                                  setsettingsData(prev => {
                                    const updatedAttributs = [...prev.shippingClasses];
                                    updatedAttributs[index] = {
                                      ...updatedAttributs[index],
                                      [name]: value
                                    };
                                    return {
                                      ...prev,
                                      shippingClasses: updatedAttributs
                                    };
                                  });
                                }}
                              />
                            </div>
                            <div className="flex flex-col lg:flex-row justify-start flex-wrap gap-2 lg:items-center">
                              <label htmlFor="type" className="lg:w-40">Type</label>


                              <select name="type" className="rounded-sm px-2 py-1 !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"

                                value={settingsData?.shippingClasses?.[index]?.['type']}
                                onChange={(ev) => {
                                  const { name, value } = ev.target;
                                  setsettingsData(prev => {
                                    const updatedAttributs = [...prev.shippingClasses];
                                    updatedAttributs[index] = {
                                      ...updatedAttributs[index],
                                      [name]: value
                                    };
                                    return {
                                      ...prev,
                                      shippingClasses: updatedAttributs
                                    };
                                  });
                                }}
                              >
                                <option value="">Choose</option>
                                <option value="fixed">Fixed</option>
                                <option value="percent">Percent</option>

                              </select>


                            </div>







                          </div>

                        </ToggleContent>

                      </div>
                    )
                  }
                  )}
                </div>
              </div>





            </WidgetWrapper>
            <WidgetWrapper title="Shipping Zones ">





              <div className="flex flex-col gap-5">

                <div className=" hover:bg-gray-400 w-fit rounded-sm cursor-pointer px-4 py-2 bg-gray-600 text-white" onClick={ev => {

                  setsettingsData(prev => ({
                    ...prev,
                    shippingZones: [...prev.shippingZones, {
                      "label": "Custom Attribute",
                      "slug": "custom-attribute",
                      "args": {
                        "public": true,
                        "publicly_queryable": true,
                        "hierarchical": true,
                        "show_in_rest": true,
                      },
                      "conditions": {
                        "post_type": ["product"],
                        "categories": [],
                      },
                    }]
                  }));

                }}>Add</div>


                <div className="flex gap-3 flex-col">
                  {settingsData?.shippingZones && settingsData?.shippingZones?.map((item, index) => {




                    return (
                      <div className="">

                        <ToggleContent key={index}

                          title={<ShippingZonesItemTitle item={item} index={index} />}


                          contentClass="bg-gray-200 !text-gray-800 p-4"
                          headerClass=""
                          headerTitleClass=""
                          wrapperClass="w-full"
                        >

                          <div className="flex flex-col gap-5">
                            <div className="flex gap-2 flex-col">
                              <label htmlFor="label">label</label>
                              <input
                                type="text"
                                name={'label'}
                                placeholder={'label'}
                                className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                value={settingsData?.shippingZones?.[index]?.['label'] ?? productAttributesPrams?.[item?.slug]?.['label']}
                                onChange={(ev) => {
                                  const { name, value } = ev.target;
                                  setsettingsData(prev => {
                                    const updatedAttributs = [...prev.shippingZones];
                                    updatedAttributs[index] = {
                                      ...updatedAttributs[index],
                                      [name]: value
                                    };
                                    return {
                                      ...prev,
                                      shippingZones: updatedAttributs
                                    };
                                  });
                                }}
                              />
                            </div>
                            <div className="flex gap-2 flex-col">
                              <label htmlFor="slug">Slug</label>
                              <input
                                type="text"
                                name={'slug'}
                                placeholder={'slug'}
                                className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                value={settingsData?.shippingZones?.[index]?.['slug'] ?? productAttributesPrams?.[item?.slug]?.['slug']}
                                onChange={(ev) => {
                                  const { name, value } = ev.target;
                                  setsettingsData(prev => {
                                    const updatedAttributs = [...prev.shippingZones];
                                    updatedAttributs[index] = {
                                      ...updatedAttributs[index],
                                      [name]: value
                                    };
                                    return {
                                      ...prev,
                                      shippingZones: updatedAttributs
                                    };
                                  });
                                }}
                              />
                            </div>









                            <div className="flex gap-2 justify-start items-center">
                              <label htmlFor="public">Public</label>
                              <div>
                                <input
                                  type="checkbox"
                                  name={'public'}
                                  placeholder={'public'}
                                  className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                  value={settingsData?.shippingZones?.[index]?.args?.['public']}
                                  onChange={(ev) => {
                                    const { name, checked } = ev.target;
                                    setsettingsData(prev => {
                                      const updatedAttributs = [...prev.shippingZones];
                                      updatedAttributs[index] = {
                                        ...updatedAttributs[index],
                                        args: {
                                          ...updatedAttributs[index].args,
                                          [name]: checked
                                        }
                                      };
                                      return {
                                        ...prev,
                                        shippingZones: updatedAttributs
                                      };
                                    });
                                  }}
                                />
                              </div>
                            </div>

                            <div className="flex gap-2 justify-start items-center">
                              <label htmlFor="publicly_queryable">Publicly queryable</label>
                              <div>
                                <input
                                  type="checkbox"
                                  name={'publicly_queryable'}
                                  placeholder={'publicly_queryable'}
                                  className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                  value={settingsData?.shippingZones?.[index]?.args?.['publicly_queryable']}
                                  onChange={(ev) => {
                                    const { name, checked } = ev.target;
                                    setsettingsData(prev => {
                                      const updatedAttributs = [...prev.shippingZones];
                                      updatedAttributs[index] = {
                                        ...updatedAttributs[index],
                                        args: {
                                          ...updatedAttributs[index].args,
                                          [name]: checked
                                        }
                                      };
                                      return {
                                        ...prev,
                                        shippingZones: updatedAttributs
                                      };
                                    });
                                  }}
                                />
                              </div>
                            </div>
                            <div className="flex gap-2 justify-start items-center">
                              <label htmlFor="hierarchical">Hierarchical</label>
                              <div>
                                <input
                                  type="checkbox"
                                  name={'hierarchical'}
                                  placeholder={'hierarchical'}
                                  className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                  value={settingsData?.shippingZones?.[index]?.args?.['hierarchical']}
                                  onChange={(ev) => {
                                    const { name, checked } = ev.target;
                                    setsettingsData(prev => {
                                      const updatedAttributs = [...prev.shippingZones];
                                      updatedAttributs[index] = {
                                        ...updatedAttributs[index],
                                        args: {
                                          ...updatedAttributs[index].args,
                                          [name]: checked
                                        }
                                      };
                                      return {
                                        ...prev,
                                        shippingZones: updatedAttributs
                                      };
                                    });
                                  }}
                                />
                              </div>
                            </div>
                            <div className="flex gap-2 justify-start items-center">
                              <label htmlFor="show_in_rest">Show in rest</label>
                              <div>
                                <input
                                  type="checkbox"
                                  name={'show_in_rest'}
                                  placeholder={'show_in_rest'}
                                  className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                  value={settingsData?.shippingZones?.[index]?.args?.['show_in_rest']}
                                  onChange={(ev) => {
                                    const { name, checked } = ev.target;
                                    setsettingsData(prev => {
                                      const updatedAttributs = [...prev.shippingZones];
                                      updatedAttributs[index] = {
                                        ...updatedAttributs[index],
                                        args: {
                                          ...updatedAttributs[index].args,
                                          [name]: checked
                                        }
                                      };
                                      return {
                                        ...prev,
                                        shippingZones: updatedAttributs
                                      };
                                    });
                                  }}
                                />
                              </div>
                            </div>











                          </div>

                        </ToggleContent>

                      </div>
                    )
                  }
                  )}
                </div>
              </div>





            </WidgetWrapper>
          </div>




        </Tab> */}
        <Tab index={5}>




          <WidgetWrapper title="API Keys">




            <div className="flex flex-col gap-2">


              <div className="flex gap-2 flex-col">
                {Object.entries(apiKeysPrams)?.map((args, index) => {

                  var providerKey = args[0];
                  var item = args[1];




                  return (
                    <div className="">

                      <ToggleContent key={index} title={item?.label}
                        contentClass="bg-gray-200 !text-gray-800 p-4"
                        headerClass=""
                        headerTitleClass=""
                        wrapperClass="w-full"
                      >

                        <div className="flex flex-col gap-5">



                          {providerKey == 'googleMap' && (

                            <>


                              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                <div className="  py-2 lg:w-60 ">{("API Key")}</div>
                                <div className="flex gap-3">
                                  <input
                                    type="text"
                                    name={'key'}
                                    placeholder={'key'}
                                    className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                    value={settingsData?.apiKeys?.[providerKey]?.['key']}
                                    onChange={(ev) => {
                                      const { name, value } = ev.target;
                                      setsettingsData(prev => ({
                                        ...prev,
                                        apiKeys: {
                                          ...prev.apiKeys,
                                          [providerKey]: {
                                            ...prev?.apiKeys?.[providerKey],
                                            [name]: value
                                          }
                                        }
                                      }));

                                    }}
                                  />
                                </div>
                              </div>

                              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                <div className="  py-2 lg:w-60 ">{("Map ID")}</div>
                                <div className="flex gap-3">
                                  <input
                                    type="text"
                                    name={'map_id'}
                                    placeholder={'map_id'}
                                    className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                    value={settingsData?.apiKeys?.['googleMap']?.['map_id']}
                                    onChange={(ev) => {
                                      const { name, value } = ev.target;
                                      setsettingsData(prev => ({
                                        ...prev,
                                        apiKeys: {
                                          ...prev.apiKeys,
                                          ['googleMap']: {
                                            ...prev?.apiKeys?.['googleMap'],
                                            [name]: value
                                          }
                                        }
                                      }));

                                    }}
                                  />
                                </div>
                              </div>




                            </>
                          )}

                          {providerKey == 'facebookPixel' && (

                            <>

                              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                <div className="  py-2 lg:w-60 ">{("Pixel ID")}</div>
                                <div className="flex gap-3">
                                  <input
                                    type="text"
                                    name={'pixel_id'}
                                    placeholder={'1384855716349155'}
                                    className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                    value={settingsData?.apiKeys?.[providerKey]?.['pixel_id']}
                                    onChange={(ev) => {
                                      const { name, value } = ev.target;
                                      setsettingsData(prev => ({
                                        ...prev,
                                        apiKeys: {
                                          ...prev.apiKeys,
                                          [providerKey]: {
                                            ...prev?.apiKeys?.[providerKey],
                                            [name]: value
                                          }
                                        }
                                      }));

                                    }}
                                  />
                                </div>
                              </div>


                            </>
                          )}
                          {providerKey == 'googleAnalytics' && (

                            <>

                              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                <div className="  py-2 lg:w-60 ">{("ID")}</div>
                                <div className="flex gap-3">
                                  <input
                                    type="text"
                                    name={'id'}
                                    placeholder={'G-X11VE2QSYZ'}
                                    className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                    value={settingsData?.apiKeys?.[providerKey]?.['id']}
                                    onChange={(ev) => {
                                      const { name, value } = ev.target;
                                      setsettingsData(prev => ({
                                        ...prev,
                                        apiKeys: {
                                          ...prev.apiKeys,
                                          [providerKey]: {
                                            ...prev?.apiKeys?.[providerKey],
                                            [name]: value
                                          }
                                        }
                                      }));

                                    }}
                                  />
                                </div>
                              </div>


                            </>
                          )}
                          {providerKey == 'googleLogin' && (

                            <>

                              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                <div className="  py-2 lg:w-60 ">{("Login ID")}</div>
                                <div className="flex gap-3">
                                  <input
                                    type="text"
                                    name={'id'}
                                    placeholder={'50859545951-q060shj5lcssd1tu3i2v1optuggr.apps.googleusercontent.com'}
                                    className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                    value={settingsData?.apiKeys?.[providerKey]?.['id']}
                                    onChange={(ev) => {
                                      const { name, value } = ev.target;
                                      setsettingsData(prev => ({
                                        ...prev,
                                        apiKeys: {
                                          ...prev.apiKeys,
                                          [providerKey]: {
                                            ...prev?.apiKeys?.[providerKey],
                                            [name]: value
                                          }
                                        }
                                      }));

                                    }}
                                  />
                                </div>
                              </div>


                            </>
                          )}

                          {providerKey == 'gemini' && (

                            <>

                              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                <div className="  py-2 lg:w-60 ">{("API Key")}</div>
                                <div className="flex gap-3">
                                  <input
                                    type="text"
                                    name={'key'}
                                    placeholder={'key'}
                                    className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                    value={settingsData?.apiKeys?.[providerKey]?.['key']}
                                    onChange={(ev) => {
                                      const { name, value } = ev.target;
                                      setsettingsData(prev => ({
                                        ...prev,
                                        apiKeys: {
                                          ...prev.apiKeys,
                                          [providerKey]: {
                                            ...prev?.apiKeys?.[providerKey],
                                            [name]: value
                                          }
                                        }
                                      }));

                                    }}
                                  />
                                </div>
                              </div>
                              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                <div className="  py-2 lg:w-60 ">{("Model")}</div>
                                <div className="flex gap-3">

                                  <select name="model" className="rounded-sm px-2 py-1 !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"

                                    value={settingsData?.apiKeys?.[providerKey]?.['model']}
                                    onChange={(ev) => {
                                      const { name, value } = ev.target;
                                      setsettingsData(prev => ({
                                        ...prev,
                                        apiKeys: {
                                          ...prev.apiKeys,
                                          [providerKey]: {
                                            ...prev?.apiKeys?.[providerKey],
                                            ['model']: value
                                          }
                                        }
                                      }));
                                    }}
                                  >
                                    <option value="">Choose</option>

                                    {geminiModelxPrams.map(item => {

                                      return (
                                        <option value={item?.model_id}>{item?.name}</option>
                                      )

                                    })}


                                  </select>

                                </div>
                              </div>

                            </>
                          )}

                          {providerKey == 'pollinations' && (

                            <>





                              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                <div className="  py-2 lg:w-60 ">{("API Key")}</div>
                                <div className="flex gap-3">
                                  <input
                                    type="text"
                                    name={'key'}
                                    placeholder={'key'}
                                    className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                    value={settingsData?.apiKeys?.[providerKey]?.['key']}
                                    onChange={(ev) => {
                                      const { name, value } = ev.target;
                                      setsettingsData(prev => ({
                                        ...prev,
                                        apiKeys: {
                                          ...prev.apiKeys,
                                          [providerKey]: {
                                            ...prev.apiKeys?.[providerKey],
                                            [name]: value
                                          }
                                        }
                                      }));

                                    }}
                                  />
                                </div>
                              </div>
                              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                <div className="  py-2 lg:w-60 ">{("Model")}</div>
                                <div className="flex gap-3">

                                  <select name="model" className="rounded-sm px-2 py-1 !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"

                                    value={settingsData?.apiKeys?.[providerKey]?.['model']}
                                    onChange={(ev) => {
                                      const { name, value } = ev.target;
                                      setsettingsData(prev => ({
                                        ...prev,
                                        apiKeys: {
                                          ...prev.apiKeys,
                                          [providerKey]: {
                                            ...prev.apiKeys?.[providerKey],
                                            ['model']: value
                                          }
                                        }
                                      }));
                                    }}
                                  >
                                    <option value="">Choose</option>
                                    {pollinationsModelPrams.map(item => {

                                      return (
                                        <option value={item?.model_id}>{item?.name}</option>
                                      )

                                    })}                                    <option value="percent">Percent</option>

                                  </select>

                                </div>
                              </div>





                            </>
                          )}



                        </div>

                      </ToggleContent>

                    </div>
                  )
                }
                )}
              </div>
            </div>

















          </WidgetWrapper>


        </Tab>
        <Tab index={6}>

          {/* {JSON.stringify(settingsData)} */}

          <div className="flex flex-col gap-5">




            <WidgetWrapper title="Discount & Cash Back">





              <div className="flex flex-col gap-5">

                <div className=" hover:bg-gray-400 w-fit rounded-sm cursor-pointer px-4 py-2 bg-gray-600 text-white" onClick={ev => {

                  setsettingsData(prev => ({
                    ...prev,
                    shippingClasses: [...prev.shippingClasses, {
                      "name": "Custom Class",
                      "cost": "",
                      "type": "fixed",

                    }]
                  }));

                }}>Add</div>


                <div className="flex gap-3 flex-col">
                  {settingsData?.shippingClasses && settingsData?.shippingClasses?.map((item, index) => {




                    return (
                      <div className="">

                        <ToggleContent key={index} title={<ShippingClassesItemTitle item={item} index={index} />}
                          contentClass="bg-gray-200 !text-gray-800 p-4"
                          headerClass=""
                          headerTitleClass=""
                          wrapperClass="w-full"
                        >

                          <div className="flex flex-col gap-5">
                            <div className="flex gap-2 items-center">
                              <label htmlFor="label" className="lg:w-40">Name</label>
                              <input
                                type="text"
                                name={'name'}
                                placeholder={'name'}
                                className=" px-2 py-1 flex-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                value={settingsData?.cashbackRules?.[index]?.['name']}
                                onChange={(ev) => {
                                  const { name, value } = ev.target;
                                  setsettingsData(prev => {
                                    const updatedAttributs = [...prev.cashbackRules];
                                    updatedAttributs[index] = {
                                      ...updatedAttributs[index],
                                      [name]: value
                                    };
                                    return {
                                      ...prev,
                                      cashbackRules: updatedAttributs
                                    };
                                  });
                                }}
                              />
                            </div>
                            <div className="flex gap-2 items-center">
                              <label htmlFor="cost" className="lg:w-40">Cost</label>
                              <input
                                type="text"
                                name={'cost'}
                                placeholder={'10'}
                                className=" px-2 py-1 flex-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                value={settingsData?.cashbackRules?.[index]?.['cost']}
                                onChange={(ev) => {
                                  const { name, value } = ev.target;
                                  setsettingsData(prev => {
                                    const updatedAttributs = [...prev.cashbackRules];
                                    updatedAttributs[index] = {
                                      ...updatedAttributs[index],
                                      [name]: value
                                    };
                                    return {
                                      ...prev,
                                      cashbackRules: updatedAttributs
                                    };
                                  });
                                }}
                              />
                            </div>
                            <div className="flex gap-2 items-center">
                              <label htmlFor="type" className="lg:w-40">Type</label>


                              <select name="type" className="rounded-sm px-2 py-1 !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"

                                value={settingsData?.cashbackRules?.[index]?.['type']}
                                onChange={(ev) => {
                                  const { name, value } = ev.target;
                                  setsettingsData(prev => {
                                    const updatedAttributs = [...prev.cashbackRules];
                                    updatedAttributs[index] = {
                                      ...updatedAttributs[index],
                                      [name]: value
                                    };
                                    return {
                                      ...prev,
                                      cashbackRules: updatedAttributs
                                    };
                                  });
                                }}
                              >
                                <option value="">Choose</option>
                                <option value="fixed">Fixed</option>
                                <option value="percent">Percent</option>

                              </select>


                            </div>







                          </div>

                        </ToggleContent>

                      </div>
                    )
                  }
                  )}
                </div>
              </div>





            </WidgetWrapper>

          </div>



        </Tab>
        <Tab index={7}>

          {/* {JSON.stringify(settingsData)} */}

          <div className="flex flex-col gap-5">


            <WidgetWrapper title="Fraud Check">




              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                <div className="  py-2 lg:w-60 ">{("Enable Fraud Check")}</div>
                <div className="flex gap-3">
                  <input type="checkbox" name="enable" id="enable" checked={settingsData?.fraudCheck?.enable} className="lg:w-auto w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0" value={settingsData?.fraudCheck?.enable} onChange={ev => {
                    var value = ev.target.value;
                    setsettingsData({ ...settingsData, fraudCheck: { ...settingsData?.fraudCheck, enable: !settingsData?.fraudCheck?.enable } })
                  }} />
                  <label htmlFor="enable" className="cursor-pointer">{settingsData?.fraudCheck?.enable ? "Enabled" : "Disabled"}</label>
                </div>
              </div>

              {/* {JSON.stringify(settingsData?.fraudCheck)} */}


              {settingsData?.fraudCheck?.enable && (
                <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                  <div className="  py-2 lg:w-60 ">{("Fraud Check Service")}</div>
                  <div className="flex gap-3">



                    <select name="service" className="rounded-sm px-2 py-1 !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"

                      value={settingsData?.fraudCheck?.service} onChange={ev => {
                        var value = ev.target.value;
                        setsettingsData({ ...settingsData, fraudCheck: { ...settingsData?.fraudCheck, service: value } })
                      }}
                    >
                      <option value="">Choose</option>
                      {Object.keys(fraudCheckPrams)?.map((args, index) => {
                        return (
                          <option value={args}>{fraudCheckPrams[args]?.label}</option>
                        )
                      })}


                    </select>




                  </div>
                </div>

              )}



              {settingsData?.fraudCheck?.enable && (

                <div className="flex flex-col gap-2">


                  <div className="flex gap-2 flex-col">
                    {Object.entries(fraudCheckPrams)?.map((args, index) => {

                      var providerKey = args[0];
                      var item = args[1];




                      return (
                        <div className="">

                          <ToggleContent key={index} title={`${item?.label} ${settingsData?.fraudCheck?.service == providerKey ? " ✔ " : ""}  `}
                            contentClass="bg-gray-200 !text-gray-800 p-4"
                            headerClass=""
                            headerTitleClass=""
                            wrapperClass="w-full"
                          >

                            <div className="flex flex-col gap-5">


                              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                <div className="  py-2 lg:w-60 ">{("API Key")}</div>
                                <div className="flex gap-3">
                                  <input
                                    type="text"
                                    name={'api_key'}
                                    placeholder={'api_key'}
                                    className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                    value={settingsData?.fraudCheck?.[providerKey]?.['api_key']}
                                    onChange={(ev) => {
                                      const { name, value } = ev.target;
                                      setsettingsData(prev => ({
                                        ...prev,
                                        fraudCheck: {
                                          ...prev.fraudCheck,
                                          [providerKey]: {
                                            ...prev.fraudCheck[providerKey],
                                            [name]: value
                                          }
                                        }
                                      }));

                                    }}
                                  />
                                </div>
                              </div>



                            </div>

                          </ToggleContent>

                        </div>
                      )
                    }
                    )}
                  </div>
                </div>

              )}














            </WidgetWrapper>

          </div>



        </Tab>
        <Tab index={8}>

          {/* {JSON.stringify(settingsData)} */}

          <div className="flex flex-col gap-5">




            <WidgetWrapper title="Couriers">




              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                <div className="  py-2 lg:w-60 ">{("Enable Courier")}</div>
                <div className="flex gap-3">
                  <input type="checkbox" name="enable" id="enable" checked={settingsData?.couriers?.enable} className="lg:w-auto w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0" value={settingsData?.couriers?.enable} onChange={ev => {
                    var value = ev.target.value;
                    setsettingsData({ ...settingsData, couriers: { ...settingsData?.couriers, enable: !settingsData?.couriers?.enable } })
                  }} />
                  <label htmlFor="enable" className="cursor-pointer">{settingsData?.couriers?.enable ? "Enabled" : "Disabled"}</label>
                </div>
              </div>

              {/* {JSON.stringify(settingsData?.courier)} */}


              {settingsData?.couriers?.enable && (

                <div className="flex flex-col gap-2">


                  <div className="flex gap-2 flex-col">
                    {Object.entries(couriersPrams)?.map((args, index) => {

                      var providerKey = args[0];
                      var item = args[1];




                      return (
                        <div className="">

                          <ToggleContent key={index} title={item?.label}
                            contentClass="bg-gray-200 !text-gray-800 p-4"
                            headerClass=""
                            headerTitleClass=""
                            wrapperClass="w-full"
                          >

                            <div className="flex flex-col gap-5">



                              {providerKey == 'pathao' && (

                                <>

                                  <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                    <div className="  py-2 lg:w-60 ">{("Sandbox")}</div>
                                    <div className="flex gap-3">
                                      <input type="checkbox" name="sandbox" id={`sandbox-${providerKey}`}
                                        checked={settingsData?.couriers?.[providerKey]?.['sandbox']}
                                        className="lg:w-auto w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"

                                        value={settingsData?.couriers?.[providerKey]?.['sandbox']}
                                        onChange={(ev) => {
                                          const value = ev.target.value;

                                          console.log(value);


                                          setsettingsData(prev => ({
                                            ...prev,
                                            couriers: {
                                              ...prev.couriers,
                                              [providerKey]: {
                                                ...prev.couriers[providerKey],
                                                ['sandbox']: !prev.couriers[providerKey]?.['sandbox']
                                              }
                                            }
                                          }));

                                        }} />
                                      <label htmlFor={`sandbox-${providerKey}`} className="cursor-pointer">{settingsData?.couriers?.[providerKey]?.['sandbox'] ? "Enabled" : "Disabled"}</label>
                                    </div>
                                  </div>

                                  <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                    <div className="  py-2 lg:w-60 ">{("Store ID")}</div>
                                    <div className="flex gap-3">
                                      <input
                                        type="text"
                                        name={'store_id'}
                                        placeholder={'store_id'}
                                        className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                        value={settingsData?.couriers?.[providerKey]?.['store_id']}
                                        onChange={(ev) => {
                                          const { name, value } = ev.target;
                                          setsettingsData(prev => ({
                                            ...prev,
                                            couriers: {
                                              ...prev.couriers,
                                              [providerKey]: {
                                                ...prev.couriers[providerKey],
                                                [name]: value
                                              }
                                            }
                                          }));

                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                    <div className="  py-2 lg:w-60 ">{("Client ID")}</div>
                                    <div className="flex gap-3">
                                      <input
                                        type="text"
                                        name={'client_id'}
                                        placeholder={'client_id'}
                                        className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                        value={settingsData?.couriers?.[providerKey]?.['client_id']}
                                        onChange={(ev) => {
                                          const { name, value } = ev.target;
                                          setsettingsData(prev => ({
                                            ...prev,
                                            couriers: {
                                              ...prev.couriers,
                                              [providerKey]: {
                                                ...prev.couriers[providerKey],
                                                [name]: value
                                              }
                                            }
                                          }));

                                        }}
                                      />
                                    </div>
                                  </div>

                                  <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                    <div className="  py-2 lg:w-60 ">{("Client Secret")}</div>
                                    <div className="flex gap-3">
                                      <input
                                        type="text"
                                        name={'client_secret'}
                                        placeholder={'client_secret'}
                                        className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                        value={settingsData?.couriers?.[providerKey]?.['client_secret']}
                                        onChange={(ev) => {
                                          const { name, value } = ev.target;
                                          setsettingsData(prev => ({
                                            ...prev,
                                            couriers: {
                                              ...prev.couriers,
                                              [providerKey]: {
                                                ...prev.couriers[providerKey],
                                                [name]: value
                                              }
                                            }
                                          }));

                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                    <div className="  py-2 lg:w-60 ">{("Username")}</div>
                                    <div className="flex gap-3">
                                      <input
                                        type="text"
                                        name={'username'}
                                        placeholder={'username'}
                                        className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                        value={settingsData?.couriers?.[providerKey]?.['username']}
                                        onChange={(ev) => {
                                          const { name, value } = ev.target;
                                          setsettingsData(prev => ({
                                            ...prev,
                                            couriers: {
                                              ...prev.couriers,
                                              [providerKey]: {
                                                ...prev.couriers[providerKey],
                                                [name]: value
                                              }
                                            }
                                          }));

                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                    <div className="  py-2 lg:w-60 ">{("Password")}</div>
                                    <div className="flex gap-3">
                                      <input
                                        type="text"
                                        name={'password'}
                                        placeholder={'password'}
                                        className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                        value={settingsData?.couriers?.[providerKey]?.['password']}
                                        onChange={(ev) => {
                                          const { name, value } = ev.target;
                                          setsettingsData(prev => ({
                                            ...prev,
                                            couriers: {
                                              ...prev.couriers,
                                              [providerKey]: {
                                                ...prev.couriers[providerKey],
                                                [name]: value
                                              }
                                            }
                                          }));

                                        }}
                                      />
                                    </div>
                                  </div>

                                </>
                              )}

                              {providerKey == 'steadfast' && (

                                <>

                                  <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                    <div className="  py-2 lg:w-60 ">{("API key")}</div>
                                    <div className="flex gap-3">
                                      <input
                                        type="text"
                                        name={'api_key'}
                                        placeholder={'api_key'}
                                        className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                        value={settingsData?.couriers?.[providerKey]?.['api_key']}
                                        onChange={(ev) => {
                                          const { name, value } = ev.target;
                                          setsettingsData(prev => ({
                                            ...prev,
                                            couriers: {
                                              ...prev.couriers,
                                              [providerKey]: {
                                                ...prev.couriers[providerKey],
                                                [name]: value
                                              }
                                            }
                                          }));

                                        }}
                                      />
                                    </div>
                                  </div>

                                  <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                    <div className="  py-2 lg:w-60 ">{("Secret key")}</div>
                                    <div className="flex gap-3">
                                      <input
                                        type="text"
                                        name={'secret_key'}
                                        placeholder={'secret_key'}
                                        className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                        value={settingsData?.couriers?.[providerKey]?.['secret_key']}
                                        onChange={(ev) => {
                                          const { name, value } = ev.target;
                                          setsettingsData(prev => ({
                                            ...prev,
                                            couriers: {
                                              ...prev.couriers,
                                              [providerKey]: {
                                                ...prev.couriers[providerKey],
                                                [name]: value
                                              }
                                            }
                                          }));

                                        }}
                                      />
                                    </div>
                                  </div>
                                </>
                              )}

                              {providerKey == 'redx' && (

                                <>

                                  <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                    <div className="  py-2 lg:w-60 ">{("Sandbox")}</div>
                                    <div className="flex gap-3">
                                      <input type="checkbox" name="sandbox" id={`sandbox-${providerKey}`}
                                        checked={settingsData?.couriers?.[providerKey]?.['sandbox']}
                                        className="lg:w-auto w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"

                                        value={settingsData?.couriers?.[providerKey]?.['sandbox']}
                                        onChange={(ev) => {
                                          const value = ev.target.value;

                                          console.log(value);


                                          setsettingsData(prev => ({
                                            ...prev,
                                            couriers: {
                                              ...prev.couriers,
                                              [providerKey]: {
                                                ...prev.couriers[providerKey],
                                                ['sandbox']: !prev.couriers[providerKey]?.['sandbox']
                                              }
                                            }
                                          }));

                                        }} />
                                      <label htmlFor={`sandbox-${providerKey}`} className="cursor-pointer">{settingsData?.couriers?.[providerKey]?.['sandbox'] ? "Enabled" : "Disabled"}</label>
                                    </div>
                                  </div>

                                  <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                    <div className="  py-2 lg:w-60 ">{("Store ID")}</div>
                                    <div className="flex gap-3">
                                      <input
                                        type="text"
                                        name={'store_id'}
                                        placeholder={'store_id'}
                                        className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                        value={settingsData?.couriers?.[providerKey]?.['store_id']}
                                        onChange={(ev) => {
                                          const { name, value } = ev.target;
                                          setsettingsData(prev => ({
                                            ...prev,
                                            couriers: {
                                              ...prev.couriers,
                                              [providerKey]: {
                                                ...prev.couriers[providerKey],
                                                [name]: value
                                              }
                                            }
                                          }));

                                        }}
                                      />
                                    </div>
                                  </div>


                                  <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                                    <div className="  py-2 lg:w-60 ">{("token")}</div>
                                    <div className="flex gap-3">
                                      <input
                                        type="text"
                                        name={'token'}
                                        placeholder={'token'}
                                        className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
                                        value={settingsData?.couriers?.[providerKey]?.['token']}
                                        onChange={(ev) => {
                                          const { name, value } = ev.target;
                                          setsettingsData(prev => ({
                                            ...prev,
                                            couriers: {
                                              ...prev.couriers,
                                              [providerKey]: {
                                                ...prev.couriers[providerKey],
                                                [name]: value
                                              }
                                            }
                                          }));

                                        }}
                                      />
                                    </div>
                                  </div>
                                </>
                              )}



                            </div>

                          </ToggleContent>

                        </div>
                      )
                    }
                    )}
                  </div>
                </div>

              )}














            </WidgetWrapper>

          </div>



        </Tab>
        <Tab index={9}>

          {/* {JSON.stringify(settingsData)} */}

          <div className="flex flex-col gap-5">




            <WidgetWrapper title="License">



              <div className=" lg:flex flex-wrap gap-3 py-3 items-center">
                <div className="  py-2 lg:w-60 ">{("License Key")}</div>
                <div className="flex gap-3">
                  <input type="text" name="enable" id="enable" checked={settingsData?.couriers?.enable} className="lg:w-auto w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0" value={settingsData?.couriers?.enable} onChange={ev => {
                    var value = ev.target.value;
                    setsettingsData({ ...settingsData, couriers: { ...settingsData?.couriers, enable: value } })
                  }} />

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