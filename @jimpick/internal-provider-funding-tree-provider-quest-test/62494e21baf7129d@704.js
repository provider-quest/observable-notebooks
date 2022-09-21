// https://observablehq.com/@jimpick/internal-provider-funding-tree-provider-quest-test@704
function _1(md){return(
md`# Internal: Provider Funding Tree [Provider.Quest] - Test`
)}

function _2(md){return(
md`## Full Funder Tree`
)}

function _minersAndFundersUrl(){return(
'https://provider-quest.s3.us-west-2.amazonaws.com/miners-and-funders-2022-03-17.json'
)}

async function _allFundedWithMinerId(minersAndFundersUrl){return(
(await fetch(minersAndFundersUrl)).json()
)}

function _5(md){return(
md`Problem: We have multiple roots, some are probably because of a circular reference during the scan. Ideally we would have one root. FIXME: Investigate, see if we can fix references in the scanning phase.`
)}

function _roots(allFundedWithMinerId,sortIdRecords){return(
allFundedWithMinerId.filter(({ funded_from }) => !funded_from).sort(sortIdRecords)
)}

function _7(Inputs,roots){return(
Inputs.table(roots, { columns: [ "id", "address" ] })
)}

function _8(md){return(
md`Join all the individual roots together with a synthetic master root.`
)}

function _joinedAllFundedWithMinerId(allFundedWithMinerId){return(
allFundedWithMinerId
  .map(record => ({
    ...record,
    funded_from: record.funded_from || 'root'
  }))
  .concat([{
    id: "root",
    address: "root",
    funded_from: null,
    miner_id: null
  }])
)}

function _10(md){return(
md`Walk tree starting from \`root\` to find subset we are interested in.`
)}

function _reachable(d3,joinedAllFundedWithMinerId)
{
  const addressIndex = d3.index(joinedAllFundedWithMinerId, d => d.id)
  const fundedFromIndex = d3.group(joinedAllFundedWithMinerId, d => d.funded_from)
  const start = addressIndex.get('root')
  const reachable = []
  
  function walk (from) {
    reachable.push(from)
    // console.log('Walking', from.id)
    const fundedNodes = fundedFromIndex.get(from.address)
    // console.log('Funded Nodes', fundedNodes)
    if (fundedNodes) {
      for (const funded of fundedNodes) {
        walk(funded)
      }
    }
  }

  walk(start)

  return reachable
}


function _stratify(d3){return(
d3.stratify()
    .id(d => d["address"])
    .parentId(d => d["funded_from"])
)}

function _reachableTree(stratify,reachable){return(
stratify(reachable)
)}

function _15(md){return(
md`## Filtered Funder Tree`
)}

function _16(md){return(
md`Reduce tree to only include leaves for SPs that have power.`
)}

function _leavesWithPower(reachable,minerPowerDailyAverageReport){return(
reachable.filter(({ miner_id }) => minerPowerDailyAverageReport.miners[miner_id] && minerPowerDailyAverageReport.miners[miner_id].qualityAdjPower)
)}

function _reachableWithPower(d3,reachable,minerPowerDailyAverageReport,leavesWithPower,sortIdRecords)
{
  const addressIndex = d3.index(reachable, d => d.address)
  const filtered = new Map()
  
  function walkUp (node) {
    // console.log('WalkUp', node)
    filtered.set(node.id, {
      ...node,
      qualityAdjPower: minerPowerDailyAverageReport.miners[node.miner_id] && 
        minerPowerDailyAverageReport.miners[node.miner_id].qualityAdjPower
    })
    if (node.funded_from) {
      // console.log('funded_from', node.funded_from, addressIndex)
      walkUp(addressIndex.get(node.funded_from))
    }
  }

  for (const leaf of leavesWithPower) {
    walkUp(leaf)
  }

  return [...filtered.values()].sort(sortIdRecords)
}


function _reachableWithPowerTree(stratify,reachableWithPower){return(
stratify(reachableWithPower)
)}

function _shortCircuit1(){return(
true
)}

function _21(shortCircuit1,graph,reachableWithPowerTree,bytes){return(
!shortCircuit1 && graph(reachableWithPowerTree, {label: d => d.data.id + (d.data.miner_id ? ` (SP: ${d.data.miner_id} - ${bytes(d.data.qualityAdjPower, { mode: 'binary' })})` : '') })
)}

function _22(md){return(
md`## Filtered Funder Tree with Location Metadata`
)}

function _reachableWithPowerAndRegions(reachableWithPower,minerRegionsCSPReport){return(
reachableWithPower.map(record => {
  const newRecord = record
  if (record.miner_id) {
    const regions = minerRegionsCSPReport.minerRegions.filter(({ miner }) => miner === record.miner_id)
    if (regions.length > 0) {
      newRecord.regions = regions.map(({ region }) => region)
    }
  }
  return newRecord
})
)}

function _24(button,reachableWithPowerAndRegions){return(
button(reachableWithPowerAndRegions, 'funder-tree-base.json')
)}

function _reachableWithPowerAndRegionsTree(stratify,reachableWithPowerAndRegions){return(
stratify(reachableWithPowerAndRegions)
)}

function _shortCircuit2(){return(
true
)}

function _27(shortCircuit2,graph,reachableWithPowerAndRegionsTree,bytes){return(
!shortCircuit2 && graph(reachableWithPowerAndRegionsTree, {
  label: d => 
    (d.data.miner_id ?
     `SP: ${d.data.miner_id} - ${bytes(d.data.qualityAdjPower, { mode: 'binary' })}` : d.data.id) +
    (d.data.regions ?
     ` - ${d.data.regions.join(', ')}` : '')
})
)}

function _28(md){return(
md`## Funder Tree with Delegates`
)}

function _getTreeWithDelegatesStream(matchDelegate){return(
async function *getTreeWithDelegatesStream (tree) {
  const providerLeaves = []
  for (const provider of tree.leaves()) {
    if (!provider.data.regions) {
      providerLeaves.push(provider)
    }
  }
  let count = 0
  for (const provider of providerLeaves) {
    const delegateId = await matchDelegate(provider)
    console.log(`Delegate: ${provider.data.id} => ${delegateId}`)
    provider.data.delegateId = delegateId
    yield {
      done: false,
      processed: ++count,
      total: providerLeaves.length
    }
  }
  yield {
    done: true,
    tree
  }
}
)}

function _start(Inputs){return(
Inputs.button('Start')
)}

function _funderTreeWithDelegatesProgress(start,getTreeWithDelegatesStream,reachableWithPowerAndRegionsTree){return(
start && getTreeWithDelegatesStream(reachableWithPowerAndRegionsTree)
)}

function _funderTreeWithDelegates(funderTreeWithDelegatesProgress){return(
funderTreeWithDelegatesProgress && funderTreeWithDelegatesProgress.done ? funderTreeWithDelegatesProgress.tree : null
)}

function _34(md){return(
md`## Synthetic Provider Regions`
)}

function _providerCSPRegions(d3,minerRegionsCSPReport){return(
d3.group(minerRegionsCSPReport.minerRegions, d => d.miner)
)}

function _syntheticProviderCSPRegions(funderTreeWithDelegates,providerCSPRegions,sortProviderRecords)
{
  if (!funderTreeWithDelegates) return
  const providerRegionsWithDelegates = []
  for (const provider of funderTreeWithDelegates.leaves()) {
    const { miner_id: providerId, delegateId } = provider.data
    const targetId = delegateId || providerId
    const targetRegions = providerCSPRegions.get(targetId)
    if (targetRegions) {
      for (const region of targetRegions) {
        const outputRegion = {
          provider: providerId,
          region: region.region,
          numRegions: region.numRegions
        }
        if (delegateId) {
          outputRegion.delegate = delegateId
        }
        providerRegionsWithDelegates.push(outputRegion)
      }
    }
  }
  return providerRegionsWithDelegates.sort(sortProviderRecords)
}


function _37(syntheticProviderCSPRegions,button,minerRegionsCSPReport){return(
syntheticProviderCSPRegions && button(syntheticProviderCSPRegions, `synthetic-provider-country-state-province-${minerRegionsCSPReport.epoch}.json`)
)}

function _providerRegions(d3,minerRegionsReport){return(
d3.group(minerRegionsReport.minerRegions, d => d.miner)
)}

function _syntheticProviderRegions(funderTreeWithDelegates,providerRegions,sortProviderRecords)
{
  if (!funderTreeWithDelegates) return
  const providerRegionsWithDelegates = []
  for (const provider of funderTreeWithDelegates.leaves()) {
    const { miner_id: providerId, delegateId } = provider.data
    const targetId = delegateId || providerId
    const targetRegions = providerRegions.get(targetId)
    if (targetRegions) {
      for (const region of targetRegions) {
        const outputRegion = {
          provider: providerId,
          region: region.region,
          numRegions: region.numRegions
        }
        if (delegateId) {
          outputRegion.delegate = delegateId
        }
        providerRegionsWithDelegates.push(outputRegion)
      }
    }
  }
  return providerRegionsWithDelegates.sort(sortProviderRecords)
}


function _40(syntheticProviderRegions,button,minerRegionsReport){return(
syntheticProviderRegions && button(syntheticProviderRegions, `synthetic-provider-regions-${minerRegionsReport.epoch}.json`)
)}

function _41(md){return(
md`## Synthetic Provider Locations`
)}

function _providerCSPLocations(d3,minerLocationsCSPReport){return(
d3.group(minerLocationsCSPReport.minerLocations, d => d.miner)
)}

function _syntheticProviderCSPLocations(funderTreeWithDelegates,providerCSPLocations,sortProviderRecords)
{
  if (!funderTreeWithDelegates) return
  const providerLocationsWithDelegates = []
  for (const provider of funderTreeWithDelegates.leaves()) {
    const { miner_id: providerId, delegateId } = provider.data
    const targetId = delegateId || providerId
    const targetLocations = providerCSPLocations.get(targetId)
    if (targetLocations) {
      for (const location of targetLocations) {
        const { miner, ...rest } = location
        const outputLocation = {
          provider: providerId,
          ...rest
        }
        if (delegateId) {
          outputLocation.delegate = delegateId
        }
        providerLocationsWithDelegates.push(outputLocation)
      }
    }
  }
  return providerLocationsWithDelegates.sort(sortProviderRecords)
}


function _44(syntheticProviderCSPLocations,button,minerLocationsCSPReport){return(
syntheticProviderCSPLocations && button(syntheticProviderCSPLocations, `synthetic-provider-country-state-province-locations-${minerLocationsCSPReport.epoch}.json`)
)}

function _providerLocations(d3,minerLocationsReport){return(
d3.group(minerLocationsReport.minerLocations, d => d.miner)
)}

function _syntheticProviderLocations(funderTreeWithDelegates,providerLocations,sortProviderRecords)
{
  if (!funderTreeWithDelegates) return
  const providerLocationsWithDelegates = []
  for (const provider of funderTreeWithDelegates.leaves()) {
    const { miner_id: providerId, delegateId } = provider.data
    const targetId = delegateId || providerId
    const targetLocations = providerLocations.get(targetId)
    if (targetLocations) {
      for (const location of targetLocations) {
        const { miner, ...rest } = location
        const outputLocation = {
          provider: providerId,
          ...rest
        }
        if (delegateId) {
          outputLocation.delegate = delegateId
        }
        providerLocationsWithDelegates.push(outputLocation)
      }
    }
  }
  return providerLocationsWithDelegates.sort(sortProviderRecords)
}


function _47(syntheticProviderLocations,button,minerLocationsReport){return(
syntheticProviderLocations && button(syntheticProviderLocations, `synthetic-provider-locations-${minerLocationsReport.epoch}.json`)
)}

function _48(md){return(
md`## Imports and Data`
)}

async function _minerPowerDailyAverageReport(minerPowerDailyAverageLatestBucketUrl){return(
(await fetch(`${minerPowerDailyAverageLatestBucketUrl}/miner-power-daily-average-latest.json`)).json()
)}

function _52(geoIpLookupsBucketUrl){return(
geoIpLookupsBucketUrl
)}

async function _minerRegionsReport(geoIpLookupsBucketUrl){return(
(await fetch(`${geoIpLookupsBucketUrl}/miner-regions-latest.json`)).json()
)}

async function _minerRegionsCSPReport(geoIpLookupsBucketUrl){return(
(await fetch(`${geoIpLookupsBucketUrl}/provider-country-state-province-latest.json`)).json()
)}

async function _minerLocationsReport(geoIpLookupsBucketUrl){return(
(await fetch(`${geoIpLookupsBucketUrl}/miner-locations-latest.json`)).json()
)}

async function _minerLocationsCSPReport(geoIpLookupsBucketUrl){return(
(await fetch(`${geoIpLookupsBucketUrl}/provider-country-state-province-locations-latest.json`)).json()
)}

function _sortIdRecords(){return(
({ id: minerA }, { id: minerB }) => Number(minerA.slice(1)) - Number(minerB.slice(1))
)}

function _sortProviderRecords(){return(
({ provider: providerA }, { provider: providerB }) => Number(providerA.slice(1)) - Number(providerB.slice(1))
)}

async function _bytes(){return(
(await import('https://unpkg.com/@jimpick/bytes-iec@3.1.0-2?module')).default
)}

function _62(md){return(
md`## Backups`
)}

function _64(backups){return(
backups()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.define("module 1", async () => runtime.module((await import("./2af990f42af2602f@916.js")).default));
  main.define("module 2", async () => runtime.module((await import("./5cf93b57a7444002@282.js")).default));
  main.define("module 3", async () => runtime.module((await import("./13063df7b34879ca@856.js")).default));
  main.define("module 4", async () => runtime.module((await import("./bedb50933413e557@45.js")).default));
  main.define("module 5", async () => runtime.module((await import("./c4e4a355c53d2a1a@111.js")).default));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("minersAndFundersUrl")).define("minersAndFundersUrl", _minersAndFundersUrl);
  main.variable(observer("allFundedWithMinerId")).define("allFundedWithMinerId", ["minersAndFundersUrl"], _allFundedWithMinerId);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("roots")).define("roots", ["allFundedWithMinerId","sortIdRecords"], _roots);
  main.variable(observer()).define(["Inputs","roots"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer("joinedAllFundedWithMinerId")).define("joinedAllFundedWithMinerId", ["allFundedWithMinerId"], _joinedAllFundedWithMinerId);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer("reachable")).define("reachable", ["d3","joinedAllFundedWithMinerId"], _reachable);
  main.variable(observer("stratify")).define("stratify", ["d3"], _stratify);
  main.variable(observer("reachableTree")).define("reachableTree", ["stratify","reachable"], _reachableTree);
  main.variable(observer()).define(["md"], _15);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer("leavesWithPower")).define("leavesWithPower", ["reachable","minerPowerDailyAverageReport"], _leavesWithPower);
  main.variable(observer("reachableWithPower")).define("reachableWithPower", ["d3","reachable","minerPowerDailyAverageReport","leavesWithPower","sortIdRecords"], _reachableWithPower);
  main.variable(observer("reachableWithPowerTree")).define("reachableWithPowerTree", ["stratify","reachableWithPower"], _reachableWithPowerTree);
  main.variable(observer("shortCircuit1")).define("shortCircuit1", _shortCircuit1);
  main.variable(observer()).define(["shortCircuit1","graph","reachableWithPowerTree","bytes"], _21);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer("reachableWithPowerAndRegions")).define("reachableWithPowerAndRegions", ["reachableWithPower","minerRegionsCSPReport"], _reachableWithPowerAndRegions);
  main.variable(observer()).define(["button","reachableWithPowerAndRegions"], _24);
  main.variable(observer("reachableWithPowerAndRegionsTree")).define("reachableWithPowerAndRegionsTree", ["stratify","reachableWithPowerAndRegions"], _reachableWithPowerAndRegionsTree);
  main.variable(observer("shortCircuit2")).define("shortCircuit2", _shortCircuit2);
  main.variable(observer()).define(["shortCircuit2","graph","reachableWithPowerAndRegionsTree","bytes"], _27);
  main.variable(observer()).define(["md"], _28);
  main.define("matchDelegate", ["module 1", "@variable"], (_, v) => v.import("matchDelegate", _));
  main.variable(observer("getTreeWithDelegatesStream")).define("getTreeWithDelegatesStream", ["matchDelegate"], _getTreeWithDelegatesStream);
  main.variable(observer("viewof start")).define("viewof start", ["Inputs"], _start);
  main.variable(observer("start")).define("start", ["Generators", "viewof start"], (G, _) => G.input(_));
  main.variable(observer("funderTreeWithDelegatesProgress")).define("funderTreeWithDelegatesProgress", ["start","getTreeWithDelegatesStream","reachableWithPowerAndRegionsTree"], _funderTreeWithDelegatesProgress);
  main.variable(observer("funderTreeWithDelegates")).define("funderTreeWithDelegates", ["funderTreeWithDelegatesProgress"], _funderTreeWithDelegates);
  main.variable(observer()).define(["md"], _34);
  main.variable(observer("providerCSPRegions")).define("providerCSPRegions", ["d3","minerRegionsCSPReport"], _providerCSPRegions);
  main.variable(observer("syntheticProviderCSPRegions")).define("syntheticProviderCSPRegions", ["funderTreeWithDelegates","providerCSPRegions","sortProviderRecords"], _syntheticProviderCSPRegions);
  main.variable(observer()).define(["syntheticProviderCSPRegions","button","minerRegionsCSPReport"], _37);
  main.variable(observer("providerRegions")).define("providerRegions", ["d3","minerRegionsReport"], _providerRegions);
  main.variable(observer("syntheticProviderRegions")).define("syntheticProviderRegions", ["funderTreeWithDelegates","providerRegions","sortProviderRecords"], _syntheticProviderRegions);
  main.variable(observer()).define(["syntheticProviderRegions","button","minerRegionsReport"], _40);
  main.variable(observer()).define(["md"], _41);
  main.variable(observer("providerCSPLocations")).define("providerCSPLocations", ["d3","minerLocationsCSPReport"], _providerCSPLocations);
  main.variable(observer("syntheticProviderCSPLocations")).define("syntheticProviderCSPLocations", ["funderTreeWithDelegates","providerCSPLocations","sortProviderRecords"], _syntheticProviderCSPLocations);
  main.variable(observer()).define(["syntheticProviderCSPLocations","button","minerLocationsCSPReport"], _44);
  main.variable(observer("providerLocations")).define("providerLocations", ["d3","minerLocationsReport"], _providerLocations);
  main.variable(observer("syntheticProviderLocations")).define("syntheticProviderLocations", ["funderTreeWithDelegates","providerLocations","sortProviderRecords"], _syntheticProviderLocations);
  main.variable(observer()).define(["syntheticProviderLocations","button","minerLocationsReport"], _47);
  main.variable(observer()).define(["md"], _48);
  main.define("minerPowerDailyAverageLatestBucketUrl", ["module 2", "@variable"], (_, v) => v.import("minerPowerDailyAverageLatestBucketUrl", _));
  main.variable(observer("minerPowerDailyAverageReport")).define("minerPowerDailyAverageReport", ["minerPowerDailyAverageLatestBucketUrl"], _minerPowerDailyAverageReport);
  main.define("geoIpLookupsBucketUrl", ["module 2", "@variable"], (_, v) => v.import("geoIpLookupsBucketUrl", _));
  main.variable(observer()).define(["geoIpLookupsBucketUrl"], _52);
  main.variable(observer("minerRegionsReport")).define("minerRegionsReport", ["geoIpLookupsBucketUrl"], _minerRegionsReport);
  main.variable(observer("minerRegionsCSPReport")).define("minerRegionsCSPReport", ["geoIpLookupsBucketUrl"], _minerRegionsCSPReport);
  main.variable(observer("minerLocationsReport")).define("minerLocationsReport", ["geoIpLookupsBucketUrl"], _minerLocationsReport);
  main.variable(observer("minerLocationsCSPReport")).define("minerLocationsCSPReport", ["geoIpLookupsBucketUrl"], _minerLocationsCSPReport);
  main.variable(observer("sortIdRecords")).define("sortIdRecords", _sortIdRecords);
  main.variable(observer("sortProviderRecords")).define("sortProviderRecords", _sortProviderRecords);
  main.variable(observer("bytes")).define("bytes", _bytes);
  main.define("graph", ["module 3", "@variable"], (_, v) => v.import("graph", _));
  main.define("button", ["module 4", "@variable"], (_, v) => v.import("button", _));
  main.variable(observer()).define(["md"], _62);
  main.define("backups", ["module 5", "@variable"], (_, v) => v.import("backups", _));
  main.define("backupNowButton", ["module 5", "@variable"], (_, v) => v.import("backupNowButton", _));
  main.variable(observer()).define(["backups"], _64);
  return main;
}
