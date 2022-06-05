// https://observablehq.com/@jimpick/provider-quest-multiaddr-ip-tool@238
import define1 from "./5cf93b57a7444002@230.js";
import define2 from "./c4e4a355c53d2a1a@111.js";

function _1(md){return(
md`# Internal: Combiner: Multiaddr => IP Tool [Provider.Quest]`
)}

function _2(md){return(
md`This notebook combines the multiaddrs from the latest on-chain "miner info" records as well as the multiaddrs from the latest DHT scans + DNS lookups. The IP addresses are then extracted from the multiaddrs.`
)}

function _minerInfoSubsetLatestUrl(minerInfoSubsetLatestBucketUrl){return(
`${minerInfoSubsetLatestBucketUrl}/miner-info-subset-latest.json`
)}

async function _minerInfoSubsetLatest(minerInfoSubsetLatestUrl){return(
(await fetch(minerInfoSubsetLatestUrl)).json()
)}

function _6(minerInfoSubsetLatest){return(
minerInfoSubsetLatest
)}

function _dhtAddrsLatestUrl(dhtAddrsLatestBucketUrl){return(
`${dhtAddrsLatestBucketUrl}/dht-addrs-latest.json`
)}

async function _dhtAddrsLatest(dhtAddrsLatestUrl){return(
(await fetch(dhtAddrsLatestUrl)).json()
)}

function _minMinerInfoTimestamp(dateFns){return(
dateFns.subDays(new Date(), 7)
)}

function _minDhtTimestamp(dateFns){return(
dateFns.subDays(new Date(), 7)
)}

function _miners(minerInfoSubsetLatest,minMinerInfoTimestamp,dhtAddrsLatest,minDhtTimestamp)
{
  const miners = new Set()
  for (const miner in minerInfoSubsetLatest.miners) {
    const timestamp = new Date(minerInfoSubsetLatest.miners[miner].timestamp)
    if (timestamp < minMinerInfoTimestamp) continue
    if (minerInfoSubsetLatest.miners[miner].multiaddrsDecoded) {
      miners.add(miner)
    }
  }
  for (const miner in dhtAddrsLatest.miners) {
    const timestamp = new Date(dhtAddrsLatest.miners[miner].timestamp)
    if (timestamp < minDhtTimestamp) continue
    miners.add(miner)
  }
  return [...miners].sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)))
}


function _minersCombined(miners,minerInfoSubsetLatest,minMinerInfoTimestamp,dhtAddrsLatest,minDhtTimestamp){return(
miners.map(miner => {
  const record = { miner }
  let chain = minerInfoSubsetLatest.miners[miner] && {
    epoch: minerInfoSubsetLatest.miners[miner].epoch,
    timestamp: new Date(minerInfoSubsetLatest.miners[miner].timestamp),
    peerId: minerInfoSubsetLatest.miners[miner].peerId,
    multiaddrs: minerInfoSubsetLatest.miners[miner].multiaddrsDecoded,
    dnsLookups: minerInfoSubsetLatest.miners[miner].dnsLookups
  }
  if (chain && chain.timestamp < minMinerInfoTimestamp) chain = null
  let dht = dhtAddrsLatest.miners[miner] && {
    epoch: dhtAddrsLatest.miners[miner].epoch,
    timestamp: new Date(dhtAddrsLatest.miners[miner].timestamp),
    peerId: dhtAddrsLatest.miners[miner].peerId,
    multiaddrs: dhtAddrsLatest.miners[miner].multiaddrs,
    dnsLookups: dhtAddrsLatest.miners[miner].dnsLookups
  }
  if (dht && dht.timestamp < minDhtTimestamp) dht = null
  if (chain && dht && chain.peerId !== dht.peerId) {
    if (dht.timestamp < chain.timestamp) {
      dht = null
    } else {
      chain = null
    }
  }
  
  if (chain) record.chain = chain
  if (dht) record.dht = dht
  return record
})
)}

function _minerMultiaddrs(minersCombined,multiaddr,ip)
{
  const minerMultiaddrs = []
  for (const minerRecord of minersCombined) {
    const { miner } = minerRecord
    const multiaddrs = {}
    for (const chainOrDht of ["chain", "dht"]) {
      const record = minerRecord[chainOrDht]
      if (record && record.multiaddrs) {
        for (const maddr of record.multiaddrs) {
          try {
            const addr = multiaddr.multiaddr(maddr)
            const protos = addr.protos()
            const nodeAddress = addr.nodeAddress()
            multiaddrs[maddr] ||= {
              miner,
              maddr,
              peerId: record.peerId,
              protos,
              nodeAddress,
              timestamp: record.timestamp,
              epoch: record.epoch,
              ips: [],
              ipAttributes: {}
            }
            if (record.dnsLookups && !multiaddrs[maddr].dnsLookups) {
              multiaddrs[maddr].dnsLookups = record.dnsLookups
            }
            if (record.epoch > multiaddrs[maddr].epoch) {
              multiaddrs[maddr].epoch = record.epoch
              multiaddrs[maddr].timestamp = record.timestamp
              if (record.dnsLookups) {
                multiaddrs[maddr].dnsLookups = record.dnsLookups
              }
            }
            multiaddrs[maddr][chainOrDht] = true
            if (protos[0].name === 'ip4' || protos[0].name === 'ip6') {
              addIp(nodeAddress.address)
            }
            if (protos[0].name === 'dns4' || protos[0].name === 'dns6') {
              const dnsName = nodeAddress.address
              if (record.dnsLookups && record.dnsLookups[dnsName]) {
                const dnsLookups = record.dnsLookups[dnsName]
                for (const dnsLookup of dnsLookups) {
                  addIp(dnsLookup.address)
                }
              }
            }

            function addIp(ipAddress) {
              if (!ip.isPrivate(ipAddress) && ipAddress !== '0.0.0.0') {
                if (!multiaddrs[maddr].ips.includes(ipAddress)) {
                  multiaddrs[maddr].ips.push(ipAddress)
                }
                multiaddrs[maddr].ipAttributes[ipAddress] ||= {}
                multiaddrs[maddr].ipAttributes[ipAddress][chainOrDht] = true
                multiaddrs[maddr].ipAttributes[ipAddress].epoch ||= record.epoch
                multiaddrs[maddr].ipAttributes[ipAddress].timestamp ||= record.timestamp
                if (record.epoch > multiaddrs[maddr].ipAttributes[ipAddress].epoch) {
                  multiaddrs[maddr].ipAttributes[ipAddress].epoch = record.epoch
                  multiaddrs[maddr].ipAttributes[ipAddress].timestamp = record.timestamp
                }
              }
            }
          } catch (e) {
            console.info('Multiaddr exception', miner, maddr, e)
          }
        }
      }
    }
    for (const maddr in multiaddrs) {
      minerMultiaddrs.push(multiaddrs[maddr])
    }
  }
  return minerMultiaddrs
}


function _15(minerMultiaddrs){return(
minerMultiaddrs.filter(({ protos }) => protos[0].name === 'dns4')
)}

function _minerMultiaddrIps(minerMultiaddrs)
{
  const minerMultiaddrIps = []
  for (const minerMultiaddr of minerMultiaddrs) {
    for (const ipAddress of minerMultiaddr.ips) {
      const record = {
        miner: minerMultiaddr.miner,
        maddr: minerMultiaddr.maddr,
        peerId: minerMultiaddr.peerId,
        timestamp: minerMultiaddr.ipAttributes[ipAddress].timestamp.toISOString(),
        epoch: minerMultiaddr.ipAttributes[ipAddress].epoch,
        ip: ipAddress
      }
      if (minerMultiaddr.ipAttributes[ipAddress].chain) record.chain = true
      if (minerMultiaddr.ipAttributes[ipAddress].dht) record.dht = true
      minerMultiaddrIps.push(record)
    }
  }
  return minerMultiaddrIps
}


function _17(Inputs,minerMultiaddrIps){return(
Inputs.table(minerMultiaddrIps)
)}

function _18(md){return(
md`## Calculate Delta

Compare to previously published data and only output new rows.`
)}

async function _oldMultiaddrsIpsReport(multiaddrsIpsLatestBucketUrl){return(
(await fetch(`${multiaddrsIpsLatestBucketUrl}/multiaddrs-ips-latest.json`)).json()
)}

function _oldMultiaddrsIpsIndex(oldMultiaddrsIpsReport)
{
  const index = new Map()
  for (const { miner, maddr, ip, epoch } of oldMultiaddrsIpsReport.multiaddrsIps) {
    const key = `${miner},${maddr},${ip}`
    index.set(key, epoch)
  }
  return index
}


function _deltaMultiaddrsIps(minerMultiaddrIps,oldMultiaddrsIpsIndex){return(
minerMultiaddrIps.filter(({ miner, maddr, ip, epoch }) => {
  const key = `${miner},${maddr},${ip}`
  const oldRecordEpoch = oldMultiaddrsIpsIndex.get(key)
  return !oldRecordEpoch || oldRecordEpoch < epoch
})
)}

function _23(md){return(
md`## Imports`
)}

function _dateFns(require){return(
require('https://bundle.run/date-fns@2.22.1')
)}

function _multiaddr(require){return(
require('https://bundle.run/multiaddr@10.0.0')
)}

function _ip(require){return(
require('https://bundle.run/ip@1.1.5')
)}

function _27(md){return(
md`## Backups`
)}

function _29(backups){return(
backups()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  const child1 = runtime.module(define1);
  main.import("minerInfoSubsetLatestBucketUrl", child1);
  main.variable(observer("minerInfoSubsetLatestUrl")).define("minerInfoSubsetLatestUrl", ["minerInfoSubsetLatestBucketUrl"], _minerInfoSubsetLatestUrl);
  main.variable(observer("minerInfoSubsetLatest")).define("minerInfoSubsetLatest", ["minerInfoSubsetLatestUrl"], _minerInfoSubsetLatest);
  main.variable(observer()).define(["minerInfoSubsetLatest"], _6);
  const child2 = runtime.module(define1);
  main.import("dhtAddrsLatestBucketUrl", child2);
  main.variable(observer("dhtAddrsLatestUrl")).define("dhtAddrsLatestUrl", ["dhtAddrsLatestBucketUrl"], _dhtAddrsLatestUrl);
  main.variable(observer("dhtAddrsLatest")).define("dhtAddrsLatest", ["dhtAddrsLatestUrl"], _dhtAddrsLatest);
  main.variable(observer("minMinerInfoTimestamp")).define("minMinerInfoTimestamp", ["dateFns"], _minMinerInfoTimestamp);
  main.variable(observer("minDhtTimestamp")).define("minDhtTimestamp", ["dateFns"], _minDhtTimestamp);
  main.variable(observer("miners")).define("miners", ["minerInfoSubsetLatest","minMinerInfoTimestamp","dhtAddrsLatest","minDhtTimestamp"], _miners);
  main.variable(observer("minersCombined")).define("minersCombined", ["miners","minerInfoSubsetLatest","minMinerInfoTimestamp","dhtAddrsLatest","minDhtTimestamp"], _minersCombined);
  main.variable(observer("minerMultiaddrs")).define("minerMultiaddrs", ["minersCombined","multiaddr","ip"], _minerMultiaddrs);
  main.variable(observer()).define(["minerMultiaddrs"], _15);
  main.variable(observer("minerMultiaddrIps")).define("minerMultiaddrIps", ["minerMultiaddrs"], _minerMultiaddrIps);
  main.variable(observer()).define(["Inputs","minerMultiaddrIps"], _17);
  main.variable(observer()).define(["md"], _18);
  const child3 = runtime.module(define1);
  main.import("multiaddrsIpsLatestBucketUrl", child3);
  main.variable(observer("oldMultiaddrsIpsReport")).define("oldMultiaddrsIpsReport", ["multiaddrsIpsLatestBucketUrl"], _oldMultiaddrsIpsReport);
  main.variable(observer("oldMultiaddrsIpsIndex")).define("oldMultiaddrsIpsIndex", ["oldMultiaddrsIpsReport"], _oldMultiaddrsIpsIndex);
  main.variable(observer("deltaMultiaddrsIps")).define("deltaMultiaddrsIps", ["minerMultiaddrIps","oldMultiaddrsIpsIndex"], _deltaMultiaddrsIps);
  main.variable(observer()).define(["md"], _23);
  main.variable(observer("dateFns")).define("dateFns", ["require"], _dateFns);
  main.variable(observer("multiaddr")).define("multiaddr", ["require"], _multiaddr);
  main.variable(observer("ip")).define("ip", ["require"], _ip);
  main.variable(observer()).define(["md"], _27);
  const child4 = runtime.module(define2);
  main.import("backups", child4);
  main.import("backupNowButton", child4);
  main.variable(observer()).define(["backups"], _29);
  return main;
}
