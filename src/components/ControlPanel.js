import React from 'react'
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core'

const BasicProperties = ({ activeLayer, devices }) => {
  // console.log(devices, activeLayer)
  var options = [{ ...activeLayer }, ...devices]
  return (
    <React.Fragment>
      <div style={{ display: 'flex', marginBottom: 20 }}>
        <TextField
          label="Location X"
          type="text"
          variant="outlined"
          value={activeLayer["Location X"] || ""}
        />
        <TextField
          label="Location Y"
          type="text"
          variant="outlined"
          style={{ marginLeft: 20 }}
          value={activeLayer["Location Y"] || ""}
        />
      </div>

      <FormControl variant="outlined" fullWidth>
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
    </React.Fragment>
  )
}
const BoardProperties = ({ board }) => {
  if (board === undefined) return null
  return (
    <div>
      <h2>{board.name}</h2>
      <h3 style={{ margin: '16px 0' }}>{`Width: ${Math.floor(board.width)}`}</h3>
      <h3 style={{ margin: '16px 0' }}>{`Height: ${Math.floor(board.height)}`}</h3>
    </div>
  )
}
export default ({ layers, setLayers, activeLayerID, board, devices }) => {
  const activeLayer = layers.find(layer => layer.id === activeLayerID) || null
  // console.log(activeLayerID)
  return (
    <div style={{
      width: 380,
      height: 'calc(100vh - 80px)',
      backgroundColor: '#f1f3f7',
      padding: 20
    }}>
      <h2 style={{ marginBottom: 20 }}>{`Devices: ${layers.length}/${devices.length + layers.length}`}</h2>
      {
        activeLayerID
          ? <BasicProperties activeLayer={activeLayer} devices={devices} />
          : <BoardProperties board={board} />
      }
    </div>
  )
}