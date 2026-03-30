/**
 * landmarks.js — Egypt points of interest.
 * size: physical base/width in metres — used by LandmarkRenderer to scale icons.
 * iconType: maps to a renderer in LandmarkRenderer's icon registry.
 */
const landmarks = [
  // ── Pyramids (Giza plateau) ───────────────────────────────────────────────
  { name:'Great Pyramid of Giza (Khufu)', lon:31.1342, lat:29.9792,
    iconType:'pyramid', size:230, description:'Largest pyramid ever built. One of the Seven Wonders of the Ancient World.' },
  { name:'Pyramid of Khafre',            lon:31.1306, lat:29.9765,
    iconType:'pyramid', size:215, description:'Second-largest Giza pyramid, still retains some of its original casing stones at the top.' },
  { name:'Pyramid of Menkaure',          lon:31.1283, lat:29.9728,
    iconType:'pyramid', size:102, description:'Smallest of the three main Giza pyramids.' },

  // ── Pyramids (Saqqara) ────────────────────────────────────────────────────
  { name:'Pyramid of Djoser (Step Pyramid)', lon:31.2165, lat:29.8713,
    iconType:'pyramid', size:121, description:'World\'s oldest stone structure, built c.2650 BC by architect Imhotep.' },
  { name:'Pyramid of Userkaf',           lon:31.2183, lat:29.8733,
    iconType:'pyramid', size:73,  description:'Oldest pyramid at Abusir complex, 5th Dynasty.' },
  { name:'Pyramid of Unas',              lon:31.2147, lat:29.8672,
    iconType:'pyramid', size:57,  description:'Contains the earliest known Pyramid Texts.' },
  { name:'Pyramid of Teti',              lon:31.2197, lat:29.8756,
    iconType:'pyramid', size:78,  description:'First pyramid of the 6th Dynasty.' },

  // ── Pyramids (Dahshur) ────────────────────────────────────────────────────
  { name:'Bent Pyramid',                 lon:31.2078, lat:29.7922,
    iconType:'pyramid', size:188, description:'Unique double-angled sides reflect a change in construction plan.' },
  { name:'Red Pyramid',                  lon:31.2033, lat:29.8083,
    iconType:'pyramid', size:220, description:'First successful true pyramid, built by Sneferu.' },
  { name:'Black Pyramid (Amenemhat III)',lon:31.2264, lat:29.7936,
    iconType:'pyramid', size:105, description:'Middle Kingdom pyramid, now largely collapsed.' },

  // ── Pyramids (other sites) ────────────────────────────────────────────────
  { name:'Pyramid of Meidum',            lon:30.9722, lat:29.3883,
    iconType:'pyramid', size:144, description:'Partially collapsed pyramid, possibly Egypt\'s first true pyramid attempt.' },
  { name:'Pyramid of Hawara',            lon:30.9022, lat:29.2681,
    iconType:'pyramid', size:100, description:'Built by Amenemhat III, associated with the legendary Labyrinth.' },
  { name:'Pyramid of Lahun',             lon:30.9703, lat:29.2444,
    iconType:'pyramid', size:106, description:'Middle Kingdom pyramid at El-Lahun, built by Senusret II.' },
  { name:'Pyramid of Neferirkare',       lon:31.2053, lat:29.8931,
    iconType:'pyramid', size:104, description:'One of the best-preserved Abusir pyramids.' },
  { name:'Pyramid of Sahure',            lon:31.2019, lat:29.8967,
    iconType:'pyramid', size:78,  description:'Contains fine painted reliefs inside.' },

  // ── Temples & monuments ───────────────────────────────────────────────────
  { name:'Abu Simbel Temples',           lon:31.6258, lat:22.3372,
    iconType:'temple', size:35, description:'Twin rock-cut temples of Ramesses II, relocated in the 1960s to avoid flooding.' },
  { name:'Karnak Temple Complex',        lon:32.6573, lat:25.7188,
    iconType:'temple', size:30, description:'Largest ancient religious site in the world, dedicated to Amun-Ra.' },
  { name:'Luxor Temple',                 lon:32.6392, lat:25.6997,
    iconType:'temple', size:25, description:'Built by Amenhotep III and Ramesses II, connected to Karnak by an avenue of sphinxes.' },
  { name:'Valley of the Kings',          lon:32.6014, lat:25.7402,
    iconType:'temple', size:20, description:'Royal burial site with 63 tombs including Tutankhamun\'s.' },
  { name:'Philae Temple',                lon:32.8842, lat:24.0247,
    iconType:'temple', size:18, description:'Island temple of Isis, relocated after the Aswan High Dam construction.' },
  { name:'Temple of Hatshepsut',         lon:32.6075, lat:25.7380,
    iconType:'temple', size:22, description:'Mortuary temple of Egypt\'s most famous female pharaoh.' },
  { name:'Colossi of Memnon',            lon:32.6106, lat:25.7204,
    iconType:'monument', size:18, description:'Two massive stone statues of Pharaoh Amenhotep III.' },
  { name:'Great Sphinx of Giza',         lon:31.1375, lat:29.9753,
    iconType:'monument', size:73, description:'Iconic limestone statue with a lion\'s body and a human head, c.2500 BC.' },
  { name:'Aswan High Dam',               lon:32.8998, lat:23.9700,
    iconType:'monument', size:40, description:'Completed in 1970, controls the Nile flood and generates hydroelectric power.' },
];

export default landmarks;