// https://observablehq.com/@jimpick/provider-quest-maxmind-geolite2-lookups@123
import define1 from "./5cf93b57a7444002@196.js";
import define2 from "./a957eb792b00ff81@406.js";
import define3 from "./c4e4a355c53d2a1a@111.js";

function _1(md){return(
md`# Internal: Scanner: Maxmind GeoLite2 Lookups [Provider.Quest]`
)}

function _2(md){return(
md`This notebook performs geo-ip lookups for IPs associated with Filecoin storage providers. It makes API calls against a [simple Node.js server](https://github.com/jimpick/workshop-client-mainnet/tree/main/geoip-server) which has a copy of the [MaxMind GeoLite2](https://dev.maxmind.com/geoip/geolite2-free-geolocation-data?lang=en) database.`
)}

function _currentEpoch(dateToEpoch){return(
dateToEpoch(new Date())
)}

function _currentEpochDate(epochToDate,currentEpoch){return(
epochToDate(currentEpoch).toISOString()
)}

async function _multiaddrsIpsReport(multiaddrsIpsLatestBucketUrl){return(
(await fetch(`${multiaddrsIpsLatestBucketUrl}/multiaddrs-ips-latest.json`)).json()
)}

function _minTimestamp(dateFns){return(
dateFns.subDays(new Date(), 7)
)}

async function _latestIpsGeoLite2Report(geoIpLookupsBucketUrl){return(
(await fetch(`${geoIpLookupsBucketUrl}/ips-geolite2-latest.json`)).json()
)}

function _ips(multiaddrsIpsReport,d3,minTimestamp)
{
  const ips = new Set()
  for (const record of multiaddrsIpsReport.multiaddrsIps) {
    if (d3.isoParse(record.timestamp) > minTimestamp) {
      ips.add(record.ip)
    }
  }
  return ips
}


function _newIps(ips,latestIpsGeoLite2Report)
{
  const newIps = new Set()
  for (const ip of [...ips]) {
    if (!latestIpsGeoLite2Report.ipsGeoLite2[ip]) {
      newIps.add(ip)
    }
  }
  return newIps
}


function _start(Inputs){return(
Inputs.button("Start")
)}

function _maxElapsed(){return(
3 * 60 * 1000
)}

function _geoApiBaseUrl(){return(
'https://geoip.miner.report/api/geoip'
)}

function _lookupIpsStream(transform,geoApiBaseUrl,newIps,maxElapsed){return(
async function* lookupIpsStream() {
  const concurrency = 15
  const callGeoLookupsStream = transform(concurrency, async ip => {
    try {
      const geoLookup = await (await fetch(`${geoApiBaseUrl}/geolite2/${ip}`)).json()

      return {
        ip,
        continent: geoLookup.continent ? geoLookup.continent.code : null,
        country: geoLookup.country ? geoLookup.country.isoCode : null,
        subdiv1: geoLookup.subdivisions && geoLookup.subdivisions.length > 0 ? geoLookup.subdivisions[0].isoCode : null,
        city: geoLookup.city && geoLookup.city.names ? geoLookup.city.names.en : null,
        long: geoLookup.location ? geoLookup.location.longitude : null,
        lat: geoLookup.location ? geoLookup.location.latitude : null,
        geolite2: geoLookup
      }
    } catch (e) {
      console.info('IP lookup error', ip, e.message)
      return {}
    }
  })
  const startTime = new Date()
  let counter = 0
  let hits = 0
  let errors = 0
  for await (const geoLookup of callGeoLookupsStream([...newIps])) {
    const now = new Date()
    if (now - startTime > maxElapsed) {
      yield {
        done: true,
        timeout: true,
        counter,
        hits,
        errors
      }
      return
    }
    if (geoLookup.ip) {
      hits++
      yield {
        counter,
        hits,
        errors,
        ...geoLookup
      }
    } else {
      errors++
      yield {
        counter,
        hits,
        errors,
      }
    }
    counter++
  }
  yield {
    done: true,
    counter,
    hits,
    errors
  }
}
)}

function _ipsCount(newIps){return(
newIps.size
)}

async function* _ipsGeoLite2(start,lookupIpsStream,ipsCount)
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
  const startTime = new Date()
  for await (const {counter, hits, errors, ...record} of lookupIpsStream()) {
    totalErrors = errors
    lastCounter = counter
    if (record.ip) {
      records.push(record)
    }
    yield {
      state: "streaming",
      elapsed: ((new Date()) - startTime) / 1000,
      scannedIps: counter,
      totalIps: ipsCount,
      recordsLength: records.length,
      errors
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
    errors: totalErrors
  }
}


function _19(md){return(
md`## License

Apache 2.0

This product includes GeoLite2 data created by MaxMind, available from <a href="https://www.maxmind.com">https://www.maxmind.com</a>.
`
)}

function _20(md){return(
md`## Imports`
)}

function _d3(require){return(
require("d3@6")
)}

function _dateFns(require){return(
require('https://bundle.run/date-fns@2.22.1')
)}

async function _transform(){return(
(await import('https://unpkg.com/streaming-iterables?module')).transform
)}

function _25(md){return(
md`## Backups`
)}

function _27(backups){return(
backups()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("currentEpoch")).define("currentEpoch", ["dateToEpoch"], _currentEpoch);
  main.variable(observer("currentEpochDate")).define("currentEpochDate", ["epochToDate","currentEpoch"], _currentEpochDate);
  const child1 = runtime.module(define1);
  main.import("multiaddrsIpsLatestBucketUrl", child1);
  main.variable(observer("multiaddrsIpsReport")).define("multiaddrsIpsReport", ["multiaddrsIpsLatestBucketUrl"], _multiaddrsIpsReport);
  main.variable(observer("minTimestamp")).define("minTimestamp", ["dateFns"], _minTimestamp);
  const child2 = runtime.module(define1);
  main.import("geoIpLookupsBucketUrl", child2);
  main.variable(observer("latestIpsGeoLite2Report")).define("latestIpsGeoLite2Report", ["geoIpLookupsBucketUrl"], _latestIpsGeoLite2Report);
  main.variable(observer("ips")).define("ips", ["multiaddrsIpsReport","d3","minTimestamp"], _ips);
  main.variable(observer("newIps")).define("newIps", ["ips","latestIpsGeoLite2Report"], _newIps);
  main.variable(observer("viewof start")).define("viewof start", ["Inputs"], _start);
  main.variable(observer("start")).define("start", ["Generators", "viewof start"], (G, _) => G.input(_));
  main.variable(observer("maxElapsed")).define("maxElapsed", _maxElapsed);
  main.variable(observer("geoApiBaseUrl")).define("geoApiBaseUrl", _geoApiBaseUrl);
  main.variable(observer("lookupIpsStream")).define("lookupIpsStream", ["transform","geoApiBaseUrl","newIps","maxElapsed"], _lookupIpsStream);
  main.variable(observer("ipsCount")).define("ipsCount", ["newIps"], _ipsCount);
  main.variable(observer("ipsGeoLite2")).define("ipsGeoLite2", ["start","lookupIpsStream","ipsCount"], _ipsGeoLite2);
  main.variable(observer()).define(["md"], _19);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("dateFns")).define("dateFns", ["require"], _dateFns);
  main.variable(observer("transform")).define("transform", _transform);
  const child3 = runtime.module(define2);
  main.import("dateToEpoch", child3);
  main.import("epochToDate", child3);
  main.variable(observer()).define(["md"], _25);
  const child4 = runtime.module(define3);
  main.import("backups", child4);
  main.import("backupNowButton", child4);
  main.variable(observer()).define(["backups"], _27);
  return main;
}
