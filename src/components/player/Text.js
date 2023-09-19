import React from 'react'
export default ({ layer }) => {
  const zoom = 1.5
  return (
    <div
      style={{
        width: layer.width * zoom,
        height: layer.height * zoom,
        wordWrap: 'break-word',
        overflow: 'hidden',
        color: layer.data.fontColor ? layer.data.fontColor : undefined,
        backgroundColor: layer.data.backgroundColor ? layer.data.backgroundColor : undefined,
        fontSize: layer.data.fontSize ? layer.data.fontSize * zoom + 'px' : 14 * zoom,
        fontWeight: layer.data.fontWeight,
        fontStyle: layer.data.fontStyle,
        textDecoration: layer.data.textDecoration,
        textAlign: layer.data.textAlign
      }}
    >
      {layer.data.value}
    </div>
  )
}