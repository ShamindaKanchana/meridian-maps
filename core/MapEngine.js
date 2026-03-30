/**
 * MapEngine.js — Core SVG renderer.
 * Handles zoom, pan, rotate, compass sync, and mounts a CountryModule.
 * All rendering delegates to RegionRenderer, LandmarkRenderer, TemperatureEngine.
 */
import Projection      from '../utils/projection.js';
import { clampTransform, zoomAt, buildTransform } from '../utils/geoMath.js';
import RegionRenderer  from './RegionRenderer.js';
import LandmarkRenderer from './LandmarkRenderer.js';
import TemperatureEngine from './TemperatureEngine.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

export default class MapEngine {

  /**
   * @param {HTMLElement} container   The element that holds the SVG
   * @param {HTMLElement} compassEl   The compass SVG element
   */
  constructor(container, compassEl) {
    this.container  = container;
    this.compassEl  = compassEl;
    this.module     = null;
    this.projection = null;
    this.svg        = null;
    this.transform  = { tx: 0, ty: 0, scale: 1, rotation: 0 };
    this._dragging  = false;
    this._lastX = 0;
    this._lastY = 0;
    this._lastDist  = 0;
  }

  // ── Module lifecycle ───────────────────────────────────────────────────────

  async mount(module) {
    if (this.module) {
      this.module.onUnload();
      this._detachEvents();
    }
    this.module = module;
    await module.onLoad();

    const { width, height } = module.getCanvasSize();
    this.projection = new Projection(module.getBounds(), { width, height });

    this._buildSvg(width, height);
    this._render();
    this._fitToContainer();
    this._attachEvents();
  }

  unmount() {
    if (this.module) this.module.onUnload();
    this._detachEvents();
    this.module = null;
    if (this.svg) this.svg.remove();
  }

  // ── SVG setup ──────────────────────────────────────────────────────────────

  _buildSvg(w, h) {
    if (this.svg) this.svg.remove();
    this.svg = document.createElementNS(SVG_NS, 'svg');
    this.svg.setAttribute('width', w);
    this.svg.setAttribute('height', h);
    this.svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    this.svg.style.position = 'absolute';
    this.svg.style.top = '0';
    this.svg.style.left = '0';
    this.container.appendChild(this.svg);
  }

  // ── Full render ────────────────────────────────────────────────────────────

  _render() {
    if (!this.svg || !this.module) return;
    this.svg.innerHTML = '';

    const g = document.createElementNS(SVG_NS, 'g');
    g.setAttribute('id', 'map-root');
    this.svg.appendChild(g);

    // Background
    const { width: W, height: H } = this.module.getCanvasSize();
    const bg = document.createElementNS(SVG_NS, 'rect');
    bg.setAttribute('x', 0); bg.setAttribute('y', 0);
    bg.setAttribute('width', W); bg.setAttribute('height', H);
    bg.setAttribute('fill', '#1a3a5c');
    g.appendChild(bg);

    // Layers
    RegionRenderer.render(g, this.module.regions,      this.projection);
    RegionRenderer.renderWater(g, this.module.waterBodies, this.projection);
    RegionRenderer.renderLabels(g, this.module.terrainLabels, this.projection);
    LandmarkRenderer.renderCities(g, this.module.cities, this.projection,
      this._currentMonth());
    LandmarkRenderer.renderLandmarks(g, this.module.landmarks, this.projection);

    this._applyTransform();
  }

  // ── Transform helpers ──────────────────────────────────────────────────────

  _applyTransform() {
    const root = this.svg?.querySelector('#map-root');
    if (!root) return;
    const { width: W, height: H } = this.module.getCanvasSize();
    root.setAttribute('transform',
      buildTransform({ ...this.transform, cx: W / 2, cy: H / 2 }));
    this._syncCompass();
  }

  _fitToContainer() {
    const { width: W, height: H } = this.module.getCanvasSize();
    const vw = this.container.clientWidth;
    const vh = this.container.clientHeight;
    const scale = Math.max(vw / W, vh / H);
    this.transform = {
      tx: (vw - W * scale) / 2,
      ty: (vh - H * scale) / 2,
      scale,
      rotation: 0,
    };
    this._applyTransform();
  }

  _clamp() {
    const { width: W, height: H } = this.module.getCanvasSize();
    const vp = { width: this.container.clientWidth, height: this.container.clientHeight };
    const clamped = clampTransform(this.transform, { W, H }, vp);
    this.transform = { ...this.transform, ...clamped };
  }

  // ── Public controls ────────────────────────────────────────────────────────

  zoomIn()  { this._zoomBy(1.35); }
  zoomOut() { this._zoomBy(1 / 1.35); }

  rotateLeft()  { this.transform.rotation = (this.transform.rotation - 15 + 360) % 360; this._applyTransform(); }
  rotateRight() { this.transform.rotation = (this.transform.rotation + 15) % 360;       this._applyTransform(); }

  reset() {
    this.transform.rotation = 0;
    this._fitToContainer();
  }

  /** Called by TemperatureEngine when month changes — re-renders city layer only. */
  refreshCities() { this._render(); }

  // ── Zoom helper ────────────────────────────────────────────────────────────

  _zoomBy(factor) {
    const vw = this.container.clientWidth;
    const vh = this.container.clientHeight;
    const { width: W, height: H } = this.module.getCanvasSize();
    const minScale = Math.max(vw / W, vh / H);
    const newScale = Math.min(Math.max(this.transform.scale * factor, minScale), 8);
    const updated = zoomAt(this.transform, newScale / this.transform.scale, vw / 2, vh / 2);
    this.transform = { ...this.transform, ...updated };
    this._clamp();
    this._applyTransform();
  }

  // ── Compass sync ───────────────────────────────────────────────────────────

  _syncCompass() {
    const needle = this.compassEl?.querySelector('#compass-rotate-group');
    if (needle) needle.setAttribute('transform',
      `rotate(${this.transform.rotation}, 30, 30)`);
  }

  // ── Current month ──────────────────────────────────────────────────────────

  _currentMonth() {
    return TemperatureEngine.currentMonth ?? new Date().getMonth();
  }

  // ── Event handling ─────────────────────────────────────────────────────────

  _attachEvents() {
    this._onMouseDown = e => { this._dragging = true; this._lastX = e.clientX; this._lastY = e.clientY; };
    this._onMouseUp   = () => { this._dragging = false; };
    this._onMouseMove = e => {
      if (!this._dragging) return;
      this.transform.tx += e.clientX - this._lastX;
      this.transform.ty += e.clientY - this._lastY;
      this._lastX = e.clientX; this._lastY = e.clientY;
      this._clamp();
      this._applyTransform();
    };
    this._onWheel = e => {
      e.preventDefault();
      const rect = this.container.getBoundingClientRect();
      const fx = e.clientX - rect.left, fy = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      const { width: W, height: H } = this.module.getCanvasSize();
      const vw = this.container.clientWidth, vh = this.container.clientHeight;
      const minScale = Math.max(vw / W, vh / H);
      const newScale = Math.min(Math.max(this.transform.scale * factor, minScale), 8);
      const updated = zoomAt(this.transform, newScale / this.transform.scale, fx, fy);
      this.transform = { ...this.transform, ...updated };
      this._clamp();
      this._applyTransform();
    };
    this._onTouchStart = e => {
      if (e.touches.length === 1) { this._dragging = true; this._lastX = e.touches[0].clientX; this._lastY = e.touches[0].clientY; }
      if (e.touches.length === 2) this._lastDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    };
    this._onTouchEnd   = () => { this._dragging = false; };
    this._onTouchMove  = e => {
      if (e.touches.length === 1 && this._dragging) {
        this.transform.tx += e.touches[0].clientX - this._lastX;
        this.transform.ty += e.touches[0].clientY - this._lastY;
        this._lastX = e.touches[0].clientX; this._lastY = e.touches[0].clientY;
        this._clamp(); this._applyTransform();
      }
      if (e.touches.length === 2) {
        const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        const factor = d / this._lastDist;
        this._lastDist = d;
        const { width: W, height: H } = this.module.getCanvasSize();
        const vw = this.container.clientWidth, vh = this.container.clientHeight;
        const minScale = Math.max(vw / W, vh / H);
        this.transform.scale = Math.min(Math.max(this.transform.scale * factor, minScale), 8);
        this._clamp(); this._applyTransform();
      }
    };

    this.container.addEventListener('mousedown',  this._onMouseDown);
    window.addEventListener('mouseup',            this._onMouseUp);
    window.addEventListener('mousemove',          this._onMouseMove);
    this.container.addEventListener('wheel',      this._onWheel, { passive: false });
    this.container.addEventListener('touchstart', this._onTouchStart, { passive: true });
    this.container.addEventListener('touchend',   this._onTouchEnd,   { passive: true });
    this.container.addEventListener('touchmove',  this._onTouchMove,  { passive: true });
  }

  _detachEvents() {
    this.container.removeEventListener('mousedown',  this._onMouseDown);
    window.removeEventListener('mouseup',            this._onMouseUp);
    window.removeEventListener('mousemove',          this._onMouseMove);
    this.container.removeEventListener('wheel',      this._onWheel);
    this.container.removeEventListener('touchstart', this._onTouchStart);
    this.container.removeEventListener('touchend',   this._onTouchEnd);
    this.container.removeEventListener('touchmove',  this._onTouchMove);
  }
}