// https://observablehq.com/@jimpick/country-state-province-stats-provider-quest@414
import define1 from "./5cf93b57a7444002@185.js";
import define2 from "./c4e4a355c53d2a1a@111.js";

function _1(md){return(
md`# Country/State/Province Stats [Provider.Quest]`
)}

function _2(md,quickMenu){return(
md`${quickMenu}`
)}

function _3(md){return(
md`Notes:

* This is a variant of the [@jimpick/provider-quest-regional-stats](https://observablehq.com/@jimpick/provider-quest-regional-stats) notebook, but where each region is a country, with the exception of the USA and China, which are broken down into states and provinces.
* Only includes storage providers that advertise IP addresses that have been geo-located to the selected region.
* Most power on the network is associated with storage providers that do not advertise IP addresses (or our geo-IP lookup failed), so they are allocated to "No Region". These providers can publish offline deals, but aren't reachable for online deals or online retrievals.
* Storage providers may be included in multiple regions if they have multiple IP addresses (power is split between regions).
* IP addresses are not tested to confirm that they are live.
* The regions are defined using JavaScript in the [@jimpick/internal-mapping-storage-provider-to-countrystateprovin](https://observablehq.com/@jimpick/internal-mapping-storage-provider-to-countrystateprovin?collection=@jimpick/provider-quest) notebook.
`
)}

function _selectedRegion(Inputs,regionsWithData,regions,defaultRegion){return(
Inputs.select(regionsWithData, { label: "Select a region", format: r => r.pretty, value: regions.find(({ region }) => region === defaultRegion ) })
)}

function _useSyntheticRegions(Inputs,defaultUseSyntheticRegions){return(
Inputs.toggle({ label: 'Use Synthetic Regions', value: defaultUseSyntheticRegions })
)}

function _6(md,permalink){return(
md`${permalink}`
)}

function _7(md,selectedRegion){return(
md`## Region: ${selectedRegion.pretty} - Quality Adjusted Power`
)}

function _8(md,selectedRegion,regionsCountriesEnglish){return(
md`${selectedRegion.note ? selectedRegion.note : ''} ${ selectedRegion.region.match(/^.*-XX/) && selectedRegion.region !== 'none' ? "Includes " + regionsCountriesEnglish[selectedRegion.region] + '.' : ''}`
)}

function _9(Plot,filteredRows,selectedRegion){return(
Plot.plot({
  y: {
    grid: true
  },
  marks: [
    Plot.areaY(filteredRows, {x: "date", y: "qualityAdjPower" + selectedRegion.scale, fill: "#bab0ab"}),
    Plot.ruleY([0])
  ]
})
)}

function _10(md,selectedRegion){return(
md`## Region: ${selectedRegion.pretty} - Number of Miners`
)}

function _11(Plot,filteredRows){return(
Plot.plot({
  y: {
    grid: true
  },
  marks: [
    Plot.areaY(filteredRows, {x: "date", y: "minerCount", fill: "#bab0ab"}),
    Plot.ruleY([0])
  ]
})
)}

function _12(md,selectedRegion){return(
md`## Region: ${selectedRegion.pretty} - Published Deals Per Day`
)}

function _13(dailyDealsByRegion,selectedRegion,md,agnosticAddDays,dateFns,Plot)
{
  const data = dailyDealsByRegion.filter(({ region }) => region === selectedRegion.region)
  if (data.length === 0) {
    return md`No deals for region.`
  }
  const dataWithHoles = []
  for (let date = data[0].date; date <= data[data.length - 1].date; date = agnosticAddDays(date, 1)) {
    const record = data.find(({ date: dataDate }) => dateFns.isEqual(dataDate, date))
    dataWithHoles.push({
      date,
      count: record ? record.count : NaN
    })
  }
  console.log('dataWithHoles', dataWithHoles)
  return Plot.plot({
    y: {
      grid: true
    },
    marks: [
      Plot.areaY(dataWithHoles, {x: "date", y: "count", fill: "#bab0ab", curve: "step"}),
      Plot.ruleY([0])
    ]
  })
}


function _14(md,selectedRegion){return(
md`## Region: ${selectedRegion.pretty} - Total Data Size of Published Deals Per Day (TiB)`
)}

function _15(dailyDealsByRegion,selectedRegion,md,agnosticAddDays,dateFns,Plot)
{
  const data = dailyDealsByRegion.filter(({ region }) => region === selectedRegion.region)
  if (data.length === 0) {
    return md`No deals for region.`
  }
  const dataWithHoles = []
  for (let date = data[0].date; date <= data[data.length - 1].date; date = agnosticAddDays(date, 1)) {
    const record = data.find(({ date: dataDate }) => dateFns.isEqual(dataDate, date))
    dataWithHoles.push({
      date,
      sizeTiB: record ? record['sum(pieceSizeDouble)'] / 1024 ** 4 : NaN
    })
  }
  console.log('dataWithHoles', dataWithHoles)
  return Plot.plot({
    y: {
      grid: true
    },
    marks: [
      Plot.areaY(dataWithHoles, {x: "date", y: "sizeTiB", fill: "#bab0ab", curve: "step"}),
      Plot.ruleY([0])
    ]
  })
}


function _16(md,selectedRegion){return(
md`## Region: ${selectedRegion.pretty} - Lifetime Value of Published Deals Per Day (FIL)`
)}

function _17(dailyDealsByRegion,selectedRegion,md,agnosticAddDays,dateFns,Plot)
{
  const data = dailyDealsByRegion.filter(({ region }) => region === selectedRegion.region)
  if (data.length === 0) {
    return md`No deals for region.`
  }
  const dataWithHoles = []
  for (let date = data[0].date; date <= data[data.length - 1].date; date = agnosticAddDays(date, 1)) {
    const record = data.find(({ date: dataDate }) => dateFns.isEqual(dataDate, date))
    dataWithHoles.push({
      date,
      lifetimeValue: record ? record['sum(lifetimeValue)'] : NaN
    })
  }
  console.log('dataWithHoles', dataWithHoles)
  return Plot.plot({
    y: {
      grid: true
    },
    marks: [
      Plot.areaY(dataWithHoles, {x: "date", y: "lifetimeValue", fill: "#bab0ab", curve: "step"}),
      Plot.ruleY([0])
    ]
  })
}


function _18(md,selectedRegion){return(
md`## Region: ${selectedRegion.pretty} - Number of Providers that Accepted Deals`
)}

function _19(dailyDealsByRegion,selectedRegion,md,agnosticAddDays,dateFns,Plot)
{
  const data = dailyDealsByRegion.filter(({ region }) => region === selectedRegion.region)
  if (data.length === 0) {
    return md`No deals for region.`
  }
  const dataWithHoles = []
  for (let date = data[0].date; date <= data[data.length - 1].date; date = agnosticAddDays(date, 1)) {
    const record = data.find(({ date: dataDate }) => dateFns.isEqual(dataDate, date))
    dataWithHoles.push({
      date,
      providerCount: record ? record['count(provider)'] : NaN
    })
  }
  console.log('dataWithHoles', dataWithHoles)
  return Plot.plot({
    y: {
      grid: true
    },
    marks: [
      Plot.areaY(dataWithHoles, {x: "date", y: "providerCount", fill: "#bab0ab", curve: "step"}),
      Plot.ruleY([0])
    ]
  })
}


function _20(md,selectedRegion){return(
md`## Region: ${selectedRegion.pretty} - Number of Clients that Placed Deals with Providers in Region`
)}

function _21(dailyDealsByRegion,selectedRegion,md,agnosticAddDays,dateFns,Plot)
{
  const data = dailyDealsByRegion.filter(({ region }) => region === selectedRegion.region)
  if (data.length === 0) {
    return md`No deals for region.`
  }
  const dataWithHoles = []
  for (let date = data[0].date; date <= data[data.length - 1].date; date = agnosticAddDays(date, 1)) {
    const record = data.find(({ date: dataDate }) => dateFns.isEqual(dataDate, date))
    dataWithHoles.push({
      date,
      approxClientCount: record ? record['approx_count_distinct(client)'] : NaN
    })
  }
  console.log('dataWithHoles', dataWithHoles)
  return Plot.plot({
    y: {
      grid: true
    },
    marks: [
      Plot.areaY(dataWithHoles, {x: "date", y: "approxClientCount", fill: "#bab0ab", curve: "step"}),
      Plot.ruleY([0])
    ]
  })
}


function _22(md,selectedRegion){return(
md`## Region: ${selectedRegion.pretty} - Number of Client <-> Miner Pairs`
)}

function _23(dailyDealsByRegion,selectedRegion,md,agnosticAddDays,dateFns,Plot)
{
  const data = dailyDealsByRegion.filter(({ region }) => region === selectedRegion.region)
  if (data.length === 0) {
    return md`No deals for region.`
  }
  const dataWithHoles = []
  for (let date = data[0].date; date <= data[data.length - 1].date; date = agnosticAddDays(date, 1)) {
    const record = data.find(({ date: dataDate }) => dateFns.isEqual(dataDate, date))
    dataWithHoles.push({
      date,
      approxPairsCount: record ? record['approx_count_distinct(clientProvider)'] : NaN
    })
  }
  console.log('dataWithHoles', dataWithHoles)
  return Plot.plot({
    y: {
      grid: true
    },
    marks: [
      Plot.areaY(dataWithHoles, {x: "date", y: "approxPairsCount", fill: "#bab0ab", curve: "step"}),
      Plot.ruleY([0])
    ]
  })
}


function _24(md,selectedRegion){return(
md`## Region: ${selectedRegion.pretty} - Distinct CIDs (Content Identifiers)`
)}

function _25(dailyDealsByRegion,selectedRegion,md,agnosticAddDays,dateFns,Plot)
{
  const data = dailyDealsByRegion.filter(({ region }) => region === selectedRegion.region)
  if (data.length === 0) {
    return md`No deals for region.`
  }
  const dataWithHoles = []
  for (let date = data[0].date; date <= data[data.length - 1].date; date = agnosticAddDays(date, 1)) {
    const record = data.find(({ date: dataDate }) => dateFns.isEqual(dataDate, date))
    dataWithHoles.push({
      date,
      approxLabelCount: record ? record['approx_count_distinct(label)'] : NaN
    })
  }
  return Plot.plot({
    y: {
      grid: true
    },
    marks: [
      Plot.areaY(dataWithHoles, {x: "date", y: "approxLabelCount", fill: "#bab0ab", curve: "step"}),
      Plot.ruleY([0])
    ]
  })
}


function _26(md){return(
md`## Data`
)}

function _28(minerPowerDailyAverageLatestBucketUrl){return(
minerPowerDailyAverageLatestBucketUrl
)}

async function _minerPowerByRegionReport(useSyntheticRegions,minerPowerDailyAverageLatestBucketUrl)
{
  const file = useSyntheticRegions ? 'provider-power-by-synthetic-csp-region' : 'miner-power-by-country-state-province'
  return (await fetch(`${minerPowerDailyAverageLatestBucketUrl}/${file}.json`)).json()
}


function _30(Inputs,minerPowerByRegionReport){return(
Inputs.table(minerPowerByRegionReport.rows)
)}

function _minerPowerByRegionIndex(d3,minerPowerByRegionReport){return(
d3.index(minerPowerByRegionReport.rows, d => d.region, d => d.date)
)}

function _regions(minerPowerByRegionIndex,regionsCountriesEnglish){return(
[...minerPowerByRegionIndex.keys()].sort().map(key => ({
  region: key,
  pretty: `${key}: ${regionsCountriesEnglish[key]}`,
  scale: 'PiB'
}))
)}

function _regionsWithData(regions,minerPowerByRegionIndex){return(
regions.filter(({ region }) => minerPowerByRegionIndex.get(region))
)}

function _filteredRows(minerPowerByRegionReport,selectedRegion,d3){return(
minerPowerByRegionReport.rows
  .filter(({ region }) => region === selectedRegion.region)
  .map(row => ({
    date: d3.isoParse(row.date),
    minerCount: row['count(miner)'],
    rawBytePower: row['sum(rawBytePower)'],
    rawBytePowerKiB: row['sum(rawBytePower)'] / 1024,
    rawBytePowerMiB: row['sum(rawBytePower)'] / 1024 ** 2,
    rawBytePowerGiB: row['sum(rawBytePower)'] / 1024 ** 3,
    rawBytePowerTiB: row['sum(rawBytePower)'] / 1024 ** 4,
    rawBytePowerPiB: row['sum(rawBytePower)'] / 1024 ** 5,
    rawBytePowerEiB: row['sum(rawBytePower)'] / 1024 ** 6,
    qualityAdjPower: row['sum(qualityAdjPower)'],
    qualityAdjPowerKiB: row['sum(qualityAdjPower)'] / 1024,
    qualityAdjPowerMiB: row['sum(qualityAdjPower)'] / 1024 ** 2,
    qualityAdjPowerGiB: row['sum(qualityAdjPower)'] / 1024 ** 3,
    qualityAdjPowerTiB: row['sum(qualityAdjPower)'] / 1024 ** 4,
    qualityAdjPowerPiB: row['sum(qualityAdjPower)'] / 1024 ** 5,
    qualityAdjPowerEiB: row['sum(qualityAdjPower)'] / 1024 ** 6,
  }))
)}

async function _minerLocationsReport(geoIpLookupsBucketUrl){return(
(await fetch(`${geoIpLookupsBucketUrl}/provider-country-state-province-locations-latest.json`)).json()
)}

async function _isoCountries(){return(
(await fetch('https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/slim-2/slim-2.json')).json()
)}

function _regionsCountries(minerLocationsReport)
{
  const regionsCountries = {}
  for (const location of minerLocationsReport.minerLocations) {
    regionsCountries[location.region] ||= new Set()
    regionsCountries[location.region].add(location.country)
  }
  return regionsCountries
}


function _regionsCountriesEnglish(regionsCountries,isoCountries){return(
Object.fromEntries(
  Object.entries(regionsCountries).map(([key, set]) => [
    key,
    [...set].map(code => {
      const countryRecord = isoCountries.find(record => record['alpha-2'] === code)
      return countryRecord ? countryRecord.name : null
    }).sort().join(', ')
  ])
)
)}

async function _dailyDealsByRegion(useSyntheticRegions,dealsBucketUrl,d3)
{
  const file = useSyntheticRegions ? 'daily-deals-by-synthetic-csp-region' : 'daily-deals-by-country-state-province'
  const deals = await (await fetch(`${dealsBucketUrl}/${file}.json`)).json()
  return deals.map(({ date, ...rest }) => ({ date: d3.isoParse(date), ...rest }))
}


function _42(md){return(
md`## Permalink support`
)}

function _params(URLSearchParams,location){return(
[...(new URLSearchParams(location.search.substring(1))).entries()].reduce((acc, [key, value]) => ({ [key]: value, ...acc }), {})
)}

function _defaultRegion(params,regions){return(
params.region || regions[0].region
)}

function _defaultUseSyntheticRegions(params){return(
params.synthetic != undefined ? (params.synthetic == 'true') : true
)}

function _permalink(selectedRegion,useSyntheticRegions){return(
`[Permalink](${document.baseURI.replace(/\?.*/,'')}?region=${selectedRegion.region}&synthetic=${useSyntheticRegions})`
)}

function _47(md){return(
md`## Imports`
)}

function _d3(require){return(
require("d3@6")
)}

function _dateFns(require){return(
require('https://bundle.run/date-fns@2.22.1')
)}

function _52(md){return(
md`## Backups`
)}

function _54(backups){return(
backups()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md","quickMenu"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("viewof selectedRegion")).define("viewof selectedRegion", ["Inputs","regionsWithData","regions","defaultRegion"], _selectedRegion);
  main.variable(observer("selectedRegion")).define("selectedRegion", ["Generators", "viewof selectedRegion"], (G, _) => G.input(_));
  main.variable(observer("viewof useSyntheticRegions")).define("viewof useSyntheticRegions", ["Inputs","defaultUseSyntheticRegions"], _useSyntheticRegions);
  main.variable(observer("useSyntheticRegions")).define("useSyntheticRegions", ["Generators", "viewof useSyntheticRegions"], (G, _) => G.input(_));
  main.variable(observer()).define(["md","permalink"], _6);
  main.variable(observer()).define(["md","selectedRegion"], _7);
  main.variable(observer()).define(["md","selectedRegion","regionsCountriesEnglish"], _8);
  main.variable(observer()).define(["Plot","filteredRows","selectedRegion"], _9);
  main.variable(observer()).define(["md","selectedRegion"], _10);
  main.variable(observer()).define(["Plot","filteredRows"], _11);
  main.variable(observer()).define(["md","selectedRegion"], _12);
  main.variable(observer()).define(["dailyDealsByRegion","selectedRegion","md","agnosticAddDays","dateFns","Plot"], _13);
  main.variable(observer()).define(["md","selectedRegion"], _14);
  main.variable(observer()).define(["dailyDealsByRegion","selectedRegion","md","agnosticAddDays","dateFns","Plot"], _15);
  main.variable(observer()).define(["md","selectedRegion"], _16);
  main.variable(observer()).define(["dailyDealsByRegion","selectedRegion","md","agnosticAddDays","dateFns","Plot"], _17);
  main.variable(observer()).define(["md","selectedRegion"], _18);
  main.variable(observer()).define(["dailyDealsByRegion","selectedRegion","md","agnosticAddDays","dateFns","Plot"], _19);
  main.variable(observer()).define(["md","selectedRegion"], _20);
  main.variable(observer()).define(["dailyDealsByRegion","selectedRegion","md","agnosticAddDays","dateFns","Plot"], _21);
  main.variable(observer()).define(["md","selectedRegion"], _22);
  main.variable(observer()).define(["dailyDealsByRegion","selectedRegion","md","agnosticAddDays","dateFns","Plot"], _23);
  main.variable(observer()).define(["md","selectedRegion"], _24);
  main.variable(observer()).define(["dailyDealsByRegion","selectedRegion","md","agnosticAddDays","dateFns","Plot"], _25);
  main.variable(observer()).define(["md"], _26);
  const child1 = runtime.module(define1);
  main.import("minerPowerDailyAverageLatestBucketUrl", child1);
  main.variable(observer()).define(["minerPowerDailyAverageLatestBucketUrl"], _28);
  main.variable(observer("minerPowerByRegionReport")).define("minerPowerByRegionReport", ["useSyntheticRegions","minerPowerDailyAverageLatestBucketUrl"], _minerPowerByRegionReport);
  main.variable(observer()).define(["Inputs","minerPowerByRegionReport"], _30);
  main.variable(observer("minerPowerByRegionIndex")).define("minerPowerByRegionIndex", ["d3","minerPowerByRegionReport"], _minerPowerByRegionIndex);
  main.variable(observer("regions")).define("regions", ["minerPowerByRegionIndex","regionsCountriesEnglish"], _regions);
  main.variable(observer("regionsWithData")).define("regionsWithData", ["regions","minerPowerByRegionIndex"], _regionsWithData);
  main.variable(observer("filteredRows")).define("filteredRows", ["minerPowerByRegionReport","selectedRegion","d3"], _filteredRows);
  const child2 = runtime.module(define1);
  main.import("geoIpLookupsBucketUrl", child2);
  main.variable(observer("minerLocationsReport")).define("minerLocationsReport", ["geoIpLookupsBucketUrl"], _minerLocationsReport);
  main.variable(observer("isoCountries")).define("isoCountries", _isoCountries);
  main.variable(observer("regionsCountries")).define("regionsCountries", ["minerLocationsReport"], _regionsCountries);
  main.variable(observer("regionsCountriesEnglish")).define("regionsCountriesEnglish", ["regionsCountries","isoCountries"], _regionsCountriesEnglish);
  const child3 = runtime.module(define1);
  main.import("dealsBucketUrl", child3);
  main.variable(observer("dailyDealsByRegion")).define("dailyDealsByRegion", ["useSyntheticRegions","dealsBucketUrl","d3"], _dailyDealsByRegion);
  main.variable(observer()).define(["md"], _42);
  main.variable(observer("params")).define("params", ["URLSearchParams","location"], _params);
  main.variable(observer("defaultRegion")).define("defaultRegion", ["params","regions"], _defaultRegion);
  main.variable(observer("defaultUseSyntheticRegions")).define("defaultUseSyntheticRegions", ["params"], _defaultUseSyntheticRegions);
  main.variable(observer("permalink")).define("permalink", ["selectedRegion","useSyntheticRegions"], _permalink);
  main.variable(observer()).define(["md"], _47);
  const child4 = runtime.module(define2);
  main.import("quickMenu", child4);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("dateFns")).define("dateFns", ["require"], _dateFns);
  const child5 = runtime.module(define2);
  main.import("agnosticAddDays", child5);
  main.variable(observer()).define(["md"], _52);
  const child6 = runtime.module(define2);
  main.import("backups", child6);
  main.import("backupNowButton", child6);
  main.variable(observer()).define(["backups"], _54);
  return main;
}
