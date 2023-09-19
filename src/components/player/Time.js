import React from 'react'
import moment from 'moment'
export default ({ layer }) => {
  const zoom = 1.5
  const [clock, setClock] = React.useState(moment().format(layer.data.value))
  React.useEffect(() => {
    let timeout = null
    setClock(moment().format(layer.data.value))
    timeout = setInterval(() => setClock(moment().format(layer.data.value)), 1000)
    return () => clearInterval(timeout)
  }, [])
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: layer.width * zoom,
        height: layer.height * zoom,
        color: layer.data.fontColor ? layer.data.fontColor : undefined,
        backgroundColor: layer.data.backgroundColor ? layer.data.backgroundColor : undefined,
        fontSize: layer.data.fontSize ? layer.data.fontSize * zoom + 'px' : 14 * zoom
      }}
    >
      {clock}
    </div>
  )
}