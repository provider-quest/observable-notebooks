// https://observablehq.com/@jbenet/filecoin-chain-time-calculator@406
function _1(md){return(
md`# Filecoin Chain Time Calculator`
)}

function _input(form,html,dateToEpoch){return(
form(html`
<form>
  <input type="text" name="input" value="${dateToEpoch(Date.now())}" 
   style="font-size: 24px; padding: 10px; width: 500px;" /> <br />
  <label><i>Enter a Filecoin Epoch or Timestamp</i></label>
</form>
`)
)}

function _parsed(parseInput,input){return(
parseInput(input.input)
)}

function _dates(genZones,parsed){return(
genZones(parsed)
)}

function _5(Table,dates){return(
Table(dates, {})
)}

function _6(md){return(
md`### Constants`
)}

function _filecoinNetworkStartTime(){return(
new Date("2020-08-24T22:00:00Z")
)}

function _blockTimeSec(){return(
30
)}

function _9(md){return(
md`### Functions`
)}

function _dateToString(){return(
function dateToString(date) {
  return new Date(date).toISOString()
}
)}

function _dateToEpoch(filecoinNetworkStartTime,blockTimeSec){return(
function dateToEpoch(date) {
  var diff_ms = (date - filecoinNetworkStartTime)
  if (diff_ms < 0) {
    throw new Error("date must be greater than filecoinNetworkStartTime")
  }
  
  var diff_s = Math.floor(Math.abs(diff_ms) / 1000)
  var epoch = Math.floor(diff_s / blockTimeSec)
  return epoch
}
)}

function _epochToDate(blockTimeSec,filecoinNetworkStartTime){return(
function epochToDate(epoch) {
  var diff_s = blockTimeSec * epoch
  var diff_ms = diff_s * 1000
  var date = new Date(filecoinNetworkStartTime.getTime() + diff_ms)
  return date
}
)}

function _parseInput(moment,dateToEpoch,epochToDate){return(
function parseInput(input) {
  console.log('input:', input)
  
  var intStr = input.replaceAll(",", "")
  var e = parseInt(intStr, 10)
  if (("" + e) != intStr) { 
    // maybe it's a date
    var d = moment(input).toDate()
    e = dateToEpoch(d)
  }
  
  // convert back to date always, to get the right seconds for the epoch.
  return { epoch: e, date: epochToDate(e) }
}
)}

function _genZones(moment){return(
function genZones(parsed) {
  var d = parsed.date
  
  var f = 'YYYY-MM-DD HH:mm:ss'
  var fmt = (d, tz) => moment(d).tz(tz).format(f)
  var o = (a, b) => ({'Zone': a, 'Time': b })
  
  return [
    o('Filecoin Epoch', parsed.epoch),
    o('local',      moment(d).format(f)),
    o('', ''),
    o('PST / PDT',  fmt(d, "America/Los_Angeles")),
    o('EST / EDT',  fmt(d, "America/New_York")),
    o('UTC',        moment(d).utc().format(f)),
    o('CET / CEST', fmt(d, "Europe/Berlin")),
    o('CST',        fmt(d, "Asia/Shanghai")),
  ]
}
)}

function _16(md){return(
md`### Imports`
)}

function _moment(require){return(
require('moment')
)}

function _moment_timezone(require){return(
require('https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.21/moment-timezone-with-data.min.js')
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.define("module 1", async () => runtime.module((await import("./8d271c22db968ab0@160.js")).default));
  main.define("module 2", async () => runtime.module((await import("./851cd068c9c12ade@886.js")).default));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof input")).define("viewof input", ["form","html","dateToEpoch"], _input);
  main.variable(observer("input")).define("input", ["Generators", "viewof input"], (G, _) => G.input(_));
  main.variable(observer("parsed")).define("parsed", ["parseInput","input"], _parsed);
  main.variable(observer("dates")).define("dates", ["genZones","parsed"], _dates);
  main.variable(observer()).define(["Table","dates"], _5);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("filecoinNetworkStartTime")).define("filecoinNetworkStartTime", _filecoinNetworkStartTime);
  main.variable(observer("blockTimeSec")).define("blockTimeSec", _blockTimeSec);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer("dateToString")).define("dateToString", _dateToString);
  main.variable(observer("dateToEpoch")).define("dateToEpoch", ["filecoinNetworkStartTime","blockTimeSec"], _dateToEpoch);
  main.variable(observer("epochToDate")).define("epochToDate", ["blockTimeSec","filecoinNetworkStartTime"], _epochToDate);
  main.variable(observer("parseInput")).define("parseInput", ["moment","dateToEpoch","epochToDate"], _parseInput);
  main.variable(observer("genZones")).define("genZones", ["moment"], _genZones);
  main.variable(observer()).define(["md"], _16);
  main.define("form", ["module 1", "@variable"], (_, v) => v.import("form", _));
  main.define("Table", ["module 2", "@variable"], (_, v) => v.import("Table", _));
  main.variable(observer("moment")).define("moment", ["require"], _moment);
  main.variable(observer("moment_timezone")).define("moment_timezone", ["require"], _moment_timezone);
  return main;
}
