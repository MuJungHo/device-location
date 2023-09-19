export const media = (type, id) => ({
  'image': images[id],
  'video': videos[id],
}[type])
const images = {
  1: {
    name: '擎天崗',
    size: '127 KB',
    type: 'jpg',
    width: 133,
    height: 100
  },
  2: {
    name: 'Doughnuts',
    size: '440 KB',
    type: 'jpg',
    width: 100,
    height: 151
  },
  3: {
    name: 'Food & Drink',
    size: '3.7 MB',
    type: 'jpg',
    width: 149,
    height: 100
  },
  4: {
    name: 'West Virginia, USA',
    size: '8 MB',
    type: 'jpg',
    width: 100,
    height: 150
  },
}
const videos = {
  1: {
    name: '月亮',
    size: '1.5 MB',
    type: 'mp4',
    width: 178,
    height: 100
  },
  2: {
    name: '空中的花朵',
    size: '1.2 MB',
    type: 'mp4',
    width: 178,
    height: 100
  },
  3: {
    name: '溫室',
    size: '8.7 MB',
    type: 'mp4',
    width: 178,
    height: 100
  },
  4: {
    name: '湖邊',
    size: '11 MB',
    type: 'mp4',
    width: 178,
    height: 100
  },
}