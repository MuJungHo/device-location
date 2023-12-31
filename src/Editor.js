import React from "react";
import Board from './components/Board'
import ControlPanel from './components/ControlPanel'
import Header from './components/Header'

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
  const [importJson, setImportJson] = React.useState(localStorage.getItem("importJson") ? JSON.parse(localStorage.getItem("importJson")) : {})
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
    let _temp = importJson[floors[newValue].name] || []
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
    // console.log(dropRef.current.scrollLeft)
    setAddLayer({
      "Location Y": greaterThanZero(e.clientY + dropRef.current.scrollTop - dropRef.current.offsetTop - 80 - 10),
      "Location X": greaterThanZero(e.clientX + dropRef.current.scrollLeft - dropRef.current.offsetLeft - 10),
      Device: ""
    })
  };
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
    localStorage.setItem("importJson", JSON.stringify(_importJson))
    setOpen(false)
  }
  // console.log(_devices)
  React.useEffect(() => {
    if (floors.length === 0) return
    let _floor = floors.filter(floor => floor.name.indexOf(searchFloor) > -1)
    if (_floor.length > 0) {
      setActiveFloor(_floor[0])
      setValue(0);
      let _temp = importJson[_floor[0].name] || []
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
    }

  }, [searchFloor])
  const handleChangeSearchFloor = e => {
    setSearchFloor(e.target.value)
  }

  const handleChangeDevice = e => {
    const _addLayer = devices.find(device => device.Device === e.target.value)
    setAddLayer({
      ..._addLayer,
      Device: e.target.value,
      "Location Y": addLayer["Location Y"],
      "Location X": addLayer["Location X"],
    })
  }
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      backgroundColor: 'white'
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
              <InputLabel>Device *</InputLabel>
              <Select
                value={addLayer.Device}
                label="Device"
                displayEmpty
                onChange={handleChangeDevice}
              >
                {
                  devices.map(option => <MenuItem
                    key={option.id}
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
          <Button disabled={addLayer.Device === ""} variant="contained" onClick={handleAddLayer} color="primary" autoFocus>
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
        activeFloor={activeFloor}
        importJson={importJson}
      />
      <div
        style={{
          width: '100%',
          position: 'relative',
          display: 'flex',
        }}>
        <div >
          <div style={{ display: 'flex', height: 56, alignItems: 'center' }}>
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
                  .filter(floor => floor.name.indexOf(searchFloor) > -1)
                  .map(floor => <Tab key={floor.name} label={floor.name} />)
              }
            </Tabs>
            < TextField
              style={{ marginRight: 16, }}
              label="搜尋樓層" size="small" variant="outlined" value={searchFloor}
              onChange={handleChangeSearchFloor} />
          </div>
          <div
            ref={dropRef}
            onMouseDown={handleClick}
            style={{
              width: 'calc(100vw - 360px)',
              overflow: 'scroll',
              height: 'calc(100vh - 150px)',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              marginLeft: 16,
              marginRight: 16,
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
          setActiveLayerID={setActiveLayerID}
          devices={devices}
          setDevices={setDevices}
          importJson={importJson}
          setImportJson={setImportJson}
        />
      </div>
    </div>
  )
}