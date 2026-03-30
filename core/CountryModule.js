/**
 * CountryModule.js — Abstract base class
 * Every country module MUST extend this class and implement all abstract members.
 * The MapEngine will call lifecycle hooks and read the data properties defined here.
 */
export default class CountryModule {

  constructor() {
    if (new.target === CountryModule) {
      throw new Error('CountryModule is abstract — extend it, do not instantiate directly.');
    }
  }

  // ─── Required metadata ───────────────────────────────────────────────────

  /** @returns {{ name, flag, capital, description, canvasW, canvasH }} */
  get meta() { this._abstract('meta'); }

  // ─── Required data layers ────────────────────────────────────────────────

  /**
   * Terrain / region polygons painted as the base map layer.
   * @returns {Array<{
   *   name: string,
   *   type: 'desert'|'forest'|'fertile'|'water'|'mountain'|'urban',
   *   color: string,
   *   opacity: number,
   *   points: Array<[lon, lat]>   // closed polygon
   * }>}
   */
  get regions() { this._abstract('regions'); }

  /**
   * Cities and towns rendered as dots with population scaling.
   * @returns {Array<{
   *   name: string,
   *   lon: number, lat: number,
   *   population: number,
   *   type: 'capital'|'major'|'town'|'village',
   *   monthlyTemps: number[]   // 12 values Jan–Dec in °C
   * }>}
   */
  get cities() { this._abstract('cities'); }

  /**
   * Points of interest — pyramids, temples, ruins, etc.
   * @returns {Array<{
   *   name: string,
   *   lon: number, lat: number,
   *   iconType: string,    // e.g. 'pyramid', 'temple', 'castle', 'volcano'
   *   size: number,        // relative physical size (e.g. base in metres) — used for icon scaling
   *   description: string
   * }>}
   */
  get landmarks() { this._abstract('landmarks'); }

  /**
   * Rivers, seas, lakes as polylines or polygons.
   * @returns {Array<{
   *   name: string,
   *   type: 'river'|'lake'|'sea'|'canal'|'gulf',
   *   color: string,
   *   opacity: number,
   *   points: Array<[lon, lat]>,
   *   closed: boolean   // true = polygon (lake/sea), false = polyline (river)
   * }>}
   */
  get waterBodies() { this._abstract('waterBodies'); }

  /**
   * Text labels to render over terrain (sea names, desert names, etc.)
   * @returns {Array<{
   *   text: string,
   *   lon: number, lat: number,
   *   rotation: number,   // degrees
   *   fontSize: number,
   *   opacity: number
   * }>}
   */
  get terrainLabels() { return []; } // optional — default empty

  // ─── Projection config ───────────────────────────────────────────────────

  /**
   * Geographic bounds — used by MapEngine to set up the lon/lat → pixel projection.
   * @returns {{ minLon, maxLon, minLat, maxLat }}
   */
  getBounds() { this._abstract('getBounds'); }

  /**
   * SVG canvas dimensions for this country.
   * Wider countries need a wider canvas, taller need more height.
   * @returns {{ width: number, height: number }}
   */
  getCanvasSize() { this._abstract('getCanvasSize'); }

  // ─── Lifecycle hooks ─────────────────────────────────────────────────────

  /**
   * Called by MapEngine when this country is selected and about to be rendered.
   * Use for any async setup (e.g. fetching API data in the future).
   * @returns {Promise<void>}
   */
  async onLoad() {}

  /**
   * Called by MapEngine when switching away from this country.
   * Clean up any event listeners or timers here.
   */
  onUnload() {}

  // ─── Optional API enrichment hook (future phase) ─────────────────────────

  /**
   * Called by ApiAdapter when live data is available.
   * Modules can override this to merge API data into their static data.
   * @param {{ cities?, landmarks?, temperatures? }} apiData
   */
  mergeApiData(apiData) {
    // Default: silently ignore — subclass overrides when ready
  }

  // ─── Internal helper ─────────────────────────────────────────────────────

  _abstract(name) {
    throw new Error(`${this.constructor.name} must implement "${name}"`);
  }
}