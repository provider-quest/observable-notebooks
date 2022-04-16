// https://observablehq.com/@jimpick/internal-mapping-storage-provider-to-countrystateprovin@634
import define1 from "./5cf93b57a7444002@222.js";
import define2 from "./5cf93b57a7444002@222.js";
import define3 from "./a957eb792b00ff81@406.js";
import define4 from "./c4e4a355c53d2a1a@111.js";
import define5 from "./13063df7b34879ca@856.js";

function _1(md){return(
md`# Internal: Mapping: Storage Provider to Country/State/Province [Provider.Quest]`
)}

function _2(md){return(
md`This notebook cross-references the list of storage providers with multiaddresses from the chain + DHT, and uses GeoIP lookup data to assign locations to each storage provider. Since storage providers may have multiple multiaddresses and IPs, and may be servicing requests from multiple regions, we assign weights to each region so aggregated statistics can be split.`
)}

function _3(md){return(
md`This hierarchy is similar to the "regions" hierarchy (see [@jimpick/provider-quest-storage-provider-to-region-mapper](https://observablehq.com/@jimpick/provider-quest-storage-provider-to-region-mapper?collection=@jimpick/provider-quest)), but with a slightly different organization where all countries are at the top level, except for the US and China, which are broken down by state/province.`
)}

function _currentEpoch(dateToEpoch){return(
dateToEpoch(new Date())
)}

async function _multiaddrsIpsReport(multiaddrsIpsLatestBucketUrl){return(
(await fetch(`${multiaddrsIpsLatestBucketUrl}/multiaddrs-ips-latest.json`)).json()
)}

async function _latestIpsGeoLite2Report(geoIpLookupsBucketUrl){return(
(await fetch(`${geoIpLookupsBucketUrl}/ips-geolite2-latest.json`)).json()
)}

async function _latestIpsBaiduReport(geoIpLookupsBucketUrl){return(
(await fetch(`${geoIpLookupsBucketUrl}/ips-baidu-latest.json`)).json()
)}

function _chinaProvinces(FileAttachment){return(
FileAttachment("china-provinces.json").json()
)}

function _chinaProvincesByCnName(d3,chinaProvinces){return(
d3.index(chinaProvinces, d => d.cn)
)}

function _chinaProvincesByCode(d3,chinaProvinces){return(
d3.index(chinaProvinces, d => d.code)
)}

async function _latestPowerReport(minerPowerDailyAverageLatestBucketUrl){return(
(await fetch(`${minerPowerDailyAverageLatestBucketUrl}/miner-power-latest.json`)).json()
)}

function _minTimestamp(dateFns){return(
dateFns.subDays(new Date(), 3)
)}

async function _multidayDealsReport(dealsBucketUrl){return(
(await fetch(`${dealsBucketUrl}/multiday-average-latest.json`)).json()
)}

function _multidayDeals(multidayDealsReport){return(
multidayDealsReport.providers
)}

function _restrictResults(Inputs){return(
Inputs.radio(["All miners", "Only miners with recent asks"], { label: 'Restrict results', value: 'All miners' })
)}

function _filterOut(Inputs,restrictResults){return(
Inputs.checkbox(["ridiculous price", "ridiculous verified price", "rejected", "no deals", "<5 deals", "<10 deals", "<50 deals", "<2 clients", "<5 clients"], {label: "Filter out asks", value: ["ridiculous price", "ridiculous verified price", "no deals", "<5 deals", "rejected", "<2 clients"], disabled: restrictResults !== 'Only miners with recent asks' })
)}

function _filteredAsks(asksSubsetLatest,d3,minTimestamp,filterOut,legacyAnnotationsMainnet,multidayDeals)
{
  const entries = Object.entries(asksSubsetLatest.miners)
    .map(([miner, { timestamp, ...rest }]) => ([miner, {
      timestamp: d3.isoParse(timestamp),
      ...rest
    }]))
    .filter(([miner, ask]) => (
      ask.timestamp >= minTimestamp &&
      (filterOut.includes('ridiculous price') ? ask.priceDouble < 1e14 : true) &&
      (filterOut.includes('ridiculous verified price') ? ask.verifiedPriceDouble < 1e14 : true) &&
      (filterOut.includes('rejected') && legacyAnnotationsMainnet[miner] ? !legacyAnnotationsMainnet[miner].match(/^rejected,/) : true) &&
      (filterOut.includes('no deals') ? (multidayDeals && multidayDeals[miner]): true) &&
      (filterOut.includes('<5 deals') ? (multidayDeals && multidayDeals[miner] && multidayDeals[miner].count >= 5): true) &&
      (filterOut.includes('<10 deals') ? (multidayDeals && multidayDeals[miner] && multidayDeals[miner].count >= 10): true) &&
      (filterOut.includes('<50 deals') ? (multidayDeals && multidayDeals[miner] && multidayDeals[miner].count >= 50): true) &&
      (filterOut.includes('<2 clients') ? (multidayDeals && multidayDeals[miner] && multidayDeals[miner]['approx_count_distinct(client)'] >= 2): true) &&
      (filterOut.includes('<5 clients') ? (multidayDeals && multidayDeals[miner] && multidayDeals[miner]['approx_count_distinct(client)'] >= 5): true) /* &&
      !legacyAnnotationsMainnet[miner].match(/^fail,/) &&
      !legacyAnnotationsMainnet[miner].match(/^delist,/) */
    ))
    .map(([miner, ask]) => ({miner, ...ask}))
  return entries
}


function _minerIps(multiaddrsIpsReport,restrictResults,filteredAsks,latestIpsGeoLite2Report,latestIpsBaiduReport,chinaProvincesByCnName,regionMapper)
{
  const minerIps = new Map()
  for (const record of multiaddrsIpsReport.multiaddrsIps) {
    if (restrictResults === 'Only miners with recent asks') {
      if (!filteredAsks.find(({ miner }) => miner === record.miner)) continue
    }
    const maddrIps = minerIps.get(record.miner) || []
    const maddrIpRecord = {
      maddr: record.maddr,
      ip: record.ip
    }
    if (record.chain) maddrIpRecord.chain = true
    if (record.dht) maddrIpRecord.dht = true
    if (latestIpsGeoLite2Report.ipsGeoLite2[record.ip]) {
      maddrIpRecord.geolite2 = latestIpsGeoLite2Report.ipsGeoLite2[record.ip]
    }
    if (latestIpsBaiduReport.ipsBaidu[record.ip]) {
      maddrIpRecord.baidu = latestIpsBaiduReport.ipsBaidu[record.ip]
      if (maddrIpRecord.baidu && maddrIpRecord.baidu.baidu && maddrIpRecord.baidu.baidu.address) {
        const match = maddrIpRecord.baidu.baidu.address.match(/^CN\|([^|]+)/)
        if (match && match[1] && chinaProvincesByCnName.get(match[1])) {
          maddrIpRecord.baidu.province = chinaProvincesByCnName.get(match[1])
        }
      }
    }
    const region = regionMapper(maddrIpRecord.geolite2, maddrIpRecord.baidu)
    if (region) maddrIpRecord.region = region
    maddrIps.push(maddrIpRecord)
    minerIps.set(record.miner, maddrIps)
  }
  return minerIps
}


function _regionHierarchy(){return(
{
  name: 'root',
  children: [
    {
      name: 'Mainland China',
      code: 'CN',
      note: 'Does not include Hong Kong, Taiwan'
    },
    {
      name: 'USA',
      code: 'US'
    }
  ]
}
)}

function _root(d3,_,regionHierarchy){return(
d3.hierarchy(_.cloneDeep(regionHierarchy))
)}

function _27(graph,root){return(
graph(root, {label: d => `${d.data.code ? d.data.code + ': ' : ''}${d.data.name}`})
)}

function _numberOfLeaves(root){return(
root.copy().count().value
)}

function _numberOfNodes(root){return(
root.copy().sum(d => 1).value
)}

function _indexedRoot(d3,root)
{
  function childrenIndex(d) {
    return d3.index(d.children.map(d => {
      const value = d.data
      if (value && value.children) {
        value.children = childrenIndex(d)
      }
      return value
    }), d => d.code)
  }
  return childrenIndex(root)
}


function _regionMapper(indexedRoot){return(
function regionMapper (geolite2, baidu) {
  if (!geolite2) return null

  // Try to break into country-based subcategories if >10 miners
  const country = indexedRoot.get(geolite2.country)
  if (country) {
    if (country.code === 'CN') {
      if (baidu && baidu.province) {
        return `CN-${baidu.province.code}`
      }
      return `CN-XX`
    }
    if (geolite2.subdiv1) {
      return `${country.code}-${geolite2.subdiv1}`
    }
    return `${country.code}-XX`
  } else {
    return geolite2.country
  }
}
)}

function _minerRegions(minerIps)
{
  const minerRegions = []
  for (const miner of [...minerIps.keys()]) {
    const regions = minerIps.get(miner).reduce(
      (regionSet, { region }) => region ? regionSet.add(region) : regionSet,
      new Set()
    )
    minerRegions.push({
      miner,
      regions: [...regions].sort()
    })
  }
  return minerRegions
}


function _33(md){return(
md`## Zero-region miners`
)}

function _34(md){return(
md`For some reason, the IP addresses for these miners didn't have any geolocation results.`
)}

function _zeroRegionMinersList(minerRegions){return(
minerRegions.filter(({ miner, regions }) => regions.length === 0).map(({ miner, regions }) => ({ miner, regions: regions.join(',') }))
)}

function _zeroRegionMiners(zeroRegionMinersList,sortMiners){return(
zeroRegionMinersList.map(({ miner }) => miner).sort(sortMiners)
)}

function _37(md){return(
md`## One-region miners`
)}

function _oneRegionMinersList(minerRegions){return(
minerRegions.filter(({ miner, regions }) => regions.length === 1).map(({ miner, regions }) => ({ miner, region: regions[0] }))
)}

function _regionCounts(oneRegionMinersList){return(
Object.entries(oneRegionMinersList.reduce((regions, { miner, region }) => {
  regions[region] ||= 0
  regions[region]++
  return regions
}, {})).map(([region, count]) => ({ region, count })).sort(({ count: a }, { count: b }) => b - a)
)}

function _oneRegionSelected(Inputs,regionCounts){return(
Inputs.select(regionCounts, { format: ({ region, count }) => `${region} (${count} miners)` })
)}

function _selectedOneRegionMiners(oneRegionMinersList,oneRegionSelected,minerIps,sortMinerRecords){return(
oneRegionMinersList.filter(({ region }) => region === oneRegionSelected.region).map(({ miner }) => ({ miner, multiaddrIps: minerIps.get(miner) })).sort(sortMinerRecords)
)}

function _selectedOneRegionMinerCountries(selectedOneRegionMiners){return(
selectedOneRegionMiners.reduce((countryCounts, minerRecord) => {
  for (const multiaddrIp of minerRecord.multiaddrIps) {
    if (multiaddrIp.geolite2) {
      const country = multiaddrIp.geolite2.country
      countryCounts[country] ||= new Set()
      countryCounts[country].add(minerRecord.miner)
    }
  }
  return countryCounts
}, {})
)}

function _43(Inputs,selectedOneRegionMinerCountries){return(
Inputs.table(Object.entries(selectedOneRegionMinerCountries).map(([country, minerSet]) => ({ country, minerCount: minerSet.size, miners: [...minerSet].join(', ') })))
)}

function _countryPowerAndDeals(selectedOneRegionMinerCountries,latestPowerReport,multidayDeals)
{
  const countryPowerAndDeals = {}
  for (const country in selectedOneRegionMinerCountries) {
    countryPowerAndDeals[country] ||= { qualityAdjPower: 0, dealsCount: 0, pieceSizeDouble: 0 }
    for (const miner of selectedOneRegionMinerCountries[country]) {
      if (latestPowerReport.miners[miner]) {
        countryPowerAndDeals[country].qualityAdjPower += latestPowerReport.miners[miner].qualityAdjPower
      }
      if (multidayDeals[miner]) {
        countryPowerAndDeals[country].dealsCount += multidayDeals[miner].count
        countryPowerAndDeals[country].pieceSizeDouble += multidayDeals[miner]['sum(pieceSizeDouble)']
      }
    }
  }
  return countryPowerAndDeals
}


function _countryPowerAndDealsBytes(countryPowerAndDeals,bytes){return(
Object.entries(countryPowerAndDeals).map(d => ({
  country: d[0],
  qualityAdjPower: d[1].qualityAdjPower,
  qualityAdjPowerBytes: bytes(d[1].qualityAdjPower, { mode: 'binary' }),
  dealsCount: d[1].dealsCount,
  pieceSizeDouble: bytes(d[1].pieceSizeDouble, { mode: 'binary' })
})).sort((a, b) => b.qualityAdjPower - a.qualityAdjPower)
)}

function _46(Inputs,countryPowerAndDealsBytes){return(
Inputs.table(countryPowerAndDealsBytes)
)}

function _selectedOneRegionMinerStateProvinces(selectedOneRegionMiners){return(
selectedOneRegionMiners.reduce((provinceCounts, minerRecord) => {
  for (const multiaddrIp of minerRecord.multiaddrIps) {
    if (multiaddrIp.baidu && multiaddrIp.baidu.province) {
      const province = multiaddrIp.baidu.province.code
      provinceCounts[province] ||= new Set()
      provinceCounts[province].add(minerRecord.miner)
    } else if (multiaddrIp.geolite2 && multiaddrIp.geolite2.subdiv1) {
      const province = multiaddrIp.geolite2.subdiv1
      provinceCounts[province] ||= new Set()
      provinceCounts[province].add(minerRecord.miner)
    }
  }
  return provinceCounts
}, {})
)}

function _48(Inputs,selectedOneRegionMinerStateProvinces){return(
Inputs.table(Object.entries(selectedOneRegionMinerStateProvinces).map(([stateProvince, minerSet]) => ({ stateProvince, minerCount: minerSet.size, miners: [...minerSet].join(', ') })))
)}

function _stateProvincePowerAndDeals(selectedOneRegionMinerStateProvinces,latestPowerReport,multidayDeals)
{
  const provincePowerAndDeals = {}
  for (const province in selectedOneRegionMinerStateProvinces) {
    provincePowerAndDeals[province] ||= { qualityAdjPower: 0, dealsCount: 0, pieceSizeDouble: 0 }
    for (const miner of selectedOneRegionMinerStateProvinces[province]) {
      if (latestPowerReport.miners[miner]) {
        provincePowerAndDeals[province].qualityAdjPower += latestPowerReport.miners[miner].qualityAdjPower
      }
      if (multidayDeals[miner]) {
        provincePowerAndDeals[province].dealsCount += multidayDeals[miner].count
        provincePowerAndDeals[province].pieceSizeDouble += multidayDeals[miner]['sum(pieceSizeDouble)']
      }
    }
  }
  return provincePowerAndDeals
}


function _stateProvincePowerAndDealsBytes(stateProvincePowerAndDeals,bytes){return(
Object.entries(stateProvincePowerAndDeals).map(d => ({
  stateProvince: d[0],
  qualityAdjPower: d[1].qualityAdjPower,
  qualityAdjPowerBytes: bytes(d[1].qualityAdjPower, { mode: 'binary' }),
  dealsCount: d[1].dealsCount,
  pieceSizeDouble: bytes(d[1].pieceSizeDouble, { mode: 'binary' })
})).sort((a, b) => b.qualityAdjPower - a.qualityAdjPower)
)}

function _51(Inputs,stateProvincePowerAndDealsBytes){return(
Inputs.table(stateProvincePowerAndDealsBytes)
)}

function _52(md){return(
md`## Multi-region miners`
)}

function _multiRegionMinersList(minerRegions){return(
minerRegions.filter(({ miner, regions }) => regions.length > 1).map(({ miner, regions }) => ({ miner, regions: regions.join(',') }))
)}

function _multiRegionCounts(multiRegionMinersList){return(
Object.entries(multiRegionMinersList.reduce((multiRegions, { miner, regions }) => {
  multiRegions[regions] ||= 0
  multiRegions[regions]++
  return multiRegions
}, {})).map(([regions, count]) => ({ regions, count })).sort(({ count: a }, { count: b }) => b - a)
)}

function _multiRegionSelected(Inputs,multiRegionCounts){return(
Inputs.select(multiRegionCounts, { format: ({ regions, count }) => `${regions} (${count} miners)` })
)}

function _selectedMultiRegionMiners(multiRegionMinersList,multiRegionSelected,minerIps,sortMinerRecords){return(
multiRegionMinersList.filter(({ regions }) => regions === multiRegionSelected.regions).map(({ miner }) => ({ miner, multiaddrIps: minerIps.get(miner) })).sort(sortMinerRecords)
)}

function _57(md){return(
md`## Exported Maps`
)}

function _minerRegionsTable(minerRegions,sortMinerRecords)
{
  const minerRegionsTable = []
  for (const { miner, regions } of minerRegions) {
    for (const region of regions) {
      minerRegionsTable.push({
        miner,
        region,
        numRegions: regions.length
      })
    }
  }
  return minerRegionsTable.sort(sortMinerRecords)
}


function _minerLocationsTable(minerIps,sortMinerRecords)
{
  const minerLocationsTable = []
  for (const miner of [...minerIps.keys()]) {
    const locations = new Map()
    const ipLocations = minerIps.get(miner)
    for (const ipLocation of ipLocations) {
      const { region, geolite2, baidu } = ipLocation
      if (!region) continue
      let { country, subdiv1, city, long, lat } = geolite2 ? geolite2 : {}
      if (baidu) {
        if (baidu.city) {
          subdiv1 = null
          city = baidu.city
        }
        if (baidu.long && baidu.lat) {
          long = baidu.long
          lat = baidu.lat
        }
      }
      if (!long || !lat) continue
      const key = `${region},` +
        `${country ? country : ''},` +
        `${subdiv1 ? subdiv1 : ''},` + 
        `${city ? city : ''},` +
        `${long},${lat}`
      locations.set(key, { region, country, subdiv1, city, long, lat })
    }
    for (const { region, country, subdiv1, city, long, lat } of locations.values()) {
      const locationRecord = { miner, region, long, lat, numLocations: locations.size }
      if (country) locationRecord.country = country
      if (subdiv1) locationRecord.subdiv1 = subdiv1
      if (city) locationRecord.city = city
      minerLocationsTable.push(locationRecord)
    }
  }
  return minerLocationsTable.sort(sortMinerRecords)
}


function _60(md){return(
md`## Imports`
)}

function _d3(require){return(
require("d3@6")
)}

function _dateFns(require){return(
require('https://bundle.run/date-fns@2.22.1')
)}

async function _bytes(){return(
(await import('https://unpkg.com/@jimpick/bytes-iec@3.1.0-2?module')).default
)}

function _67(md){return(
md`## Backups`
)}

function _69(backups){return(
backups()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["china-provinces.json",new URL("./files/a8affb1c22a7bd9298f69e03b29c11e28ce20625c02e3113f73c6a3def582a81f2cc38c2aabe71eca6bbb4abb796ad6f5db02af83a8da5f834dc0955b1418e8c",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("currentEpoch")).define("currentEpoch", ["dateToEpoch"], _currentEpoch);
  const child1 = runtime.module(define1);
  main.import("multiaddrsIpsLatestBucketUrl", child1);
  main.variable(observer("multiaddrsIpsReport")).define("multiaddrsIpsReport", ["multiaddrsIpsLatestBucketUrl"], _multiaddrsIpsReport);
  const child2 = runtime.module(define1);
  main.import("geoIpLookupsBucketUrl", child2);
  main.variable(observer("latestIpsGeoLite2Report")).define("latestIpsGeoLite2Report", ["geoIpLookupsBucketUrl"], _latestIpsGeoLite2Report);
  main.variable(observer("latestIpsBaiduReport")).define("latestIpsBaiduReport", ["geoIpLookupsBucketUrl"], _latestIpsBaiduReport);
  main.variable(observer("chinaProvinces")).define("chinaProvinces", ["FileAttachment"], _chinaProvinces);
  main.variable(observer("chinaProvincesByCnName")).define("chinaProvincesByCnName", ["d3","chinaProvinces"], _chinaProvincesByCnName);
  main.variable(observer("chinaProvincesByCode")).define("chinaProvincesByCode", ["d3","chinaProvinces"], _chinaProvincesByCode);
  const child3 = runtime.module(define2);
  main.import("minerPowerDailyAverageLatestBucketUrl", child3);
  main.variable(observer("latestPowerReport")).define("latestPowerReport", ["minerPowerDailyAverageLatestBucketUrl"], _latestPowerReport);
  const child4 = runtime.module(define1);
  main.import("asksSubsetLatest", child4);
  main.variable(observer("minTimestamp")).define("minTimestamp", ["dateFns"], _minTimestamp);
  const child5 = runtime.module(define1);
  main.import("legacyAnnotationsMainnet", child5);
  const child6 = runtime.module(define1);
  main.import("dealsBucketUrl", child6);
  main.variable(observer("multidayDealsReport")).define("multidayDealsReport", ["dealsBucketUrl"], _multidayDealsReport);
  main.variable(observer("multidayDeals")).define("multidayDeals", ["multidayDealsReport"], _multidayDeals);
  main.variable(observer("viewof restrictResults")).define("viewof restrictResults", ["Inputs"], _restrictResults);
  main.variable(observer("restrictResults")).define("restrictResults", ["Generators", "viewof restrictResults"], (G, _) => G.input(_));
  main.variable(observer("viewof filterOut")).define("viewof filterOut", ["Inputs","restrictResults"], _filterOut);
  main.variable(observer("filterOut")).define("filterOut", ["Generators", "viewof filterOut"], (G, _) => G.input(_));
  main.variable(observer("filteredAsks")).define("filteredAsks", ["asksSubsetLatest","d3","minTimestamp","filterOut","legacyAnnotationsMainnet","multidayDeals"], _filteredAsks);
  main.variable(observer("minerIps")).define("minerIps", ["multiaddrsIpsReport","restrictResults","filteredAsks","latestIpsGeoLite2Report","latestIpsBaiduReport","chinaProvincesByCnName","regionMapper"], _minerIps);
  main.variable(observer("regionHierarchy")).define("regionHierarchy", _regionHierarchy);
  main.variable(observer("root")).define("root", ["d3","_","regionHierarchy"], _root);
  main.variable(observer()).define(["graph","root"], _27);
  main.variable(observer("numberOfLeaves")).define("numberOfLeaves", ["root"], _numberOfLeaves);
  main.variable(observer("numberOfNodes")).define("numberOfNodes", ["root"], _numberOfNodes);
  main.variable(observer("indexedRoot")).define("indexedRoot", ["d3","root"], _indexedRoot);
  main.variable(observer("regionMapper")).define("regionMapper", ["indexedRoot"], _regionMapper);
  main.variable(observer("minerRegions")).define("minerRegions", ["minerIps"], _minerRegions);
  main.variable(observer()).define(["md"], _33);
  main.variable(observer()).define(["md"], _34);
  main.variable(observer("zeroRegionMinersList")).define("zeroRegionMinersList", ["minerRegions"], _zeroRegionMinersList);
  main.variable(observer("zeroRegionMiners")).define("zeroRegionMiners", ["zeroRegionMinersList","sortMiners"], _zeroRegionMiners);
  main.variable(observer()).define(["md"], _37);
  main.variable(observer("oneRegionMinersList")).define("oneRegionMinersList", ["minerRegions"], _oneRegionMinersList);
  main.variable(observer("regionCounts")).define("regionCounts", ["oneRegionMinersList"], _regionCounts);
  main.variable(observer("viewof oneRegionSelected")).define("viewof oneRegionSelected", ["Inputs","regionCounts"], _oneRegionSelected);
  main.variable(observer("oneRegionSelected")).define("oneRegionSelected", ["Generators", "viewof oneRegionSelected"], (G, _) => G.input(_));
  main.variable(observer("selectedOneRegionMiners")).define("selectedOneRegionMiners", ["oneRegionMinersList","oneRegionSelected","minerIps","sortMinerRecords"], _selectedOneRegionMiners);
  main.variable(observer("selectedOneRegionMinerCountries")).define("selectedOneRegionMinerCountries", ["selectedOneRegionMiners"], _selectedOneRegionMinerCountries);
  main.variable(observer()).define(["Inputs","selectedOneRegionMinerCountries"], _43);
  main.variable(observer("countryPowerAndDeals")).define("countryPowerAndDeals", ["selectedOneRegionMinerCountries","latestPowerReport","multidayDeals"], _countryPowerAndDeals);
  main.variable(observer("countryPowerAndDealsBytes")).define("countryPowerAndDealsBytes", ["countryPowerAndDeals","bytes"], _countryPowerAndDealsBytes);
  main.variable(observer()).define(["Inputs","countryPowerAndDealsBytes"], _46);
  main.variable(observer("selectedOneRegionMinerStateProvinces")).define("selectedOneRegionMinerStateProvinces", ["selectedOneRegionMiners"], _selectedOneRegionMinerStateProvinces);
  main.variable(observer()).define(["Inputs","selectedOneRegionMinerStateProvinces"], _48);
  main.variable(observer("stateProvincePowerAndDeals")).define("stateProvincePowerAndDeals", ["selectedOneRegionMinerStateProvinces","latestPowerReport","multidayDeals"], _stateProvincePowerAndDeals);
  main.variable(observer("stateProvincePowerAndDealsBytes")).define("stateProvincePowerAndDealsBytes", ["stateProvincePowerAndDeals","bytes"], _stateProvincePowerAndDealsBytes);
  main.variable(observer()).define(["Inputs","stateProvincePowerAndDealsBytes"], _51);
  main.variable(observer()).define(["md"], _52);
  main.variable(observer("multiRegionMinersList")).define("multiRegionMinersList", ["minerRegions"], _multiRegionMinersList);
  main.variable(observer("multiRegionCounts")).define("multiRegionCounts", ["multiRegionMinersList"], _multiRegionCounts);
  main.variable(observer("viewof multiRegionSelected")).define("viewof multiRegionSelected", ["Inputs","multiRegionCounts"], _multiRegionSelected);
  main.variable(observer("multiRegionSelected")).define("multiRegionSelected", ["Generators", "viewof multiRegionSelected"], (G, _) => G.input(_));
  main.variable(observer("selectedMultiRegionMiners")).define("selectedMultiRegionMiners", ["multiRegionMinersList","multiRegionSelected","minerIps","sortMinerRecords"], _selectedMultiRegionMiners);
  main.variable(observer()).define(["md"], _57);
  main.variable(observer("minerRegionsTable")).define("minerRegionsTable", ["minerRegions","sortMinerRecords"], _minerRegionsTable);
  main.variable(observer("minerLocationsTable")).define("minerLocationsTable", ["minerIps","sortMinerRecords"], _minerLocationsTable);
  main.variable(observer()).define(["md"], _60);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("dateFns")).define("dateFns", ["require"], _dateFns);
  const child7 = runtime.module(define3);
  main.import("dateToEpoch", child7);
  main.import("epochToDate", child7);
  const child8 = runtime.module(define4);
  main.import("sortMiners", child8);
  main.import("sortMinerRecords", child8);
  const child9 = runtime.module(define5);
  main.import("graph", child9);
  main.variable(observer("bytes")).define("bytes", _bytes);
  main.variable(observer()).define(["md"], _67);
  const child10 = runtime.module(define4);
  main.import("backups", child10);
  main.import("backupNowButton", child10);
  main.variable(observer()).define(["backups"], _69);
  return main;
}
