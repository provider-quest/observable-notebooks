import define1 from "./9a34a4df6e8a276b@50.js";
import define2 from "./c4e4a355c53d2a1a@111.js";

function _1(md){return(
md`# FVM Actor Code Playground - "Hello World"`
)}

function _2(md){return(
md`Try making your own custom Filecoin actor for the [Filecoin Virtual Machine](https://fvm.filecoin.io/)!

Here is the code from \`src/lib.rc\` in @raulk's [fil-hello-world-actor](https://github.com/raulk/fil-hello-world-actor) example on GitHub.

You can modify it here, then scroll down and click the buttons to compile it, then load it into a on-demand hosted [Lotus localnet](https://lotus.filecoin.io/developers/local-network/) created from the [experimental/fvm-m2](https://github.com/filecoin-project/lotus/tree/experimental/fvm-m2) branch, and invoke methods against it.

I suggest first trying it out with the unmodified code. Once you understand what it is doing, try modifying the text on Line 118 from "Hello world..." to a custom message, and try the steps again to see your customized actor!

**Note:** The on-demand localnet will be reclaimed after 3 minutes of inactivity. Modifications to the blockchain state are ephemeral -- good for testing! Staying on this page will keep it alive, but if you navigate away and then return, it may get restarted with fresh state. If that happens, reload the web page. There is one instance of the localnet shared between all users.`
)}

function _3(md){return(
md`## Step 1: Edit Actor Code - src/lib.rc

Feel free to modify this actor code (written in Rust). Don't worry, you can't break anything. This is from [src/lib.rc](https://github.com/raulk/fil-hello-world-actor/blob/master/src/lib.rs) in @raulk's [fil-hello-world-actor](https://github.com/raulk/fil-hello-world-actor) example.

GitHub Code Links + useful API Docs:

 * https://github.com/raulk/fil-hello-world-actor
 * https://github.com/raulk/fil-hello-world-actor/blob/master/src/blockstore.rs
 * https://github.com/raulk/fil-hello-world-actor/blob/master/Cargo.toml
 * https://docs.rs/fvm_sdk/0.6.1/fvm_sdk/
 * https://docs.rs/fvm_shared/0.6.1/fvm_shared/
 * https://docs.rs/cid/0.8.4/cid/
 * https://docs.rs/fvm_ipld_encoding/0.2.0/fvm_ipld_encoding/
`
)}

async function _editor(skypack,initialCodeUrl)
{
  const {EditorState, EditorView, basicSetup} = await skypack('@codemirror/next/basic-setup')
  const {rust} = await skypack('@codemirror/next/lang-rust')
  
  const updateViewOf = EditorView.updateListener.of((update) => {
    const {dom} = update.view
    dom.value = update
    dom.dispatchEvent(new CustomEvent('input'))
  })

  const initialCode = await (await fetch(initialCodeUrl)).text()
  
  const view = new EditorView({
    state: EditorState.create({
      doc: initialCode,
      extensions: [basicSetup, rust(), updateViewOf]
    })
  })
  
  return view.dom
}


function _5(md){return(
md`If you have changed the code and would like to save it for future use, you can use this button to save it to a file.`
)}

function _6(html,button,editor){return(
html`Optional: ${button(editor.state.doc.toString(), `lib.rs`)}`
)}

function _7(md){return(
md`**Pro-tip:** *You can also "fork" this notebook and use the saved file as an attachment.*`
)}

function _8(md){return(
md`## Step 2: Compile

We have implemented a [simple web service](https://github.com/jimpick/lotus-fvm-localnet-web/blob/main/server.mjs) that accepts a HTTP POST with the code above, and returns a compiled WASM binary (wrapped in a CBOR array, encoded in base64, ready to pass as a 'params' string). The code above is substituted for \`src/lib.rs\` into the [raulk/fil-hello-world-actor](https://github.com/raulk/fil-hello-world-actor) example and built using \`cargo build\`. It should compile in less than 30 seconds.`
)}

function _compileToWasmButton(editor,Inputs)
{
  const code = editor.state.doc.toString()
  return Inputs.button('Compile to WASM', {value: null, reduce: () => code})
}


async function* _10(compileStatus,md,Promises,html,stripAnsi)
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


function _11(compileStatus,md){return(
compileStatus && compileStatus.wasmBinary ? md`Optional: You can download the compiled WASM bundle here. (Not needed if you are just using it from this notebook)` : md``
)}

function _12(compileStatus,html,button,md){return(
compileStatus && compileStatus.wasmBinary ? html`Optional: ${button(compileStatus.wasmBinary, 'fil_hello_world_actor.wasm')}` : md``
)}

async function* _compileStatus(compileToWasmButton,baseUrl,cbor)
{
  if (compileToWasmButton) {
    const start = Date.now()
    yield {
      compiling: true,
      start
    }
    try {
      const response = await fetch(`${baseUrl}/compile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'lib.rs': compileToWasmButton
        })
      })
      const results = await response.json()
      results.elapsed = Date.now() - start
      if (results.success) {
        results.wasmBinary = cbor.decode(results.wasmBinaryParamsEncoded, 'base64')
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
md`## Step 4: Install the Actor Code`
)}

function _18(md){return(
md`Before the actor code can be executed, it must be loaded into the Filecoin blockchain state.

# 💾

If you are old enough to remember, imagine this step as inserting the [floppy disk](https://en.wikipedia.org/wiki/Floppy_disk) into the Filecoin global computer's floppy drive!

At the command line, this is the same as: \`lotus chain install-actor <wasm-file>\``
)}

function _installActorButton(Inputs,compileStatus){return(
Inputs.button('Install Actor Code', {
  disabled: !compileStatus || !compileStatus.wasmBinaryParamsEncoded,
  value: null,
  reduce: () => compileStatus.wasmBinaryParamsEncoded
})
)}

async function* _20(installActorStatus,md,Promises,html)
{
  if (installActorStatus === undefined || !installActorStatus) {
    yield md`Status: Latest actor code is compiled to WASM, but not installed yet.`
    return
  }
  if (installActorStatus.installing) {
    while (true) {
      const elapsed = (Date.now() - installActorStatus.start) / 1000
      yield md`Sending install actor message... (${elapsed.toFixed(1)}s)`
      await Promises.delay(1000)
    }
  }
  if (installActorStatus.response) {
    while (true) {
      let output = `<div><b>Install actor message sent</b></div>
      <div>Message CID: ${installActorStatus.response.CID['/']}</div>`
      if (installActorStatus.waitResponse) {
        output += `<div>Message executed in block at height: ${installActorStatus.waitResponse.Height}</div>`
        output += `<div>Gas used: ${installActorStatus.waitResponse.Receipt.GasUsed}</div>`
        output += `<div><b>Code CID: ${installActorStatus.codeCid}</b></div>`
        yield html`${output}`
        break
      }
      const elapsed = (Date.now() - installActorStatus.waitStart) / 1000
      output += `<div>Waiting for message to be executed in a block... (${elapsed.toFixed(1)}s)</div>`
      yield html`${output}`
      await Promises.delay(1000)
    }
  }
}


function _21(md){return(
md`---`
)}

async function* _installActorStatus(installActorButton,walletDefaultAddress,compileStatus,client,cbor,multiformats)
{
  if (installActorButton) {
    console.log('Install actor')
    const start = Date.now()
    yield {
      installing: true,
      start
    }
    // Sending install actor message...
    const messageBody = {
      To: 't01',
      From: walletDefaultAddress,
      Value: "0",
      Method: 4,
      Params: compileStatus.wasmBinaryParamsEncoded
    }
    const response = await client.mpoolPushMessage(messageBody, null)
    const waitStart = Date.now()
    yield { waiting: true, waitStart, response }
    const waitResponse = await client.stateWaitMsg(response.CID, 0)
    let decodedCid
    if (waitResponse.Receipt.ExitCode === 0) {
      const result = cbor.decode(waitResponse.Receipt.Return, 'base64')
      const codeCid = multiformats.CID.decode(result[0].value.slice(1)).toString()
      yield { installed: true, response, waitResponse, codeCid }
    } else {
      yield { installed: false, response, waitResponse }
    }
  }
}


function _23(md){return(
md`## Step 5: Create an Actor Instance`
)}

function _24(md){return(
md`If you have completed the previous step, you will have a "Code CID" for the WASM bundle you just installed. Now we can create an actor instance. It is possible to create lots and lots of actors using the same code, each will get assigned a unique "ID Address" (eg. t01001) to which messages and funds can be sent, as well as an equivalent "Robust Address" alias (eg. "t2...") which maps on the same address (but doesn't change in the event of a chain re-organization).`
)}

function _25(md){return(
md`At the command line, this is the same as: \`lotus chain create-actor <code-cid>\``
)}

function _createActorButton(Inputs,installActorStatus){return(
Inputs.button('Create Actor', {
  disabled: !installActorStatus || !installActorStatus.codeCid,
  value: null,
  reduce: () => installActorStatus.codeCid
})
)}

async function* _27(createActorStatus,md,Promises,createActorButton,html)
{
  if (createActorStatus === undefined || !createActorStatus) {
    yield md`Status: Instance of latest installed actor has not been created yet.`
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
      <div>Code CID (Param): ${createActorButton}</div>
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


function _28(md){return(
md`---`
)}

async function* _createActorStatus(createActorButton,multiformats,cbor,walletDefaultAddress,client)
{
  if (createActorButton) {
    console.log('Create actor')
    const start = Date.now()
    yield {
      creating: true,
      start
    }
    const codeCid = multiformats.CID.parse(createActorButton)
    // Needs a zero byte in front
    const codeCidBytes = new Uint8Array(codeCid.bytes.length + 1)
    codeCidBytes.set(codeCid.bytes, 1)
    const params = cbor.encode([new cbor.Tagged(42, codeCidBytes), new Uint8Array(0)])
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


function _30(md){return(
md`## Step 6: Invoke a Method on the Instance`
)}

function _31(md){return(
md`Now that we've got an actor running with an ID Address, we can call the method we have defined. In the Hello World example, method #2 is dispatched in the invoke() function to call the say_hello() function, which returns a message (with a counter that increments each time it is called).`
)}

function _32(md){return(
md`At the command line, this is the same as: \`lotus chain invoke <actor-id-address> <method-number>\``
)}

function _invokeMethod2Button(Inputs,createActorStatus){return(
Inputs.button('Invoke Method #2', {
  disabled: !createActorStatus ||
    !createActorStatus.waitResponse ||
    !createActorStatus.waitResponse.ReturnDec ||
    !createActorStatus.waitResponse.ReturnDec.IDAddress,
  value: null,
  reduce: () => createActorStatus.waitResponse.ReturnDec.IDAddress
})
)}

async function* _34(invokeMethod2Status,md,Promises,invokeMethod2Button,html)
{
  if (invokeMethod2Status === undefined || !invokeMethod2Status) {
    yield md`Status: Method has not been invoked yet.`
    return
  }
  if (invokeMethod2Status.invoking) {
    while (true) {
      const elapsed = (Date.now() - invokeMethod2Status.start) / 1000
      yield md`Sending message to actor for method 2... (${elapsed.toFixed(1)}s)`
      await Promises.delay(1000)
    }
  }
  if (invokeMethod2Status.response) {
    while (true) {
      let output = `<div><b>Message sent to actor</b></div>
      <div>To: ${invokeMethod2Button}</div>
      <div>Method: 2</div>
      <div>Message CID: ${invokeMethod2Status.response.CID['/']}</div>
      `
      if (invokeMethod2Status.waitResponse) {
        output += `<div>Message executed in block at height: ${invokeMethod2Status.waitResponse.Height}</div>`
        output += `<div>Gas used: ${invokeMethod2Status.waitResponse.Receipt.GasUsed}</div>`
        output += `<div>Return: ${invokeMethod2Status.waitResponse.Receipt.Return} (Base64 encoded CBOR)</div>`
        output += `<div><b>Decoded Result:</b> <b style="font-size: 200%">${JSON.stringify(invokeMethod2Status.decodedResult)}</b></div>`
        yield html`${output}`
        break
      }
      const elapsed = (Date.now() - invokeMethod2Status.waitStart) / 1000
      output += `<div>Waiting for message to be executed in a block... (${elapsed.toFixed(1)}s)</div>`
      yield html`${output}`
      await Promises.delay(1000)
    }
  }
}


function _35(md){return(
md`Each time you invoke method 2, it will increment a counter which is stored in the actor state (unless you have modified the code to not do that). Try it again to see the decoded result change each time.`
)}

function _36(Inputs,createActorStatus,$0){return(
Inputs.bind(Inputs.button('Invoke Method #2 again!', {
  disabled: !createActorStatus ||
    !createActorStatus.waitResponse ||
    !createActorStatus.waitResponse.ReturnDec ||
    !createActorStatus.waitResponse.ReturnDec.IDAddress,
  value: null,
  reduce: () => createActorStatus.waitResponse.ReturnDec.IDAddress
}), $0)
)}

function _37(md){return(
md`---`
)}

async function* _invokeMethod2Status(invokeMethod2Button,walletDefaultAddress,client,cbor)
{
  if (invokeMethod2Button) {
    const start = Date.now()
    yield {
      invoking: true,
      start
    }
    const messageBody = {
      To: invokeMethod2Button,
      From: walletDefaultAddress,
      Value: "0",
      Method: 2,
      Params: null
    }
    console.log('messageBody', messageBody)
    const response = await client.mpoolPushMessage(messageBody, null)
    const waitStart = Date.now()
    yield { waiting: true, waitStart, response }
    const waitResponse = await client.stateWaitMsg(response.CID, 0)
    let decodedResult
    if (waitResponse.Receipt && waitResponse.Receipt.Return) {
      decodedResult = cbor.decodeAll(waitResponse.Receipt.Return, 'base64')
    }
    yield { invoked: true, response, waitResponse, decodedResult }
  }
}


function _39(md){return(
md`# Final notes`
)}

function _40(md){return(
md`Thank you for trying out this demo.

If the backend is not working, please get in touch with me. Feel free to fork this notebook to customize your own actors and build scenarios using the on-demand localnet that supports this early version of actors / smart contracts.

I can also deploy custom instances of the localnet and the API for compiling actors ... feel free to contact me at @jimpick on the Filecoin Slack.`
)}

function _41(md){return(
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

function _50(md){return(
md`## Lotus Utilities`
)}

function _initialCodeUrl(){return(
`https://raw.githubusercontent.com/raulk/fil-hello-world-actor/695eed038c48bfff97c29fdc25d00aa7363ee47d/src/lib.rs`
)}

function _baseUrl(){return(
"https://fvm-10.default.knative.hex.camp"
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

function _60(md){return(
md`## Backups`
)}

function _62(backups){return(
backups()
)}

function _63(backupNowButton){return(
backupNowButton()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("viewof editor")).define("viewof editor", ["skypack","initialCodeUrl"], _editor);
  main.variable(observer("editor")).define("editor", ["Generators", "viewof editor"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _5);
  main.variable(observer()).define(["html","button","editor"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer("viewof compileToWasmButton")).define("viewof compileToWasmButton", ["editor","Inputs"], _compileToWasmButton);
  main.variable(observer("compileToWasmButton")).define("compileToWasmButton", ["Generators", "viewof compileToWasmButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["compileStatus","md","Promises","html","stripAnsi"], _10);
  main.variable(observer()).define(["compileStatus","md"], _11);
  main.variable(observer()).define(["compileStatus","html","button","md"], _12);
  main.variable(observer("compileStatus")).define("compileStatus", ["compileToWasmButton","baseUrl","cbor"], _compileStatus);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer()).define(["md","currentHeight"], _15);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer("viewof installActorButton")).define("viewof installActorButton", ["Inputs","compileStatus"], _installActorButton);
  main.variable(observer("installActorButton")).define("installActorButton", ["Generators", "viewof installActorButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["installActorStatus","md","Promises","html"], _20);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer("installActorStatus")).define("installActorStatus", ["installActorButton","walletDefaultAddress","compileStatus","client","cbor","multiformats"], _installActorStatus);
  main.variable(observer()).define(["md"], _23);
  main.variable(observer()).define(["md"], _24);
  main.variable(observer()).define(["md"], _25);
  main.variable(observer("viewof createActorButton")).define("viewof createActorButton", ["Inputs","installActorStatus"], _createActorButton);
  main.variable(observer("createActorButton")).define("createActorButton", ["Generators", "viewof createActorButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["createActorStatus","md","Promises","createActorButton","html"], _27);
  main.variable(observer()).define(["md"], _28);
  main.variable(observer("createActorStatus")).define("createActorStatus", ["createActorButton","multiformats","cbor","walletDefaultAddress","client"], _createActorStatus);
  main.variable(observer()).define(["md"], _30);
  main.variable(observer()).define(["md"], _31);
  main.variable(observer()).define(["md"], _32);
  main.variable(observer("viewof invokeMethod2Button")).define("viewof invokeMethod2Button", ["Inputs","createActorStatus"], _invokeMethod2Button);
  main.variable(observer("invokeMethod2Button")).define("invokeMethod2Button", ["Generators", "viewof invokeMethod2Button"], (G, _) => G.input(_));
  main.variable(observer()).define(["invokeMethod2Status","md","Promises","invokeMethod2Button","html"], _34);
  main.variable(observer()).define(["md"], _35);
  main.variable(observer()).define(["Inputs","createActorStatus","viewof invokeMethod2Button"], _36);
  main.variable(observer()).define(["md"], _37);
  main.variable(observer("invokeMethod2Status")).define("invokeMethod2Status", ["invokeMethod2Button","walletDefaultAddress","client","cbor"], _invokeMethod2Status);
  main.variable(observer()).define(["md"], _39);
  main.variable(observer()).define(["md"], _40);
  main.variable(observer()).define(["md"], _41);
  main.variable(observer("skypack")).define("skypack", _skypack);
  main.variable(observer("LotusRPC")).define("LotusRPC", _LotusRPC);
  main.variable(observer("BrowserProvider")).define("BrowserProvider", _BrowserProvider);
  main.variable(observer("schema")).define("schema", _schema);
  main.variable(observer("stripAnsi")).define("stripAnsi", _stripAnsi);
  main.variable(observer("cbor")).define("cbor", _cbor);
  main.variable(observer("multiformats")).define("multiformats", _multiformats);
  const child1 = runtime.module(define1);
  main.import("button", child1);
  main.variable(observer()).define(["md"], _50);
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
  main.variable(observer()).define(["md"], _60);
  const child2 = runtime.module(define2);
  main.import("backups", child2);
  main.import("backupNowButton", child2);
  main.variable(observer()).define(["backups"], _62);
  main.variable(observer()).define(["backupNowButton"], _63);
  return main;
}
