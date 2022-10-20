import define1 from "./c4e4a355c53d2a1a@111.js";

function _1(md){return(
md`# Documentation [Provider.Quest]`
)}

function _2(md,quickMenu){return(
md`${quickMenu}`
)}

function _3(md){return(
md`
Provider.Quest (originally known as Miner.Report) is a project to collect analytics data from the Filecoin blockchain. It is also a collection of notebooks on ObservableHQ with interactive visualizations that use the data.

It can always be found at https://provider.quest/ (which just redirects to the collection on ObservableHQ)

`
)}

function _4(md){return(
md`
## Repos

* GitHub: [provider-quest/provider-quest-spark](https://github.com/provider-quest/provider-quest-spark)
* GitHub: [provider-quest/provider.quest-website](https://github.com/provider-quest/provider.quest-website)
`
)}

function _5(md){return(
md`
## Pipeline

Data collectors (aka. "scanners") are written in JavaScript as Observable Notebooks, eg.

* [@jimpick/provider-quest-miner-power-scanner](https://observablehq.com/@jimpick/provider-quest-miner-power-scanner?collection=@jimpick/provider-quest)
* [@jimpick/provider-quest-miner-info-scanner](https://observablehq.com/@jimpick/provider-quest-miner-info-scanner?collection=@jimpick/provider-quest)
* [@jimpick/provider-quest-storage-ask-scanner](https://observablehq.com/@jimpick/provider-quest-storage-ask-scanner?collection=@jimpick/provider-quest)
* [@jimpick/provider-quest-publish-deal-messages-stream](https://observablehq.com/@jimpick/provider-quest-publish-deal-messages-stream?collection=@jimpick/provider-quest)
* [@jimpick/provider-quest-dht-miner-peer-scanner](https://observablehq.com/@jimpick/provider-quest-dht-miner-peer-scanner?collection=@jimpick/provider-quest)
* [@jimpick/provider-quest-multiaddr-ip-tool](https://observablehq.com/@jimpick/provider-quest-multiaddr-ip-tool?collection=@jimpick/provider-quest)
* [@jimpick/provider-quest-maxmind-geolite2-lookups](https://observablehq.com/@jimpick/provider-quest-maxmind-geolite2-lookups?collection=@jimpick/provider-quest)
* [@jimpick/provider-quest-baidu-ip-geo-lookups](https://observablehq.com/@jimpick/provider-quest-baidu-ip-geo-lookups?collection=@jimpick/provider-quest)
* [@jimpick/provider-quest-storage-provider-to-region-mapper](https://observablehq.com/@jimpick/provider-quest-storage-provider-to-region-mapper?collection=@jimpick/provider-quest)

On a dedicated machine, a [shell script](https://github.com/jimpick/provider-quest-spark/blob/main/scan-worker.sh) is run to continuously collected data from the Observable notebooks in a loop. The notebooks are executed using [Puppeteer](https://github.com/puppeteer/puppeteer) (headless Chrome) and [@alex.garcia/observable-prerender](https://github.com/asg017/observable-prerender). The data from the notebooks is collected into simple JSON files. The JSON files are also archived to [Estuary](https://estuary.tech/) on a daily basis. 

A [PySpark](https://spark.apache.org/docs/latest/api/python/) script ([pyspark_main.py](https://github.com/jimpick/provider-quest-spark/blob/main/pyspark_main.py)) is also kept running to execute a bunch of never-ending [Apache Spark Structured Streaming](https://spark.apache.org/docs/latest/structured-streaming-programming-guide.html) queries that use SQL to filter/partion the data and to compute aggregated sums, averages, etc. over tumbling windows. All the output is written out as simple JSON files.

The scanning script also executes the [publish script](https://github.com/jimpick/provider-quest-spark/blob/main/publish.sh) on a periodic basis. The publishing scripts take the JSON files output from Spark and publish them to a set of [Textile Buckets](https://docs.textile.io/buckets/) on IPFS for public distribution (see below).

Notebooks on ObservableHQ and other places can use the published data to generate visualization and reports.
`
)}

function _6(md){return(
md`
## Published Data

Data is published to [Textile Buckets](https://docs.textile.io/buckets/) on IPFS. See the [@jimpick/provider-quest-feeds](https://observablehq.com/@jimpick/provider-quest-feeds?collection=@jimpick/provider-quest) notebook for the list of buckets and URLs.
`
)}

function _7(md){return(
md`
## Legacy Repos

Miner.Report will eventually replace the functionality of the following projects, which are used to scan the network for new miners, make test storage deals, and test retrievals.

* GitHub: [jimpick/workshop-client-mainnet](https://github.com/jimpick/workshop-client-mainnet)
* GitHub: [jimpick/filecoin-wiki-test](https://github.com/jimpick/filecoin-wiki-test)
* GitHub: [jimpick/slingshot-scraper](https://github.com/jimpick/slingshot-scraper)

Some prior art for querying/visualizing data from Filecoin:

* GitHub: [jimpick/perspective-filecoin-remote-deals](https://github.com/jimpick/perspective-filecoin-remote-deals)
* GitHub: [jimpick/perspective-filecoin-asks](https://github.com/jimpick/perspective-filecoin-asks)
`
)}

function _8(md){return(
md`
## Community Discussion

* There is a [Provider.Quest discussion thread](https://github.com/filecoin-project/community/discussions/208) in the Filecoin community GitHub repo
`
)}

function _9(md){return(
md`
## Grants

The following grants were applied for and/or awarded:

* Awarded 2021.07: [Next Step Microgrant: Provider.Quest - Accurate geolocation data for visualizations](https://github.com/filecoin-project/devgrants/issues/266)
* Awarded 2021.12: [Next Step Microgrant: Provider.Quest - Add Historical Published Deal Data + Active/Slashed Deals](https://github.com/filecoin-project/devgrants/issues/397)
`
)}

function _10(md){return(
md`
## Applications using the data

* https://twitter.com/SFilecoin (from @Phi-rjan)
`
)}

function _11(md){return(
md`
## Contributing

Contributions are welcome! Feel free to use the data and fork any notebooks on ObservableHQ. I'll happily link to anything interesting. Also, ObservableHQ has good support for teams and collaborative editing, so I'd be happy to experiment with using those as part of this project/collection.

For many types of visualizations, it's pretty easy to modify the Spark Structured Streaming SQL to output a different aggregation or grouping/partitioning scheme from the input data that is already there. I can easily publish a new dataset to a Textile Bucket. If you have a request, feel free to leave a comment or chat with me on the Filecoin Community Slack.
`
)}

function _12(md){return(
md`
## Other Filecoin/IPFS related links

Lots of interesting ObservableHQ notebooks from the Protocol Labs team and others!

* https://observablehq.com/@protocol
* https://observablehq.com/@nicola
* https://observablehq.com/@jbenet
* https://observablehq.com/@hugomrdias
* https://observablehq.com/@gozala
* https://observablehq.com/@olizilla
* https://observablehq.com/@raulk
* https://observablehq.com/@rafaelramalho19
* https://observablehq.com/@andrewnez
* https://observablehq.com/@adlrocha
* https://observablehq.com/@kubuxu
* https://observablehq.com/@mrsmkl
* https://observablehq.com/@alanshaw
* https://observablehq.com/@starboard
* https://observablehq.com/@827f69a0d38074d6
* https://observablehq.com/@vkalghatgi
`
)}

function _13(md){return(
md`## Similar Projects`
)}

function _14(md){return(
md`There are other teams also building interesting tools off of Filecoin chain data.`
)}

function _15(md){return(
md`* https://www.starboard.ventures/
  * https://dashboard.starboard.ventures/
  * https://sprd.starboard.ventures/
* https://spacegap.github.io/
  * https://github.com/Digital-MOB-Filecoin/spacegap-backend
  * https://github.com/spacegap/spacegap.github.io
* https://altlabs.dev/
  * https://filmine.io/
  * https://filmine.io/filgram`
)}

function _16(md){return(
md`
## License

Dual-licensed under [MIT](https://github.com/filecoin-project/lotus/blob/master/LICENSE-MIT) + [Apache 2.0](https://github.com/filecoin-project/lotus/blob/master/LICENSE-APACHE)

Data is licenced as [CC-BY-SA 3.0](https://ipfs.io/ipfs/QmVreNvKsQmQZ83T86cWSjPu2vR3yZHGPm5jnxFuunEB9u) unless otherwised noted.
`
)}

function _17(md){return(
md`## Imports`
)}

function _19(md){return(
md`## Backups`
)}

function _21(backups){return(
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
  main.variable(observer()).define(["md"], _10);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer()).define(["md"], _13);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer()).define(["md"], _15);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer()).define(["md"], _17);
  const child1 = runtime.module(define1);
  main.import("quickMenu", child1);
  main.variable(observer()).define(["md"], _19);
  const child2 = runtime.module(define1);
  main.import("backups", child2);
  main.import("backupNowButton", child2);
  main.variable(observer()).define(["backups"], _21);
  return main;
}
