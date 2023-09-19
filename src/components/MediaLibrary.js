import React from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Button,
} from '@material-ui/core'
export default ({ isDialogOpen, setDialogOpen, close, type, confirm }) => {
  const [selected, setSelected] = React.useState()
  const card = {
    maxHeight: 90,
    margin: 10
  }
  const handleClose = () => {
    if (typeof close === 'function') close()
    setDialogOpen(false)
  }
  const handleConfirm = e => {
    if (typeof confirm === 'function') confirm(selected)
    setDialogOpen(false)
  }
  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {`Media Library > ${type}`}
      </DialogTitle>

      <Divider />
      <DialogContent>
        <div style={{
          width: '100%', height: 240, backgroundColor: 'rgba(74, 91, 117, 0.1', marginTop: 16, display: 'flex',
          flexWrap: 'wrap'
        }}>
          {
            [1, 2, 3, 4].map(id => <img
              key={id}
              style={{
                ...card,
                border: `3px solid ${selected === id ? '#3f51b5' : 'transparent'}`
              }}
              onClick={() => {
                setSelected(id)
              }}
              alt="Contemplative Reptile"
              src={{
                'image': `./assets/images/${id}.jpg`,
                'video': `./assets/previews/${id}.jpg`,
              }[type]}
              title="Contemplative Reptile"
            />)
          }
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => setDialogOpen(false)}>Cancel</Button>
        <Button variant="contained" style={{ marginLeft: 20 }} color="primary" disabled={!selected} onClick={handleConfirm}>Confirm</Button>
      </DialogActions>
    </Dialog>
  )
}