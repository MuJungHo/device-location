import React from 'react'
import { Button } from '@material-ui/core'
import Image from '@material-ui/icons/Image';
import Theaters from '@material-ui/icons/Theaters';
import Clock from '@material-ui/icons/AccessTime';
import TextFields from '@material-ui/icons/TextFields';
export default props => {
  const { addLayer } = props
  const buttonStyle = {
    padding: 5,
    padding: 5,
    marginTop: 20,
    backgroundColor: 'white'
  };
  const iconStyle = {
    height: 52,
    width: 52
  };
  const buttons = [
    { type: 'image', icon: <Image style={{ ...iconStyle }} /> },
    { type: 'video', icon: <Theaters style={{ ...iconStyle }} /> },
    { type: 'text', icon: <TextFields style={{ ...iconStyle }} /> },
    { type: 'time', icon: <Clock style={{ ...iconStyle }} /> }
  ]
  return (
    <div style={{
      width: 104,
      height: 'calc(100vh - 80px)',
      backgroundColor: '#f1f3f7',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {
        buttons.map(button =>
          <Button key={button.type}
            draggable="true"
            variant="outlined"
            color="primary"
            onClick={() => addLayer(button.type)}
            style={{ ...buttonStyle }}>
            {button.icon}
          </Button>
        )
      }
    </div>
  )
}