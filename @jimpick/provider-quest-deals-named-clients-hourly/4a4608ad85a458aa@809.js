import define1 from "./5cf93b57a7444002@282.js";
import define2 from "./f92778131fd76559@1174.js";
import define3 from "./c4e4a355c53d2a1a@111.js";

function _1(md){return(
md`# Published Deals: Named Clients: Hourly [Provider.Quest]`
)}

function _2(md,quickMenu){return(
md`${quickMenu}`
)}

function _3(md){return(
md`Notes:

* Numbers are based on published deal proposals encoded in messages on the Filecoin blockchain.
* The [scanning script](https://observablehq.com/@jimpick/provider-quest-publish-deal-messages-stream?collection=@jimpick/provider-quest) is usually run multiple times per hour, but there may be gaps in the data from time to time. This system is optimized for timeliness instead of accuracy.
* Dates are based on when a message was published on the blockchain, not when the deal proposal was sent to a provider, or when the deal proving interval starts or when the sector is created.
* Not all published deals are successfully committed to sectors by providers, and occasionally providers lose data and get slashed, so these numbers will be greater than the actual amount of data stored to Filecoin. Check the [Starboard Deals](https://dashboard.starboard.ventures/market-deals) dashboard for information on "committed" deals.
* Distinct counts are calculated continuously with Spark Structured Streaming using an approximation algorithm.
* A similar report is available for [Weekly Deals](https://observablehq.com/@jimpick/provider-quest-published-deals-weekly?collection=@jimpick/provider-quest), [Daily Deals](https://observablehq.com/@jimpick/provider-quest-published-deals-daily?collection=@jimpick/provider-quest) and [Hourly Deals](https://observablehq.com/@jimpick/provider-quest-published-deals-hourly?collection=@jimpick/provider-quest).
`
)}

function _4(md){return(
md`## Named Clients`
)}

function _selectedNamedClient(Inputs,namedClients,defaultNamedClient){return(
Inputs.select(namedClients, { label: 'Select a named client', value: defaultNamedClient })
)}

function _6(md,permalink){return(
md`${permalink}`
)}

function _7(md){return(
md`## Published Deals Per Hour`
)}

function _composite(view,Inputs,dates,defaultDate,defaultShowAllDeals){return(
view`<div style="display: flex">
  <div>${["date", Inputs.select(dates, { label: 'Select a date', value: defaultDate })]}</div>
  <div style="margin-left: 1rem">${["showAllDeals", Inputs.checkbox(["Show all deals"], { value: [ defaultShowAllDeals && "Show all deals"] })]}</div>
</div>
`
)}

function _9(md,permalink){return(
md`${permalink}`
)}

function _10(showAllDeals,Plot,hourlyDeals,namedClientHourlyDeals)
{
  const marks = [
    showAllDeals && Plot.barY(hourlyDeals, {x: "hour", y: "count", fill: "#bab0ab"}),
    Plot.barY(namedClientHourlyDeals, {x: "hour", y: "count"}),
    Plot.ruleY([0])
  ].filter(x => x)
  return Plot.plot({
    x: {
      domain: [...new Array(24).keys()]
    },
    y: {
      grid: true
    },
    marks
  })
}


function _11(md){return(
md`## Total Data Size of Published Deals Per Hour (GiB)`
)}

function _12(view,Inputs,dates,$0){return(
view`<div style="display: flex">
  <div>${["date", Inputs.bind(Inputs.select(dates, { label: 'Select a date' }), $0.date)]}</div>
  <div style="margin-left: 1rem">${["showAllDeals", Inputs.bind(Inputs.checkbox(["Show all deals"]), $0.showAllDeals)]}
</div>
`
)}

function _13(md,permalink){return(
md`${permalink}`
)}

function _14(showAllDeals,Plot,hourlyDeals,namedClientHourlyDeals)
{
  const marks = [
    showAllDeals && Plot.barY(hourlyDeals, {x: "hour", y: "sumPieceSizeGiB", fill: "#bab0ab"}),
    Plot.barY(namedClientHourlyDeals, {x: "hour", y: "sumPieceSizeGiB"}),
    Plot.ruleY([0])
  ].filter(x => x)
  return Plot.plot({
    x: {
      domain: [...new Array(24).keys()]
    },
    y: {
      grid: true
    },
    marks
  })
}


function _15(md){return(
md`## Lifetime Value of Published Deals Per Hour (FIL)`
)}

function _16(view,Inputs,dates,$0){return(
view`<div style="display: flex">
  <div>${["date", Inputs.bind(Inputs.select(dates, { label: 'Select a date' }), $0.date)]}</div>
  <div style="margin-left: 1rem">${["showAllDeals", Inputs.bind(Inputs.checkbox(["Show all deals"]), $0.showAllDeals)]}
</div>
`
)}

function _17(md,permalink){return(
md`${permalink}`
)}

function _18(showAllDeals,Plot,hourlyDeals,namedClientHourlyDeals)
{
  const marks = [
    showAllDeals && Plot.barY(hourlyDeals, {x: "hour", y: "sum(lifetimeValue)", fill: "#bab0ab"}),
    Plot.barY(namedClientHourlyDeals, {x: "hour", y: "sum(lifetimeValue)"}),
    Plot.ruleY([0])
  ].filter(x => x)
  return Plot.plot({
    x: {
      domain: [...new Array(24).keys()]
    },
    y: {
      grid: true
    },
    marks
  })
}


function _19(md){return(
md`## Number of Providers that Accepted Deals`
)}

function _20(view,Inputs,dates,$0){return(
view`<div style="display: flex">
  <div>${["date", Inputs.bind(Inputs.select(dates, { label: 'Select a date' }), $0.date)]}</div>
  <div style="margin-left: 1rem">${["showAllDeals", Inputs.bind(Inputs.checkbox(["Show all deals"]), $0.showAllDeals)]}
</div>
`
)}

function _21(md,permalink){return(
md`${permalink}`
)}

function _22(showAllDeals,Plot,hourlyDeals,namedClientHourlyDeals)
{
  const marks = [
    showAllDeals && Plot.barY(hourlyDeals, {x: "hour", y: "approx_count_distinct(provider)", fill: "#bab0ab"}),
    Plot.barY(namedClientHourlyDeals, {x: "hour", y: "approx_count_distinct(provider)"}),
    Plot.ruleY([0])
  ].filter(x => x)
  return Plot.plot({
    x: {
      domain: [...new Array(24).keys()]
    },
    y: {
      grid: true
    },
    marks
  })
}


function _23(md){return(
md`## Number of Clients that Placed Deals`
)}

function _24(view,Inputs,dates,$0){return(
view`<div style="display: flex">
  <div>${["date", Inputs.bind(Inputs.select(dates, { label: 'Select a date' }), $0.date)]}</div>
  <div style="margin-left: 1rem">${["showAllDeals", Inputs.bind(Inputs.checkbox(["Show all deals"]), $0.showAllDeals)]}
</div>
`
)}

function _25(md,permalink){return(
md`${permalink}`
)}

function _26(showAllDeals,Plot,hourlyDeals,namedClientHourlyDeals)
{
  const marks = [
    showAllDeals && Plot.barY(hourlyDeals, {x: "hour", y: "approx_count_distinct(client)", fill: "#bab0ab"}),
    Plot.barY(namedClientHourlyDeals, {x: "hour", y: "approx_count_distinct(client)"}),
    Plot.ruleY([0])
  ].filter(x => x)
  return Plot.plot({
    x: {
      domain: [...new Array(24).keys()]
    },
    y: {
      grid: true
    },
    marks
  })
}


function _27(md){return(
md`## Number of Client <-> Provider Pairs`
)}

function _28(view,Inputs,dates,$0){return(
view`<div style="display: flex">
  <div>${["date", Inputs.bind(Inputs.select(dates, { label: 'Select a date' }), $0.date)]}</div>
  <div style="margin-left: 1rem">${["showAllDeals", Inputs.bind(Inputs.checkbox(["Show all deals"]), $0.showAllDeals)]}
</div>
`
)}

function _29(md,permalink){return(
md`${permalink}`
)}

function _30(showAllDeals,Plot,hourlyDeals,namedClientHourlyDeals)
{
  const marks = [
    showAllDeals && Plot.barY(hourlyDeals, {x: "hour", y: "approx_count_distinct(clientProvider)", fill: "#bab0ab"}),
    Plot.barY(namedClientHourlyDeals, {x: "hour", y: "approx_count_distinct(clientProvider)"}),
    Plot.ruleY([0])
  ].filter(x => x)
  return Plot.plot({
    x: {
      domain: [...new Array(24).keys()]
    },
    y: {
      grid: true
    },
    marks
  })
}


function _31(md){return(
md`## Distinct CIDs (Content Identifiers)`
)}

function _32(view,Inputs,dates,$0){return(
view`<div style="display: flex">
  <div>${["date", Inputs.bind(Inputs.select(dates, { label: 'Select a date' }), $0.date)]}</div>
  <div style="margin-left: 1rem">${["showAllDeals", Inputs.bind(Inputs.checkbox(["Show all deals"]), $0.showAllDeals)]}
</div>
`
)}

function _33(md,permalink){return(
md`${permalink}`
)}

function _34(showAllDeals,Plot,hourlyDeals,namedClientHourlyDeals)
{
  const marks = [
    showAllDeals && Plot.barY(hourlyDeals, {x: "hour", y: "approx_count_distinct(label)", fill: "#bab0ab"}),
    Plot.barY(namedClientHourlyDeals, {x: "hour", y: "approx_count_distinct(label)"}),
    Plot.ruleY([0])
  ].filter(x => x)
  return Plot.plot({
    x: {
      domain: [...new Array(24).keys()]
    },
    y: {
      grid: true
    },
    marks
  })
}


function _35(md){return(
md`## Data`
)}

async function _dates(dealsBucketUrl,selectedNamedClient){return(
(await fetch(`${dealsBucketUrl}/named-clients/${selectedNamedClient}/hourly/dates.json`)).json()
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

function _40(Inputs,hourlyDeals){return(
Inputs.table(hourlyDeals.map(({window, ...rest}) => rest))
)}

async function _namedClientHourlyDealsRaw(dealsBucketUrl,selectedNamedClient,date){return(
(await fetch(`${dealsBucketUrl}/named-clients/${selectedNamedClient}/hourly/${date}.json`)).json()
)}

function _namedClientHourlyDeals(namedClientHourlyDealsRaw,d3){return(
namedClientHourlyDealsRaw.map(record => ({
  date: d3.isoParse(record.window.start),
  hour: d3.isoParse(record.window.start).getUTCHours(),
  sumPieceSizeKiB: record['sum(pieceSizeDouble)'] / 1024,
  sumPieceSizeMiB: record['sum(pieceSizeDouble)'] / 1024 ** 2,
  sumPieceSizeGiB: record['sum(pieceSizeDouble)'] / 1024 ** 3,
  sumPieceSizeTiB: record['sum(pieceSizeDouble)'] / 1024 ** 4,
  ...record
}))
)}

function _43(Inputs,namedClientHourlyDeals){return(
Inputs.table(namedClientHourlyDeals.map(({window, ...rest}) => rest))
)}

async function _namedClients(dealsBucketUrl){return(
(await fetch(`${dealsBucketUrl}/named-clients/named-clients.json`)).json()
)}

function _45(md){return(
md`## Imports`
)}

function _d3(require){return(
require("d3@6")
)}

function _49(md){return(
md`## Permalink support`
)}

function _50(composite){return(
composite
)}

function _date(composite){return(
composite.date
)}

function _showAllDeals(composite){return(
composite.showAllDeals.includes("Show all deals")
)}

function _params(URLSearchParams,location){return(
[...(new URLSearchParams(location.search.substring(1))).entries()].reduce((acc, [key, value]) => ({ [key]: value, ...acc }), {})
)}

function _defaultNamedClient(params,namedClients){return(
params.name || namedClients[0]
)}

function _defaultDate(params,dates){return(
(params.date && dates.includes(params.date)) ? params.date : dates[dates.length - 1]
)}

function _defaultShowAllDeals(params){return(
params.showAllDeals !== undefined ? (params.showAllDeals == "true") : true
)}

function _permalink(selectedNamedClient,date,showAllDeals){return(
`[Permalink](${document.baseURI.replace(/\?.*/,'')}?name=${selectedNamedClient}&date=${date}&showAllDeals=${showAllDeals})`
)}

function _58(md){return(
md`## Backups`
)}

function _60(backups){return(
backups()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md","quickMenu"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("viewof selectedNamedClient")).define("viewof selectedNamedClient", ["Inputs","namedClients","defaultNamedClient"], _selectedNamedClient);
  main.variable(observer("selectedNamedClient")).define("selectedNamedClient", ["Generators", "viewof selectedNamedClient"], (G, _) => G.input(_));
  main.variable(observer()).define(["md","permalink"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer("viewof composite")).define("viewof composite", ["view","Inputs","dates","defaultDate","defaultShowAllDeals"], _composite);
  main.variable(observer("composite")).define("composite", ["Generators", "viewof composite"], (G, _) => G.input(_));
  main.variable(observer()).define(["md","permalink"], _9);
  main.variable(observer()).define(["showAllDeals","Plot","hourlyDeals","namedClientHourlyDeals"], _10);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer()).define(["view","Inputs","dates","viewof composite"], _12);
  main.variable(observer()).define(["md","permalink"], _13);
  main.variable(observer()).define(["showAllDeals","Plot","hourlyDeals","namedClientHourlyDeals"], _14);
  main.variable(observer()).define(["md"], _15);
  main.variable(observer()).define(["view","Inputs","dates","viewof composite"], _16);
  main.variable(observer()).define(["md","permalink"], _17);
  main.variable(observer()).define(["showAllDeals","Plot","hourlyDeals","namedClientHourlyDeals"], _18);
  main.variable(observer()).define(["md"], _19);
  main.variable(observer()).define(["view","Inputs","dates","viewof composite"], _20);
  main.variable(observer()).define(["md","permalink"], _21);
  main.variable(observer()).define(["showAllDeals","Plot","hourlyDeals","namedClientHourlyDeals"], _22);
  main.variable(observer()).define(["md"], _23);
  main.variable(observer()).define(["view","Inputs","dates","viewof composite"], _24);
  main.variable(observer()).define(["md","permalink"], _25);
  main.variable(observer()).define(["showAllDeals","Plot","hourlyDeals","namedClientHourlyDeals"], _26);
  main.variable(observer()).define(["md"], _27);
  main.variable(observer()).define(["view","Inputs","dates","viewof composite"], _28);
  main.variable(observer()).define(["md","permalink"], _29);
  main.variable(observer()).define(["showAllDeals","Plot","hourlyDeals","namedClientHourlyDeals"], _30);
  main.variable(observer()).define(["md"], _31);
  main.variable(observer()).define(["view","Inputs","dates","viewof composite"], _32);
  main.variable(observer()).define(["md","permalink"], _33);
  main.variable(observer()).define(["showAllDeals","Plot","hourlyDeals","namedClientHourlyDeals"], _34);
  main.variable(observer()).define(["md"], _35);
  const child1 = runtime.module(define1);
  main.import("dealsBucketUrl", child1);
  main.variable(observer("dates")).define("dates", ["dealsBucketUrl","selectedNamedClient"], _dates);
  main.variable(observer("hourlyDealsRaw")).define("hourlyDealsRaw", ["dealsBucketUrl","date"], _hourlyDealsRaw);
  main.variable(observer("hourlyDeals")).define("hourlyDeals", ["hourlyDealsRaw","d3"], _hourlyDeals);
  main.variable(observer()).define(["Inputs","hourlyDeals"], _40);
  main.variable(observer("namedClientHourlyDealsRaw")).define("namedClientHourlyDealsRaw", ["dealsBucketUrl","selectedNamedClient","date"], _namedClientHourlyDealsRaw);
  main.variable(observer("namedClientHourlyDeals")).define("namedClientHourlyDeals", ["namedClientHourlyDealsRaw","d3"], _namedClientHourlyDeals);
  main.variable(observer()).define(["Inputs","namedClientHourlyDeals"], _43);
  main.variable(observer("namedClients")).define("namedClients", ["dealsBucketUrl"], _namedClients);
  main.variable(observer()).define(["md"], _45);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  const child2 = runtime.module(define2);
  main.import("view", child2);
  const child3 = runtime.module(define3);
  main.import("quickMenu", child3);
  main.variable(observer()).define(["md"], _49);
  main.variable(observer()).define(["composite"], _50);
  main.variable(observer("date")).define("date", ["composite"], _date);
  main.variable(observer("showAllDeals")).define("showAllDeals", ["composite"], _showAllDeals);
  main.variable(observer("params")).define("params", ["URLSearchParams","location"], _params);
  main.variable(observer("defaultNamedClient")).define("defaultNamedClient", ["params","namedClients"], _defaultNamedClient);
  main.variable(observer("defaultDate")).define("defaultDate", ["params","dates"], _defaultDate);
  main.variable(observer("defaultShowAllDeals")).define("defaultShowAllDeals", ["params"], _defaultShowAllDeals);
  main.variable(observer("permalink")).define("permalink", ["selectedNamedClient","date","showAllDeals"], _permalink);
  main.variable(observer()).define(["md"], _58);
  const child4 = runtime.module(define3);
  main.import("backups", child4);
  main.import("backupNowButton", child4);
  main.variable(observer()).define(["backups"], _60);
  return main;
}
