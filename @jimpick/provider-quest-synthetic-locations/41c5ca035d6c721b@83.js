// https://observablehq.com/@jimpick/provider-quest-synthetic-locations@83
import define1 from "./c4e4a355c53d2a1a@111.js";

function _1(md){return(
md`# Documentation: Synthetic Locations [Provider.Quest]`
)}

function _2(md){return(
md`We have developed an algorithm to calculate "synthetic locations" for each provider on the Filecoin network.

Many providers have advertised their IP addresses on the network so that clients can connect to them via a peer-to-peer protocol to make storage deals. We collect those IP addresses and use "IP Geolocation" databases (eg. [MaxMind GeoLite2](https://dev.maxmind.com/geoip/geolite2-free-geolocation-data?lang=en)) and additional services such as the [Baidu API](https://lbsyun.baidu.com/index.php?title=webapi/ip-api) (for China) to find the associated physical locations -- country, city, longitude, latitude, etc.

Since many of the largest providers are solely focused on adding capacity to the network in order to gain block rewards, they have chosen not to advertise their IP addresses. These providers are not currently allowing the public to connect to them for deals. In the future, they may choose to make their capacity available for deals. Without the IP addresses, it is difficult to know exactly where they are!`
)}

function _3(md){return(
md`For each of these providers without IP-based location date, we are now calculating "Synthetic Locations" which assign them to possible locations using clues from the blockchain data, proportions and probabilities.`
)}

function _4(md){return(
md`These "synthetic locations" are essentially "educated guesses". For providers with no IP information, on an individual basis, they may be completely wrong. But for aggregated reporting across a large number of providers, they should reflect the true nature of the network with a useful degree of accuracy.`
)}

function _5(md){return(
md`## Observed Locations vs. Synthetic Locations`
)}

function _6(md){return(
md`Why do we want synthetic locations?

They are very useful when we want to do reporting against geographic regions.

For example, here is a snapshot of the Provider.Quest [Sunburst visualization](https://observablehq.com/@jimpick/provider-quest-zoomable-sunburst?datasource=Quality%20Adjusted%20Power&date=2022-04-26&chartfocus=&synthetic=false) using only observed location data (from 2022-04-26):`
)}

function _7(FileAttachment){return(
FileAttachment("observed.png").image()
)}

function _8(md){return(
md`As you can see, roughly two-thirds of the proven storage on the network is associated with providers for which we have observed no IP address information. Using only IP information, we don't know where they are, so we assign them to "No Region".`
)}

function _9(md){return(
md`If we use the synthetic location data for the [Sunburst visualization](https://observablehq.com/@jimpick/provider-quest-zoomable-sunburst?datasource=Quality%20Adjusted%20Power&date=2022-04-25&chartfocus=&synthetic=true) instead, we have a more realistic picture:`
)}

function _10(FileAttachment){return(
FileAttachment("synthetic.png").image()
)}

function _11(md){return(
md`In the real world, every provider is physically located somewhere, so this data is a better fit, even though we can't claim with perfect confidence that the allocation is 100% accurate.`
)}

function _12(md){return(
md`## Presentation`
)}

function _13(md){return(
md`* [Filecoin Green - 2022.03.01](https://youtu.be/PyxSRV0UlFc?t=2521)`
)}

function _14(md){return(
md`## Backups`
)}

function _16(backups){return(
backups()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["observed.png", {url: new URL("./files/30b14480498602b2fe0b464432b17d1d8735e6676200c99e288a10cedb27df2b5c6727009ba1d0491cbc4124f7e48a05affb3184ef67ca9e4d20329266857f31", import.meta.url), mimeType: "image/png", toString}],
    ["synthetic.png", {url: new URL("./files/78c9b6083303b64c50fae9f56b3dc1de36f5bf2d7a6401ab59531a2b6ce24752d84bcc89ff11493cd08f9b00348d5ddbbcef9ef91b97235f8345d26ec97cbf8c", import.meta.url), mimeType: "image/png", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["FileAttachment"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer()).define(["FileAttachment"], _10);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer()).define(["md"], _13);
  main.variable(observer()).define(["md"], _14);
  const child1 = runtime.module(define1);
  main.import("backups", child1);
  main.import("backupNowButton", child1);
  main.variable(observer()).define(["backups"], _16);
  return main;
}
