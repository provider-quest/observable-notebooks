import define1 from "./15fa16fc510b5dec@200.js";
import define2 from "./a957eb792b00ff81@406.js";
import define3 from "./c4e4a355c53d2a1a@111.js";

function _1(md){return(
md`# Internal: Scanner: Deals [Provider.Quest]`
)}

function _2(md){return(
md`This demo connects to a node running Lotus Filecoin implementation on the mainnet.`
)}

function _3(md){return(
md`If the connection is working, the following should retrieve the version and the block delay via a WebSocket using the [Lotus JS Client](https://github.com/filecoin-shipyard/js-lotus-client) libraries.`
)}

async function _4(client){return(
await client.version()
)}

async function _chainHead(client){return(
await client.chainHead()
)}

function _currentHeight(chainHead){return(
chainHead.Height
)}

function _headTipSet(chainHead){return(
chainHead.Cids
)}

function _selectedHeight(html,currentHeight){return(
html`<input type=range min=${currentHeight - 11000} max=${currentHeight - 1} value=${currentHeight - 1000}>`
)}

function _9(selectedHeight){return(
selectedHeight
)}

function _10(md,currentHeight,selectedHeight,dateFns,epochToDate){return(
md`${currentHeight - selectedHeight} epochs (${dateFns.formatDistance(epochToDate(currentHeight),  epochToDate(selectedHeight), { includeSeconds: true })})`
)}

function _start(Inputs){return(
Inputs.button("Start")
)}

function _maxElapsed(){return(
6 * 60 * 1000
)}

function _heightRangeStream(start,selectedHeight,currentHeight){return(
async function * heightRangeStream() {
  if (start > 0) {
    for (let height = selectedHeight; height < currentHeight; height++) {
      yield height
    }
  }
}
)}

function _tipSetStream(heightRangeStream,client,headTipSet){return(
async function * tipSetStream() {
  for await (const height of heightRangeStream()) {
    const tipSet = await client.chainGetTipSetByHeight(height, headTipSet)
    yield {
      height,
      tipSet
    }
  }
}
)}

function _tipSets()
{
  const result = []
  /* for await (const tipSet of tipSetStream()) {
    result.push(tipSet)
  } */
  return result
  
}


function _messagesStream(tipSetStream,currentHeight,maxElapsed,selectedHeight,client,decodeDeals,cbor){return(
async function* messagesStream() {
  let hits = 0
  let messagesProcessed = 0
  const startTime = new Date()
  for await (const tipSetRecord of tipSetStream()) {
    const seenMessages = new Set()
    const selectedTipSet = tipSetRecord.tipSet
    let cso
    let csoStartTime
    if (selectedTipSet.Cids) {
      const height = selectedTipSet.Height
      console.log(`${height}, ${currentHeight - height} remaining`)
      for (let i = 0; i < selectedTipSet.Cids.length; i++) {
        const blockCid = selectedTipSet.Cids[i]
        const blockMiner = selectedTipSet.Blocks[i].Miner
        const now = new Date()
        if (now - startTime > maxElapsed) {
          yield {
            done: true,
            timeout: true
          }
          return
        }
        yield {
          height,
          blockMiner,
          i,
          length: selectedTipSet.Cids.length,
          startHeight: selectedHeight,
          endHeight: currentHeight,
          messagesProcessed,
          hits
        }
        try {
          const messages = await client.chainGetBlockMessages(blockCid)
          for (const message of messages.BlsMessages) {
            yield *yieldMessage(message, 'bls')
          }
        } catch (e) {
          console.error('messages error', height, e)
        }
        /* Non-miners shouldn't publish deals
        for (const { Message: message } of messages.SecpkMessages) {
          yield *yieldMessage(message, 'secpk')
        }
        */
  
        async function *yieldMessage (message, signatureType) {
          messagesProcessed++
          if (message.To === 'f05' && message.Method === 4) {
            console.log('JimX message', message)
            const blockCidStr = blockCid['/']
            const messageCidStr = message.CID['/']
            if (seenMessages.has(messageCidStr)) return
            hits++
            seenMessages.add(messageCidStr)

            if (!cso) {
              // Compute state to get results
              console.log('StateCompute', height)
              csoStartTime = new Date()
              cso = client.stateCompute(height, null, selectedTipSet.Cids)
            }
            const trace = (await cso).Trace.filter(({ MsgCid }) => MsgCid['/'] === messageCidStr)
            console.log('StateCompute done', height, (await cso).Trace.length, ((new Date()) - csoStartTime) / 1000)

            if (trace.length > 0 && trace[0].MsgRct.Return) {
              yield {
                height,
                messageCid: messageCidStr,
                // signatureType,
                blockCid: blockCidStr,
                version: message.Version,
                to: message.To,
                from: message.From,
                nonce: message.Nonce,
                value: message.Value,
                gasLimit: message.GasLimit,
                gasFeeCap: message.GasFeeCap,
                gasPremium: message.GasPremium,
                method: message.Method,
                params: message.Params,
                decodedDeals: decodeDeals(message.Params),
                results: cbor.decode(trace[0].MsgRct.Return, 'base64')[0]
              }
            } else {
              console.error('Missing or broken trace', height, messageCidStr)
            }
          }
        }
      }
    }
  }
  yield { done: true }
}
)}

function _messages()
{
  const result = []
  /* for await (const message of messagesStream()) {
    if (message.messageCid) {
      result.push(message)
      yield result
    }
  } */
}


function _dealStream(messagesStream,epochToDate){return(
async function* dealStream() {
  for await (const message of messagesStream()) {
    if (message.startHeight) {
      yield {
        height: message.height,
        startHeight: message.startHeight,
        endHeight: message.endHeight,
        messagesProcessed: message.messagesProcessed,
        messageHits: message.hits
      }
    }
    if (message.decodedDeals) {
      const messageTime = epochToDate(message.height).toISOString()
      for (let i = 0; i < message.decodedDeals.length; i++) {
        yield {
          dealId: message.results[i],
          messageHeight: message.height,
          messageTime,
          messageCid: message.messageCid,
          ...message.decodedDeals[i],
          startTime: epochToDate(message.decodedDeals[i].startEpoch).toISOString(),
          endTime: epochToDate(message.decodedDeals[i].endEpoch).toISOString()
        }
      }
    }
  }
}
)}

function _22(deals,dateFns){return(
deals.state === 'done' ? `Done. ${deals.endHeight - deals.lastHeight} epochs remaining.` : `${dateFns.formatDistance(deals.elapsed * 1000, 0)} - ${deals.height}, ${deals.endHeight - deals.height} remaining`
)}

async function* _deals(start,dealStream,dateFns)
{
  if (start === 0) {
    yield {
      state: 'paused'
    }
    return
  }
  yield {
    state: 'starting'
  } 
  const deals = []
  const startTime = new Date()
  let height
  let startHeight
  let endHeight
  let messagesProcessed
  let messageHits
  for await (const deal of dealStream()) {
    if (deal.height) {
      height = deal.height
      startHeight = deal.startHeight
      endHeight = deal.endHeight
      messagesProcessed = deal.messagesProcessed
      messageHits = deal.messageHits
    }
    if (deal.dealId) {
      deals.push(deal)
    }
    yield {
      state: 'streaming',
      elapsed: ((new Date()) - startTime) / 1000,
      dealsLength: deals.length,
      height,
      startHeight,
      endHeight,
      messagesProcessed,
      messageHits
    }    
  }
  const endTime = new Date()
  yield {
    state: 'done',
    elapsed: (endTime - startTime) / 1000,
    deals,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    lastHeight: height,
    startHeight,
    endHeight,
    messagesProcessed,
    messageHits
  }
  console.log('Done.', dateFns.formatDistance(endTime, startTime))
}


function _24(md){return(
md`# Setting up Lotus JS Client

The following three stanzas import the library from npm.`
)}

async function _LotusRPC(){return(
(await import('https://unpkg.com/@filecoin-shipyard/lotus-client-rpc?module')).LotusRPC
)}

async function _BrowserProvider(){return(
(await import('https://unpkg.com/@filecoin-shipyard/lotus-client-provider-browser?module')).BrowserProvider
)}

async function _schema(){return(
(await import('https://unpkg.com/@filecoin-shipyard/lotus-client-schema?module')).mainnet.fullNode
)}

function _28(md){return(
md`Here is the list of methods from the schema file. Currently just a subset of the available methods in the Lotus JSON-RPC API, but any method can be added.`
)}

function _29(schema){return(
Object.keys(schema.methods)
)}

function _30(md){return(
md`To make a client object to make calls with, you supply an endpoint url to make a websocket connection to the Lotus node to the RPC library, and supply a provider object (contains the websocket code) and a schema.`
)}

function _endpointUrl()
{
  return "https://lotus.miner.report/mainnet_api/0/node/rpc/v0"
  // return "https://lotus.jimpick.com/mainnet_api/0/node/rpc/v0"
  // return "https://api.node.glif.io/rpc/v0"
  // return "wss://api.chain.love/rpc/v0"
}


function _client(BrowserProvider,endpointUrl,LotusRPC,schema)
{
  const provider = new BrowserProvider(endpointUrl)
  return new LotusRPC(provider, { schema })
}


function _33(md){return(
md`# More imports`
)}

function _cbor(){return(
import('https://cdn.skypack.dev/borc')
)}

function _dateFns(require){return(
require('https://bundle.run/date-fns@2.22.1')
)}

function _38(md){return(
md`## Backups`
)}

function _40(backups){return(
backups()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["client"], _4);
  main.variable(observer("chainHead")).define("chainHead", ["client"], _chainHead);
  main.variable(observer("currentHeight")).define("currentHeight", ["chainHead"], _currentHeight);
  main.variable(observer("headTipSet")).define("headTipSet", ["chainHead"], _headTipSet);
  main.variable(observer("viewof selectedHeight")).define("viewof selectedHeight", ["html","currentHeight"], _selectedHeight);
  main.variable(observer("selectedHeight")).define("selectedHeight", ["Generators", "viewof selectedHeight"], (G, _) => G.input(_));
  main.variable(observer()).define(["selectedHeight"], _9);
  main.variable(observer()).define(["md","currentHeight","selectedHeight","dateFns","epochToDate"], _10);
  main.variable(observer("viewof start")).define("viewof start", ["Inputs"], _start);
  main.variable(observer("start")).define("start", ["Generators", "viewof start"], (G, _) => G.input(_));
  main.variable(observer("maxElapsed")).define("maxElapsed", _maxElapsed);
  main.variable(observer("heightRangeStream")).define("heightRangeStream", ["start","selectedHeight","currentHeight"], _heightRangeStream);
  main.variable(observer("tipSetStream")).define("tipSetStream", ["heightRangeStream","client","headTipSet"], _tipSetStream);
  main.variable(observer("tipSets")).define("tipSets", _tipSets);
  main.variable(observer("messagesStream")).define("messagesStream", ["tipSetStream","currentHeight","maxElapsed","selectedHeight","client","decodeDeals","cbor"], _messagesStream);
  main.variable(observer("messages")).define("messages", _messages);
  main.variable(observer("dealStream")).define("dealStream", ["messagesStream","epochToDate"], _dealStream);
  main.variable(observer()).define(["deals","dateFns"], _22);
  main.variable(observer("deals")).define("deals", ["start","dealStream","dateFns"], _deals);
  main.variable(observer()).define(["md"], _24);
  main.variable(observer("LotusRPC")).define("LotusRPC", _LotusRPC);
  main.variable(observer("BrowserProvider")).define("BrowserProvider", _BrowserProvider);
  main.variable(observer("schema")).define("schema", _schema);
  main.variable(observer()).define(["md"], _28);
  main.variable(observer()).define(["schema"], _29);
  main.variable(observer()).define(["md"], _30);
  main.variable(observer("endpointUrl")).define("endpointUrl", _endpointUrl);
  main.variable(observer("client")).define("client", ["BrowserProvider","endpointUrl","LotusRPC","schema"], _client);
  main.variable(observer()).define(["md"], _33);
  const child1 = runtime.module(define1);
  main.import("decodeDeals", child1);
  main.variable(observer("cbor")).define("cbor", _cbor);
  const child2 = runtime.module(define2);
  main.import("epochToDate", child2);
  main.variable(observer("dateFns")).define("dateFns", ["require"], _dateFns);
  main.variable(observer()).define(["md"], _38);
  const child3 = runtime.module(define3);
  main.import("backups", child3);
  main.import("backupNowButton", child3);
  main.variable(observer()).define(["backups"], _40);
  return main;
}
