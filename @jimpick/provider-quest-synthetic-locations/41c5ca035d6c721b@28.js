// https://observablehq.com/@jimpick/provider-quest-synthetic-locations@28
import define1 from "./c4e4a355c53d2a1a@111.js";

function _1(md){return(
md`# Documentation: Synthetic Locations [Provider.Quest]`
)}

function _2(md){return(
md`## Presentation`
)}

function _3(md){return(
md`* [Filecoin Green - 2022.03.01](https://youtu.be/PyxSRV0UlFc?t=2521)`
)}

function _4(md){return(
md`## Backups`
)}

function _6(backups){return(
backups()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  const child1 = runtime.module(define1);
  main.import("backups", child1);
  main.import("backupNowButton", child1);
  main.variable(observer()).define(["backups"], _6);
  return main;
}
