import define1 from "./5cf93b57a7444002@284.js";
import define2 from "./c4e4a355c53d2a1a@111.js";

function _1(md){return(
md`# Asks (by Piece Size) [Provider.Quest]`
)}

function _2(md,quickMenu){return(
md`${quickMenu}`
)}

function _3(md,multidayDealsReport){return(
md`Several times per day, I am scanning all the storage providers on Filecoin that appear to be reachable from my location the Internet, and I then query their "ask" information using [@jimpick/provider-quest-storage-ask-scanner](https://observablehq.com/@jimpick/provider-quest-storage-ask-scanner?collection=@jimpick/provider-quest).

The latest asks are combined into a JSON report and published to a Textile Bucket. The JSON file can be fetched via HTTP ... the [@jimpick/provider-quest-feeds](https://observablehq.com/@jimpick/provider-quest-feeds?collection=@jimpick/provider-quest) notebook has the URLs and exports for fetching this data, and several other useful feeds.

You can use the tool in this notebook to select a piece size (the data size you want to store, rounded up to a power of 2), and view the miners that support storing that size, ordered by price (either non-verified or verified a.k.a. Filecoin Plus).

**Historical Deal Data:** To help put the pricing in context, I am now also showing historical published deal data. The data shows the number of deals per miner, the total size of the deals combined together, and the number of distinct clients over a window of ${multidayDealsReport.intervalDays} days. I'm showing statistics aggregated for all piece sizes, not just the selected piece size. Historical deals may have been accepted at different price points than current asks.

**Historical Power Data:** I am now also showing historical power data. The data shows the power acquired by a miner averaged over a window of ${multidayDealsReport.intervalDays} days. The historically averaged power data should be less volatile than live power data which can periodically dip to zero when miners encounter transient issues.

**Legacy Testing Annotations:** For now, I am also displaying some annotations for each miner which shows some results from my "legacy" testing system with very small file sizes. The annotation states only represent the result of my latest round of testing and are not necessarily up-to-date or reliable. I am working to replace this system with a better one. For each miner, I make a crude attempt to geo-locate them based on their IP address, but I don't usually update these often. My future testing system will automate this better. I use the label *"NR"* (non-routable) when I couldn't find an IP address (but the miner may have added one after I made the annotation). Miners tagged as **"active"** are ones which I was able to successfully store a small file and for which the miner has completed the proof of replication and is proving the storage to Filecoin. Other annotations you might see are **"sealing"**, or **"active-sealing"**, which means the miner has accepted my deals, but hasn't finished sealing yet. You might see **"inflight"**, or **"stuck"** when I've sent a deal but the miner hasn't started sealing it yet. Some deals end in **"error"** due to many different problems - you can see some error logs as comments on [GitHub](https://github.com/jimpick/workshop-client-mainnet/blob/main/src/annotations-mainnet.js). Often the error is on my end of the deal as I am frequently upgrading my Lotus node and running unstable versions. If you see **"min-size"**, it is because I'm only testing small files and the miner only accepts large files. If you see **"min-ask"**, it's because my legacy testing system is unaware of ask pricing, and sends deals to miners with a lower deal price than they are willing to accept. Some miners rejected my deals for various reasons, so those are labeled as **rejected**. I'm filtering out miners that I can't dial. I am going to replace this testing system with a smarter one built using ObservableHQ notebooks.`
)}

function _selectedSize(Inputs,sizesBytes){return(
Inputs.select(sizesBytes, { format: x => x.pretty, label: "Piece Size", value: sizesBytes.find(x => x.pretty === '1GiB') })
)}

function _5(md){return(
md`Prices are in attoFIL per epoch (30 seconds) per GiB`
)}

function _sortBy(Inputs){return(
Inputs.radio(['Price', 'Verified Price'], {label: "Sort By", value: 'Price'})
)}

function _filterOut(Inputs){return(
Inputs.checkbox(["ridiculous price", "ridiculous verified price", "rejected", "no deals", "<10 deals", "<50 deals", "<100 deals", "<3 clients", "<5 clients"], {label: "Filter out", value: ["ridiculous price", "ridiculous verified price", "no deals", "<10 deals", "<50 deals", "<3 clients"] })
)}

function _8(sortBy,md,filteredAsks,multidayDeals,bytes,minerPowerMultidayReport,legacyAnnotationsMainnet,maxRows)
{

 const titles = 'Miner | ' +
   (sortBy === 'Price' ? 'Price | Verified Price' : 'Verified Price | Price') +
   ' | Deals | Total Size | Clients | Power | Annotation'
 const output = md`${titles}
---|---|---|---|---|---|---
${filteredAsks.sort(sortByFunc).map(({ miner, price, verifiedPrice }) => {
  let line = `${miner} | ` +
    (sortBy === 'Price' ? `${price} | ${verifiedPrice}` : `${verifiedPrice} | ${price}`) +
    ` | ` + (multidayDeals[miner] ? multidayDeals[miner].count : '') +
    ` | ` + (multidayDeals[miner] ? bytes(multidayDeals[miner]['sum(pieceSizeDouble)'], { mode: 'binary' }) : '') +
    ` | ` + (multidayDeals[miner] ? multidayDeals[miner]['approx_count_distinct(client)'] : '') +
    ` | ` + (minerPowerMultidayReport && minerPowerMultidayReport.miners[miner] ? bytes(minerPowerMultidayReport.miners[miner].qualityAdjPower, { mode: 'binary' }) : '') +
    ` | ${legacyAnnotationsMainnet[miner]}\n`
  return line
}).slice(0, maxRows)}
`
  return output

  function sortByFunc(a, b) {
    let compare
    if (sortBy === 'Price') {
       compare = a.priceDouble - b.priceDouble
    }
    if (sortBy === 'Verified Price') {
      compare = a.verifiedPriceDouble - b.verifiedPriceDouble
    }
    if (compare !== 0) return compare
    const sizeA = (multidayDeals && multidayDeals[a.miner]) ? multidayDeals[a.miner]['sum(pieceSizeDouble)'] : 0 
    const sizeB = (multidayDeals && multidayDeals[b.miner]) ? multidayDeals[b.miner]['sum(pieceSizeDouble)'] : 0 
    const compareSize = sizeB - sizeA
    if (compareSize !== 0) return compareSize
    
    return Number(a.miner.slice(1)) - Number(b.miner.slice(1))
  }
}


function _maxRows(){return(
1000
)}

function _10(md){return(
md`## Price Converter Widget`
)}

function _selectedPrice(Inputs,pricePoints){return(
Inputs.select(pricePoints, { format: x => `${x} attoFIL`, label: "Price Per Epoch" })
)}

function _12(selectedPrice,selectedSize,filUsdFromCoinGecko,md)
{
  const filPerEpoch = Number(selectedPrice) / 1e18
  const epochsPerYear = 365 * 24 * 60 * 2
  const sizeInGiB = selectedSize.bytes / 1024 ** 3
  const filCost = filPerEpoch * epochsPerYear * sizeInGiB
  const usdCost = filCost * filUsdFromCoinGecko
  return md`Cost to store ${selectedSize.pretty} for 1 year = **${filCost.toFixed(4)} FIL** ($${usdCost.toFixed(4)} USD\*)<br><i>Note: Using current trading price from the CoinGecko API: 1 FIL = $${filUsdFromCoinGecko} USD</i>`
}


function _13(md){return(
md`## Data`
)}

function _sizes(){return(
[...Array(29).keys()].map(i => 2 ** (8 + i))
)}

function _sizesBytes(sizes,bytes){return(
sizes.map(size => ({ pretty: bytes(size, { mode: 'binary' }), bytes: size }))
)}

function _17(asksSubsetLatest){return(
asksSubsetLatest
)}

function _liveAsks(asksSubsetLatest,d3,minTimestamp)
{
    const entries = Object.entries(asksSubsetLatest.miners)
    .map(([miner, { timestamp, ...rest }]) => ([miner, {
      timestamp: d3.isoParse(timestamp),
      ...rest
    }]))
    .filter(([miner, ask]) => (
      ask.timestamp >= minTimestamp
    ))
    .map(([miner, ask]) => ({miner, ...ask}))
  return entries
}


function _minTimestamp(dateFns){return(
dateFns.subDays(new Date(), 3)
)}

function _filteredAsks(asksSubsetLatest,d3,minTimestamp,selectedSize,filterOut,legacyAnnotationsMainnet,multidayDeals)
{
  const entries = Object.entries(asksSubsetLatest.miners)
    .map(([miner, { timestamp, ...rest }]) => ([miner, {
      timestamp: d3.isoParse(timestamp),
      ...rest
    }]))
    .filter(([miner, ask]) => (
      ask.timestamp >= minTimestamp &&
      ask.minPieceSize <= selectedSize.bytes &&
      ask.maxPieceSize >= selectedSize.bytes &&
      (filterOut.includes('ridiculous price') ? ask.priceDouble < 1e14 : true) &&
      (filterOut.includes('ridiculous verified price') ? ask.verifiedPriceDouble < 1e14 : true) &&
      (filterOut.includes('rejected') && legacyAnnotationsMainnet[miner] ? !legacyAnnotationsMainnet[miner].match(/^rejected,/) : true) &&
      (filterOut.includes('no deals') ? (multidayDeals && multidayDeals[miner]): true) &&
      (filterOut.includes('<10 deals') ? (multidayDeals && multidayDeals[miner] && multidayDeals[miner].count >= 10): true) &&
      (filterOut.includes('<50 deals') ? (multidayDeals && multidayDeals[miner] && multidayDeals[miner].count >= 50): true) &&
      (filterOut.includes('<100 deals') ? (multidayDeals && multidayDeals[miner] && multidayDeals[miner].count >= 100): true) &&
      (filterOut.includes('<3 clients') ? (multidayDeals && multidayDeals[miner] && multidayDeals[miner]['approx_count_distinct(client)'] >= 3): true) &&
      (filterOut.includes('<5 clients') ? (multidayDeals && multidayDeals[miner] && multidayDeals[miner]['approx_count_distinct(client)'] >= 5): true) /* &&
      !legacyAnnotationsMainnet[miner].match(/^fail,/) &&
      !legacyAnnotationsMainnet[miner].match(/^delist,/) */
    ))
    .map(([miner, ask]) => ({miner, ...ask}))
  return entries
}


function _22(legacyAnnotationsMainnet){return(
legacyAnnotationsMainnet
)}

async function _multidayDealsReport(dealsBucketUrl){return(
(await fetch(`${dealsBucketUrl}/multiday-average-latest.json`)).json()
)}

function _25(multidayDealsReport){return(
multidayDealsReport
)}

function _multidayDeals(multidayDealsReport){return(
multidayDealsReport.providers
)}

async function _minerPowerMultidayReport(minerPowerMultidayAverageLatestBucketUrl){return(
(await fetch(`${minerPowerMultidayAverageLatestBucketUrl}/miner-power-multiday-average-latest.json`)).json()
)}

function _pricePoints(filteredAsks)
{
  const prices = new Set()
  for (const ask of filteredAsks) {
    prices.add(ask.price)
    prices.add(ask.verifiedPrice)
  }
  return [...prices].sort((a, b) => Number(a) - Number(b))
}


async function _filUsdFromCoinGecko(){return(
(await (await fetch('https://api.coingecko.com/api/v3/simple/price?ids=filecoin&vs_currencies=usd')).json()).filecoin.usd
)}

function _31(md){return(
md`## Imports`
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

function _36(md){return(
md`## Backups`
)}

function _38(backups){return(
backups()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md","quickMenu"], _2);
  main.variable(observer()).define(["md","multidayDealsReport"], _3);
  main.variable(observer("viewof selectedSize")).define("viewof selectedSize", ["Inputs","sizesBytes"], _selectedSize);
  main.variable(observer("selectedSize")).define("selectedSize", ["Generators", "viewof selectedSize"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("viewof sortBy")).define("viewof sortBy", ["Inputs"], _sortBy);
  main.variable(observer("sortBy")).define("sortBy", ["Generators", "viewof sortBy"], (G, _) => G.input(_));
  main.variable(observer("viewof filterOut")).define("viewof filterOut", ["Inputs"], _filterOut);
  main.variable(observer("filterOut")).define("filterOut", ["Generators", "viewof filterOut"], (G, _) => G.input(_));
  main.variable(observer()).define(["sortBy","md","filteredAsks","multidayDeals","bytes","minerPowerMultidayReport","legacyAnnotationsMainnet","maxRows"], _8);
  main.variable(observer("maxRows")).define("maxRows", _maxRows);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer("viewof selectedPrice")).define("viewof selectedPrice", ["Inputs","pricePoints"], _selectedPrice);
  main.variable(observer("selectedPrice")).define("selectedPrice", ["Generators", "viewof selectedPrice"], (G, _) => G.input(_));
  main.variable(observer()).define(["selectedPrice","selectedSize","filUsdFromCoinGecko","md"], _12);
  main.variable(observer()).define(["md"], _13);
  main.variable(observer("sizes")).define("sizes", _sizes);
  main.variable(observer("sizesBytes")).define("sizesBytes", ["sizes","bytes"], _sizesBytes);
  const child1 = runtime.module(define1);
  main.import("asksSubsetLatest", child1);
  main.variable(observer()).define(["asksSubsetLatest"], _17);
  main.variable(observer("liveAsks")).define("liveAsks", ["asksSubsetLatest","d3","minTimestamp"], _liveAsks);
  main.variable(observer("minTimestamp")).define("minTimestamp", ["dateFns"], _minTimestamp);
  main.variable(observer("filteredAsks")).define("filteredAsks", ["asksSubsetLatest","d3","minTimestamp","selectedSize","filterOut","legacyAnnotationsMainnet","multidayDeals"], _filteredAsks);
  const child2 = runtime.module(define1);
  main.import("legacyAnnotationsMainnet", child2);
  main.variable(observer()).define(["legacyAnnotationsMainnet"], _22);
  const child3 = runtime.module(define1);
  main.import("dealsBucketUrl", child3);
  main.variable(observer("multidayDealsReport")).define("multidayDealsReport", ["dealsBucketUrl"], _multidayDealsReport);
  main.variable(observer()).define(["multidayDealsReport"], _25);
  main.variable(observer("multidayDeals")).define("multidayDeals", ["multidayDealsReport"], _multidayDeals);
  const child4 = runtime.module(define1);
  main.import("minerPowerMultidayAverageLatestBucketUrl", child4);
  main.variable(observer("minerPowerMultidayReport")).define("minerPowerMultidayReport", ["minerPowerMultidayAverageLatestBucketUrl"], _minerPowerMultidayReport);
  main.variable(observer("pricePoints")).define("pricePoints", ["filteredAsks"], _pricePoints);
  main.variable(observer("filUsdFromCoinGecko")).define("filUsdFromCoinGecko", _filUsdFromCoinGecko);
  main.variable(observer()).define(["md"], _31);
  main.variable(observer("bytes")).define("bytes", _bytes);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("dateFns")).define("dateFns", ["require"], _dateFns);
  const child5 = runtime.module(define2);
  main.import("quickMenu", child5);
  main.variable(observer()).define(["md"], _36);
  const child6 = runtime.module(define2);
  main.import("backups", child6);
  main.import("backupNowButton", child6);
  main.variable(observer()).define(["backups"], _38);
  return main;
}
