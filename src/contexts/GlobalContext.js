import React, { createContext, useState } from "react";
import device_list from "../device_list.json";

const GlobalContext = createContext();

function GlobalProvider(props) {
  const [devices, setDevices] = useState([]);
  const [allDevices, setAllDevices] = useState(device_list);
  const [floor, setFloor] = useState({
    width: window.innerWidth - 340,
    height: window.innerHeight - 160,
    name: "Floor 1",
    image: ""
  })

  const getDevicesByFloor = (floorname) => {
    let _temp = allDevices[floorname];
    let _devices = [];
    for (let i = 0; i < _temp.length; i++) {
      if (_temp[i]["Location X"] && _temp[i]["Location Y"]) {
        // do nothing
      } else {
        _devices.push(_temp[i])
      }
    }
    return _devices
  }

  const getLayersByFloor = (floorname) => {
    let _temp = allDevices[floorname];
    let _layers = [];
    for (let i = 0; i < _temp.length; i++) {
      if (_temp[i]["Location X"] && _temp[i]["Location Y"]) {
        _layers.push({
          ..._temp[i],
          id: _temp[i].Device + "_" + i,
          left: _temp[i]["Location X"],
          top: _temp[i]["Location Y"],
        })
      }
    }
    return _layers
  }

  const updateDevicesByFloor = (floorname, devices) => {

  }

  const updateLayersByFloor = (layers) => {
    let _temp = JSON.parse(JSON.stringify(allDevices))
    let _devices = getDevicesByFloor(floor.name);
    let _layers = [...layers];
    _temp[floor.name] = [..._layers, ..._devices]
    console.log(_temp)
    setAllDevices(_temp)
  }

  const value = {
    getDevicesByFloor,
    getLayersByFloor,
    updateLayersByFloor,
    setFloor,
    floor
  };

  return <GlobalContext.Provider value={value} {...props} />;
}

export { GlobalContext, GlobalProvider };