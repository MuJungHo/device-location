import React from 'react'
import moment from 'moment'
export default ({ layer, isActivated }) => {
  const [clock, setClock] = React.useState(moment().format(layer.data.value))
  React.useEffect(() => {
    let timeout = null
    if (isActivated) {
      setClock(moment().format(layer.data.value))
      timeout = setInterval(() => setClock(moment().format(layer.data.value)), 1000)
    }
    return () => clearInterval(timeout)
  }, [isActivated, layer])
  return (
    <foreignObject
      x={layer.left}
      y={layer.top}
      width={layer.width}
      height={layer.height}
    >
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: "center",
        color: layer.data.fontColor ? layer.data.fontColor : undefined,
        backgroundColor: layer.data.backgroundColor ? layer.data.backgroundColor : undefined,
        fontSize: layer.data.fontSize ? layer.data.fontSize + 'px' : undefined,
      }}>
        {clock}
      </div>
    </foreignObject>
  )
}