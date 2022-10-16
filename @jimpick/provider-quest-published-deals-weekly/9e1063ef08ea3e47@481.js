// https://observablehq.com/@jimpick/provider-quest-published-deals-weekly@481
import define1 from "./5cf93b57a7444002@282.js";
import define2 from "./c4e4a355c53d2a1a@111.js";

function _1(md){return(
md`# Published Deals: Weekly [Provider.Quest]`
)}

function _2(md,quickMenu){return(
md`${quickMenu}`
)}

function _3(md){return(
md`Notes:

* Numbers are based on published deal proposals encoded in messages on the Filecoin blockchain.
* The [scanning script](https://observablehq.com/@jimpick/provider-quest-publish-deal-messages-stream?collection=@jimpick/provider-quest) is usually run multiple times per hour, but there may be gaps in the data from time to time. This system is optimized for timeliness instead of accuracy.
* Dates are based on when a message was published on the blockchain, not when the deal proposal was sent to a provider, or when the deal proving interval starts or when the sector is created.
* Not all published deals are successfully committed to sectors by providers, and occasionally providers lose data and get slashed, so these numbers will be greater than the actual amount of data stored to Filecoin. Check the [Starboard Deals](https://dashboard.starboard.ventures/deals) dashboard for information on "committed" deals.
* Distinct counts are calculated continuously with Spark Structured Streaming using an approximation algorithm.
* A similar report is available for [Daily Deals](https://observablehq.com/@jimpick/provider-quest-published-deals-daily?collection=@jimpick/provider-quest), [Hourly Deals](https://observablehq.com/@jimpick/provider-quest-published-deals-hourly?collection=@jimpick/provider-quest) and [Hourly Deals: Named Clients](https://observablehq.com/@jimpick/provider-quest-deals-named-clients-hourly?collection=@jimpick/provider-quest).
`
)}

function _4(md){return(
md`## Published Deals Per Week`
)}

function _5(Plot,weeklyDeals){return(
Plot.plot({
  y: {
    grid: true
  },
  marginLeft: 60,
  marks: [
    Plot.areaY(weeklyDeals, {x: "date", y: "count", fill: "#bab0ab", curve: "step" }),
    Plot.ruleY([0])
  ]
})
)}

function _6(md){return(
md`## Total Data Size of Published Deals Per Week (TiB)`
)}

function _7(Plot,weeklyDeals){return(
Plot.plot({
  y: {
    grid: true
  },
  marks: [
    Plot.areaY(weeklyDeals, {x: "date", y: "sumPieceSizeTiB", fill: "#bab0ab", curve: "step"}),
    Plot.ruleY([0])
  ]
})
)}

function _8(md){return(
md`## Lifetime Value of Published Deals Per Week (FIL)`
)}

function _9(Plot,weeklyDeals){return(
Plot.plot({
  y: {
    grid: true
  },
  marks: [
    Plot.areaY(weeklyDeals, {x: "date", y: "sum(lifetimeValue)", fill: "#bab0ab", curve: "step"}),
    Plot.ruleY([0])
  ]
})
)}

function _10(md){return(
md`## Number of Providers that Accepted Deals`
)}

function _11(Plot,weeklyDeals){return(
Plot.plot({
  y: {
    grid: true
  },
  marks: [
    Plot.areaY(weeklyDeals, {x: "date", y: "approx_count_distinct(provider)", fill: "#bab0ab", curve: "step"}),
    Plot.ruleY([0])
  ]
})
)}

function _12(md){return(
md`## Number of Clients that Placed Deals`
)}

function _13(Plot,weeklyDeals){return(
Plot.plot({
  y: {
    grid: true
  },
  marks: [
    Plot.areaY(weeklyDeals, {x: "date", y: "approx_count_distinct(client)", fill: "#bab0ab", curve: "step"}),
    Plot.ruleY([0])
  ]
})
)}

function _14(md){return(
md`## Number of Client <-> Provider Pairs`
)}

function _15(Plot,weeklyDeals){return(
Plot.plot({
  y: {
    grid: true
  },
  marks: [
    Plot.areaY(weeklyDeals, {x: "date", y: "approx_count_distinct(clientProvider)", fill: "#bab0ab", curve: "step"}),
    Plot.ruleY([0])
  ]
})
)}

function _16(md){return(
md`## Distinct CIDs (Content Identifiers)`
)}

function _17(Plot,weeklyDeals){return(
Plot.plot({
  y: {
    grid: true
  },
  marginLeft: 60,
  marks: [
    Plot.areaY(weeklyDeals, {x: "date", y: "approx_count_distinct(label)", fill: "#bab0ab", curve: "step"}),
    Plot.ruleY([0])
  ]
})
)}

function _18(md){return(
md `## Unverified/Verified: Deals Per Day`
)}

function _19(Plot){return(
Plot.plot({
  marks: [
    Plot.cell(['Unverified', 'Verified'], {x: d => d, fill: d => d})
  ]
})
)}

function _20(Plot,weeklyDealsByVerified){return(
Plot.plot({
  y: {
    grid: true
  },
  marginLeft: 60,
  marks: [
    Plot.areaY(weeklyDealsByVerified, {x: "date", y: "count", fill: d => `${d.verifiedDeal}`, curve: "step"}),
    Plot.ruleY([0])
  ]
})
)}

function _21(md){return(
md`## Unverified/Verified: Total Data Size (TiB)`
)}

function _22(Plot){return(
Plot.plot({
  marks: [
    Plot.cell(['Unverified', 'Verified'], {x: d => d, fill: d => d})
  ]
})
)}

function _23(Plot,weeklyDealsByVerified){return(
Plot.plot({
  y: {
    grid: true,
    label: `↑ TiB`
  },
  marks: [
    Plot.areaY(weeklyDealsByVerified, {x: "date", y: "sumPieceSizeTiB", fill: d => `${d.verifiedDeal}`, curve: "step"}),
    Plot.ruleY([0])
  ]
})
)}

function _24(md){return(
md`## Data`
)}

async function _weeklyDealsRaw(dealsBucketUrl){return(
(await fetch(`${dealsBucketUrl}/weekly-totals.json`)).json()
)}

function _weeklyDeals(weeklyDealsRaw,d3){return(
weeklyDealsRaw.map(record => ({
  date: d3.isoParse(record.window.start),
  sumPieceSizeKiB: record['sum(pieceSizeDouble)'] / 1024,
  sumPieceSizeMiB: record['sum(pieceSizeDouble)'] / 1024 ** 2,
  sumPieceSizeGiB: record['sum(pieceSizeDouble)'] / 1024 ** 3,
  sumPieceSizeTiB: record['sum(pieceSizeDouble)'] / 1024 ** 4,
  ...record
}))
)}

function _28(Inputs,weeklyDeals){return(
Inputs.table(weeklyDeals.map(({window, ...rest}) => rest))
)}

async function _weeklyDealsByVerifiedRaw(dealsBucketUrl){return(
(await fetch(`${dealsBucketUrl}/weekly-totals-verified.json`)).json()
)}

function _weeklyDealsByVerified(weeklyDealsByVerifiedRaw,d3){return(
weeklyDealsByVerifiedRaw.map(record => ({
  date: d3.isoParse(record.window.start),
  sumPieceSizeKiB: record['sum(pieceSizeDouble)'] / 1024,
  sumPieceSizeMiB: record['sum(pieceSizeDouble)'] / 1024 ** 2,
  sumPieceSizeGiB: record['sum(pieceSizeDouble)'] / 1024 ** 3,
  sumPieceSizeTiB: record['sum(pieceSizeDouble)'] / 1024 ** 4,
  ...record
})).sort((a, b) => {
  const comp1 = a.date - b.date
  if (comp1 !== 0) return comp1
  return Number(a.verifiedDeal) - Number(b.verifiedDeal)
})
)}

function _31(Inputs,weeklyDealsByVerified){return(
Inputs.table(weeklyDealsByVerified.map(({window, ...rest}) => rest))
)}

function _32(md){return(
md`## Imports`
)}

function _d3(require){return(
require("d3@6")
)}

function _35(md){return(
md`## Backups`
)}

function _37(backups){return(
backups()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md","quickMenu"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["Plot","weeklyDeals"], _5);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["Plot","weeklyDeals"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer()).define(["Plot","weeklyDeals"], _9);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer()).define(["Plot","weeklyDeals"], _11);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer()).define(["Plot","weeklyDeals"], _13);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer()).define(["Plot","weeklyDeals"], _15);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer()).define(["Plot","weeklyDeals"], _17);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer()).define(["Plot"], _19);
  main.variable(observer()).define(["Plot","weeklyDealsByVerified"], _20);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer()).define(["Plot"], _22);
  main.variable(observer()).define(["Plot","weeklyDealsByVerified"], _23);
  main.variable(observer()).define(["md"], _24);
  const child1 = runtime.module(define1);
  main.import("dealsBucketUrl", child1);
  main.variable(observer("weeklyDealsRaw")).define("weeklyDealsRaw", ["dealsBucketUrl"], _weeklyDealsRaw);
  main.variable(observer("weeklyDeals")).define("weeklyDeals", ["weeklyDealsRaw","d3"], _weeklyDeals);
  main.variable(observer()).define(["Inputs","weeklyDeals"], _28);
  main.variable(observer("weeklyDealsByVerifiedRaw")).define("weeklyDealsByVerifiedRaw", ["dealsBucketUrl"], _weeklyDealsByVerifiedRaw);
  main.variable(observer("weeklyDealsByVerified")).define("weeklyDealsByVerified", ["weeklyDealsByVerifiedRaw","d3"], _weeklyDealsByVerified);
  main.variable(observer()).define(["Inputs","weeklyDealsByVerified"], _31);
  main.variable(observer()).define(["md"], _32);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  const child2 = runtime.module(define2);
  main.import("quickMenu", child2);
  main.variable(observer()).define(["md"], _35);
  const child3 = runtime.module(define2);
  main.import("backups", child3);
  main.import("backupNowButton", child3);
  main.variable(observer()).define(["backups"], _37);
  return main;
}
