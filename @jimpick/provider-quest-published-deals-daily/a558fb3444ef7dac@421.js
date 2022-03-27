// https://observablehq.com/@jimpick/provider-quest-published-deals-daily@421
import define1 from "./5cf93b57a7444002@185.js";
import define2 from "./c4e4a355c53d2a1a@111.js";

function _1(md){return(
md`# Published Deals: Daily [Provider.Quest]`
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
* A similar report is available for [Weekly Deals](https://observablehq.com/@jimpick/provider-quest-published-deals-weekly?collection=@jimpick/provider-quest), [Hourly Deals](https://observablehq.com/@jimpick/provider-quest-published-deals-hourly?collection=@jimpick/provider-quest) and [Hourly Deals: Named Clients](https://observablehq.com/@jimpick/provider-quest-deals-named-clients-hourly?collection=@jimpick/provider-quest).
* **Notice** - Some deal data is missing for Mar 21-22 due to a glitch.
`
)}

function _4(md){return(
md`## Published Deals Per Day`
)}

function _5(Plot,dailyDeals,d3){return(
Plot.plot({
  y: {
    grid: true
  },
  marginLeft: 60,
  marks: [
    Plot.rectY(dailyDeals, {
      x: { value: "date", interval: d3.utcDay },
      y: "count",
      fill: "#bab0ab"
    }),
    Plot.ruleY([0])
  ]
})
)}

function _6(md){return(
md`## Total Data Size of Published Deals Per Day (TiB)`
)}

function _7(Plot,dailyDeals,d3){return(
Plot.plot({
  y: {
    grid: true
  },
  marks: [
    Plot.rectY(dailyDeals, {
      x: { value: "date", interval: d3.utcDay },
      y: "sumPieceSizeTiB",
      fill: "#bab0ab"
    }),
    Plot.ruleY([0])
  ]
})
)}

function _8(md){return(
md`## Lifetime Value of Published Deals Per Day (FIL)`
)}

function _9(Plot,dailyDeals,d3){return(
Plot.plot({
  y: {
    grid: true
  },
  marks: [
    Plot.rectY(dailyDeals, {
      x: { value: "date", interval: d3.utcDay },
      y: "sum(lifetimeValue)",
      fill: "#bab0ab"
    }),
    Plot.ruleY([0])
  ]
})
)}

function _10(md){return(
md`## Number of Providers that Accepted Deals`
)}

function _11(Plot,dailyDeals,d3){return(
Plot.plot({
  y: {
    grid: true
  },
  marks: [
    Plot.rectY(dailyDeals, {
      x: { value: "date", interval: d3.utcDay },
      y: "approx_count_distinct(provider)",
      fill: "#bab0ab"
    }),
    Plot.ruleY([0])
  ]
})
)}

function _12(md){return(
md`## Number of Clients that Placed Deals`
)}

function _13(Plot,dailyDeals,d3){return(
Plot.plot({
  y: {
    grid: true
  },
  marks: [
    Plot.rectY(dailyDeals, {
      x: { value: "date", interval: d3.utcDay },
      y: "approx_count_distinct(client)",
      fill: "#bab0ab"
    }),
    Plot.ruleY([0])
  ]
})
)}

function _14(md){return(
md`## Number of Client <-> Provider Pairs`
)}

function _15(Plot,dailyDeals,d3){return(
Plot.plot({
  y: {
    grid: true
  },
  marks: [
    Plot.rectY(dailyDeals, {
      x: { value: "date", interval: d3.utcDay },
      y: "approx_count_distinct(clientProvider)",
      fill: "#bab0ab"
    }),
    Plot.ruleY([0])
  ]
})
)}

function _16(md){return(
md`## Distinct CIDs (Content Identifiers)`
)}

function _17(Plot,dailyDeals,d3){return(
Plot.plot({
  y: {
    grid: true
  },
  marginLeft: 60,
  marks: [
    Plot.rectY(dailyDeals, {
      x: { value: "date", interval: d3.utcDay },
      y: "approx_count_distinct(label)",
      fill: "#bab0ab"
    }),
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

function _20(Plot,dailyDealsByVerified,d3){return(
Plot.plot({
  y: {
    grid: true
  },
  marginLeft: 60,
  marks: [
    Plot.rectY(dailyDealsByVerified, {
      x: { value: "date", interval: d3.utcDay },
      y: "count",
      fill: d => `${d.verifiedDeal}`
    }),
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

function _23(Plot,dailyDealsByVerified,d3){return(
Plot.plot({
  y: {
    grid: true,
    label: `↑ TiB`
  },
  marks: [
    Plot.rectY(dailyDealsByVerified, {
      x: { value: "date", interval: d3.utcDay },
      y: "sumPieceSizeTiB",
      fill: d => `${d.verifiedDeal}`
    }),
    Plot.ruleY([0])
  ]
})
)}

function _24(md){return(
md`## Data`
)}

async function _dailyDealsRaw(dealsBucketUrl){return(
(await fetch(`${dealsBucketUrl}/daily-totals.json`)).json()
)}

function _dailyDeals(dailyDealsRaw,d3){return(
dailyDealsRaw.slice(-9).map(record => ({
  date: d3.isoParse(record.window.start),
  sumPieceSizeKiB: record['sum(pieceSizeDouble)'] / 1024,
  sumPieceSizeMiB: record['sum(pieceSizeDouble)'] / 1024 ** 2,
  sumPieceSizeGiB: record['sum(pieceSizeDouble)'] / 1024 ** 3,
  sumPieceSizeTiB: record['sum(pieceSizeDouble)'] / 1024 ** 4,
  ...record
}))
)}

function _28(Inputs,dailyDeals){return(
Inputs.table(dailyDeals.map(({window, ...rest}) => rest))
)}

async function _dailyDealsByVerifiedRaw(dealsBucketUrl){return(
(await fetch(`${dealsBucketUrl}/daily-totals-verified.json`)).json()
)}

function _dailyDealsByVerified(dailyDealsByVerifiedRaw,d3){return(
dailyDealsByVerifiedRaw.map(record => ({
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
}).slice(-18)
)}

function _31(Inputs,dailyDealsByVerified){return(
Inputs.table(dailyDealsByVerified.map(({window, ...rest}) => rest))
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
  main.variable(observer()).define(["Plot","dailyDeals","d3"], _5);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["Plot","dailyDeals","d3"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer()).define(["Plot","dailyDeals","d3"], _9);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer()).define(["Plot","dailyDeals","d3"], _11);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer()).define(["Plot","dailyDeals","d3"], _13);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer()).define(["Plot","dailyDeals","d3"], _15);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer()).define(["Plot","dailyDeals","d3"], _17);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer()).define(["Plot"], _19);
  main.variable(observer()).define(["Plot","dailyDealsByVerified","d3"], _20);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer()).define(["Plot"], _22);
  main.variable(observer()).define(["Plot","dailyDealsByVerified","d3"], _23);
  main.variable(observer()).define(["md"], _24);
  const child1 = runtime.module(define1);
  main.import("dealsBucketUrl", child1);
  main.variable(observer("dailyDealsRaw")).define("dailyDealsRaw", ["dealsBucketUrl"], _dailyDealsRaw);
  main.variable(observer("dailyDeals")).define("dailyDeals", ["dailyDealsRaw","d3"], _dailyDeals);
  main.variable(observer()).define(["Inputs","dailyDeals"], _28);
  main.variable(observer("dailyDealsByVerifiedRaw")).define("dailyDealsByVerifiedRaw", ["dealsBucketUrl"], _dailyDealsByVerifiedRaw);
  main.variable(observer("dailyDealsByVerified")).define("dailyDealsByVerified", ["dailyDealsByVerifiedRaw","d3"], _dailyDealsByVerified);
  main.variable(observer()).define(["Inputs","dailyDealsByVerified"], _31);
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
