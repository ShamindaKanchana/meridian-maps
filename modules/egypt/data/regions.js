/**
 * regions.js — Egypt terrain polygons.
 * Each region has a type that RegionRenderer maps to a fill color.
 * Points are [lon, lat] pairs forming a closed polygon.
 */
const regions = [
  {
    name: 'Western Desert',
    type: 'desert',
    color: '#d4aa5a',
    opacity: 0.85,
    points: [
      [24.7,31.7],[29.5,31.7],[29.5,29],[30.5,27],
      [29.5,25],[29,22],[24.7,22],
    ],
  },
  {
    name: 'Eastern Desert',
    type: 'desert',
    color: '#c9a04e',
    opacity: 0.8,
    points: [
      [30.5,29],[33.5,30.5],[35,28],[34.5,26],
      [33,24],[31,22],[29,22],[29.5,25],[30.5,27],
    ],
  },
  {
    name: 'Sinai Peninsula',
    type: 'desert',
    color: '#c8a555',
    opacity: 0.75,
    points: [
      [32.5,30.1],[34.9,29.5],[34.9,28],
      [33.5,28],[32.2,28.5],[31.8,29.5],
    ],
  },
  {
    name: 'Nubian Desert',
    type: 'desert',
    color: '#b8904a',
    opacity: 0.9,
    points: [
      [24.7,22],[29,22],[31,22],[33,24],[34.5,26],
      [35,28],[37,28],[37,22],[24.7,22],
    ],
  },
  {
    name: 'Nile Valley',
    type: 'fertile',
    color: '#5aaa5a',
    opacity: 0.85,
    points: [
      [30.5,29],[30.8,28],[31,27],[31.2,26],[31.3,25],
      [31.2,24],[31.1,23],[31,22],[29,22],[29.1,23],
      [29.3,24],[29.5,25],[29.6,26],[29.8,27],[30,28],[29.9,29],
    ],
  },
  {
    name: 'Nile Delta',
    type: 'fertile',
    color: '#4a9e4a',
    opacity: 0.9,
    points: [
      [29.9,29],[30.5,29],[31.8,31.2],[31.5,31.7],
      [30,31.7],[29,31.3],[29.5,31],[29.9,29],
    ],
  },
];

export default regions;