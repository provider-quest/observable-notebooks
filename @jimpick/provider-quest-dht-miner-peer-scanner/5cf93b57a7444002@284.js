import define1 from "./c4e4a355c53d2a1a@112.js";

function _1(md){return(
md`# Feeds [Provider.Quest]`
)}

function _2(md,quickMenu){return(
md`${quickMenu}`
)}

function _3(md){return(
md`
This is a list of feeds generated continuously by the Provider.Quest system, published to IPFS and IPNS (using DNSLink records). Feel free to use this data in your own projects!`
)}

function _4(md){return(
md`## Historical Provider Power Data (Daily)`
)}

function _5(md){return(
md`A table containing per-day data with the "raw bytes power" and "quality adjusted power" for every storage provider. Updated daily.`
)}

function _6(md){return(
md`* CSV: https://sp-power-daily.feeds.provider.quest/provider-power-daily.csv`
)}

function _7(md){return(
md`## Historical Deals (Daily)`
)}

function _8(md){return(
md`A table with number of deals / size of deals for each provider (verified + unverified) on a daily basis.`
)}

function _9(md){return(
md`* CSV: https://deals-daily.feeds.provider.quest/deals-daily.csv`
)}

function _10(legacyWorkshopClientBucketUrl,md){return(
md`## Legacy Workshop Client

This bucket contains annotations and other metadata from manual deal testing using the [workshop-client-mainnet](https://github.com/jimpick/workshop-client-mainnet) web-based client. Every few days I attempt small deals against all the miners I can find and I record the annotations in a JSON file. This will be gradually replaced with an ObservableHQ/Apache Spark solution.

* S3: [legacy-workshop-client/annotations-mainnet.json](${legacyWorkshopClientBucketUrl}/annotations-mainnet.json)
* S3: [legacy-workshop-client/annotated-miner-indexes.json](${legacyWorkshopClientBucketUrl}/annotated-miner-indexes.json)
* S3: [legacy-workshop-client/annotated-miner-indexes-excluding-delisted.json](${legacyWorkshopClientBucketUrl}/annotated-miner-indexes-excluding-delisted.json)`
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

function _15(Inputs,legacyAnnotationsMainnet){return(
Inputs.table(Object.entries(legacyAnnotationsMainnet))
)}

function _16(md,minerInfoSubsetLatestBucketUrl){return(
md`## Miner Info

Every couple of hours, I collect information about the miners I am tracking from the Lotus API using the [Miner Info Scanner notebook](https://observablehq.com/@jimpick/miner-report-miner-info-scanner). This on-chain data includes information such as PeerIDs and multiaddresses (IP addresses) useful for communicating peer-to-peer with miners.

* IPFS: [/ipns/miner-info.feeds.provider.quest](${minerInfoSubsetLatestBucketUrl}) (Latest miner info only)
`
)}

function _minerInfoSubsetLatestBucketUrl()
{
  return 'https://miner-info.feeds.provider.quest/'
  // return 'https://provider-quest.s3.us-west-2.amazonaws.com/dist/miner-info-subset-latest'
  // return 'https://hub.textile.io/thread/bafkwblbznyqkmqx5l677z3kjsslhxo2vbbqh6wluunvvdbmqattrdya/buckets/bafzbeigscdljg5a32b4toh6jkz4h3dczusqd6s3mkt3h5nbwtqmbqmh6mu'
}


async function _minerInfoSubsetLatest(minerInfoSubsetLatestBucketUrl){return(
(await fetch(`${minerInfoSubsetLatestBucketUrl}/miner-info-subset-latest.json`)).json()
)}

function _19(Inputs,minerInfoSubsetLatest){return(
Inputs.table(Object.entries(minerInfoSubsetLatest.miners).map(([miner, info]) => ({miner, ...info})))
)}

function _20(md,asksSubsetLatestBucketUrl){return(
md`## Asks

* IPFS: [/ipns/asks.feeds.provider.quest](${asksSubsetLatestBucketUrl})
`
)}

function _asksSubsetLatestBucketUrl()
{
  return 'https://asks.feeds.provider.quest/'
  // return 'https://provider-quest.s3.us-west-2.amazonaws.com/dist/asks-subset-latest'
  // return 'https://hub.textile.io/thread/bafkwblbznyqkmqx5l677z3kjsslhxo2vbbqh6wluunvvdbmqattrdya/buckets/bafzbeidg5ygzrk4oxusmopijf7wqxibmm3sktkkhuz7sfecextyuvifx7y'
}


async function _asksSubsetLatest(asksSubsetLatestBucketUrl){return(
(await fetch(`${asksSubsetLatestBucketUrl}/asks-subset-latest.json`)).json()
)}

function _23(Inputs,asksSubsetLatest){return(
Inputs.table(Object.entries(asksSubsetLatest.miners).map(([miner, ask]) => ({miner, ...ask})))
)}

function _24(md,dealsBucketUrl){return(
md`## Deals

* IPFS: [/ipns/deals.feeds.provider.quest](${dealsBucketUrl})
`
)}

function _dealsBucketUrl(){return(
"https://deals.feeds.provider.quest/"
)}

function _dealsBucketUrlTextile()
{
  return 'Deprecated'
  // return 'https://hub.textile.io/thread/bafkwblbznyqkmqx5l677z3kjsslhxo2vbbqh6wluunvvdbmqattrdya/buckets/bafzbeidhnns26omq6a3y4jdixo7nqvb27wn7otfowohei5zibupvh7d2hq/'
}


function _dealsBucketUrlAmazon(){return(
"https://provider-quest.s3.us-west-2.amazonaws.com/dist/deals"
)}

function _28(md){return(
md`## Miner Power`
)}

function _29(minerPowerDailyAverageLatestBucketUrl,minerPowerMultidayAverageLatestBucketUrl,md){return(
md`* IPFS: [/ipns/power-latest-daily.feeds.provider.quest](${minerPowerDailyAverageLatestBucketUrl})
* IPFS: [/ipns/power-latest-multiday.feeds.provider.quest](${minerPowerMultidayAverageLatestBucketUrl})
`
)}

function _minerPowerDailyAverageLatestBucketUrl()
{
  return 'https://power-latest-daily.feeds.provider.quest'
  // return 'https://provider-quest.s3.us-west-2.amazonaws.com/dist/miner-power-daily-average-latest'
  // return 'https://hub.textile.io/thread/bafkwblbznyqkmqx5l677z3kjsslhxo2vbbqh6wluunvvdbmqattrdya/buckets/bafzbeiehszmgeygov7bqchfmhh5zxtmn6xyt26ufyhw5k6tuy23h2w4ngm'
}


function _minerPowerMultidayAverageLatestBucketUrl()
{
  return 'https://power-latest-multiday.feeds.provider.quest'
  // return 'https://provider-quest.s3.us-west-2.amazonaws.com/dist/miner-power-multiday-average-latest'
  // return 'https://hub.textile.io/thread/bafkwblbznyqkmqx5l677z3kjsslhxo2vbbqh6wluunvvdbmqattrdya/buckets/bafzbeicdqsds5fkmmcrtkyg3uf6zk5t3bralisswrdh5wlo25przr23pqq'
}


function _32(md,dhtAddrsLatestBucketUrl){return(
md`## DHT Addresses

On a regular basis, peer lookups are made against the DHT (Distributed Hash Table) using the [@jimpick/miner-report-dht-miner-peer-scanner](https://observablehq.com/@jimpick/miner-report-dht-miner-peer-scanner?collection=@jimpick/miner-report) notebook and published here.

* IPFS: [/ipns/dht-addrs.feeds.provider.quest](${dhtAddrsLatestBucketUrl})`
)}

function _dhtAddrsLatestBucketUrl()
{
  return 'https://dht-addrs.feeds.provider.quest'
  // return 'https://provider-quest.s3.us-west-2.amazonaws.com/dist/dht-addrs-latest'
  // return 'https://hub.textile.io/thread/bafkwblbznyqkmqx5l677z3kjsslhxo2vbbqh6wluunvvdbmqattrdya/buckets/bafzbeifpxwjdz5e5mv3tzat7de6uzxfusfqk5flqfrlh7re3ria6bs7ye4/'
}


function _34(md,multiaddrsIpsLatestBucketUrl){return(
md`## Multiaddresses and IP Addresses

The scan data from the "Miner Info" and "DHT Addresses" scans are combined using the [@jimpick/miner-report-multiaddr-ip-tool](https://observablehq.com/@jimpick/miner-report-multiaddr-ip-tool?collection=@jimpick/miner-report) notebook and published here.

* IPFS: [/ipns/multiaddrs-ips.feeds.provider.quest](${multiaddrsIpsLatestBucketUrl})`
)}

function _multiaddrsIpsLatestBucketUrl()
{
  return 'https://multiaddrs-ips.feeds.provider.quest/'
  // return 'https://provider-quest.s3.us-west-2.amazonaws.com/dist/multiaddrs-ips-latest'
  // return 'https://hub.textile.io/thread/bafkwblbznyqkmqx5l677z3kjsslhxo2vbbqh6wluunvvdbmqattrdya/buckets/bafzbeia7ab6fddp255zwn3i4r36pp5walbnblkojfhbuesvsxywmvbk3sa'
}


function _36(md,geoIpLookupsBucketUrl){return(
md`## GeoIP Lookups

The list of IPs is cross-references with databases to lookup geographic locations. The [MaxMind GeoLite2 scanner notebook](https://observablehq.com/@jimpick/miner-report-maxmind-geolite2-lookups?collection=@jimpick/miner-report) is used to perform lookups against a freely downloadable database.

* IPFS: [/ipns/geoip.feeds.provider.quest](${geoIpLookupsBucketUrl})`
)}

function _geoIpLookupsBucketUrl()
{
  return 'https://geoip.feeds.provider.quest/'
  // return 'https://provider-quest.s3.us-west-2.amazonaws.com/dist/geoip-lookups'
  // return 'https://hub.textile.io/thread/bafkwblbznyqkmqx5l677z3kjsslhxo2vbbqh6wluunvvdbmqattrdya/buckets/bafzbeibjg7kky45npdwnogui5ffla7dint62xpttvvlzrsbewlrfmbusya'
}


function _38(md){return(
md`## Imports`
)}

function _40(md){return(
md`## Backups`
)}

function _42(backups){return(
backups()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md","quickMenu"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer()).define(["legacyWorkshopClientBucketUrl","md"], _10);
  main.variable(observer("legacyWorkshopClientBucketUrl")).define("legacyWorkshopClientBucketUrl", _legacyWorkshopClientBucketUrl);
  main.variable(observer("annotatedMinerIndexes")).define("annotatedMinerIndexes", ["legacyWorkshopClientBucketUrl"], _annotatedMinerIndexes);
  main.variable(observer("annotatedMinerIndexesExcludingDelisted")).define("annotatedMinerIndexesExcludingDelisted", ["legacyWorkshopClientBucketUrl"], _annotatedMinerIndexesExcludingDelisted);
  main.variable(observer("legacyAnnotationsMainnet")).define("legacyAnnotationsMainnet", ["legacyWorkshopClientBucketUrl"], _legacyAnnotationsMainnet);
  main.variable(observer()).define(["Inputs","legacyAnnotationsMainnet"], _15);
  main.variable(observer()).define(["md","minerInfoSubsetLatestBucketUrl"], _16);
  main.variable(observer("minerInfoSubsetLatestBucketUrl")).define("minerInfoSubsetLatestBucketUrl", _minerInfoSubsetLatestBucketUrl);
  main.variable(observer("minerInfoSubsetLatest")).define("minerInfoSubsetLatest", ["minerInfoSubsetLatestBucketUrl"], _minerInfoSubsetLatest);
  main.variable(observer()).define(["Inputs","minerInfoSubsetLatest"], _19);
  main.variable(observer()).define(["md","asksSubsetLatestBucketUrl"], _20);
  main.variable(observer("asksSubsetLatestBucketUrl")).define("asksSubsetLatestBucketUrl", _asksSubsetLatestBucketUrl);
  main.variable(observer("asksSubsetLatest")).define("asksSubsetLatest", ["asksSubsetLatestBucketUrl"], _asksSubsetLatest);
  main.variable(observer()).define(["Inputs","asksSubsetLatest"], _23);
  main.variable(observer()).define(["md","dealsBucketUrl"], _24);
  main.variable(observer("dealsBucketUrl")).define("dealsBucketUrl", _dealsBucketUrl);
  main.variable(observer("dealsBucketUrlTextile")).define("dealsBucketUrlTextile", _dealsBucketUrlTextile);
  main.variable(observer("dealsBucketUrlAmazon")).define("dealsBucketUrlAmazon", _dealsBucketUrlAmazon);
  main.variable(observer()).define(["md"], _28);
  main.variable(observer()).define(["minerPowerDailyAverageLatestBucketUrl","minerPowerMultidayAverageLatestBucketUrl","md"], _29);
  main.variable(observer("minerPowerDailyAverageLatestBucketUrl")).define("minerPowerDailyAverageLatestBucketUrl", _minerPowerDailyAverageLatestBucketUrl);
  main.variable(observer("minerPowerMultidayAverageLatestBucketUrl")).define("minerPowerMultidayAverageLatestBucketUrl", _minerPowerMultidayAverageLatestBucketUrl);
  main.variable(observer()).define(["md","dhtAddrsLatestBucketUrl"], _32);
  main.variable(observer("dhtAddrsLatestBucketUrl")).define("dhtAddrsLatestBucketUrl", _dhtAddrsLatestBucketUrl);
  main.variable(observer()).define(["md","multiaddrsIpsLatestBucketUrl"], _34);
  main.variable(observer("multiaddrsIpsLatestBucketUrl")).define("multiaddrsIpsLatestBucketUrl", _multiaddrsIpsLatestBucketUrl);
  main.variable(observer()).define(["md","geoIpLookupsBucketUrl"], _36);
  main.variable(observer("geoIpLookupsBucketUrl")).define("geoIpLookupsBucketUrl", _geoIpLookupsBucketUrl);
  main.variable(observer()).define(["md"], _38);
  const child1 = runtime.module(define1);
  main.import("quickMenu", child1);
  main.variable(observer()).define(["md"], _40);
  const child2 = runtime.module(define1);
  main.import("backups", child2);
  main.import("backupNowButton", child2);
  main.variable(observer()).define(["backups"], _42);
  return main;
}
