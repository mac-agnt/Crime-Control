// Geographic projection for the Live Site Board map.
// Real lng/lat, Web-Mercator projected into a 0..100 SVG/percent space so the
// coastline, Liffey, M50 and every site pin sit on their true Dublin location.
// No map library, no network tiles — renders fully offline.

export const BBOX = { west: -6.55, east: -6.03, north: 53.5, south: 53.16 };

const mercY = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export function project(lng: number, lat: number): { x: number; y: number } {
  const x = ((lng - BBOX.west) / (BBOX.east - BBOX.west)) * 100;
  const yTop = mercY(BBOX.north);
  const yBot = mercY(BBOX.south);
  const y = ((yTop - mercY(lat)) / (yTop - yBot)) * 100;
  // fixed precision so SSR and client serialize identically (no hydration drift)
  return { x: +clamp(x, 2, 98).toFixed(3), y: +clamp(y, 2, 98).toFixed(3) };
}

const pts = (arr: [number, number][]) =>
  arr.map(([lng, lat]) => { const p = project(lng, lat); return `${p.x.toFixed(2)},${p.y.toFixed(2)}`; }).join(" ");

// Coastline, north -> south (Rush, Malahide, Howth Head, Dublin Bay, Dún Laoghaire, Dalkey, Bray)
const COAST_GEO: [number, number][] = [
  [-6.1, 53.52],
  [-6.11, 53.47],
  [-6.15, 53.451],
  [-6.13, 53.42],
  [-6.08, 53.39],
  [-6.06, 53.374], // Howth Head
  [-6.1, 53.383],
  [-6.15, 53.366], // Bull Island / Clontarf
  [-6.17, 53.348], // Liffey mouth
  [-6.21, 53.339], // Sandymount
  [-6.2, 53.317],
  [-6.185, 53.301], // Blackrock
  [-6.15, 53.294], // Dún Laoghaire
  [-6.11, 53.284], // Sandycove
  [-6.08, 53.272], // Sorrento / Dalkey
  [-6.09, 53.25],
  [-6.08, 53.19], // Bray Head
];

// Sea polygon: coastline then out to the east/bottom edge.
export const SEA_POLY = (() => {
  const last = project(COAST_GEO[COAST_GEO.length - 1][0], COAST_GEO[COAST_GEO.length - 1][1]);
  return pts(COAST_GEO) + ` 100,${last.y.toFixed(2)} 100,0`;
})();

export const COAST_LINE = pts(COAST_GEO);

export const LIFFEY = pts([
  [-6.35, 53.348],
  [-6.32, 53.347],
  [-6.3, 53.347],
  [-6.27, 53.347],
  [-6.25, 53.348],
  [-6.24, 53.347],
  [-6.21, 53.347],
  [-6.18, 53.347],
  [-6.17, 53.348],
]);

// Great South Wall / Poolbeg spit jutting into the bay
export const POOLBEG = pts([
  [-6.21, 53.343],
  [-6.17, 53.343],
  [-6.152, 53.342],
]);

// M50 orbital (open arc down the west), plus M1 north and M11 south
export const M50 = pts([
  [-6.235, 53.44],
  [-6.26, 53.42],
  [-6.31, 53.408],
  [-6.377, 53.393],
  [-6.405, 53.36],
  [-6.407, 53.34],
  [-6.4, 53.3],
  [-6.36, 53.278],
  [-6.3, 53.265],
  [-6.24, 53.245],
  [-6.16, 53.21],
]);

export const GRAND_CANAL = pts([
  [-6.3, 53.333],
  [-6.27, 53.333],
  [-6.25, 53.335],
  [-6.23, 53.339],
  [-6.21, 53.34],
]);

export const ROYAL_CANAL = pts([
  [-6.3, 53.361],
  [-6.27, 53.359],
  [-6.25, 53.357],
  [-6.235, 53.352],
]);

// Phoenix Park polygon
export const PHOENIX_PARK = pts([
  [-6.353, 53.363],
  [-6.311, 53.362],
  [-6.309, 53.35],
  [-6.351, 53.349],
]);

export const MAP_LABELS: { text: string; lng: number; lat: number }[] = [
  { text: "DUBLIN BAY", lng: -6.13, lat: 53.335 },
  { text: "Howth", lng: -6.075, lat: 53.38 },
  { text: "Dún Laoghaire", lng: -6.16, lat: 53.29 },
  { text: "City centre", lng: -6.275, lat: 53.343 },
  { text: "M50", lng: -6.4, lat: 53.325 },
  { text: "Phoenix Pk", lng: -6.333, lat: 53.356 },
];
