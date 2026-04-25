"use client";
import { useState, useEffect, Component } from "react";
import { IconArrowLeft, IconX, IconAlertSquare, IconCheck } from '@tabler/icons-react';



import { useCounterStore } from '../store/useCounterStore'




const DropDown = (props) => {


  var multiple = props.multiple
  var value = props.value
  var allowSearch = props.allowSearch
  var position = props.position
  var label = props.label
  var labelClass = props.labelClass
  var onOptionsChoose = props.onOptionsChoose
  var allowReset = props.allowReset
  var [toggled, setToggled] = useState(false);
  var [options, setOptions] = useState(props.options ? props.options : []);
  var [optionsFiltered, setOptionsFiltered] = useState([]);
  var [search, setsearch] = useState('');


  useEffect(() => {

    // if (typeof options === 'object' && !Array.isArray(options)) {
    //   const optionsArray = Object.values(options);
    //   setOptions(optionsArray)
    // }

    if (search.length == 0) {
      setOptionsFiltered([]);
    }

    console.log(search.length);


    if (search.length > 1) {
      var items = searchClasses(search);
      setOptionsFiltered(items);
    }


  }, [search]);

  function searchClasses(query) {
    return options?.filter(cls => cls.includes(query));
  }

  return (
    <div className="relative">




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
        <div className={`absolute z-10 bg-white shadow-sm px-3 top-full h-[250px] overflow-y-scroll  w-fit rounded-sm  ${position == 'right' ? 'right-0' : 'left-0'}`}>


          {allowSearch && (
            <div className="sticky top-0 bg-white p-1">
              <input type="text" value={search} onChange={ev => setsearch(ev.target.value)} />

            </div>
          )}

          {optionsFiltered.length > 0 && (
            <div className="">
              {optionsFiltered.map(item => {

                return (
                  <div className="hover:bg-gray-200 p-1 cursor-pointer rounded-sm" key={item} onClick={() => {

                    if (multiple) {
                      var newValues = [...value]
                      if (newValues.includes(item)) {
                        newValues = newValues.filter(v => v !== item)
                      } else {
                        newValues.push(item)
                      }
                      onOptionsChoose(newValues)
                    } else {
                      onOptionsChoose(item)

                    }

                  }}>{item}</div>
                )

              })}
            </div>
          )}

          {optionsFiltered.length == 0 && (
            <>
              {!Array.isArray(options) && (

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

                          onOptionsChoose(item)

                        }

                      }}>{item.label} </div>
                    )

                  })}
                </>
              )}

              {Array.isArray(options) && (

                <>
                  {options.map(item => {

                    return (
                      <div className="hover:bg-gray-200 p-1 cursor-pointer rounded-sm" key={item} onClick={() => {

                        if (multiple) {
                          var newValues = [...value]
                          if (newValues.includes(item)) {
                            newValues = newValues.filter(v => v !== item)
                          } else {
                            newValues.push(item)
                          }
                          onOptionsChoose(newValues)
                        } else {
                          onOptionsChoose(item)

                        }

                      }}>{item?.label || item}</div>
                    )

                  })}
                </>
              )}
            </>
          )}




        </div>
      )}




    </div>
  );
};

export default DropDown;