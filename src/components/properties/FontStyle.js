import React from 'react';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const initData = (data) => {
  let arr = [];
  if (data.textDecoration === 'underline') arr.push('underlined')
  if (data.fontStyle === 'italic') arr.push('italic')
  if (data.fontWeight === 'bold') arr.push('bold')
  return arr
}

export default ({ layers, setLayers, activeLayer }) => {
  const [formats, setFormats] = React.useState(initData(activeLayer.data));

  const handleFormat = (event, newFormats) => {
    setFormats(newFormats);
    const updatedLayers = layers.map(layer => {
      return layer.id === activeLayer.id
        ? {
          ...layer,
          data: {
            ...layer.data,
            textDecoration: newFormats.includes('underlined') ? 'underline' : 'none',
            fontStyle: newFormats.includes('italic') ? 'italic' : 'normal',
            fontWeight: newFormats.includes('bold') ? 'bold' : 'normal',
          }
        }
        : { ...layer }
    })
    setLayers([...updatedLayers])
  };

  return (
    <ToggleButtonGroup value={formats} onChange={handleFormat} aria-label="text formatting">
      <ToggleButton value="bold" aria-label="bold">
        <FormatBoldIcon />
      </ToggleButton>
      <ToggleButton value="italic" aria-label="italic">
        <FormatItalicIcon />
      </ToggleButton>
      <ToggleButton value="underlined" aria-label="underlined">
        <FormatUnderlinedIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}