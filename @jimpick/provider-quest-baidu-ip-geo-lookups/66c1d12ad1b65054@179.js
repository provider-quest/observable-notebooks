// https://observablehq.com/@jimpick/provider-quest-baidu-ip-geo-lookups@179
import define1 from "./5cf93b57a7444002@230.js";
import define2 from "./5cf93b57a7444002@230.js";
import define3 from "./a957eb792b00ff81@406.js";
import define4 from "./c4e4a355c53d2a1a@111.js";

function _1(md){return(
md`# Internal: Scanner: Baidu IP Geo Lookups [Provider.Quest]`
)}

function _currentEpoch(){return(
78000
)}

function _currentEpochDate(epochToDate,currentEpoch){return(
epochToDate(currentEpoch).toISOString()
)}

function _latestIpsGeoLite2ReportUrl(){return(
`http://localhost:3000/ips-geolite2/ips-geolite2-2020-09-21.json`
)}

async function _latestIpsGeoLite2Report(latestIpsGeoLite2ReportUrl){return(
(await fetch(latestIpsGeoLite2ReportUrl)).json()
)}

function _chinaIpRecords(latestIpsGeoLite2Report){return(
Object.entries(latestIpsGeoLite2Report.ipsGeoLite2).map(([ip, record]) => ({ ip, ...record })).filter(({ country }) => country === 'CN')
)}

function _latestIpsBaiduReportUrl(){return(
`http://localhost:3000/ips-baidu/ips-baidu-2020-09-20.json`
)}

async function _latestIpsBaiduReport(latestIpsBaiduReportUrl){return(
(await fetch(latestIpsBaiduReportUrl)).json()
)}

function _missingChinaIpRecords(chinaIpRecords,ip,latestIpsBaiduReport){return(
chinaIpRecords.filter(({ ip: ipAddress }) => {
  if (!ip.isV4Format(ipAddress)) {
    return false 
  }
  const baidu = latestIpsBaiduReport.ipsBaidu[ipAddress]
  if (baidu) {
    if (baidu.baidu && baidu.baidu.status !== 0) {
      if (baidu.baidu.message.match(/loc failed/)) return false
      return true
    }
    return false 
  }
  return true
})
)}

function _maxLookups(){return(
500
)}

function _maxElapsed(){return(
1 * 60 * 1000
)}

function _geoApiBaseUrl(){return(
'https://geoip.miner.report/api/geoip'
)}

function _14(md){return(
md`We use ObservableHQ "Secrets" and HTTP Basic Auth to prevent the public from misusing the private Baidu lookup API.`
)}

function _geoIpBaiduKey(){return(
'jim'
)}

function _geoIpBaiduSecret(){return(
'baidu123'
)}

function _basicAuthToken(base64,geoIpBaiduKey,geoIpBaiduSecret){return(
base64.encode(`${geoIpBaiduKey}:${geoIpBaiduSecret}`)
)}

async function _baiduCities(legacyWorkshopClientBucketUrl){return(
(await fetch(`${legacyWorkshopClientBucketUrl}/baidu-cities.json`)).json()
)}

function _start(Inputs){return(
Inputs.button("Start")
)}

function _newIps(d3,missingChinaIpRecords,ip){return(
d3.shuffle(missingChinaIpRecords.map(({ ip }) => ip).filter(ipAddress => ip.isV4Format(ipAddress)))
)}

function _lookupIpsStream(transform,geoApiBaseUrl,basicAuthToken,baiduCities,newIps,maxElapsed,maxLookups){return(
async function* lookupIpsStream() {
  const concurrency = 1
  const callGeoLookupsStream = transform(concurrency, async ip => {
    const baiduApiUrl = `${geoApiBaseUrl}/baidu/${ip}`
    try {
      const baidu = await (await fetch(
        baiduApiUrl,
        { headers: new Headers({ "Authorization": `Basic ${basicAuthToken}` }) }
      )).json()
      const result = {
        ip,
        baidu
      }
      if (baidu.content) {
        if (baidu.content.address_detail) {
          const cityCode = baidu.content.address_detail.city_code
          if (baiduCities[cityCode]) {
            result.city = baiduCities[cityCode]
          }
        }
        if (baidu.content.point) {
          result.long = Number(baidu.content.point.x)
          result.lat = Number(baidu.content.point.y)
        }
      }
      return result
    } catch (e) {
      console.info('IP lookup error', ip, e.message)
      return {
        error: `${e.message}, ${baiduApiUrl}`
      }
    }
  })
  const startTime = new Date()
  let counter = 0
  let hits = 0
  let errors = 0
  let lastError = ''
  for await (const geoLookup of callGeoLookupsStream([...newIps])) {
    const now = new Date()
    if (now - startTime > maxElapsed || counter >= maxLookups) {
      yield {
        done: true,
        timeout: true,
        counter,
        hits,
        errors,
        lastError
      }
      return
    }
    if (geoLookup.ip) {
      hits++
      yield {
        counter,
        hits,
        errors,
        lastError,
        ...geoLookup
      }
    } else {
      errors++
      if (geoLookup.error) {
        lastError = geoLookup.error
      }
      yield {
        counter,
        hits,
        errors,
        lastError
      }
    }
    counter++
  }
  yield {
    done: true,
    counter,
    hits,
    errors,
    lastError
  }
}
)}

function _ipsCount(newIps){return(
newIps.length
)}

async function* _ipsBaidu(start,lookupIpsStream,ipsCount)
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
  let lastError = ''
  const startTime = new Date()
  for await (const {counter, hits, errors, ...record} of lookupIpsStream()) {
    totalErrors = errors
    lastCounter = counter
    lastError = record.lastError
    if (record.ip) {
      records.push(record)
    }
    yield {
      state: "streaming",
      elapsed: ((new Date()) - startTime) / 1000,
      scannedIps: counter,
      totalIps: ipsCount,
      recordsLength: records.length,
      errors,
      lastError
    }
  }
  const endTime = new Date()
  yield {
    state: "done",
    elapsed: (endTime - startTime) / 1000,
    scannedIps: lastCounter,
    totalIps: ipsCount,
    records: records.sort(),
    startTime,
    endTime,
    errors: totalErrors,
    lastError
  }
}


function _26(md){return(
md`## Imports`
)}

function _d3(require){return(
require("d3@6")
)}

async function _transform(){return(
(await import('https://unpkg.com/streaming-iterables?module')).transform
)}

function _base64(require){return(
require("base-64")
)}

function _ip(require){return(
require('https://bundle.run/ip@1.1.5')
)}

function _32(md){return(
md`## Backups`
)}

function _34(backups){return(
backups()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("currentEpoch")).define("currentEpoch", _currentEpoch);
  main.variable(observer("currentEpochDate")).define("currentEpochDate", ["epochToDate","currentEpoch"], _currentEpochDate);
  const child1 = runtime.module(define1);
  main.import("geoIpLookupsBucketUrl", child1);
  main.variable(observer("latestIpsGeoLite2ReportUrl")).define("latestIpsGeoLite2ReportUrl", _latestIpsGeoLite2ReportUrl);
  main.variable(observer("latestIpsGeoLite2Report")).define("latestIpsGeoLite2Report", ["latestIpsGeoLite2ReportUrl"], _latestIpsGeoLite2Report);
  main.variable(observer("chinaIpRecords")).define("chinaIpRecords", ["latestIpsGeoLite2Report"], _chinaIpRecords);
  main.variable(observer("latestIpsBaiduReportUrl")).define("latestIpsBaiduReportUrl", _latestIpsBaiduReportUrl);
  main.variable(observer("latestIpsBaiduReport")).define("latestIpsBaiduReport", ["latestIpsBaiduReportUrl"], _latestIpsBaiduReport);
  main.variable(observer("missingChinaIpRecords")).define("missingChinaIpRecords", ["chinaIpRecords","ip","latestIpsBaiduReport"], _missingChinaIpRecords);
  main.variable(observer("maxLookups")).define("maxLookups", _maxLookups);
  main.variable(observer("maxElapsed")).define("maxElapsed", _maxElapsed);
  main.variable(observer("geoApiBaseUrl")).define("geoApiBaseUrl", _geoApiBaseUrl);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer("geoIpBaiduKey")).define("geoIpBaiduKey", _geoIpBaiduKey);
  main.variable(observer("geoIpBaiduSecret")).define("geoIpBaiduSecret", _geoIpBaiduSecret);
  main.variable(observer("basicAuthToken")).define("basicAuthToken", ["base64","geoIpBaiduKey","geoIpBaiduSecret"], _basicAuthToken);
  const child2 = runtime.module(define2);
  main.import("legacyWorkshopClientBucketUrl", child2);
  main.variable(observer("baiduCities")).define("baiduCities", ["legacyWorkshopClientBucketUrl"], _baiduCities);
  main.variable(observer("viewof start")).define("viewof start", ["Inputs"], _start);
  main.variable(observer("start")).define("start", ["Generators", "viewof start"], (G, _) => G.input(_));
  main.variable(observer("newIps")).define("newIps", ["d3","missingChinaIpRecords","ip"], _newIps);
  main.variable(observer("lookupIpsStream")).define("lookupIpsStream", ["transform","geoApiBaseUrl","basicAuthToken","baiduCities","newIps","maxElapsed","maxLookups"], _lookupIpsStream);
  main.variable(observer("ipsCount")).define("ipsCount", ["newIps"], _ipsCount);
  main.variable(observer("ipsBaidu")).define("ipsBaidu", ["start","lookupIpsStream","ipsCount"], _ipsBaidu);
  main.variable(observer()).define(["md"], _26);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("transform")).define("transform", _transform);
  const child3 = runtime.module(define3);
  main.import("dateToEpoch", child3);
  main.import("epochToDate", child3);
  main.variable(observer("base64")).define("base64", ["require"], _base64);
  main.variable(observer("ip")).define("ip", ["require"], _ip);
  main.variable(observer()).define(["md"], _32);
  const child4 = runtime.module(define4);
  main.import("backups", child4);
  main.import("backupNowButton", child4);
  main.variable(observer()).define(["backups"], _34);
  return main;
}
