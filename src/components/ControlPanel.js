import React from 'react'
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from '@material-ui/core'

import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

const BasicProperties = ({
  activeLayer,
  devices,
  setLayers,
  setActiveLayerID,
  setDevices,
  layers,
  importJson,
  setImportJson,
  board
}) => {
  // console.log(devices, activeLayer)
  var options = [{ ...activeLayer }, ...devices]

  const handleDeleteLayer = () => {
    let _layers = layers.filter(layer => layer.id !== activeLayer.id)
    setLayers(_layers)

    let _devices = [...devices]
    _devices.push({ ...activeLayer, ["Location X"]: "", ["Location Y"]: "" })

    setDevices(_devices)
    setActiveLayerID()
    let _importJson = { ...importJson }
    _importJson[board.name] = [..._layers, ..._devices]
    setImportJson(_importJson)
    localStorage.setItem("importJson", JSON.stringify(_importJson))
  }

  const handleUpdateLayer = (key, value) => {
    let _layers = layers.map(layer => {
      return layer.id === activeLayer.id
        ? { ...layer, [key]: value }
        : { ...layer }
    })
    setLayers(_layers)

    let _importJson = { ...importJson }
    _importJson[board.name] = [..._layers, ...devices]
    setImportJson(_importJson)
    localStorage.setItem("importJson", JSON.stringify(_importJson))
  }

  return (
    <React.Fragment>
      <div style={{ display: 'flex', marginBottom: 20 }}>
        <TextField
          label="Location X"
          type="number"
          variant="outlined"
          onChange={e => handleUpdateLayer("Location X", Number(e.target.value))}
          value={activeLayer["Location X"] || ""}
        />
        <TextField
          label="Location Y"
          type="number"
          variant="outlined"
          onChange={e => handleUpdateLayer("Location Y", Number(e.target.value))}
          style={{ marginLeft: 20 }}
          value={activeLayer["Location Y"] || ""}
        />
      </div>

      <FormControl style={{ marginBottom: 20 }} variant="outlined" fullWidth>
        <InputLabel>Device</InputLabel>
        <Select
          value={activeLayer.Device}
          label="Device"
          displayEmpty
        >
          {
            options.map(option => <MenuItem
              key={option.Device}
              value={option.Device}>
              {option.Device}
            </MenuItem>)
          }
        </Select>
      </FormControl>
      <h3 style={{ marginBottom: 20 }}>Name: {activeLayer.Name}</h3>
      <h3 style={{ marginBottom: 20 }}>Panel: {activeLayer.Panel}</h3>
      <Button color="primary" variant="outlined" onClick={handleDeleteLayer}>刪除</Button>
    </React.Fragment>
  )
}
const BoardProperties = ({ board }) => {
  if (board === undefined) return null
  return (
    <div>
      <h3 style={{ margin: '16px 0' }}>{`Width: ${Math.floor(board.width)}`}</h3>
      <h3 style={{ margin: '16px 0' }}>{`Height: ${Math.floor(board.height)}`}</h3>
    </div>
  )
}
export default ({
  layers,
  setLayers,
  activeLayerID,
  board,
  devices,
  setActiveLayerID,
  setDevices,
  importJson,
  setImportJson
}) => {
  const activeLayer = layers.find(layer => layer.id === activeLayerID) || null
  // console.log(board)
  return (
    <div style={{
      width: 380,
      height: 'calc(100vh - 80px)',
      backgroundColor: '#f1f3f7',
      padding: 20
    }}>
      {
        Object.keys(board).length > 0 ?
          <React.Fragment>
            <h2 style={{ marginBottom: 20 }}>{`Name: ${board.name}`}</h2>
            <h2 style={{ marginBottom: 20 }}>{`Devices: ${layers.length}/${devices.length + layers.length}`}</h2>
            {
              activeLayerID
                ? <BasicProperties
                  devices={devices}
                  layers={layers}
                  setLayers={setLayers}
                  activeLayer={activeLayer}
                  setActiveLayerID={setActiveLayerID}
                  setDevices={setDevices}
                  importJson={importJson}
                  setImportJson={setImportJson}
                  board={board}
                />
                : <BoardProperties board={board} />
            }
          </React.Fragment>
          : <h4><ArrowUpwardIcon />請上傳樓層與設備</h4>
      }
    </div>
  )
}