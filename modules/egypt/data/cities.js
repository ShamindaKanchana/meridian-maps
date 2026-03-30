/**
 * cities.js — Egypt cities and towns.
 * monthlyTemps: average °C for Jan–Dec.
 * population: approximate metro population.
 * type: 'capital' | 'major' | 'town'
 */
const cities = [
  // ── Capital ───────────────────────────────────────────────────────────────
  { name:'Cairo', lon:31.24, lat:30.06, population:21000000, type:'capital',
    monthlyTemps:[14,16,19,24,28,31,32,32,29,25,20,15] },

  // ── Major cities ─────────────────────────────────────────────────────────
  { name:'Alexandria',       lon:29.92, lat:31.20, population:5200000, type:'major',
    monthlyTemps:[13,14,16,19,23,26,27,27,25,22,18,14] },
  { name:'Giza',             lon:31.13, lat:30.01, population:3628000, type:'major',
    monthlyTemps:[14,16,19,24,28,31,32,32,29,25,20,15] },
  { name:'Shubra El Kheima', lon:31.24, lat:30.12, population:1100000, type:'major',
    monthlyTemps:[13,15,18,23,27,30,31,31,28,24,19,14] },
  { name:'Port Said',        lon:32.30, lat:31.26, population:749000,  type:'major',
    monthlyTemps:[14,15,17,21,24,27,28,29,27,23,18,15] },
  { name:'Suez',             lon:32.54, lat:29.97, population:744000,  type:'major',
    monthlyTemps:[14,16,19,24,28,32,33,33,30,26,20,15] },
  { name:'Luxor',            lon:32.64, lat:25.69, population:506000,  type:'major',
    monthlyTemps:[14,17,21,27,33,37,38,38,35,30,22,16] },
  { name:'Aswan',            lon:32.89, lat:24.09, population:287000,  type:'major',
    monthlyTemps:[16,18,23,29,34,38,39,39,36,32,24,17] },
  { name:'Asyut',            lon:31.18, lat:27.18, population:420000,  type:'major',
    monthlyTemps:[12,15,19,25,30,33,34,34,31,27,20,14] },
  { name:'Mansoura',         lon:31.38, lat:31.04, population:480000,  type:'major',
    monthlyTemps:[12,13,16,20,24,27,28,28,26,22,17,13] },
  { name:'Tanta',            lon:31.00, lat:30.78, population:440000,  type:'major',
    monthlyTemps:[12,14,16,21,25,28,29,29,27,23,17,13] },
  { name:'Faiyum',           lon:30.84, lat:29.31, population:380000,  type:'major',
    monthlyTemps:[13,15,19,24,28,31,32,32,29,25,19,14] },

  // ── Towns ─────────────────────────────────────────────────────────────────
  { name:'Hurghada',     lon:33.83, lat:27.26, population:248000, type:'town',
    monthlyTemps:[17,18,21,25,29,32,33,33,31,28,23,18] },
  { name:'Sharm El Sheikh', lon:34.33, lat:27.91, population:73000, type:'town',
    monthlyTemps:[16,17,19,23,27,30,32,32,30,27,22,17] },
  { name:'Ismailia',     lon:32.28, lat:30.60, population:305000, type:'town',
    monthlyTemps:[13,15,18,23,27,30,31,31,28,24,19,14] },
  { name:'Zagazig',      lon:31.50, lat:30.58, population:290000, type:'town',
    monthlyTemps:[12,13,17,22,26,29,30,30,27,23,17,13] },
  { name:'Damietta',     lon:31.81, lat:31.42, population:260000, type:'town',
    monthlyTemps:[12,13,15,19,22,25,27,27,25,22,17,13] },
  { name:'Minya',        lon:30.73, lat:28.08, population:310000, type:'town',
    monthlyTemps:[13,15,19,25,30,33,34,34,31,27,20,14] },
  { name:'Sohag',        lon:31.70, lat:26.56, population:220000, type:'town',
    monthlyTemps:[13,16,20,26,31,35,36,36,33,28,21,14] },
  { name:'Qena',         lon:32.72, lat:26.16, population:210000, type:'town',
    monthlyTemps:[14,17,21,27,32,36,37,37,34,30,22,15] },
  { name:'Beni Suef',    lon:31.10, lat:29.08, population:220000, type:'town',
    monthlyTemps:[13,15,19,24,29,32,33,33,30,26,19,14] },
  { name:'Kafr El Sheikh',lon:31.10, lat:31.10, population:180000, type:'town',
    monthlyTemps:[12,13,15,20,24,27,28,28,26,22,17,13] },
  { name:'Damanhur',     lon:30.47, lat:31.03, population:225000, type:'town',
    monthlyTemps:[12,13,15,20,24,27,28,28,26,22,17,13] },
  { name:'Mersa Matruh', lon:27.25, lat:31.35, population:60000,  type:'town',
    monthlyTemps:[12,13,14,18,21,24,26,26,24,21,16,13] },
  { name:'Siwa Oasis',   lon:25.52, lat:29.20, population:28000,  type:'town',
    monthlyTemps:[11,13,17,22,27,30,31,31,28,23,17,12] },
  { name:'Kharga Oasis', lon:30.55, lat:25.44, population:70000,  type:'town',
    monthlyTemps:[15,18,22,27,32,35,36,36,33,29,22,16] },
  { name:'Bahariya Oasis',lon:28.87, lat:28.34, population:30000, type:'town',
    monthlyTemps:[13,16,20,25,29,33,34,34,31,26,19,14] },
  { name:'El Arish',     lon:33.80, lat:31.13, population:130000, type:'town',
    monthlyTemps:[13,14,16,20,24,27,29,29,27,23,18,14] },
  { name:'Abu Simbel',   lon:31.62, lat:22.34, population:2600,   type:'town',
    monthlyTemps:[18,21,25,30,35,38,38,38,36,32,25,19] },
  { name:'Nuweiba',      lon:34.66, lat:29.03, population:15000,  type:'town',
    monthlyTemps:[17,18,21,25,30,33,34,34,32,28,23,18] },
];

export default cities;