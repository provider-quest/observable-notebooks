// https://observablehq.com/@jimpick/65-536-cities@508
function _1(md){return(
md`# 65,536 Cities`
)}

function _2(md,deflatedKb,popBuckets,data,citiesWithH3){return(
md`This notebook takes a list of all the cities in the world with population > 1000, and then takes 65,536 samples distributed by population density. The samples are then packed into a tree using [Uber's H3 geo index](https://h3geo.org/), then packed and compressed into a binary index (around ${deflatedKb} KB) using CBOR and pako (published onto IPFS). With the index, you can pick any number from 0 to 65,535 and get a lat/long pair back corresponding to a populated location in the world weighted by population density. This might be useful for visualizations where you don't know exactly where the data is coming from, but you'd like to assign a geo-location to it.

Notes:

* There are actually only ${popBuckets.cities.length} distinct cities in the sampled index. The larger cities appear multiple times based on their population, eg. the largest city, ${data[0].name}, appears ${citiesWithH3.filter(({ name }) => data[0].name === name).length} times.
`
)}

function _3(md){return(
md`Demo: [@jimpick/65-536-cities-demo](https://observablehq.com/@jimpick/65-536-cities-demo)`
)}

function _4(md,cityIndexIpfsUrl){return(
md`Pinned to IPFS at: ${cityIndexIpfsUrl}`
)}

function _5(md){return(
md`Data source: [npm: substack/cities1000](https://raw.githubusercontent.com/substack/cities1000/master/cities1000.txt) (20MB)`
)}

function _6(md){return(
md`## Data License

copyright geonames.org

creative commons attribution 3.0 (CC-BY)
`
)}

function _cities1000(){return(
import('https://cdn.skypack.dev/cities1000@0.0.0?min')
)}

async function _data(d3,cities1000,FileAttachment){return(
d3.tsvParse(cities1000.fields.join('\t') + '\n' + await FileAttachment("cities1000.txt").text())
.map(({ country, name, lat, lon, population }) => ({ name, country, lat: Number(lat), lon: Number(lon), population: Number(population) })).sort((a, b) => b.population - a.population)
)}

function _9(Inputs,data){return(
Inputs.table(data)
)}

function _popMapper(data)
{
  const popList = []
  let lastPop = 0
  for (const { name, country, lat, lon, population } of data) {
    popList.push([lastPop, { name, country, lat: Number(lat), lon: Number(lon) }])
    lastPop += Number(population)
  }
  return [lastPop, popList]
}


function _totalPop(popMapper){return(
popMapper[0]
)}

function _popList(popMapper){return(
popMapper[1]
)}

function _numBuckets(){return(
256 * 256
)}

function _popBuckets(numBuckets,totalPop,popList)
{
  const cities = []
  const popBuckets = []
  let cursor = 0
  let lastCursor
  for (let i = 0; i < numBuckets; i++) {
    let popSlice = i * totalPop / numBuckets
    // console.log('popSlice', popSlice)
    while (popList[cursor + 1][0] < popSlice) cursor++
    // console.log('cursor', cursor, popList[cursor])
    if (cursor !== lastCursor) {
      cities.push(popList[cursor][1])
      lastCursor = cursor
    }
    popBuckets.push(cities.length - 1)
  }
  return { index: popBuckets, cities }
}


function _15(h3){return(
h3.h3ToGeo('8a283082a677fff')
)}

function _citiesWithH3(popBuckets,_,h3){return(
popBuckets.index.map(i => {
  const city = popBuckets.cities[i]
  return {
    ...city,
    h3: _.range(7).map(res => h3.geoToH3(city.lat, city.lon, res))
  }
})
)}

function _17(citiesWithH3)
{
  const depth = 7
  const resolutions = Array.from({length: depth}, (x, i) => new Map())
  for (const city of citiesWithH3) {
    for (let res = 0; res < depth; res++) {
      resolutions[res].set(city.h3[res], resolutions[res].get(city.h3[res]) + 1 || 1)
    }
  }
  return resolutions
}


function _locationTree(citiesWithH3)
{
  const depth = 7
  const locationTree = new Map()
  for (let res = 0; res < depth; res++) {
    for (const city of citiesWithH3) {
      const parent = findParentMap(city, res)
      const data = parent.get(city.h3[res]) || { count: 0, children: new Map() }
      parent.set(city.h3[res], { ...data, count: data.count + 1 })
    }
  }
  return locationTree

  function findParentMap(city, targetRes) {
    let parentMap = locationTree
    for (let res = 0; res < targetRes; res++) {
      parentMap = parentMap.get(city.h3[res]).children
    }
    return parentMap
  }
}


function _locationTreeBySize(locationTree)
{
  const children = getNodes(locationTree).children
  const count = children.reduce((cnt, child) => cnt + child.count, 0)
  return {
    count,
    children
  }

  function getNodes (fromNode) {
    return {
      children: [...fromNode.entries()].map(([hex, node]) => {
        
        const newNode = {
          hex,
          count: node.count
        }
        const children = getNodes(node.children).children
        if (children.length > 0) newNode.children = children
        return newNode
      }).sort((a, b) => b.count - a.count)
    }
  }
}


function _squeezed(locationTreeBySize)
{
  return squeezeNode(locationTreeBySize, -1)

  function squeezeNode (fromNode, res) {
    const newNode = {
      ct: fromNode.count
    }
    const children = fromNode.children &&
      fromNode.children.map(node => squeezeNode(node, res + 1))
    if (children) newNode.ch = children
    const hex = fromNode.hex
    if (hex) newNode.h = smallHex(hex, res)
    return newNode
  }

  function smallHex (hex, res) {
    const shiftedBits = Number(BigInt(`0x${hex.slice(2)}`) >> BigInt(45 - 3 * res))
    return shiftedBits
    // return [res, hex.slice(2), shiftedBits]
  }
}


function _encoded(cbor,squeezed){return(
cbor.encode(squeezed)
)}

function _button(DOM){return(
(data, filename = 'data') => {
  if (!data) throw new Error('Array of data required as first argument');

  const downloadData = new Blob(data, {
    type: "application/octet-stream"
  });

  const size = (downloadData.size / 1024).toFixed(0);
  const button = DOM.download(
    downloadData,
    filename,
    `Download ${filename} (~${size} KB)`
  );
  return button;
}
)}

function _deflated(pako,encoded){return(
pako.deflate(encoded)
)}

function _deflatedKb(deflated){return(
Math.floor(deflated.buffer.byteLength / 1024)
)}

function _25(button,deflated){return(
button([deflated.buffer], 'city-index.bin')
)}

function _cityIndexIpfsUrl()
{
  return 'https://gateway.pinata.cloud/ipfs/bafybeiandztzh5xo44be6pwaqonjghupu4riwvep2ewtk5zyeea3mgvhm4/city-index.bin'
  // return 'https://bafybeiandztzh5xo44be6pwaqonjghupu4riwvep2ewtk5zyeea3mgvhm4.ipfs.dweb.link/city-index.bin'
}


function _decoded(cbor,encoded){return(
cbor.decodeFirst(encoded)
)}

function _28(md){return(
md`## Lookup`
)}

function _lookupChild(){return(
function lookupChild (cityIndex, cityNumber) {
  return traverse(cityIndex.ch, cityNumber, 0)
  
  function traverse (children, remaining, depth) {
    for (const child of children) {
      if (remaining - child.ct >= 0) {
        remaining -= child.ct
      } else {
        if (child.ch) {
          return traverse(child.ch, remaining, depth + 1)
        } else {
          return [ depth, child ]
        }
      }
    }
  }

}
)}

function _lookupH3Hex(lookupChild){return(
function lookupH3Hex (cityIndex, cityNumber) {
  const result = lookupChild(cityIndex, cityNumber)
  if (result) {
    const [depth, child] = result
    const header = 0x80 + depth
    const prefix = BigInt(child.h) << BigInt(45 + 3 * depth)
    const padding = 0xffffffffffffffffffffffn >> BigInt(7 + 3 * depth)
    const combined = prefix | padding
    const hex = header.toString(16) + combined.toString(16).slice(0, 13)
    // return [ depth, child, hex ]
    return hex
  }
}
)}

function _lookupGeo(lookupH3Hex,h3){return(
function lookupGeo (cityIndex, cityNumber) {
  const hex = lookupH3Hex(cityIndex, cityNumber)
  if (hex) {
    return h3.h3ToGeo(hex)
  } else {
    throw new Error('Out of bounds')
  }
}
)}

function _32(lookupChild,decoded){return(
lookupChild(decoded, 0)
)}

function _33(lookupH3Hex,decoded){return(
lookupH3Hex(decoded, 0)
)}

function _34(lookupGeo,decoded){return(
lookupGeo(decoded, 0)
)}

function _35(lookupGeo,decoded){return(
lookupGeo(decoded, 1000)
)}

function _36(lookupH3Hex,decoded){return(
lookupH3Hex(decoded, 65535)
)}

function _37(lookupGeo,decoded){return(
lookupGeo(decoded, 65535)
)}

function _38(md){return(
md`## Test iteration`
)}

function _res0(locationTree){return(
[...locationTree.keys()].map(hex => [
  hex,
  hex.slice(2),
  (BigInt(`0x${hex.slice(2)}`) >> 45n).toString(16),
  (BigInt(`0x${hex.slice(2)}`) >> 42n & 0x7n).toString(16),
  (BigInt(`0x${hex.slice(2)}`) >> 39n & 0x7n).toString(16),
  (BigInt(`0x${hex.slice(2)}`) >> 36n & 0x7n).toString(16),
  (BigInt(`0x${hex.slice(2)}`) >> 33n & 0x7n).toString(16),
  (BigInt(`0x${hex.slice(2)}`) >> 30n & 0x7n).toString(16)
])
)}

function _level0(locationTree){return(
locationTree
)}

function _level0Key(level0){return(
[...level0.keys()][4]
)}

function _level0KeyChildrenKeys(level0,level0Key){return(
[...level0.get(level0Key).children.keys()]
)}

function _res1(level0KeyChildrenKeys){return(
level0KeyChildrenKeys.map(hex => [
  hex,
  hex.slice(2),
  (BigInt(`0x${hex.slice(2)}`) >> 45n).toString(16),
  (BigInt(`0x${hex.slice(2)}`) >> 42n & 0x7n).toString(16),
  (BigInt(`0x${hex.slice(2)}`) >> 39n & 0x7n).toString(16),
  (BigInt(`0x${hex.slice(2)}`) >> 36n & 0x7n).toString(16),
  (BigInt(`0x${hex.slice(2)}`) >> 33n & 0x7n).toString(16),
  (BigInt(`0x${hex.slice(2)}`) >> 30n & 0x7n).toString(16)
])
)}

function _level1(level0,level0Key){return(
level0.get(level0Key).children
)}

function _level1Key(level1){return(
[...level1.keys()][0]
)}

function _level1KeyChildrenKeys(level1,level1Key){return(
[...level1.get(level1Key).children.keys()]
)}

function _res2(level1KeyChildrenKeys){return(
level1KeyChildrenKeys.map(hex => [
  hex,
  hex.slice(2),
  (BigInt(`0x${hex.slice(2)}`) >> 45n).toString(16),
  (BigInt(`0x${hex.slice(2)}`) >> 42n & 0x7n).toString(16),
  (BigInt(`0x${hex.slice(2)}`) >> 39n & 0x7n).toString(16),
  (BigInt(`0x${hex.slice(2)}`) >> 36n & 0x7n).toString(16),
  (BigInt(`0x${hex.slice(2)}`) >> 33n & 0x7n).toString(16),
  (BigInt(`0x${hex.slice(2)}`) >> 30n & 0x7n).toString(16)
])
)}

function _48(md){return(
md`## Imports`
)}

function _h3(require){return(
require('h3-js@3.7.2/dist/h3-js.umd.js')
)}

function _cbor(){return(
import('https://cdn.skypack.dev/borc')
)}

function _pako(){return(
import('https://cdn.skypack.dev/pako@2.0.4?min')
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["cities1000.txt",new URL("./files/48f2e66dd6e52ed78d605c564cdd723954948b6b830074410da1a9f240311995b6b9b8e8520877cfc45902e41f2602c94362bf073010654c532982cd037aa978",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md","deflatedKb","popBuckets","data","citiesWithH3"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md","cityIndexIpfsUrl"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("cities1000")).define("cities1000", _cities1000);
  main.variable(observer("data")).define("data", ["d3","cities1000","FileAttachment"], _data);
  main.variable(observer()).define(["Inputs","data"], _9);
  main.variable(observer("popMapper")).define("popMapper", ["data"], _popMapper);
  main.variable(observer("totalPop")).define("totalPop", ["popMapper"], _totalPop);
  main.variable(observer("popList")).define("popList", ["popMapper"], _popList);
  main.variable(observer("numBuckets")).define("numBuckets", _numBuckets);
  main.variable(observer("popBuckets")).define("popBuckets", ["numBuckets","totalPop","popList"], _popBuckets);
  main.variable(observer()).define(["h3"], _15);
  main.variable(observer("citiesWithH3")).define("citiesWithH3", ["popBuckets","_","h3"], _citiesWithH3);
  main.variable(observer()).define(["citiesWithH3"], _17);
  main.variable(observer("locationTree")).define("locationTree", ["citiesWithH3"], _locationTree);
  main.variable(observer("locationTreeBySize")).define("locationTreeBySize", ["locationTree"], _locationTreeBySize);
  main.variable(observer("squeezed")).define("squeezed", ["locationTreeBySize"], _squeezed);
  main.variable(observer("encoded")).define("encoded", ["cbor","squeezed"], _encoded);
  main.variable(observer("button")).define("button", ["DOM"], _button);
  main.variable(observer("deflated")).define("deflated", ["pako","encoded"], _deflated);
  main.variable(observer("deflatedKb")).define("deflatedKb", ["deflated"], _deflatedKb);
  main.variable(observer()).define(["button","deflated"], _25);
  main.variable(observer("cityIndexIpfsUrl")).define("cityIndexIpfsUrl", _cityIndexIpfsUrl);
  main.variable(observer("decoded")).define("decoded", ["cbor","encoded"], _decoded);
  main.variable(observer()).define(["md"], _28);
  main.variable(observer("lookupChild")).define("lookupChild", _lookupChild);
  main.variable(observer("lookupH3Hex")).define("lookupH3Hex", ["lookupChild"], _lookupH3Hex);
  main.variable(observer("lookupGeo")).define("lookupGeo", ["lookupH3Hex","h3"], _lookupGeo);
  main.variable(observer()).define(["lookupChild","decoded"], _32);
  main.variable(observer()).define(["lookupH3Hex","decoded"], _33);
  main.variable(observer()).define(["lookupGeo","decoded"], _34);
  main.variable(observer()).define(["lookupGeo","decoded"], _35);
  main.variable(observer()).define(["lookupH3Hex","decoded"], _36);
  main.variable(observer()).define(["lookupGeo","decoded"], _37);
  main.variable(observer()).define(["md"], _38);
  main.variable(observer("res0")).define("res0", ["locationTree"], _res0);
  main.variable(observer("level0")).define("level0", ["locationTree"], _level0);
  main.variable(observer("level0Key")).define("level0Key", ["level0"], _level0Key);
  main.variable(observer("level0KeyChildrenKeys")).define("level0KeyChildrenKeys", ["level0","level0Key"], _level0KeyChildrenKeys);
  main.variable(observer("res1")).define("res1", ["level0KeyChildrenKeys"], _res1);
  main.variable(observer("level1")).define("level1", ["level0","level0Key"], _level1);
  main.variable(observer("level1Key")).define("level1Key", ["level1"], _level1Key);
  main.variable(observer("level1KeyChildrenKeys")).define("level1KeyChildrenKeys", ["level1","level1Key"], _level1KeyChildrenKeys);
  main.variable(observer("res2")).define("res2", ["level1KeyChildrenKeys"], _res2);
  main.variable(observer()).define(["md"], _48);
  main.variable(observer("h3")).define("h3", ["require"], _h3);
  main.variable(observer("cbor")).define("cbor", _cbor);
  main.variable(observer("pako")).define("pako", _pako);
  return main;
}
