import React from 'react'
import {
  Dialog,
  IconButton
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import TextPlayer from './player/Text'
import TimePlayer from './player/Time'
const VideoLayer = ({ layer }) => {
  const zoom = 1.5
  return (
    <video width={layer.width * zoom} height={layer.height * zoom} autoPlay>
      <source src={`./assets/videos/${layer.data.id}.mp4`} type="video/mp4" />
    </video>
  )
}
const ImageLayer = ({ layer }) => {
  const zoom = 1.5
  return (
    <img
      src={`./assets/images/${layer.data.id}.jpg`}
      style={{
        width: layer.width * zoom,
        height: layer.height * zoom,
      }}
    />
  )
}
const Layer = ({ layer }) => {
  const zoom = 1.5
  return (
    <div style={{
      position: 'absolute',
      width: layer.width * zoom,
      height: layer.height * zoom,
      top: layer.top * zoom,
      left: layer.left * zoom,
    }}>
      {{
        'image': <ImageLayer layer={layer} />,
        'video': <VideoLayer layer={layer} />,
        'text': <TextPlayer layer={layer} />,
        'time': <TimePlayer layer={layer} />
      }[layer.data.type]}
    </div>
  )
}
export default ({ isDialogOpen, setDialogOpen, layers, board }) => {
  return (
    <Dialog
      open={isDialogOpen}
      onClose={() => setDialogOpen(false)}
      fullScreen
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          background: board.background.type === 'color'
            ? board.background.color
            : board.background.imageId === 0
              ? board.background.color
              : `no-repeat center/100% url(./assets/images/${board.background.imageId}.jpg)`
        }}>
        {
          layers.map(layer => <Layer key={layer.id} layer={layer} />)
        }
        <IconButton onClick={() => setDialogOpen(false)} >
          <CloseIcon />
        </IconButton>
      </div>
    </Dialog>
  )
}