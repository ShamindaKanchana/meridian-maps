/**
 * EgyptModule.js — Concrete country module for Egypt.
 * Extends CountryModule and wires together all Egypt data files.
 * Drop this into CountryRegistry to make Egypt available in the HomeUI.
 */
import CountryModule from '../../core/CountryModule.js';
import meta          from './data/meta.js';
import regions       from './data/regions.js';
import cities        from './data/cities.js';
import landmarks     from './data/landmarks.js';

export default class EgyptModule extends CountryModule {

  // ── Metadata ──────────────────────────────────────────────────────────────
  get meta()       { return meta; }

  // ── Data layers ───────────────────────────────────────────────────────────
  get regions()    { return regions; }
  get cities()     { return cities; }
  get landmarks()  { return landmarks; }

  get waterBodies() {
    return [
      // Mediterranean Sea (north border)
      { name:'Mediterranean Sea', type:'sea', color:'#1e5a8c', opacity:0.9, closed:true,
        points:[[24.7,31.7],[37,31.7],[37,32.5],[24.7,32.5]] },
      // Red Sea
      { name:'Red Sea', type:'sea', color:'#1e6bb5', opacity:0.8, closed:true,
        points:[[32.5,30.1],[37,28],[37,22],[35,22],[33,24],[32,26],[32.2,28.5],[32.2,30.1]] },
      // Gulf of Aqaba
      { name:'Gulf of Aqaba', type:'gulf', color:'#1e6bb5', opacity:0.7, closed:true,
        points:[[34.9,29.5],[35.2,29],[35,28],[34.6,28.2],[34.3,28.8],[34.5,29.5]] },
      // Suez Canal zone
      { name:'Suez Canal', type:'canal', color:'#2a7fc0', opacity:0.7, closed:true,
        points:[[32.3,30.9],[32.6,29.9],[32.4,28.8],[32.0,29.2],[32.0,30.5]] },
      // Nile River (polyline)
      { name:'Nile River', type:'river', color:'#1e6bb5', opacity:0.9, closed:false,
        points:[
          [31,22],[31.1,23],[31.2,24],[31.3,25],[31.2,26],[31.1,27],
          [31,28],[30.8,29],[30.5,29.5],[30.2,30],[30.1,30.3],[30,30.7],[30.2,31.2],
        ]},
      // Lake Nasser
      { name:'Lake Nasser', type:'lake', color:'#1e6bb5', opacity:0.8, closed:true,
        points:[[32.5,23],[33,22.5],[33,22],[31,22],[31,22.5]] },
    ];
  }

  get terrainLabels() {
    return [
      { text:'WESTERN DESERT', lon:27,   lat:27,   rotation:-5, fontSize:11, opacity:0.5 },
      { text:'EASTERN DESERT', lon:33.3, lat:27.5, rotation:-5, fontSize:11, opacity:0.5 },
      { text:'SINAI',          lon:33.8, lat:29.5, rotation:0,  fontSize:10, opacity:0.5 },
      { text:'NUBIAN DESERT',  lon:28,   lat:23.5, rotation:-5, fontSize:11, opacity:0.5 },
      { text:'MEDITERRANEAN SEA', lon:31, lat:32.1, rotation:0, fontSize:12, opacity:0.8 },
      { text:'RED SEA',        lon:35.5, lat:26,   rotation:65, fontSize:9,  opacity:0.8 },
    ];
  }

  // ── Projection ────────────────────────────────────────────────────────────
  getBounds()     { return meta.bounds; }
  getCanvasSize() { return meta.canvasSize; }

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  async onLoad() {
    console.log('[EgyptModule] Loaded');
    // Future: await ApiAdapter.enrichCities(this) etc.
  }

  onUnload() {
    console.log('[EgyptModule] Unloaded');
  }

  // ── API enrichment (future) ───────────────────────────────────────────────
  mergeApiData({ cities: apiCities, temperatures } = {}) {
    // When ApiAdapter fetches live data, this method merges it into static arrays.
    // For now it's a no-op — override when ready.
    console.log('[EgyptModule] mergeApiData called (no-op until ApiAdapter is wired)');
  }
}