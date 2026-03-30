/**
 * meta.js — Egypt country metadata.
 * Consumed by HomeUI (card display) and MapEngine (canvas setup, projection bounds).
 */
const meta = {
  id:          'egypt',
  name:        'Egypt',
  flag:        '🇪🇬',
  capital:     'Cairo',
  continent:   'Africa',
  description: 'Land of pharaohs, pyramids, and the world\'s longest river. '
             + 'Mostly desert, with the fertile Nile Valley and Delta sustaining '
             + 'the majority of its 105 million people.',
  coverImage:  null,           // future: path to a static preview image

  // Geographic bounding box — used by Projection
  bounds: {
    minLon: 24.7,
    maxLon: 37.0,
    minLat: 22.0,
    maxLat: 31.7,
  },

  // SVG canvas dimensions (aspect ratio should match bounds span)
  canvasSize: { width: 900, height: 820 },

  // Months — shared across all modules (could live in a shared constants file)
  months: [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ],
};

export default meta;