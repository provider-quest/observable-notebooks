// https://observablehq.com/@jimpick/provider-quest-published-deals-hourly@570
import define1 from "./5cf93b57a7444002@230.js";
import define2 from "./57d79353bac56631@44.js";
import define3 from "./c4e4a355c53d2a1a@111.js";

function _1(md){return(
md`# Published Deals: Hourly [Provider.Quest]`
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
* A similar report is available for [Weekly Deals](https://observablehq.com/@jimpick/provider-quest-published-deals-weekly?collection=@jimpick/provider-quest), [Daily Deals](https://observablehq.com/@jimpick/provider-quest-published-deals-daily?collection=@jimpick/provider-quest) and [Hourly Deals: Named Clients](https://observablehq.com/@jimpick/provider-quest-deals-named-clients-hourly?collection=@jimpick/provider-quest).
`
)}

function _4(md){return(
md`## Published Deals Per Hour`
)}

function _date(Inputs,dates,defaultDate){return(
Inputs.select(dates, { label: 'Select a date', value: defaultDate })
)}

function _6(md,permalink){return(
md`${permalink}`
)}

function _7(Plot,hourlyDeals){return(
Plot.plot({
  x: {
      domain: [...new Array(24).keys()]
  },
  y: {
    grid: true
  },
  marks: [
    Plot.barY(hourlyDeals, {x: "hour", y: "count", fill: "#bab0ab"}),
    Plot.ruleY([0])
  ]
})
)}

function _8(md){return(
md`## Total Data Size of Published Deals Per Hour (TiB)`
)}

function _9(Inputs,dates,$0){return(
Inputs.bind(Inputs.select(dates, { label: 'Select a date' }), $0)
)}

function _10(md,permalink){return(
md`${permalink}`
)}

function _11(Plot,hourlyDeals){return(
Plot.plot({
  x: {
      domain: [...new Array(24).keys()]
  },
  y: {
    grid: true
  },
  marks: [
    Plot.barY(hourlyDeals, {x: "hour", y: "sumPieceSizeTiB", fill: "#bab0ab"}),
    Plot.ruleY([0])
  ]
})
)}

function _12(md){return(
md`## Lifetime Value of Published Deals Per Hour (FIL)`
)}

function _13(Inputs,dates,$0){return(
Inputs.bind(Inputs.select(dates, { label: 'Select a date' }), $0)
)}

function _14(md,permalink){return(
md`${permalink}`
)}

function _15(Plot,hourlyDeals){return(
Plot.plot({
  x: {
      domain: [...new Array(24).keys()]
  },
  y: {
    grid: true
  },
  marks: [
    Plot.barY(hourlyDeals, {x: "hour", y: "sum(lifetimeValue)", fill: "#bab0ab"}),
    Plot.ruleY([0])
  ]
})
)}

function _16(md){return(
md`## Number of Providers that Accepted Deals`
)}

function _17(Inputs,dates,$0){return(
Inputs.bind(Inputs.select(dates, { label: 'Select a date' }), $0)
)}

function _18(md,permalink){return(
md`${permalink}`
)}

function _19(Plot,hourlyDeals){return(
Plot.plot({
  x: {
      domain: [...new Array(24).keys()]
  },
  y: {
    grid: true
  },
  marks: [
    Plot.barY(hourlyDeals, {x: "hour", y: "approx_count_distinct(provider)", fill: "#bab0ab"}),
    Plot.ruleY([0])
  ]
})
)}

function _20(md){return(
md`## Number of Clients that Placed Deals`
)}

function _21(Inputs,dates,$0){return(
Inputs.bind(Inputs.select(dates, { label: 'Select a date' }), $0)
)}

function _22(md,permalink){return(
md`${permalink}`
)}

function _23(Plot,hourlyDeals){return(
Plot.plot({
    x: {
      domain: [...new Array(24).keys()]
  },
  y: {
    grid: true
  },
  marks: [
    Plot.barY(hourlyDeals, {x: "hour", y: "approx_count_distinct(client)", fill: "#bab0ab"}),
    Plot.ruleY([0])
  ]
})
)}

function _24(md){return(
md`## Number of Client <-> Provider Pairs`
)}

function _25(Inputs,dates,$0){return(
Inputs.bind(Inputs.select(dates, { label: 'Select a date' }), $0)
)}

function _26(md,permalink){return(
md`${permalink}`
)}

function _27(Plot,hourlyDeals){return(
Plot.plot({
    x: {
      domain: [...new Array(24).keys()]
  },
  y: {
    grid: true
  },
  marks: [
    Plot.barY(hourlyDeals, {x: "hour", y: "approx_count_distinct(clientProvider)", fill: "#bab0ab"}),
    Plot.ruleY([0])
  ]
})
)}

function _28(md){return(
md`## Distinct CIDs (Content Identifiers)`
)}

function _29(Inputs,dates,$0){return(
Inputs.bind(Inputs.select(dates, { label: 'Select a date' }), $0)
)}

function _30(md,permalink){return(
md`${permalink}`
)}

function _31(Plot,hourlyDeals){return(
Plot.plot({
    x: {
      domain: [...new Array(24).keys()]
  },
  y: {
    grid: true
  },
  marks: [
    Plot.barY(hourlyDeals, {x: "hour", y: "approx_count_distinct(label)", fill: "#bab0ab"}),
    Plot.ruleY([0])
  ]
})
)}

function _32(md){return(
md `## Unverified/Verified: Deals Per Hour`
)}

function _33(Inputs,dates,$0){return(
Inputs.bind(Inputs.select(dates, { label: 'Select a date' }), $0)
)}

function _34(md,permalink){return(
md`${permalink}`
)}

function _35(Plot){return(
Plot.plot({
  marks: [
    Plot.cell(['Unverified', 'Verified'], {x: d => d, fill: d => d})
  ]
})
)}

function _36(Plot,hourlyDealsByVerified){return(
Plot.plot({
  x: {
      domain: [...new Array(24).keys()]
  },
  y: {
    grid: true
  },
  marks: [
    Plot.barY(hourlyDealsByVerified, {x: "hour", y: "count", fill: d => `${d.verifiedDeal}`}),
    Plot.ruleY([0])
  ]
})
)}

function _37(md){return(
md`## Unverified/Verified: Total Data Size (TiB)`
)}

function _38(Inputs,dates,$0){return(
Inputs.bind(Inputs.select(dates, { label: 'Select a date' }), $0)
)}

function _39(md,permalink){return(
md`${permalink}`
)}

function _40(Plot){return(
Plot.plot({
  marks: [
    Plot.cell(['Unverified', 'Verified'], {x: d => d, fill: d => d})
  ]
})
)}

function _41(Plot,hourlyDealsByVerified){return(
Plot.plot({
  x: {
      domain: [...new Array(24).keys()]
  },
  y: {
    grid: true,
    label: `↑ TiB`
  },
  marks: [
    Plot.barY(hourlyDealsByVerified, {x: "hour", y: "sumPieceSizeTiB", fill: d => `${d.verifiedDeal}`}),
    Plot.ruleY([0])
  ]
})
)}

function _42(md){return(
md`## Data`
)}

async function _dates(dealsBucketUrl){return(
(await fetch(`${dealsBucketUrl}/hourly-totals/dates.json`)).json()
)}

async function _hourlyDealsRaw(dealsBucketUrl,date){return(
(await fetch(`${dealsBucketUrl}/hourly-totals/${date}.json`)).json()
)}

function _hourlyDeals(hourlyDealsRaw,d3){return(
hourlyDealsRaw.map(record => ({
  date: d3.isoParse(record.window.start),
  hour: d3.isoParse(record.window.start).getUTCHours(),
  sumPieceSizeKiB: record['sum(pieceSizeDouble)'] / 1024,
  sumPieceSizeMiB: record['sum(pieceSizeDouble)'] / 1024 ** 2,
  sumPieceSizeGiB: record['sum(pieceSizeDouble)'] / 1024 ** 3,
  sumPieceSizeTiB: record['sum(pieceSizeDouble)'] / 1024 ** 4,
  ...record
}))
)}

function _47(Inputs,hourlyDeals){return(
Inputs.table(hourlyDeals.map(({window, ...rest}) => rest))
)}

async function _hourlyDealsByVerifiedRaw(dealsBucketUrl,date){return(
(await fetch(`${dealsBucketUrl}/hourly-totals-verified/${date}.json`)).json()
)}

function _hourlyDealsByVerified(hourlyDealsByVerifiedRaw,d3){return(
hourlyDealsByVerifiedRaw.map(record => ({
  date: d3.isoParse(record.window.start),
  hour: d3.isoParse(record.window.start).getUTCHours(),
  sumPieceSizeKiB: record['sum(pieceSizeDouble)'] / 1024,
  sumPieceSizeMiB: record['sum(pieceSizeDouble)'] / 1024 ** 2,
  sumPieceSizeGiB: record['sum(pieceSizeDouble)'] / 1024 ** 3,
  sumPieceSizeTiB: record['sum(pieceSizeDouble)'] / 1024 ** 4,
  ...record
})).sort((a, b) => {
  const comp1 = a.hour - b.hour
  if (comp1 !== 0) return comp1
  return Number(a.verifiedDeal) - Number(b.verifiedDeal)
})
)}

function _50(Inputs,hourlyDealsByVerified){return(
Inputs.table(hourlyDealsByVerified.map(({window, ...rest}) => rest))
)}

function _51(md){return(
md`## Imports`
)}

function _d3(require){return(
require("d3@6")
)}

function _54(md){return(
md`## Permalink support`
)}

function _hashDate(hash){return(
hash && hash.replace('#','')
)}

function _defaultDate(hashDate,dates){return(
hashDate || dates[dates.length - 1]
)}

function _permalink(date){return(
`[Permalink](${document.baseURI.replace(/#.*/,'')}#${date})`
)}

function _59(md){return(
md`## Backups`
)}

function _61(backups){return(
backups()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md","quickMenu"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("viewof date")).define("viewof date", ["Inputs","dates","defaultDate"], _date);
  main.variable(observer("date")).define("date", ["Generators", "viewof date"], (G, _) => G.input(_));
  main.variable(observer()).define(["md","permalink"], _6);
  main.variable(observer()).define(["Plot","hourlyDeals"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer()).define(["Inputs","dates","viewof date"], _9);
  main.variable(observer()).define(["md","permalink"], _10);
  main.variable(observer()).define(["Plot","hourlyDeals"], _11);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer()).define(["Inputs","dates","viewof date"], _13);
  main.variable(observer()).define(["md","permalink"], _14);
  main.variable(observer()).define(["Plot","hourlyDeals"], _15);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer()).define(["Inputs","dates","viewof date"], _17);
  main.variable(observer()).define(["md","permalink"], _18);
  main.variable(observer()).define(["Plot","hourlyDeals"], _19);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer()).define(["Inputs","dates","viewof date"], _21);
  main.variable(observer()).define(["md","permalink"], _22);
  main.variable(observer()).define(["Plot","hourlyDeals"], _23);
  main.variable(observer()).define(["md"], _24);
  main.variable(observer()).define(["Inputs","dates","viewof date"], _25);
  main.variable(observer()).define(["md","permalink"], _26);
  main.variable(observer()).define(["Plot","hourlyDeals"], _27);
  main.variable(observer()).define(["md"], _28);
  main.variable(observer()).define(["Inputs","dates","viewof date"], _29);
  main.variable(observer()).define(["md","permalink"], _30);
  main.variable(observer()).define(["Plot","hourlyDeals"], _31);
  main.variable(observer()).define(["md"], _32);
  main.variable(observer()).define(["Inputs","dates","viewof date"], _33);
  main.variable(observer()).define(["md","permalink"], _34);
  main.variable(observer()).define(["Plot"], _35);
  main.variable(observer()).define(["Plot","hourlyDealsByVerified"], _36);
  main.variable(observer()).define(["md"], _37);
  main.variable(observer()).define(["Inputs","dates","viewof date"], _38);
  main.variable(observer()).define(["md","permalink"], _39);
  main.variable(observer()).define(["Plot"], _40);
  main.variable(observer()).define(["Plot","hourlyDealsByVerified"], _41);
  main.variable(observer()).define(["md"], _42);
  const child1 = runtime.module(define1);
  main.import("dealsBucketUrl", child1);
  main.variable(observer("dates")).define("dates", ["dealsBucketUrl"], _dates);
  main.variable(observer("hourlyDealsRaw")).define("hourlyDealsRaw", ["dealsBucketUrl","date"], _hourlyDealsRaw);
  main.variable(observer("hourlyDeals")).define("hourlyDeals", ["hourlyDealsRaw","d3"], _hourlyDeals);
  main.variable(observer()).define(["Inputs","hourlyDeals"], _47);
  main.variable(observer("hourlyDealsByVerifiedRaw")).define("hourlyDealsByVerifiedRaw", ["dealsBucketUrl","date"], _hourlyDealsByVerifiedRaw);
  main.variable(observer("hourlyDealsByVerified")).define("hourlyDealsByVerified", ["hourlyDealsByVerifiedRaw","d3"], _hourlyDealsByVerified);
  main.variable(observer()).define(["Inputs","hourlyDealsByVerified"], _50);
  main.variable(observer()).define(["md"], _51);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  const child2 = runtime.module(define2);
  main.import("hash", child2);
  main.variable(observer()).define(["md"], _54);
  main.variable(observer("hashDate")).define("hashDate", ["hash"], _hashDate);
  main.variable(observer("defaultDate")).define("defaultDate", ["hashDate","dates"], _defaultDate);
  main.variable(observer("permalink")).define("permalink", ["date"], _permalink);
  const child3 = runtime.module(define3);
  main.import("quickMenu", child3);
  main.variable(observer()).define(["md"], _59);
  const child4 = runtime.module(define3);
  main.import("backups", child4);
  main.import("backupNowButton", child4);
  main.variable(observer()).define(["backups"], _61);
  return main;
}
