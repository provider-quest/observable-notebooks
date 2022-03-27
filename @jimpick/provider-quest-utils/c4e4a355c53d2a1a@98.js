// https://observablehq.com/@jimpick/provider-quest-utils@98
import define1 from "./1d309dbd9697e042@627.js";

function _1(md){return(
md`# Internal: Utils [Provider.Quest]`
)}

function _2(md){return(
md`Functions for re-use across various Provider.Quest notebooks.`
)}

function _3(sortMiners){return(
['f01234', 'f013456', 'f0101234', 'f02345'].sort(sortMiners)
)}

function _sortMiners(){return(
(a, b) => Number(a.slice(1)) - Number(b.slice(1))
)}

function _5(sortMinerRecords){return(
[{ miner: 'f01234' }, { miner: 'f013456' }, { miner: 'f0101234' }, { miner: 'f02345' }].sort(sortMinerRecords)
)}

function _sortMinerRecords(){return(
({ miner: minerA }, { miner: minerB }) => Number(minerA.slice(1)) - Number(minerB.slice(1))
)}

function _dateFns(require){return(
require('https://bundle.run/date-fns@2.22.1')
)}

function _8(md){return(
md`Fixes for timezone issues when doing date-based math`
)}

function _agnosticAddDays(dateFns){return(
function agnosticAddDays(date, amount) {
  // https://github.com/date-fns/date-fns/issues/571#issuecomment-602496322
  const originalTZO = date.getTimezoneOffset();
  const endDate = dateFns.addDays(date, amount);
  const endTZO = endDate.getTimezoneOffset();

  const dstDiff = originalTZO - endTZO;

  return dstDiff >= 0
    ? dateFns.addMinutes(endDate, dstDiff)
    : dateFns.subMinutes(endDate, Math.abs(dstDiff));
}
)}

function _agnosticDifferenceInDays(dateFns){return(
function agnosticDifferenceInDays(dateLeft, dateRight) {
  // https://date-fns.org/v2.22.1/docs/differenceInDays
  return Math.floor(dateFns.differenceInHours(dateLeft, dateRight)/24)|0
}
)}

function _11(dateFns,d3){return(
dateFns.differenceInDays(d3.isoParse('2021-06-28'), d3.isoParse('2021-06-27'))
)}

function _12(dateFns,d3){return(
dateFns.differenceInDays(d3.isoParse('2021-11-15'), d3.isoParse('2021-06-27'))
)}

function _13(agnosticDifferenceInDays,d3){return(
agnosticDifferenceInDays(d3.isoParse('2021-11-15'), d3.isoParse('2021-06-27'))
)}

function _14(agnosticAddDays,d3){return(
agnosticAddDays(d3.isoParse('2021-06-27'), 141)
)}

function _quickMenu(){return(
`[Provider.Quest](https://observablehq.com/collection/@jimpick/provider-quest)
=> Deals: [Weekly](https://observablehq.com/@jimpick/provider-quest-published-deals-weekly)
· [Daily](https://observablehq.com/@jimpick/provider-quest-published-deals-daily)
· [Hourly](https://observablehq.com/@jimpick/provider-quest-published-deals-hourly)
· [Named Clients](https://observablehq.com/@jimpick/provider-quest-deals-named-clients-hourly)
| [Asks](https://observablehq.com/@jimpick/provider-quest-piece-size-vs-asks)
| [Map](https://observablehq.com/@jimpick/provider-quest-miners-on-a-global-map)
· [Regions](https://observablehq.com/@jimpick/provider-quest-regional-stats)
· [Countries](https://observablehq.com/@jimpick/country-state-province-stats-provider-quest)
· [Sunburst](https://observablehq.com/@jimpick/provider-quest-zoomable-sunburst)
· [Videos](https://observablehq.com/@jimpick/videos-provider-quest)
| [Documentation](https://observablehq.com/@jimpick/provider-quest-documentation)
· [Ideas](https://observablehq.com/@jimpick/ideas-provider-quest)
| [Feeds](https://observablehq.com/@jimpick/provider-quest-feeds)
`
)}

function _16(md,quickMenu){return(
md`${quickMenu}`
)}

function _17(md){return(
md`## GitHub Backups`
)}

function _18(md){return(
md`* https://observablehq.com/@tomlarkworthy/github-backups
* https://github.com/provider-quest/observable-notebooks`
)}

function _backupView(enableGithubBackups){return(
enableGithubBackups({
  owner: "provider-quest",                   // Target Github username/organization
  repo: "observable-notebooks",                // Target Github repo
  allow: ['jimpick'] // [optional] Allowed source observablehq logins
})
)}

function _backups(backupView,md)
{
  backupView;
  return md`Backed up to GitHub at https://github.com/provider-quest/observable-notebooks`
}


function _22(backupNowButton){return(
backupNowButton()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["sortMiners"], _3);
  main.variable(observer("sortMiners")).define("sortMiners", _sortMiners);
  main.variable(observer()).define(["sortMinerRecords"], _5);
  main.variable(observer("sortMinerRecords")).define("sortMinerRecords", _sortMinerRecords);
  main.variable(observer("dateFns")).define("dateFns", ["require"], _dateFns);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer("agnosticAddDays")).define("agnosticAddDays", ["dateFns"], _agnosticAddDays);
  main.variable(observer("agnosticDifferenceInDays")).define("agnosticDifferenceInDays", ["dateFns"], _agnosticDifferenceInDays);
  main.variable(observer()).define(["dateFns","d3"], _11);
  main.variable(observer()).define(["dateFns","d3"], _12);
  main.variable(observer()).define(["agnosticDifferenceInDays","d3"], _13);
  main.variable(observer()).define(["agnosticAddDays","d3"], _14);
  main.variable(observer("quickMenu")).define("quickMenu", _quickMenu);
  main.variable(observer()).define(["md","quickMenu"], _16);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer()).define(["md"], _18);
  const child1 = runtime.module(define1);
  main.import("enableGithubBackups", child1);
  main.import("backupNowButton", child1);
  main.variable(observer("viewof backupView")).define("viewof backupView", ["enableGithubBackups"], _backupView);
  main.variable(observer("backupView")).define("backupView", ["Generators", "viewof backupView"], (G, _) => G.input(_));
  main.variable(observer("backups")).define("backups", ["backupView","md"], _backups);
  main.variable(observer()).define(["backupNowButton"], _22);
  return main;
}
