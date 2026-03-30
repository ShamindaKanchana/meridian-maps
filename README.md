# 🌍 Meridian Maps

> **A modular, pluggable interactive country map framework.**
> Drop in any country as a self-contained module — cities, landmarks, terrain, and climate data included.
> Future-ready with OpenStreetMap, GeoNames & Open-Meteo API integration.

---

## Features

- 🗺️ Interactive SVG maps — zoom, pan, rotate, compass sync
- 🌡️ Monthly temperature overlay per city
- 🏛️ Scaled landmark icons (pyramids, temples, monuments, castles, volcanoes)
- 🏙️ Population-scaled city markers
- 🌍 Pluggable country modules — add any country by dropping in one folder
- 🔌 API-ready bridge for OpenStreetMap, GeoNames, Open-Meteo, Wikipedia

---

## Getting Started

```bash
git clone https://github.com/your-username/meridian-maps.git
cd meridian-maps

# No build step needed — pure ES modules
# Serve with any static server, e.g.:
npx serve .
# or
python -m http.server 8080
```

Open `http://localhost:8080` in your browser.

---

## File Structure

```
meridian-maps/
├── index.html                        # Entry point — HomeUI
├── core/
│   ├── CountryModule.js              # Abstract base class
│   ├── MapEngine.js                  # Zoom, pan, rotate, SVG renderer
│   ├── RegionRenderer.js             # Terrain + water painter
│   ├── LandmarkRenderer.js           # Landmark + city icon renderer
│   ├── TemperatureEngine.js          # Month selector + temperature logic
│   └── ApiAdapter.js                 # Open API bridge (stub, future)
├── modules/
│   └── egypt/
│       ├── EgyptModule.js
│       └── data/
│           ├── meta.js
│           ├── cities.js
│           ├── landmarks.js
│           └── regions.js
├── ui/
│   ├── HomeUI.js
│   ├── MapUI.js
│   ├── Tooltip.js
│   └── CountryCard.js
├── utils/
│   ├── projection.js
│   ├── colorScale.js
│   └── geoMath.js
└── styles/
    ├── base.css
    ├── home.css
    └── map.css
```

---

## Adding a New Country

1. Create `modules/{country}/` folder
2. Add `data/meta.js`, `data/cities.js`, `data/landmarks.js`, `data/regions.js`
3. Create `{Country}Module.js` extending `CountryModule`
4. Register it in `index.html`:

```js
import GreeceModule from './modules/greece/GreeceModule.js';

const registry = new Map([
  ['egypt',  new EgyptModule()],
  ['greece', new GreeceModule()],  // ← add this line
]);
```

That's it. 🎉

---

## CountryModule Interface

Every module must implement:

| Member | Type | Description |
|---|---|---|
| `meta` | getter | name, flag, capital, continent, description, bounds, canvasSize |
| `regions` | getter | Terrain polygons (desert, fertile, forest…) |
| `cities` | getter | Cities with coordinates, population, 12-month temps |
| `landmarks` | getter | POI with iconType, size, description |
| `waterBodies` | getter | Seas, rivers, lakes, canals |
| `terrainLabels` | getter | Floating text labels (optional) |
| `getBounds()` | method | `{ minLon, maxLon, minLat, maxLat }` |
| `getCanvasSize()` | method | `{ width, height }` |
| `onLoad()` | lifecycle | async, called on module activation |
| `onUnload()` | lifecycle | cleanup on module switch |

---

## Landmark Icon Types

Registered in `LandmarkRenderer.js`. Built-in types:

| iconType | Used for |
|---|---|
| `pyramid` | Egyptian pyramids |
| `temple` | Ancient temples |
| `monument` | Obelisks, statues, colossi |
| `castle` | Medieval fortresses |
| `volcano` | Volcanic peaks |

Add custom icons:

```js
import LandmarkRenderer from './core/LandmarkRenderer.js';

LandmarkRenderer.registerIcon('pagoda', (g, sz) => {
  // draw SVG elements into g at scale sz
});
```

---

## Future API Integration

`core/ApiAdapter.js` contains ready-to-wire stubs for:

| API | Data | Free |
|---|---|---|
| RestCountries | Country meta, flag, population | ✅ |
| Open-Meteo | Historical monthly temperatures | ✅ |
| GeoNames | City populations, coordinates | ✅ (account needed) |
| Overpass (OSM) | Landmarks, POI | ✅ |
| Wikipedia | Landmark descriptions | ✅ |

---

## License

MIT — free to use, extend, and contribute.

---

*Built with ❤️ — no dependencies, no build tools, pure ES modules.*