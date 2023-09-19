import React from 'react'
import {
  IconButton,
  Button,
  Menu,
  MenuItem,
  TextField
} from '@material-ui/core'
import xlsx from 'xlsx'
import devices from "../device_list.json"

export default ({
  setFloors,
  setActiveFloor,
  setLayers,
  setDevices,
  setImportJson,
  searchDevice,
  setSearchDevice }) => {

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
      let _temp = devices[_floors[0].name]
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
      setImportJson(devices)
    }
  }

  const handleExportXLSX = () => {

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
        // handleDeviceRawData(json);
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
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        style={{ display: 'none' }}
        id="contained-button-xlsx"
        // multiple
        onChange={handleUploadXLSX}
        type="file"
      />
      <input
        accept="image/png"
        style={{ display: 'none' }}
        id="contained-button-png"
        multiple
        onChange={handleUploadPNG}
        type="file"
      />
      <TextField variant='outlined' size="small" label="搜尋設備" value={searchDevice} onChange={e => setSearchDevice(e.target.value)} />

      <div style={{ width: 360, display: 'flex', justifyContent: 'space-around' }}>

        <label htmlFor="contained-button-xlsx">
          <Button color="primary" variant="outlined" component="span">
            上傳設備
          </Button>
        </label>
        <label htmlFor="contained-button-png">
          <Button color="primary" variant="outlined" component="span">
            上傳樓層
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