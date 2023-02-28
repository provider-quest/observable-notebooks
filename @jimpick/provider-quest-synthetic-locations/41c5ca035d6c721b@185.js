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
md`**Note:** *There are still some providers with "No Region" in this screenshot. These are just new providers and there is a temporary data interruption so we lack some data.*`
)}

function _12(md){return(
md`In the real world, every provider is physically located somewhere, so this data is a better fit, even though we can't claim with perfect confidence that the allocation is 100% accurate.`
)}

function _13(md){return(
md`## How do we collect IP addresses and get locations?`
)}

function _14(md){return(
md`FIXME:

* Describe on-chain multiaddrs vs. DHT
* GeoIP database lookups
* Problem with stale or fake IP listings`
)}

function _15(md){return(
md`## Insight: Using Funding History`
)}

function _16(md){return(
md`FIXME:

* Forensic method
* Miner creation requires funds
* Tracing initial fund transfers
* Lily/Sentinel
* Building a "funding tree"`
)}

function _17(md){return(
md`## Delegate Matching Algorithm`
)}

function _18(md){return(
md`FIXME: 

* Funding Tree
* Decorate leaves with IP location data
* Power data
* Backtracking
* Consistent hashing
* Delegates`
)}

function _19(md){return(
md`## Region Mapping`
)}

function _20(md){return(
md`FIXME:

* multiple hierarchies
  * regions used by Sunburst
  * Country + State/Province used by Filecoin Green`
)}

function _21(md){return(
md`## Feeds and Schemas`
)}

function _22(md){return(
md`* Work-in-progress. Transitioning to new distribution mechanism.`
)}

function _23(md){return(
md`Schema notes: In the \`synthetic-*.json\` files, we use the observable location/region if that is available, otherwise, we compute a "delegate" that copies the location/region data from another provider according to the algorithm. So any provider that is using synthetic location/regions will have a "delegate" record.`
)}

function _24(md){return(
md`* AWS S3 Bucket:
  * Top level URL: https://provider-quest.s3.us-west-2.amazonaws.com/dist/geoip-lookups
  * Temporary solution to problem with Textile buckets + Cloudflare
  * This will be deprecated once self-hosted solution is ready
  * Published JSON files (updated regularly):
    * Observed Regions/Locations
      * "Sunburst" hierarchy 
        * [miner-region-latest.json](https://provider-quest.s3.us-west-2.amazonaws.com/dist/geoip-lookups/miner-regions-latest.json) (only Regions, for reporting)
        * [miner-locations-latest.json](https://provider-quest.s3.us-west-2.amazonaws.com/dist/geoip-lookups/miner-locations-latest.json) (with Longitude/Latitude, for mapping)
      * "Country + State/Province" hierarchy 
        * [provider-country-state-province-latest.json](https://provider-quest.s3.us-west-2.amazonaws.com/dist/geoip-lookups/provider-country-state-province-latest.json) (only Regions, for reporting)
        * [provider-country-state-province-locations-latest.json](https://provider-quest.s3.us-west-2.amazonaws.com/dist/geoip-lookups/provider-country-state-province-locations-latest.json) (with Longitude/Latitude, for mapping)
    * Synthetic Regions/Locations
      * "Sunburst" hierarchy
        * [synthetic-regions-latest.json](https://provider-quest.s3.us-west-2.amazonaws.com/dist/geoip-lookups/synthetic-regions-latest.json) (only Regions, for reporting)
        * [synthetic-locations-latest.json](https://provider-quest.s3.us-west-2.amazonaws.com/dist/geoip-lookups/synthetic-locations-latest.json) (with Longitude/Latitude, for mapping)
      * "Country + State/Province" hierarchy
        * [synthetic-country-state-province-latest.json](https://provider-quest.s3.us-west-2.amazonaws.com/dist/geoip-lookups/synthetic-country-state-province-latest.json) (only Regions, for reporting)
        * [synthetic-country-state-province-locations-latest.json](https://provider-quest.s3.us-west-2.amazonaws.com/dist/geoip-lookups/synthetic-country-state-province-locations-latest.json) (with Longitude/Latitude, for mapping)
* Textile Bucket:
  * Top level URL: https://hub.textile.io/thread/bafkwblbznyqkmqx5l677z3kjsslhxo2vbbqh6wluunvvdbmqattrdya/buckets/bafzbeibjg7kky45npdwnogui5ffla7dint62xpttvvlzrsbewlrfmbusya
  * We were using this initially. Auto-publishes to IPFS. Public gateway added Cloudflare protection due to abuse, but that broke using it as a data source via XHR from web pages. Using S3 as an interim fix.
  * This will be deprecated once self-hosted solution is ready
  * Published JSON files (updated regularly):
    * Observed Regions/Locations
      * "Sunburst" hierarchy 
        * [miner-region-latest.json](https://hub.textile.io/thread/bafkwblbznyqkmqx5l677z3kjsslhxo2vbbqh6wluunvvdbmqattrdya/buckets/bafzbeibjg7kky45npdwnogui5ffla7dint62xpttvvlzrsbewlrfmbusya/miner-regions-latest.json) (only Regions, for reporting)
        * [miner-locations-latest.json](https://hub.textile.io/thread/bafkwblbznyqkmqx5l677z3kjsslhxo2vbbqh6wluunvvdbmqattrdya/buckets/bafzbeibjg7kky45npdwnogui5ffla7dint62xpttvvlzrsbewlrfmbusya/miner-locations-latest.json) (with Longitude/Latitude, for mapping)
      * "Country + State/Province" hierarchy 
        * [provider-country-state-province-latest.json](https://hub.textile.io/thread/bafkwblbznyqkmqx5l677z3kjsslhxo2vbbqh6wluunvvdbmqattrdya/buckets/bafzbeibjg7kky45npdwnogui5ffla7dint62xpttvvlzrsbewlrfmbusya/provider-country-state-province-latest.json) (only Regions, for reporting)
        * [provider-country-state-province-locations-latest.json](https://hub.textile.io/thread/bafkwblbznyqkmqx5l677z3kjsslhxo2vbbqh6wluunvvdbmqattrdya/buckets/bafzbeibjg7kky45npdwnogui5ffla7dint62xpttvvlzrsbewlrfmbusya/provider-country-state-province-locations-latest.json) (with Longitude/Latitude, for mapping)
    * Synthetic Regions/Locations
      * "Sunburst" hierarchy
        * [synthetic-regions-latest.json](https://hub.textile.io/thread/bafkwblbznyqkmqx5l677z3kjsslhxo2vbbqh6wluunvvdbmqattrdya/buckets/bafzbeibjg7kky45npdwnogui5ffla7dint62xpttvvlzrsbewlrfmbusya/synthetic-regions-latest.json) (only Regions, for reporting)
        * [synthetic-locations-latest.json](https://hub.textile.io/thread/bafkwblbznyqkmqx5l677z3kjsslhxo2vbbqh6wluunvvdbmqattrdya/buckets/bafzbeibjg7kky45npdwnogui5ffla7dint62xpttvvlzrsbewlrfmbusya/synthetic-locations-latest.json) (with Longitude/Latitude, for mapping)
      * "Country + State/Province" hierarchy
        * [synthetic-country-state-province-latest.json](https://hub.textile.io/thread/bafkwblbznyqkmqx5l677z3kjsslhxo2vbbqh6wluunvvdbmqattrdya/buckets/bafzbeibjg7kky45npdwnogui5ffla7dint62xpttvvlzrsbewlrfmbusya/synthetic-country-state-province-latest.json) (only Regions, for reporting)
        * [synthetic-country-state-province-locations-latest.json](https://hub.textile.io/thread/bafkwblbznyqkmqx5l677z3kjsslhxo2vbbqh6wluunvvdbmqattrdya/buckets/bafzbeibjg7kky45npdwnogui5ffla7dint62xpttvvlzrsbewlrfmbusya/synthetic-country-state-province-locations-latest.json) (with Longitude/Latitude, for mapping)

* FIXME: Hierarchy JSON files
* FIXME: Schema descriptions
* Soon ... self-hosted IPFS with gateways + Estuary backups
* Future
  * Original observation data + intermediate data dumps
  * Publish to Pando?
`
)}

function _25(md){return(
md`## Behind the Scenes`
)}

function _26(md){return(
md`FIXME:

* GitHub repos
* Scanning from Observable notebooks
* Lotus node / Lily data dumps
* Kubernetes
* Argo Workflows
* Apache Spark
* IPFS publishing`
)}

function _27(md){return(
md`## Presentations`
)}

function _28(md){return(
md`Filecoin Green Virtual Meetup - March 2022:`
)}

function _29(htl){return(
htl.html`<iframe width="1180" height="484" src="https://www.youtube.com/embed/PyxSRV0UlFc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
)}

function _30(md){return(
md`## Backups`
)}

function _32(backups){return(
backups()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["observed.png", {url: new URL("./files/30b14480498602b2fe0b464432b17d1d8735e6676200c99e288a10cedb27df2b5c6727009ba1d0491cbc4124f7e48a05affb3184ef67ca9e4d20329266857f31.png", import.meta.url), mimeType: "image/png", toString}],
    ["synthetic.png", {url: new URL("./files/78c9b6083303b64c50fae9f56b3dc1de36f5bf2d7a6401ab59531a2b6ce24752d84bcc89ff11493cd08f9b00348d5ddbbcef9ef91b97235f8345d26ec97cbf8c.png", import.meta.url), mimeType: "image/png", toString}]
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
  main.variable(observer()).define(["md"], _15);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer()).define(["md"], _19);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer()).define(["md"], _23);
  main.variable(observer()).define(["md"], _24);
  main.variable(observer()).define(["md"], _25);
  main.variable(observer()).define(["md"], _26);
  main.variable(observer()).define(["md"], _27);
  main.variable(observer()).define(["md"], _28);
  main.variable(observer()).define(["htl"], _29);
  main.variable(observer()).define(["md"], _30);
  const child1 = runtime.module(define1);
  main.import("backups", child1);
  main.import("backupNowButton", child1);
  main.variable(observer()).define(["backups"], _32);
  return main;
}
