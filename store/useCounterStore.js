"use client";
// src/store/useCounterStore.js
import { create } from 'zustand'

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;



export const useCounterStore = create((set) => ({
  token: null,
  breakPoint: "Desktop",

  currency: "BDT",
  currencyPosition: "after",
  currencySymbole: "Tk",
  cartItems: [],
  appData: {
    serverUrl: "http://localhost/wp/",
    appUrl: "http://localhost:3000/",
    // serverUrl: "https://server.kidobazar.com/",
    // appUrl: "https://dashboard.kidobazar.com/",


  },
  notifications: [],
  settings: null,
  settingsLoading: false,
  settingsError: null,
  orderStatusArgs: {
    completed: { label: "Completed", value: "completed" },
    delivered: { label: "Delivered", value: "delivered" },
    pending: { label: "Pending", value: "pending" },
    processing: { label: "Processing", value: "processing" },
    hold: { label: "On hold", value: "hold" },
    canceled: { label: "Canceled", value: "canceled" },
    failed: { label: "Failed", value: "failed" },
    refunded: { label: "Refunded", value: "refunded" }
  },
  paymentStatusArgs: {
    paid: { label: 'Paid', value: 'paid' },
    pending: { label: 'Pending', value: 'pending' },
    due: { label: 'Due', value: 'due' },
    refunded: { label: 'Refunded', value: 'refunded' },
    delayed: { label: 'Delayed', value: 'delayed' },
    failed: { label: 'Failed', value: 'failed' },
    partial: { label: 'Partial', value: 'partial' }
  },


  paymentGateways: {
    "cod": {
      "label": "Cash On Delivery",
      "value": "cod",
    },
    // "COD": {
    //   "label": "Cash On Delivery(COD)",
    //   "value": "COD",
    // },
    "bank_transfer": {
      "label": "Bank Transfer",
      "value": "bank_transfer",
    },
    "bkash": {
      "label": "Bkash",
      "value": "bkash",
    },
    "bkashPersonal": {
      "label": "Bkash Personal",
      "value": "bkashPersonal",
    },
    "nagad": {
      "label": "Nagad",
      "value": "nagad",
    },
    "nagadPersonal": {
      "label": "Nagad Personal",
      "value": "nagadPersonal",
    },
    "sslcommerz": {
      "label": "SSLCommerz",
      "value": "sslcommerz",
    },
    "aamarpay": {
      "label": "aamarPay",
      "value": "aamarpay",
    },
  },
  inHousePaymentMethods: {
    "cash": {
      "label": "Cash",
      "value": "cash",
    },
    "bank_transfer": {
      "label": "Bank Transfer",
      "value": "bank_transfer",
    },
    "bkash": {
      "label": "Bkash",
      "value": "bkash",
    },

    "nagad": {
      "label": "Nagad",
      "value": "nagad",
    },
  },



  userDataX: null,
  navToggle: true,
  lang: 'en',
  setToken: (token) => set({ token }),
  clearToken: () => set({ token: null }),
  setlang: () =>
    set((state) => ({
      lang: !state.lang,
    })),

  setnavToggle: () =>
    set((state) => ({
      navToggle: !state.navToggle,
    })),
  addNotification: (newNotification) =>
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((todo) => todo.id !== id),
    })),
  resetNotification: (id) =>
    set((state) => ({
      notifications: [],
    })),
  updateNotification: (id, updatedFields) => set((state) => ({
    notifications: state.notifications.map((todo) =>
      todo.id === id ? { ...todo, ...updatedFields } : todo
    ),
  })),

  //cartItems
  // addCartItems: (newCartItems) =>
  //   set((state) => ({
  //     cartItems: [...state.cartItems, newCartItems],
  //   })),
  addCartItems: (newCartItem) =>
    set((state) => {
      const existingItem = state.cartItems.find(
        (item) => item.id === newCartItem.id
      );

      if (existingItem) {
        // update quantity of existing product
        return {
          cartItems: state.cartItems.map((item) =>
            item.id === newCartItem.id
              ? { ...item, quantity: item.quantity + newCartItem.quantity }
              : item
          ),
        };
      } else {
        // add new product to cart
        return {
          cartItems: [...state.cartItems, newCartItem],
        };
      }
    }),
  removeCartItems: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((todo) => todo.id !== id),
    })),
  resetCartItems: (id) =>
    set((state) => ({
      cartItems: [],
    })),
  updateCartItems: (id, updatedFields) => set((state) => ({
    cartItems: state.cartItems.map((todo) =>
      todo.id === id ? { ...todo, ...updatedFields } : todo
    ),
  })),



  addPropertyDeep: (obj, path, value) => {
    const [head, ...rest] = path;
    return {
      ...obj,
      [head]: rest.length
        ? useCounterStore.getState().addPropertyDeep(obj[head], rest, value)
        : value,
    };
  },




  onAddStyleElement: (sudoScource, key, obj) => {


    const breakPoint = useCounterStore.getState().breakPoint;

    console.log(breakPoint);

    var path = [sudoScource, key, breakPoint];
    let objX = { ...obj };
    const object = useCounterStore.getState().addPropertyDeep(objX, path, "");

    console.log(object);

    return object;

    //setAttributes({ [attributeName]: object });
  },
  onResetElement: (state, sudoSources, obj, attributeName, objSelector, blockCssY) => {

    const { breakPoint } = state;
    let objX = { ...obj }
    Object.entries(sudoSources).map((args) => {
      var sudoScource = args[0];
      if (objX[sudoScource] == undefined) {
      } else {
        objX[sudoScource] = {};
        var elementSelector = state.getElementSelector(state.
          sudoScource,
          objSelector
        );
        var cssObject = state.deletePropertyDeep(state, blockCssY.items, [
          elementSelector,
        ]);
        //setAttributes({ ["blockCssY"]: { items: cssObject } });
      }
    });
    //setAttributes({ [attributeName]: objX });
  },



  onBulkAddStyleElement: (state, sudoScource, cssObj, obj, attributeName, objSelector, blockCssY) => {


    const { breakPoint } = state;
    let objX = { ...obj };
    objX[sudoScource] = cssObj;
    //setAttributes({ [attributeName]: objX });
    var selector = state.getElementSelector(state, sudoScource, objSelector);
    var stylesObj = {};
    Object.entries(cssObj).map((args) => {
      var attr = args[0];
      var cssPropty = state.cssAttrParse(state, attr);
      if (stylesObj[selector] == undefined) {
        stylesObj[selector] = {};
      }
      if (stylesObj[selector][cssPropty] == undefined) {
        stylesObj[selector][cssPropty] = {};
      }
      stylesObj[selector][cssPropty] = args[1];
    });
    var cssItems = { ...blockCssY.items };
    var cssItemsX = { ...cssItems, ...stylesObj };
    //setAttributes({ ["blockCssY"]: { items: cssItemsX } });

    Object.entries(cssItemsX).map((args) => {
      var cssHandle = args[0]
      var cssValues = args[1]
      window.blocksCssArr[cssHandle] = cssValues
    })
  },


  onRemoveStyleElement: (state, sudoScource, key, obj, attributeName, objSelector, blockCssY) => {

    const { breakPoint } = state;
    let objX = { ...obj };
    var object = state.deletePropertyDeep(state, objX, [
      sudoScource,
      key,
      breakPoint,
    ]);
    var isEmpty =
      Object.entries(object[sudoScource][key]).length == 0 ? true : false;
    var objectX = isEmpty
      ? state.deletePropertyDeep(state, object, [sudoScource, key])
      : object;
    //setAttributes({ [attributeName]: objectX });


    var elementSelector = state.getElementSelector(state,
      sudoScource,
      objSelector
    );
    var cssPropty = state.cssAttrParse(state, key);
    var cssObject = state.deletePropertyDeep(state, blockCssY.items, [
      elementSelector,
      cssPropty,
      breakPoint,
    ]);
    var isEmptyX = cssObject[cssPropty] == undefined ? false : true;
    var cssObjectX = isEmptyX ? state.deletePropertyDeep(state, cssObject, [cssPropty]) : cssObject;

    console.log(cssObjectX);


    Object.entries(cssObjectX).map((args) => {
      var cssHandle = args[0]
      var cssValues = args[1]
      window.blocksCssArr[cssHandle] = cssValues
    })

    console.log(window.blocksCssArr);


    //setAttributes({ ["blockCssY"]: { items: cssObjectX } });

  },




  onChangeStyleElement: (state, sudoScource, newVal, attr, obj, attributeName, objSelector, blockCssY, setAttributes) => {

    const { breakPoint } = state;

    var path = [sudoScource, attr, breakPoint];
    let objX = { ...obj };
    const object = state.updatePropertyDeep(state, objX, path, newVal);
    //setAttributes({ [attributeName]: object });

    var elementSelector = state.getElementSelector(state,
      sudoScource,
      objSelector
    );

    //console.log(elementSelector);


    var cssPropty = state.cssAttrParse(state, attr);
    let itemsX = { ...blockCssY.items };
    if (itemsX[elementSelector] == undefined) {
      itemsX[elementSelector] = {};
    }
    var cssPath = [elementSelector, cssPropty, breakPoint];
    const cssItems = state.updatePropertyDeep(state, itemsX, cssPath, newVal);


    Object.entries(cssItems).map((args) => {
      var cssHandle = args[0]
      var cssValues = args[1]
      window.blocksCssArr[cssHandle] = cssValues
    })

    //console.log(window.blocksCssArr);


    //setAttributes({ ["blockCssY"]: { items: cssItems } });

  },




  // ✅ Add these for userDataX
  setUserDataX: (data) => set(() => ({ userDataX: data })),
  resetUserDataX: () => set(() => ({ userDataX: null })),
  updateUserDataX: (partialData) =>
    set((state) => ({
      userData: { ...state.userData, ...partialData },
    })),


  fetchSettings: async () => {
    try {
      set({ settingsLoading: true, settingsError: null });


      const response = await fetch(
        `${serverUrl}wp-json/combo-store/v2/get_settings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.token}`,
          },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch settings");

      const data = await response.json();

      console.log(data);


      set({
        settings: data,
        settingsLoading: false,
      });
    } catch (error) {
      set({
        settingsError: error.message,
        settingsLoading: false,
      });
    }
  },

  setSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),

}))
