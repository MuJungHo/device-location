import React, { useContext } from "react";
import Board from './components/Board'
import ActionBar from './components/ActionBar'
import ToolBar from './components/ToolBar'
import ControlPanel from './components/ControlPanel'
import Header from './components/Header'
import moment from 'moment'
import _devices from "./device_list.json";

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import { GlobalContext } from "./contexts/GlobalContext"

import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core'

export default () => {
  const dropRef = React.useRef()
  const [importJson, setImportJson] = React.useState({})
  const [layers, setLayers] = React.useState([])
  const [activeLayerID, setActiveLayerID] = React.useState()
  const [activeFloor, setActiveFloor] = React.useState({
    width: window.innerWidth - 340,
    height: window.innerHeight - 160,
    name: "Floor 1",
    image: ""
  })
  const [devices, setDevices] = React.useState([])
  const [floors, setFloors] = React.useState([{
    width: window.innerWidth - 340,
    height: window.innerHeight - 160,
    name: "Floor 1",
    image: ""
  }])
  const [floorIndex, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [addLayer, setAddLayer] = React.useState({})

  const handleChange = (event, newValue) => {
    setActiveFloor(floors[newValue])
    setValue(newValue);
    let _temp = importJson[floors[newValue].name]
    // console.log(importJson)
    let _layers = []
    let _devices = []
    for (let i = 0; i < _temp.length; i++) {
      if (_temp[i]["Location X"] && _temp[i]["Location Y"]) {
        _layers.push({
          ..._temp[i],
        })
      } else {
        _devices.push(_temp[i])
      }
    }
    setDevices(_devices)
    setLayers(_layers)
    setActiveLayerID()
  };
  const handleClick = e => {
    // return console.log('click')
    setActiveLayerID()

    if (devices.length === 0) return

    setOpen(true)
    const id = moment().unix()
    setAddLayer({
      id,
      "Location Y": greaterThanZero(e.clientY - dropRef.current.offsetTop - 80 - 10),
      "Location X": greaterThanZero(e.clientX - dropRef.current.offsetLeft - 10),
      Device: ""
    })
  }
  const greaterThanZero = num => num < 0 ? 0 : num

  const handleAddLayer = () => {
    let _devices = [...devices]
    _devices = _devices.filter(device => device.Device !== addLayer.Device)
    setDevices(_devices)
    setLayers([...layers, {
      ...addLayer,
    }])
    setActiveLayerID(addLayer.id)
    let _importJson = { ...importJson }
    _importJson[activeFloor.name] = [...layers, {
      ...addLayer,
    }]
    // console.log()
    setImportJson(_importJson)
    setOpen(false)
  }
  // console.log(_devices)
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.13)'
    }}>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Add Device"}</DialogTitle>
        <DialogContent>
          <React.Fragment>
            <div style={{ display: 'flex', marginBottom: 20 }}>
              <TextField
                label="Location X"
                type="text"
                variant="outlined"
                value={addLayer["Location X"] || ""}
              />
              <TextField
                label="Location Y"
                type="text"
                variant="outlined"
                style={{ marginLeft: 20 }}
                value={addLayer["Location Y"] || ""}
              />
            </div>

            <FormControl variant="outlined" fullWidth>
              <InputLabel>Device</InputLabel>
              <Select
                value={addLayer.Device}
                label="Device"
                displayEmpty
                onChange={e => setAddLayer({
                  ...addLayer,
                  Device: e.target.value
                })}
              >
                {
                  devices.map(option => <MenuItem
                    key={option.Device}
                    value={option.Device}>
                    {option.Device}
                  </MenuItem>)
                }
              </Select>
            </FormControl>
          </React.Fragment>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Disagree
          </Button>
          <Button onClick={handleAddLayer} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <Header
        setFloors={setFloors}
        setActiveFloor={setActiveFloor}
        setLayers={setLayers}
        setDevices={setDevices}
        setImportJson={setImportJson}
      />
      <div
        style={{
          width: '100%',
          position: 'relative',
          display: 'flex',
        }}>
        <div >
          <Tabs
            style={{ width: 'calc(100vw - 500px)' }}
            value={floorIndex}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="on"
            onChange={handleChange}
          >
            {
              floors.map(floor => <Tab key={floor.name} label={floor.name} />)
            }
          </Tabs>
          <div
            ref={dropRef}
            onMouseDown={handleClick}
            style={{
              width: 'calc(100vw - 380px)',
              overflow: 'auto',
              height: 'calc(100vh - 125px)',
            }}
          >
            <Board
              board={activeFloor}
              layers={layers}
              setLayers={setLayers}
              activeLayerID={activeLayerID}
              setActiveLayerID={setActiveLayerID}
              importJson={importJson}
              setImportJson={setImportJson}
            />
          </div>
        </div>
        <ControlPanel
          board={activeFloor}
          layers={layers}
          setLayers={setLayers}
          activeLayerID={activeLayerID}
          devices={devices}
        />
      </div>
    </div>
  )
}