import define1 from "./9a34a4df6e8a276b@50.js";
import define2 from "./c4e4a355c53d2a1a@111.js";

function _1(md){return(
md`# FVM Actor Code Playground - "List Miners" Investigation`
)}

function _2(md){return(
md`* Can we make a method to list miner actors?
* This is a test to see if it is possible to load the HAMT from the state used by the built-in system "power actor" and access the data from a custom actor. It works!
* The on-demand localnet has been configured so that it will run 3 miner processes.
* Try running all the steps. The final step (#16) will retrieve the list of the 3 miner IDs from the custom actor.
* Code links:
  * Lotus CLI: \`lotus state list-miners\` https://github.com/filecoin-project/lotus/blob/514c756570911d18c985d2f6243609286271a9b4/cli/state.go#L597
  * API: \`StateListMiners()\` https://github.com/filecoin-project/lotus/blob/514c756570911d18c985d2f6243609286271a9b4/api/api_full.go#L512
  * Node Impl: \`StateListMiners()\` https://github.com/filecoin-project/lotus/blob/514c756570911d18c985d2f6243609286271a9b4/node/impl/full/state.go#L618
  * Chain Impl: \`ListMinerActors()\` https://github.com/filecoin-project/lotus/blob/514c756570911d18c985d2f6243609286271a9b4/chain/stmgr/actors.go#L290
  * Lotus Power Actor: \`ListAllMiners()\` https://github.com/filecoin-project/lotus/blob/514c756570911d18c985d2f6243609286271a9b4/chain/actors/builtin/power/power.go#L168
  * Lotus Power Actor v7: \`ListAllMiners()\` https://github.com/filecoin-project/lotus/blob/514c756570911d18c985d2f6243609286271a9b4/chain/actors/builtin/power/v7.go#L96
  * Lotus Power Actor v7: \`claims()\` https://github.com/filecoin-project/lotus/blob/514c756570911d18c985d2f6243609286271a9b4/chain/actors/builtin/power/v7.go#L170
  * Rust Power Actor: \`claims\` (Map, HAMT\\[address\\]Claim) https://github.com/filecoin-project/builtin-actors/blob/cf69be5eb2fee10173eb0ffda723f2dc9fcb15dd/actors/power/src/state.rs#L72
  * Forest: \`state_list_actors()\` https://github.com/ChainSafe/forest/blob/cd27985df1ef1469fab70f83d2122c96ac66506a/node/rpc/src/state_api.rs#L410
  * Forest: \`list_miner_actors()\` https://github.com/ChainSafe/forest/blob/cd27985df1ef1469fab70f83d2122c96ac66506a/blockchain/state_manager/src/utils.rs#L261
  * Forest Power Actor: \`list_all_miners()\` https://github.com/ChainSafe/forest/blob/cd27985df1ef1469fab70f83d2122c96ac66506a/vm/actor_interface/src/builtin/power/mod.rs#L154
* Based on https://observablehq.com/@jimpick/fvm-actor-code-playground-hello-world`
)}

function _3(md){return(
md`**Note:** The on-demand localnet will be reclaimed after 3 minutes of inactivity. Modifications to the blockchain state are ephemeral -- good for testing! Staying on this page will keep it alive, but if you navigate away and then return, it may get restarted with fresh state. If that happens, reload the web page. There is one instance of the localnet shared between all users.`
)}

function _getBalances(client){return(
async function getBalances (addresses) {
  return Promise.all(
    addresses
      .map(async address => {
        const response = await client.stateGetActor(address, [])
        return {
          address: address,
          balance: response.Balance
        }
      })
  )
}
)}

function _5(md){return(
md`## Step 1: Edit Actor Code - src/lib.rc

Feel free to modify this actor code (written in Rust). Don't worry, you can't break anything. This is from [src/lib.rc](https://github.com/raulk/fil-hello-world-actor/blob/master/src/lib.rs) in @raulk's [fil-hello-world-actor](https://github.com/raulk/fil-hello-world-actor) example. We use some JavaScript in this notebook to patch this subset of the code into the original code with some modifications.

GitHub Code Links + useful API Docs:

 * https://github.com/raulk/fil-hello-world-actor
 * https://github.com/raulk/fil-hello-world-actor/blob/master/src/blockstore.rs
 * https://github.com/raulk/fil-hello-world-actor/blob/master/Cargo.toml
 * https://docs.rs/fvm_sdk/0.6.1/fvm_sdk/
 * https://docs.rs/fvm_shared/0.6.1/fvm_shared/
 * https://docs.rs/cid/0.8.4/cid/
 * https://docs.rs/fvm_ipld_encoding/0.2.0/fvm_ipld_encoding/
 * https://docs.rs/fvm_ipld_hamt/0.5.1/fvm_ipld_hamt/
`
)}

async function _editor(skypack,method2Code)
{
  const {EditorState, EditorView, basicSetup} = await skypack('@codemirror/next/basic-setup')
  const {rust} = await skypack('@codemirror/next/lang-rust')
  
  const updateViewOf = EditorView.updateListener.of((update) => {
    const {dom} = update.view
    dom.value = update
    dom.dispatchEvent(new CustomEvent('input'))
  })

  const initialCode = method2Code
  
  const view = new EditorView({
    state: EditorState.create({
      doc: initialCode,
      extensions: [basicSetup, rust(), updateViewOf]
    })
  })
  
  return view.dom
}


function _7(md){return(
md`If you have changed the code and would like to save it for future use, you can use this button to save it to a file.`
)}

function _8(templateStart,editor,html,button)
{
  const code = templateStart + '\n' + editor.state.doc.toString()
  return html`Optional: ${button(code, `lib.rs`)}`
}


function _9(md){return(
md`**Pro-tip:** *You can also "fork" this notebook and use the saved file as an attachment.*`
)}

function _10(md){return(
md`## Step 2: Compile

We have implemented a [simple web service](https://github.com/jimpick/lotus-fvm-localnet-web/blob/main/server.mjs) that accepts a HTTP POST with the code above, and returns a compiled WASM binary (wrapped in a CBOR array, encoded in base64, ready to pass as a 'params' string). The code above is substituted for \`src/lib.rs\` into the [raulk/fil-hello-world-actor](https://github.com/raulk/fil-hello-world-actor) example and built using \`cargo build\`. It should compile in less than 60 seconds.`
)}

function _compileToWasmButton(templateStart,editor,Inputs)
{
  const code = templateStart + '\n' + editor.state.doc.toString()
  return Inputs.button('Compile to WASM', {value: null, reduce: () => code})
}


async function* _12(compileStatus,md,Promises,html,stripAnsi)
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


function _13(compileStatus,md){return(
compileStatus && compileStatus.wasmBinary ? md`Optional: You can download the compiled WASM bundle here. (Not needed if you are just using it from this notebook)` : md``
)}

function _14(compileStatus,html,button,md){return(
compileStatus && compileStatus.wasmBinary ? html`Optional: ${button(compileStatus.wasmBinary, 'fil_hello_world_actor.wasm')}` : md``
)}

async function* _compileStatus(compileToWasmButton,baseUrl,patchedCargoToml,cbor)
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
          'lib.rs': compileToWasmButton,
          'Cargo.toml': patchedCargoToml
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


function _16(md){return(
md`## Step 3: Connect to Hosted "localnet"

This notebook connects to a [hosted instance](https://github.com/jimpick/lotus-fvm-localnet-web) of a Lotus "localnet" (started on demand) into which you can install the actor code, create an actor instance, and invoke methods against.

If the localnet is started and online, the following chain height should be increasing every 4-10 seconds (depending on system load):`
)}

function _17(md,currentHeight){return(
md`**Height: ${currentHeight}**`
)}

function _18(md){return(
md`If the connection is working, then proceed to the next step.`
)}

function _19(md){return(
md`## Step 4: Install the Actor Code`
)}

function _20(md){return(
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

async function* _22(installActorStatus,md,Promises,html)
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
        output += `<div><b>Code CID: ${installActorStatus.waitResponse.ReturnDec.CodeCid['/']}</b></div>`
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


async function* _installActorStatus(installActorButton,walletDefaultAddress,compileStatus,client)
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
      Method: 3,
      Params: compileStatus.wasmBinaryParamsEncoded
    }
    const response = await client.mpoolPushMessage(messageBody, null)
    const waitStart = Date.now()
    yield { waiting: true, waitStart, response }
    const waitResponse = await client.stateWaitMsg(response.CID, 0)
    yield { installed: true, response, waitResponse }
  }
}


function _24(md){return(
md`## Step 5: Create an Actor Instance`
)}

function _25(md){return(
md`If you have completed the previous step, you will have a "Code CID" for the WASM bundle you just installed. Now we can create an actor instance. It is possible to create lots and lots of actors using the same code, each will get assigned a unique "ID Address" (eg. t01001) to which messages and funds can be sent, as well as an equivalent "Robust Address" alias (eg. "t2...") which maps on the same address (but doesn't change in the event of a chain re-organization).`
)}

function _26(md){return(
md`At the command line, this is the same as: \`lotus chain create-actor <code-cid>\``
)}

function _createActorButton(Inputs,installActorStatus){return(
Inputs.button('Create Actor', {
  disabled: !installActorStatus ||
    !installActorStatus.waitResponse ||
    !installActorStatus.waitResponse.ReturnDec ||
    !installActorStatus.waitResponse.ReturnDec.CodeCid,
  value: null,
  reduce: () => installActorStatus.waitResponse.ReturnDec.CodeCid['/']
})
)}

async function* _28(createActorStatus,md,Promises,createActorButton,html)
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


async function* _createActorStatus(createActorButton,CID,cbor,walletDefaultAddress,client)
{
  if (createActorButton) {
    console.log('Create actor')
    const start = Date.now()
    yield {
      creating: true,
      start
    }
    const codeCid = new CID(createActorButton)
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
    console.log('Jim response', response)
    const waitStart = Date.now()
    yield { waiting: true, waitStart, response }
    const waitResponse = await client.stateWaitMsg(response.CID, 0)
    yield { installed: true, response, waitResponse }
  }
}


function _actorId(createActorStatus){return(
createActorStatus?.waitResponse?.ReturnDec?.IDAddress
)}

function _31(md){return(
md`## Step 6: Invoke #2`
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

async function* _33(invokeMethod2Status,md,Promises,invokeMethod2Button,html)
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
        output += `<div><b>Decoded Result:</b> <b style="font-size: 150%">${JSON.stringify(invokeMethod2Status.decodedResult)}</b></div>`
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
    console.log('Jim response', response)
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


function _35(md){return(
md`## Step 7: Call #3 - Get State CID (binary response, no CBOR)`
)}

function _callMethod3Button(Inputs,createActorStatus){return(
Inputs.button('Call Method #3', {
  disabled: !createActorStatus ||
    !createActorStatus.waitResponse ||
    !createActorStatus.waitResponse.ReturnDec ||
    !createActorStatus.waitResponse.ReturnDec.IDAddress,
  value: null,
  reduce: () => createActorStatus.waitResponse.ReturnDec.IDAddress
})
)}

function _callMethod3Result(callMethod3Button,walletDefaultAddress,client)
{
  if (callMethod3Button) {
    const messageBody = {
      To: callMethod3Button,
      From: walletDefaultAddress,
      Value: "0",
      Method: 3,
      Params: null
    }
    return client.StateCall(messageBody, [])
  }
}


function _stateCid(callMethod3Result,base64ArrayBuffer,multiformats)
{
  if (!callMethod3Result?.MsgRct) return
  const cidBytes = new Uint8Array(base64ArrayBuffer.decode(callMethod3Result.MsgRct.Return))
  return multiformats.CID.decode(cidBytes).toString()
}


function _39(md){return(
md`## Step 8: Call #4 - Pass CID back as debug string showing bytes`
)}

function _callMethod4Button(Inputs,createActorStatus){return(
Inputs.button('Call Method #4', {
  disabled: !createActorStatus ||
    !createActorStatus.waitResponse ||
    !createActorStatus.waitResponse.ReturnDec ||
    !createActorStatus.waitResponse.ReturnDec.IDAddress,
  value: null,
  reduce: () => createActorStatus.waitResponse.ReturnDec.IDAddress
})
)}

function _41(CID,stateCid){return(
(new CID(stateCid)).bytes
)}

function _callMethod4Params(CID,stateCid,cbor)
{
    const cid = new CID(stateCid)
    // Needs a zero byte in front
    const cidBytes = new Uint8Array(cid.bytes.length + 1)
    cidBytes.set(cid.bytes, 1)
    return cbor.encode([new cbor.Tagged(42, cidBytes), new Uint8Array(0)]).toString('base64')
}


function _callMethod4Result(callMethod4Button,walletDefaultAddress,callMethod4Params,client)
{
  if (callMethod4Button) {
    const messageBody = {
      To: callMethod4Button,
      From: walletDefaultAddress,
      Value: "0",
      Method: 4,
      Params: callMethod4Params
    }
    return client.StateCall(messageBody, [])
  }
}


function _44(callMethod4Result,cbor)
{
  if (!callMethod4Result?.MsgRct) return
  return cbor.decode(callMethod4Result.MsgRct.Return, 'base64')
}


function _45(md){return(
md`## Step 9: Call #5 - Get State CID (serialized in CBOR)`
)}

function _callMethod5Button(Inputs,createActorStatus){return(
Inputs.button('Call Method #5', {
  disabled: !createActorStatus ||
    !createActorStatus.waitResponse ||
    !createActorStatus.waitResponse.ReturnDec ||
    !createActorStatus.waitResponse.ReturnDec.IDAddress,
  value: null,
  reduce: () => createActorStatus.waitResponse.ReturnDec.IDAddress
})
)}

function _callMethod5Result(callMethod5Button,walletDefaultAddress,client)
{
  if (callMethod5Button) {
    const messageBody = {
      To: callMethod5Button,
      From: walletDefaultAddress,
      Value: "0",
      Method: 5,
      Params: null
    }
    return client.StateCall(messageBody, [])
  }
}


function _decodedCallMethod5Result(callMethod5Result,cbor){return(
callMethod5Result?.MsgRct?.Return && cbor.decode(callMethod5Result.MsgRct.Return, 'base64')
)}

function _49(decodedCallMethod5Result,multiformats){return(
decodedCallMethod5Result && multiformats.CID.decode(decodedCallMethod5Result[0].value.slice(1)).toString()
)}

function _50(md){return(
md`## Step 10: Call #6 - Pass CID back (parse as CID)`
)}

function _oldStateCid()
{
  return "bafy2bzacece6ioczclolgntuhvnqseyloiz37gikrwyh2f6vbiwlw7etkll3q" // 1
  // return "bafy2bzaced5acjdnxwtqqd6uylw5nsqa5ffu6vp54mx6cowjzwnyvuy3t7rhw" // 2
}


function _callMethod6Button(Inputs,createActorStatus){return(
Inputs.button('Call Method #6', {
  disabled: !createActorStatus ||
    !createActorStatus.waitResponse ||
    !createActorStatus.waitResponse.ReturnDec ||
    !createActorStatus.waitResponse.ReturnDec.IDAddress,
  value: null,
  reduce: () => createActorStatus.waitResponse.ReturnDec.IDAddress
})
)}

function _callMethod6Params(CID,oldStateCid,cbor)
{
    const cid = new CID(oldStateCid)
    // Needs a zero byte in front
    const cidBytes = new Uint8Array(cid.bytes.length + 1)
    cidBytes.set(cid.bytes, 1)
    // return cbor.encode([new cbor.Tagged(42, cidBytes), new Uint8Array(0)]).toString('base64')
    return cbor.encode([new cbor.Tagged(42, cidBytes)]).toString('base64')
}


function _callMethod6Result(callMethod6Button,walletDefaultAddress,callMethod6Params,client)
{
  if (callMethod6Button) {
    const messageBody = {
      To: callMethod6Button,
      From: walletDefaultAddress,
      Value: "0",
      Method: 6,
      Params: callMethod6Params
    }
    return client.StateCall(messageBody, [])
  }
}


function _decodedCallMethod6Result(callMethod6Result,cbor)
{
  if (!callMethod6Result?.MsgRct?.Return) return
  return cbor.decode(callMethod6Result.MsgRct.Return, 'base64')
}


function _56(md){return(
md`## Step 11: Call #7 - Pass CID, get historical state date`
)}

function _callMethod7Button(Inputs,createActorStatus){return(
Inputs.button('Call Method #7', {
  disabled: !createActorStatus ||
    !createActorStatus.waitResponse ||
    !createActorStatus.waitResponse.ReturnDec ||
    !createActorStatus.waitResponse.ReturnDec.IDAddress,
  value: null,
  reduce: () => createActorStatus.waitResponse.ReturnDec.IDAddress
})
)}

function _callMethod7Params(CID,oldStateCid,cbor)
{
    const cid = new CID(oldStateCid)
    // Needs a zero byte in front
    const cidBytes = new Uint8Array(cid.bytes.length + 1)
    cidBytes.set(cid.bytes, 1)
    return cbor.encode([new cbor.Tagged(42, cidBytes)]).toString('base64')
}


function _callMethod7Result(callMethod7Button,walletDefaultAddress,callMethod7Params,client)
{
  if (callMethod7Button) {
    const messageBody = {
      To: callMethod7Button,
      From: walletDefaultAddress,
      Value: "0",
      Method: 7,
      Params: callMethod7Params
    }
    return client.StateCall(messageBody, [])
  }
}


function _60(callMethod7Result,cbor)
{
  if (!callMethod7Result?.MsgRct?.Return) return
  return JSON.stringify(cbor.decode(callMethod7Result.MsgRct.Return, 'base64'))
}


function _61(md){return(
md`## Step 12: Call #8 - Pass State CID, get state as bytes`
)}

function _62(md){return(
md`Returned bytes can be parsed as a CBOR object.`
)}

function _callMethod8Button(Inputs,createActorStatus){return(
Inputs.button('Call Method #8', {
  disabled: !createActorStatus ||
    !createActorStatus.waitResponse ||
    !createActorStatus.waitResponse.ReturnDec ||
    !createActorStatus.waitResponse.ReturnDec.IDAddress,
  value: null,
  reduce: () => createActorStatus.waitResponse.ReturnDec.IDAddress
})
)}

function _callMethod8Params(CID,oldStateCid,cbor)
{
    const cid = new CID(oldStateCid)
    // Needs a zero byte in front
    const cidBytes = new Uint8Array(cid.bytes.length + 1)
    cidBytes.set(cid.bytes, 1)
    return cbor.encode([new cbor.Tagged(42, cidBytes)]).toString('base64')
}


function _callMethod8Result(callMethod8Button,walletDefaultAddress,callMethod8Params,client)
{
  if (callMethod8Button) {
    const messageBody = {
      To: callMethod8Button,
      From: walletDefaultAddress,
      Value: "0",
      Method: 8,
      Params: callMethod8Params
    }
    return client.StateCall(messageBody, [])
  }
}


function _66(callMethod8Result,cbor)
{
  if (!callMethod8Result?.MsgRct?.Return) return
  return JSON.stringify(cbor.decode(callMethod8Result.MsgRct.Return, 'base64'))
}


function _67(md){return(
md`## Step 13: Get State CID for Power Actor via JSON-RPC`
)}

function _getPowerActorStateButton(Inputs){return(
Inputs.button(`Get Current State for Power Actor t04`)
)}

function _getPowerActor(getPowerActorStateButton,client){return(
getPowerActorStateButton && client.stateGetActor('t04', [])
)}

function _powerActorStateCid(getPowerActor){return(
getPowerActor && getPowerActor.Head['/']
)}

function _71(md){return(
md`## Step 14: Call #8 - Pass State CID for Power Actor, get state as bytes`
)}

function _callMethod8PowerButton(Inputs,createActorStatus){return(
Inputs.button('Call Method #8 for Power Actor', {
  disabled: !createActorStatus ||
    !createActorStatus.waitResponse ||
    !createActorStatus.waitResponse.ReturnDec ||
    !createActorStatus.waitResponse.ReturnDec.IDAddress,
  value: null,
  reduce: () => createActorStatus.waitResponse.ReturnDec.IDAddress
})
)}

function _callMethod8PowerParams(CID,powerActorStateCid,cbor)
{
    const cid = new CID(powerActorStateCid)
    // Needs a zero byte in front
    const cidBytes = new Uint8Array(cid.bytes.length + 1)
    cidBytes.set(cid.bytes, 1)
    return cbor.encode([new cbor.Tagged(42, cidBytes)]).toString('base64')
}


function _callMethod8PowerResult(callMethod8PowerButton,walletDefaultAddress,callMethod8PowerParams,client)
{
  if (callMethod8PowerButton) {
    const messageBody = {
      To: callMethod8PowerButton,
      From: walletDefaultAddress,
      Value: "0",
      Method: 8,
      Params: callMethod8PowerParams
    }
    return client.StateCall(messageBody, [])
  }
}


function _powerStateRaw(callMethod8PowerResult,cbor)
{
  if (!callMethod8PowerResult?.MsgRct?.Return) return
  return cbor.decode(callMethod8PowerResult.MsgRct.Return, 'base64')
}


function _76(md){return(
md`Rust Actor State Struct: https://github.com/filecoin-project/builtin-actors/blob/cf69be5eb2fee10173eb0ffda723f2dc9fcb15dd/actors/power/src/state.rs#L40`
)}

function _powerActorState(powerStateRaw,bytesToBig,multiformats){return(
powerStateRaw && ({
  total_raw_byte_power: bytesToBig(powerStateRaw[0]).toString(), // StoragePower (bigint)
  total_bytes_committed: bytesToBig(powerStateRaw[1]).toString(), // StoragePower (bigint)
  total_quality_adj_power: bytesToBig(powerStateRaw[2]).toString(), // StoragePower (bigint)
  total_qa_bytes_committed: bytesToBig(powerStateRaw[3]).toString(), // StoragePower (bigint)
  total_pledge_collateral: bytesToBig(powerStateRaw[4]).toString(), // TokenAmount (bigint)
  this_epoch_raw_byte_power: bytesToBig(powerStateRaw[5]).toString(), // StoragePower (bigint)
  this_epoch_quality_adj_power: bytesToBig(powerStateRaw[6]).toString(), // StoragePower (bigint)
  this_epoch_pledge_collateral: bytesToBig(powerStateRaw[7]).toString(), // TokenAmount (bigint)
  this_epoch_qa_power_smoothed: {
    // https://docs.rs/fvm_shared/0.6.1/fvm_shared/smooth/struct.FilterEstimate.html
    filter_estimate_position: bytesToBig(powerStateRaw[8][0]).toString(), // bigint
    filter_estimate_velocity: bytesToBig(powerStateRaw[8][1]).toString(), // bigint
  },
  miner_count: powerStateRaw[9],
  miner_above_min_power_count: powerStateRaw[10],
  cron_event_queue: multiformats.CID.decode(powerStateRaw[11].value.slice(1)).toString(), // cid
  first_cron_epoch: powerStateRaw[12],
  claims: multiformats.CID.decode(powerStateRaw[13].value.slice(1)).toString(), // cid - HAMT[address]Claim
  proof_validation_batch: powerStateRaw[14] && multiformats.CID.decode(powerStateRaw[14].value.slice(1)).toString() // Option<Cid>
})
)}

function _78(powerActorState){return(
JSON.stringify(powerActorState, null, 2)
)}

function _79(md){return(
md`## Step 15: Call #9 - Pass State CID for Power Actor, load state in actor, get state as bytes`
)}

function _callMethod9Button(Inputs,createActorStatus){return(
Inputs.button('Call Method #9', {
  disabled: !createActorStatus ||
    !createActorStatus.waitResponse ||
    !createActorStatus.waitResponse.ReturnDec ||
    !createActorStatus.waitResponse.ReturnDec.IDAddress,
  value: null,
  reduce: () => createActorStatus.waitResponse.ReturnDec.IDAddress
})
)}

function _callMethod9Params(CID,powerActorStateCid,cbor)
{
    const cid = new CID(powerActorStateCid)
    // Needs a zero byte in front
    const cidBytes = new Uint8Array(cid.bytes.length + 1)
    cidBytes.set(cid.bytes, 1)
    return cbor.encode([new cbor.Tagged(42, cidBytes)]).toString('base64')
}


function _callMethod9Result(callMethod9Button,walletDefaultAddress,callMethod9Params,client)
{
  if (callMethod9Button) {
    const messageBody = {
      To: callMethod9Button,
      From: walletDefaultAddress,
      Value: "0",
      Method: 9,
      Params: callMethod9Params
    }
    return client.StateCall(messageBody, [])
  }
}


function _powerState9Raw(callMethod9Result,cbor)
{
  if (!callMethod9Result?.MsgRct?.Return) return
  return cbor.decode(callMethod9Result.MsgRct.Return, 'base64')
}


function _84(md){return(
md`## Step 16: Call #10 - Get list of miners from Power Actor`
)}

function _callMethod10Button(Inputs,createActorStatus){return(
Inputs.button('Call Method #10', {
  disabled: !createActorStatus ||
    !createActorStatus.waitResponse ||
    !createActorStatus.waitResponse.ReturnDec ||
    !createActorStatus.waitResponse.ReturnDec.IDAddress,
  value: null,
  reduce: () => createActorStatus.waitResponse.ReturnDec.IDAddress
})
)}

function _callMethod10Params(CID,powerActorStateCid,cbor)
{
    const cid = new CID(powerActorStateCid)
    // Needs a zero byte in front
    const cidBytes = new Uint8Array(cid.bytes.length + 1)
    cidBytes.set(cid.bytes, 1)
    return cbor.encode([new cbor.Tagged(42, cidBytes)]).toString('base64')
}


function _callMethod10Result(callMethod10Button,callMethod9Button,walletDefaultAddress,callMethod10Params,client)
{
  if (callMethod10Button) {
    const messageBody = {
      To: callMethod9Button,
      From: walletDefaultAddress,
      Value: "0",
      Method: 10,
      Params: callMethod10Params
    }
    return client.StateCall(messageBody, [])
  }
}


function _callMethod10ResultDecoded(callMethod10Result,cbor)
{
  if (!callMethod10Result?.MsgRct?.Return) return
  return cbor.decode(callMethod10Result.MsgRct.Return, 'base64')
}


function _miners(callMethod10ResultDecoded,filecoinAddress){return(
callMethod10ResultDecoded && callMethod10ResultDecoded.map(buf => filecoinAddress.newAddress(buf[0], buf.slice(1), 't').toString()).sort()
)}

function _90(miners,Inputs){return(
miners && Inputs.table(miners.map(miner => ({miner})))
)}

function _91(miners,md){return(
miners && md`**Done!** (You should see 3 miner IDs)`
)}

function _92(md){return(
md`## Serialize/Deserialize Filecoin Bigints`
)}

function _93(FilecoinNumber){return(
new FilecoinNumber('5', 'attofil')
)}

function _94(cbor,FilecoinNumber){return(
cbor.encode([new FilecoinNumber('5', 'attofil')]).toString('base64')
)}

function _bigToBytes(BN){return(
function bigToBytes(num) {
  // https://github.com/Zondax/filecoin-signing-tools/blob/5a126fa599695dac720c692cb286a8c572187f88/signer-npm/js/src/index.js#L54
  // https://github.com/spacegap/spacegap.github.io/blob/ccfa30a3e5303c4538c59f3a23186882eddf810e/src/services/filecoin/index.js#L145

  if (num === '0' || num === 0) {
    return new Uint8Array(0)
  }
  const numBigInt = (typeof num === 'object') ? (new BN(num.toAttoFil(), 10)) : (new BN(num, 10))
  const numArray = numBigInt.toArrayLike(Array, 'be', numBigInt.byteLength())
  if (numBigInt.isNeg()) {
    numArray.unshift(1)
  } else {
    numArray.unshift(0)
  }
  return new Uint8Array(numArray)
}
)}

function _96(bigToBytes){return(
bigToBytes(-1234)
)}

function _97(bigToBytes){return(
bigToBytes(1234)
)}

function _98(bigToBytes,FilecoinNumber){return(
bigToBytes(new FilecoinNumber(1234, 'attofil'))
)}

function _99(){return(
({ x: 1 }).toString()
)}

function _100(bigToBytes){return(
bigToBytes("1234")
)}

function _101(bigToBytes){return(
bigToBytes("12345678901234567890")
)}

function _102(bigToBytes){return(
bigToBytes(12345678901234567890n)
)}

function _bytesToBig(BN){return(
function bytesToBig (p) { // https://github.com/spacegap/spacegap.github.io/blob/ccfa30a3e5303c4538c59f3a23186882eddf810e/src/services/filecoin/index.js#L145
  let sign = p[0]
  let acc = new BN(0)
  for (let i = 1; i < p.length; i++) {
    acc = acc.mul(new BN(256))
    acc = acc.add(new BN(p[i]))
  }
  if (sign === 1) {
    return -acc
  } else if (sign === 0) {
    return acc
  } else {
    throw new Error('Unexpected value for first byte, expected 0 or 1 for sign')
  }
}
)}

function _104(bytesToBig,bigToBytes){return(
bytesToBig(bigToBytes(12345678901234567890n)).toString()
)}

function _105(bytesToBig,bigToBytes){return(
bytesToBig(bigToBytes(-1234)).toString()
)}

function _106(md){return(
md`# Final notes`
)}

function _107(md){return(
md`Thank you for trying out this demo.

If the backend is not working, please get in touch with me. Feel free to fork this notebook to customize your own actors and build scenarios using the on-demand localnet that supports this early version of actors / smart contracts.

I can also deploy custom instances of the localnet and the API for compiling actors ... feel free to contact me at @jimpick on the Filecoin Slack.`
)}

function _108(md){return(
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

function _ipldDagCbor(){return(
import('https://cdn.skypack.dev/@ipld/dag-cbor@7.0.1?min')
)}

async function _CID(){return(
(await import('https://jspm.dev/cids')).default
)}

function _filecoinJsSigner(){return(
import('https://jspm.dev/@blitslabs/filecoin-js-signer')
)}

function _FilecoinClient(filecoinJsSigner){return(
filecoinJsSigner.FilecoinClient
)}

function _FilecoinSigner(filecoinJsSigner){return(
filecoinJsSigner.FilecoinSigner
)}

function _filecoin_signer(FilecoinSigner){return(
new FilecoinSigner()
)}

function _filecoinNumber(){return(
import('https://cdn.skypack.dev/@glif/filecoin-number')
)}

function _FilecoinNumber(filecoinNumber){return(
filecoinNumber.FilecoinNumber
)}

function _BN(require){return(
require('https://bundle.run/bn.js@5.2.0')
)}

function _multiformats(){return(
import('https://cdn.skypack.dev/multiformats@9.6.5?min')
)}

function _base64ArrayBuffer(){return(
import('https://cdn.skypack.dev/base64-arraybuffer@1.0.2?min')
)}

function _utilHexEncoding(){return(
import('https://cdn.skypack.dev/@aws-sdk/util-hex-encoding@3.58.0?min')
)}

function _filecoinAddress(){return(
import('https://cdn.skypack.dev/@glif/filecoin-address')
)}

function _129(md){return(
md`## Boilerplate Code`
)}

function _initialCodeUrl(){return(
`https://raw.githubusercontent.com/raulk/fil-hello-world-actor/1b8aaab57ca82d296c041752b364c6685d57e84d/src/lib.rs`
)}

async function _initialCode(initialCodeUrl){return(
(await fetch(initialCodeUrl)).text()
)}

function _method2Code(){return(
`
/// Method num 2.
pub fn say_hello() -> Option<RawBytes> {
    let mut state = State::load();
    state.count += 1;
    let state_cid = state.save();

    let ret = to_vec(format!("Hello world #{}! CID: {}", &state.count, &state_cid).as_str());
    match ret {
        Ok(ret) => Some(RawBytes::new(ret)),
        Err(err) => {
            abort!(
                USR_ILLEGAL_STATE,
                "failed to serialize return value: {:?}",
                err
            );
        }
    }
}

/// Method num 3.
pub fn get_state_cid() -> Option<RawBytes> {
    let state_cid = sdk::sself::root().unwrap();
    Some(RawBytes::new(state_cid.to_bytes()))
}

/// Method num 4.
pub fn echo_raw_bytes(params: u32) -> Option<RawBytes> {
    let params = sdk::message::params_raw(params).unwrap().1;
    let params = RawBytes::new(params);
    
    let ret = to_vec(format!("Params {:?}",
      params).as_str());

    match ret {
        Ok(ret) => Some(RawBytes::new(ret)),
        Err(err) => {
            abort!(
                USR_ILLEGAL_STATE,
                "failed to serialize return value: {:?}",
                err
            );
        }
    }
}

#[derive(Debug, Serialize_tuple, Deserialize_tuple)]
pub struct CidParams {
    pub cid: Cid,
}

/// Method num 5.
pub fn get_state_cid_cbor() -> Option<RawBytes> {
    let state_cid = sdk::sself::root().unwrap();
    let cid_for_cbor = CidParams {
      cid: state_cid
    };
    Some(RawBytes::serialize(cid_for_cbor).unwrap())
}

/// Method num 6.
pub fn echo_cid_params(params: u32) -> Option<RawBytes> {
    let params = sdk::message::params_raw(params).unwrap().1;
    let params = RawBytes::new(params);
    let params: CidParams = params.deserialize().unwrap();
    
    let ret = to_vec(format!("Params {:?}",
     params).as_str());

match ret {
     Ok(ret) => Some(RawBytes::new(ret)),
     Err(err) => {
         abort!(
             USR_ILLEGAL_STATE,
             "failed to serialize return value: {:?}",
             err
         );
     }
 }
}

/// Method num 7.
pub fn get_old_state(params: u32) -> Option<RawBytes> {
    let params = sdk::message::params_raw(params).unwrap().1;
    let params = RawBytes::new(params);
    let params: CidParams = params.deserialize().unwrap();
    let old_state_cid = params.cid;

    let old_state = Blockstore.get_cbor::<State>(&old_state_cid).unwrap();
    Some(RawBytes::serialize(&old_state).unwrap())
}

/// Method num 8.
pub fn get_state_as_bytes(params: u32) -> Option<RawBytes> {
    let params = sdk::message::params_raw(params).unwrap().1;
    let params = RawBytes::new(params);
    let params: CidParams = params.deserialize().unwrap();
    let old_state_cid = params.cid;

    let old_state_vec = sdk::ipld::get(&old_state_cid).unwrap();
    Some(RawBytes::new(old_state_vec))
}

/// Storage power actor state
#[derive(Default, Serialize_tuple, Deserialize_tuple)]
pub struct PowerActorState {
    #[serde(with = "bigint_ser")]
    pub total_raw_byte_power: StoragePower,
    #[serde(with = "bigint_ser")]
    pub total_bytes_committed: StoragePower,
    #[serde(with = "bigint_ser")]
    pub total_quality_adj_power: StoragePower,
    #[serde(with = "bigint_ser")]
    pub total_qa_bytes_committed: StoragePower,
    #[serde(with = "bigint_ser")]
    pub total_pledge_collateral: TokenAmount,

    #[serde(with = "bigint_ser")]
    pub this_epoch_raw_byte_power: StoragePower,
    #[serde(with = "bigint_ser")]
    pub this_epoch_quality_adj_power: StoragePower,
    #[serde(with = "bigint_ser")]
    pub this_epoch_pledge_collateral: TokenAmount,
    pub this_epoch_qa_power_smoothed: FilterEstimate,

    pub miner_count: i64,
    /// Number of miners having proven the minimum consensus power.
    pub miner_above_min_power_count: i64,

    /// A queue of events to be triggered by cron, indexed by epoch.
    pub cron_event_queue: Cid, // Multimap, (HAMT[ChainEpoch]AMT[CronEvent]

    /// First epoch in which a cron task may be stored. Cron will iterate every epoch between this
    /// and the current epoch inclusively to find tasks to execute.
    pub first_cron_epoch: ChainEpoch,

    /// Claimed power for each miner.
    pub claims: Cid, // Map, HAMT[address]Claim

    pub proof_validation_batch: Option<Cid>,
}

/// Method num 9.
pub fn get_power_actor_state(params: u32) -> Option<RawBytes> {
    let params = sdk::message::params_raw(params).unwrap().1;
    let params = RawBytes::new(params);
    let params: CidParams = params.deserialize().unwrap();
    let state_cid = params.cid;

    let state = Blockstore.get_cbor::<PowerActorState>(&state_cid).unwrap();
    Some(RawBytes::serialize(&state).unwrap())
}

#[derive(Debug, Serialize_tuple, Deserialize_tuple, Clone, PartialEq)]
pub struct Claim {
    /// Miner's proof type used to determine minimum miner size
    pub window_post_proof_type: RegisteredPoStProof,
    /// Sum of raw byte power for a miner's sectors.
    #[serde(with = "bigint_ser")]
    pub raw_byte_power: StoragePower,
    /// Sum of quality adjusted power for a miner's sectors.
    #[serde(with = "bigint_ser")]
    pub quality_adj_power: StoragePower,
}

/// Method num 10.
pub fn get_power_actor_miners(params: u32) -> Option<RawBytes> {
    let params = sdk::message::params_raw(params).unwrap().1;
    let params = RawBytes::new(params);
    let params: CidParams = params.deserialize().unwrap();
    let state_cid = params.cid;

    let state = Blockstore.get_cbor::<PowerActorState>(&state_cid).unwrap().unwrap();
    let claims = Hamt::<Blockstore, _>::load_with_bit_width(&state.claims, Blockstore, HAMT_BIT_WIDTH).unwrap();
    let mut miners = Vec::new();
    claims.for_each(|k, _: &Claim| {
      miners.push(Address::from_bytes(&k.0)?);
      Ok(())
    }).ok()?;
    Some(RawBytes::serialize(&miners).unwrap())
}

`.trim()
)}

function _templateStart(initialCode)
{
  const code = initialCode
    .replace('pub fn invoke(_: u32)', 'pub fn invoke(params: u32)')
    .replace(/\/\/\/ Method num 2.*/s, '')
    .split('\n')

  const insertAt = code.findIndex(line => line.match(/say_hello\(\)/)) + 1
  code.splice(
    insertAt, 0,
    '        3 => get_state_cid(),',
    '        4 => echo_raw_bytes(params),',
    '        5 => get_state_cid_cbor(),',
    '        6 => echo_cid_params(params),',
    '        7 => get_old_state(params),',
    '        8 => get_state_as_bytes(params),',
    '        9 => get_power_actor_state(params),',
    '        10 => get_power_actor_miners(params),',
  )
  code.splice(
    10, 0,
    'use fvm_shared::bigint::bigint_ser;',
    'use fvm_shared::econ::TokenAmount;',
    'use fvm_shared::sector::{RegisteredPoStProof, StoragePower};',
    'use fvm_shared::clock::ChainEpoch;',
    'use fvm_shared::smooth::FilterEstimate;',
    'use fvm_ipld_hamt::Hamt;',
    'use fvm_shared::HAMT_BIT_WIDTH;',
    'use fvm_shared::address::Address;',
  )
  return code.join('\n')
}


function _initialCargoTomlUrl(){return(
'https://raw.githubusercontent.com/raulk/fil-hello-world-actor/c0ea4bde7da49c6d5b0d3ba01d592f553dd9589c/Cargo.toml'
)}

async function _initialCargoToml(initialCargoTomlUrl){return(
(await fetch(initialCargoTomlUrl)).text()
)}

function _patchedCargoToml(initialCargoToml)
{
  function gitVersion (version) {
    const rev = '297a7694'
    return `{ version = "${version}", git = "https://github.com/filecoin-project/ref-fvm", rev = "${rev}" }`
  }
  const replaced = initialCargoToml
    .replace(/fvm_sdk = .*/, `fvm_sdk = ${gitVersion('0.6.1')}`)
    .replace(/fvm_shared = .*/, `fvm_shared = ${gitVersion('0.6.1')}`)
    .replace(/fvm_ipld_blockstore = .*/, `fvm_ipld_blockstore = ${gitVersion('0.1.0')}`)
    .replace(/fvm_ipld_encoding = .*/, `fvm_ipld_encoding = ${gitVersion('0.2.0')}`)
  const lines = replaced.split('\n')
  const insertAt = lines.findIndex(line => line.match(/dev-dependencies/)) - 1
  lines.splice(
    insertAt, 0,
    `fvm_ipld_hamt = ${gitVersion('0.5.1')}`,
  )
  return lines.join('\n')
}


function _137(md){return(
md`## Lotus Utilities`
)}

function _baseUrl(){return(
"https://fvm-2.default.knative.hex.camp"
)}

async function _token(baseUrl){return(
(await fetch(`${baseUrl}/public/token`)).text()
)}

function _client(BrowserProvider,baseUrl,token,LotusRPC,schema)
{
  const provider = new BrowserProvider(`${baseUrl}/rpc/v0`, { token })
  return new LotusRPC(provider, { schema })
}


function _filecoin_client(FilecoinClient,baseUrl,token){return(
new FilecoinClient(`${baseUrl}/rpc/v0`, token)
)}

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

function _147(md){return(
md`## Backups`
)}

function _149(backups){return(
backups()
)}

function _150(backupNowButton){return(
backupNowButton()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("getBalances")).define("getBalances", ["client"], _getBalances);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("viewof editor")).define("viewof editor", ["skypack","method2Code"], _editor);
  main.variable(observer("editor")).define("editor", ["Generators", "viewof editor"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["templateStart","editor","html","button"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer("viewof compileToWasmButton")).define("viewof compileToWasmButton", ["templateStart","editor","Inputs"], _compileToWasmButton);
  main.variable(observer("compileToWasmButton")).define("compileToWasmButton", ["Generators", "viewof compileToWasmButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["compileStatus","md","Promises","html","stripAnsi"], _12);
  main.variable(observer()).define(["compileStatus","md"], _13);
  main.variable(observer()).define(["compileStatus","html","button","md"], _14);
  main.variable(observer("compileStatus")).define("compileStatus", ["compileToWasmButton","baseUrl","patchedCargoToml","cbor"], _compileStatus);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer()).define(["md","currentHeight"], _17);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer()).define(["md"], _19);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer("viewof installActorButton")).define("viewof installActorButton", ["Inputs","compileStatus"], _installActorButton);
  main.variable(observer("installActorButton")).define("installActorButton", ["Generators", "viewof installActorButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["installActorStatus","md","Promises","html"], _22);
  main.variable(observer("installActorStatus")).define("installActorStatus", ["installActorButton","walletDefaultAddress","compileStatus","client"], _installActorStatus);
  main.variable(observer()).define(["md"], _24);
  main.variable(observer()).define(["md"], _25);
  main.variable(observer()).define(["md"], _26);
  main.variable(observer("viewof createActorButton")).define("viewof createActorButton", ["Inputs","installActorStatus"], _createActorButton);
  main.variable(observer("createActorButton")).define("createActorButton", ["Generators", "viewof createActorButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["createActorStatus","md","Promises","createActorButton","html"], _28);
  main.variable(observer("createActorStatus")).define("createActorStatus", ["createActorButton","CID","cbor","walletDefaultAddress","client"], _createActorStatus);
  main.variable(observer("actorId")).define("actorId", ["createActorStatus"], _actorId);
  main.variable(observer()).define(["md"], _31);
  main.variable(observer("viewof invokeMethod2Button")).define("viewof invokeMethod2Button", ["Inputs","createActorStatus"], _invokeMethod2Button);
  main.variable(observer("invokeMethod2Button")).define("invokeMethod2Button", ["Generators", "viewof invokeMethod2Button"], (G, _) => G.input(_));
  main.variable(observer()).define(["invokeMethod2Status","md","Promises","invokeMethod2Button","html"], _33);
  main.variable(observer("invokeMethod2Status")).define("invokeMethod2Status", ["invokeMethod2Button","walletDefaultAddress","client","cbor"], _invokeMethod2Status);
  main.variable(observer()).define(["md"], _35);
  main.variable(observer("viewof callMethod3Button")).define("viewof callMethod3Button", ["Inputs","createActorStatus"], _callMethod3Button);
  main.variable(observer("callMethod3Button")).define("callMethod3Button", ["Generators", "viewof callMethod3Button"], (G, _) => G.input(_));
  main.variable(observer("callMethod3Result")).define("callMethod3Result", ["callMethod3Button","walletDefaultAddress","client"], _callMethod3Result);
  main.variable(observer("stateCid")).define("stateCid", ["callMethod3Result","base64ArrayBuffer","multiformats"], _stateCid);
  main.variable(observer()).define(["md"], _39);
  main.variable(observer("viewof callMethod4Button")).define("viewof callMethod4Button", ["Inputs","createActorStatus"], _callMethod4Button);
  main.variable(observer("callMethod4Button")).define("callMethod4Button", ["Generators", "viewof callMethod4Button"], (G, _) => G.input(_));
  main.variable(observer()).define(["CID","stateCid"], _41);
  main.variable(observer("callMethod4Params")).define("callMethod4Params", ["CID","stateCid","cbor"], _callMethod4Params);
  main.variable(observer("callMethod4Result")).define("callMethod4Result", ["callMethod4Button","walletDefaultAddress","callMethod4Params","client"], _callMethod4Result);
  main.variable(observer()).define(["callMethod4Result","cbor"], _44);
  main.variable(observer()).define(["md"], _45);
  main.variable(observer("viewof callMethod5Button")).define("viewof callMethod5Button", ["Inputs","createActorStatus"], _callMethod5Button);
  main.variable(observer("callMethod5Button")).define("callMethod5Button", ["Generators", "viewof callMethod5Button"], (G, _) => G.input(_));
  main.variable(observer("callMethod5Result")).define("callMethod5Result", ["callMethod5Button","walletDefaultAddress","client"], _callMethod5Result);
  main.variable(observer("decodedCallMethod5Result")).define("decodedCallMethod5Result", ["callMethod5Result","cbor"], _decodedCallMethod5Result);
  main.variable(observer()).define(["decodedCallMethod5Result","multiformats"], _49);
  main.variable(observer()).define(["md"], _50);
  main.variable(observer("oldStateCid")).define("oldStateCid", _oldStateCid);
  main.variable(observer("viewof callMethod6Button")).define("viewof callMethod6Button", ["Inputs","createActorStatus"], _callMethod6Button);
  main.variable(observer("callMethod6Button")).define("callMethod6Button", ["Generators", "viewof callMethod6Button"], (G, _) => G.input(_));
  main.variable(observer("callMethod6Params")).define("callMethod6Params", ["CID","oldStateCid","cbor"], _callMethod6Params);
  main.variable(observer("callMethod6Result")).define("callMethod6Result", ["callMethod6Button","walletDefaultAddress","callMethod6Params","client"], _callMethod6Result);
  main.variable(observer("decodedCallMethod6Result")).define("decodedCallMethod6Result", ["callMethod6Result","cbor"], _decodedCallMethod6Result);
  main.variable(observer()).define(["md"], _56);
  main.variable(observer("viewof callMethod7Button")).define("viewof callMethod7Button", ["Inputs","createActorStatus"], _callMethod7Button);
  main.variable(observer("callMethod7Button")).define("callMethod7Button", ["Generators", "viewof callMethod7Button"], (G, _) => G.input(_));
  main.variable(observer("callMethod7Params")).define("callMethod7Params", ["CID","oldStateCid","cbor"], _callMethod7Params);
  main.variable(observer("callMethod7Result")).define("callMethod7Result", ["callMethod7Button","walletDefaultAddress","callMethod7Params","client"], _callMethod7Result);
  main.variable(observer()).define(["callMethod7Result","cbor"], _60);
  main.variable(observer()).define(["md"], _61);
  main.variable(observer()).define(["md"], _62);
  main.variable(observer("viewof callMethod8Button")).define("viewof callMethod8Button", ["Inputs","createActorStatus"], _callMethod8Button);
  main.variable(observer("callMethod8Button")).define("callMethod8Button", ["Generators", "viewof callMethod8Button"], (G, _) => G.input(_));
  main.variable(observer("callMethod8Params")).define("callMethod8Params", ["CID","oldStateCid","cbor"], _callMethod8Params);
  main.variable(observer("callMethod8Result")).define("callMethod8Result", ["callMethod8Button","walletDefaultAddress","callMethod8Params","client"], _callMethod8Result);
  main.variable(observer()).define(["callMethod8Result","cbor"], _66);
  main.variable(observer()).define(["md"], _67);
  main.variable(observer("viewof getPowerActorStateButton")).define("viewof getPowerActorStateButton", ["Inputs"], _getPowerActorStateButton);
  main.variable(observer("getPowerActorStateButton")).define("getPowerActorStateButton", ["Generators", "viewof getPowerActorStateButton"], (G, _) => G.input(_));
  main.variable(observer("getPowerActor")).define("getPowerActor", ["getPowerActorStateButton","client"], _getPowerActor);
  main.variable(observer("powerActorStateCid")).define("powerActorStateCid", ["getPowerActor"], _powerActorStateCid);
  main.variable(observer()).define(["md"], _71);
  main.variable(observer("viewof callMethod8PowerButton")).define("viewof callMethod8PowerButton", ["Inputs","createActorStatus"], _callMethod8PowerButton);
  main.variable(observer("callMethod8PowerButton")).define("callMethod8PowerButton", ["Generators", "viewof callMethod8PowerButton"], (G, _) => G.input(_));
  main.variable(observer("callMethod8PowerParams")).define("callMethod8PowerParams", ["CID","powerActorStateCid","cbor"], _callMethod8PowerParams);
  main.variable(observer("callMethod8PowerResult")).define("callMethod8PowerResult", ["callMethod8PowerButton","walletDefaultAddress","callMethod8PowerParams","client"], _callMethod8PowerResult);
  main.variable(observer("powerStateRaw")).define("powerStateRaw", ["callMethod8PowerResult","cbor"], _powerStateRaw);
  main.variable(observer()).define(["md"], _76);
  main.variable(observer("powerActorState")).define("powerActorState", ["powerStateRaw","bytesToBig","multiformats"], _powerActorState);
  main.variable(observer()).define(["powerActorState"], _78);
  main.variable(observer()).define(["md"], _79);
  main.variable(observer("viewof callMethod9Button")).define("viewof callMethod9Button", ["Inputs","createActorStatus"], _callMethod9Button);
  main.variable(observer("callMethod9Button")).define("callMethod9Button", ["Generators", "viewof callMethod9Button"], (G, _) => G.input(_));
  main.variable(observer("callMethod9Params")).define("callMethod9Params", ["CID","powerActorStateCid","cbor"], _callMethod9Params);
  main.variable(observer("callMethod9Result")).define("callMethod9Result", ["callMethod9Button","walletDefaultAddress","callMethod9Params","client"], _callMethod9Result);
  main.variable(observer("powerState9Raw")).define("powerState9Raw", ["callMethod9Result","cbor"], _powerState9Raw);
  main.variable(observer()).define(["md"], _84);
  main.variable(observer("viewof callMethod10Button")).define("viewof callMethod10Button", ["Inputs","createActorStatus"], _callMethod10Button);
  main.variable(observer("callMethod10Button")).define("callMethod10Button", ["Generators", "viewof callMethod10Button"], (G, _) => G.input(_));
  main.variable(observer("callMethod10Params")).define("callMethod10Params", ["CID","powerActorStateCid","cbor"], _callMethod10Params);
  main.variable(observer("callMethod10Result")).define("callMethod10Result", ["callMethod10Button","callMethod9Button","walletDefaultAddress","callMethod10Params","client"], _callMethod10Result);
  main.variable(observer("callMethod10ResultDecoded")).define("callMethod10ResultDecoded", ["callMethod10Result","cbor"], _callMethod10ResultDecoded);
  main.variable(observer("miners")).define("miners", ["callMethod10ResultDecoded","filecoinAddress"], _miners);
  main.variable(observer()).define(["miners","Inputs"], _90);
  main.variable(observer()).define(["miners","md"], _91);
  main.variable(observer()).define(["md"], _92);
  main.variable(observer()).define(["FilecoinNumber"], _93);
  main.variable(observer()).define(["cbor","FilecoinNumber"], _94);
  main.variable(observer("bigToBytes")).define("bigToBytes", ["BN"], _bigToBytes);
  main.variable(observer()).define(["bigToBytes"], _96);
  main.variable(observer()).define(["bigToBytes"], _97);
  main.variable(observer()).define(["bigToBytes","FilecoinNumber"], _98);
  main.variable(observer()).define(_99);
  main.variable(observer()).define(["bigToBytes"], _100);
  main.variable(observer()).define(["bigToBytes"], _101);
  main.variable(observer()).define(["bigToBytes"], _102);
  main.variable(observer("bytesToBig")).define("bytesToBig", ["BN"], _bytesToBig);
  main.variable(observer()).define(["bytesToBig","bigToBytes"], _104);
  main.variable(observer()).define(["bytesToBig","bigToBytes"], _105);
  main.variable(observer()).define(["md"], _106);
  main.variable(observer()).define(["md"], _107);
  main.variable(observer()).define(["md"], _108);
  main.variable(observer("skypack")).define("skypack", _skypack);
  main.variable(observer("LotusRPC")).define("LotusRPC", _LotusRPC);
  main.variable(observer("BrowserProvider")).define("BrowserProvider", _BrowserProvider);
  main.variable(observer("schema")).define("schema", _schema);
  main.variable(observer("stripAnsi")).define("stripAnsi", _stripAnsi);
  main.variable(observer("cbor")).define("cbor", _cbor);
  main.variable(observer("ipldDagCbor")).define("ipldDagCbor", _ipldDagCbor);
  main.variable(observer("CID")).define("CID", _CID);
  const child1 = runtime.module(define1);
  main.import("button", child1);
  main.variable(observer("filecoinJsSigner")).define("filecoinJsSigner", _filecoinJsSigner);
  main.variable(observer("FilecoinClient")).define("FilecoinClient", ["filecoinJsSigner"], _FilecoinClient);
  main.variable(observer("FilecoinSigner")).define("FilecoinSigner", ["filecoinJsSigner"], _FilecoinSigner);
  main.variable(observer("filecoin_signer")).define("filecoin_signer", ["FilecoinSigner"], _filecoin_signer);
  main.variable(observer("filecoinNumber")).define("filecoinNumber", _filecoinNumber);
  main.variable(observer("FilecoinNumber")).define("FilecoinNumber", ["filecoinNumber"], _FilecoinNumber);
  main.variable(observer("BN")).define("BN", ["require"], _BN);
  main.variable(observer("multiformats")).define("multiformats", _multiformats);
  main.variable(observer("base64ArrayBuffer")).define("base64ArrayBuffer", _base64ArrayBuffer);
  main.variable(observer("utilHexEncoding")).define("utilHexEncoding", _utilHexEncoding);
  main.variable(observer("filecoinAddress")).define("filecoinAddress", _filecoinAddress);
  main.variable(observer()).define(["md"], _129);
  main.variable(observer("initialCodeUrl")).define("initialCodeUrl", _initialCodeUrl);
  main.variable(observer("initialCode")).define("initialCode", ["initialCodeUrl"], _initialCode);
  main.variable(observer("method2Code")).define("method2Code", _method2Code);
  main.variable(observer("templateStart")).define("templateStart", ["initialCode"], _templateStart);
  main.variable(observer("initialCargoTomlUrl")).define("initialCargoTomlUrl", _initialCargoTomlUrl);
  main.variable(observer("initialCargoToml")).define("initialCargoToml", ["initialCargoTomlUrl"], _initialCargoToml);
  main.variable(observer("patchedCargoToml")).define("patchedCargoToml", ["initialCargoToml"], _patchedCargoToml);
  main.variable(observer()).define(["md"], _137);
  main.variable(observer("baseUrl")).define("baseUrl", _baseUrl);
  main.variable(observer("token")).define("token", ["baseUrl"], _token);
  main.variable(observer("client")).define("client", ["BrowserProvider","baseUrl","token","LotusRPC","schema"], _client);
  main.variable(observer("filecoin_client")).define("filecoin_client", ["FilecoinClient","baseUrl","token"], _filecoin_client);
  main.variable(observer("heightStream")).define("heightStream", ["client","Promises"], _heightStream);
  main.define("initial ready", _ready);
  main.variable(observer("mutable ready")).define("mutable ready", ["Mutable", "initial ready"], (M, _) => new M(_));
  main.variable(observer("ready")).define("ready", ["mutable ready"], _ => _.generator);
  main.variable(observer("heightReadyTapStream")).define("heightReadyTapStream", ["heightStream","mutable ready"], _heightReadyTapStream);
  main.variable(observer("currentHeight")).define("currentHeight", ["heightReadyTapStream"], _currentHeight);
  main.variable(observer("walletDefaultAddress")).define("walletDefaultAddress", ["ready","client"], _walletDefaultAddress);
  main.variable(observer()).define(["md"], _147);
  const child2 = runtime.module(define2);
  main.import("backups", child2);
  main.import("backupNowButton", child2);
  main.variable(observer()).define(["backups"], _149);
  main.variable(observer()).define(["backupNowButton"], _150);
  return main;
}
