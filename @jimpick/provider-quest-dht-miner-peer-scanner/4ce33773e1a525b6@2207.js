import define1 from "./5cf93b57a7444002@284.js";
import define2 from "./a957eb792b00ff81@406.js";
import define3 from "./c4e4a355c53d2a1a@112.js";

function _1(md){return(
md`# Internal: Scanner: DHT [Provider.Quest]`
)}

function _2(md){return(
md`This demo connects to a public Lotus Filecoin API endpoint on the mainnet.`
)}

function _3(md){return(
md`If the connection is working, the following should retrieve the version and the block delay from a public API endpoint using the [Lotus JS Client](https://github.com/filecoin-shipyard/js-lotus-client) libraries.`
)}

function _endpointUrl()
{
  return "https://lotus.miner.report/mainnet_api/0/node/rpc/v0"
  // return "https://lotus.jimpick.com/mainnet_api/0/node/rpc/v0"
  // return "https://api.node.glif.io/rpc/v0" - Doesn't work
  // return "https://api.chain.love/rpc/v0"
}


async function _5(client){return(
await client.version()
)}

async function _chainHead(client){return(
await client.chainHead()
)}

function _currentEpoch(chainHead){return(
chainHead.Height
)}

function _currentEpochDate(epochToDate,currentEpoch){return(
epochToDate(currentEpoch).toISOString()
)}

function _subsetToScan(Inputs){return(
Inputs.radio(["All recents", "No recents", "No fail", "Fail only", "Everything"], {label: "Select a subset to scan", value: "All recents"})
)}

function _start(Inputs){return(
Inputs.button("Start")
)}

function _11(filteredMinerPeerIds){return(
filteredMinerPeerIds.length
)}

function _maxElapsed(){return(
10 * 60 * 1000
)}

function _14(minerInfoSubsetLatest){return(
minerInfoSubsetLatest
)}

function _15(md){return(
md`Fetch a regularly list of miners with PeerIDs.`
)}

function _minerPeerIds(minerInfoSubsetLatest){return(
Object.entries(minerInfoSubsetLatest.miners).map(([miner, info]) => ({ miner, peerId: info.peerId })).filter(info => info.peerId).sort(({ miner: minerA }, { miner: minerB }) => Number(minerA.slice(1)) - Number(minerB.slice(1)))
)}

function _17(md){return(
md`To speed up the scan, we can use the legacy annotations and skip miners with the \`fail\` annotations.`
)}

function _20(md){return(
md`We can also use aggregated counts to scan for just recently seen DHT peers.`
)}

async function _dailyCountsReport(dhtAddrsLatestBucketUrl){return(
(await fetch(`${dhtAddrsLatestBucketUrl}/dht-addrs-counts-daily.json`)).json()
)}

async function _multidayCountsReport(dhtAddrsLatestBucketUrl){return(
(await fetch(`${dhtAddrsLatestBucketUrl}/dht-addrs-counts-multiday.json`)).json()
)}

async function _dhtAddrsLatestReport(dhtAddrsLatestBucketUrl){return(
(await fetch(`${dhtAddrsLatestBucketUrl}/dht-addrs-latest.json`)).json()
)}

function _minTimestamp(dateFns){return(
dateFns.subDays(new Date(), 7)
)}

function _latestDhtAddrsMiners(dhtAddrsLatestReport,d3,minTimestamp)
{
  const minerSet = new Set()
  for (const miner in dhtAddrsLatestReport.miners) {
    const timestamp = d3.isoParse(dhtAddrsLatestReport.miners[miner].timestamp)
    if (timestamp > minTimestamp) minerSet.add(miner)
  }
  return minerSet
}


function _27(subsetToScan){return(
subsetToScan
)}

function _filteredMinerPeerIds(d3,minerPeerIds,subsetToScan,dailyCountsReport,multidayCountsReport,latestDhtAddrsMiners){return(
d3.shuffle(minerPeerIds.filter(({ miner }) => {
  /* if (subsetToScan === 'No fail') {
    return !legacyAnnotationsMainnet[miner].startsWith('fail,')
  } else 
  if (subsetToScan === 'Fail only') {
    return legacyAnnotationsMainnet[miner].startsWith('fail,')
  } else */ if (subsetToScan === 'All recents') {
    return dailyCountsReport.miners[miner] || multidayCountsReport.miners[miner] || latestDhtAddrsMiners.has(miner)
  } else if (subsetToScan === 'No recents') {
    return !(dailyCountsReport.miners[miner] || multidayCountsReport.miners[miner] || latestDhtAddrsMiners.has(miner))
  } else {
    return true
  }
}))
)}

function _workingMiner(minerPeerIds){return(
minerPeerIds.find(({ miner }) => miner === 'f02620')
)}

function _dhtFindPeerFirst(client,workingMiner){return(
client.netFindPeer(workingMiner.peerId)
)}

function _dhtFindPeerStream(transform,client,filteredMinerPeerIds,maxElapsed){return(
async function* dhtFindPeerStream() {
  const concurrency = 15
  const callDhtFindPeerStream = transform(concurrency, async ({ miner, peerId }) => {
    try {
      const { Addrs: multiaddrs } = (await client.netFindPeer(peerId))

      return {
        miner,
        peerId,
        multiaddrs: multiaddrs.sort()
      }
    } catch (e) {
      console.info('DHT lookup error', miner, e.message)
      return {}
    }
  })
  const startTime = new Date()
  let counter = 0
  let hits = 0
  let errors = 0
  let lastMiner
  for await (const dhtLookup of callDhtFindPeerStream(filteredMinerPeerIds)) {
    const now = new Date()
    if (now - startTime > maxElapsed) {
      yield {
        done: true,
        timeout: true,
        counter,
        hits,
        errors
      }
      return
    }
    if (dhtLookup.miner) {
      lastMiner = dhtLookup.miner
      hits++
      yield {
        counter,
        hits,
        errors,
        ...dhtLookup
      }
    } else {
      errors++
      yield {
        counter,
        hits,
        errors,
        lastMiner
      }
    }
    counter++
  }
  yield {
    done: true,
    counter,
    hits,
    errors
  }
}
)}

function _32(filteredMinerPeerIds){return(
filteredMinerPeerIds.length
)}

async function* _minerDhtAddrs(start,dhtFindPeerStream,filteredMinerPeerIds,sortMinerRecords)
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
  let lastCounter = 0
  const startTime = new Date()
  for await (const {counter, hits, errors, ...record} of dhtFindPeerStream()) {
    totalErrors = errors
    lastCounter = counter
    if (record.miner) {
      records.push(record)
    }
    yield {
      state: "streaming",
      elapsed: ((new Date()) - startTime) / 1000,
      scannedPeers: counter,
      totalPeers: filteredMinerPeerIds.length,
      recordsLength: records.length,
      errors
    }
  }
  const endTime = new Date()
  yield {
    state: "done",
    elapsed: (endTime - startTime) / 1000,
    scannedPeers: lastCounter,
    totalPeers: filteredMinerPeerIds.length,
    records: records.sort(sortMinerRecords),
    startTime,
    endTime,
    errors: totalErrors
  }
}


function _35(minerDhtAddrs,md,maxRows){return(
minerDhtAddrs.state === 'done' && md`Miner | Multiaddrs
---|---
${minerDhtAddrs.records.slice(0, maxRows).map(({ miner, multiaddrs }) => {
  const multiaddrsFormatted = multiaddrs ? multiaddrs.join(' ') : ''
  let lines = `${miner} | ${multiaddrsFormatted}\n`
  return lines
})}
`
)}

function _maxRows(){return(
100
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

function _client(BrowserProvider,endpointUrl,LotusRPC,schema)
{
  const provider = new BrowserProvider(endpointUrl)
  return new LotusRPC(provider, { schema })
}


function _45(md){return(
md`## More imports`
)}

async function _transform(){return(
(await import('https://unpkg.com/streaming-iterables@7.1.0?module')).transform
)}

function _d3(require){return(
require("d3@6")
)}

function _dateFns(require){return(
require('https://bundle.run/date-fns@2.22.1')
)}

function _51(md){return(
md`## Backups`
)}

function _53(backups){return(
backups()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("endpointUrl")).define("endpointUrl", _endpointUrl);
  main.variable(observer()).define(["client"], _5);
  main.variable(observer("chainHead")).define("chainHead", ["client"], _chainHead);
  main.variable(observer("currentEpoch")).define("currentEpoch", ["chainHead"], _currentEpoch);
  main.variable(observer("currentEpochDate")).define("currentEpochDate", ["epochToDate","currentEpoch"], _currentEpochDate);
  main.variable(observer("viewof subsetToScan")).define("viewof subsetToScan", ["Inputs"], _subsetToScan);
  main.variable(observer("subsetToScan")).define("subsetToScan", ["Generators", "viewof subsetToScan"], (G, _) => G.input(_));
  main.variable(observer("viewof start")).define("viewof start", ["Inputs"], _start);
  main.variable(observer("start")).define("start", ["Generators", "viewof start"], (G, _) => G.input(_));
  main.variable(observer()).define(["filteredMinerPeerIds"], _11);
  main.variable(observer("maxElapsed")).define("maxElapsed", _maxElapsed);
  const child1 = runtime.module(define1);
  main.import("minerInfoSubsetLatest", child1);
  main.variable(observer()).define(["minerInfoSubsetLatest"], _14);
  main.variable(observer()).define(["md"], _15);
  main.variable(observer("minerPeerIds")).define("minerPeerIds", ["minerInfoSubsetLatest"], _minerPeerIds);
  main.variable(observer()).define(["md"], _17);
  const child2 = runtime.module(define1);
  main.import("legacyAnnotationsMainnet", child2);
  main.variable(observer()).define(["md"], _20);
  const child3 = runtime.module(define1);
  main.import("dhtAddrsLatestBucketUrl", child3);
  main.variable(observer("dailyCountsReport")).define("dailyCountsReport", ["dhtAddrsLatestBucketUrl"], _dailyCountsReport);
  main.variable(observer("multidayCountsReport")).define("multidayCountsReport", ["dhtAddrsLatestBucketUrl"], _multidayCountsReport);
  main.variable(observer("dhtAddrsLatestReport")).define("dhtAddrsLatestReport", ["dhtAddrsLatestBucketUrl"], _dhtAddrsLatestReport);
  main.variable(observer("minTimestamp")).define("minTimestamp", ["dateFns"], _minTimestamp);
  main.variable(observer("latestDhtAddrsMiners")).define("latestDhtAddrsMiners", ["dhtAddrsLatestReport","d3","minTimestamp"], _latestDhtAddrsMiners);
  main.variable(observer()).define(["subsetToScan"], _27);
  main.variable(observer("filteredMinerPeerIds")).define("filteredMinerPeerIds", ["d3","minerPeerIds","subsetToScan","dailyCountsReport","multidayCountsReport","latestDhtAddrsMiners"], _filteredMinerPeerIds);
  main.variable(observer("workingMiner")).define("workingMiner", ["minerPeerIds"], _workingMiner);
  main.variable(observer("dhtFindPeerFirst")).define("dhtFindPeerFirst", ["client","workingMiner"], _dhtFindPeerFirst);
  main.variable(observer("dhtFindPeerStream")).define("dhtFindPeerStream", ["transform","client","filteredMinerPeerIds","maxElapsed"], _dhtFindPeerStream);
  main.variable(observer()).define(["filteredMinerPeerIds"], _32);
  main.variable(observer("minerDhtAddrs")).define("minerDhtAddrs", ["start","dhtFindPeerStream","filteredMinerPeerIds","sortMinerRecords"], _minerDhtAddrs);
  main.variable(observer()).define(["minerDhtAddrs","md","maxRows"], _35);
  main.variable(observer("maxRows")).define("maxRows", _maxRows);
  main.variable(observer()).define(["md"], _37);
  main.variable(observer("LotusRPC")).define("LotusRPC", _LotusRPC);
  main.variable(observer("BrowserProvider")).define("BrowserProvider", _BrowserProvider);
  main.variable(observer("schema")).define("schema", _schema);
  main.variable(observer()).define(["md"], _41);
  main.variable(observer()).define(["schema"], _42);
  main.variable(observer()).define(["md"], _43);
  main.variable(observer("client")).define("client", ["BrowserProvider","endpointUrl","LotusRPC","schema"], _client);
  main.variable(observer()).define(["md"], _45);
  main.variable(observer("transform")).define("transform", _transform);
  const child4 = runtime.module(define2);
  main.import("epochToDate", child4);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("dateFns")).define("dateFns", ["require"], _dateFns);
  const child5 = runtime.module(define3);
  main.import("sortMinerRecords", child5);
  main.variable(observer()).define(["md"], _51);
  const child6 = runtime.module(define3);
  main.import("backups", child6);
  main.import("backupNowButton", child6);
  main.variable(observer()).define(["backups"], _53);
  return main;
}
