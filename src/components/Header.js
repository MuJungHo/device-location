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
import devices from "../device_list.json"
import SearchIcon from '@material-ui/icons/Search';

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
      // setImportJson(devices)
    }
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
    xlsx.utils.book_append_sheet(wb, sheet, '123')
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
        id="contained-button-png"
        multiple
        onChange={handleUploadPNG}
        type="file"
      />
      <input
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        style={{ display: 'none' }}
        id="contained-button-xlsx"
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
      <div style={{ width: 360, display: 'flex', justifyContent: 'space-around' }}>

        <label htmlFor="contained-button-png">
          <Button color="primary" variant="outlined" component="span">
            上傳樓層
          </Button>
        </label>
        <label htmlFor="contained-button-xlsx">
          <Button color="primary" variant="outlined" component="span">
            上傳設備
          </Button>
        </label>
        <Button color="primary" variant="contained" onClick={handleExportXLSX}>
          下載XLSX
        </Button>
      </div>
      {/* <IconButton style={{ marginRight: 10 }} onClick={exportJsonFile}><CloudDownloadIcon /></IconButton> */}
    </div>
  )
}