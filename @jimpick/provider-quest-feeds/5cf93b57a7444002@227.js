// https://observablehq.com/@jimpick/provider-quest-feeds@227
import define1 from "./c4e4a355c53d2a1a@111.js";

function _1(md){return(
md`# Feeds/Buckets [Provider.Quest]`
)}

function _2(md,quickMenu){return(
md`${quickMenu}`
)}

function _3(md){return(
md`
This is a list of feeds generated continuously by the Provider.Quest system, distributed using [Textile Buckets](https://docs.textile.io/buckets/) and IPFS. Feel free to use this data in your own projects!`
)}

function _4(md,legacyWorkshopClientBucketUrl){return(
md`## Legacy Workshop Client

This bucket contains annotations and other metadata from manual deal testing using the [workshop-client-mainnet](https://github.com/jimpick/workshop-client-mainnet) web-based client. Every few days I attempt small deals against all the miners I can find and I record the annotations in a JSON file. This will be gradually replaced with an ObservableHQ/Apache Spark solution.

* Textile Bucket: [legacy-workshop-client](${legacyWorkshopClientBucketUrl})`
)}

function _legacyWorkshopClientBucketUrl()
{
  return 'https://provider-quest.s3.us-west-2.amazonaws.com/dist/legacy-workshop-client'
  // return 'https://hub.textile.io/thread/bafkwblbznyqkmqx5l677z3kjsslhxo2vbbqh6wluunvvdbmqattrdya/buckets/bafzbeiebnqxhltzfhmhdfr2j6p24ngipc7n4qmxrufivvjat7iwjazfwp4'
}


async function _annotatedMinerIndexes(legacyWorkshopClientBucketUrl){return(
(await (await fetch(`${legacyWorkshopClientBucketUrl}/annotated-miner-indexes.json`)).json()).map(num => `f0${num}`)
)}

async function _annotatedMinerIndexesExcludingDelisted(legacyWorkshopClientBucketUrl){return(
(await (await fetch(`${legacyWorkshopClientBucketUrl}/annotated-miner-indexes-excluding-delisted.json`)).json()).map(num => `f0${num}`)
)}

async function _legacyAnnotationsMainnet(legacyWorkshopClientBucketUrl){return(
(await fetch(`${legacyWorkshopClientBucketUrl}/annotations-mainnet.json`)).json()
)}

function _9(Inputs,legacyAnnotationsMainnet){return(
Inputs.table(Object.entries(legacyAnnotationsMainnet))
)}

function _10(md,minerInfoSubsetLatestBucketUrl){return(
md`## Miner Info

Every couple of hours, I collect information about the miners I am tracking from the Lotus API using the [Miner Info Scanner notebook](https://observablehq.com/@jimpick/miner-report-miner-info-scanner). This on-chain data includes information such as PeerIDs and multiaddresses (IP addresses) useful for communicating peer-to-peer with miners.

* Textile Bucket: [miner-info-subset-latest](${minerInfoSubsetLatestBucketUrl}) (Latest miner info only)
`
)}

function _minerInfoSubsetLatestBucketUrl()
{
  return 'https://provider-quest.s3.us-west-2.amazonaws.com/dist/miner-info-subset-latest'
  // return 'https://hub.textile.io/thread/bafkwblbznyqkmqx5l677z3kjsslhxo2vbbqh6wluunvvdbmqattrdya/buckets/bafzbeigscdljg5a32b4toh6jkz4h3dczusqd6s3mkt3h5nbwtqmbqmh6mu'
}


async function _minerInfoSubsetLatest(minerInfoSubsetLatestBucketUrl){return(
(await fetch(`${minerInfoSubsetLatestBucketUrl}/miner-info-subset-latest.json`)).json()
)}

function _13(Inputs,minerInfoSubsetLatest){return(
Inputs.table(Object.entries(minerInfoSubsetLatest.miners).map(([miner, info]) => ({miner, ...info})))
)}

function _14(md,asksSubsetLatestBucketUrl){return(
md`## Asks

* Textile Bucket: [asks-subset-latest](${asksSubsetLatestBucketUrl})
`
)}

function _asksSubsetLatestBucketUrl()
{
  return 'https://provider-quest.s3.us-west-2.amazonaws.com/dist/asks-subset-latest'
  // return 'https://hub.textile.io/thread/bafkwblbznyqkmqx5l677z3kjsslhxo2vbbqh6wluunvvdbmqattrdya/buckets/bafzbeidg5ygzrk4oxusmopijf7wqxibmm3sktkkhuz7sfecextyuvifx7y'
}


async function _asksSubsetLatest(asksSubsetLatestBucketUrl){return(
(await fetch(`${asksSubsetLatestBucketUrl}/asks-subset-latest.json`)).json()
)}

function _17(Inputs,asksSubsetLatest){return(
Inputs.table(Object.entries(asksSubsetLatest.miners).map(([miner, ask]) => ({miner, ...ask})))
)}

function _18(md,dealsBucketUrl){return(
md`## Deals

* Provider.Quest IPFS Gateway: [deals](${dealsBucketUrl})
`
)}

function _dealsBucketUrl(){return(
"https://deals.feeds.provider.quest/"
)}

function _dealsBucketUrlTextile()
{
  return 'https://provider-quest.s3.us-west-2.amazonaws.com/dist/deals'
  // return 'https://hub.textile.io/thread/bafkwblbznyqkmqx5l677z3kjsslhxo2vbbqh6wluunvvdbmqattrdya/buckets/bafzbeidhnns26omq6a3y4jdixo7nqvb27wn7otfowohei5zibupvh7d2hq/'
}


function _21(md){return(
md`## Miner Power`
)}

function _22(md,minerPowerDailyAverageLatestBucketUrl,minerPowerMultidayAverageLatestBucketUrl){return(
md`
* [miner-power-daily-average-latest](${minerPowerDailyAverageLatestBucketUrl})
* [miner-power-multiday-average-latest](${minerPowerMultidayAverageLatestBucketUrl})
`
)}

function _minerPowerDailyAverageLatestBucketUrl()
{
  return 'https://provider-quest.s3.us-west-2.amazonaws.com/dist/miner-power-daily-average-latest'
  // return 'https://hub.textile.io/thread/bafkwblbznyqkmqx5l677z3kjsslhxo2vbbqh6wluunvvdbmqattrdya/buckets/bafzbeiehszmgeygov7bqchfmhh5zxtmn6xyt26ufyhw5k6tuy23h2w4ngm'
}


function _minerPowerMultidayAverageLatestBucketUrl()
{
  return 'https://provider-quest.s3.us-west-2.amazonaws.com/dist/miner-power-multiday-average-latest'
  return 'https://hub.textile.io/thread/bafkwblbznyqkmqx5l677z3kjsslhxo2vbbqh6wluunvvdbmqattrdya/buckets/bafzbeicdqsds5fkmmcrtkyg3uf6zk5t3bralisswrdh5wlo25przr23pqq'
}


function _25(md,dhtAddrsLatestBucketUrl){return(
md`## DHT Addresses

On a regular basis, peer lookups are made against the DHT (Distributed Hash Table) using the [@jimpick/miner-report-dht-miner-peer-scanner](https://observablehq.com/@jimpick/miner-report-dht-miner-peer-scanner?collection=@jimpick/miner-report) notebook and published here.

* Textile Bucket: [dht-addrs-latest](${dhtAddrsLatestBucketUrl})`
)}

function _dhtAddrsLatestBucketUrl()
{
  return 'https://provider-quest.s3.us-west-2.amazonaws.com/dist/dht-addrs-latest'
  // return 'https://hub.textile.io/thread/bafkwblbznyqkmqx5l677z3kjsslhxo2vbbqh6wluunvvdbmqattrdya/buckets/bafzbeifpxwjdz5e5mv3tzat7de6uzxfusfqk5flqfrlh7re3ria6bs7ye4/'
}


function _27(md,multiaddrsIpsLatestBucketUrl){return(
md`## Multiaddresses and IP Addresses

The scan data from the "Miner Info" and "DHT Addresses" scans are combined using the [@jimpick/miner-report-multiaddr-ip-tool](https://observablehq.com/@jimpick/miner-report-multiaddr-ip-tool?collection=@jimpick/miner-report) notebook and published here.

* Textile Bucket: [multiaddrs-ips-latest](${multiaddrsIpsLatestBucketUrl})`
)}

function _multiaddrsIpsLatestBucketUrl()
{
  return 'https://provider-quest.s3.us-west-2.amazonaws.com/dist/multiaddrs-ips-latest'
  // return 'https://hub.textile.io/thread/bafkwblbznyqkmqx5l677z3kjsslhxo2vbbqh6wluunvvdbmqattrdya/buckets/bafzbeia7ab6fddp255zwn3i4r36pp5walbnblkojfhbuesvsxywmvbk3sa'
}


function _29(md,geoIpLookupsBucketUrl){return(
md`## GeoIP Lookups

The list of IPs is cross-references with databases to lookup geographic locations. The [MaxMind GeoLite2 scanner notebook](https://observablehq.com/@jimpick/miner-report-maxmind-geolite2-lookups?collection=@jimpick/miner-report) is used to perform lookups against a freely downloadable database.

* Textile Bucket: [geoip-lookups](${geoIpLookupsBucketUrl})`
)}

function _geoIpLookupsBucketUrl()
{
  return 'https://provider-quest.s3.us-west-2.amazonaws.com/dist/geoip-lookups'
  // return 'https://hub.textile.io/thread/bafkwblbznyqkmqx5l677z3kjsslhxo2vbbqh6wluunvvdbmqattrdya/buckets/bafzbeibjg7kky45npdwnogui5ffla7dint62xpttvvlzrsbewlrfmbusya'
}


function _31(md){return(
md`## Imports`
)}

function _33(md){return(
md`## Backups`
)}

function _35(backups){return(
backups()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md","quickMenu"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md","legacyWorkshopClientBucketUrl"], _4);
  main.variable(observer("legacyWorkshopClientBucketUrl")).define("legacyWorkshopClientBucketUrl", _legacyWorkshopClientBucketUrl);
  main.variable(observer("annotatedMinerIndexes")).define("annotatedMinerIndexes", ["legacyWorkshopClientBucketUrl"], _annotatedMinerIndexes);
  main.variable(observer("annotatedMinerIndexesExcludingDelisted")).define("annotatedMinerIndexesExcludingDelisted", ["legacyWorkshopClientBucketUrl"], _annotatedMinerIndexesExcludingDelisted);
  main.variable(observer("legacyAnnotationsMainnet")).define("legacyAnnotationsMainnet", ["legacyWorkshopClientBucketUrl"], _legacyAnnotationsMainnet);
  main.variable(observer()).define(["Inputs","legacyAnnotationsMainnet"], _9);
  main.variable(observer()).define(["md","minerInfoSubsetLatestBucketUrl"], _10);
  main.variable(observer("minerInfoSubsetLatestBucketUrl")).define("minerInfoSubsetLatestBucketUrl", _minerInfoSubsetLatestBucketUrl);
  main.variable(observer("minerInfoSubsetLatest")).define("minerInfoSubsetLatest", ["minerInfoSubsetLatestBucketUrl"], _minerInfoSubsetLatest);
  main.variable(observer()).define(["Inputs","minerInfoSubsetLatest"], _13);
  main.variable(observer()).define(["md","asksSubsetLatestBucketUrl"], _14);
  main.variable(observer("asksSubsetLatestBucketUrl")).define("asksSubsetLatestBucketUrl", _asksSubsetLatestBucketUrl);
  main.variable(observer("asksSubsetLatest")).define("asksSubsetLatest", ["asksSubsetLatestBucketUrl"], _asksSubsetLatest);
  main.variable(observer()).define(["Inputs","asksSubsetLatest"], _17);
  main.variable(observer()).define(["md","dealsBucketUrl"], _18);
  main.variable(observer("dealsBucketUrl")).define("dealsBucketUrl", _dealsBucketUrl);
  main.variable(observer("dealsBucketUrlTextile")).define("dealsBucketUrlTextile", _dealsBucketUrlTextile);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer()).define(["md","minerPowerDailyAverageLatestBucketUrl","minerPowerMultidayAverageLatestBucketUrl"], _22);
  main.variable(observer("minerPowerDailyAverageLatestBucketUrl")).define("minerPowerDailyAverageLatestBucketUrl", _minerPowerDailyAverageLatestBucketUrl);
  main.variable(observer("minerPowerMultidayAverageLatestBucketUrl")).define("minerPowerMultidayAverageLatestBucketUrl", _minerPowerMultidayAverageLatestBucketUrl);
  main.variable(observer()).define(["md","dhtAddrsLatestBucketUrl"], _25);
  main.variable(observer("dhtAddrsLatestBucketUrl")).define("dhtAddrsLatestBucketUrl", _dhtAddrsLatestBucketUrl);
  main.variable(observer()).define(["md","multiaddrsIpsLatestBucketUrl"], _27);
  main.variable(observer("multiaddrsIpsLatestBucketUrl")).define("multiaddrsIpsLatestBucketUrl", _multiaddrsIpsLatestBucketUrl);
  main.variable(observer()).define(["md","geoIpLookupsBucketUrl"], _29);
  main.variable(observer("geoIpLookupsBucketUrl")).define("geoIpLookupsBucketUrl", _geoIpLookupsBucketUrl);
  main.variable(observer()).define(["md"], _31);
  const child1 = runtime.module(define1);
  main.import("quickMenu", child1);
  main.variable(observer()).define(["md"], _33);
  const child2 = runtime.module(define1);
  main.import("backups", child2);
  main.import("backupNowButton", child2);
  main.variable(observer()).define(["backups"], _35);
  return main;
}
