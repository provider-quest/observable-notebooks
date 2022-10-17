import define1 from "./9a34a4df6e8a276b@50.js";
import define2 from "./c4e4a355c53d2a1a@111.js";

function _1(md){return(
md`# FVM Actor Code Playground - SimpleCoin EVM Contract`
)}

function _2(md){return(
md`Try making your own custom Filecoin actor for the [Filecoin Virtual Machine](https://fvm.filecoin.io/)!

Here is an example EVM Smart Contract, from:

* https://github.com/filecoin-project/testnet-wallaby/issues/9

You can modify it here, then scroll down and click the buttons to compile it, then load it into a on-demand hosted [Lotus localnet](https://lotus.filecoin.io/developers/local-network/) created from the [experimental/fvm-m2](https://github.com/filecoin-project/lotus/tree/experimental/fvm-m2) branch, and invoke methods against it.

**Note:** The on-demand localnet will be reclaimed after 3 minutes of inactivity. Modifications to the blockchain state are ephemeral -- good for testing! Staying on this page will keep it alive, but if you navigate away and then return, it may get restarted with fresh state. If that happens, reload the web page. There is one instance of the localnet shared between all users.`
)}

function _3(md){return(
md`Video demo:

* YouTube: [FVM Foundry Update: FEVM Actor Example with Fil-der Jim Pick](https://www.youtube.com/watch?v=IN3zGTiFFK8)`
)}

function _4(md){return(
md`## Step 1: Edit Smart Contract Code - simplecoin.sol

Feel free to modify this smart contract code (written in Solidity). Don't worry, you can't break anything. 
`
)}

async function _editor(skypack,simpleCoinSol)
{
  const {EditorState, EditorView, basicSetup} = await skypack('@codemirror/next/basic-setup')
  // const {basicSetup} = await skypack('codemirror')
  // const {EditorView} = await skypack('@codemirror/view')
  // const {EditorState} = await skypack('@codemirror/state')
  // const {EditorState, EditorView, basicSetup} = await skypack('@codemirror/basic-setup@0.19.0')
  // const {solidity} = await skypack('@replit/codemirror-lang-solidity')

  let lastValue
  const updateViewOf = EditorView.updateListener.of((update) => {
    const {dom} = update.view
    dom.value = update
    const newValue = update.state.doc.toString()
    if (newValue !== lastValue) {
      dom.dispatchEvent(new CustomEvent('input'))
      lastValue = newValue
    }
  })

  const initialCode = simpleCoinSol
  
  const view = new EditorView({
    state: EditorState.create({
      doc: initialCode,
      extensions: [basicSetup, updateViewOf]
      // extensions: [basicSetup, solidity, updateViewOf]
    })
  })
  
  return view.dom
}


function _6(md){return(
md`If you have changed the code and would like to save it for future use, you can use this button to save it to a file.`
)}

function _7(html,button,editor){return(
html`Optional: ${button(editor.state.doc.toString(), `contract.sol`)}`
)}

function _8(md){return(
md`**Pro-tip:** *You can also "fork" this notebook and use the saved file as an attachment.*`
)}

function _9(md){return(
md`## Step 2: Compile

We have implemented a [simple web service](https://github.com/jimpick/lotus-fvm-localnet-web/blob/main/server.mjs) that accepts a HTTP POST with the code above, and runs it through the Solidity compiler, returning compiled EVM bytecode (encoded in base64). It should compile quickly.`
)}

function _compileToEvmBytecodeButton(editor,Inputs)
{
  const code = editor.state.doc.toString()
  return Inputs.button('Compile to EVM Bytecode', {value: null, reduce: () => code})
}


async function* _11(compileStatus,md,Promises,html,stripAnsi)
{
  if (compileStatus === undefined || !compileStatus) {
    yield md`Status: Code is ready to upload to the compiling service. Not compiled yet.`
    return
  }
  if (compileStatus.compiling) {
    while (true) {
      const elapsed = (Date.now() - compileStatus.start) / 1000
      yield md`Compiling on remote server... (${elapsed.toFixed(1)}s)`
      await Promises.delay(1000)
    }
  }
  if (compileStatus.success) {
    yield html`<div><b>Successfully compiled!</b></div>
    <div>Compile time: ${(compileStatus.elapsed / 1000).toFixed(1)}s
    <div>Compile log:</div>
    <pre>${stripAnsi(compileStatus.logs)}</pre>`
  }
  if (compileStatus.error) {
    yield html`<div><b>**Error!**</b></div>
    <div>Compile log:</div>
    <pre>${stripAnsi(compileStatus.error)}</pre>`
  }
}


function _12(compileStatus,md)
{
  return compileStatus?.evmSignatures ? md`**Signatures:**\n\n\`\`\`\n${compileStatus.evmSignatures}\n\`\`\`` : md``
}


async function* _compileStatus(compileToEvmBytecodeButton,baseUrl,buffer)
{
  if (compileToEvmBytecodeButton) {
    const start = Date.now()
    yield {
      compiling: true,
      start
    }
    try {
      const response = await fetch(`${baseUrl}/compile-evm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'contract.sol': compileToEvmBytecodeButton
        })
      })
      const results = await response.json()
      results.elapsed = Date.now() - start
      if (results.success) {
        results.evmBinary = buffer.Buffer.from(results.evmBinary, 'hex')
      }
      yield results
    } catch (e) {
      yield {
        error: e.message
      }
    }
  }
}


function _14(md){return(
md`## Step 3: Connect to Hosted "localnet"

This notebook connects to a [hosted instance](https://github.com/jimpick/lotus-fvm-localnet-web) of a Lotus "localnet" (started on demand) into which you can install the actor code, create an actor instance, and invoke methods against.

If the localnet is started and online, the following chain height should be increasing every 4-10 seconds (depending on system load):`
)}

function _15(md,currentHeight){return(
md`**Height: ${currentHeight}**`
)}

function _16(md){return(
md`If the connection is working, then proceed to the next step.`
)}

function _17(md){return(
md`## Step 4: Create an EVM Actor Instance`
)}

function _18(md){return(
md`Now we can create an actor instance from the compiled EVM smart contract. It is possible to create lots and lots of actors using the same code, each will get assigned a unique "ID Address" (eg. t01001) to which messages and funds can be sent, as well as an equivalent "Robust Address" alias (eg. "t2...") which maps on the same address (but doesn't change in the event of a chain re-organization).`
)}

function _19(md){return(
md`At the command line, this is the same as: \`lotus chain create-evm-actor <bytecode file>\``
)}

function _createActorButton(Inputs,compileStatus,ready){return(
Inputs.button(
  'Create EVM Actor',
  {
    disabled: !compileStatus || !compileStatus.evmBinary || !ready
  }
)
)}

async function* _21(createActorStatus,md,Promises,html)
{
  if (createActorStatus === undefined || !createActorStatus) {
    yield md`Status: Instance has not been created yet.`
    return
  }
  if (createActorStatus.creating) {
    while (true) {
      const elapsed = (Date.now() - createActorStatus.start) / 1000
      yield md`Sending create actor message... (${elapsed.toFixed(1)}s)`
      await Promises.delay(1000)
    }
  }
  if (createActorStatus.response) {
    while (true) {
      let output = `<div><b>Create actor message sent</b></div>
      <div>Message CID: ${createActorStatus.response.CID['/']}</div>
      `
      if (createActorStatus.waitResponse) {
        output += `<div>Message executed in block at height: ${createActorStatus.waitResponse.Height}</div>`
        output += `<div>Gas used: ${createActorStatus.waitResponse.Receipt.GasUsed}</div>`
        output += `<div>Robust Address: ${createActorStatus.waitResponse.ReturnDec.RobustAddress}</div>`
        output += `<b><div>ID Address: ${createActorStatus.waitResponse.ReturnDec.IDAddress}</div></b>`
        yield html`${output}`
        break
      }
      const elapsed = (Date.now() - createActorStatus.waitStart) / 1000
      output += `<div>Waiting for message to be executed in a block... (${elapsed.toFixed(1)}s)</div>`
      yield html`${output}`
      await Promises.delay(1000)
    }
  }
}


function _22(md){return(
md`---`
)}

function _evmActorCidBytes(buffer){return(
buffer.Buffer.from('0155a0e40220181b777f5ef350eec940db54a56b2a4e685f357f54ffa73f34e72e575baaeba9', 'hex')
)}

function _evmActorCid(multiformats,evmActorCidBytes){return(
multiformats.CID.decode(evmActorCidBytes)
)}

function _25(evmActorCid){return(
evmActorCid.toString()
)}

function _evmBytes(compileStatus)
{
  return compileStatus?.evmBinary
  // return new Uint8Array(await FileAttachment("simplecoin.bin").arrayBuffer())
}


function _evmBytesCbor(cbor,evmBytes){return(
cbor.encode([evmBytes])
)}

async function* _createActorStatus(createActorButton,evmActorCid,cbor,evmBytesCbor,walletDefaultAddress,client)
{
  if (createActorButton) {
    console.log('Create actor')
    const start = Date.now()
    yield {
      creating: true,
      start
    }
    // Needs a zero byte in front
    const evmActorCidBytes = new Uint8Array(evmActorCid.bytes.length + 1)
    evmActorCidBytes.set(evmActorCid.bytes, 1)
    const params = cbor.encode([new cbor.Tagged(42, evmActorCidBytes), evmBytesCbor])
    // Sending create actor message...
    const messageBody = {
      To: 't01',
      From: walletDefaultAddress,
      Value: "0",
      Method: 2,
      Params: params.toString('base64')
    }
    console.log('messageBody', messageBody)
    const response = await client.mpoolPushMessage(messageBody, null)
    const waitStart = Date.now()
    yield { waiting: true, waitStart, response }
    const waitResponse = await client.stateWaitMsg(response.CID, 0)
    yield { installed: true, response, waitResponse }
  }
}


function _29(md){return(
md`**Reference:** Lotus CLI implementation for \`lotus chain create-evm-actor\`: https://github.com/filecoin-project/lotus/blob/65581c5aacd0f5e61e1cd9363310a1b0655b9611/cli/chain.go#L1773`
)}

function _30(md){return(
md`## Step 5: Invoke a method to get the balance for an address`
)}

function _31(md){return(
md`Now that we've got an actor running with an ID Address, we can call the methods we have defined. Let's check the balance of the addresses. The method signature (from above) to get the balance is => \`f8b2cb4f: getBalance(address)\``
)}

function _invokeParams(Inputs){return(
Inputs.select(
  [
    {
      label: 'Owner t0100 (0x64)',
      value: '000000000000000000000000ff00000000000000000000000000000000000064'
    },
    {
      label: 'Non-owner t0101 (0x65)',
      value: '000000000000000000000000ff00000000000000000000000000000000000065'
    }
  ],
  {
    label: "Address",
    format: x => x.label
  }
)
)}

function _33(md,createActorStatus,invokeParams){return(
md`From the Lotus command line, we could call the method like this:

\`./lotus chain invoke-evm-actor ${createActorStatus.waitResponse.ReturnDec.IDAddress} f8b2cb4f ${invokeParams.value}\``
)}

function _invokeEvmMethodButton(Inputs,createActorStatus){return(
Inputs.button('Invoke EVM Method', {
  disabled: !createActorStatus ||
    !createActorStatus.waitResponse ||
    !createActorStatus.waitResponse.ReturnDec ||
    !createActorStatus.waitResponse.ReturnDec.IDAddress,
  value: null,
  reduce: () => createActorStatus.waitResponse.ReturnDec.IDAddress
})
)}

async function* _35(invokeEvmMethodStatus,md,Promises,invokeEvmMethodButton,html)
{
  if (invokeEvmMethodStatus === undefined || !invokeEvmMethodStatus) {
    yield md`Status: Method has not been invoked yet.`
    return
  }
  if (invokeEvmMethodStatus.invoking) {
    while (true) {
      const elapsed = (Date.now() - invokeEvmMethodStatus.start) / 1000
      yield md`Sending message to actor for method... (${elapsed.toFixed(1)}s)`
      await Promises.delay(1000)
    }
  }
  if (invokeEvmMethodStatus.response) {
    while (true) {
      let output = `<div><b>Message sent to actor</b></div>
      <div>To: ${invokeEvmMethodButton}</div>
      <div>Method: 2</div>
      <div>Params:
        <ul style="font-size: 80%">
          <li>Address: ${invokeEvmMethodStatus.address}</li>
        </ul>
      </div>
      <div>Message CID: ${invokeEvmMethodStatus.response.CID['/']}</div>
      `
      if (invokeEvmMethodStatus.waitResponse) {
        output += `<div>Message executed in block at height: ${invokeEvmMethodStatus.waitResponse.Height}</div>`
        output += `<div>Gas used: ${invokeEvmMethodStatus.waitResponse.Receipt.GasUsed}</div>`
        output += `<div>Return: ${invokeEvmMethodStatus.waitResponse.Receipt.Return} (Base64 encoded binary array)</div>`
        output += `<div><b>Decoded Result (Hex):</b> <b style="font-size: 100%">${JSON.stringify(invokeEvmMethodStatus.decodedResult.toString('hex'))}</b></div>`
        output += `<div><b>Decoded Result (Decimal):</b> <b style="font-size: 100%">${Number(`0x${invokeEvmMethodStatus.decodedResult.toString('hex')}`)} coins</b></div>`
        yield html`${output}`
        break
      }
      const elapsed = (Date.now() - invokeEvmMethodStatus.waitStart) / 1000
      output += `<div>Waiting for message to be executed in a block... (${elapsed.toFixed(1)}s)</div>`
      yield html`${output}`
      await Promises.delay(1000)
    }
  }
}


function _36(md){return(
md`Initial expected results:

* For Owner (0x64) ... it should return a value of "0x0..2710" (0x2710 = 10000, as there are initially 10,000 coins associated with the owner address)
* For Non-Owner (0x65) ... it should return a value of "0x0..0000" (the are no coins associated with the non-owner address)`
)}

function _37(md){return(
md`---`
)}

async function* _invokeEvmMethodStatus(invokeEvmMethodButton,$0,buffer,walletDefaultAddress,client)
{
  if (invokeEvmMethodButton) {
    const start = Date.now()
    const address = $0.value.value
    yield {
      invoking: true,
      address,
      start
    }
    const params = buffer.Buffer.concat([
      buffer.Buffer.from('f8b2cb4f', 'hex'),
      buffer.Buffer.from(address, 'hex')]
    )
    const messageBody = {
      To: invokeEvmMethodButton,
      From: walletDefaultAddress,
      Value: "0",
      Method: 2,
      Params: params.toString('base64')
    }
    console.log('messageBody', messageBody)
    const response = await client.mpoolPushMessage(messageBody, null)
    const waitStart = Date.now()
    yield { waiting: true, waitStart, address, response }
    const waitResponse = await client.stateWaitMsg(response.CID, 0)
    let decodedResult
    if (waitResponse.Receipt && waitResponse.Receipt.Return) {
      decodedResult = buffer.Buffer.from(waitResponse.Receipt.Return, 'base64')
    }
    yield { invoked: true, address, response, waitResponse, decodedResult }
  }
}


function _39(md){return(
md`**Reference:** Lotus CLI implementation for \`lotus chain invoke-evm-actor\`: https://github.com/filecoin-project/lotus/blob/65581c5aacd0f5e61e1cd9363310a1b0655b9611/cli/chain.go#L1891`
)}

function _40(md){return(
md`# Final notes`
)}

function _41(md){return(
md`Thank you for trying out this demo.

If the backend is not working, please get in touch with me. Feel free to fork this notebook to customize your own actors and build scenarios using the on-demand localnet that supports this early version of actors / smart contracts.

I can also deploy custom instances of the localnet and the API for compiling actors ... feel free to contact me at @jimpick on the Filecoin Slack.`
)}

function _42(md){return(
md`## Imports`
)}

function _skypack(){return(
(library) => import(`https://cdn.skypack.dev/${library}?min`)
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

async function _stripAnsi(){return(
(await import('https://unpkg.com/strip-ansi@7.0.1/index.js?module')).default
)}

function _cbor(){return(
import('https://cdn.skypack.dev/borc')
)}

function _multiformats(){return(
import('https://cdn.skypack.dev/pin/multiformats@v9.6.5-93rn6JH3zqEZdoz77NBu/mode=imports,min/optimized/multiformats.js')
)}

function _buffer(require){return(
require('https://bundle.run/buffer@6.0.3')
)}

function _52(md){return(
md`## Lotus Utilities`
)}

function _simpleCoinSol(){return(
`
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25 <= 0.8.17;

contract SimpleCoin {
        mapping (address => uint) balances;

        event Transfer(address indexed _from, address indexed _to, uint256 _value);

        constructor() {
                balances[tx.origin] = 10000;
        }

        function sendCoin(address receiver, uint amount) public returns(bool sufficient) {
                if (balances[msg.sender] < amount) return false;
                balances[msg.sender] -= amount;
                balances[receiver] += amount;
                emit Transfer(msg.sender, receiver, amount);
                return true;
        }

        function getBalanceInEth(address addr) public view returns(uint){
                return getBalance(addr) * 2;
        }

        function getBalance(address addr) public view returns(uint) {
                return balances[addr];
        }
}
`.trim()
)}

function _initialCodeUrl(){return(
`https://raw.githubusercontent.com/raulk/fil-hello-world-actor/695eed038c48bfff97c29fdc25d00aa7363ee47d/src/lib.rs`
)}

function _baseUrl(){return(
"https://fvm-7.default.knative.hex.camp"
)}

async function _token(baseUrl){return(
(await fetch(`${baseUrl}/public/token`)).text()
)}

function _client(BrowserProvider,baseUrl,token,LotusRPC,schema)
{
  const provider = new BrowserProvider(`${baseUrl}/rpc/v0`, { token })
  return new LotusRPC(provider, { schema })
}


function _heightStream(client,Promises){return(
async function *heightStream () {
  let last
  while (true) {
    try {
      const newHeight = (await client.chainHead()).Height
      if (newHeight !== last) {
        yield newHeight
        last = newHeight
      }
    } catch (e) {
      yield 0
    }
    await Promises.delay(4000)
  }
}
)}

function _ready(){return(
false
)}

function _heightReadyTapStream(heightStream,$0){return(
async function *heightReadyTapStream () {
  let lastReady = false
  for await (const height of heightStream()) {
    const newReady = height > 7
    if (newReady !== lastReady) {
      $0.value = newReady
      lastReady = newReady
    }
    yield height
  }
}
)}

function _currentHeight(heightReadyTapStream){return(
heightReadyTapStream()
)}

function _walletDefaultAddress(ready,client){return(
ready && client.walletDefaultAddress()
)}

function _63(md){return(
md`## Backups`
)}

function _65(backups){return(
backups()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("viewof editor")).define("viewof editor", ["skypack","simpleCoinSol"], _editor);
  main.variable(observer("editor")).define("editor", ["Generators", "viewof editor"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["html","button","editor"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer("viewof compileToEvmBytecodeButton")).define("viewof compileToEvmBytecodeButton", ["editor","Inputs"], _compileToEvmBytecodeButton);
  main.variable(observer("compileToEvmBytecodeButton")).define("compileToEvmBytecodeButton", ["Generators", "viewof compileToEvmBytecodeButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["compileStatus","md","Promises","html","stripAnsi"], _11);
  main.variable(observer()).define(["compileStatus","md"], _12);
  main.variable(observer("compileStatus")).define("compileStatus", ["compileToEvmBytecodeButton","baseUrl","buffer"], _compileStatus);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer()).define(["md","currentHeight"], _15);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer()).define(["md"], _19);
  main.variable(observer("viewof createActorButton")).define("viewof createActorButton", ["Inputs","compileStatus","ready"], _createActorButton);
  main.variable(observer("createActorButton")).define("createActorButton", ["Generators", "viewof createActorButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["createActorStatus","md","Promises","html"], _21);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer("evmActorCidBytes")).define("evmActorCidBytes", ["buffer"], _evmActorCidBytes);
  main.variable(observer("evmActorCid")).define("evmActorCid", ["multiformats","evmActorCidBytes"], _evmActorCid);
  main.variable(observer()).define(["evmActorCid"], _25);
  main.variable(observer("evmBytes")).define("evmBytes", ["compileStatus"], _evmBytes);
  main.variable(observer("evmBytesCbor")).define("evmBytesCbor", ["cbor","evmBytes"], _evmBytesCbor);
  main.variable(observer("createActorStatus")).define("createActorStatus", ["createActorButton","evmActorCid","cbor","evmBytesCbor","walletDefaultAddress","client"], _createActorStatus);
  main.variable(observer()).define(["md"], _29);
  main.variable(observer()).define(["md"], _30);
  main.variable(observer()).define(["md"], _31);
  main.variable(observer("viewof invokeParams")).define("viewof invokeParams", ["Inputs"], _invokeParams);
  main.variable(observer("invokeParams")).define("invokeParams", ["Generators", "viewof invokeParams"], (G, _) => G.input(_));
  main.variable(observer()).define(["md","createActorStatus","invokeParams"], _33);
  main.variable(observer("viewof invokeEvmMethodButton")).define("viewof invokeEvmMethodButton", ["Inputs","createActorStatus"], _invokeEvmMethodButton);
  main.variable(observer("invokeEvmMethodButton")).define("invokeEvmMethodButton", ["Generators", "viewof invokeEvmMethodButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["invokeEvmMethodStatus","md","Promises","invokeEvmMethodButton","html"], _35);
  main.variable(observer()).define(["md"], _36);
  main.variable(observer()).define(["md"], _37);
  main.variable(observer("invokeEvmMethodStatus")).define("invokeEvmMethodStatus", ["invokeEvmMethodButton","viewof invokeParams","buffer","walletDefaultAddress","client"], _invokeEvmMethodStatus);
  main.variable(observer()).define(["md"], _39);
  main.variable(observer()).define(["md"], _40);
  main.variable(observer()).define(["md"], _41);
  main.variable(observer()).define(["md"], _42);
  main.variable(observer("skypack")).define("skypack", _skypack);
  main.variable(observer("LotusRPC")).define("LotusRPC", _LotusRPC);
  main.variable(observer("BrowserProvider")).define("BrowserProvider", _BrowserProvider);
  main.variable(observer("schema")).define("schema", _schema);
  main.variable(observer("stripAnsi")).define("stripAnsi", _stripAnsi);
  main.variable(observer("cbor")).define("cbor", _cbor);
  main.variable(observer("multiformats")).define("multiformats", _multiformats);
  const child1 = runtime.module(define1);
  main.import("button", child1);
  main.variable(observer("buffer")).define("buffer", ["require"], _buffer);
  main.variable(observer()).define(["md"], _52);
  main.variable(observer("simpleCoinSol")).define("simpleCoinSol", _simpleCoinSol);
  main.variable(observer("initialCodeUrl")).define("initialCodeUrl", _initialCodeUrl);
  main.variable(observer("baseUrl")).define("baseUrl", _baseUrl);
  main.variable(observer("token")).define("token", ["baseUrl"], _token);
  main.variable(observer("client")).define("client", ["BrowserProvider","baseUrl","token","LotusRPC","schema"], _client);
  main.variable(observer("heightStream")).define("heightStream", ["client","Promises"], _heightStream);
  main.define("initial ready", _ready);
  main.variable(observer("mutable ready")).define("mutable ready", ["Mutable", "initial ready"], (M, _) => new M(_));
  main.variable(observer("ready")).define("ready", ["mutable ready"], _ => _.generator);
  main.variable(observer("heightReadyTapStream")).define("heightReadyTapStream", ["heightStream","mutable ready"], _heightReadyTapStream);
  main.variable(observer("currentHeight")).define("currentHeight", ["heightReadyTapStream"], _currentHeight);
  main.variable(observer("walletDefaultAddress")).define("walletDefaultAddress", ["ready","client"], _walletDefaultAddress);
  main.variable(observer()).define(["md"], _63);
  const child2 = runtime.module(define2);
  main.import("backups", child2);
  main.import("backupNowButton", child2);
  main.variable(observer()).define(["backups"], _65);
  return main;
}
