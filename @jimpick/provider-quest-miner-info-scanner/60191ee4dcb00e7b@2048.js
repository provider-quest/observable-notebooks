// https://observablehq.com/@jimpick/provider-quest-miner-info-scanner@2048
import define1 from "./5cf93b57a7444002@222.js";
import define2 from "./a957eb792b00ff81@406.js";
import define3 from "./c4e4a355c53d2a1a@111.js";

function _1(md){return(
md`# Internal: Scanner: Provider Info [Provider.Quest]`
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
md`Just use the miners that have power.`
)}

async function _minerPowerLatestReport(minerPowerDailyAverageLatestBucketUrl){return(
(await fetch(`${minerPowerDailyAverageLatestBucketUrl}/miner-power-latest.json`)).json()
)}

function _minTimestamp(dateFns){return(
dateFns.subDays(new Date(), 7)
)}

function _recentMiners(minerPowerLatestReport,d3,minTimestamp)
{
  const recentMinerSet = new Set()
  for (const miner of Object.keys(minerPowerLatestReport.miners)) {
    if (d3.isoParse(minerPowerLatestReport.miners[miner].timestamp) > minTimestamp) {
      recentMinerSet.add(miner)
    }
  }
  return [...recentMinerSet]
}


function _minerCount(recentMiners){return(
recentMiners.length
)}

function _20(Inputs,recentMiners,sortMiners){return(
Inputs.table(recentMiners.sort(sortMiners).map(i => ({miner: i})))
)}

function _testMiner(){return(
'f02620'
)}

function _testMinerInfo(client,testMiner,tipSetKey){return(
client.stateMinerInfo(testMiner, tipSetKey)
)}

function _minerInfoStream(transform,client,tipSetKey,Multiaddr,Buffer,recentMiners,selectedEpoch){return(
async function* minerInfoStream() {
  const concurrency = 15
  const callMinerInfoStream = transform(concurrency, async miner => {
    try {
      const minerInfo = (await client.stateMinerInfo(miner, tipSetKey))
      let controlAddresses = minerInfo.ControlAddresses
      let multiaddrs = minerInfo.Multiaddrs
      let multiaddrsDecoded
      if (multiaddrs) {
        let decodedAddrs = []
        for (const maddrBin of multiaddrs) {
          try {
            decodedAddrs.push(new Multiaddr(
              Buffer.from(maddrBin, 'base64')
            ).toString())
          } catch (e) {
            console.error('Error decoding maddr', maddrBin, e)
          }
        }
        if (decodedAddrs.length > 0) {
          multiaddrsDecoded = decodedAddrs.sort()
        }
        multiaddrs.sort()
      }

      return {
        miner,
        owner: minerInfo.Owner,
        worker: minerInfo.Worker,
        newWorker: minerInfo.NewWorker,
        controlAddresses,
        workerChangeEpoch: minerInfo.workerChangeEpoch,
        peerId: minerInfo.PeerId,
        multiaddrs,
        multiaddrsDecoded,
        windowPoStProofType: minerInfo.WindowPoStProofType,
        sectorSize: minerInfo.SectorSize,
        windowPoStPartitionSectors: minerInfo.WindowPoStPartitionSectors,
        consensusFaultElapsed: minerInfo.ConsensusFaultElapsed
      }
    } catch (e) {
      console.error('Fetch error', e)
      return {}
    }
  })
  let counter = 0
  let errors = 0
  for await (const minerInfo of callMinerInfoStream(recentMiners)) {
    if (minerInfo.miner) {
      yield {
        counter,
        errors,
        epoch: selectedEpoch,
        ...minerInfo
      }
    } else {
      errors++
    }
    counter++
  }
}
)}

async function* _minerInfo(minerInfoStream)
{
  let records = []
  let totalErrors = 0
  const startTime = new Date()
  for await (const {counter, errors, epoch, ...record} of minerInfoStream()) {
    totalErrors = errors
    if (epoch) {
      records.push(record)
      yield {
        state: "streaming",
        elapsed: ((new Date()) - startTime) / 1000,
        recordsLength: records.length,
        errors
      }
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


function _26(minerInfo,md,maxRows,bytes){return(
minerInfo.state === 'done' && md`Miner | Sector Size | Peer ID | Control Addresses | Multiaddrs
---|---|---|---|---
${minerInfo.records.slice(0, maxRows).map(({ miner, sectorSize, peerId, controlAddresses, multiaddrs, multiaddrsDecoded }) => {
  const controlCount = controlAddresses ? controlAddresses.length : ''
  const multiaddrsFormatted = multiaddrs ? multiaddrsDecoded.join(' ') : ''
  const peerIdFormatted = peerId ? peerId.slice(0, 10) + '...' + peerId.slice(-8) : ''
  let lines = `${miner} | ${bytes(sectorSize, { mode: 'binary' })} | ${peerIdFormatted} | ${controlCount} | ${multiaddrsFormatted}\n`
  return lines
})}
`
)}

function _maxRows(){return(
190
)}

function _28(md){return(
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

function _32(md){return(
md`Here is the list of methods from the schema file. Currently just a subset of the available methods in the Lotus JSON-RPC API, but any method can be added.`
)}

function _33(schema){return(
Object.keys(schema.methods)
)}

function _34(md){return(
md`To make a client object to make calls with, you supply an endpoint url to make a websocket connection to the Lotus node to the RPC library, and supply a provider object (contains the websocket code) and a schema.`
)}

function _endpointUrl()
{
  return "wss://lotus.miner.report/mainnet_api/0/node/rpc/v0"
  // return "https://api.node.glif.io/rpc/v0"
}


function _client(BrowserProvider,endpointUrl,LotusRPC,schema)
{
  const provider = new BrowserProvider(endpointUrl)
  return new LotusRPC(provider, { schema })
}


function _37(md){return(
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

function _44(Multiaddr,maddrBin){return(
(new Multiaddr(maddrBin)).toString()
)}

function _dateFns(require){return(
require('https://bundle.run/date-fns@2.22.1')
)}

function _d3(require){return(
require("d3@6")
)}

function _48(md){return(
md`## Backups`
)}

function _50(backups){return(
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
  main.import("minerPowerDailyAverageLatestBucketUrl", child1);
  main.variable(observer("minerPowerLatestReport")).define("minerPowerLatestReport", ["minerPowerDailyAverageLatestBucketUrl"], _minerPowerLatestReport);
  main.variable(observer("minTimestamp")).define("minTimestamp", ["dateFns"], _minTimestamp);
  main.variable(observer("recentMiners")).define("recentMiners", ["minerPowerLatestReport","d3","minTimestamp"], _recentMiners);
  main.variable(observer("minerCount")).define("minerCount", ["recentMiners"], _minerCount);
  main.variable(observer()).define(["Inputs","recentMiners","sortMiners"], _20);
  main.variable(observer("testMiner")).define("testMiner", _testMiner);
  main.variable(observer("testMinerInfo")).define("testMinerInfo", ["client","testMiner","tipSetKey"], _testMinerInfo);
  main.variable(observer("minerInfoStream")).define("minerInfoStream", ["transform","client","tipSetKey","Multiaddr","Buffer","recentMiners","selectedEpoch"], _minerInfoStream);
  main.variable(observer("minerInfo")).define("minerInfo", ["minerInfoStream"], _minerInfo);
  main.variable(observer()).define(["minerInfo","md","maxRows","bytes"], _26);
  main.variable(observer("maxRows")).define("maxRows", _maxRows);
  main.variable(observer()).define(["md"], _28);
  main.variable(observer("LotusRPC")).define("LotusRPC", _LotusRPC);
  main.variable(observer("BrowserProvider")).define("BrowserProvider", _BrowserProvider);
  main.variable(observer("schema")).define("schema", _schema);
  main.variable(observer()).define(["md"], _32);
  main.variable(observer()).define(["schema"], _33);
  main.variable(observer()).define(["md"], _34);
  main.variable(observer("endpointUrl")).define("endpointUrl", _endpointUrl);
  main.variable(observer("client")).define("client", ["BrowserProvider","endpointUrl","LotusRPC","schema"], _client);
  main.variable(observer()).define(["md"], _37);
  main.variable(observer("transform")).define("transform", _transform);
  const child2 = runtime.module(define2);
  main.import("epochToDate", child2);
  main.variable(observer("bytes")).define("bytes", _bytes);
  main.variable(observer("Multiaddr")).define("Multiaddr", ["require"], _Multiaddr);
  main.variable(observer("Buffer")).define("Buffer", ["require"], _Buffer);
  main.variable(observer("maddrBin")).define("maddrBin", ["Buffer"], _maddrBin);
  main.variable(observer()).define(["Multiaddr","maddrBin"], _44);
  main.variable(observer("dateFns")).define("dateFns", ["require"], _dateFns);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  const child3 = runtime.module(define3);
  main.import("sortMiners", child3);
  main.variable(observer()).define(["md"], _48);
  const child4 = runtime.module(define3);
  main.import("backups", child4);
  main.import("backupNowButton", child4);
  main.variable(observer()).define(["backups"], _50);
  return main;
}
