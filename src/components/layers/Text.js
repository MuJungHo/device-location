import React from 'react'
export default ({ layer, editing, setEditing, finish }) => {
  const [innerText, setInnerText] = React.useState(layer.data.value || '')

  React.useEffect(() => {
    if (document.getElementById(`text_${layer.id}`)) document.getElementById(`text_${layer.id}`).focus()
  }, [])
  return (
    <foreignObject
      x={layer.left}
      y={layer.top}
      width={layer.width}
      height={layer.height}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          userSelect: 'none',
          wordWrap: 'break-word',
          color: layer.data.fontColor ? layer.data.fontColor : undefined,
          backgroundColor: layer.data.backgroundColor ? layer.data.backgroundColor : undefined,
          fontSize: layer.data.fontSize ? layer.data.fontSize + 'px' : undefined,
          fontWeight: layer.data.fontWeight,
          fontStyle: layer.data.fontStyle,
          textDecoration: layer.data.textDecoration,
          textAlign: layer.data.textAlign
        }}
        onDoubleClick={() => setEditing(true)}
      >
        {
          editing
            ?
            <div
              id={`text_${layer.id}`}
              contentEditable
              suppressContentEditableWarning
              tabIndex="-1"
              onInput={e => setInnerText(e.currentTarget.innerText)}
              onBlur={() => {
                setEditing(false)
                if (typeof finish === 'function') finish(innerText)
              }}
              style={{
                width: layer.width,
                height: layer.height,
              }}>
              {layer.data.value}
            </div>
            :
            layer.data.value
        }
      </div>
    </foreignObject>
  )
}