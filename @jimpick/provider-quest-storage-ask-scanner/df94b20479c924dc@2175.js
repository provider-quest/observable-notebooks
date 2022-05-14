// https://observablehq.com/@jimpick/provider-quest-storage-ask-scanner@2175
import define1 from "./5cf93b57a7444002@222.js";
import define2 from "./a957eb792b00ff81@406.js";
import define3 from "./c4e4a355c53d2a1a@111.js";

function _1(md){return(
md`# Internal: Scanner: Asks [Provider.Quest]`
)}

function _2(md){return(
md`This demo connects to a public Lotus Filecoin API endpoint on the mainnet.`
)}

function _3(md){return(
md`If the connection is working, the following should retrieve the version and the block delay from a public API endpoint using the [Lotus JS Client](https://github.com/filecoin-shipyard/js-lotus-client) libraries.`
)}

async function _4(client){return(
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
html`<input type=range max=${currentEpoch} value=${currentEpoch - 1} style="width: 100%">`
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

function _14(md){return(
md`Compile a list of miners with multiaddresses and power (from on-chain and the DHT).`
)}

async function _multiaddrsIpsLatestReport(multiaddrsIpsLatestBucketUrl){return(
(await fetch(`${multiaddrsIpsLatestBucketUrl}/multiaddrs-ips-latest.json`)).json()
)}

function _minerPeerIds(multiaddrsIpsLatestReport)
{
  const minerPeerIds = new Map()
  for (const { miner, peerId } of multiaddrsIpsLatestReport.multiaddrsIps) {
    minerPeerIds.set(miner, peerId)
  }
  return minerPeerIds
}


function _19(asksSubsetLatest){return(
asksSubsetLatest
)}

function _filteredLatestAsks(asksSubsetLatest,d3,minTimestamp)
{
  const entries = Object.entries(asksSubsetLatest.miners)
    .map(([miner, { timestamp, ...rest }]) => ([miner, {
      timestamp: d3.isoParse(timestamp),
      ...rest
    }]))
    .filter(([miner, ask]) => (
      ask.timestamp >= minTimestamp &&
      !ask.error
    ))
    .map(([miner, ask]) => ({miner, ...ask}))
  return entries
}


function _latestMiners(filteredLatestAsks){return(
filteredLatestAsks.reduce((acc, { miner }) => acc.add(miner), new Set())
)}

function _minTimestamp(dateFns){return(
dateFns.subDays(new Date(), 14)
)}

function _subsetToScan(Inputs){return(
Inputs.radio(["Recents", "No recents", "All"], {label: "Select a subset to scan", value: "Recents"})
)}

function _minerCount(selectedMinerIndexes){return(
selectedMinerIndexes.length
)}

function _start(Inputs){return(
Inputs.button("Start")
)}

function _26(Inputs,selectedMinerIndexes,sortMiners){return(
Inputs.table([...selectedMinerIndexes].sort(sortMiners).map(i => ({miner: i})))
)}

function _maxElapsed(){return(
1 * 60 * 1000
)}

function _selectedMinerIndexes(subsetToScan,minerPeerIds,latestMiners,d3)
{
  let miners = []

  if (subsetToScan === 'Recents') {
    for (const miner of minerPeerIds.keys()) {
      if (latestMiners.has(miner)) miners.push(miner)
    }
  } else if (subsetToScan === 'No recents') {
    for (const miner of minerPeerIds.keys()) {
      if (!latestMiners.has(miner)) miners.push(miner)
    }
  } else {
    miners = [...minerPeerIds.keys()]
  }
  return d3.shuffle(miners)
}


function _testMiner(){return(
'f02620'
)}

function _queryAskTest(client,minerPeerIds,testMiner){return(
client.clientQueryAsk(minerPeerIds.get(testMiner), testMiner)
)}

function _queryAskStream(transform,minerPeerIds,client,selectedMinerIndexes,selectedEpoch,maxElapsed){return(
async function* queryAskStream() {
  const concurrency = 25
  const callQueryAskStream = transform(concurrency, async miner => {
    const startTime = new Date()
    try {
      const peerId = minerPeerIds.get(miner)
      const timeoutTimer = delay => new Promise(resolve => setTimeout(resolve, delay))
      // console.log('Start', miner, startTime)
      const queryAsk = await Promise.race([
        client.clientQueryAsk(peerId, miner),
        timeoutTimer(10000)
      ])
      const endTime = new Date()
      // console.log('Finished', miner, endTime, queryAsk)
      if (!queryAsk) {
        throw new Error('Timed out')
      }

      return {
        miner,
        seqNo: queryAsk.SeqNo,
        askTimestamp: queryAsk.Timestamp,
        price: queryAsk.Price,
        verifiedPrice: queryAsk.VerifiedPrice,
        minPieceSize: queryAsk.MinPieceSize,
        maxPieceSize: queryAsk.MaxPieceSize,
        expiry: queryAsk.Expiry,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      }
    } catch (e) {
      const endTime = new Date()
      console.error('Query ask error', e)
      return {
        miner,
        error: e.message,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      }
    }
  })
  const startTime = new Date()
  let counter = 0
  let errors = 0
  for await (const ask of callQueryAskStream(selectedMinerIndexes)) {
    const now = new Date()
    if (ask.error) errors++
    yield {
      counter,
      errors,
      epoch: selectedEpoch,
      ...ask
    }
    counter++
    if (now - startTime > maxElapsed) {
      yield {
        done: true,
        timeout: true,
        counter,
        errors
      }
      return
    }
  }
}
)}

function _33(minerCount){return(
minerCount
)}

async function* _asks(start,queryAskStream)
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
  let totalErrors = 0
  const startTime = new Date()
  for await (const {counter, errors, epoch, ...record} of queryAskStream()) {
    totalErrors = errors
    if (!record.error && record.miner) records.push(record)
    console.log('Jim record', record)
    yield {
      state: "streaming",
      elapsed: ((new Date()) - startTime) / 1000,
      counter,
      recordsLength: records.length,
      errors
    }
  }
  const endTime = new Date()
  yield {
    state: "done",
    elapsed: (endTime - startTime) / 1000,
    records,
    startTime,
    endTime,
    errors: totalErrors
  }
}


function _35(asks,md,maxRows,bytes){return(
asks.state === 'done' && md`Miner | Price | Verified Price | Min Size | Max Size
---|---|---|---|---
${asks.records.filter(({ error }) => !error).slice(0, maxRows).map(({ miner, price, verifiedPrice, minPieceSize, maxPieceSize }) => {
  let lines = `${miner} | ${price} | ${verifiedPrice} | ${bytes(minPieceSize, { format: 'binary'})} | ${bytes(maxPieceSize, { format: 'binary' })}\n`
  return lines
})}
`
)}

function _maxRows(){return(
50
)}

function _37(md){return(
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

function _41(md){return(
md`Here is the list of methods from the schema file. Currently just a subset of the available methods in the Lotus JSON-RPC API, but any method can be added.`
)}

function _42(schema){return(
Object.keys(schema.methods)
)}

function _43(md){return(
md`To make a client object to make calls with, you supply an endpoint url to make a websocket connection to the Lotus node to the RPC library, and supply a provider object (contains the websocket code) and a schema.`
)}

function _endpointUrl()
{
  return "https://lotus.miner.report/mainnet_api/0/node/rpc/v0"
  // return "https://api.node.glif.io/rpc/v0"
}


function _client(BrowserProvider,endpointUrl,LotusRPC,schema)
{
  const provider = new BrowserProvider(endpointUrl)
  return new LotusRPC(provider, { schema })
}


function _46(md){return(
md`## More imports`
)}

async function _transform(){return(
(await import('https://unpkg.com/streaming-iterables?module')).transform
)}

async function _bytes(){return(
(await import('https://unpkg.com/@jimpick/bytes-iec@3.1.0-2?module')).default
)}

async function _Multiaddr(require){return(
(await require('https://bundle.run/multiaddr@9.0.1')).Multiaddr
)}

async function _Buffer(require){return(
(await require('https://bundle.run/buffer@6.0.3')).Buffer
)}

function _maddrBin(Buffer){return(
Buffer.from('BLaDBMMGf/g=', 'base64')
)}

function _53(Multiaddr,maddrBin){return(
(new Multiaddr(maddrBin)).toString()
)}

function _dateFns(require){return(
require('https://bundle.run/date-fns@2.22.1')
)}

function _56(md){return(
md`## Backups`
)}

function _58(backups){return(
backups()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["client"], _4);
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
  main.variable(observer()).define(["md"], _14);
  const child1 = runtime.module(define1);
  main.import("multiaddrsIpsLatestBucketUrl", child1);
  main.variable(observer("multiaddrsIpsLatestReport")).define("multiaddrsIpsLatestReport", ["multiaddrsIpsLatestBucketUrl"], _multiaddrsIpsLatestReport);
  main.variable(observer("minerPeerIds")).define("minerPeerIds", ["multiaddrsIpsLatestReport"], _minerPeerIds);
  const child2 = runtime.module(define1);
  main.import("asksSubsetLatest", child2);
  main.variable(observer()).define(["asksSubsetLatest"], _19);
  main.variable(observer("filteredLatestAsks")).define("filteredLatestAsks", ["asksSubsetLatest","d3","minTimestamp"], _filteredLatestAsks);
  main.variable(observer("latestMiners")).define("latestMiners", ["filteredLatestAsks"], _latestMiners);
  main.variable(observer("minTimestamp")).define("minTimestamp", ["dateFns"], _minTimestamp);
  main.variable(observer("viewof subsetToScan")).define("viewof subsetToScan", ["Inputs"], _subsetToScan);
  main.variable(observer("subsetToScan")).define("subsetToScan", ["Generators", "viewof subsetToScan"], (G, _) => G.input(_));
  main.variable(observer("minerCount")).define("minerCount", ["selectedMinerIndexes"], _minerCount);
  main.variable(observer("viewof start")).define("viewof start", ["Inputs"], _start);
  main.variable(observer("start")).define("start", ["Generators", "viewof start"], (G, _) => G.input(_));
  main.variable(observer()).define(["Inputs","selectedMinerIndexes","sortMiners"], _26);
  main.variable(observer("maxElapsed")).define("maxElapsed", _maxElapsed);
  main.variable(observer("selectedMinerIndexes")).define("selectedMinerIndexes", ["subsetToScan","minerPeerIds","latestMiners","d3"], _selectedMinerIndexes);
  main.variable(observer("testMiner")).define("testMiner", _testMiner);
  main.variable(observer("queryAskTest")).define("queryAskTest", ["client","minerPeerIds","testMiner"], _queryAskTest);
  main.variable(observer("queryAskStream")).define("queryAskStream", ["transform","minerPeerIds","client","selectedMinerIndexes","selectedEpoch","maxElapsed"], _queryAskStream);
  main.variable(observer()).define(["minerCount"], _33);
  main.variable(observer("asks")).define("asks", ["start","queryAskStream"], _asks);
  main.variable(observer()).define(["asks","md","maxRows","bytes"], _35);
  main.variable(observer("maxRows")).define("maxRows", _maxRows);
  main.variable(observer()).define(["md"], _37);
  main.variable(observer("LotusRPC")).define("LotusRPC", _LotusRPC);
  main.variable(observer("BrowserProvider")).define("BrowserProvider", _BrowserProvider);
  main.variable(observer("schema")).define("schema", _schema);
  main.variable(observer()).define(["md"], _41);
  main.variable(observer()).define(["schema"], _42);
  main.variable(observer()).define(["md"], _43);
  main.variable(observer("endpointUrl")).define("endpointUrl", _endpointUrl);
  main.variable(observer("client")).define("client", ["BrowserProvider","endpointUrl","LotusRPC","schema"], _client);
  main.variable(observer()).define(["md"], _46);
  main.variable(observer("transform")).define("transform", _transform);
  const child3 = runtime.module(define2);
  main.import("epochToDate", child3);
  main.variable(observer("bytes")).define("bytes", _bytes);
  main.variable(observer("Multiaddr")).define("Multiaddr", ["require"], _Multiaddr);
  main.variable(observer("Buffer")).define("Buffer", ["require"], _Buffer);
  main.variable(observer("maddrBin")).define("maddrBin", ["Buffer"], _maddrBin);
  main.variable(observer()).define(["Multiaddr","maddrBin"], _53);
  main.variable(observer("dateFns")).define("dateFns", ["require"], _dateFns);
  const child4 = runtime.module(define3);
  main.import("sortMiners", child4);
  main.variable(observer()).define(["md"], _56);
  const child5 = runtime.module(define3);
  main.import("backups", child5);
  main.import("backupNowButton", child5);
  main.variable(observer()).define(["backups"], _58);
  return main;
}
