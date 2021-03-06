// https://observablehq.com/@jimpick/videos-provider-quest@50
import define1 from "./c4e4a355c53d2a1a@111.js";

function _1(md){return(
md`# Videos [Provider.Quest]`
)}

function _2(md,quickMenu){return(
md`${quickMenu}`
)}

function _3(md){return(
md`
## Provider Power Growth
<video controls style="width: 100%" src="https://bafybeicgs6duc5yrk6inbfhosi5r6hbwpijoxurlhvfvt32pr3o7oj7dgy.ipfs.dweb.link/filecoin-orbit-1.mp4"></video>

[Download from IPFS Gateway (70MB)](https://bafybeicgs6duc5yrk6inbfhosi5r6hbwpijoxurlhvfvt32pr3o7oj7dgy.ipfs.dweb.link/filecoin-orbit-1.mp4) | [Download from Pinata (70MB)](https://gateway.pinata.cloud/ipfs/QmT6DG5dtNrzgsJB9LWqfkRd9DgFQY2PmHAauLKeCoEqVP/filecoin-orbit-1.mp4)

Source notebook: [@jimpick/power-history-provider-quest](https://observablehq.com/@jimpick/power-history-provider-quest?collection=@jimpick/provider-quest)
`
)}

function _4(md){return(
md`
## Published Deals
<video controls style="width: 100%" src="https://bafybeiawk5qceaux6443qsp6ggihki25vzojsxcfrhcv3n74yq63oy5cum.ipfs.dweb.link/filecoin-orbit-2.mp4"></video>

[Download from IPFS Gateway (68MB)](https://bafybeiawk5qceaux6443qsp6ggihki25vzojsxcfrhcv3n74yq63oy5cum.ipfs.dweb.link/filecoin-orbit-2.mp4) | [Download from Pinata (68MB)](https://gateway.pinata.cloud/ipfs/QmPqrxJKR4xuUzcjbAB5KnpmdUnoHPGkWs1XqerSWkgPNa/filecoin-orbit-2.mp4)


Source notebook: [@jimpick/deals-trips-provider-quest](https://observablehq.com/@jimpick/deals-trips-provider-quest?collection=@jimpick/provider-quest)
`
)}

function _5(md){return(
md`## Imports`
)}

function _7(md){return(
md`## Backups`
)}

function _9(backups){return(
backups()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md","quickMenu"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["md"], _5);
  const child1 = runtime.module(define1);
  main.import("quickMenu", child1);
  main.variable(observer()).define(["md"], _7);
  const child2 = runtime.module(define1);
  main.import("backups", child2);
  main.import("backupNowButton", child2);
  main.variable(observer()).define(["backups"], _9);
  return main;
}
