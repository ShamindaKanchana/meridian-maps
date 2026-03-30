/**
 * ApiAdapter.js — Bridge to open-source geographic APIs.
 * Currently a stub — all methods return null gracefully so the app
 * falls back to static module data. Wire up API calls here in future phases.
 *
 * Supported APIs (future):
 *  - RestCountries   https://restcountries.com/v3.1
 *  - GeoNames        https://api.geonames.org
 *  - Open-Meteo      https://api.open-meteo.com
 *  - Overpass (OSM)  https://overpass-api.de/api/interpreter
 *  - Wikipedia       https://en.wikipedia.org/api/rest_v1
 */
export default class ApiAdapter {

  // ── RestCountries ─────────────────────────────────────────────────────────

  /**
   * Fetch country metadata (name, capital, population, flag, region).
   * @param {string} countryCode  ISO 3166-1 alpha-2, e.g. 'EG'
   * @returns {Promise<object|null>}
   */
  static async fetchCountryMeta(countryCode) {
    try {
      const res = await fetch(
        `https://restcountries.com/v3.1/alpha/${countryCode}`
      );
      const [data] = await res.json();
      return {
        name:       data.name.common,
        capital:    data.capital?.[0] ?? '',
        population: data.population,
        flag:       data.flag,
        region:     data.region,
        subregion:  data.subregion,
      };
    } catch (e) {
      console.warn('[ApiAdapter] fetchCountryMeta failed:', e.message);
      return null;
    }
  }

  // ── Open-Meteo ────────────────────────────────────────────────────────────

  /**
   * Fetch historical monthly average temperatures for a lat/lon.
   * Returns a 12-element array [Jan..Dec] in °C, or null on failure.
   * @param {number} lat
   * @param {number} lon
   * @returns {Promise<number[]|null>}
   */
  static async fetchMonthlyTemps(lat, lon) {
    try {
      const url = new URL('https://api.open-meteo.com/v1/climate');
      url.searchParams.set('latitude',  lat);
      url.searchParams.set('longitude', lon);
      url.searchParams.set('models',    'EC_Earth3P_HR');
      url.searchParams.set('monthly',   'temperature_2m_mean');
      url.searchParams.set('start_date','1991-01-01');
      url.searchParams.set('end_date',  '2020-12-31');
      const res  = await fetch(url);
      const data = await res.json();
      // data.monthly.temperature_2m_mean is an array of 360 monthly values
      // Average each calendar month across all years
      const raw = data.monthly?.temperature_2m_mean ?? [];
      const byMonth = Array.from({ length: 12 }, (_, m) => {
        const vals = raw.filter((_, i) => i % 12 === m);
        return parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1));
      });
      return byMonth;
    } catch (e) {
      console.warn('[ApiAdapter] fetchMonthlyTemps failed:', e.message);
      return null;
    }
  }

  // ── GeoNames ──────────────────────────────────────────────────────────────

  /**
   * Fetch top populated cities in a country.
   * Requires a free GeoNames username — pass via config.
   * @param {string} countryCode  ISO 3166-1 alpha-2
   * @param {string} username     GeoNames account username
   * @param {number} maxRows
   * @returns {Promise<Array|null>}
   */
  static async fetchCities(countryCode, username, maxRows = 50) {
    try {
      const url = `https://secure.geonames.org/searchJSON`
        + `?country=${countryCode}&featureClass=P&orderby=population`
        + `&maxRows=${maxRows}&username=${username}`;
      const res  = await fetch(url);
      const data = await res.json();
      return (data.geonames ?? []).map(g => ({
        name:       g.name,
        lon:        parseFloat(g.lng),
        lat:        parseFloat(g.lat),
        population: parseInt(g.population) || 0,
      }));
    } catch (e) {
      console.warn('[ApiAdapter] fetchCities failed:', e.message);
      return null;
    }
  }

  // ── Overpass (OSM) ────────────────────────────────────────────────────────

  /**
   * Fetch points of interest by OSM tag within a bounding box.
   * Example: fetchPOI({ s:22, w:24.7, n:31.7, e:37 }, 'historic', 'archaeological_site')
   * @param {{ s, w, n, e }} bbox
   * @param {string} key    OSM tag key   e.g. 'historic'
   * @param {string} value  OSM tag value e.g. 'archaeological_site'
   * @returns {Promise<Array|null>}
   */
  static async fetchPOI(bbox, key, value) {
    try {
      const query = `
        [out:json][timeout:25];
        node["${key}"="${value}"](${bbox.s},${bbox.w},${bbox.n},${bbox.e});
        out body;
      `;
      const res  = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body:   `data=${encodeURIComponent(query)}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const data = await res.json();
      return (data.elements ?? []).map(el => ({
        name: el.tags?.name ?? el.tags?.['name:en'] ?? 'Unknown',
        lon:  el.lon,
        lat:  el.lat,
        tags: el.tags,
      }));
    } catch (e) {
      console.warn('[ApiAdapter] fetchPOI failed:', e.message);
      return null;
    }
  }

  // ── Wikipedia ─────────────────────────────────────────────────────────────

  /**
   * Fetch a short summary for a landmark or city from Wikipedia.
   * @param {string} title  Wikipedia article title
   * @returns {Promise<string|null>}
   */
  static async fetchWikiSummary(title) {
    try {
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
      const res  = await fetch(url);
      const data = await res.json();
      return data.extract ?? null;
    } catch (e) {
      console.warn('[ApiAdapter] fetchWikiSummary failed:', e.message);
      return null;
    }
  }
}