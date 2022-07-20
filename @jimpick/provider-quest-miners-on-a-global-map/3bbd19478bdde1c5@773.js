// https://observablehq.com/@jimpick/provider-quest-miners-on-a-global-map@773
import define1 from "./5cf93b57a7444002@246.js";
import define2 from "./c4e4a355c53d2a1a@111.js";

function _1(md){return(
md`# Global Map [Provider.Quest]`
)}

function _2(md,quickMenu){return(
md`${quickMenu}`
)}

function _3(md){return(
md`This notebook shows all the storage providers with location data on a Deck.gl-based 3D globe. (Reported locations from IP addresses, non-verified)`
)}

function _container(html){return(
html `<div style="height:800px"></div>`
)}

async function _minerLocationsReport(geoIpLookupsBucketUrl){return(
(await fetch(`${geoIpLookupsBucketUrl}/miner-locations-latest.json`)).json()
)}

async function _minerPowerDailyAverageReport(minerPowerDailyAverageLatestBucketUrl){return(
(await fetch(`${minerPowerDailyAverageLatestBucketUrl}/miner-power-daily-average-latest.json`)).json()
)}

function _data(minerLocationsReport,minerPowerDailyAverageReport){return(
minerLocationsReport.minerLocations
  .filter(({ miner }) => minerPowerDailyAverageReport.miners[miner])
  .map(({ miner, long, lat, numLocations }) => {
    const power = minerPowerDailyAverageReport.miners[miner].qualityAdjPower
    return {
      latitude: Number(lat),
      longitude: Number(long),
      qualityAdjPower: power / numLocations
    }
  })
)}

function _10(md){return(
md`# Visualizing with Deck.gl

We have miner power data and we have location data, so we can visualize it with the [Deck.gl](https://deck.gl/) library using a [HexagonLayer](https://deck.gl/#/documentation/deckgl-api-reference/layers/hexagon-layer). (Based on: [@pessimistress/deck-gl-hexagonlayer-example](https://observablehq.com/@pessimistress/deck-gl-hexagonlayer-example), [@nharrisanalyst/deck-gl](https://observablehq.com/@nharrisanalyst/deck-gl))`
)}

function _deck(require){return(
require.alias({
  // optional dependencies
  h3: {},
  s2Geometry: {}
})('deck.gl@~8.1.7/dist.min.js')
)}

function _luma(deck){return(
deck && window.luma
)}

function _mapboxgl(require){return(
require('mapbox-gl')
)}

function _initialViewState(){return(
{
  latitude: 30,
  longitude: 10,
  zoom: 1.2,
  bearing: 0,
  pitch: 0,
  minZoom: 1,
  maxZoom: 20
}
)}

function _deckgl(deck,container,mapboxgl,initialViewState,hexagonLayer)
{
  return new deck.DeckGL({
    container,
    map: mapboxgl,
    mapboxAccessToken: '',
    // This token is for demo-purpose only and rotated regularly. Get your token at https://www.mapbox.com
    mapboxApiAccessToken: 'pk.eyJ1IjoidWJlcmRhdGEiLCJhIjoiY2pudzRtaWloMDAzcTN2bzN1aXdxZHB5bSJ9.2bkj3IiRC8wj3jLThvDGdA',
    mapStyle: 'mapbox://styles/mapbox/dark-v9',
    initialViewState,
    controller: true,
    layers: [ hexagonLayer ]
  });
}


function _hexagonLayer(deck,data){return(
new deck.HexagonLayer({
  id: 'miners',
  extruded: true,
  data: data,
  radius: 80000,
  getPosition: d => [d.longitude, d.latitude],
  getElevationWeight: d => d.qualityAdjPower,
  elevationAggregation: 'SUM',
  elevationScale: 2000,
  opacity: 0.6,
  colorRange: [
      [0, 170, 0, 255],
      [0, 190, 0, 255],
      [0, 255, 0, 255]
    ]
})
)}

function _17(md){return(
md`## Imports`
)}

function _19(md){return(
md`## Backups`
)}

function _21(backups){return(
backups()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md","quickMenu"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("container")).define("container", ["html"], _container);
  const child1 = runtime.module(define1);
  main.import("geoIpLookupsBucketUrl", child1);
  main.variable(observer("minerLocationsReport")).define("minerLocationsReport", ["geoIpLookupsBucketUrl"], _minerLocationsReport);
  const child2 = runtime.module(define1);
  main.import("minerPowerDailyAverageLatestBucketUrl", child2);
  main.variable(observer("minerPowerDailyAverageReport")).define("minerPowerDailyAverageReport", ["minerPowerDailyAverageLatestBucketUrl"], _minerPowerDailyAverageReport);
  main.variable(observer("data")).define("data", ["minerLocationsReport","minerPowerDailyAverageReport"], _data);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer("deck")).define("deck", ["require"], _deck);
  main.variable(observer("luma")).define("luma", ["deck"], _luma);
  main.variable(observer("mapboxgl")).define("mapboxgl", ["require"], _mapboxgl);
  main.variable(observer("initialViewState")).define("initialViewState", _initialViewState);
  main.variable(observer("deckgl")).define("deckgl", ["deck","container","mapboxgl","initialViewState","hexagonLayer"], _deckgl);
  main.variable(observer("hexagonLayer")).define("hexagonLayer", ["deck","data"], _hexagonLayer);
  main.variable(observer()).define(["md"], _17);
  const child3 = runtime.module(define2);
  main.import("quickMenu", child3);
  main.variable(observer()).define(["md"], _19);
  const child4 = runtime.module(define2);
  main.import("backups", child4);
  main.import("backupNowButton", child4);
  main.variable(observer()).define(["backups"], _21);
  return main;
}
