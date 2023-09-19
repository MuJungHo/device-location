import React from "react";
import Board from './components/Board'
import ControlPanel from './components/ControlPanel'
import Header from './components/Header'
import moment from 'moment'


import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

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
  const [activeFloor, setActiveFloor] = React.useState({})
  const [devices, setDevices] = React.useState([])
  const [floors, setFloors] = React.useState([])
  const [floorIndex, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [addLayer, setAddLayer] = React.useState({})
  const [searchFloor, setSearchFloor] = React.useState("")
  const [searchDevice, setSearchDevice] = React.useState("")

  const handleChange = (event, newValue) => {
    setActiveFloor(floors[newValue])
    setValue(newValue);
    let _temp = importJson[floors[newValue].name]
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
    // console.log(dropRef.current.scrollLeft)
    setAddLayer({
      id,
      "Location Y": greaterThanZero(e.clientY + dropRef.current.scrollTop - dropRef.current.offsetTop - 80 - 10),
      "Location X": greaterThanZero(e.clientX + dropRef.current.scrollLeft - dropRef.current.offsetLeft - 10),
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
  React.useEffect(() => {
    if (floors.length === 0) return
    let index = floors.findIndex(floor => floor.name.indexOf(searchFloor) > -1)
    if (index < 0) index = 0
    setActiveFloor(floors[index])
    setValue(index);
    let _temp = importJson[floors[index].name]
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
    // console.log(index)
  }, [searchFloor])
  const handleChangeSearchFloor = e => {
    setSearchFloor(e.target.value)
  }
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
        searchDevice={searchDevice}
        setSearchDevice={setSearchDevice}
      />
      <div
        style={{
          width: '100%',
          position: 'relative',
          display: 'flex',
        }}>
        <div >
          <div style={{ display: 'flex' }}>
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
                floors
                  // .filter(floor => floor.name.indexOf(searchFloor) > -1)
                  .map(floor => <Tab key={floor.name} label={floor.name} />)
              }
            </Tabs>
            < TextField
              style={{ margin: 'auto', marginRight: 5 }}
              label="搜尋樓層" size="small" variant="outlined" value={searchFloor}
              onChange={handleChangeSearchFloor} />
          </div>
          <div
            ref={dropRef}
            onMouseDown={handleClick}
            style={{
              width: 'calc(100vw - 360px)',
              overflow: 'scroll',
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
              searchDevice={searchDevice}
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