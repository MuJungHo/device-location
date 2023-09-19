import React from 'react'
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@material-ui/core'
import BasicProperties from './Basic'
import ColorPicker from '../ColorPicker'
export default ({ layers, setLayers, activeLayer }) => {
  const handleUpdateLayer = (key, value) => {
    const updatedLayers = layers.map(layer => {
      return layer.id === activeLayer.id
        ? { ...layer, data: { ...layer.data, [key]: value } }
        : { ...layer }
    })
    setLayers([...updatedLayers])
  }
  return (
    <div>
      <h2>Time Properties</h2>
      <BasicProperties activeLayer={activeLayer} />
      <h3 style={{ marginTop: 20, marginBottom: 10 }}>Format</h3>
      <FormControl variant="outlined" fullWidth >
        <Select
          value={activeLayer.data.value}
          onChange={e => handleUpdateLayer('value', e.target.value)}
          displayEmpty
        >
          <MenuItem value={''}>Empty</MenuItem>
          <MenuItem value={'YYYY/MM/DD HH:mm:ss'}>YYYY/MM/DD HH:mm:ss</MenuItem>
          <MenuItem value={'YYYY/MM/DD hh:mm:ss a'}>YYYY/MM/DD hh:mm:ss a</MenuItem>
          <MenuItem value={'HH:mm:ss'}>HH:mm:ss</MenuItem>
          <MenuItem value={'hh:mm:ss a'}>hh:mm:ss a</MenuItem>
        </Select>
      </FormControl>
      <h3 style={{ marginTop: 20, marginBottom: 10 }}>Font Properties</h3>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: 10 }}>Color:</span>
        <ColorPicker
          value={activeLayer.data.fontColor || '#000000'}
          disabled={activeLayer.data.value.trim().length === 0}
          onChange={color => handleUpdateLayer('fontColor', color.hex)}
        />
        <span style={{ marginLeft: 20, marginRight: 10 }}>Size:</span>
        <TextField
          type="number"
          variant="outlined"
          disabled={activeLayer.data.value.trim().length === 0}
          InputProps={{ inputProps: { style: { padding: '.5rem' } } }}
          value={activeLayer.data.fontSize || 14}
          onChange={e => handleUpdateLayer('fontSize', e.target.value)}
        />
      </div>
      {/* <h3 style={{ marginTop: 20, marginBottom: 10 }}>Background Properties</h3>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: 10 }}>Color:</span>
        <ColorPicker
          value={activeLayer.data.backgroundColor || '#f5f5f5'}
          disabled={activeLayer.data.value.trim().length === 0}
          onChange={color => handleUpdateLayer('backgroundColor', color.hex)}
        />
      </div> */}
    </div>
  )
}