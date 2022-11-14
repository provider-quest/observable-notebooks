import define1 from "./c4e4a355c53d2a1a@111.js";
import define2 from "./450051d7f1174df8@254.js";

function _1(md){return(
md`# Power: History [Provider.Quest]`
)}

function _2(md){return(
md`Note: Under construction!`
)}

function _3(md,quickMenu){return(
md`${quickMenu}`
)}

function _4(md){return(
md`This notebook shows storage providers power growth with location data on a Deck.gl-based 3D globe. (Reported locations from IP addresses, non-verified).`
)}

function _elapsed(Scrubber,d3,startTime,endTime){return(
Scrubber(d3.range(startTime, endTime, (endTime - startTime) / 4000), {
  delay: 100,
  loop: false,
  autoplay: false,
  initial: 0
})
)}

function _container(html){return(
html `<div style="height:600px"></div>`
)}

function _overlayLayer(deck,dateFns,$0){return(
() => {
  return new deck.TextLayer({
    id: 'overlay-layer',
    data: [
      {
        text: 'Filecoin Provider Power Growth',
        position: [ -200, -120 ],
        size: 24
      },
      {
        text: dateFns.format($0.value, 'yyyy MMM dd'),
        position: [ -50, 115 ],
        size: 32
      },
      {
        text: 'Provider.Quest',
        position: [ 160, -135 ],
        size: 14
      }
    ],
    getPosition: d => d.position,
    getText: d => d.text,
    getSize: d => d.size,
    getColor: [ 255, 255, 255, 255 ],
    getTextAnchor: 'start'
  })
}
)}

function _8(md){return(
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

function _deckgl(deck,container,mapboxgl,initialViewState,scatterplotLayer,overlayLayer)
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
      scatterplotLayer(),
      overlayLayer()
    ],
    layerFilter: ({ layer, viewport }) => {
      if (viewport.id === 'map-view' && layer.id === 'scatterplot-layer') return true
      if (viewport.id === 'ortho-view' && layer.id === 'overlay-layer') return true
      return false
    }
  })
  return Object.assign(myDeck, {
    update(sliderValue) {
      // console.log('Jim update', sliderValue)
      myDeck.setProps({ layers: [
        scatterplotLayer(),
        overlayLayer()
      ] })
    }
  })
}


function _scatterplotLayer($0,deck,geotaggedEvents){return(
() => {
  const elapsedValue = $0.value
  // console.log('Jim elapsedValue', elapsedValue)
  return new deck.ScatterplotLayer({
    id: 'scatterplot-layer',
    data: geotaggedEvents,
    getPosition: d => d.location,
    getRadius: d => {
      return (d.level + 1) * 50 * 1000 // 50-1500 km
    },
    getFillColor: d => {
      if (d.date > (elapsedValue - 7 * 24 * 60 * 60 * 1000) &&
          d.date <= elapsedValue) {
        const alpha = 255 - 255 * (elapsedValue - d.date) / (7 * 24 * 60 * 60 * 1000)
        const green = Math.min(255, 255 * d.age / (3 * 30 * 24 * 60 * 60 * 1000)) // red -> yellow over 3 months
        return [255, green, 0, alpha]
      } else {
        return [0, 0, 0, 0]
      }
    },
    updateTriggers: {
      getFillColor: `${elapsedValue}`
    }
  })
}
)}

function _15(deckgl,elapsed){return(
deckgl.update(elapsed)
)}

function _16(md){return(
md`## Data`
)}

function _url(){return(
'https://bafybeifp7xypbwiy2mjcp5i57d2vlwrrc4qa7ludjelyk7apraj7n6r4qe.ipfs.dweb.link/combined-events.json'
)}

async function _providerEvents(url){return(
(await fetch(url)).json()
)}

function _geotaggedEvents(providerEvents,d3)
{
  const geotaggedEvents = []
  for (const { provider, locations, events } of providerEvents) {
    const firstEventDate = Number(d3.isoParse(events[0].date))
    for (const { date, level } of events) {
      const eventDate = Number(d3.isoParse(date)) - Math.floor(Math.random() * 24 * 60 * 60 * 1000) // randomize over 24 hours
      geotaggedEvents.push({
        date: eventDate, 
        age: Math.max(0, eventDate - firstEventDate),
        level,
        location: locations[Math.floor(Math.random() * locations.length)]
      })
    }
  }
  return geotaggedEvents.sort(({ date: a}, { date: b }) => a - b)
}


function _startTime(geotaggedEvents){return(
geotaggedEvents[0].date
)}

function _endTime(geotaggedEvents){return(
geotaggedEvents[geotaggedEvents.length - 1].date
)}

function _22(md){return(
md`## Imports`
)}

function _dateFns(require){return(
require('https://bundle.run/date-fns@2.22.1')
)}

function _26(md){return(
md`## Backups`
)}

function _28(backups){return(
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
  main.variable(observer("container")).define("container", ["html"], _container);
  main.variable(observer("overlayLayer")).define("overlayLayer", ["deck","dateFns","viewof elapsed"], _overlayLayer);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer("deck")).define("deck", ["require"], _deck);
  main.variable(observer("luma")).define("luma", ["deck"], _luma);
  main.variable(observer("mapboxgl")).define("mapboxgl", ["require"], _mapboxgl);
  main.variable(observer("initialViewState")).define("initialViewState", _initialViewState);
  main.variable(observer("deckgl")).define("deckgl", ["deck","container","mapboxgl","initialViewState","scatterplotLayer","overlayLayer"], _deckgl);
  main.variable(observer("scatterplotLayer")).define("scatterplotLayer", ["viewof elapsed","deck","geotaggedEvents"], _scatterplotLayer);
  main.variable(observer()).define(["deckgl","elapsed"], _15);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer("url")).define("url", _url);
  main.variable(observer("providerEvents")).define("providerEvents", ["url"], _providerEvents);
  main.variable(observer("geotaggedEvents")).define("geotaggedEvents", ["providerEvents","d3"], _geotaggedEvents);
  main.variable(observer("startTime")).define("startTime", ["geotaggedEvents"], _startTime);
  main.variable(observer("endTime")).define("endTime", ["geotaggedEvents"], _endTime);
  main.variable(observer()).define(["md"], _22);
  const child1 = runtime.module(define1);
  main.import("quickMenu", child1);
  main.variable(observer("dateFns")).define("dateFns", ["require"], _dateFns);
  const child2 = runtime.module(define2);
  main.import("Scrubber", child2);
  main.variable(observer()).define(["md"], _26);
  const child3 = runtime.module(define1);
  main.import("backups", child3);
  main.import("backupNowButton", child3);
  main.variable(observer()).define(["backups"], _28);
  return main;
}
