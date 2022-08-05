// https://observablehq.com/@jimpick/ideas-provider-quest@602
import define1 from "./c4e4a355c53d2a1a@111.js";

function _1(md){return(
md`# Ideas [Provider.Quest]`
)}

function _2(md,quickMenu){return(
md`${quickMenu}`
)}

function _3(md){return(
md`
This notebook is for collecting together ideas for future improvements to Provider.Quest - new data sources, queries, visualizations, processing and publishing techniques, etc.

If you'd like to try to implement any of the ideas listed here, tell us about it and we'll link and/or incorporate it into the project! Some of these ideas might also be fundable as grants via various funding programs.
`
)}

function _4(md){return(
md`## Data Sources`
)}

function _5(md){return(
md`### Sentinel Lily`
)}

function _6(md){return(
md`The Sentinel project from Protocol Labs has a historical set of data dumps of unpacked chain data at https://lilium.sh/ ... we've already used it to import historical provider power data, but it also has historical deal data and other things that might be nice to do queries against.

Related grants:

* Awarded 2021.12: [Next Step Microgrant: Provider.Quest - Add Historical Published Deal Data + Active/Slashed Deals](https://github.com/filecoin-project/devgrants/issues/397)`
)}

function _7(md){return(
md`### All Active Deals (StateMarketDeals)`
)}

function _8(md){return(
md`The Lotus API provides the [StateMarketDeals](https://docs.filecoin.io/reference/lotus-api/#statemarketdeals) JSON-RPC method for retrieving the list of all active deals on the blockchain at a particular epoch. There is also an S3 bucket that has the same information updated every 10 minutes at: https://marketdeals.s3.us-east-2.amazonaws.com/StateMarketDeals.json (538MB on 2021-11-28)`
)}

function _9(md){return(
md`If this information was regularly collected (perhaps once per day), it could be used to easily calculate the total amount of deals that are active for all providers, as well as individually, future expected deal income, and it could also be used to track slashed deals per provider.

Related grants:

* Awarded 2021.12: [Next Step Microgrant: Provider.Quest - Add Historical Published Deal Data + Active/Slashed Deals](https://github.com/filecoin-project/devgrants/issues/397)
`
)}

function _10(md){return(
md`### Agents information (libp2p Identify)`
)}

function _11(md){return(
md`
Running \`lotus net peers -a\` will show the agent strings for various peers. eg.

\`\`\`
$ lotus net peers -a | head -10
QmfPgpqACggnPkM51eNFiEtwxShnYxQSa5mrCKuthFTPmQ, [/ip4/120.78.159.125/tcp/33475], venus
QmagH77Qtg3k7yVtatrC1fftemjSbzquba6Y5G39nj8Y8z, [/ip4/120.79.136.65/tcp/46083], venus
QmU9zYcfsdyDtToA8F2V4sBtYQgtfYV2DX1PsnEbzYRrpr, [/ip4/198.11.173.226/tcp/44798], venus
QmQMtX8paLZkd19acLrMetdCqpW43cvxTSzq4Vg5aEFkNK, [/ip4/74.143.156.85/tcp/46537], venus
12D3KooWT27GcpY1uv6wkG89jR5MXs1E4V6p1ZbiV11PqHGNgVLH, [/ip4/116.63.110.66/tcp/18790], lotus-1.11.2+mainnet+git.785a54692.dirty
12D3KooWT1kbFdgt5Brhha44bakQy4KSDUz6FnXvCSYfivudYeXq, [/ip4/103.98.8.211/tcp/5545], lotus-1.13.0+mainnet+git.f4f8b3b2f
12D3KooWT1jbXvtyteLxhQWY88UCxAFFMXSNrq9M8pGigyW34Eat, [/ip4/220.195.127.185/tcp/50015], lotus-1.13.0+mainnet+git.6bbbea78c.dirty
12D3KooWT1XPkc4R4UamYdrevrdumKBmxVL5adJNyeoJyq7toXYr, [/ip4/112.13.70.109/tcp/2077], lotus-1.13.0+mainnet+git.d7fb8e631.dirty
12D3KooWSy8H9KSnRyjX7At2ci3NZ2nmEznsUj5SKfWQJ11q7QzX, [/ip4/103.122.95.12/tcp/33318], lotus-1.12.0+mainnet+git.0b804e00a.dirty
12D3KooWSsrzDgzM4g5c5YBTqSk9KtvoKyUeoDxHHKbXdJvxAGLN, [/ip4/103.122.95.111/tcp/22760], lotus-1.12.0+mainnet+git.0b804e00a.dirty
\`\`\`

This is (possibly?) available by directly connecting to each peer with libp2p and the [Identify protocol](https://docs.libp2p.io/concepts/protocols/). (needs to be verified)

We could attempt to connect to the providers that we have multiaddrs for and track their agent string over time. This would be useful to cross-reference with other data. Agent strings can be quite complex, so there might be additional things we can do to make it easier to segment providers. This could also serve as a 'ping' to identify which multiaddrs are active and which are not (or just plain bogus), and could be used to monitor uptime, as well as filter out bogus IP addresses to get a more accurate idea of where providers are located. 
`
)}

function _12(md){return(
md`### Slingshot teams`
)}

function _13(md){return(
md`A lot of deal activity is from teams participating in the [Slingshot](https://slingshot.filecoin.io/) competition. If we collected the teams, client addresses, and additional metadata (dataset info, Slingshot phase), we could build some interesting queries and determine what deal activity is correlated.`
)}

function _14(md){return(
md`### Filfox Service Provider Labels`
)}

function _15(md){return(
md`
* https://filfox.info/en/ranks/power
* https://observablehq.com/@protocol/grouped-miners (prior art)
`
)}

function _16(md){return(
md`Filfox used to show labels/tags for providers, and it was possible for individual providers to verify themselves with Filfox by signing a message so they could update their own label/tag. Currently that seems to be broken or the API has changed. Also, the licensing on the data is unclear. It would be nice to collect the labels so they could be re-used to help de-anonymize the provider ids eg. (\`f02620\` is Magik's provider\).`
)}

function _17(md){return(
md`### Filecoin+ Provider Metadata

There are provider names, locations and contact info for a small number of providers over at:

* https://plus.fil.org/miners
`
)}

function _18(md){return(
md`### Filecoin+ Notary Metadata`
)}

function _19(md){return(
md`The Filecoin+ program has a list of all the notaries and clients which would be very useful to de-anonymize clients associated with verified deals.

* https://docs.filecoin.io/store/filecoin-plus/
* https://fil.org/governance/
* https://www.fildata.info/en/filecoin-plus
* https://github.com/filecoin-project/filecoin-plus-large-datasets
* https://filplus.info/#/
* https://filplus.d.interplanetary.one/
* https://pluskit.io/

With this data, it would be possibly to produce reports and queries useful for measuring the impact of the Filecoin+ program in terms of dataset storage success and measuring the incentive for providers.`
)}

function _20(md){return(
md`### Filecoin Gravity Metadata`
)}

function _21(md){return(
md`
* https://filecoin.io/blog/posts/filecoin-project-gravity-a-sales-referral-program/

Filecoin Gravity will subsidize the storage of many large datasets. With public metadata, it should be possible to de-anonymize clients and do some analysis to determine storage success.`
)}

function _22(md){return(
md`### IPFS DHT Providers and Peer Multiaddrs`
)}

function _23(md){return(
md`Much of the data stored on Filecoin is also "pinned" to IPFS. It would be interesting to randomly sample root CIDs stored as part of Filecoin deals to see if there are corresponding provider records in the IPFS DHT, and to track which peers and IP addresses (which could be geolocated) are advertising them. We could even attempt to randomly retrieve some files using Bitswap or Graphsync to conduct measurements and/or catalog contents.

* [Youtube: Filecoin Orbit: Measuring the Web3.0 Stack - Yiannis Psaras](https://www.youtube.com/watch?v=yylsaXz00_g)`
)}

function _24(md){return(
md`### Traceroute Data`
)}

function _25(md){return(
md `
* https://github.com/pierky/rich-traceroute

We could perform traceroutes periodically on IP addresses associated with functioning multiaddrs to gather information about intermediate ASNs on the Internet network paths to storage providers. This information could be used to more accurately pinpoint geographical or logical locations of providers. The traceroutes could originate from different physical locations in various cloud providers scattered geographically over the planet to get detailed information on network paths and latencies.`
)}

function _26(md){return(
md`### Use additional GeoIP lookup databases/services`
)}

function _27(md){return(
md`Currently we use the free GeoLite2 downloadable database from MaxMind, and we also do a second lookup on China based IP addresses using the Baidu API for greater accuracy in China (limited number of queries per day). MaxMind also has a paid API called GeoIP2 with a small free daily quota that we could use for addresses that have unsatisfactory results in the free API (eg. many lookups return 'USA' with no city information). There are also other paid alternatives to MaxMind that target more Enterprise level customers.

* https://www.maxmind.com/en/geoip2-precision-services
* https://www.digitalelement.com/geolocation/
* https://geo.ipify.org/
* https://geotargetly.com/ip-geolocation-api
* https://www.trustradius.com/ip-geolocation
* https://stat.ripe.net/app/launchpad
* https://db-ip.com/
* https://ipinfo.io/
* https://www.ip2location.com/
`
)}

function _28(md){return(
md`### Live Storage Deal Testing`
)}

function _29(md){return(
md`We can take some sample data (or store additional copies of existing useful data) of varying sizes, and make storage deal attempts directly with storage providers from various locations around the planet, and measure success rates, storage times, etc.

If we use Lotus as a client to make deals, we can use the \`lotus client inspect-deal\` CLI command to retrieve a lot of interesting statistics. ([Youtube demo](https://www.youtube.com/watch?v=W6aTSwjtveY))

Also, there are alternative clients for making Filecoin deals:

* [filclient](https://github.com/application-research/filclient)

Deal making could be decomposed into separate ultra-simple processes with heavy instrumentation that could run in disparate physical locations to handle different parts of the deal making process, eg. wallet/funds/market balance manipulation, querying asks, signed proposals, data-transfer/graphsync.
`
)}

function _30(md){return(
md`### Live Retrieval Deal Testing`
)}

function _31(md){return(
md`We can retrieve data stored on storage providers (either data we stored, or others have stored) of various sizes and measure retrieval success rates and performance.

We can test retrievals from a geographically diverse set of locations to get a feel for the best match of storage providers for a particular geographical area. eg. China-based storage providers probably work well for China-based retrieval clients, but what about clients in other locations? Client-provider pairs that cross oceans may have lower bandwidth due to congestion on undersea cables.`
)}

function _32(md){return(
md`### Community-submitted storage and retrieval deal metrics`
)}

function _33(md){return(
md`In addition to performing live storage and retrieval deals ourselves, we can solicit submissions of deal metrics from the community to augment our data. In order to prevent tampering with the data quality in order to bias results for reputational/economic benefit, care must be taken to ensure that the community-submitted results are from trustworthy sources.`
)}

function _34(md){return(
md`### Dealbot Results`
)}

function _35(md){return(
md`Protocol Labs wrote and is running a bot for testing deals. If we could get access to the results, we could combine the data.

* https://github.com/filecoin-project/dealbot
* https://observablehq.com/@protocol/deals-dashboard/2
`
)}

function _36(md){return(
md`### Retrieval Market Testing`
)}

function _37(md){return(
md`There is active development on a number of ideas for "Retrieval Markets" where it will be possible to retrieve data originating on Storage Providers via a CDN-like "hot layer". It would be interesting to test the performance and success rates on a variety of upcoming networks.

* https://retrieval.market/
* https://www.myel.network/
`
)}

function _38(md){return(
md`### Textile Bidbot Tracking`
)}

function _39(md){return(
md`Textile is publishing metrics on the winners of it's bidbot auctions. It would be interesting to match those deals and it would also help with de-anonymization.

* https://github.com/textileio/bidbot
* https://textileio.retool.com/embedded/public/fbf59411-760a-4a1a-b5b8-43f42061685d
`
)}

function _40(md){return(
md`### Filswan Tasks`
)}

function _41(md){return(
md`It might be possible to associate deals with Filswan tasks.

* https://www.filswan.com/
* https://docs.filswan.com/
`
)}

function _42(md){return(
md`### Filrep.io Reputation Scores and Reachability over Time`
)}

function _43(md){return(
md`We could collect reputation data published by https://filrep.io/ about the storage providers and provide a way to query that over time.`
)}

function _44(md){return(
md`### Estuary Deals / Successes, Failures`
)}

function _45(md){return(
md`Estuary publishes some data publicly showing per-provider statistics.

We are also using Estuary to store backups ... we can also use some of the private deal success data.

* https://estuary.tech/
`
)}

function _46(md){return(
md`### GeoJSON for Region Boundaries`
)}

function _47(md){return(
md`It would be nice to have GeoJSON shapes for the boundaries of all of our defined regions in the hierarchy.`
)}

function _48(md){return(
md`### Geographic Tagging for Client/Provider Addresses`
)}

function _49(md){return(
md`In the deals visualization, the client geographic locations were 'faked' as there is no on-chain source of truth for the location of client addresses. In some cases though, the identity of the clients are known and it is possible to assign accurate geographic locations to them. In some cases (eg. Estuary), the deals for a single address may originate from multiple physical locations.`
)}

function _50(md){return(
md`### Geographic Clustering for Client/Provider Addresses`
)}

function _51(md){return(
md`The deals visualization currently 'fakes' client geographic locations by picking deterministically a location based on a worldwide population weighting. This could be improved iteractively using heuristics - eg. many clients will tend to select providers that are geographically close to them as data transfer will be faster. So we could analyze the patterns of provider selections by clients and give additional probabilistic weight to locations that are closer to the providers. Other potential clues might be located within the public data that is being stored. eg. If we sample the content and there is a lot of Chinese text being stored, it is quite likely that the client is from a Chinese speaking locality.`
)}

function _52(md){return(
md`## Queries and Materialized Views`
)}

function _53(md){return(
md`### Locations changes over time`
)}

function _54(md){return(
md`The current Apache Spark queries only output the last seen location for any provider. However, it is possibly for providers to add, remove or change multiaddrs/IP addresses dynamically at any time, so some providers will map into different geographical locations over time. Also, IP geolocation databases such as MaxMind GeoLite2 are not very accurate and may resolve different locations over time for a given IP. Using different geolocation lookup services often returns different locations depending on which one is used. IP allocations may be transferred to different ASNs over time, so the databases lose accuracy and must be updated periodically.

For some types of historical analysis, it would be nice to have a historical database of the locations of each provider over time.`
)}

function _55(md){return(
md`### Monthly and Yearly Deal Aggregations`
)}

function _56(md){return(
md`We currently have hourly, daily and weekly aggregations. As we have more data now, it would be nice to add monthly and yearly aggregations.`
)}

function _57(md){return(
md`### Aggregations for hierarchical regions`
)}

function _58(md){return(
md`Currently we use Apache Spark to aggregations for deals and power for each individual "leaf" region in the region hierarchy. It would also be good to compute aggregations for higher-level hierarchy regions (eg. China, USA, Asia, North America, World, etc.). We can take advantage of the naming convention for region codes and combine that with 'LIKE' SQL queries in Apache Spark.`
)}

function _59(md){return(
md`### Ranking Queries`
)}

function _60(md){return(
md`Apache Spark could be used to calculate ranks in windows for various properties ... eg. "top service providers by deal data size volume per month"`
)}

function _61(md){return(
md`### Quantile Calculations`
)}

function _62(md){return(
md`It would assist analysis of results if quantiles could be calculated for various metrics. eg. "show service providers in the top 25% of Filecoin+ deals by deal count"`
)}

function _63(md){return(
md`### Cohort Analysis`
)}

function _64(md){return(
md`It would be interesting to divide storage providers and clients into "cohorts" for comparision between cohorts. Coupled with visualizations, it would be a great tool for measuring growth, churn, retension and other behaviours between cohorts.`
)}

function _65(md){return(
md`### Markov Process Modeling`
)}

function _66(md){return(
md`By defining "states" that providers or clients can transition to/from, it would be possible to do some interesting analysis and visualizing of state changes over time.

For example, it would be interesting to raise events whenever a previously large provider decided to drop off of the network. With that information available, it would be possible to ask them questions about why they did it?
`
)}

function _67(md){return(
md`### Server Provider Registration`
)}

function _68(md){return(
md`We could provide a way for providers to register and "claim" their address so they could submit verified metadata.`
)}

function _69(md){return(
md`### Auto-generate "Short Labels" for Providers`
)}

function _70(md){return(
md`It's nice to have a short label to append to the provider address to make it easier to differentiate them in lists. eg. f01137229: 'Korea, Dongducheon-si' - we can use some of our geographic information to add labels. Also quantiles, ranks, cohort and markov information might help a lot.`
)}

function _71(md){return(
md`### Label Providers Reachable via Slack`
)}

function _72(md){return(
md`Many providers are active in community forums and are helpful to work with when debugging deal problems and data transfer. If they "opt-in", it would be nice to associate their Slack handles with their providers to make it easier for people to get in touch with them.`
)}

function _73(md){return(
md`### Adjusted Deal Data`
)}

function _74(md){return(
md`Currently the deal data is based on "published deals". However, not all published deals get committed to sectors - there may be failures along the way. Additionally, sectors may get terminated early as providers shut down or get slashed. We could use additional data to generate numbers and reports that only include data for "successful deals" or "partially successful deals".`
)}

function _75(md){return(
md`## Visualizations`
)}

function _76(md){return(
md`### Sankey diagrams`
)}

function _77(md){return(
md `* https://observablehq.com/@d3/sankey`
)}

function _78(md){return(
md `It would be interesting to drill into a particular client, and see which providers they are using, or which regions the data is being stored in. Or to see what the piece sizes or file types are being stored by a provider, and if they are verified deals or not, and what notaries signed the verified deals, etc.`
)}

function _79(md){return(
md`### Deck.gl Globe`
)}

function _80(md){return(
md`We currently have some map visualizations, but we could also display a 3D interactive globe using Deck.gl.

* https://deck.gl/examples/globe-view/
* https://deck.gl/docs/api-reference/core/globe-view

Traceroute data combined with submarine cable maps could also be interesting...

* https://globe.gl/example/submarine-cables/
* https://submarine-cable-map-2021.telegeography.com/
* https://www.youtube.com/watch?v=9Y0N6cZHFvI
`
)}

function _81(md){return(
md`### Deck.gl Animated Arcs using WebGL Shaders`
)}

function _82(md){return(
md`This is super advanced, but there is a tutorial here on the technique:

* https://observablehq.com/@pessimistress/deck-gl-tutorial-subclassing-a-layer
`
)}

function _83(md){return(
md`### Voronoi Diagrams

Voronoi diagrams could be used to partition geographic space against service providers that match certain filters. Or to identify the closest locations of data stored on the network to you.

* https://en.wikipedia.org/wiki/Voronoi_diagram
* https://observablehq.com/@fil/geo-voronoi-interpolation
* https://observablehq.com/@fil/voronoi-with-gpu-js
* https://observablehq.com/@fil/direction-to-shore
* https://observablehq.com/@d3/hover-voronoi
* https://observablehq.com/@mbostock/the-delaunays-dual
`
)}

function _84(md){return(
md`### Graph Visualizations`
)}

function _85(md){return(
md`
It might be interesting to map providers and clients into a graph, and visualize that...

* https://js.cytoscape.org/
`
)}

function _86(md){return(
md`### Automate publishing of Provider Power Growth video`
)}

function _87(md){return(
md`
* https://observablehq.com/@jimpick/videos-provider-quest?collection=@jimpick/provider-quest
* https://bafybeicgs6duc5yrk6inbfhosi5r6hbwpijoxurlhvfvt32pr3o7oj7dgy.ipfs.dweb.link/filecoin-orbit-1.mp4
* https://github.com/jimpick/provider-quest-spark/tree/lily-miner-power (lily-miner-power branch)

For the 2021 Filecoin Orbit event, a video was created that showed the power growth over time on a map. It would be nice if the data could be updated continuously and videos could be assembled frame-by-frame on a server somewhere and automatically published on a regular basis.`
)}

function _88(md){return(
md`### Automate publishing of Published Deal video`
)}

function _89(md){return(
md`
* https://observablehq.com/@jimpick/videos-provider-quest?collection=@jimpick/provider-quest
* https://bafybeiawk5qceaux6443qsp6ggihki25vzojsxcfrhcv3n74yq63oy5cum.ipfs.dweb.link/filecoin-orbit-2.mp4

For the 2021 Filecoin Orbit event, a video was created that showed two weeks of deals over time on a map. It would be nice if the data could be updated continuously and videos could be assembled frame-by-frame on a server somewhere and automatically published on a regular basis. A full set of historical data could be published so that it would be possible to view the deal visualizations for time windows in the past.`
)}

function _90(md){return(
md`## Interactivity`
)}

function _91(md){return(
md`### Enhanced "Drill-down" in notebooks`
)}

function _92(md){return(
md`It would be nice to be able to click on a visualization and "drill-down" to see a focused view of the source of the data.

The Observable Plot based graphs do not have tooltips or event handlers for clicks. There does appear to be a way to add hover tooltips:

* https://observablehq.com/@fil/experimental-plot-tooltip-01
* https://github.com/observablehq/plot/issues/4 <= "I can't give a specific date but interaction is definitely on the roadmap."

Vega plots may be another option for adding interactivity, or even using D3 directly. Deck.gl comes with a "picking" system that can be used.
`
)}

function _93(md){return(
md`### Date Pickers`
)}

function _94(md){return(
md`Experiment with different "date picker" widgets on ObservableHQ to figure out what would work well for selecting dates and date ranges for historical data.`
)}

function _95(md){return(
md`### ~~Delayed re-rendering on Sunburst~~ (Implemented 2021-12-04)

The sunburst visualization is re-rendered in real-time when using the data slider, which hogs the CPU as it is very intensize, which makes it difficult to position the slider. Instead, wait for the value to settle for a second (using underscore?) before re-rendering.
`
)}

function _96(md){return(
md`## Analysis Platforms / Toolkits`
)}

function _97(md){return(
md`### Finos Perspective`
)}

function _98(md){return(
md`Output data into Apache Arrow format for use with a Finos Perspective based JavaScript web interface for flexible what-if querying and analysis - tables and visualizations. It can work with a server side component to proxy the heavy data crunching to the server side, and to stream the results to a web browser, or it can operate entirely browser-side.

* https://perspective.finos.org/
* https://github.com/jimpick/perspective-filecoin-asks (past project)
* https://github.com/jimpick/perspective-filecoin-remote-deals (past project)
* https://github.com/jimpick/perspective-filecoin-remote-deals/tree/slingshot (past project, slingshot branch)
`
)}

function _99(md){return(
md`### Microsoft SandDance`
)}

function _100(md){return(
md`SandDance can injest a large volume of granular data and has a powerful UI to generate all sorts of interesting visualizations.

* https://microsoft.github.io/SandDance/
* https://microsoft.github.io/SandDance/app/
* https://github.com/jimpick/perspective-filecoin-remote-deals/tree/main/sanddance (past project)
`
)}

function _101(md){return(
md`### Apache Superset`
)}

function _102(md){return(
md`
An visualization suite from Apache ... including some Deck.gl based ones.

* https://superset.apache.org/
* https://preset.io/
`
)}

function _103(md){return(
md`## Processing and Publishing Techniques`
)}

function _104(md){return(
md`### Auto-archiving input data to Estuary`
)}

function _105(md){return(
md`Currently, the input data is manually added to IPFS on a periodic basis (every few days) and pinned to Estuary manually using the web interface. It would be nice to automate this using the Estuary API, and also to archive/publish the CIDs and related deals as JSON files. The CIDs could even be used as data points for various types of testing.

As more and more JSON data accumulated in the \`input\` directory (currently around 8GiB), it may make sense to start archiving incrementally in chunks.
`
)}

function _106(md){return(
md`### Auto-archiving input data to Web3.Storage`
)}

function _107(md){return(
md`Additionally, the input data could be uploaded to Web3.Storage. Since Web3.Storage works as a direct upload instead of syncing via IPFS, this could involve a lot of data transfer day-over-day for duplicate data in snapshot. So Web3.Storage might be a better fit for incremental chunks.`
)}

function _108(md){return(
md`### Setup Apache Spark cluster`
)}

function _109(md){return(
md`Currently, the pyspark processing scripts in [GitHub: jimpick/provider-quest-spark](https://github.com/jimpick/provider-quest-spark) run on a single machine. However, if all of the input data is included back to the beginning of the Filecoin mainnet network, it can take more than a day to process all queries. It should be possible to set up and add several nodes to a Spark cluster to speed up the processing by using multiple machines.`
)}

function _110(md){return(
md`### Archive ObservableHQ notebook source to Git`
)}

function _111(md){return(
md`The notebooks are developed interactively directly on ObservableHQ. There doesn't seem to be a nice source code export facility built into ObservableHQ (vendor lock in?) ... however, there are VS Code extensions that allow one to download the source.

* https://github.com/RandomFractals/js-notebook-inspector
* https://github.com/GordonSmith/vscode-ojs

It should be possible to archive the code manually using the extension, and check it into a git repo, or to perhaps even automate it somehow.
`
)}

function _112(md){return(
md`### Publish HTML versions of notebooks to IPFS`
)}

function _113(md){return(
md`ObservableHQ has the ability to export a compiled version of the notebooks to an HTML file that can be published to a web page. We could export all the notebooks to have a version that would run independently from the IPFS public gateway. The navigation would break as all links point to observablehq.com, but perhaps the links could be re-written.`
)}

function _114(md){return(
md`### Use IPFS-published versions of scanning scripts`
)}

function _115(md){return(
md`Currently, the "scanning" scripts are executed by hitting the notebook URL on observablehq.com from within a Puppeteer session running in a virtual machine. This is not ideal as the scripts are run several times per hour, and will not be able to run if observablehq.com has any downtime. If they notebooks were published to IPFS, they could be loaded from the IPFS public gateway or a local IPFS gateway for maximum resiliency.`
)}

function _116(md){return(
md`### Make notebooks work with Dataflow compiler`
)}

function _117(md){return(
md`
The export feature on ObservableHQ still depends on the proprietary online compiler/bundler, but there is an open source re-implementation of the compiler and a project to support building notebooks outside of the ObservableHQ infrastructure:

* https://github.com/asg017/dataflow
* https://github.com/asg017/unofficial-observablehq-compiler

It doesn't support everything and bundling dependencies is tricky, so it will take some experimentation.
`
)}

function _118(md){return(
md`### Re-pin Textile Buckets output to IPFS/Filecoin + use DNS with dnslink records`
)}

function _119(md){return(
md`The published buckets have CIDs associated with them that could be re-pinned to IPFS pinning services to increase resiliency. Estuary is also an IPFS pinning service which also publishes deal to Filecoin.

Published CIDs could be written out as JSON files to keep a record. Notebooks could use this data to determine which CIDs to re-pin, and could write out API results from pinning services as additional JSON files.

The CIDs could be used to update DNS entries using dnslink records.

References to the Textile Hub HTTP gateway for the thread/buckets used from notebooks could be changed to instead refer to IPNS/dnslink URLs pointing at either the IPFS public gateway or a local IPFS gateway. This might be slower to resolve, but if they data is pinned to multiple providers, it should be very resilient.
`
)}

function _120(md){return(
md`### Extract some JS into npm libraries`
)}

function _121(md){return(
md`Some of the notebooks might have re-usable code that would be nice to publish for wider consumption as npm libraries.`
)}

function _122(md){return(
md`### Publish into binary formats`
)}

function _123(md){return(
md`Experiment with publishing some larger datasets using binary formats such as:

* Apache Arrow
* Apache Parquet
* IPLD + CBOR
* IPLD + HAMT or B-Trees
`
)}

function _124(md){return(
md`### Publish to Qri.io`
)}

function _125(md){return(
md`Qri is a publishing/distribution system built on libp2p/IPLD technologies that might be interesting for some of the datasets that are tabular in nature.

* https://qri.io/
`
)}

function _126(md){return(
md`### CRDT Consensus`
)}

function _127(md){return(
md`Enable collaborative editing of metadata using CRDT systems, eg.

* peer-base
* automerge
* merkle-CRDT on IPLD
`
)}

function _128(md){return(
md`## DevOps`
)}

function _129(md){return(
md`### Build OCI Containers (aka Docker Containers)`
)}

function _130(md){return(
md`Move the production scanning setup to a container-based setup. Possibly even try out Kubernetes.`
)}

function _131(md){return(
md`### Add Monitoring`
)}

function _132(md){return(
md`When there is breakage in the scanning setup, the monitoring system should detect it and raise an appropriate alert.`
)}

function _133(md){return(
md`### Self-host Textile Buckets`
)}

function _134(md){return(
md`Currently we use the Textile hosted Hub/Buckets API. It would be interesting to try to self-host.`
)}

function _135(md){return(
md`## Documentation and Presentations`
)}

function _136(md){return(
md`### Video "Tour of Provider.Quest" (5 minutes)`
)}

function _137(md){return(
md`Produce a short video which introduces the core concepts behind Provider.Quest and shows how the data is processed and how to use it.`
)}

function _138(md){return(
md`### Schema Documentation`
)}

function _139(md){return(
md`Produce better documentation for the schemas of the files that are published.`
)}

function _140(md){return(
md`## Imports`
)}

function _142(md){return(
md`## Backups`
)}

function _144(backups){return(
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
  main.variable(observer()).define(["md"], _29);
  main.variable(observer()).define(["md"], _30);
  main.variable(observer()).define(["md"], _31);
  main.variable(observer()).define(["md"], _32);
  main.variable(observer()).define(["md"], _33);
  main.variable(observer()).define(["md"], _34);
  main.variable(observer()).define(["md"], _35);
  main.variable(observer()).define(["md"], _36);
  main.variable(observer()).define(["md"], _37);
  main.variable(observer()).define(["md"], _38);
  main.variable(observer()).define(["md"], _39);
  main.variable(observer()).define(["md"], _40);
  main.variable(observer()).define(["md"], _41);
  main.variable(observer()).define(["md"], _42);
  main.variable(observer()).define(["md"], _43);
  main.variable(observer()).define(["md"], _44);
  main.variable(observer()).define(["md"], _45);
  main.variable(observer()).define(["md"], _46);
  main.variable(observer()).define(["md"], _47);
  main.variable(observer()).define(["md"], _48);
  main.variable(observer()).define(["md"], _49);
  main.variable(observer()).define(["md"], _50);
  main.variable(observer()).define(["md"], _51);
  main.variable(observer()).define(["md"], _52);
  main.variable(observer()).define(["md"], _53);
  main.variable(observer()).define(["md"], _54);
  main.variable(observer()).define(["md"], _55);
  main.variable(observer()).define(["md"], _56);
  main.variable(observer()).define(["md"], _57);
  main.variable(observer()).define(["md"], _58);
  main.variable(observer()).define(["md"], _59);
  main.variable(observer()).define(["md"], _60);
  main.variable(observer()).define(["md"], _61);
  main.variable(observer()).define(["md"], _62);
  main.variable(observer()).define(["md"], _63);
  main.variable(observer()).define(["md"], _64);
  main.variable(observer()).define(["md"], _65);
  main.variable(observer()).define(["md"], _66);
  main.variable(observer()).define(["md"], _67);
  main.variable(observer()).define(["md"], _68);
  main.variable(observer()).define(["md"], _69);
  main.variable(observer()).define(["md"], _70);
  main.variable(observer()).define(["md"], _71);
  main.variable(observer()).define(["md"], _72);
  main.variable(observer()).define(["md"], _73);
  main.variable(observer()).define(["md"], _74);
  main.variable(observer()).define(["md"], _75);
  main.variable(observer()).define(["md"], _76);
  main.variable(observer()).define(["md"], _77);
  main.variable(observer()).define(["md"], _78);
  main.variable(observer()).define(["md"], _79);
  main.variable(observer()).define(["md"], _80);
  main.variable(observer()).define(["md"], _81);
  main.variable(observer()).define(["md"], _82);
  main.variable(observer()).define(["md"], _83);
  main.variable(observer()).define(["md"], _84);
  main.variable(observer()).define(["md"], _85);
  main.variable(observer()).define(["md"], _86);
  main.variable(observer()).define(["md"], _87);
  main.variable(observer()).define(["md"], _88);
  main.variable(observer()).define(["md"], _89);
  main.variable(observer()).define(["md"], _90);
  main.variable(observer()).define(["md"], _91);
  main.variable(observer()).define(["md"], _92);
  main.variable(observer()).define(["md"], _93);
  main.variable(observer()).define(["md"], _94);
  main.variable(observer()).define(["md"], _95);
  main.variable(observer()).define(["md"], _96);
  main.variable(observer()).define(["md"], _97);
  main.variable(observer()).define(["md"], _98);
  main.variable(observer()).define(["md"], _99);
  main.variable(observer()).define(["md"], _100);
  main.variable(observer()).define(["md"], _101);
  main.variable(observer()).define(["md"], _102);
  main.variable(observer()).define(["md"], _103);
  main.variable(observer()).define(["md"], _104);
  main.variable(observer()).define(["md"], _105);
  main.variable(observer()).define(["md"], _106);
  main.variable(observer()).define(["md"], _107);
  main.variable(observer()).define(["md"], _108);
  main.variable(observer()).define(["md"], _109);
  main.variable(observer()).define(["md"], _110);
  main.variable(observer()).define(["md"], _111);
  main.variable(observer()).define(["md"], _112);
  main.variable(observer()).define(["md"], _113);
  main.variable(observer()).define(["md"], _114);
  main.variable(observer()).define(["md"], _115);
  main.variable(observer()).define(["md"], _116);
  main.variable(observer()).define(["md"], _117);
  main.variable(observer()).define(["md"], _118);
  main.variable(observer()).define(["md"], _119);
  main.variable(observer()).define(["md"], _120);
  main.variable(observer()).define(["md"], _121);
  main.variable(observer()).define(["md"], _122);
  main.variable(observer()).define(["md"], _123);
  main.variable(observer()).define(["md"], _124);
  main.variable(observer()).define(["md"], _125);
  main.variable(observer()).define(["md"], _126);
  main.variable(observer()).define(["md"], _127);
  main.variable(observer()).define(["md"], _128);
  main.variable(observer()).define(["md"], _129);
  main.variable(observer()).define(["md"], _130);
  main.variable(observer()).define(["md"], _131);
  main.variable(observer()).define(["md"], _132);
  main.variable(observer()).define(["md"], _133);
  main.variable(observer()).define(["md"], _134);
  main.variable(observer()).define(["md"], _135);
  main.variable(observer()).define(["md"], _136);
  main.variable(observer()).define(["md"], _137);
  main.variable(observer()).define(["md"], _138);
  main.variable(observer()).define(["md"], _139);
  main.variable(observer()).define(["md"], _140);
  const child1 = runtime.module(define1);
  main.import("quickMenu", child1);
  main.variable(observer()).define(["md"], _142);
  const child2 = runtime.module(define1);
  main.import("backups", child2);
  main.import("backupNowButton", child2);
  main.variable(observer()).define(["backups"], _144);
  return main;
}
