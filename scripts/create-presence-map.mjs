import { readFile, writeFile } from 'node:fs/promises';

// Source boundaries: johan/world.geo.json and angelnmara/geojson.
const world = JSON.parse(await readFile(new URL('../public/maps/world.geojson', import.meta.url), 'utf8'));
const mexico = JSON.parse(await readFile(new URL('../public/maps/mexico.geojson', import.meta.url), 'utf8'));
const yucatan = mexico.features.find(f => f.properties.id === 'MX-YUC');
const project = ([lon, lat]) => [550 + lon * 2.85, 45 + (85 - lat) * 2.85];
const inset = ([lon, lat]) => [830 + (lon + 118) * 6.2, 414 + (33 - lat) * 6.2];
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
function path(geometry, projection = project) {
 const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
 return polygons.map(polygon => polygon.map(ring => ring.map((p, i) => (i ? 'L' : 'M') + projection(p).map(n => n.toFixed(1)).join(',')).join('') + 'Z').join('')).join('');
}
const highlighted = new Set(['Mexico', 'Spain', 'Argentina', 'Colombia']);
let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 570" role="img" aria-labelledby="world-map-title world-map-description"><title id="world-map-title">Nuestra presencia en el mundo</title><desc id="world-map-description">México, España, Londres en Reino Unido, Argentina y Colombia. México se muestra en naranja y Yucatán en naranja intenso, también en una ampliación de México.</desc><style>.land{fill:#cfc6b5;stroke:#f5efe4;stroke-width:.65;stroke-linejoin:round}.presence-country{fill:#e85b3b}.yucatan{fill:#a32c19;stroke:#fff4df;stroke-width:1}.map-label{font:600 16px Arial,sans-serif;fill:#292722;paint-order:stroke;stroke:#f5efe4;stroke-width:5;stroke-linejoin:round}.map-line{fill:none;stroke:#7a5a49;stroke-width:1.2}.pin{fill:#a32c19;stroke:#fff4df;stroke-width:2}.inset-label{font:600 13px Arial,sans-serif;fill:#50483c}</style><rect x="0" y="0" width="1100" height="570" rx="8" fill="#f5efe4"/>`;
for (const lat of [-30, 0, 30, 60]) {
 const y = project([0, lat])[1];
 svg += `<path d="M30 ${y}H1070" stroke="#ded6c7" stroke-dasharray="3 7"/>`;
}
for (const f of world.features.filter(f => f.properties.name !== 'Antarctica')) {
 svg += `<path class="land${highlighted.has(f.properties.name) ? ' presence-country' : ''}" d="${path(f.geometry)}"><title>${escape(f.properties.name)}</title></path>`;
}
svg += `<path class="yucatan" d="${path(yucatan.geometry)}"><title>Yucatán</title></path>`;
const places = [
 ['México', [-102, 24], [-138, 14]],
 ['Yucatán', [-89, 20.8], [-74, 5]],
 ['España', [-3.7, 40.4], [-31, 32]],
 ['Londres', [-.1276, 51.5072], [10, 65]],
 ['Colombia', [-73, 4], [-111, -10]],
 ['Argentina', [-64, -35], [-96, -47]],
];
for (const [name, coords, label] of places) {
 const [x,y] = project(coords), [lx,ly] = project(label);
 svg += `<g><path class="map-line" d="M${x} ${y}L${lx} ${ly - 6}"/><circle class="pin" cx="${x}" cy="${y}" r="4.5"/><text class="map-label" x="${lx}" y="${ly}">${name}</text></g>`;
}
svg += `<rect x="806" y="390" width="270" height="165" rx="6" fill="#eee7da" stroke="#b5aa97"/><text class="inset-label" x="822" y="412">México · Detalle de Yucatán</text>`;
for (const f of mexico.features) svg += `<path class="land ${f.properties.id === 'MX-YUC' ? 'yucatan' : 'presence-country'}" d="${path(f.geometry, inset)}"/>`;
const [yx,yy] = inset([-89,20.8]);
svg += `<path class="map-line" d="M${yx} ${yy}L1015 540"/><text class="inset-label" x="965" y="547">Yucatán</text></svg>`;
await writeFile(new URL('../public/maps/presence.svg', import.meta.url), svg);
console.log('Mapa de presencia generado con límites de países y de Yucatán.');
