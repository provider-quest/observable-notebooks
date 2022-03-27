// https://observablehq.com/@jimpick/provider-quest-legacy-annotations-checker@150
import define1 from "./5cf93b57a7444002@196.js";
import define2 from "./c4e4a355c53d2a1a@111.js";

function _1(md){return(
md`# Legacy: Annotations Checker [Provider.Quest]`
)}

function _2(md){return(
md`Let's do some sanity checks with the data from Provider.Quest compared against the legacy testing system.`
)}

async function _minerPowerLatestReport(minerPowerDailyAverageLatestBucketUrl){return(
(await fetch(`${minerPowerDailyAverageLatestBucketUrl}/miner-power-latest.json`)).json()
)}

function _minTimestamp(dateFns){return(
dateFns.subDays(new Date(), 14)
)}

function _6(minerPowerLatestReport){return(
Object.keys(minerPowerLatestReport.miners)
)}

function _latestPowerMiners(_,minerPowerLatestReport,d3,minTimestamp){return(
_.object(Object.entries(minerPowerLatestReport.miners).map(([key, value]) => [key, {...value, timestamp: d3.isoParse(value.timestamp) }]).filter(([, { timestamp }]) => timestamp >= minTimestamp))
)}

function _8(latestPowerMiners){return(
Object.keys(latestPowerMiners)
)}

async function _minerPowerDailyAverageReport(minerPowerDailyAverageLatestBucketUrl){return(
(await fetch(`${minerPowerDailyAverageLatestBucketUrl}/miner-power-daily-average-latest.json`)).json()
)}

async function _minerPowerMultidayAverageReport(minerPowerMultidayAverageLatestBucketUrl){return(
(await fetch(`${minerPowerMultidayAverageLatestBucketUrl}/miner-power-multiday-average-latest.json`)).json()
)}

function _recentMinerSet(latestPowerMiners,minerPowerDailyAverageReport,minerPowerMultidayAverageReport)
{
  const recentMinerSet = new Set()
  for (const miner of Object.keys(latestPowerMiners)) {
    recentMinerSet.add(miner)
  }
  for (const miner of Object.keys(minerPowerDailyAverageReport.miners)) {
    recentMinerSet.add(miner)
  }
  for (const miner of Object.keys(minerPowerMultidayAverageReport.miners)) {
    recentMinerSet.add(miner)
  }
  return recentMinerSet
}


function _14(legacyAnnotationsMainnet){return(
legacyAnnotationsMainnet
)}

function _notAnnotatedMiners(recentMinerSet,sortMiners,legacyAnnotationsMainnet)
{
  const miners = []
  for (const miner of [...recentMinerSet].sort(sortMiners)) {
    if (!legacyAnnotationsMainnet[miner]) miners.push(miner)
  }
  return miners
}


function _16(md){return(
md`## New`
)}

function _17(notAnnotatedMiners){return(
'\n' + notAnnotatedMiners.map(miner => `${miner}: 'new, autolisted'`).join(',\n') + ',\n'
)}

function _annotatedMinersWithNoPower(legacyAnnotationsMainnet,sortMiners,latestPowerMiners,minerPowerDailyAverageReport,minerPowerMultidayAverageReport)
{
  const results = []
  for (const miner of Object.keys(legacyAnnotationsMainnet).sort(sortMiners)) {
    const latest = latestPowerMiners[miner]
    const daily = minerPowerDailyAverageReport.miners[miner]
    const multiday = minerPowerMultidayAverageReport.miners[miner]
    if (
      !(
        (latest && latest.qualityAdjPower) || (latest && latest.rawBytePower) ||
        (daily && daily.qualityAdjPower) || (daily && daily.rawBytePower) ||
        (multiday && multiday.qualityAdjPower) || (multiday && multiday.rawBytePower)
      )
    ) {
      results.push([
        miner,
        legacyAnnotationsMainnet[miner]
      ])
    }
  }
  return results
}


function _19(md){return(
md`## Delist`
)}

function _notDelistedAndNoPower(annotatedMinersWithNoPower){return(
annotatedMinersWithNoPower.filter(([miner, annotation]) => !annotation.startsWith('delist'))
)}

function _21(Inputs,notDelistedAndNoPower){return(
Inputs.table(notDelistedAndNoPower.map(([provider, annotation]) => ({ provider, annotation })))
)}

function _annotatedMinersWithPower(legacyAnnotationsMainnet,sortMiners,minerPowerDailyAverageReport,minerPowerMultidayAverageReport)
{
  const results = []
  for (const miner of Object.keys(legacyAnnotationsMainnet).sort(sortMiners)) {
    const daily = minerPowerDailyAverageReport.miners[miner]
    const multiday = minerPowerMultidayAverageReport.miners[miner]
    if (
      ((daily && daily.qualityAdjPower) || (daily && daily.rawBytePower) ||
      (multiday && multiday.qualityAdjPower) || (multiday && multiday.rawBytePower))
    ) {
      results.push([
        miner,
        legacyAnnotationsMainnet[miner]
      ])
    }
  }
  return results
}


function _23(md){return(
md`## Retest`
)}

function _delistedAndPower(annotatedMinersWithPower){return(
annotatedMinersWithPower.filter(([miner, annotation]) => annotation.startsWith('delist'))
)}

function _25(Inputs,delistedAndPower){return(
Inputs.table(delistedAndPower.map(([provider, annotation]) => ({ provider, annotation })))
)}

function _sortMiners(){return(
function (a, b) { return Number(a.slice(1)) - Number(b.slice(1)) }
)}

function _dateFns(require){return(
require('https://bundle.run/date-fns@2.22.1')
)}

async function __(){return(
(await import("https://unpkg.com/underscore@1.13.1/modules/index-all.js")).default
)}

function _29(md){return(
md`## Backups`
)}

function _31(backups){return(
backups()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  const child1 = runtime.module(define1);
  main.import("minerPowerDailyAverageLatestBucketUrl", child1);
  main.variable(observer("minerPowerLatestReport")).define("minerPowerLatestReport", ["minerPowerDailyAverageLatestBucketUrl"], _minerPowerLatestReport);
  main.variable(observer("minTimestamp")).define("minTimestamp", ["dateFns"], _minTimestamp);
  main.variable(observer()).define(["minerPowerLatestReport"], _6);
  main.variable(observer("latestPowerMiners")).define("latestPowerMiners", ["_","minerPowerLatestReport","d3","minTimestamp"], _latestPowerMiners);
  main.variable(observer()).define(["latestPowerMiners"], _8);
  main.variable(observer("minerPowerDailyAverageReport")).define("minerPowerDailyAverageReport", ["minerPowerDailyAverageLatestBucketUrl"], _minerPowerDailyAverageReport);
  const child2 = runtime.module(define1);
  main.import("minerPowerMultidayAverageLatestBucketUrl", child2);
  main.variable(observer("minerPowerMultidayAverageReport")).define("minerPowerMultidayAverageReport", ["minerPowerMultidayAverageLatestBucketUrl"], _minerPowerMultidayAverageReport);
  main.variable(observer("recentMinerSet")).define("recentMinerSet", ["latestPowerMiners","minerPowerDailyAverageReport","minerPowerMultidayAverageReport"], _recentMinerSet);
  const child3 = runtime.module(define1);
  main.import("legacyAnnotationsMainnet", child3);
  main.variable(observer()).define(["legacyAnnotationsMainnet"], _14);
  main.variable(observer("notAnnotatedMiners")).define("notAnnotatedMiners", ["recentMinerSet","sortMiners","legacyAnnotationsMainnet"], _notAnnotatedMiners);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer()).define(["notAnnotatedMiners"], _17);
  main.variable(observer("annotatedMinersWithNoPower")).define("annotatedMinersWithNoPower", ["legacyAnnotationsMainnet","sortMiners","latestPowerMiners","minerPowerDailyAverageReport","minerPowerMultidayAverageReport"], _annotatedMinersWithNoPower);
  main.variable(observer()).define(["md"], _19);
  main.variable(observer("notDelistedAndNoPower")).define("notDelistedAndNoPower", ["annotatedMinersWithNoPower"], _notDelistedAndNoPower);
  main.variable(observer()).define(["Inputs","notDelistedAndNoPower"], _21);
  main.variable(observer("annotatedMinersWithPower")).define("annotatedMinersWithPower", ["legacyAnnotationsMainnet","sortMiners","minerPowerDailyAverageReport","minerPowerMultidayAverageReport"], _annotatedMinersWithPower);
  main.variable(observer()).define(["md"], _23);
  main.variable(observer("delistedAndPower")).define("delistedAndPower", ["annotatedMinersWithPower"], _delistedAndPower);
  main.variable(observer()).define(["Inputs","delistedAndPower"], _25);
  main.variable(observer("sortMiners")).define("sortMiners", _sortMiners);
  main.variable(observer("dateFns")).define("dateFns", ["require"], _dateFns);
  main.variable(observer("_")).define("_", __);
  main.variable(observer()).define(["md"], _29);
  const child4 = runtime.module(define2);
  main.import("backups", child4);
  main.import("backupNowButton", child4);
  main.variable(observer()).define(["backups"], _31);
  return main;
}
