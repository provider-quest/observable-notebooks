// https://observablehq.com/@jimpick/provider-quest-baidu-ip-geo-lookups@153
import define1 from "./5cf93b57a7444002@222.js";
import define2 from "./5cf93b57a7444002@222.js";
import define3 from "./a957eb792b00ff81@406.js";
import define4 from "./c4e4a355c53d2a1a@111.js";

function _1(md){return(
md`# Internal: Scanner: Baidu IP Geo Lookups [Provider.Quest]`
)}

function _currentEpoch(dateToEpoch){return(
dateToEpoch(new Date())
)}

function _currentEpochDate(epochToDate,currentEpoch){return(
epochToDate(currentEpoch).toISOString()
)}

async function _latestIpsGeoLite2Report(geoIpLookupsBucketUrl){return(
(await fetch(`${geoIpLookupsBucketUrl}/ips-geolite2-latest.json`)).json()
)}

function _chinaIpRecords(latestIpsGeoLite2Report){return(
Object.entries(latestIpsGeoLite2Report.ipsGeoLite2).map(([ip, record]) => ({ ip, ...record })).filter(({ country }) => country === 'CN')
)}

async function _latestIpsBaiduReport(geoIpLookupsBucketUrl){return(
(await fetch(`${geoIpLookupsBucketUrl}/ips-baidu-latest.json`)).json()
)}

function _missingChinaIpRecords(chinaIpRecords,ip,latestIpsBaiduReport){return(
chinaIpRecords.filter(({ ip: ipAddress }) => {
  if (!ip.isV4Format(ipAddress)) {
    return false 
  }
  const baidu = latestIpsBaiduReport.ipsBaidu[ipAddress]
  if (baidu) {
    if (baidu.baidu && baidu.baidu.status !== 0) {
      return true
    }
    return false 
  }
  return true
})
)}

function _maxLookups(){return(
3
)}

function _maxElapsed(){return(
1 * 60 * 1000
)}

function _geoApiBaseUrl(){return(
'https://geoip.miner.report/api/geoip'
)}

function _12(md){return(
md`We use ObservableHQ "Secrets" and HTTP Basic Auth to prevent the public from misusing the private Baidu lookup API.`
)}

function _geoIpBaiduKey(){return(
''
)}

function _geoIpBaiduSecret(){return(
''
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


function _24(md){return(
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

function _30(md){return(
md`## Backups`
)}

function _32(backups){return(
backups()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("currentEpoch")).define("currentEpoch", ["dateToEpoch"], _currentEpoch);
  main.variable(observer("currentEpochDate")).define("currentEpochDate", ["epochToDate","currentEpoch"], _currentEpochDate);
  const child1 = runtime.module(define1);
  main.import("geoIpLookupsBucketUrl", child1);
  main.variable(observer("latestIpsGeoLite2Report")).define("latestIpsGeoLite2Report", ["geoIpLookupsBucketUrl"], _latestIpsGeoLite2Report);
  main.variable(observer("chinaIpRecords")).define("chinaIpRecords", ["latestIpsGeoLite2Report"], _chinaIpRecords);
  main.variable(observer("latestIpsBaiduReport")).define("latestIpsBaiduReport", ["geoIpLookupsBucketUrl"], _latestIpsBaiduReport);
  main.variable(observer("missingChinaIpRecords")).define("missingChinaIpRecords", ["chinaIpRecords","ip","latestIpsBaiduReport"], _missingChinaIpRecords);
  main.variable(observer("maxLookups")).define("maxLookups", _maxLookups);
  main.variable(observer("maxElapsed")).define("maxElapsed", _maxElapsed);
  main.variable(observer("geoApiBaseUrl")).define("geoApiBaseUrl", _geoApiBaseUrl);
  main.variable(observer()).define(["md"], _12);
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
  main.variable(observer()).define(["md"], _24);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("transform")).define("transform", _transform);
  const child3 = runtime.module(define3);
  main.import("dateToEpoch", child3);
  main.import("epochToDate", child3);
  main.variable(observer("base64")).define("base64", ["require"], _base64);
  main.variable(observer("ip")).define("ip", ["require"], _ip);
  main.variable(observer()).define(["md"], _30);
  const child4 = runtime.module(define4);
  main.import("backups", child4);
  main.import("backupNowButton", child4);
  main.variable(observer()).define(["backups"], _32);
  return main;
}
