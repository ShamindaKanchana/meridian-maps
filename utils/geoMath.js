/**
 * geoMath.js — Geometric and geographic utility helpers.
 * Used by MapEngine for clamping, transform math, and bearing calculations.
 */

/** Clamp a number between min and max. */
export function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

/** Linear interpolation between a and b by t (0–1). */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/** Degrees to radians. */
export function toRad(deg) { return deg * Math.PI / 180; }

/** Radians to degrees. */
export function toDeg(rad) { return rad * 180 / Math.PI; }

/**
 * Haversine distance between two lon/lat points in kilometres.
 * Useful for future scale-bar rendering.
 */
export function haversineKm(lon1, lat1, lon2, lat2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Compute the clamped pan/scale transform so the map never shows empty background.
 * @param {{ tx, ty, scale }} transform   current transform state
 * @param {{ W, H }} canvas              SVG canvas dimensions
 * @param {{ width, height }} viewport   container element dimensions
 * @returns {{ tx, ty, scale }}          clamped transform
 */
export function clampTransform({ tx, ty, scale }, { W, H }, { width, height }) {
  const minScale = Math.max(width / W, height / H);
  const s = clamp(scale, minScale, 8);
  const maxTx = 0, maxTy = 0;
  const minTx = width  - W * s;
  const minTy = height - H * s;
  return {
    scale: s,
    tx: clamp(tx, minTx, maxTx),
    ty: clamp(ty, minTy, maxTy),
  };
}

/**
 * Zoom toward a focal point (mouse position or screen center).
 * @param {{ tx, ty, scale }} t   current transform
 * @param {number} factor         zoom factor (>1 = in, <1 = out)
 * @param {number} fx             focal x in viewport px
 * @param {number} fy             focal y in viewport px
 * @returns {{ tx, ty, scale }}
 */
export function zoomAt({ tx, ty, scale }, factor, fx, fy) {
  const newScale = scale * factor;
  return {
    scale: newScale,
    tx: fx - (fx - tx) * (newScale / scale),
    ty: fy - (fy - ty) * (newScale / scale),
  };
}

/** Build a CSS / SVG transform string from { tx, ty, scale, rotation, cx, cy }. */
export function buildTransform({ tx, ty, scale, rotation = 0, cx = 0, cy = 0 }) {
  return `translate(${tx},${ty}) scale(${scale}) rotate(${rotation},${cx},${cy})`;
}