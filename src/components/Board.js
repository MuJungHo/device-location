import React from 'react'
import Layer from './Layer'
export default ({
  layers,
  setLayers,
  activeLayerID,
  setActiveLayerID,
  board,
  setImportJson,
  importJson,
  searchDevice
}) => {
  const boardRef = React.useRef()
  if (board === undefined) return null
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width={board.width}
      height={board.height}
      ref={boardRef}
    >
      {
        board.image === ""
          ?
          <rect
            width={board.width}
            height={board.height} x="0" y="0" fill='#f5f5f5'
          />
          :

          <image
            xlinkHref={board.image}
            height={board.height}
            width={board.width}
            x="0"
            y="0"
          />
      }
      {
        layers
          .filter(layer => layer.Device.indexOf(searchDevice) > -1)
          .map(layer =>
            <Layer
              activeLayerID={activeLayerID}
              setActiveLayerID={setActiveLayerID}
              key={layer.id}
              layer={layer}
              layers={layers}
              setLayers={setLayers}
              boardRef={boardRef}
              importJson={importJson}
              setImportJson={setImportJson}
              board={board}
            />)
      }
    </svg>
  )
}