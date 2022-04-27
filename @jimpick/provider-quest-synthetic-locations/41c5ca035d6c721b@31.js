// https://observablehq.com/@jimpick/provider-quest-synthetic-locations@31
import define1 from "./c4e4a355c53d2a1a@111.js";

function _1(md){return(
md`# Documentation: Synthetic Locations [Provider.Quest]`
)}

function _2(md){return(
md`We have developed an algorithm to calculate "synthetic locations" for each provider on the Filecoin network.

Many providers have advertised their IP addresses on the network so that they can be reached to make storage deals. We collect those IP addresses and use "IP Geolocation" databases (MaxMind GeoLite2) and additional services such as the Baidu API (for China) to connect those to physical locations -- country, city, longitude, latitude, etc.

However, many of the largest providers are focused on adding capacity to the network in order to gain block rewards, and have not advertised their IP addresses to allow the public to connect to them for deals. Without the IP addresses, it is difficult to know exactly where they are!`
)}

function _3(md){return(
md`## Presentation`
)}

function _4(md){return(
md`* [Filecoin Green - 2022.03.01](https://youtu.be/PyxSRV0UlFc?t=2521)`
)}

function _5(md){return(
md`## Backups`
)}

function _7(backups){return(
backups()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["md"], _5);
  const child1 = runtime.module(define1);
  main.import("backups", child1);
  main.import("backupNowButton", child1);
  main.variable(observer()).define(["backups"], _7);
  return main;
}
