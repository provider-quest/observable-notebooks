// https://observablehq.com/@jimpick/provider-quest-regional-stats@418
import define1 from "./5cf93b57a7444002@222.js";
import define2 from "./c4e4a355c53d2a1a@111.js";

function _1(md){return(
md`# Regional Stats [Provider.Quest]`
)}

function _2(md,quickMenu){return(
md`${quickMenu}`
)}

function _3(md){return(
md`Notes:

* Only includes storage providers that advertise IP addresses that have been geo-located to the selected region.
* Most power on the network is associated with storage providers that do not advertise IP addresses (or our geo-IP lookup failed), so they are allocated to "No Region". These providers can publish offline deals, but aren't reachable for online deals or online retrievals.
* Storage providers may be included in multiple regions if they have multiple IP addresses (power is split between regions).
* IP addresses are not tested to confirm that they are live.
* Category groupings by region are arbitrary and may change over time. Right now, we don't have computed stats for parent categories, but I will add those soon. The regions are defined using JavaScript in the [@jimpick/provider-quest-storage-provider-to-region-mapper](https://observablehq.com/@jimpick/provider-quest-storage-provider-to-region-mapper?collection=@jimpick/provider-quest) notebook.
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
md`## Region: ${selectedRegion.pretty} - Number of Providers (Split)

"Split" = Counts for providers with locations in multiple regions are counted fractionally.`
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
  const file = useSyntheticRegions ? 'provider-power-by-synthetic-region' : 'miner-power-by-region'
  return (await fetch(`${minerPowerDailyAverageLatestBucketUrl}/${file}.json`)).json()
}


function _30(Inputs,minerPowerByRegionReport){return(
Inputs.table(minerPowerByRegionReport.rows)
)}

function _minerPowerByRegionIndex(d3,minerPowerByRegionReport){return(
d3.index(minerPowerByRegionReport.rows, d => d.region, d => d.date)
)}

function _regions(){return(
[
  { region: 'AS-CN-EAST-FJ', pretty: 'Asia: Mainland China: East: 福建 Fujian', scale: 'PiB' },
  { region: 'AS-CN-EAST-SH', pretty: 'Asia: Mainland China: East: 上海 Shanghai', scale: 'PiB' },
  { region: 'AS-CN-EAST-ZJ', pretty: 'Asia: Mainland China: East: 浙江 Zhejiang', scale: 'PiB' },
  { region: 'AS-CN-EAST-JS', pretty: 'Asia: Mainland China: East: 江苏 Jiangsu', scale: 'PiB' },
  { region: 'AS-CN-SOUTH-GD', pretty: 'Asia: Mainland China: South: 广东 Guangdong', scale: 'PiB' },
  { region: 'AS-CN-SOUTH-GX', pretty: 'Asia: Mainland China: South: 广西 Guangxi', scale: 'PiB' },
  { region: 'AS-CN-SOUTH-HI', pretty: 'Asia: Mainland China: South: 海南 Hainan', scale: 'PiB' },
  { region: 'AS-CN-NORTHWEST-XJ', pretty: 'Asia: Mainland China: Northwest: 新疆 Xinjiang', scale: 'PiB' },
  { region: 'AS-CN-NORTHWEST-SN', pretty: 'Asia: Mainland China: Northwest: 陕西 Shaanxi', scale: 'PiB' },
  { region: 'AS-CN-NORTHWEST-XX', pretty: 'Asia: Mainland China: Northwest: Others Combined', scale: 'PiB' },
  { region: 'AS-CN-NORTH-BJ', pretty: 'Asia: Mainland China: North: 北京 Beijing', scale: 'PiB' },
  { region: 'AS-CN-NORTH-SD', pretty: 'Asia: Mainland China: North: 山东 Shandong', scale: 'PiB' },
  { region: 'AS-CN-NORTH-NM', pretty: 'Asia: Mainland China: North: 内蒙古 Inner Mongolia', scale: 'PiB' },
  { region: 'AS-CN-NORTH-HA', pretty: 'Asia: Mainland China: North: 河南 Henan', scale: 'PiB' },
  { region: 'AS-CN-NORTH-HE', pretty: 'Asia: Mainland China: North: 河北 Hebei', scale: 'PiB' },
  { region: 'AS-CN-NORTH-TJ', pretty: 'Asia: Mainland China: North: 天津 Tianjin', scale: 'PiB' },
  { region: 'AS-CN-NORTH-SX', pretty: 'Asia: Mainland China: North: 山西 Shanxi', scale: 'PiB' },
  { region: 'AS-CN-SOUTHWEST-SC', pretty: 'Asia: Mainland China: Southwest: 四川 Sichuan', scale: 'PiB' },
  { region: 'AS-CN-SOUTHWEST-CQ', pretty: 'Asia: Mainland China: Southwest: 重庆 Chongqing', scale: 'PiB' },
  { region: 'AS-CN-SOUTHWEST-GZ', pretty: 'Asia: Mainland China: Southwest: 贵州 Guizhou', scale: 'PiB' },
  { region: 'AS-CN-SOUTHWEST-YN', pretty: 'Asia: Mainland China: Southwest: 云南 Yunnan', scale: 'PiB' },
  { region: 'AS-CN-SOUTHWEST-XZ', pretty: 'Asia: Mainland China: Southwest: 西藏 Tibet', scale: 'PiB' },
  { region: 'AS-CN-SOUTHCENTRAL-JX', pretty: 'Asia: Mainland China: South-Central: 江西 Jiangxi', scale: 'PiB' },
  { region: 'AS-CN-SOUTHCENTRAL-HN', pretty: 'Asia: Mainland China: South-Central: 湖南 Hunan', scale: 'PiB' },
  { region: 'AS-CN-SOUTHCENTRAL-AH', pretty: 'Asia: Mainland China: South-Central: 安徽 Anhui', scale: 'PiB' },
  { region: 'AS-CN-SOUTHCENTRAL-HB', pretty: 'Asia: Mainland China: South-Central: 湖北 Hubei', scale: 'PiB' },
  { region: 'AS-CN-NORTHEAST-XX', pretty: 'Asia: Mainland China: Northeast: Combined', scale: 'PiB' },
  { region: 'AS-CN-XX', pretty: 'Asia: Mainland China: Others', note: 'Does not include Hong Kong, Taiwan', scale: 'PiB' },
  { region: 'AS-SG', pretty: 'Asia: Singapore', note: 'Includes multi-region miners (China).', scale: 'PiB' },
  { region: 'AS-KR', pretty: 'Asia: Korea', note: 'Currently only South Korea', scale: 'PiB' },
  { region: 'AS-HK', pretty: 'Asia: Hong Kong', note: 'Includes multi-region miners (China).', scale: 'PiB' },
  { region: 'AS-JP', pretty: 'Asia: Japan', scale: 'PiB' },
  { region: 'AS-XX', pretty: 'Asia: Other', scale: 'PiB' },
  { region: 'NA-US-SOUTH-VA', pretty: 'North America: USA: South: Virgina', scale: 'PiB' },
  { region: 'NA-US-SOUTH-NC', pretty: 'North America: USA: South: North Carolina', scale: 'PiB' },
  { region: 'NA-US-SOUTH-TX', pretty: 'North America: USA: South: Texas', scale: 'PiB' },
  { region: 'NA-US-SOUTH-GA', pretty: 'North America: USA: South: Georgia', scale: 'PiB' },
  { region: 'NA-US-SOUTH-FL', pretty: 'North America: USA: South: Florida', scale: 'PiB' },
  { region: 'NA-US-SOUTH-XX', pretty: 'North America: USA: South: Others Combined', scale: 'PiB' },
  { region: 'NA-US-WEST-CA', pretty: 'North America: USA: West: California', scale: 'PiB' },
  { region: 'NA-US-WEST-WA', pretty: 'North America: USA: West: Washington', scale: 'PiB' },
  { region: 'NA-US-WEST-OR', pretty: 'North America: USA: West: Oregon', scale: 'PiB' },
  { region: 'NA-US-WEST-CO', pretty: 'North America: USA: West: Colorado', scale: 'PiB' },
  { region: 'NA-US-WEST-UT', pretty: 'North America: USA: West: Utah', scale: 'PiB' },
  { region: 'NA-US-WEST-XX', pretty: 'North America: USA: West: Others Combined', scale: 'PiB' },
  { region: 'NA-US-MIDWEST-IA', pretty: 'North America: USA: Midwest: Iowa', scale: 'PiB' },
  { region: 'NA-US-MIDWEST-IL', pretty: 'North America: USA: Midwest: Illinois', scale: 'PiB' },
  { region: 'NA-US-MIDWEST-MI', pretty: 'North America: USA: Midwest: Michigan', scale: 'PiB' },
  { region: 'NA-US-MIDWEST-NE', pretty: 'North America: USA: Midwest: Nebraska', scale: 'PiB' },
  { region: 'NA-US-MIDWEST-WI', pretty: 'North America: USA: Midwest: Wisconsin', scale: 'PiB' },
  { region: 'NA-US-MIDWEST-XX', pretty: 'North America: USA: Midwest: Others Combined', scale: 'PiB' },
  { region: 'NA-US-NORTHEAST-NY', pretty: 'North America: USA: Northeast: New York', scale: 'PiB' },
  { region: 'NA-US-NORTHEAST-MA', pretty: 'North America: USA: Northeast: Massachusetts', scale: 'PiB' },
  { region: 'NA-US-NORTHEAST-PA', pretty: 'North America: USA: Northeast: Pennsylvania', scale: 'PiB' },
  { region: 'NA-US-NORTHEAST-NJ', pretty: 'North America: USA: Northeast: New Jersey', scale: 'PiB' },
  { region: 'NA-US-NORTHEAST-XX', pretty: 'North America: USA: Northeast: Others Combined', scale: 'PiB' },
  { region: 'NA-US-XX', pretty: 'North America: USA: Others Combined', scale: 'PiB' },
  { region: 'NA-CA', pretty: 'North America: Canada', scale: 'PiB' },
  { region: 'NA-XX', pretty: 'North America: Mexico + Other', note: 'No miners currently in Carribean, Central America.', scale: 'PiB' },
  { region: 'EU-WEST-DE', pretty: 'Europe: West: Germany', scale: 'PiB' },
  { region: 'EU-WEST-NL', pretty: 'Europe: West: Netherlands', scale: 'PiB' },
  { region: 'EU-WEST-FR', pretty: 'Europe: West: France', scale: 'PiB' },
  { region: 'EU-WEST-BE', pretty: 'Europe: West: Belgium', scale: 'PiB' },
  { region: 'EU-WEST-XX', pretty: 'Europe: West: Others', scale: 'PiB' },
  { region: 'EU-EAST-UA', pretty: 'Europe: East: Ukraine', scale: 'PiB' },
  { region: 'EU-EAST-RU', pretty: 'Europe: East: Russia', scale: 'PiB' },
  { region: 'EU-EAST-BG', pretty: 'Europe: East: Bulgaria', scale: 'PiB' },
  { region: 'EU-EAST-PL', pretty: 'Europe: East: Poland', scale: 'PiB' },
  { region: 'EU-EAST-XX', pretty: 'Europe: East: Others', scale: 'PiB' },
  { region: 'EU-NORTH-GB', pretty: 'Europe: North: United Kingdom', scale: 'PiB' },
  { region: 'EU-NORTH-NO', pretty: 'Europe: North: Norway', scale: 'PiB' },
  { region: 'EU-NORTH-XX', pretty: 'Europe: North: Others', scale: 'PiB' },
  { region: 'EU-SOUTH-XX', pretty: 'Europe: South: Combined', scale: 'PiB' },
  { region: 'OC-XX', pretty: 'Oceania', scale: 'PiB' },
  { region: 'AF-XX', pretty: 'Africa', note: 'Includes multi-region miners (China).', scale: 'PiB' },
  { region: 'SA-XX', pretty: 'South America', note: 'Includes multi-region miners (China).', scale: 'PiB' },
  { region: 'none', pretty: 'No Region', note: "Miners without IP addresses that can't be geo-located. Unavailable for online deals.", scale: 'EiB' }
]
)}

function _regionsWithData(regions,minerPowerByRegionIndex){return(
regions.filter(({ region }) => minerPowerByRegionIndex.get(region))
)}

function _filteredRows(minerPowerByRegionReport,selectedRegion,d3){return(
minerPowerByRegionReport.rows
  .filter(({ region }) => region === selectedRegion.region)
  .map(row => ({
    date: d3.isoParse(row.date),
    minerCount: row['sum(splitCount)'],
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
(await fetch(`${geoIpLookupsBucketUrl}/miner-locations-latest.json`)).json()
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
  const file = useSyntheticRegions ? 'daily-deals-by-synthetic-region' : 'daily-deals-by-region'
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
  main.variable(observer("regions")).define("regions", _regions);
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
