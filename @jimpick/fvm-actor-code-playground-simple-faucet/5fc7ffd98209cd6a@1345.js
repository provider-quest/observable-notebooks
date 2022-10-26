import define1 from "./9a34a4df6e8a276b@50.js";
import define2 from "./c4e4a355c53d2a1a@111.js";

function _1(md){return(
md`# FVM Actor Code Playground - "Simple Faucet"`
)}

function _2(md){return(
md`A super simple actor that stores some funds and lets any actor withdraw any requested amount.

This notebook:

* Generates 3 client-side addresses + secrets using [filecoin-js-signer](https://github.com/blitslabs/filecoin-js-signer). The secrets are stored in your browser, not on the Lotus node.
* Send starter funds from Lotus to each client address (1 FIL each)
* Compiles, installs and creates the "faucet actor"
  * Has a single method to "withdraw" funds (no security - basically a "cookie jar")
* Funds the faucet actor with 100 FIL
* Has a UI to select any of the 3 actors, choose an amount, and make the withdrawal, showing the balances afterwards
* Bonus: What happens when multiple withdrawals happen at once for more than the available funds?
* When there are insufficient funds, we just panic. We probably should be aborting using an [exit code](https://docs.rs/fvm_shared/0.6.1/fvm_shared/error/struct.ExitCode.html).
* Based on https://observablehq.com/@jimpick/fvm-actor-code-playground-hello-world`
)}

function _3(md){return(
md`**Note:** The on-demand localnet will be reclaimed after 3 minutes of inactivity. Modifications to the blockchain state are ephemeral -- good for testing! Staying on this page will keep it alive, but if you navigate away and then return, it may get restarted with fresh state. If that happens, reload the web page. There is one instance of the localnet shared between all users.`
)}

function _4(md){return(
md`## Generate Client Side Addresses`
)}

function _5(md){return(
md`We use \`filecoin-js-signer\` to generate a random mnemomic phrase. You could save this phrase and re-use it to generate the secrets. In this notebook, we just use different secrets on each page reload.`
)}

function _randomMnemonic(filecoin_signer)
{
  // https://github.com/blitslabs/filecoin-js-signer#filecoin-signer
  const strength = 128 // 128 => 12 words | 256 => 24 words
  return filecoin_signer.wallet.generateMnemonic(strength)
}


async function _keys(filecoin_signer,randomMnemonic)
{
  const keys = []
  for (let i = 0; i < 3; i++) {
    const network = 'testnet'
    
    keys.push(await filecoin_signer.wallet.keyDerive(randomMnemonic, `m/44'/461'/0'/0/${i}`, network))
  }
  return keys
}


function _clientAddresses(keys){return(
keys.map(key => key.address)
)}

function _9(md){return(
md`## Wait for Lotus to be ready, then transfer 1 FIL to each address`
)}

function _10(md){return(
md`Be patient as it takes a little while for the funds to be sent via the Lotus JSON-RPC API when the notebook is first loaded.`
)}

async function* _11(transferFundsStatus,md,Promises)
{
  if (transferFundsStatus === undefined || !transferFundsStatus) {
    yield md``
    return
  }
  if (transferFundsStatus.transferring || transferFundsStatus.waiting) {
    while (true) {
      const elapsed = (Date.now() - transferFundsStatus.start) / 1000
      yield md`Transferring initial funds to client accounts... (${elapsed.toFixed(1)}s)`
      await Promises.delay(1000)
    }
  }
  if (transferFundsStatus.transferred) {
    yield md`**Funds transferred**!`
  }
}


async function* _transferFundsStatus(walletDefaultAddress,keys,client)
{
  if (walletDefaultAddress && keys) {
    const start = Date.now()
    yield {
      transferring: true,
      start
    }
    const responses = []
    for (const key of keys) {
      // Sending install actor message...
      const messageBody = {
        To: key.address,
        From: walletDefaultAddress,
        Value: "1000000000000000000",
        Method: 0
      }
      responses.push(await client.mpoolPushMessage(messageBody, null))
    }
    const waitStart = Date.now()
    yield { waiting: true, start, waitStart, responses }
    const promises = []
    for (const response of responses) {
      promises.push(client.stateWaitMsg(response.CID, 0))
    }
    const waitResponses = await Promise.all(promises)
    const lookups = {}
    for (const key of keys) {
      lookups[key.address] = await client.stateLookupID(key.address, [])
    }
    yield { transferred: true, responses, waitResponses, lookups }
  }
}


function _13(md){return(
md`## Initial Balances`
)}

function _14(md){return(
md`Here are the addresses and IDs of the 3 clients we created, as well at their initial balances (should be 1 FIL each).`
)}

function _initialBalances(transferFundsStatus,md,getBalances,clientAddresses){return(
!transferFundsStatus ? md`Waiting...` : transferFundsStatus.transferred && getBalances(clientAddresses)
)}

function _16(initialBalances,Inputs,transferFundsStatus,FilecoinNumber){return(
initialBalances && Inputs.table(
  initialBalances.map(({ address, balance }) => ({
    id: transferFundsStatus.lookups[address],
    address,
    balance
  })),
  {
    format: {
      balance: num => new FilecoinNumber(num, 'attofil').toFil()
    }
  }
)
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

function _18(md){return(
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


function _20(md){return(
md`If you have changed the code and would like to save it for future use, you can use this button to save it to a file.`
)}

function _21(templateStart,editor,html,button)
{
  const code = templateStart + '\n' + editor.state.doc.toString()
  return html`Optional: ${button(code, `lib.rs`)}`
}


function _22(md){return(
md`**Pro-tip:** *You can also "fork" this notebook and use the saved file as an attachment.*`
)}

function _23(md){return(
md`## Step 2: Compile

We have implemented a [simple web service](https://github.com/jimpick/lotus-fvm-localnet-web/blob/main/server.mjs) that accepts a HTTP POST with the code above, and returns a compiled WASM binary (wrapped in a CBOR array, encoded in base64, ready to pass as a 'params' string). The code above is substituted for \`src/lib.rs\` into the [raulk/fil-hello-world-actor](https://github.com/raulk/fil-hello-world-actor) example and built using \`cargo build\`. It should compile in less than 30 seconds.`
)}

function _compileToWasmButton(templateStart,editor,Inputs)
{
  const code = templateStart + '\n' + editor.state.doc.toString()
  return Inputs.button('Compile to WASM', {value: null, reduce: () => code})
}


async function* _25(compileStatus,md,Promises,html,stripAnsi)
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


function _26(compileStatus,md){return(
compileStatus && compileStatus.wasmBinary ? md`Optional: You can download the compiled WASM bundle here. (Not needed if you are just using it from this notebook)` : md``
)}

function _27(compileStatus,html,button,md){return(
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


function _29(md){return(
md`## Step 3: Connect to Hosted "localnet"

This notebook connects to a [hosted instance](https://github.com/jimpick/lotus-fvm-localnet-web) of a Lotus "localnet" (started on demand) into which you can install the actor code, create an actor instance, and invoke methods against.

If the localnet is started and online, the following chain height should be increasing every 4-10 seconds (depending on system load):`
)}

function _30(md,currentHeight){return(
md`**Height: ${currentHeight}**`
)}

function _31(md){return(
md`If the connection is working, then proceed to the next step.`
)}

function _32(md){return(
md`## Step 4: Install the Actor Code`
)}

function _33(md){return(
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

async function* _35(installActorStatus,md,Promises,html)
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


function _37(md){return(
md`## Step 5: Create an Actor Instance for the Faucet`
)}

function _38(md){return(
md`If you have completed the previous step, you will have a "Code CID" for the WASM bundle you just installed. Now we can create an actor instance. It is possible to create lots and lots of actors using the same code, each will get assigned a unique "ID Address" (eg. t01001) to which messages and funds can be sent, as well as an equivalent "Robust Address" alias (eg. "t2...") which maps on the same address (but doesn't change in the event of a chain re-organization).`
)}

function _39(md){return(
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

async function* _41(createActorStatus,md,Promises,createActorButton,html)
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


function _43(md){return(
md`## Step 6: Send funds to Faucet Actor`
)}

function _sendFundsToFaucetButton(Inputs,createActorStatus){return(
Inputs.button('Send Funds to Faucet (100 FIL)', {
  disabled: !createActorStatus ||
    !createActorStatus.waitResponse ||
    !createActorStatus.waitResponse.ReturnDec ||
    !createActorStatus.waitResponse.ReturnDec.IDAddress,
  value: null,
  reduce: () => createActorStatus.waitResponse.ReturnDec.IDAddress
})
)}

async function* _45(sendFundsToFaucetStatus,md,Promises,html)
{
  if (sendFundsToFaucetStatus === undefined || !sendFundsToFaucetStatus) {
    yield md`Status: Funds have not been sent yet.`
    return
  }
  if (sendFundsToFaucetStatus.invoking) {
    while (true) {
      const elapsed = (Date.now() - sendFundsToFaucetStatus.start) / 1000
      yield md`Sending message... (${elapsed.toFixed(1)}s)`
      await Promises.delay(1000)
    }
  }
  if (sendFundsToFaucetStatus.response) {
    while (true) {
      let output = `<div><b>Send funds message sent</b></div>
      <div>Message CID: ${sendFundsToFaucetStatus.response.CID['/']}</div>`
      if (sendFundsToFaucetStatus.waitResponse) {
        output += `<div>Message executed in block at height: ${sendFundsToFaucetStatus.waitResponse.Height}</div>`
        yield html`${output}`
        break
      }
      const elapsed = (Date.now() - sendFundsToFaucetStatus.waitStart) / 1000
      output += `<div>Waiting for message to be executed in a block... (${elapsed.toFixed(1)}s)</div>`
      yield html`${output}`
      await Promises.delay(1000)
    }
  }
}


async function _46(fundedFaucetAddress,md,FilecoinNumber,getBalances){return(
fundedFaucetAddress ? md`Faucet Balance after funding: **${fundedFaucetAddress && new FilecoinNumber((await getBalances([fundedFaucetAddress]))[0].balance, 'attofil').toFil()} FIL**` : md``
)}

async function* _sendFundsToFaucetStatus(sendFundsToFaucetButton,walletDefaultAddress,client,cbor)
{
  if (sendFundsToFaucetButton) {
    const start = Date.now()
    yield {
      invoking: true,
      start
    }
    const messageBody = {
      To: sendFundsToFaucetButton,
      From: walletDefaultAddress,
      Value: "100000000000000000000",
      Method: 0,
      Params: null
    }
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


function _fundedFaucetAddress(sendFundsToFaucetStatus,createActorStatus){return(
sendFundsToFaucetStatus && sendFundsToFaucetStatus.invoked && createActorStatus.waitResponse.ReturnDec.RobustAddress
)}

function _49(md){return(
md`## Step 7: Call Withdraw Method`
)}

function _50(md){return(
md`Now that we've got an actor running with an ID Address, we can call the method we have defined. In the Hello World example, method #2 is dispatched in the invoke() function to call the say_hello() function, which returns a message (with a counter that increments each time it is called).`
)}

function _51(md){return(
md`At the command line, this is the same as: \`lotus chain invoke <actor-id-address> <method-number>\``
)}

function _withdrawForm(Inputs,clientAddresses,transferFundsStatus){return(
Inputs.form([
  Inputs.select(
    clientAddresses.map(address => ({
      id: transferFundsStatus.lookups[address],
      address
    })),
    {
      label: 'Client Address',
      format: x => `${x.id}: ${x.address}`
    }
  ),
  Inputs.range([0, 200], {value: 5, step: 0.1, label: 'Amount to Withdraw'})
])
)}

function _withdrawButton(Inputs,createActorStatus,withdrawForm){return(
Inputs.button('Withdraw from Faucet', {
  disabled: !createActorStatus ||
    !createActorStatus.waitResponse ||
    !createActorStatus.waitResponse.ReturnDec ||
    !createActorStatus.waitResponse.ReturnDec.IDAddress,
  value: null,
  reduce: () => ({
    faucetAddress: createActorStatus.waitResponse.ReturnDec.IDAddress,
    clientAddress: withdrawForm[0].address,
    amount: withdrawForm[1]
  })
})
)}

async function* _54(invokeMethod2Status,md,Promises,withdrawButton,html)
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
      <div>To: ${withdrawButton.faucetAddress} (Faucet)</div>
      <div>Method: 2</div>
      <div>Message CID: ${invokeMethod2Status.response.CID['/']}</div>
      `
      if (invokeMethod2Status.waitResponse) {
        output += `<div>Message executed in block at height: ${invokeMethod2Status.waitResponse.Height}</div>`
        output += `<div>Gas used: ${invokeMethod2Status.waitResponse.Receipt.GasUsed}</div>`
        output += `<div>Exit Code: ${invokeMethod2Status.waitResponse.Receipt.ExitCode}</div>`
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


function _55(md){return(
md`New balances:`
)}

async function _56(updateButton,invokeMethod2Status,md,getBalances,fundedFaucetAddress,clientAddresses,Inputs,withdrawButton,transferFundsStatus,FilecoinNumber)
{
  updateButton;
  if (!invokeMethod2Status || !invokeMethod2Status.invoked) {
    return md``
  }
  const balances = await getBalances([fundedFaucetAddress].concat(clientAddresses))
  return Inputs.table(
    balances.map(({ address, balance }) => ({
      id: address === fundedFaucetAddress ? `${withdrawButton.faucetAddress} (Faucet)` :
        transferFundsStatus.lookups[address],
      address,
      balance
    })),
    {
      format: {
        balance: num => new FilecoinNumber(num, 'attofil').toFil()
      }
    }
  )
}


function _updateButton(Inputs){return(
Inputs.button("Update")
)}

async function* _invokeMethod2Status(withdrawButton,FilecoinNumber,cbor,bigToBytes,keys,filecoin_client,client)
{
  if (withdrawButton) {
    const start = Date.now()
    console.log('Withdraw', withdrawButton)
    yield {
      invoking: true,
      start
    }
    const message = {
      To: withdrawButton.faucetAddress,
      From: withdrawButton.clientAddress,
      Nonce: 0,
      Value: new FilecoinNumber(0, 'attofil'),
      GasLimit: 1000000000,
      GasFeeCap: new FilecoinNumber(0, 'attofil'),
      GasPremium: new FilecoinNumber(0, 'attofil'),
      Method: 2,
      Params: cbor.encode([bigToBytes(new FilecoinNumber(withdrawButton.amount, 'fil'))]).toString('base64')
    }
    const privateKey = keys.find(({ address }) => address === withdrawButton.clientAddress).privateKey
    console.log('message', message)
    const responseCID = await filecoin_client.tx.sendMessage(
      message,
      privateKey,
      true, // updateMsgNonce
      false // waitMsg
    )
    const waitStart = Date.now()
    yield { waiting: true, waitStart, response: { CID: responseCID } }
    const waitResponse = await client.stateWaitMsg(responseCID, 0)
    let decodedResult
    if (waitResponse.Receipt && waitResponse.Receipt.Return) {
      decodedResult = cbor.decodeAll(waitResponse.Receipt.Return, 'base64')
    }
    yield { invoked: true, response: { CID: responseCID }, waitResponse, decodedResult }
  }
}


function _59(md){return(
md`## Step 9: What happens if multiple clients withdraw all funds at the same time?`
)}

function _60(md){return(
md`If everybody tries to drain the faucet of all funds at the same moment in time, what happens? Does only one client get the funds? Which one? Maybe nobody gets the funds?`
)}

function _drainRaceButton(Inputs){return(
Inputs.button("Withdraw entire faucet balance from 3 clients at once!")
)}

async function* _62(drainRaceStatus,md,Promises,fundedFaucetAddress,keys,transferFundsStatus,html)
{
  if (drainRaceStatus === undefined || !drainRaceStatus) {
    yield md`Status: Methods have not been invoked yet.`
    return
  }
  if (drainRaceStatus.invoking) {
    while (true) {
      const elapsed = (Date.now() - drainRaceStatus.start) / 1000
      yield md`Sending message to all 3 client actors for method 2... (${elapsed.toFixed(1)}s)`
      await Promises.delay(1000)
    }
  }
  if (drainRaceStatus.responses) {
    while (true) {
      let output = `<div><b>Messages sent to faucet actor from 3 clients</b></div>
      <div>To: ${fundedFaucetAddress} (Faucet)</div>
      <div>Method: 2</div>
      <div>Message CIDs: ${drainRaceStatus.responses.map(cid => cid['/']).join(', ')}</div>
      `
      if (drainRaceStatus.waitResponses) {
        output += `<div>Messages executed:</div>`
        output += `<ul>`
        for (let i in drainRaceStatus.waitResponses) {
          const waitResponse = drainRaceStatus.waitResponses[i]
          output += '<li>'
          output += `<div>From: ${keys[i].address} (${transferFundsStatus.lookups[keys[i].address]})</div>`
          output += `<div>Message executed in block at height: ${waitResponse.Height}</div>`
          output += `<div>Gas used: ${waitResponse.Receipt.GasUsed}</div>`
          output += `<div>Exit Code: ${waitResponse.Receipt.ExitCode}</div>`
          output += `<div>Return: ${waitResponse.Receipt.Return} (Base64 encoded CBOR)</div>`
          if (drainRaceStatus.decodedResults[i]) {
            output += `<div><b>Decoded Result:</b> <b style="font-size: 200%">${JSON.stringify(drainRaceStatus.decodedResults[i])}</b></div>`
          }
          output += '</li>'
        }
        output += `</ul>`
        /*
        output += `<div>Message executed in block at height: ${invokeMethod2Status.waitResponse.Height}</div>`
        output += `<div>Gas used: ${invokeMethod2Status.waitResponse.Receipt.GasUsed}</div>`
        output += `<div>Exit Code: ${invokeMethod2Status.waitResponse.Receipt.ExitCode}</div>`
        output += `<div>Return: ${invokeMethod2Status.waitResponse.Receipt.Return} (Base64 encoded CBOR)</div>`
        output += `<div><b>Decoded Result:</b> <b style="font-size: 200%">${JSON.stringify(invokeMethod2Status.decodedResult)}</b></div>`
        */
        yield html`${output}`
        break
      }
      const elapsed = (Date.now() - drainRaceStatus.waitStart) / 1000
      output += `<div>Waiting for messages to be executed in a block... (${elapsed.toFixed(1)}s)</div>`
      yield html`${output}`
      await Promises.delay(1000)
    }
  }
}


async function _63(drainRaceStatus,md,getBalances,fundedFaucetAddress,clientAddresses,Inputs,withdrawButton,transferFundsStatus,FilecoinNumber)
{
  if (!drainRaceStatus || !drainRaceStatus.decodedResults) {
    return md``
  }
  const balances = await getBalances([fundedFaucetAddress].concat(clientAddresses))
  return Inputs.table(
    balances.map(({ address, balance }) => ({
      id: address === fundedFaucetAddress ? `${withdrawButton.faucetAddress} (Faucet)` :
        transferFundsStatus.lookups[address],
      address,
      balance
    })),
    {
      format: {
        balance: num => new FilecoinNumber(num, 'attofil').toFil()
      }
    }
  )
}


function _64(drainRaceStatus,md)
{
  if (!drainRaceStatus || !drainRaceStatus.decodedResults) {
    return md``
  }
  return md`If things worked, only one of the clients (randomly) will have got the funds!

Try funding the faucet again and try again.
`
}


async function* _drainRaceStatus(createActorStatus,drainRaceButton,getBalances,FilecoinNumber,keys,cbor,bigToBytes,filecoin_client,client)
{
  const faucetAddress = createActorStatus.waitResponse.ReturnDec.IDAddress
  if (drainRaceButton) {
    const start = Date.now()
    console.log('Drain race started')
    yield {
      invoking: true,
      start
    }
    const balances = await getBalances([faucetAddress])
    const faucetBalance = new FilecoinNumber(balances[0].balance, 'attofil')
    console.log('Faucet balance:', faucetBalance.toFil())
    yield {
      invoking: true,
      initialFaucetBalance: faucetBalance.toFil(),
      start
    }
    const responsePromises = []
    for (const key of keys) {
      const message = {
        To: faucetAddress,
        From: key.address,
        Nonce: 0,
        Value: new FilecoinNumber(0, 'attofil'),
        GasLimit: 1000000000,
        GasFeeCap: new FilecoinNumber(0, 'attofil'),
        GasPremium: new FilecoinNumber(0, 'attofil'),
        Method: 2,
        Params: cbor.encode([bigToBytes(faucetBalance)]).toString('base64')
      }
      const privateKey = key.privateKey
      console.log('message', message)
      responsePromises.push(filecoin_client.tx.sendMessage(
        message,
        privateKey,
        true, // updateMsgNonce
        false // waitMsg
      ))
    }
    const responses = await Promise.all(responsePromises)
    const waitStart = Date.now()
    yield {
      waiting: true,
      start,
      waitStart,
      initialFaucetBalance: faucetBalance.toFil(),
      responses
    }
    const promises = []
    for (const response of responses) {
      promises.push(client.stateWaitMsg(response, 0))
    }
    const waitResponses = await Promise.all(promises)
    const decodedResults = []
    for (const waitResponse of waitResponses) {
      let decodedResult = null
      if (waitResponse.Receipt && waitResponse.Receipt.Return) {
        decodedResult = cbor.decodeAll(waitResponse.Receipt.Return, 'base64')
      }
      decodedResults.push(decodedResult)
    }
    yield { invoked: true, responses, waitResponses, decodedResults }
  }
}


function _66(md){return(
md`## Serialize/Deserialize Filecoin Bigints`
)}

function _67(FilecoinNumber){return(
new FilecoinNumber('5', 'attofil')
)}

function _68(cbor,FilecoinNumber){return(
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

function _70(bigToBytes){return(
bigToBytes(-1234)
)}

function _71(bigToBytes){return(
bigToBytes(1234)
)}

function _72(bigToBytes,FilecoinNumber){return(
bigToBytes(new FilecoinNumber(1234, 'attofil'))
)}

function _73(){return(
({ x: 1 }).toString()
)}

function _74(bigToBytes){return(
bigToBytes("1234")
)}

function _75(bigToBytes){return(
bigToBytes("12345678901234567890")
)}

function _76(bigToBytes){return(
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

function _78(bytesToBig,bigToBytes){return(
bytesToBig(bigToBytes(12345678901234567890n)).toString()
)}

function _79(bytesToBig,bigToBytes){return(
bytesToBig(bigToBytes(-1234)).toString()
)}

function _80(md){return(
md`# Final notes`
)}

function _81(md){return(
md`Thank you for trying out this demo.

If the backend is not working, please get in touch with me. Feel free to fork this notebook to customize your own actors and build scenarios using the on-demand localnet that supports this early version of actors / smart contracts.

I can also deploy custom instances of the localnet and the API for compiling actors ... feel free to contact me at @jimpick on the Filecoin Slack.`
)}

function _82(md){return(
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

function _98(md){return(
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
#[derive(Debug, Deserialize_tuple)]
pub struct WithdrawalParams {
    #[serde(with = "bigint_ser")]
    pub amount: TokenAmount,
}

/// Method num 2.
pub fn withdraw(params: u32) -> Option<RawBytes> {
    let params = sdk::message::params_raw(params).unwrap().1;
    let params = RawBytes::new(params);
    let params: WithdrawalParams = params.deserialize().unwrap();
    let caller = sdk::message::caller();
    let address = Address::new_id(caller);
    let send_params = RawBytes::default();

    let _receipt = fvm_sdk::send::send(
      &address,
      METHOD_SEND,
      send_params,
      params.amount.clone()
    ).unwrap();
    
    let ret = to_vec(format!("Withdraw {:?} => t0{}",
      params, caller).as_str());

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
`.trim()
)}

function _templateStart(initialCode)
{
  const code = initialCode
    .replace('pub fn invoke(_: u32)', 'pub fn invoke(params: u32)')
    .replace('say_hello()', 'withdraw(params)')
    .replace(/\/\/\/ Method num 2.*/s, '')
    .split('\n')

  code.splice(
    10, 0,
    'use fvm_shared::bigint::bigint_ser;',
    'use fvm_shared::econ::TokenAmount;',
    'use fvm_shared::METHOD_SEND;',
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
  return (
    initialCargoToml
      .replace(/fvm_sdk = .*/, `fvm_sdk = ${gitVersion('0.6.1')}`)
      .replace(/fvm_shared = .*/, `fvm_shared = ${gitVersion('0.6.1')}`)
      .replace(/fvm_ipld_blockstore = .*/, `fvm_ipld_blockstore = ${gitVersion('0.1.0')}`)
      .replace(/fvm_ipld_encoding = .*/, `fvm_ipld_encoding = ${gitVersion('0.2.0')}`)
    )
}


function _106(md){return(
md`## Lotus Utilities`
)}

function _baseUrl(){return(
"https://fvm-9.default.knative.hex.camp"
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

function _116(md){return(
md`## Backups`
)}

function _118(backups){return(
backups()
)}

function _119(backupNowButton){return(
backupNowButton()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("randomMnemonic")).define("randomMnemonic", ["filecoin_signer"], _randomMnemonic);
  main.variable(observer("keys")).define("keys", ["filecoin_signer","randomMnemonic"], _keys);
  main.variable(observer("clientAddresses")).define("clientAddresses", ["keys"], _clientAddresses);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer()).define(["transferFundsStatus","md","Promises"], _11);
  main.variable(observer("transferFundsStatus")).define("transferFundsStatus", ["walletDefaultAddress","keys","client"], _transferFundsStatus);
  main.variable(observer()).define(["md"], _13);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer("initialBalances")).define("initialBalances", ["transferFundsStatus","md","getBalances","clientAddresses"], _initialBalances);
  main.variable(observer()).define(["initialBalances","Inputs","transferFundsStatus","FilecoinNumber"], _16);
  main.variable(observer("getBalances")).define("getBalances", ["client"], _getBalances);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer("viewof editor")).define("viewof editor", ["skypack","method2Code"], _editor);
  main.variable(observer("editor")).define("editor", ["Generators", "viewof editor"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _20);
  main.variable(observer()).define(["templateStart","editor","html","button"], _21);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer()).define(["md"], _23);
  main.variable(observer("viewof compileToWasmButton")).define("viewof compileToWasmButton", ["templateStart","editor","Inputs"], _compileToWasmButton);
  main.variable(observer("compileToWasmButton")).define("compileToWasmButton", ["Generators", "viewof compileToWasmButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["compileStatus","md","Promises","html","stripAnsi"], _25);
  main.variable(observer()).define(["compileStatus","md"], _26);
  main.variable(observer()).define(["compileStatus","html","button","md"], _27);
  main.variable(observer("compileStatus")).define("compileStatus", ["compileToWasmButton","baseUrl","patchedCargoToml","cbor"], _compileStatus);
  main.variable(observer()).define(["md"], _29);
  main.variable(observer()).define(["md","currentHeight"], _30);
  main.variable(observer()).define(["md"], _31);
  main.variable(observer()).define(["md"], _32);
  main.variable(observer()).define(["md"], _33);
  main.variable(observer("viewof installActorButton")).define("viewof installActorButton", ["Inputs","compileStatus"], _installActorButton);
  main.variable(observer("installActorButton")).define("installActorButton", ["Generators", "viewof installActorButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["installActorStatus","md","Promises","html"], _35);
  main.variable(observer("installActorStatus")).define("installActorStatus", ["installActorButton","walletDefaultAddress","compileStatus","client"], _installActorStatus);
  main.variable(observer()).define(["md"], _37);
  main.variable(observer()).define(["md"], _38);
  main.variable(observer()).define(["md"], _39);
  main.variable(observer("viewof createActorButton")).define("viewof createActorButton", ["Inputs","installActorStatus"], _createActorButton);
  main.variable(observer("createActorButton")).define("createActorButton", ["Generators", "viewof createActorButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["createActorStatus","md","Promises","createActorButton","html"], _41);
  main.variable(observer("createActorStatus")).define("createActorStatus", ["createActorButton","CID","cbor","walletDefaultAddress","client"], _createActorStatus);
  main.variable(observer()).define(["md"], _43);
  main.variable(observer("viewof sendFundsToFaucetButton")).define("viewof sendFundsToFaucetButton", ["Inputs","createActorStatus"], _sendFundsToFaucetButton);
  main.variable(observer("sendFundsToFaucetButton")).define("sendFundsToFaucetButton", ["Generators", "viewof sendFundsToFaucetButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["sendFundsToFaucetStatus","md","Promises","html"], _45);
  main.variable(observer()).define(["fundedFaucetAddress","md","FilecoinNumber","getBalances"], _46);
  main.variable(observer("sendFundsToFaucetStatus")).define("sendFundsToFaucetStatus", ["sendFundsToFaucetButton","walletDefaultAddress","client","cbor"], _sendFundsToFaucetStatus);
  main.variable(observer("fundedFaucetAddress")).define("fundedFaucetAddress", ["sendFundsToFaucetStatus","createActorStatus"], _fundedFaucetAddress);
  main.variable(observer()).define(["md"], _49);
  main.variable(observer()).define(["md"], _50);
  main.variable(observer()).define(["md"], _51);
  main.variable(observer("viewof withdrawForm")).define("viewof withdrawForm", ["Inputs","clientAddresses","transferFundsStatus"], _withdrawForm);
  main.variable(observer("withdrawForm")).define("withdrawForm", ["Generators", "viewof withdrawForm"], (G, _) => G.input(_));
  main.variable(observer("viewof withdrawButton")).define("viewof withdrawButton", ["Inputs","createActorStatus","withdrawForm"], _withdrawButton);
  main.variable(observer("withdrawButton")).define("withdrawButton", ["Generators", "viewof withdrawButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["invokeMethod2Status","md","Promises","withdrawButton","html"], _54);
  main.variable(observer()).define(["md"], _55);
  main.variable(observer()).define(["updateButton","invokeMethod2Status","md","getBalances","fundedFaucetAddress","clientAddresses","Inputs","withdrawButton","transferFundsStatus","FilecoinNumber"], _56);
  main.variable(observer("viewof updateButton")).define("viewof updateButton", ["Inputs"], _updateButton);
  main.variable(observer("updateButton")).define("updateButton", ["Generators", "viewof updateButton"], (G, _) => G.input(_));
  main.variable(observer("invokeMethod2Status")).define("invokeMethod2Status", ["withdrawButton","FilecoinNumber","cbor","bigToBytes","keys","filecoin_client","client"], _invokeMethod2Status);
  main.variable(observer()).define(["md"], _59);
  main.variable(observer()).define(["md"], _60);
  main.variable(observer("viewof drainRaceButton")).define("viewof drainRaceButton", ["Inputs"], _drainRaceButton);
  main.variable(observer("drainRaceButton")).define("drainRaceButton", ["Generators", "viewof drainRaceButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["drainRaceStatus","md","Promises","fundedFaucetAddress","keys","transferFundsStatus","html"], _62);
  main.variable(observer()).define(["drainRaceStatus","md","getBalances","fundedFaucetAddress","clientAddresses","Inputs","withdrawButton","transferFundsStatus","FilecoinNumber"], _63);
  main.variable(observer()).define(["drainRaceStatus","md"], _64);
  main.variable(observer("drainRaceStatus")).define("drainRaceStatus", ["createActorStatus","drainRaceButton","getBalances","FilecoinNumber","keys","cbor","bigToBytes","filecoin_client","client"], _drainRaceStatus);
  main.variable(observer()).define(["md"], _66);
  main.variable(observer()).define(["FilecoinNumber"], _67);
  main.variable(observer()).define(["cbor","FilecoinNumber"], _68);
  main.variable(observer("bigToBytes")).define("bigToBytes", ["BN"], _bigToBytes);
  main.variable(observer()).define(["bigToBytes"], _70);
  main.variable(observer()).define(["bigToBytes"], _71);
  main.variable(observer()).define(["bigToBytes","FilecoinNumber"], _72);
  main.variable(observer()).define(_73);
  main.variable(observer()).define(["bigToBytes"], _74);
  main.variable(observer()).define(["bigToBytes"], _75);
  main.variable(observer()).define(["bigToBytes"], _76);
  main.variable(observer("bytesToBig")).define("bytesToBig", ["BN"], _bytesToBig);
  main.variable(observer()).define(["bytesToBig","bigToBytes"], _78);
  main.variable(observer()).define(["bytesToBig","bigToBytes"], _79);
  main.variable(observer()).define(["md"], _80);
  main.variable(observer()).define(["md"], _81);
  main.variable(observer()).define(["md"], _82);
  main.variable(observer("skypack")).define("skypack", _skypack);
  main.variable(observer("LotusRPC")).define("LotusRPC", _LotusRPC);
  main.variable(observer("BrowserProvider")).define("BrowserProvider", _BrowserProvider);
  main.variable(observer("schema")).define("schema", _schema);
  main.variable(observer("stripAnsi")).define("stripAnsi", _stripAnsi);
  main.variable(observer("cbor")).define("cbor", _cbor);
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
  main.variable(observer()).define(["md"], _98);
  main.variable(observer("initialCodeUrl")).define("initialCodeUrl", _initialCodeUrl);
  main.variable(observer("initialCode")).define("initialCode", ["initialCodeUrl"], _initialCode);
  main.variable(observer("method2Code")).define("method2Code", _method2Code);
  main.variable(observer("templateStart")).define("templateStart", ["initialCode"], _templateStart);
  main.variable(observer("initialCargoTomlUrl")).define("initialCargoTomlUrl", _initialCargoTomlUrl);
  main.variable(observer("initialCargoToml")).define("initialCargoToml", ["initialCargoTomlUrl"], _initialCargoToml);
  main.variable(observer("patchedCargoToml")).define("patchedCargoToml", ["initialCargoToml"], _patchedCargoToml);
  main.variable(observer()).define(["md"], _106);
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
  main.variable(observer()).define(["md"], _116);
  const child2 = runtime.module(define2);
  main.import("backups", child2);
  main.import("backupNowButton", child2);
  main.variable(observer()).define(["backups"], _118);
  main.variable(observer()).define(["backupNowButton"], _119);
  return main;
}
