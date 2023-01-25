import define1 from "./5cf93b57a7444002@282.js";
import define2 from "./c4e4a355c53d2a1a@111.js";
import define3 from "./2cbde4d083878213@508.js";
import define4 from "./450051d7f1174df8@254.js";

function _1(md){return(
md`# Deals: Trips [Provider.Quest]`
)}

function _2(md){return(
md`Note: Under construction!`
)}

function _3(md,quickMenu){return(
md`${quickMenu}`
)}

function _4(md){return(
md`This notebook shows deals with storage providers with location data on a Deck.gl-based 3D globe. (Reported locations from IP addresses, non-verified). Client locations are fictionalized.`
)}

function _elapsed(Scrubber,d3,startTime,endTime){return(
Scrubber(d3.range(startTime, endTime, (endTime - startTime) / 40000), {
  delay: 50,
  loop: false,
  autoplay: false,
  initial: 0
})
)}

function _6(elapsed){return(
new Date(elapsed)
)}

function _7(Plot){return(
Plot.plot({
  marks: [
    Plot.cell(['Unverified', 'Verified'], {x: d => d, fill: d => d})
  ]
})
)}

function _container(html){return(
html `<div style="height:600px"></div>`
)}

function _overlayLayer(deck,formatInTimeZone,$0,colorBlue,colorOrange){return(
() => {
  return new deck.TextLayer({
    id: 'overlay-layer',
    data: [
      {
        text: 'Filecoin Published Deals',
        position: [ -200, -120 ],
        size: 24,
        color: [255, 255, 255, 255]
      },
      {
        text: formatInTimeZone($0.value, 'yyyy MMM dd HH:mm', 'utc'),
        position: [ -70, 115 ],
        size: 32,
        color: [255, 255, 255, 255]
      },
      {
        text: 'Provider.Quest',
        position: [ 160, -135 ],
        size: 14,
        color: [255, 255, 255, 255]
      },
      {
        text: 'Regular Deal',
        position: [ -200, 105 ],
        size: 16,
        color: colorBlue
      },
      {
        text: 'Filecoin+ Deal',
        position: [ -200, 118 ],
        size: 16,
        color: colorOrange
      }
    ],
    getPosition: d => d.position,
    getText: d => d.text,
    getSize: d => d.size,
    getColor: d => d.color,
    getTextAnchor: 'start'
  })
}
)}

function _10(deckgl,elapsed){return(
deckgl.update(elapsed)
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

function _16(md){return(
md`# Visualizing with Deck.gl

We have miner power data and we have location data, so we can visualize it with the [Deck.gl](https://deck.gl/) library using a [HexagonLayer](https://deck.gl/#/documentation/deckgl-api-reference/layers/hexagon-layer). (Based on: [@pessimistress/deck-gl-hexagonlayer-example](https://observablehq.com/@pessimistress/deck-gl-hexagonlayer-example), [@nharrisanalyst/deck-gl](https://observablehq.com/@nharrisanalyst/deck-gl))`
)}

function _deck(require){return(
require.alias({
  // optional dependencies
  h3: {}
})('deck.gl@latest/dist.min.js')
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
  longitude: 25,
  zoom: 1.05,
  bearing: 0,
  pitch: 0,
  minZoom: 1,
  maxZoom: 20
}
)}

function _deckgl(deck,container,mapboxgl,initialViewState,heatmapLayer,tripsLayer,overlayLayer)
{
  const myDeck = new deck.DeckGL({
    container,
    map: mapboxgl,
    mapboxAccessToken: '',
    // This token is for demo-purpose only and rotated regularly. Get your token at https://www.mapbox.com
    mapboxApiAccessToken: 'pk.eyJ1IjoidWJlcmRhdGEiLCJhIjoiY2pudzRtaWloMDAzcTN2bzN1aXdxZHB5bSJ9.2bkj3IiRC8wj3jLThvDGdA',
    mapStyle: 'mapbox://styles/mapbox/dark-v9',
    initialViewState,
    controller: true,
    views: [
      new deck.MapView({
        id: 'map-view'
      }),
      new deck.OrthographicView({
        id: 'ortho-view'
      })
    ],
    layers: [
      heatmapLayer(),
      tripsLayer(),
      overlayLayer()
    ],
    layerFilter: ({ layer, viewport }) => {
      if (viewport.id === 'map-view' && layer.id === 'heatmap-layer') return true
      if (viewport.id === 'map-view' && layer.id === 'trips-layer') return true
      if (viewport.id === 'ortho-view' && layer.id === 'overlay-layer') return true
      return false
    }
  })
  return Object.assign(myDeck, {
    update(sliderValue) {
      // console.log('Jim update', sliderValue)
      myDeck.setProps({ layers: [
        heatmapLayer(),
        tripsLayer(),
        overlayLayer()
      ] })
    }
  })
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
  elevationScale: 400,
  opacity: 0.6,
  colorRange: [
      [0, 170, 0, 255],
      [0, 190, 0, 255],
      [0, 255, 0, 255]
    ]
})
)}

function _tripsLayer(deck,dealTripsData,$0,startTime,colorOrange,colorBlue){return(
() => new deck.TripsLayer({
  id: 'trips-layer',
  data: dealTripsData,
  currentTime: $0.value - startTime,
  // fadeTrail: true,
  getTimestamps: d => d.waypoints.map(p => p.timestamp - startTime),
  trailLength: 600000,
  
  /* props inherited from PathLayer class */
  
  // billboard: false,
  capRounded: true,
  // getColor: [253, 128, 93],
  getColor: d => d.verified ? colorOrange : colorBlue,
  getPath: d => d.waypoints.map(p => p.coordinates),
  getWidth: d => d.width,
  // getWidth: 1,
  jointRounded: true,
  // miterLimit: 4,
  // rounded: true,
  // widthMaxPixels: Number.MAX_SAFE_INTEGER,
  widthMinPixels: 1,
  // widthScale: 1,
  // widthUnits: 'meters',
  
  /* props inherited from Layer class */
  
  // autoHighlight: false,
  // coordinateOrigin: [0, 0, 0],
  // coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
  // highlightColor: [0, 0, 128, 128],
  // modelMatrix: null,
  opacity: 0.8,
  // pickable: false,
  // visible: true,
  // wrapLongitude: false,
  /*
  getPath: d => d.waypoints.map(p => p.coordinates),
  // deduct start timestamp from each data point to avoid overflow
  getTimestamps: d => d.waypoints.map(p => p.timestamp - 1554772579000),
  getColor: [253, 128, 93],
  opacity: 0.8,
  widthMinPixels: 5,
  rounded: true,
  fadeTrail: true,
  trailLength: 200,
  currentTime: 100
                                 */
})
)}

function _heatmapLayer(heatmapTimeScale,$0,deck,heatmapData){return(
() => {
  const binIndex = Math.floor(heatmapTimeScale($0.value))
  return new deck.HeatmapLayer({
    id: 'heatmap-layer',
    data: heatmapData,
    getPosition: d => d[0],
    getWeight: d => {
      return d[1][binIndex]
    },
    weightsTextureSize: 512,
    radiusPixels: 40,
    aggregation: 'SUM',
    updateTriggers: {
      getWeight: binIndex
    }
  })
}
)}

function _25(heatmapLayer){return(
heatmapLayer()
)}

function _26(md){return(
md`## Data`
)}

function _dealPairsUrl(){return(
'https://gateway.pinata.cloud/ipfs/QmV9YPNHNujxgCz7XBXE1ydFQHnGi6FF9CfjxTxY1HsqjU/pairs.json'
)}

async function _pairsData(dealPairsUrl){return(
(await fetch(dealPairsUrl)).json()
)}

function _providerLocations(minerLocationsReport)
{
  const providerLocations = new Map()
  for (const { miner, long, lat } of minerLocationsReport.minerLocations) {
    const locations = providerLocations.get(miner) || []
    locations.push([long, lat])
    providerLocations.set(miner, locations)
  }
  return providerLocations
}


function _filteredPairs(pairsData,providerLocations,d3)
{
  const tripsData = []
  for (const { provider, start, ...rest } of pairsData) {
    const providerLocationList = providerLocations.get(provider)
    if (providerLocationList) {
      const publishTime = d3.isoParse(start)
      tripsData.push({
        publishTime,
        provider,
        ...rest
      })
    }
  }
  return tripsData
}


function _clients(filteredPairs){return(
new Set(filteredPairs.map(({ client }) => client))
)}

function _32(cityIndexIpfsUrl){return(
cityIndexIpfsUrl
)}

async function _compressedCityIndex(cityIndexIpfsUrl){return(
(await fetch(cityIndexIpfsUrl)).arrayBuffer()
)}

function _inflated(pako,compressedCityIndex){return(
pako.inflate(compressedCityIndex)
)}

function _cityIndex(cbor,inflated){return(
cbor.decodeFirst(inflated)
)}

async function _clientLocations(clients,lookupGeo,cityIndex)
{
  const clientLocations = new Map()
  for (const client of clients) {
    const encoder = new TextEncoder()
    const data = encoder.encode(client)
    const hash = await crypto.subtle.digest('SHA-256', data)
    const hash2Bytes = new Uint8Array(hash.slice(0,2))
    const index = hash2Bytes[0] * 256 + hash2Bytes[1]
    const [latitude, longitude] = lookupGeo(cityIndex, index)
    clientLocations.set(client, [longitude, latitude])
  }
  return clientLocations
}


function _dealTripsData(seedrandom,filteredPairs,providerLocations,clientLocations,dateFns)
{
  const tripsData = []
  const rng = new seedrandom('hello.')
  const bandwidth = 0.2 * 1024**3 // bytes per minute - FIXME: set per pair
  for (const { publishTime, provider, client, verified, count, size } of filteredPairs) {
    const providerLocationList = providerLocations.get(provider)
    for (let i = 0; i < count; i++) {
      const providerLocation = providerLocationList[Math.floor(rng.quick() * providerLocationList.length)]
      const clientLocation = clientLocations.get(client)
      const startTime = dateFns.sub(publishTime, { seconds: 24 * 60 * 60 * rng.quick() })
      const duration = size / bandwidth
      const endTime = dateFns.add(startTime, { minutes: duration })
      /*
      tripsData.push({
        publishTime,
        startTime,
        duration,
        endTime,
        i,
        count,
        // random: rng.quick(),
        // providerLocations: providerLocationList,
        clientLocation,
        providerLocation,
        provider,
        client,
        size
      })
      */
      tripsData.push({
        verified,
        width: 200 * 1000 // 200km
          * size / (32 * 1024**3),
        waypoints: [
          {
            coordinates: clientLocation,
            timestamp: startTime.getTime()
          },
          {
            coordinates: providerLocation,
            timestamp: endTime.getTime()
          }
        ]
      })
    }
  }
  return tripsData
}


function _numHeatmapBins(dateFns,endTime,startTime){return(
dateFns.differenceInHours(endTime, startTime) * 4
)}

function _heatmapTimeScale(d3,startTime,endTime,numHeatmapBins){return(
d3.scaleTime()
  .domain([new Date(startTime), new Date(endTime)])
  .range([0, numHeatmapBins])
)}

function _heatmapData(d3,dealTripsData,heatmapTimeScale){return(
Array.from(d3.rollup(
  dealTripsData,
  values => {
    const bins = []
    for (const value of values) {
      const timestamp = value.waypoints[1].timestamp
      const binIndex = Math.floor(heatmapTimeScale(timestamp))
      for (let i = binIndex + 1; i <= binIndex + 3 * 4; i++) { // heat up for 3 hours
        bins[i] = (bins[i] || 0) + value.width
      }
    }
    // return { length: values.length, bins, v: values }
    return bins
  },
  d => d.waypoints[1].coordinates
))
)}

function _startTime(dealTripsData){return(
dealTripsData.reduce((min, { waypoints }) => {
  const timestamp = waypoints[0].timestamp
  if (!min) return timestamp
  return min > timestamp ? timestamp : min
}, null)
)}

function _endTime(dealTripsData){return(
dealTripsData.reduce((max, { waypoints }) => {
  const timestamp = waypoints[1].timestamp
  if (!max) return timestamp
  return timestamp > max ? timestamp : max
}, null)
)}

function _colorBlue(d3)
{
   const c = d3.color(d3.schemeTableau10[0])
   return [c.r, c.g, c.b]
 }


function _colorOrange(d3)
{
   const c = d3.color(d3.schemeTableau10[1])
   return [c.r, c.g, c.b]
 }


function _45(md){return(
md`## Imports`
)}

function _seedrandom(require){return(
require('seedrandom@3.0.5/seedrandom.min.js')
)}

function _dateFns(require){return(
require('https://bundle.run/date-fns@2.22.1')
)}

function _dateFnsTz(){return(
import('https://cdn.skypack.dev/date-fns-tz@1.1.6?min')
)}

function _pako(){return(
import('https://cdn.skypack.dev/pako@2.0.4?min')
)}

function _cbor(){return(
import('https://cdn.skypack.dev/borc')
)}

function _formatInTimeZone(dateFnsTz){return(
(date, fmt, tz) =>
  dateFnsTz.format(dateFnsTz.utcToZonedTime(date, tz), 
         fmt, 
         { timeZone: tz })
)}

function _55(md){return(
md`## Backups`
)}

function _57(backups){return(
backups()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md","quickMenu"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("viewof elapsed")).define("viewof elapsed", ["Scrubber","d3","startTime","endTime"], _elapsed);
  main.variable(observer("elapsed")).define("elapsed", ["Generators", "viewof elapsed"], (G, _) => G.input(_));
  main.variable(observer()).define(["elapsed"], _6);
  main.variable(observer()).define(["Plot"], _7);
  main.variable(observer("container")).define("container", ["html"], _container);
  main.variable(observer("overlayLayer")).define("overlayLayer", ["deck","formatInTimeZone","viewof elapsed","colorBlue","colorOrange"], _overlayLayer);
  main.variable(observer()).define(["deckgl","elapsed"], _10);
  const child1 = runtime.module(define1);
  main.import("geoIpLookupsBucketUrl", child1);
  main.variable(observer("minerLocationsReport")).define("minerLocationsReport", ["geoIpLookupsBucketUrl"], _minerLocationsReport);
  const child2 = runtime.module(define1);
  main.import("minerPowerDailyAverageLatestBucketUrl", child2);
  main.variable(observer("minerPowerDailyAverageReport")).define("minerPowerDailyAverageReport", ["minerPowerDailyAverageLatestBucketUrl"], _minerPowerDailyAverageReport);
  main.variable(observer("data")).define("data", ["minerLocationsReport","minerPowerDailyAverageReport"], _data);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer("deck")).define("deck", ["require"], _deck);
  main.variable(observer("luma")).define("luma", ["deck"], _luma);
  main.variable(observer("mapboxgl")).define("mapboxgl", ["require"], _mapboxgl);
  main.variable(observer("initialViewState")).define("initialViewState", _initialViewState);
  main.variable(observer("deckgl")).define("deckgl", ["deck","container","mapboxgl","initialViewState","heatmapLayer","tripsLayer","overlayLayer"], _deckgl);
  main.variable(observer("hexagonLayer")).define("hexagonLayer", ["deck","data"], _hexagonLayer);
  main.variable(observer("tripsLayer")).define("tripsLayer", ["deck","dealTripsData","viewof elapsed","startTime","colorOrange","colorBlue"], _tripsLayer);
  main.variable(observer("heatmapLayer")).define("heatmapLayer", ["heatmapTimeScale","viewof elapsed","deck","heatmapData"], _heatmapLayer);
  main.variable(observer()).define(["heatmapLayer"], _25);
  main.variable(observer()).define(["md"], _26);
  main.variable(observer("dealPairsUrl")).define("dealPairsUrl", _dealPairsUrl);
  main.variable(observer("pairsData")).define("pairsData", ["dealPairsUrl"], _pairsData);
  main.variable(observer("providerLocations")).define("providerLocations", ["minerLocationsReport"], _providerLocations);
  main.variable(observer("filteredPairs")).define("filteredPairs", ["pairsData","providerLocations","d3"], _filteredPairs);
  main.variable(observer("clients")).define("clients", ["filteredPairs"], _clients);
  main.variable(observer()).define(["cityIndexIpfsUrl"], _32);
  main.variable(observer("compressedCityIndex")).define("compressedCityIndex", ["cityIndexIpfsUrl"], _compressedCityIndex);
  main.variable(observer("inflated")).define("inflated", ["pako","compressedCityIndex"], _inflated);
  main.variable(observer("cityIndex")).define("cityIndex", ["cbor","inflated"], _cityIndex);
  main.variable(observer("clientLocations")).define("clientLocations", ["clients","lookupGeo","cityIndex"], _clientLocations);
  main.variable(observer("dealTripsData")).define("dealTripsData", ["seedrandom","filteredPairs","providerLocations","clientLocations","dateFns"], _dealTripsData);
  main.variable(observer("numHeatmapBins")).define("numHeatmapBins", ["dateFns","endTime","startTime"], _numHeatmapBins);
  main.variable(observer("heatmapTimeScale")).define("heatmapTimeScale", ["d3","startTime","endTime","numHeatmapBins"], _heatmapTimeScale);
  main.variable(observer("heatmapData")).define("heatmapData", ["d3","dealTripsData","heatmapTimeScale"], _heatmapData);
  main.variable(observer("startTime")).define("startTime", ["dealTripsData"], _startTime);
  main.variable(observer("endTime")).define("endTime", ["dealTripsData"], _endTime);
  main.variable(observer("colorBlue")).define("colorBlue", ["d3"], _colorBlue);
  main.variable(observer("colorOrange")).define("colorOrange", ["d3"], _colorOrange);
  main.variable(observer()).define(["md"], _45);
  const child3 = runtime.module(define2);
  main.import("quickMenu", child3);
  main.variable(observer("seedrandom")).define("seedrandom", ["require"], _seedrandom);
  main.variable(observer("dateFns")).define("dateFns", ["require"], _dateFns);
  main.variable(observer("dateFnsTz")).define("dateFnsTz", _dateFnsTz);
  const child4 = runtime.module(define3);
  main.import("lookupGeo", child4);
  main.import("cityIndexIpfsUrl", child4);
  main.variable(observer("pako")).define("pako", _pako);
  main.variable(observer("cbor")).define("cbor", _cbor);
  const child5 = runtime.module(define4);
  main.import("Scrubber", child5);
  main.variable(observer("formatInTimeZone")).define("formatInTimeZone", ["dateFnsTz"], _formatInTimeZone);
  main.variable(observer()).define(["md"], _55);
  const child6 = runtime.module(define2);
  main.import("backups", child6);
  main.import("backupNowButton", child6);
  main.variable(observer()).define(["backups"], _57);
  return main;
}
