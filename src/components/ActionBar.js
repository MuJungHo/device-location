import React from 'react'
import { IconButton, Paper } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import moment from 'moment'
export default ({ layers, setLayers, activeLayerID, setActiveLayerID }) => {
  const activeLayer = layers.find(layer => layer.id === activeLayerID) || {}
  return (
    <div style={{ width: '100%', backgroundColor: 'rgb(241, 243, 247)' }}>
      <IconButton color="primary" component="span"
        disabled={!activeLayerID}
        style={{ float: 'right' }}
        onClick={() => {
          setLayers([...layers.filter(layer => layer.id !== activeLayerID)])
          setActiveLayerID()
        }}>
        <DeleteIcon />
      </IconButton>
      <IconButton color="primary" component="span"
        disabled={!activeLayerID}
        style={{ float: 'right' }}
        onClick={() => {
          let id = moment().unix()
          setLayers([...layers, { ...activeLayer, id , left: activeLayer.left + 20, top: activeLayer.top + 20 }])
          setActiveLayerID(id)
        }}>
        <FileCopyIcon />
      </IconButton>
    </div>
  )
}