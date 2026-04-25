'use client'
import React, { use } from 'react'
import Link from "next/link";


import { useState, useEffect, } from "react";
import Image from "next/image";

import ImageGallery from "../../../components/shop-elements/ImageGallery";
import Tabs from "../../../components/Tabs";
import Tab from "../../../components/Tab";
import Comments from "../../../components/shop-elements/Comments";
import RelatedPosts from "../../../components/shop-elements/RelatedPosts";
import Upsells from "../../../components/shop-elements/Upsells";
import ToggleContent from "../../../components/ToggleContent";
import { useCounterStore } from '../../../store/useCounterStore'


import ProductsPicker from "../../../components/shop-elements/ProductsPicker";
import GalleryPicker from "../../../components/shop-elements/GalleryPicker";
import TermsPicker from "../../../components/shop-elements/TermsPicker";
import TagsPicker from "../../../components/shop-elements/TagsPicker";
import Spinner from "../../../components/Spinner";

import { IconSettings, IconCheckbox, IconSquare, IconFidgetSpinner, IconTrash, IconStarFilled, IconStar, IconX, IconExternalLink } from "@tabler/icons-react";



const page = ({ params }) => {
  const { id } = use(params)
  const { token, settings, appData, notifications, addNotification, userDataX, setUserDataX } = useCounterStore()


  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  const storeUrl = process.env.NEXT_PUBLIC_STORE_URL;


  var [currentObject, setcurrentObject] = useState(null);
  var [thumbUrl, setthumbUrl] = useState({ postId: id });

  var [loading, setloading] = useState(false);



  function get_product() {





    var postData = {
      id: id,
    };
    postData = JSON.stringify(postData);
    setloading(true);
    fetch(
      serverUrl + "wp-json/combo-store/v2/get_product",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
            var errors = res?.errors;
            var success = res?.success;
            var product = res?.product;



            product.addons = [...product.addons, 'brands']


            setloading(false);
            setcurrentObject(product)



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

  function setThumbnailFromUrl() {





    var postData = JSON.stringify(thumbUrl);
    setloading(true);
    fetch(
      serverUrl + "wp-json/combo-store/v2/set_thumbnail_from_url",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`

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




            var success = res?.success;
            var src = res?.src;
            var attachment_id = res?.attachment_id;




            setloading(false);
            var post_thumbnail = { id: attachment_id, title: "", src: src }

            setcurrentObject({ ...currentObject, post_thumbnail: post_thumbnail });



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




  function update_product() {


    //var postData = currentObject;

    currentObject.id = id;



    var postData = JSON.stringify(currentObject);


    setloading(true);
    fetch(
      serverUrl + "wp-json/combo-store/v2/update_product",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`

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
            var errors = res?.errors;
            var success = res?.success;


            setloading(false);
            //setcurrentObject(res)



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






  useEffect(() => {
    get_product();

  }, []);


  var addonsList = [
    { label: "Stock ", value: 'manageStock' },
    { label: "Variations ", value: 'variations' },
    { label: "Dimensions", value: 'dimensions' },
    { label: "Reviews", value: 'reviews' },
    { label: "Categories", value: 'categories' },

    { label: "Tags", value: 'tags' },
    { label: "Visibility", value: 'visibility' },

    { label: "Brands", value: 'brands' },
    { label: "Shipping", value: 'shipping' },
    // { label: "Badges", value: 'badges' },
    { label: "Downloads", value: 'downloads' },
    // { label: "Tax", value: 'tax' },
    { label: "Gallery", value: 'gallery' },
    { label: "Warranty", value: 'warranty' },
    // { label: "Expiry Date", value: 'expiryDate' },
    // { label: "Compliance", value: 'compliance ' },
    // { label: "Warehouse", value: 'warehouse' },
    { label: "FAQ", value: 'faq' },
    { label: "Upsells & Cross-sells", value: 'upsellsCrosssells' },
    { label: "Related Products", value: 'relatedProducts' },

  ]


  var weightUnits = [
    { label: "Cooose", value: "" },

    { label: "Gram (g)", value: "g" },
    { label: "Kilogram (kg)", value: "kg" },
    { label: "Milligram (mg)", value: "mg" },
    { label: "Metric Ton (t)", value: "t" },
    { label: "Pound (lb)", value: "lb" },
    { label: "Ounce (oz)", value: "oz" },
    { label: "Stone (st)", value: "st" },
    { label: "Microgram (mcg)", value: "mcg" },
    { label: "Carat (ct)", value: "ct" },
    { label: "Grain (gr)", value: "gr" }
  ]
  var lengthUnits = [
    { label: "Cooose", value: "" },
    { label: "Millimeter (mm)", value: "mm" },
    { label: "Centimeter (cm)", value: "cm" },
    { label: "Meter (m)", value: "m" },
    { label: "Kilometer (km)", value: "km" },
    { label: "Inch (in)", value: "in" },
    { label: "Foot (ft)", value: "ft" },
    { label: "Yard (yd)", value: "yd" },
    { label: "Mile (mi)", value: "mi" }
  ]



  const FAQTitle = ({ text, index }) => {

    return (
      <div className="flex gap-3 items-center">

        <div className="hover:bg-red-400 text-white px-1 py-1 rounded-sm" onClick={ev => {


          var faq = currentObject.faq;
          faq.splice(index, 1);
          setcurrentObject({ ...currentObject, faq: faq });


        }}><IconTrash /></div>
        <div>{text}</div>
      </div>
    )

  }
  const DownloadsTitle = ({ text, index }) => {

    return (
      <div className="flex gap-3 items-center">

        <div className="hover:bg-red-400 text-white px-1 py-1 rounded-sm" onClick={ev => {

          var downloads = currentObject.downloads;
          downloads.splice(index, 1);
          setcurrentObject({ ...currentObject, downloads: downloads });

        }}><IconTrash /></div>
        <div>{text}</div>
      </div>
    )

  }
  const GalleryTitle = ({ text, index }) => {

    return (
      <div className="flex gap-3 items-center">

        <div className="hover:bg-red-400 text-white px-1 py-1 rounded-sm" onClick={ev => {


          var gallery = currentObject.gallery;
          gallery.splice(index, 1);
          setcurrentObject({ ...currentObject, gallery: gallery });

        }}><IconTrash /></div>
        <div>{text}</div>
      </div>
    )

  }

  const RelatedProductsTitle = ({ text, index }) => {

    return (
      <div className="flex gap-3 items-center">

        <div className="hover:bg-red-400 text-white px-1 py-1 rounded-sm" onClick={ev => {

          var relatedProducts = currentObject.relatedProducts;
          relatedProducts.splice(index, 1);
          setcurrentObject({ ...currentObject, relatedProducts: relatedProducts });

        }}><IconTrash /></div>
        <div>{text}</div>
      </div>
    )

  }

  const VariationsProductsTitle = ({ text, index }) => {

    return (
      <div className="flex gap-3 items-center">

        <div className="hover:bg-red-400 text-white px-1 py-1 rounded-sm" onClick={ev => {

          var variations = currentObject.variations;
          variations.splice(index, 1);
          setcurrentObject({ ...currentObject, variations: variations });

        }}><IconTrash /></div>
        <div>{text}</div>
      </div>
    )

  }
  const CrosssellsProductsTitle = ({ text, index }) => {

    return (
      <div className="flex gap-3 items-center">

        <div className="hover:bg-red-400 text-white px-1 py-1 rounded-sm" onClick={ev => {

          var crosssells = currentObject.crosssells;
          crosssells.splice(index, 1);
          setcurrentObject({ ...currentObject, crosssells: crosssells });

        }}><IconTrash /></div>
        <div>{text}</div>
      </div>
    )

  }
  const UpsellsProductsTitle = ({ text, index }) => {

    return (
      <div className="flex gap-3 items-center">

        <div className="hover:bg-red-400 text-white px-1 py-1 rounded-sm" onClick={ev => {

          var upsells = currentObject.upsells;
          upsells.splice(index, 1);
          setcurrentObject({ ...currentObject, upsells: upsells });

        }}><IconTrash /></div>
        <div>{text}</div>
      </div>
    )

  }

  function onPickRelatedProducts(item) {


    var relatedProducts = currentObject?.relatedProducts ? currentObject.relatedProducts : {};
    relatedProducts.push({ id: item.id, title: item.title })

    setcurrentObject({ ...currentObject, relatedProducts: relatedProducts });


  }
  function onPickVariations(item) {

    var variations = currentObject?.variations ? currentObject.variations : {};
    variations.push({ id: item.id, title: item.title })

    setcurrentObject({ ...currentObject, variations: variations });


  }
  function onPickUpsells(item) {




    var upsells = currentObject?.upsells ? currentObject.upsells : {};
    upsells.push({ id: item.id, title: item.title })

    setcurrentObject({ ...currentObject, upsells: upsells });


  }
  function onPickCrosssells(item) {



    var crosssells = currentObject?.crosssells ? currentObject.crosssells : {};
    crosssells.push({ id: item.id, title: item.title })

    setcurrentObject({ ...currentObject, crosssells: crosssells });


  }
  function onPickDownloads(item) {



    var downloads = currentObject?.downloads ? currentObject.downloads : {};
    downloads.push({ id: item.id, title: item.title })

    setcurrentObject({ ...currentObject, downloads: downloads });


  }
  function onPickGallery(item) {

    var gallery = currentObject?.gallery ? currentObject.gallery : {};
    gallery.push({ id: item.id, title: item.title, src: item.src })

    setcurrentObject({ ...currentObject, gallery: gallery });


  }
  function onPickFeaturedImage(item) {


    var post_thumbnail = { id: item.id, title: item.title, src: item.src }

    setcurrentObject({ ...currentObject, post_thumbnail: post_thumbnail });



  }


  function toSlug(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')  // Remove non-alphanumeric chars
      .replace(/\s+/g, '-')          // Replace spaces with -
      .replace(/-+/g, '-');          // Replace multiple - with single -
  }

  function onPickCategories(item) {

    var itemX = { ...item }

    if (itemX.children) {
      delete itemX.children;
    }




    var categories = currentObject.categories;
    // const exists = categories.includes(itemX.term_id);  // true
    const exists = categories.some(loopItem => loopItem.term_id === itemX.term_id);



    if (exists) {

      // const categoriesX = categories.filter(term => term !== itemX.term_id);
      const categoriesX = categories.filter(loopItem => loopItem.term_id !== itemX.term_id);



      setcurrentObject({ ...currentObject, categories: categoriesX });


    } else {



      categories.push({ "term_id": itemX?.term_id, "name": itemX?.name, "slug": itemX?.slug, })
      setcurrentObject({ ...currentObject, categories: categories });

    }
  }


  function onPickVisibility(item) {

    var itemX = { ...item }

    if (itemX.children) {
      delete itemX.children;
    }

    var visibility = currentObject.visibility;




    // const exists = visibility.includes(itemX.term_id);  // true
    const exists = visibility.some(loopItem => loopItem.term_id === itemX.term_id);



    if (exists) {

      // const visibilityX = visibility.filter(term => term !== itemX.term_id);
      const visibilityX = visibility.filter(loopItem => loopItem.term_id !== itemX.term_id);



      setcurrentObject({ ...currentObject, visibility: visibilityX });


    } else {



      visibility.push({ "term_id": itemX?.term_id, "name": itemX?.name, "slug": itemX?.slug, })
      setcurrentObject({ ...currentObject, visibility: visibility });

    }
  }




  function onPickTags(item) {




    var tags = currentObject?.tags;



    // const exists = tags.includes(item.term_id);  // true
    const exists = tags?.some(term => term.term_id === item.term_id);

    if (exists) {
      const tagsX = tags.filter(term => term !== item.term_id);
      setcurrentObject({ ...currentObject, tags: tagsX });
    } else {
      tags.push({ "term_id": item.term_id, "name": item.name })
      setcurrentObject({ ...currentObject, tags: tags });
    }



  }
  function onPickBrands(item) {




    var brands = currentObject?.brands;



    // const exists = brands.includes(item.term_id);  // true
    const exists = brands?.some(term => term.term_id === item.term_id);

    if (exists) {
      const brandsX = brands.filter(term => term !== item.term_id);
      setcurrentObject({ ...currentObject, brands: brandsX });
    } else {
      brands.push({ "term_id": item.term_id, "name": item.name })
      setcurrentObject({ ...currentObject, brands: brands });
    }



  }





  return (
    <div>

      <div className="flex-1 my-10">

        <div className="flex gap-5 justify-center">

          <div className="flex flex-col gap-4 w-[800px]">

            <div className="bg-white  rounded-sm px-5 py-3 flex justify-between items-center">
              <div>
                {loading && (
                  <div className="flex gap-2 text-amber-600">
                    <div className="animate-spin"><IconFidgetSpinner /> </div>
                    <div>Please wait...</div>

                  </div>
                )}
                {!loading && (
                  <div className="flex gap-2 justify-between items-center">

                    <div className="text-bold">Edit:</div> <div>{currentObject?.title}</div>

                  </div>
                )}

              </div>
              <Link className="flex gap-2 !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm text-gray-600" href={`${storeUrl}/product/${currentObject?.slug}`}>
                <IconExternalLink /> View
              </Link>
            </div>


            {/* {JSON.stringify(currentObject?.addons)} */}

            <div className="bg-white  rounded-sm ">

              <div className="px-5 py-3 text-xl border-b border-solid border-gray-300">General Info</div>

              <div className="p-4 flex flex-col  gap-4">

                <div className="flex flex-col gap-3 ">
                  <label htmlFor="" className="block text-gray-500">
                    {("Title")}
                  </label>
                  <input
                    type="text"
                    className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm w-full bg-white"
                    value={currentObject?.title}
                    onChange={(ev) => {
                      var value = ev.target.value;
                      var slug = toSlug(value);

                      setcurrentObject({ ...currentObject, title: value, slug: slug });
                    }}
                  />
                </div>




                <div className="flex flex-col gap-3">
                  <label htmlFor="" className="block text-gray-500">
                    {("Content")}
                  </label>
                  <textarea
                    type="text"
                    className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm w-full bg-white"
                    value={currentObject?.post_content}
                    onChange={(ev) => {
                      var value = ev.target.value;
                      setcurrentObject({ ...currentObject, post_content: value });
                    }}
                  />
                </div>








                <div className="flex flex-col gap-3">
                  <label htmlFor="" className="block text-gray-500">
                    {("SKU")}
                  </label>
                  <input
                    type="text"
                    className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm w-full bg-white"
                    value={currentObject?.sku}
                    onChange={(ev) => {
                      var value = ev.target.value;
                      setcurrentObject({ ...currentObject, sku: value });


                    }}
                  />
                </div>

              </div>
            </div>



            {/* 
               <div className="flex gap-3 items-center">
                 <label htmlFor="" className="block text-gray-500">
                   {("Product Type?")}
                 </label>
     
                 <select name="" id="" className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm  bg-white " onChange={ev => {
     
                   var value = ev.target.value;
                   setcurrentObject({ ...currentObject, type: value });
     
     
                 }}>
     
                   <option value="physical">Physical</option>
                   <option value="digital">Digital</option>
     
                 </select>
     
               </div> */}

            <div className="bg-white  rounded-sm flex flex-col gap-4">
              <div className="px-5 py-3 text-xl border-b border-solid border-gray-300">Pricing</div>

              <div className="p-4 flex flex-col  gap-4">
                <div className="flex flex-col gap-3">
                  <label htmlFor="" className="block text-gray-500">
                    {("Pricing Type?")}
                  </label>

                  <select name="" id="" className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm w-full bg-white mb-5"
                    value={currentObject?.priceType}
                    onChange={ev => {

                      var value = ev.target.value;

                      setcurrentObject({ ...currentObject, priceType: value });


                    }}>

                    <option value="simple">Simple</option>
                    <option value="variable">Variable</option>
                    {/* <option value="bulk">Bulk</option> */}
                    <option value="pwyw">Pay what you want</option>
                    <option value="bargain">Bargain Price</option>
                    {/* <option value="subscription">Subscription</option>
                       <option value="pwyw">Pay what you want</option> */}

                  </select>

                </div>

                {currentObject?.priceType == 'variable' && (
                  <div className="">

                    <div className='flex justify-between'>
                      <div className=' hover:bg-gray-400 rounded-sm cursor-pointer px-4 py-2 bg-gray-600 text-white' onClick={ev => {

                        var variablePricesX = currentObject.variablePrices ? [...currentObject.variablePrices] : [];

                        variablePricesX.push({ label: '', regularPrice: 0 })
                        setcurrentObject({ ...currentObject, variablePrices: variablePricesX });

                      }}>Add</div>
                    </div>

                    <div className='gap-3 my-4'>

                      {currentObject?.variablePrices?.map((item, index) => {

                        return (
                          <div className='flex gap-3 my-4 items-center'>
                            <div className=" hover:bg-red-400 rounded-sm cursor-pointer px-2 py-2 bg-red-300 text-white" onClick={ev => {
                              var variablePricesX = currentObject.variablePrices ? [...currentObject.variablePrices] : [];


                              variablePricesX.splice(index, 1);
                              setcurrentObject({ ...currentObject, variablePrices: variablePricesX });

                            }}>
                              <IconX />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label htmlFor="" className="block text-gray-500">
                                {("Label?")}
                              </label>
                              <input
                                type="text"
                                className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm w-full bg-white"
                                value={item?.label}
                                onChange={(ev) => {
                                  var variablePricesX = currentObject.variablePrices ? [...currentObject.variablePrices] : [];

                                  var value = ev.target.value;

                                  variablePricesX[index].label = value
                                  setcurrentObject({ ...currentObject, variablePrices: variablePricesX });

                                }}
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label htmlFor="" className="block text-gray-500">
                                {("SKU?")}
                              </label>
                              <input
                                type="text"
                                className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm w-full bg-white"
                                value={item?.sku}
                                onChange={(ev) => {
                                  var variablePricesX = currentObject.variablePrices ? [...currentObject.variablePrices] : [];

                                  var value = ev.target.value;

                                  variablePricesX[index].sku = value
                                  setcurrentObject({ ...currentObject, variablePrices: variablePricesX });

                                }}
                              />
                            </div>








                            <div className="flex flex-col gap-1">
                              <label htmlFor="" className="block text-gray-500">
                                {("Price?")}
                              </label>
                              <input
                                type="text"
                                className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm w-full bg-white"
                                value={item?.regularPrice}
                                onChange={(ev) => {
                                  var variablePricesX = currentObject.variablePrices ? [...currentObject.variablePrices] : [];
                                  var value = ev.target.value;
                                  variablePricesX[index].regularPrice = value
                                  setcurrentObject({ ...currentObject, variablePrices: variablePricesX });

                                }}
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label htmlFor="" className="block text-gray-500">
                                {("Sale Price?")}
                              </label>
                              <input
                                type="text"
                                className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm w-full bg-white"
                                value={item?.salePrice}
                                onChange={(ev) => {
                                  var variablePricesX = currentObject.variablePrices ? [...currentObject.variablePrices] : [];
                                  var value = ev.target.value;
                                  variablePricesX[index].salePrice = value
                                  setcurrentObject({ ...currentObject, variablePrices: variablePricesX });

                                }}
                              />
                            </div>













                          </div>
                        )

                      })}
                    </div>





                  </div>

                )}
                {(currentObject?.priceType == 'simple' || currentObject?.priceType?.length == 0) && (
                  <div className="flex gap-5">
                    <div className="flex flex-col gap-3">
                      <label htmlFor="" className="block text-gray-500">
                        {("Regular Price?")}
                      </label>
                      <input
                        type="text"
                        className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm w-full bg-white"
                        value={currentObject?.regularPrice}
                        onChange={(ev) => {
                          var value = ev.target.value;
                          setcurrentObject({ ...currentObject, regularPrice: value });
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label htmlFor="" className="block text-gray-500">
                        {("Discount Price?")}
                      </label>
                      <input
                        type="text"
                        className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm w-full bg-white"
                        value={currentObject?.salePrice}
                        onChange={(ev) => {
                          var value = ev.target.value;
                          setcurrentObject({ ...currentObject, salePrice: value });

                        }}
                      />
                    </div>


                  </div>

                )}
                {currentObject?.priceType == 'pwyw' && (
                  <div className="flex gap-5">
                    <div className="flex flex-col gap-3">
                      <label htmlFor="" className="block text-gray-500">
                        {("Min Price?")}
                      </label>
                      <input
                        type="text"
                        className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm w-full bg-white"
                        value={currentObject?.pwywMinPrice}
                        onChange={(ev) => {
                          var value = ev.target.value;
                          setcurrentObject({ ...currentObject, pwywMinPrice: value });

                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label htmlFor="" className="block text-gray-500">
                        {("Default Price?")}
                      </label>
                      <input
                        type="text"
                        className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm w-full bg-white"
                        value={currentObject?.pwywDefaultPrice}
                        onChange={(ev) => {
                          var value = ev.target.value;
                          setcurrentObject({ ...currentObject, pwywDefaultPrice: value });
                        }}
                      />
                    </div>

                  </div>

                )}
                {currentObject?.priceType == 'bargain' && (
                  <div className="flex gap-5">
                    <div className="flex flex-col gap-3">
                      <label htmlFor="" className="block text-gray-500">
                        {("Min Price?")}
                      </label>
                      <input
                        type="text"
                        className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm w-full bg-white"
                        value={currentObject?.bargainMinPrice}
                        onChange={(ev) => {
                          var value = ev.target.value;
                          setcurrentObject({ ...currentObject, bargainMinPrice: value });

                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label htmlFor="" className="block text-gray-500">
                        {("Default Price?")}
                      </label>
                      <input
                        type="text"
                        className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm w-full bg-white"
                        value={currentObject?.bargainDefaultPrice}
                        onChange={(ev) => {
                          var value = ev.target.value;
                          setcurrentObject({ ...currentObject, bargainDefaultPrice: value });
                        }}
                      />
                    </div>

                  </div>

                )}




              </div>


            </div>
            <div className="bg-white  rounded-sm flex flex-col gap-4">
              <div className="px-5 py-3 text-xl border-b border-solid border-gray-300">Bulk Prices</div>

              <div className="p-4 flex flex-col  gap-4">



                <div className="">

                  <div className='flex justify-between'>
                    <div className=' hover:bg-gray-400 rounded-sm cursor-pointer px-4 py-2 bg-gray-600 text-white' onClick={ev => {

                      var bulkPricesX = currentObject.bulkPrices ? [...currentObject.bulkPrices] : [];

                      bulkPricesX.push({ quantity: 1, unitPrice: 0 })
                      setcurrentObject({ ...currentObject, bulkPrices: bulkPricesX });

                    }}>Add</div>
                  </div>

                  <div className='gap-3 my-4'>

                    {currentObject?.bulkPrices?.map((item, index) => {

                      return (
                        <div className='flex gap-3 my-4 items-center'>
                          <div className=" hover:bg-red-400 rounded-sm cursor-pointer px-2 py-2 bg-red-300 text-white" onClick={ev => {
                            var bulkPricesX = currentObject.bulkPrices ? [...currentObject.bulkPrices] : [];


                            bulkPricesX.splice(index, 1);
                            setcurrentObject({ ...currentObject, bulkPrices: bulkPricesX });

                          }}>
                            <IconX />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label htmlFor="" className="block text-gray-500">
                              {("Quantity?")}
                            </label>
                            <input
                              type="text"
                              className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm w-full bg-white"
                              value={item?.quantity}
                              onChange={(ev) => {
                                var bulkPricesX = currentObject.bulkPrices ? [...currentObject.bulkPrices] : [];

                                var value = ev.target.value;

                                bulkPricesX[index].quantity = value
                                setcurrentObject({ ...currentObject, bulkPrices: bulkPricesX });

                              }}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label htmlFor="" className="block text-gray-500">
                              {("Unit Price?")}
                            </label>
                            <input
                              type="text"
                              className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm w-full bg-white"
                              value={item?.unitPrice}
                              onChange={(ev) => {
                                var bulkPricesX = currentObject.bulkPrices ? [...currentObject.bulkPrices] : [];

                                var value = ev.target.value;

                                bulkPricesX[index].unitPrice = value
                                setcurrentObject({ ...currentObject, bulkPrices: bulkPricesX });

                              }}
                            />
                          </div>




                        </div>
                      )

                    })}
                  </div>





                </div>






              </div>


            </div>






            {currentObject?.addons?.includes('manageStock') && (
              <>
                <div className="bg-white  rounded-sm flex flex-col gap-4">
                  <div className="px-5 py-3 text-xl border-b border-solid border-gray-300">Stock Management</div>



                  <div className="p-4 flex flex-col gap-3 ">

                    <div className="flex flex-col gap-3">
                      <label htmlFor="" className="block text-gray-500">
                        {("Stock Status?")}
                      </label>

                      <div className="flex gap-2 cursor-pointer">

                        <label htmlFor="stockStatusInstock" className="flex gap-2 cursor-pointer">

                          <input
                            id="stockStatusInstock"
                            type="radio"
                            className=""
                            checked={currentObject?.stockStatus == 'instock' ? true : false}
                            onChange={(ev) => {

                              setcurrentObject({ ...currentObject, stockStatus: "instock" });


                            }}
                          />
                          <span>In Stock</span>
                        </label>

                        <label htmlFor="stockStatusOutstock" className="flex gap-2 cursor-pointer">

                          <input
                            id="stockStatusOutstock"
                            type="radio"
                            className=""
                            checked={currentObject?.stockStatus == 'outofstock' ? true : false}
                            onChange={(ev) => {
                              setcurrentObject({ ...currentObject, stockStatus: "outofstock" });

                            }}
                          />
                          <span>Out of Stock</span>
                        </label>

                      </div>


                    </div>

                    {currentObject?.stockStatus == 'instock' && (
                      <div className="flex flex-col gap-3">
                        <label htmlFor="" className="block text-gray-500">
                          {("Stock Count?")}
                        </label>
                        <input
                          type="number"
                          className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm w-full bg-white"
                          value={currentObject?.stockCount}
                          onChange={(ev) => {
                            var value = ev.target.value;

                            setcurrentObject({ ...currentObject, stockCount: value });


                          }}
                        />
                      </div>
                    )}




                  </div>
                </div>
              </>

            )}

            {currentObject?.addons?.includes('gallery') && (
              <>
                <div className="bg-white  rounded-sm flex flex-col gap-4">
                  <div className="px-5 py-3 text-xl border-b border-solid border-gray-300">Gallery</div>



                  <div className="p-4 ">


                    <div className="flex justify-between">
                      <div></div>
                      <div>
                        <GalleryPicker popupClass="right-0 bottom-full" onPick={onPickGallery} />
                      </div>

                    </div>

                    {currentObject?.gallery && (

                      <div className="grid grid-cols-4 gap-3 my-4" >
                        {currentObject?.gallery?.map((item, index) => {

                          return (
                            <div className="relative  border-2 border-solid border-gray-400">



                              <div className="flex flex-col gap-3">
                                <div className="absolute top-1 right-1 bg-red-400 text-white px-1 py-1 rounded-sm cursor-pointer" onClick={ev => {

                                  var gallery = currentObject?.gallery ? currentObject?.gallery : {};
                                  gallery.splice(index, 1);

                                  setcurrentObject({ ...currentObject, gallery: gallery });


                                }}>
                                  <IconTrash />
                                </div>
                                <Image className="w-full" src={item.src} width={40} height={40} alt={``} />

                                <div className="absolute text-sm bottom-0 left-0 w-full bg-gray-300 p-2 text-gray-500">
                                  {item.title}
                                </div>

                              </div>





                            </div>
                          )

                        })}
                      </div>
                    )}


                  </div>



                </div>

              </>
            )}


            {currentObject?.addons?.includes('downloads') && (

              <div className="bg-white  rounded-sm flex flex-col gap-4">
                <div className="px-5 py-3 text-xl border-b border-solid border-gray-300">Downloads</div>


                <div className="p-4 ">


                  <div className="flex justify-between">
                    <div></div>
                    <div>
                      <ProductsPicker onPick={onPickDownloads} />
                    </div>

                  </div>

                  {currentObject?.downloads && (

                    <div className="my-4">
                      {currentObject?.downloads.map((item, index) => {

                        return (
                          <ToggleContent key={index} title={<DownloadsTitle text={item.title} index={index} />}
                            contentClass=""
                            headerClass=""
                            headerTitleClass=""
                            wrapperClass=""
                          >

                            <div className="flex flex-col gap-3">

                              <div className="flex flex-col gap-3">
                                <label htmlFor="" className="block text-gray-500">
                                  {("Title")}
                                </label>
                                <input
                                  type="text"
                                  className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm w-full bg-white"
                                  value={item.title}
                                  onChange={(ev) => {
                                    var value = ev.target.value;

                                    var downloads = currentObject?.downloads ? currentObject?.downloads : {};
                                    downloads[index].title = value

                                    setcurrentObject({ ...currentObject, downloads: downloads });


                                  }}
                                />
                              </div>



                            </div>

                          </ToggleContent>
                        )

                      })}
                    </div>
                  )}


                </div>




              </div>
            )}


            {/* {JSON.stringify(currentObject)} */}

            {currentObject?.addons?.includes('dimensions') && (
              <div className="bg-white rounded-sm flex flex-col gap-4">
                <div className="px-5 py-3 text-xl border-b border-solid border-gray-300">Dimensions</div>


                <div className="p-4 flex  items-center gap-4">

                  <div className="w-1/2">
                    <div className="flex flex-col gap-3">

                      <div className="flex flex-col gap-3">
                        <label htmlFor="" className="block text-gray-500">
                          {("Weight")}
                        </label>
                        <div className="flex items-center gap-2 ">

                          <input
                            type="number"
                            className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm w-full bg-white"
                            value={currentObject?.weight?.value}
                            onChange={(ev) => {
                              var value = parseInt(ev.target.value);


                              var weight = currentObject?.weight ? currentObject?.weight : {};
                              weight.value = value


                              setcurrentObject({ ...currentObject, weight: weight });



                              // setcurrentObject({ ...currentObject, weight: weight });


                            }}
                          />

                          <select name="" id="" className="!shadow-none !border-2 border-gray-400"
                            value={currentObject?.weight?.unit}

                            onChange={(ev) => {
                              var value = ev.target.value;

                              var weight = currentObject?.weight ? currentObject?.weight : {};
                              weight.unit = value


                              setcurrentObject({ ...currentObject, weight: weight });


                            }}>
                            {weightUnits.map(item => {

                              return (
                                <option key={item.value} value={item.value}>{item.label}</option>
                              )
                            })}
                          </select>

                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <label htmlFor="" className="block text-gray-500">
                          {("Length")}
                        </label>
                        <div className="flex items-center gap-2 ">

                          <input
                            type="number"
                            className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm w-full bg-white"
                            value={currentObject?.length?.value}
                            onChange={(ev) => {
                              var value = ev.target.value;


                              var length = currentObject?.length ? currentObject?.length : {};
                              length.value = value

                              setcurrentObject({ ...currentObject, length: length });

                            }}
                          />

                          <select name="" id="" className="!shadow-none !border-2 border-gray-400"
                            value={currentObject?.length?.unit}

                            onChange={(ev) => {
                              var value = ev.target.value;

                              var length = currentObject?.length ? currentObject?.length : {};
                              length.unit = value

                              setcurrentObject({ ...currentObject, length: length });

                            }}>
                            {lengthUnits.map(item => {

                              return (
                                <option key={item.value} value={item.value}>{item.label}</option>
                              )
                            })}
                          </select>

                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <label htmlFor="" className="block text-gray-500">
                          {("Width")}
                        </label>
                        <div className="flex items-center gap-2 ">

                          <input
                            type="number"
                            className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm w-full bg-white"
                            value={currentObject?.width?.value}
                            onChange={(ev) => {
                              var value = ev.target.value;


                              var width = currentObject?.width ? currentObject?.width : {};
                              width.value = value

                              setcurrentObject({ ...currentObject, width: width });


                            }}
                          />

                          <select name="" id="" className="!shadow-none !border-2 border-gray-400"
                            value={currentObject?.width?.unit}

                            onChange={(ev) => {
                              var value = ev.target.value;



                              var width = currentObject?.width ? currentObject?.width : {};
                              width.unit = value

                              setcurrentObject({ ...currentObject, width: width });


                            }}>
                            {lengthUnits.map(item => {

                              return (
                                <option key={item.value} value={item.value}>{item.label}</option>
                              )
                            })}
                          </select>

                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <label htmlFor="" className="block text-gray-500">
                          {("Height")}
                        </label>
                        <div className="flex items-center gap-2 ">

                          <input
                            type="number"
                            className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm w-full bg-white"
                            value={currentObject?.height?.value}
                            onChange={(ev) => {
                              var value = ev.target.value;

                              var height = currentObject?.height ? currentObject?.height : {};
                              height.value = value

                              setcurrentObject({ ...currentObject, height: height });

                            }}
                          />

                          <select name="" id="" className="!shadow-none !border-2 border-gray-400"
                            value={currentObject?.height?.unit}

                            onChange={(ev) => {
                              var value = ev.target.value;

                              var height = currentObject?.height ? currentObject?.height : {};
                              height.unit = value

                              setcurrentObject({ ...currentObject, height: height });


                            }}>
                            {lengthUnits.map(item => {

                              return (
                                <option key={item.value} value={item.value}>{item.label}</option>
                              )
                            })}
                          </select>

                        </div>
                      </div>









                    </div>

                  </div>
                  <div className="w-1/2 text-center">


                    <Image className="w-48 mx-auto " src="/box.png" width={200} height={200} alt={``} />
                  </div>


                </div>


              </div>
            )}

            {currentObject?.addons?.includes('upsellsCrosssells') && (
              <>
                <div className="bg-white rounded-sm flex flex-col gap-4">
                  <div className="px-5 py-3 text-xl border-b border-solid border-gray-300">Upsells & Cross-sells</div>

                  <div className="flex flex-col  gap-4">

                    <div className="p-4 ">


                      <div className="flex justify-between">
                        <div>Upsells</div>
                        <div>
                          <ProductsPicker onPick={onPickUpsells} />
                        </div>

                      </div>

                      {currentObject?.upsells && (

                        <div className="my-4">
                          {currentObject?.upsells.map((item, index) => {

                            return (
                              <ToggleContent key={index} title={<UpsellsProductsTitle text={item.title} index={index} />}
                                contentClass=""
                                headerClass=""
                                headerTitleClass=""
                                wrapperClass=""
                              >

                                <div className="flex flex-col gap-3">

                                  <div className="flex flex-col gap-3">
                                    <label htmlFor="" className="block text-gray-500">
                                      {("Title")}
                                    </label>
                                    <input
                                      type="text"
                                      className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm w-full bg-white"
                                      value={item.title}
                                      onChange={(ev) => {
                                        var value = ev.target.value;


                                        var upsells = currentObject?.upsells ? currentObject?.upsells : {};
                                        upsells[index].title = value

                                        setcurrentObject({ ...currentObject, upsells: upsells });


                                      }}
                                    />
                                  </div>



                                </div>

                              </ToggleContent>
                            )

                          })}
                        </div>
                      )}


                    </div>
                    <div className="p-4 ">


                      <div className="flex justify-between">
                        <div>Crosssells</div>
                        <div>
                          <ProductsPicker onPick={onPickCrosssells} />
                        </div>

                      </div>

                      {currentObject?.crosssells && (

                        <div className="my-4">
                          {currentObject?.crosssells.map((item, index) => {

                            return (
                              <ToggleContent key={index} title={<CrosssellsProductsTitle text={item.title} index={index} />}
                                contentClass=""
                                headerClass=""
                                headerTitleClass=""
                                wrapperClass=""
                              >

                                <div className="flex flex-col gap-3">

                                  <div className="flex flex-col gap-3">
                                    <label htmlFor="" className="block text-gray-500">
                                      {("Title")}
                                    </label>
                                    <input
                                      type="text"
                                      className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm w-full bg-white"
                                      value={item.title}
                                      onChange={(ev) => {
                                        var value = ev.target.value;


                                        var crosssells = currentObject?.crosssells ? currentObject?.crosssells : {};
                                        crosssells[index].title = value

                                        setcurrentObject({ ...currentObject, crosssells: crosssells });


                                      }}
                                    />
                                  </div>



                                </div>

                              </ToggleContent>
                            )

                          })}
                        </div>
                      )}


                    </div>




                  </div>


                </div>
              </>
            )}


            {currentObject?.addons?.includes('faq') && (
              <div className="bg-white rounded-sm flex flex-col gap-4">
                <div className="px-5 py-3 text-xl border-b border-solid border-gray-300">FAQ</div>

                <div className="p-4 ">


                  <div className="flex">
                    <div className="p-2 hover:bg-gray-400 rounded-sm cursor-pointer px-4 bg-gray-600 text-white"

                      onClick={ev => {


                        var faq = currentObject?.faq ? currentObject?.faq : {};
                        faq.push({ title: "Test Title", content: "Text Content" })

                        setcurrentObject({ ...currentObject, faq: faq });







                      }}
                    >Add</div>
                  </div>

                  {currentObject?.faq && (

                    <div className="my-4">
                      {currentObject?.faq.map((item, index) => {

                        return (
                          <ToggleContent key={index} title={<FAQTitle text={item.title} index={index} />}
                            contentClass=""
                            headerClass=""
                            headerTitleClass=""
                            wrapperClass=""
                          >

                            <div className="flex flex-col gap-3">

                              <div className="flex flex-col gap-3">
                                <label htmlFor="" className="block text-gray-500">
                                  {("Title")}
                                </label>
                                <input
                                  type="text"
                                  className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm w-full bg-white"
                                  value={item.title}
                                  onChange={(ev) => {
                                    var value = ev.target.value;


                                    var faq = currentObject?.faq ? currentObject?.faq : {};
                                    faq[index].title = value

                                    setcurrentObject({ ...currentObject, faq: faq });




                                  }}
                                />
                              </div>

                              <div className="flex flex-col gap-3">
                                <label htmlFor="" className="block text-gray-500">
                                  {("Content")}
                                </label>
                                <textarea
                                  type="text"
                                  className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm w-full bg-white"
                                  value={item?.content}
                                  onChange={(ev) => {
                                    var value = ev.target.value;


                                    var faq = currentObject?.faq ? currentObject?.faq : {};
                                    faq[index].content = value

                                    setcurrentObject({ ...currentObject, faq: faq });








                                  }}
                                />
                              </div>

                            </div>

                          </ToggleContent>
                        )

                      })}
                    </div>
                  )}


                </div>


              </div>
            )}




            {currentObject?.addons?.includes('relatedProducts') && (
              <div className="bg-white rounded-sm flex flex-col gap-4">
                <div className="px-5 py-3 text-xl border-b border-solid border-gray-300">Related Products</div>

                <div className="p-4 ">


                  <div className="flex justify-between">
                    <div></div>
                    <div>
                      <ProductsPicker onPick={onPickRelatedProducts} />
                    </div>

                  </div>

                  {currentObject?.relatedProducts && (

                    <div className="my-4">
                      {currentObject?.relatedProducts.map((item, index) => {

                        return (
                          <ToggleContent key={index} title={<RelatedProductsTitle text={item.title} index={index} />}
                            contentClass=""
                            headerClass=""
                            headerTitleClass=""
                            wrapperClass=""
                          >

                            <div className="flex flex-col gap-3">

                              <div className="flex flex-col gap-3">
                                <label htmlFor="" className="block text-gray-500">
                                  {("Title")}
                                </label>
                                <input
                                  type="text"
                                  className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm w-full bg-white"
                                  value={item.title}
                                  onChange={(ev) => {
                                    var value = ev.target.value;



                                    var relatedProducts = currentObject?.relatedProducts ? currentObject?.relatedProducts : {};
                                    relatedProducts[index].title = value

                                    setcurrentObject({ ...currentObject, relatedProducts: relatedProducts });





                                  }}
                                />
                              </div>



                            </div>

                          </ToggleContent>
                        )

                      })}
                    </div>
                  )}


                </div>


              </div>
            )}
            {currentObject?.addons?.includes('variations') && (
              <div className="bg-white rounded-sm flex flex-col gap-4">
                <div className="px-5 py-3 text-xl border-b border-solid border-gray-300">Products Variations</div>

                <div className="p-4 ">

                  <div className="flex justify-between">



                    <div></div>
                    <div>
                      <ProductsPicker onPick={onPickVariations} />
                    </div>

                  </div>

                  {currentObject?.variations && (

                    <div className="my-4">
                      {currentObject?.variations.map((item, index) => {

                        return (
                          <ToggleContent key={index} title={<VariationsProductsTitle text={item.title} index={index} />}
                            contentClass=""
                            headerClass=""
                            headerTitleClass=""
                            wrapperClass=""
                          >

                            <div className="flex flex-col gap-3">

                              <div className="flex flex-col gap-3">
                                <label htmlFor="" className="block text-gray-500">
                                  {("Title")}
                                </label>
                                <input
                                  type="text"
                                  className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm w-full bg-white"
                                  value={item.title}
                                  onChange={(ev) => {
                                    var value = ev.target.value;


                                    var variations = currentObject?.variations ? currentObject?.variations : {};

                                    variations[index].title = value

                                    setcurrentObject({ ...currentObject, variations: variations });









                                  }}
                                />
                              </div>



                            </div>

                          </ToggleContent>
                        )

                      })}
                    </div>
                  )}


                </div>


              </div>
            )}



          </div>

          <div className=" rounded-sm px-3 w-[400px]">

            <div className="flex flex-col gap-4">

              <div className="bg-white  rounded-sm px-5 py-3 flex justify-between items-center">

                <div className="p-2 hover:bg-gray-400 rounded-sm cursor-pointer px-4 bg-gray-600 text-white"
                  onClick={ev => {
                    update_product()
                  }}
                >Update</div>
              </div>


              <div className="bg-white  rounded-sm ">

                <div className="px-5 py-3 text-xl border-b border-solid border-gray-300">Publish</div>

                <div className="p-4 flex flex-col text-sm gap-4">

                  <div className="flex justify-between items-center gap-3">
                    <label htmlFor="" className="block text-gray-500">
                      {("Featured?")}
                    </label>

                    <div>

                      <div onClick={ev => {
                        var featured = !currentObject?.featured;


                        setcurrentObject({ ...currentObject, featured: featured });



                      }} className="p-2 hover:bg-gray-400 rounded-sm cursor-pointer px-2 bg-gray-600 text-white">

                        {currentObject?.featured && (
                          <><IconStarFilled /></>
                        )}
                        {!currentObject?.featured && (
                          <><IconStar /></>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* {JSON.stringify(currentObject?.postStatus)} */}


                  <div className="flex justify-between items-center gap-3">
                    <label htmlFor="status" className=" text-gray-500">
                      {("Status")}
                    </label>

                    <select name="status" id="" className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm  bg-white " onChange={ev => {

                      var value = ev.target.value;
                      setcurrentObject({ ...currentObject, postStatus: value });


                    }}>

                      <option value="publish" >Publish</option>
                      <option value="draft" >Draft</option>
                      <option value="pending" >Pending</option>
                      {/* <option value="subscription">Subscription</option>
                       <option value="pwyw">Pay what you want</option> */}

                    </select>

                  </div>

                  <div className="flex justify-between gap-3 ">
                    <label htmlFor="" className="block text-gray-500">
                      {("Slug")}
                    </label>
                    <input
                      type="text"
                      className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm  bg-white"
                      value={currentObject?.slug}
                      onChange={(ev) => {
                        var value = ev.target.value;
                        setcurrentObject({ ...currentObject, slug: value });
                      }}
                    />
                  </div>
                  <div className="flex justify-between gap-3 ">
                    <label htmlFor="" className="block text-gray-500">
                      {("Menu order")}
                    </label>
                    <input
                      type="number"
                      className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm  bg-white w-24"
                      value={currentObject?.menuOrder}
                      onChange={(ev) => {
                        var value = ev.target.value;
                        setcurrentObject({ ...currentObject, menuOrder: value });
                      }}
                    />
                  </div>







                  <div className="flex flex-col gap-3">
                    <label htmlFor="" className="block text-gray-500">
                      {("Short Description")}
                    </label>
                    <textarea
                      type="text"
                      className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm w-full bg-white"
                      value={currentObject?.post_excerpt}
                      onChange={(ev) => {
                        var value = ev.target.value;
                        setcurrentObject({ ...currentObject, post_excerpt: value });
                      }}
                    />
                  </div>


                  <div className="flex flex-col gap-3">
                    <label htmlFor="" className="block text-gray-500">
                      {("Trade Price")}
                    </label>
                    <input
                      type="number"
                      className="!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm w-full bg-white"
                      value={currentObject?.tradePrice}
                      onChange={(ev) => {
                        var value = ev.target.value;
                        setcurrentObject({ ...currentObject, tradePrice: value });


                      }}
                    />
                  </div>






                </div>
              </div>
              <div className="bg-white  rounded-sm ">


                <div className="px-5 py-3  border-b border-solid border-gray-300 flex justify-between">
                  <span className="text-xl">Featured Image</span>

                  <span className=" hover:bg-red-400 rounded-sm cursor-pointer px-2 py-2 bg-red-300 text-white" onClick={ev => {
                    setcurrentObject({ ...currentObject, post_thumbnail: {} });


                  }}><IconTrash /></span>
                </div>

                <div className="p-4 flex flex-col  gap-4">



                  <div>
                    <GalleryPicker popupClass="right-full top-0" onPick={onPickFeaturedImage} />

                  </div>
                  {currentObject?.post_thumbnail?.src && (
                    <div className="border border-solid border-gray-400 rounded-sm overflow-hidden">
                      <Image src={currentObject?.post_thumbnail?.src} width={400} height={400} alt={``} />
                    </div>
                  )}

                </div>

                <div className='flex flex-col gap-3 p-4'>

                  <div className="text-base">Set Thumbnail from URL</div>

                  <input type="text" className='!shadow-none !border-2 border-gray-400 border-solid px-2 py-1 rounded-sm w-full bg-white' value={thumbUrl?.url} onChange={ev => {

                    var value = ev.target.value;

                    setthumbUrl({ ...thumbUrl, url: value })

                  }} />

                  <div className='flex gap-2 items-center hover:bg-gray-400 rounded-sm cursor-pointer px-4 py-2 bg-gray-600 text-white' onClick={ev => {
                    setThumbnailFromUrl()

                  }}>

                    Upload
                    {loading && (
                      <Spinner />
                    )}
                  </div>

                </div>


              </div>

              {currentObject?.addons?.includes('categories') && (
                <div className="bg-white  rounded-sm ">

                  <div className="px-5 py-3  border-b border-solid border-gray-300 flex justify-between">
                    <span className="text-xl">Categories</span>

                    <span className="hover:bg-red-400 rounded-sm cursor-pointer px-2 py-2 bg-red-300 text-white" onClick={ev => {
                      setcurrentObject({ ...currentObject, categories: {} });


                    }}><IconTrash /></span>
                  </div>

                  <div className="p-4 flex flex-col  gap-4">

                    <TermsPicker taxonomy="product_cat" selected={currentObject?.categories} onPick={onPickCategories} />


                  </div>
                </div>
              )}


              {currentObject?.addons?.includes('visibility') && (
                <div className="bg-white  rounded-sm ">

                  <div className="px-5 py-3  border-b border-solid border-gray-300 flex justify-between">
                    <span className="text-xl">Visibility</span>

                    <span className="hover:bg-red-400 rounded-sm cursor-pointer px-2 py-2 bg-red-300 text-white" onClick={ev => {
                      setcurrentObject({ ...currentObject, visibility: {} });


                    }}><IconTrash /></span>
                  </div>

                  <div className="p-4 flex flex-col  gap-4">

                    <TermsPicker taxonomy="product_visibility" selected={currentObject?.visibility} onPick={onPickVisibility} />


                  </div>
                </div>
              )}







              {currentObject?.addons?.includes('tags') && (
                <div className="bg-white  rounded-sm ">

                  <div className="px-5 py-3  border-b border-solid border-gray-300 flex justify-between">
                    <span className="text-xl">Tags</span>

                    <span className="hover:bg-red-400 rounded-sm cursor-pointer px-2 py-2 bg-red-300 text-white" onClick={ev => {
                      setcurrentObject({ ...currentObject, tags: {} });


                    }}><IconTrash /></span>
                  </div>

                  <div className="p-4 flex flex-col  gap-4">


                    <div className="my-3">

                      <div className="flex gap-2 items-center flex-wrap ">
                        {currentObject?.tags?.map((item, index) => {

                          return (
                            <div key={index} className="text-sm flex items-center gap-2 !shadow-none !border-2 border-gray-400 border-solid  pl-2 rounded-sm cursor-pointer hover:bg-gray-400 hover:text-white text-gray-500">
                              <div>{item.name}</div>
                              <div className="hover:bg-red-400 px-1 py-1 rounded-sm" onClick={ev => {
                                var tags = currentObject.tags;
                                tags.splice(index, 1);

                                setcurrentObject({ ...currentObject, tags: tags });

                              }}><IconTrash /></div>
                            </div>
                          )
                        })}
                      </div>


                    </div>

                    <TagsPicker taxonomy="product_tag" selected={currentObject?.tags} onPick={onPickTags} />


                  </div>
                </div>
              )}
              {currentObject?.addons?.includes('brands') && (
                <div className="bg-white  rounded-sm ">

                  <div className="px-5 py-3  border-b border-solid border-gray-300 flex justify-between">
                    <span className="text-xl">Brands</span>

                    <span className="hover:bg-red-400 rounded-sm cursor-pointer px-2 py-2 bg-red-300 text-white" onClick={ev => {
                      setcurrentObject({ ...currentObject, brands: {} });


                    }}><IconTrash /></span>
                  </div>

                  <div className="p-4 flex flex-col  gap-4">


                    <div className="my-3">

                      <div className="flex gap-2 items-center flex-wrap ">
                        {currentObject?.brands?.map((item, index) => {

                          return (
                            <div key={index} className="text-sm flex items-center gap-2 !shadow-none !border-2 border-gray-400 border-solid  pl-2 rounded-sm cursor-pointer hover:bg-gray-400 hover:text-white text-gray-500">
                              <div>{item.name}</div>
                              <div className="hover:bg-red-400 px-1 py-1 rounded-sm" onClick={ev => {
                                var brands = currentObject.brands;
                                brands.splice(index, 1);

                                setcurrentObject({ ...currentObject, brands: brands });

                              }}><IconTrash /></div>
                            </div>
                          )
                        })}
                      </div>


                    </div>

                    <TagsPicker taxonomy="product_brand" selected={currentObject?.brands} onPick={onPickBrands} />


                  </div>
                </div>
              )}








              <div className="bg-white  rounded-sm ">

                <div className="px-5 py-3 text-xl border-b border-solid border-gray-300">Addons</div>

                <div className="p-4 flex flex-col  gap-4">


                  <div className="grid grid-cols-2 gap-3 ">

                    {addonsList.map(item => {

                      return (
                        <div key={item?.value} className={`flex gap-2 p-3 !shadow-none !border-2 border-gray-400 border-solid  rounded-sm cursor-pointer ${currentObject?.addons?.includes(item?.value) ? "text-white bg-gray-500" : "text-gray-400"} ${item?.value == 'upsellsCrosssells' ? 'col-span-2' : ""} ${item?.value == 'relatedProducts' ? 'col-span-2' : ""}`} onClick={ev => {


                          var value = item.value

                          var addons = currentObject?.addons ? currentObject?.addons : {};

                          if (addons.includes(value)) {
                            const index = addons.indexOf(value);
                            if (index !== -1) {
                              addons.splice(index, 1);
                            }
                          } else {
                            addons.push(value)
                          }

                          setcurrentObject({ ...currentObject, addons: addons });


                        }}>

                          {currentObject?.addons?.includes(item.value) && (
                            <IconCheckbox />
                          )}
                          {!currentObject?.addons?.includes(item.value) && (

                            <IconSquare />
                          )}




                          <span>{item.label}</span>
                        </div>
                      )

                    })}


                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>


      </div>



    </div>
  )
}

export default page