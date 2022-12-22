import define1 from "./5cf93b57a7444002@282.js";
import define2 from "./a957eb792b00ff81@406.js";
import define3 from "./c4e4a355c53d2a1a@111.js";

function _1(md){return(
md`# All CC Providers - FIL Balances`
)}

function _2(md){return(
md`---
`
)}

async function _allCCProviders(FileAttachment){return(
[...(await FileAttachment("allCCProviders.json").json())].sort()
)}

async function _x(client,tipSetKey){return(
await client.stateGetActor('f0127595', tipSetKey)
)}

async function _y(client,tipSetKey){return(
await client.stateMinerInfo('f0127595', tipSetKey)
)}

async function* _minerData(allCCProviders,client,tipSetKey)
{
  const owners = new Set()
  let count = 0
  let totalMinerBalance = 0n
  for (const minerId of allCCProviders) {
    count++
    console.log('Jim', minerId)
    const minerActor = (await client.stateGetActor(minerId, tipSetKey))
    const minerInfo = (await client.stateMinerInfo(minerId, tipSetKey))
    owners.add(minerInfo.Owner)
    
    totalMinerBalance += BigInt(minerActor.Balance)
    yield {
      count,
      minerId,
      totalMinerBalance,
      owners
    }
  }
}


function _owners(minerData){return(
[...minerData.owners]
)}

async function* _ownerData(owners,client,tipSetKey)
{
  return
  let count = 0
  let totalOwnerBalance = 0n
  const ownersSorted = [...owners].sort()
  for (const address of ownersSorted) {
    count++
    const actor = (await client.stateGetActor(address, tipSetKey))
    
    totalOwnerBalance += BigInt(actor.Balance)
    yield {
      count,
      address,
      totalOwnerBalance
    }
  }
}


function _filecoinNumber(){return(
import('https://cdn.skypack.dev/pin/@glif/filecoin-number@v2.0.0-beta.0-iQnBkhznGjB3HsyiyYB8/mode=imports,min/optimized/@glif/filecoin-number.js')
)}

function _10(md){return(
md`---`
)}

function _11(md){return(
md`# Ignore below here`
)}

async function _12(client){return(
await client.version()
)}

async function _chainHead(client){return(
await client.chainHead()
)}

function _currentEpoch(chainHead){return(
chainHead.Height
)}

function _headTipSetKey(chainHead){return(
chainHead.Cids
)}

function _interactiveEpoch(html,currentEpoch){return(
html`<input type=range min=${currentEpoch - 5000} max=${currentEpoch} value=${currentEpoch - 1} style="width: 100%">`
)}

function _selectedEpoch(interactiveEpoch)
{
  // return 142500
  return interactiveEpoch
}


function _selectedDate(epochToDate,selectedEpoch){return(
epochToDate(selectedEpoch).toISOString()
)}

async function _tipSetKey(client,selectedEpoch,headTipSetKey){return(
(await client.chainGetTipSetByHeight(selectedEpoch, headTipSetKey)).Cids
)}

function _tipSet(tipSetKey){return(
[...tipSetKey].map(obj => obj['/']).sort().join(',')
)}

async function _totalPower(client,tipSetKey){return(
(await client.stateMinerPower('<empty>', tipSetKey)).TotalPower
)}

function _subsetToScan(Inputs){return(
Inputs.radio(["Recents", "Recents, Averages", "Newest miners, not recent", "All miners, not recent", "Legacy annotated", "All miners"], {label: "Select a subset to scan", value: "Recents"})
)}

function _minerCount(selectedMinerIndexes){return(
selectedMinerIndexes.length
)}

function _start(Inputs){return(
Inputs.button("Start")
)}

function _maxElapsed(){return(
10 * 60 * 1000
)}

async function _minerPowerLatestReport(minerPowerDailyAverageLatestBucketUrl){return(
(await fetch(`${minerPowerDailyAverageLatestBucketUrl}/miner-power-latest.json`)).json()
)}

function _minTimestamp(dateFns){return(
dateFns.subDays(new Date(), 7)
)}

async function _minerPowerDailyAverageReport(minerPowerDailyAverageLatestBucketUrl){return(
(await fetch(`${minerPowerDailyAverageLatestBucketUrl}/miner-power-daily-average-latest.json`)).json()
)}

async function _minerPowerMultidayAverageReport(minerPowerMultidayAverageLatestBucketUrl){return(
(await fetch(`${minerPowerMultidayAverageLatestBucketUrl}/miner-power-multiday-average-latest.json`)).json()
)}

async function _allMiners(client,tipSetKey,sortMiners){return(
(await client.stateListMiners(tipSetKey)).sort(sortMiners)
)}

function _sortMiners(){return(
function (a, b) { return Number(a.slice(1)) - Number(b.slice(1)) }
)}

function _34(allMiners){return(
allMiners.slice(-5)
)}

function _35(md){return(
md`Fetch a regularly updated list of "interesting" miners. (Most miners returned from the API are inactive and we don't want to query them)`
)}

function _selectedMinerIndexes(minerPowerLatestReport,d3,minTimestamp,minerPowerDailyAverageReport,minerPowerMultidayAverageReport,subsetToScan,allMiners)
{
  let miners = []

  const recentMinerSet = new Set()
  const recentAveragesMinerSet = new Set()
  for (const miner of Object.keys(minerPowerLatestReport.miners)) {
    if (d3.isoParse(minerPowerLatestReport.miners[miner].timestamp) > minTimestamp) {
      recentMinerSet.add(miner)
      recentAveragesMinerSet.add(miner)
    }
  }

  for (const miner of Object.keys(minerPowerDailyAverageReport.miners)) {
    recentAveragesMinerSet.add(miner)
  }
  for (const miner of Object.keys(minerPowerMultidayAverageReport.miners)) {
    recentAveragesMinerSet.add(miner)
  }
 
  if (subsetToScan === 'Recents') {
    miners = [...recentMinerSet]
  } else if (subsetToScan === 'Recents, Averages') {
    miners = [...recentAveragesMinerSet]
  } else if (subsetToScan === 'Newest miners, not recent') {
    miners = allMiners.slice(-10000).filter(miner => !recentMinerSet.has(miner))
  } else if (subsetToScan === 'All miners, not recent') {
    miners = allMiners.filter(miner => !recentMinerSet.has(miner))
/*
  } else if (subsetToScan === 'Legacy annotated') {
    miners = annotatedMinerIndexes
*/
  } else if (subsetToScan === 'All miners') {
    miners = allMiners
  }
  return d3.shuffle(miners)
}


function _minerPowerStream(transform,client,tipSetKey,selectedMinerIndexes,selectedEpoch,maxElapsed){return(
async function* minerPowerStream() {
  const concurrency = 15
  const callMinerPowerStream = transform(concurrency, async miner => {
    try {
      const minerPower = (await client.stateMinerPower(miner, tipSetKey)).MinerPower
      console.log('Jim', miner, minerPower.QualityAdjPower)
      return {
        miner,
        rawBytePower: Number(minerPower.RawBytePower),
        qualityAdjPower: Number(minerPower.QualityAdjPower)
      }
    } catch (e) {
      console.error('Fetch error', e)
      return {}
    }
  })
  const startTime = new Date()
  let counter = 0
  for await (const { miner, rawBytePower, qualityAdjPower } of callMinerPowerStream(selectedMinerIndexes)) {
    const now = new Date()
    if (rawBytePower > 0 || qualityAdjPower > 0) {
      yield {
        counter,
        epoch: selectedEpoch,
        miner,
        rawBytePower,
        qualityAdjPower
      }
    } else {
      yield {
        counter
      }
    }
    counter++
    if (now - startTime > maxElapsed) {
      yield {
        done: true,
        timeout: true,
        counter
      }
      return
    }
  }
}
)}

async function* _minerPower(start,minerPowerStream)
{
  if (start === 0) {
    yield {
      state: 'paused'
    }
    return
  }
  yield {
    state: 'starting'
  }
  let records = []
  const startTime = new Date()
  for await (const {counter, ...record} of minerPowerStream()) {
    if (record.epoch) {
      records.push(record)
    }
    yield {
      state: "streaming",
      elapsed: ((new Date()) - startTime) / 1000,
      counter,
      recordsLength: records.length
    }
  }
  const endTime = new Date()
  yield {
    state: "done",
    elapsed: (endTime - startTime) / 1000,
    records,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString()
  }
}


function _42(minerPower,md,maxRows,bytes){return(
minerPower.state === 'done' && md`Miner | Raw Byte Power | Quality Adjusted Power
---|---|---
${minerPower.records.sort((a, b) => b.qualityAdjPower - a.qualityAdjPower).slice(0, maxRows).map(({ miner, rawBytePower, qualityAdjPower }) => {
  let lines = `${miner} | ${bytes(rawBytePower, { mode: 'binary' })} | ${bytes(qualityAdjPower, { mode: 'binary' })}\n`
  return lines
})}
`
)}

function _maxRows(){return(
50
)}

function _44(md){return(
md`# Setting up Lotus JS Client

The following three stanzas import the library from npm.`
)}

async function _LotusRPC(){return(
(await import('https://unpkg.com/@filecoin-shipyard/lotus-client-rpc?module')).LotusRPC
)}

async function _BrowserProvider(){return(
(await import('https://unpkg.com/@filecoin-shipyard/lotus-client-provider-browser?module')).BrowserProvider
)}

async function _schema(){return(
(await import('https://unpkg.com/@filecoin-shipyard/lotus-client-schema?module')).mainnet.fullNode
)}

function _48(md){return(
md`Here is the list of methods from the schema file. Currently just a subset of the available methods in the Lotus JSON-RPC API, but any method can be added.`
)}

function _49(schema){return(
Object.keys(schema.methods)
)}

function _50(md){return(
md`To make a client object to make calls with, you supply an endpoint url to make a websocket connection to the Lotus node to the RPC library, and supply a provider object (contains the websocket code) and a schema.`
)}

function _endpointUrl()
{
  return "wss://lotus.miner.report/mainnet_api/0/node/rpc/v0"
  // return "wss://lotus.jimpick.com/mainnet_api/0/node/rpc/v0"
  // return "https://api.node.glif.io/rpc/v0"
}


function _client(BrowserProvider,endpointUrl,LotusRPC,schema)
{
  const provider = new BrowserProvider(endpointUrl)
  return new LotusRPC(provider, { schema })
}


function _53(md){return(
md`## More imports`
)}

async function _transform(){return(
(await import('https://unpkg.com/streaming-iterables?module')).transform
)}

async function _bytes(){return(
(await import('https://unpkg.com/@jimpick/bytes-iec@3.1.0-2?module')).default
)}

function _d3(require){return(
require("d3@6")
)}

function _dateFns(require){return(
require('https://bundle.run/date-fns@2.22.1')
)}

function _59(md){return(
md`## Backups`
)}

function _61(backups){return(
backups()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["allCCProviders.json", {url: new URL("./files/41112b9807701b249c9fde9e81147649c95605b72cbde675ff1b8647ee52ac418164d385ff95d2ab23293bc9cf85bc43475c03f644fe6e4d77b8e111f9ee8a4c.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("allCCProviders")).define("allCCProviders", ["FileAttachment"], _allCCProviders);
  main.variable(observer("x")).define("x", ["client","tipSetKey"], _x);
  main.variable(observer("y")).define("y", ["client","tipSetKey"], _y);
  main.variable(observer("minerData")).define("minerData", ["allCCProviders","client","tipSetKey"], _minerData);
  main.variable(observer("owners")).define("owners", ["minerData"], _owners);
  main.variable(observer("ownerData")).define("ownerData", ["owners","client","tipSetKey"], _ownerData);
  main.variable(observer("filecoinNumber")).define("filecoinNumber", _filecoinNumber);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer()).define(["client"], _12);
  main.variable(observer("chainHead")).define("chainHead", ["client"], _chainHead);
  main.variable(observer("currentEpoch")).define("currentEpoch", ["chainHead"], _currentEpoch);
  main.variable(observer("headTipSetKey")).define("headTipSetKey", ["chainHead"], _headTipSetKey);
  main.variable(observer("viewof interactiveEpoch")).define("viewof interactiveEpoch", ["html","currentEpoch"], _interactiveEpoch);
  main.variable(observer("interactiveEpoch")).define("interactiveEpoch", ["Generators", "viewof interactiveEpoch"], (G, _) => G.input(_));
  main.variable(observer("selectedEpoch")).define("selectedEpoch", ["interactiveEpoch"], _selectedEpoch);
  main.variable(observer("selectedDate")).define("selectedDate", ["epochToDate","selectedEpoch"], _selectedDate);
  main.variable(observer("tipSetKey")).define("tipSetKey", ["client","selectedEpoch","headTipSetKey"], _tipSetKey);
  main.variable(observer("tipSet")).define("tipSet", ["tipSetKey"], _tipSet);
  main.variable(observer("totalPower")).define("totalPower", ["client","tipSetKey"], _totalPower);
  main.variable(observer("viewof subsetToScan")).define("viewof subsetToScan", ["Inputs"], _subsetToScan);
  main.variable(observer("subsetToScan")).define("subsetToScan", ["Generators", "viewof subsetToScan"], (G, _) => G.input(_));
  main.variable(observer("minerCount")).define("minerCount", ["selectedMinerIndexes"], _minerCount);
  main.variable(observer("viewof start")).define("viewof start", ["Inputs"], _start);
  main.variable(observer("start")).define("start", ["Generators", "viewof start"], (G, _) => G.input(_));
  main.variable(observer("maxElapsed")).define("maxElapsed", _maxElapsed);
  const child1 = runtime.module(define1);
  main.import("minerPowerDailyAverageLatestBucketUrl", child1);
  main.variable(observer("minerPowerLatestReport")).define("minerPowerLatestReport", ["minerPowerDailyAverageLatestBucketUrl"], _minerPowerLatestReport);
  main.variable(observer("minTimestamp")).define("minTimestamp", ["dateFns"], _minTimestamp);
  main.variable(observer("minerPowerDailyAverageReport")).define("minerPowerDailyAverageReport", ["minerPowerDailyAverageLatestBucketUrl"], _minerPowerDailyAverageReport);
  const child2 = runtime.module(define1);
  main.import("minerPowerMultidayAverageLatestBucketUrl", child2);
  main.variable(observer("minerPowerMultidayAverageReport")).define("minerPowerMultidayAverageReport", ["minerPowerMultidayAverageLatestBucketUrl"], _minerPowerMultidayAverageReport);
  main.variable(observer("allMiners")).define("allMiners", ["client","tipSetKey","sortMiners"], _allMiners);
  main.variable(observer("sortMiners")).define("sortMiners", _sortMiners);
  main.variable(observer()).define(["allMiners"], _34);
  main.variable(observer()).define(["md"], _35);
  const child3 = runtime.module(define1);
  main.import("annotatedMinerIndexes", child3);
  main.variable(observer("selectedMinerIndexes")).define("selectedMinerIndexes", ["minerPowerLatestReport","d3","minTimestamp","minerPowerDailyAverageReport","minerPowerMultidayAverageReport","subsetToScan","allMiners"], _selectedMinerIndexes);
  main.variable(observer("minerPowerStream")).define("minerPowerStream", ["transform","client","tipSetKey","selectedMinerIndexes","selectedEpoch","maxElapsed"], _minerPowerStream);
  main.variable(observer("minerPower")).define("minerPower", ["start","minerPowerStream"], _minerPower);
  main.variable(observer()).define(["minerPower","md","maxRows","bytes"], _42);
  main.variable(observer("maxRows")).define("maxRows", _maxRows);
  main.variable(observer()).define(["md"], _44);
  main.variable(observer("LotusRPC")).define("LotusRPC", _LotusRPC);
  main.variable(observer("BrowserProvider")).define("BrowserProvider", _BrowserProvider);
  main.variable(observer("schema")).define("schema", _schema);
  main.variable(observer()).define(["md"], _48);
  main.variable(observer()).define(["schema"], _49);
  main.variable(observer()).define(["md"], _50);
  main.variable(observer("endpointUrl")).define("endpointUrl", _endpointUrl);
  main.variable(observer("client")).define("client", ["BrowserProvider","endpointUrl","LotusRPC","schema"], _client);
  main.variable(observer()).define(["md"], _53);
  main.variable(observer("transform")).define("transform", _transform);
  const child4 = runtime.module(define2);
  main.import("epochToDate", child4);
  main.variable(observer("bytes")).define("bytes", _bytes);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("dateFns")).define("dateFns", ["require"], _dateFns);
  main.variable(observer()).define(["md"], _59);
  const child5 = runtime.module(define3);
  main.import("backups", child5);
  main.import("backupNowButton", child5);
  main.variable(observer()).define(["backups"], _61);
  return main;
}
