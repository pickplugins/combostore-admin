"use client";
import { useState, useEffect, Component } from "react";
import { IconArrowLeft, IconX, IconAlertSquare, IconCheck } from '@tabler/icons-react';



import { useCounterStore } from '../store/useCounterStore'




const ToggleControl = (props) => {


  var multiple = props.multiple
  var value = props.value
  var label = props.label
  var onOptionsChoose = props.onOptionsChoose
  var allowReset = props.allowReset
  var [toggled, setToggled] = useState(false);
  var [options, setOptions] = useState(props.options ? props.options : []);


  useEffect(() => {

    console.log(typeof options);
    // if (typeof options === 'object' && !Array.isArray(options)) {
    //   const optionsArray = Object.values(options);
    //   setOptions(optionsArray)
    // }


  }, [options]);



  return (
    <div className="relative">

      {/* {JSON.stringify(allowReset)} */}


      {/* {JSON.stringify(typeof options)}
      {JSON.stringify(options)}
      {typeof options == 'array' && (
        <>{JSON.stringify(options.find(b => b.value === value))}</>
      )} */}



      <div className="!shadow-none cursor-pointer px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0" onClick={() => setToggled(!toggled)}>

        {(!multiple && value) && (
          <div className="flex gap-2">

            {typeof options == 'object' && (
              <>{options[value]?.label}</>
            )}
            {typeof options == 'array' && (
              <>{options[options.find(b => b.value === value)?.value]?.label}</>
            )}



            {allowReset && (
              <div onClick={ev => {
                onOptionsChoose(null)
              }}>
                <IconX />
              </div>
            )}

          </div>
        )}
        {(!multiple && !value) && (
          <>{label}</>
        )}




      </div>

      {toggled && (
        <div className="absolute z-10 bg-white shadow-sm p-3 top-full left-0 w-fit">

          {typeof options == 'object' && (

            <>
              {Object.entries(options).map((args) => {

                var item = args[1]

                return (
                  <div className="hover:bg-gray-200 p-1 cursor-pointer rounded-sm" key={item.value} onClick={() => {

                    if (multiple) {
                      var newValues = [...value]
                      if (newValues.includes(item.value)) {
                        newValues = newValues.filter(v => v !== item.value)
                      } else {
                        newValues.push(item.value)
                      }
                      onOptionsChoose(newValues)
                    } else {
                      onOptionsChoose(item.value)

                    }

                  }}>{item.label}</div>
                )

              })}
            </>
          )}

          {typeof options == 'array' && (

            <>
              {options.map(item => {

                return (
                  <div className="hover:bg-gray-200 p-1 cursor-pointer rounded-sm" key={item.value} onClick={() => {

                    if (multiple) {
                      var newValues = [...value]
                      if (newValues.includes(item.value)) {
                        newValues = newValues.filter(v => v !== item.value)
                      } else {
                        newValues.push(item.value)
                      }
                      onOptionsChoose(newValues)
                    } else {
                      onOptionsChoose(item.value)

                    }

                  }}>{item.label}</div>
                )

              })}
            </>
          )}


        </div>
      )}




    </div>
  );
};

export default ToggleControl;