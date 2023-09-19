import React from 'react'
import {
  TextField,
} from '@material-ui/core'
export default ({ activeLayer }) => {
  return (
    <>
      <div style={{ display: 'flex', marginTop: 20 }}>
        <TextField
          label="Left"
          type="text"
          variant="outlined"
          value={activeLayer.left}
        />
        <TextField
          label="Top"
          type="text"
          variant="outlined"
          style={{ marginLeft: 20 }}
          value={activeLayer.top}
        />
      </div>
      <div style={{ display: 'flex', marginTop: 20 }}>
        <TextField
          label="Width"
          type="text"
          variant="outlined"
          value={activeLayer.width}
        />
        <TextField
          label="Height"
          type="text"
          variant="outlined"
          style={{ marginLeft: 20 }}
          value={activeLayer.height}
        />
      </div>
    </>
  )
}