import React from 'react';
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

export default ({ layers, setLayers, activeLayer }) => {

  const [alignment, setAlignment] = React.useState(activeLayer.data.textAlign || 'left');

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
    const updatedLayers = layers.map(layer => {
      return layer.id === activeLayer.id
        ? {
          ...layer,
          data: {
            ...layer.data,
            textAlign: newAlignment
          }
        }
        : { ...layer }
    })
    setLayers([...updatedLayers])
  };

  return (
    <ToggleButtonGroup
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label="text alignment"
    >
      <ToggleButton value="left" aria-label="left aligned">
        <FormatAlignLeftIcon />
      </ToggleButton>
      <ToggleButton value="center" aria-label="centered">
        <FormatAlignCenterIcon />
      </ToggleButton>
      <ToggleButton value="right" aria-label="right aligned">
        <FormatAlignRightIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}