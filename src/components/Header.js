import React from 'react'
import {
  IconButton,
  Button,
  Menu,
  MenuItem,
  TextField,
  InputAdornment
} from '@material-ui/core'
import xlsx from 'xlsx'
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import SettingsIcon from '@material-ui/icons/Settings';
import GetAppIcon from '@material-ui/icons/GetApp';
import PublishIcon from '@material-ui/icons/Publish';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default ({
  setFloors,
  setActiveFloor,
  setLayers,
  setDevices,
  setImportJson,
  searchDevice,
  setSearchDevice,
  importJson,
  activeFloor
}) => {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const inputPngRef = React.useRef(null);
  const inputXlsxRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        var image = new Image();

        image.src = reader.result;

        image.onload = function () {
          resolve({ image: reader.result, width: image.width, height: image.height })
        };
      };

      reader.onerror = (err) => reject(err);
    });

  const handleUploadPNG = async e => {
    var _floors = []
    if (e.target.files) {
      const { files } = e.target;
      for (let i = 0; i < files.length; i++) {
        let floor = {}
        const { image, width, height } = await getBase64(files[i])
        floor.image = image
        floor.width = width
        floor.height = height
        floor.name = files[i]?.name.split(".png")[0] || ""
        // console.log(files[i])
        _floors.push(floor)
      }
      setFloors(_floors)
      setActiveFloor(_floors[0])
      let _temp = importJson[_floors[0].name] || []
      let _layers = []
      let _devices = []
      for (let i = 0; i < _temp.length; i++) {
        if (_temp[i]["Location X"] && _temp[i]["Location Y"]) {
          _layers.push({
            ..._temp[i],
          })
        } else {
          _devices.push(_temp[i])
        }
      }
      setDevices(_devices)
      setLayers(_layers)
    }
    inputPngRef.current.value = null
  }

  const handleClearStorage = () => {
    setFloors([])
    setActiveFloor({})
    setDevices([])
    setLayers([])
    setImportJson({})
    localStorage.clear()
    setOpen(false)
  }

  const handleExportXLSX = () => {
    // console.log(importJson)
    const wb = xlsx.utils.book_new();

    let sheetData = [[
      "Panel",
      "SLC",
      "Device",
      "Floor",
      "Name",
      "Type ID",
      "Gateway ID",
      "Function Code",
      "Address",
      "Location X",
      "Location Y",
      "Group IDs"
    ]]
    Object.keys(importJson).forEach(key => {
      // console.log()
      importJson[key].forEach(item => {
        sheetData.push([
          item["Panel"],
          item["SLC"],
          item["Device"],
          item["Floor"],
          item["Type ID"],
          item["Gateway ID"],
          item["Function Code"],
          item["Address"],
          item["Location X"],
          item["Location Y"],
          item["Group IDs"],
        ])
      })
    })
    // return
    let sheet = xlsx.utils.aoa_to_sheet(sheetData)
    xlsx.utils.book_append_sheet(wb, sheet, 'Device')
    let workbookBlob = workbookToBlob(wb)

    if (typeof workbookBlob == "object" && workbookBlob instanceof Blob) {
      workbookBlob = URL.createObjectURL(workbookBlob); // 創建blob地址
    }

    var aLink = document.createElement("a");
    aLink.href = workbookBlob;
    aLink.download = "config.xlsx";
    aLink.click()
  }

  const workbookToBlob = workbook => {
    var wopts = {
      bookType: "xlsx",
      bookSST: false,
      type: "binary"
    };
    var wbout = xlsx.write(workbook, wopts);
    function s2ab(s) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    }
    var blob = new Blob([s2ab(wbout)], {
      type: "application/octet-stream"
    });
    return blob;
  }

  const handleDeviceRawData = (deviceArray) => {
    let _importJson = {}
    for (let i = 0; i < deviceArray.length; i++) {
      if (_importJson[deviceArray[i].Floor] === undefined) {
        _importJson[deviceArray[i].Floor] = []
      }
      _importJson[deviceArray[i].Floor].push({ ...deviceArray[i], id: deviceArray[i].Device + "_" + i })
    }

    setImportJson(_importJson)
    localStorage.setItem("importJson", JSON.stringify(_importJson))

    let _temp = _importJson[activeFloor.name] || []
    let _layers = []
    let _devices = []
    for (let i = 0; i < _temp.length; i++) {
      if (_temp[i]["Location X"] && _temp[i]["Location Y"]) {
        _layers.push({
          ..._temp[i],
        })
      } else {
        _devices.push(_temp[i])
      }
    }
    setDevices(_devices)
    setLayers(_layers)
  }

  const handleUploadXLSX = e => {
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[3];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        handleDeviceRawData(json);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  }
  return (
    <div style={{
      height: 80,
      backgroundColor: '#f1f3f7',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: 20
    }}>
      <h1>FAIMIS</h1>
      <div style={{ flex: 1 }}></div>
      <input
        accept="image/png"
        style={{ display: 'none' }}
        ref={inputPngRef}
        multiple
        onChange={handleUploadPNG}
        type="file"
      />
      <input
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        style={{ display: 'none' }}
        ref={inputXlsxRef}
        // multiple
        onChange={handleUploadXLSX}
        type="file"
      />
      <TextField
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        variant='outlined'
        size="small" label="搜尋設備" value={searchDevice} onChange={e => setSearchDevice(e.target.value)} />

      <div style={{ flex: 1 }}></div>
      <div style={{ width: 340, display: 'flex', justifyContent: 'space-around' }}>
        <Button color="primary" variant="contained" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
          <PublishIcon />
          上傳
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => {
            inputPngRef.current.click()
            handleClose()
          }}>樓層</MenuItem>
          <MenuItem onClick={() => {
            inputXlsxRef.current.click()
            handleClose()
          }}>設備</MenuItem>
        </Menu>
        <Button color="primary" variant="contained" onClick={handleExportXLSX}>
          <GetAppIcon />
          下載
        </Button>
        <Button color="secondary" variant="contained" onClick={() => setOpen(true)}>
          <ClearIcon />
          清除
        </Button>
      </div>

      <Dialog
        open={open}
        fullWidth
        maxWidth="sm"
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"確認清除資料？"}</DialogTitle>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Disagree
          </Button>
          <Button variant="contained" onClick={handleClearStorage} color="secondary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      {/* <IconButton style={{ marginRight: 10 }} onClick={exportJsonFile}><CloudDownloadIcon /></IconButton> */}
    </div>
  )
}