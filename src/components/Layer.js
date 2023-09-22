import React, { useContext } from "react";

export default ({
  layer,
  boardRef,
  setLayers,
  layers,
  setActiveLayerID,
  activeLayerID,
  setImportJson,
  importJson,
  board
}) => {
  const [start, setStart] = React.useState(null)

  React.useEffect(() => {
    if (JSON.stringify(start) !== JSON.stringify({}) && start !== null) {
      boardRef.current.addEventListener('mousemove', drag)
      boardRef.current.addEventListener('mouseup', endDrag)
    }
  }, [start])
  const handleUpdateLayer = updatedLayer => {
    let _layers = layers.map(layer => {
      if (layer.id === updatedLayer.id) return { ...updatedLayer }
      else return { ...layer }
    })
    setLayers(_layers)
    let _importJson = { ...importJson }
    _importJson[board.name] = _importJson[board.name].map(layer => {
      if (layer.id === updatedLayer.id) {
        // console.log(layer.id, updatedLayer)
        return { ...updatedLayer }
      }
      else return { ...layer }
    })
    // console.log()
    setImportJson(_importJson)
  }
  const startDrag = e => {
    e.stopPropagation()
    setStart({ left: e.clientX, top: e.clientY })
  }
  const endDrag = () => {
    setStart({})
    boardRef.current.removeEventListener('mousemove', drag)
  }
  const drag = e => {
    e.stopPropagation()
    handleUpdateLayer({
      ...layer,
      "Location X": layer["Location X"] + e.x - start.left,
      "Location Y": layer["Location Y"] + e.y - start.top
    })
  }
  // console.log(activeLayerID)
  return (
    <g
      onFocus={() => setActiveLayerID(layer.id)}
      style={{ outline: 'none' }}
      tabIndex="-1"
      onMouseDown={startDrag}
    >
      <image
        xlinkHref={activeLayerID === layer.id ? './assets/images/location-blue.svg' : './assets/images/location.svg'}
        x={layer["Location X"] - 10}
        y={layer["Location Y"] - 20}
        width={20}
        height={20}
        onMouseDown={startDrag}
      />
    </g>
  )
}