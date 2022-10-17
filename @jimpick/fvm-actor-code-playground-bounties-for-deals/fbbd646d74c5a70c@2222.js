import define1 from "./9a34a4df6e8a276b@50.js";
import define2 from "./c4e4a355c53d2a1a@111.js";

function _1(md){return(
md`# FVM Actor Code Playground - "Bounties for Deals"`
)}

function _2(md){return(
md`This demo shows how to implement a minimalist "bounty actor" that can be sent funds be awarded (in the future) to anybody that makes a deal that satisfies certain criteria.

* YouTube: [FVM Foundry Update: Learning & Using FVM Actors with Fil-der Jim Pick](https://www.youtube.com/watch?v=jTtZh1zqUr8)

This notebook does the following:

* Generates 2 client-side addresses + secrets for ["Alice and Bob"](https://en.wikipedia.org/wiki/Alice_and_Bob) using [filecoin-js-signer](https://github.com/blitslabs/filecoin-js-signer). The secrets are stored in your browser, not on the Lotus node.
* Sends starter funds from Lotus to each client address (100 FIL each)
* Compiles, installs and creates the "bounty actor"
  * Has a method to "post a bounty" - a bounty consists of a "Payload CID", "Piece CID", a Miner ID, and a reward
  * Has a method to list bounties
  * Has a method to lookup bounties by Piece CID + Miner ID
  * Has a method to claim a bounty. In order to claim a bounty, the "Deal ID" from a published deal is sent to the actor as a param. If the "Piece CID" and the Miner ID match the deal, the client who posted the deal is sent the reward. The bounty is removed from the list of active bounties.
* Alice generates files consisting of random phrases (plus padding, so they will fit in a 2K sector), and calculates the "Piece CID".
* Alice can choose to post bounties for the phrases, specifying the criteria - a Piece CID matching the phrase, a Provider ID + an amount of funds (sent to the bounty actor) which will be the reward. This is a minimal implementation -- a more complex bounty system might include additional criteria, eg. deal length, proving periods, deal pricing limits, etc.
* Bob retrieves the list of bounties.
* Bob encodes a random word into a file and calculates the Piece CID. Bob then makes a deal for each file, and transfers the data to the provider.
* A trusted "watcher" process watches for published deals. For each new deal, it calls the lookup method with the Piece CID and the Miner ID. If there is a bounty, it invokes the method to claim the bounty, sending the Client ID who made the deal, and the client gets paid the reward!
* Based on https://observablehq.com/@jimpick/fvm-actor-code-playground-simple-faucet`
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
  for (let i = 0; i < 2; i++) {
    const network = 'testnet'

    const key = await filecoin_signer.wallet.keyDerive(randomMnemonic, `m/44'/461'/0'/0/${i}`, network)
    key.name = i == 0 ? 'Alice' : 'Bob'
    keys.push(key)
  }
  return keys
}


function _clientAddresses(keys){return(
keys.map(key => key.address)
)}

function _9(md){return(
md`## Wait for Lotus to be ready, then transfer 100 FIL to each address`
)}

function _10(md){return(
md`Be patient as it takes a little while for the funds to be sent via the Lotus JSON-RPC API when the notebook is first loaded.`
)}

function _11(ready,md){return(
ready ? md`Lotus ready.` : md `Lotus not ready yet, please wait (this may take up to 60 seconds).`
)}

async function* _12(transferFundsStatus,md,Promises)
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
        Value: "100000000000000000000",
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


function _aliceId(transferFundsStatus,keys){return(
transferFundsStatus?.transferred && transferFundsStatus.lookups[keys.find(({ name }) => name === 'Alice').address]
)}

function _bobId(transferFundsStatus,keys){return(
transferFundsStatus?.transferred && transferFundsStatus.lookups[keys.find(({ name }) => name === 'Bob').address]
)}

function _16(md){return(
md`## Initial Balances`
)}

function _17(md){return(
md`Here are the addresses and IDs of the 2 clients we created, as well at their initial balances (should be 1 FIL each).`
)}

function _initialBalances(transferFundsStatus,md,getBalances,clientAddresses){return(
!transferFundsStatus ? md`Waiting...` : transferFundsStatus.transferred && getBalances(clientAddresses)
)}

function _19(Inputs,initialBalances,keys,transferFundsStatus,FilecoinNumber){return(
Inputs.table(
  initialBalances ? initialBalances.map(({ address, balance }) => ({
    name: keys.find(({ address: keyAddress }) => address === keyAddress).name, 
    id: transferFundsStatus.lookups[address],
    address,
    balance
  })) : [],
  {
    format: {
      balance: num => new FilecoinNumber(num, 'attofil').toFil()
    }
  }
)
)}

function _aliceAddress(transferFundsStatus,aliceId){return(
transferFundsStatus?.transferred && Object.entries(transferFundsStatus.lookups).find(([ address, id ]) => id === aliceId)[0]
)}

function _bobAddress(transferFundsStatus,bobId){return(
transferFundsStatus?.transferred && Object.entries(transferFundsStatus.lookups).find(([ address, id ]) => id === bobId)[0]
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

function _23(md){return(
md`## Import Bob's Private Key into the Lotus wallet`
)}

function _24(md){return(
md`Bob is going to use the Lotus client to make deals and store files, so we need to import the private key there.`
)}

async function _bobKeyInfoImportResult(ready,keys,buffer,client)
{
  if (!ready) return
  const privateKeyHex = keys.find(({ name }) => name === 'Bob').privateKey
  const privateKeyBytes = buffer.Buffer.from(privateKeyHex, 'hex')
  const privateKeyBase64 = privateKeyBytes.toString('base64')
  const keyInfoJson = { Type: "secp256k1", PrivateKey: privateKeyBase64 }
  // const keyInfoEncoded = buffer.Buffer.from(JSON.stringify(keyInfoJson)).toString('hex')
  const result = await client.walletImport(keyInfoJson)
  return result
}


function _26(md){return(
md`## Transfer 1 FIL to Bob's Market Balance`
)}

function _27(md){return(
md`This enables making deals faster if there is already a "market" balance.`
)}

async function* _28(bobAddress,client,$0)
{
  if (!bobAddress) return
  const start = Date.now()
  yield {
    transferring: true,
    start
  }
  const response = await client.marketAddBalance(bobAddress, bobAddress, "1000000000000000000")
  const waitStart = Date.now()
  yield { waiting: true, start, waitStart, response }
  const waitResponse = await client.stateWaitMsg(response, 0)
  yield { transferred: true, response, waitResponse }
  $0.value = new Date()
}


function _29(md){return(
md`## Step 1: Edit Actor Code - src/lib.rc

Feel free to modify this actor code (written in Rust). Don't worry, you can't break anything. This is from [src/lib.rc](https://github.com/raulk/fil-hello-world-actor/blob/master/src/lib.rs) in @raulk's [fil-hello-world-actor](https://github.com/raulk/fil-hello-world-actor) example. We use some JavaScript in this notebook to patch this subset of the code into the original code with some modifications.

GitHub Code Links + useful API Docs:

 * https://github.com/raulk/fil-hello-world-actor
 * https://github.com/raulk/fil-hello-world-actor/blob/master/src/blockstore.rs
 * https://github.com/raulk/fil-hello-world-actor/blob/master/Cargo.toml
 * https://docs.rs/fvm_sdk/0.6.1/fvm_sdk/
 * https://docs.rs/fvm_shared/0.6.1/fvm_shared/
 * https://docs.rs/fvm_ipld_encoding/0.2.0/fvm_ipld_encoding/
 * https://docs.rs/fvm_ipld_hamt/0.5.1/fvm_ipld_hamt/
 * https://docs.rs/cid/0.8.4/cid/
 * https://github.com/Schwartz10/sample-erc20-fvm-actor/blob/primary/src/lib.rs
 * https://github.com/jimpick/fvm-ipld-hamt-playground/blob/bounties/src/main.rs
 * https://github.com/jimpick/fil-hello-world-actor/blob/jim-bounties/src/lib.rs
`
)}

async function _editor(skypack,stateObjectCode,methodsCode)
{
  const {EditorState, EditorView, basicSetup} = await skypack('@codemirror/next/basic-setup')
  const {rust} = await skypack('@codemirror/next/lang-rust')
  
  const updateViewOf = EditorView.updateListener.of((update) => {
    const {dom} = update.view
    dom.value = update
    dom.dispatchEvent(new CustomEvent('input'))
  })

  const initialCode = stateObjectCode + `\n\n// -- cut --\n\n` + methodsCode 
  
  const view = new EditorView({
    state: EditorState.create({
      doc: initialCode,
      extensions: [basicSetup, rust(), updateViewOf]
    })
  })
  
  return view.dom
}


function _31(md){return(
md`If you have changed the code and would like to save it for future use, you can use this button to save it to a file.`
)}

function _combinedCode(editor,templateStart){return(
() => {
  const codeChunks = editor.state.doc.toString().split('// -- cut --').map(chunk => chunk.trim())
  return templateStart.replace('%%stateObjectCode%%', codeChunks[0]) + '\n' + codeChunks[1]
}
)}

function _34(html,button,combinedCode){return(
html`Optional: ${button(combinedCode(), `lib.rs`)}`
)}

function _35(md){return(
md`**Pro-tip:** *You can also "fork" this notebook and use the saved file as an attachment.*`
)}

function _36(md){return(
md`## Step 2: Compile

We have implemented a [simple web service](https://github.com/jimpick/lotus-fvm-localnet-web/blob/main/server.mjs) that accepts a HTTP POST with the code above, and returns a compiled WASM binary (wrapped in a CBOR array, encoded in base64, ready to pass as a 'params' string). The code above is substituted for \`src/lib.rs\` into the [raulk/fil-hello-world-actor](https://github.com/raulk/fil-hello-world-actor) example and built using \`cargo build\`. It should compile in less than 70 seconds.`
)}

function _compileToWasmButton(Inputs,combinedCode){return(
Inputs.button('Compile to WASM', {value: null, reduce: () => combinedCode()})
)}

async function* _38(compileStatus,md,Promises,html,stripAnsi)
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


function _39(compileStatus,md){return(
compileStatus && compileStatus.wasmBinary ? md`Optional: You can download the compiled WASM bundle here. (Not needed if you are just using it from this notebook)` : md``
)}

function _40(compileStatus,html,button,md){return(
compileStatus && compileStatus.wasmBinary ? html`Optional: ${button(compileStatus.wasmBinary, 'fil_bounties_actor.wasm')}` : md``
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


function _42(md){return(
md`## Step 3: Connect to Hosted "localnet"

This notebook connects to a [hosted instance](https://github.com/jimpick/lotus-fvm-localnet-web) of a Lotus "localnet" (started on demand) into which you can install the actor code, create an actor instance, and invoke methods against.

If the localnet is started and online, the following chain height should be increasing every 4-10 seconds (depending on system load):`
)}

function _43(md,currentHeight){return(
md`**Height: ${currentHeight}**`
)}

function _44(md){return(
md`If the connection is working, then proceed to the next step.`
)}

function _45(md){return(
md`## Step 4: Install the Actor Code`
)}

function _46(md){return(
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

async function* _48(installActorStatus,md,Promises,html)
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


function _50(md){return(
md`## Step 5: Create an Actor Instance for the Bounty Actor`
)}

function _51(md){return(
md`If you have completed the previous step, you will have a "Code CID" for the WASM bundle you just installed. Now we can create an actor instance. It is possible to create lots and lots of actors using the same code, each will get assigned a unique "ID Address" (eg. t01001) to which messages and funds can be sent, as well as an equivalent "Robust Address" alias (eg. "t2...") which maps on the same address (but doesn't change in the event of a chain re-organization).`
)}

function _52(md){return(
md`At the command line, this is the same as: \`lotus chain create-actor <code-cid> <params>\``
)}

function _53(md){return(
md`We pass in a 'trusted address' (the Lotus default wallet address) as a parameter. This is used for security ... only a service calling methods from the trusted address can call the \`award_bounty()\` method to award bounties to clients that have stored data.`
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

async function* _55(createActorStatus,md,Promises,createActorButton,html)
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


async function* _createActorStatus(createActorButton,CID,filecoinAddress,walletDefaultId,cbor,walletDefaultAddress,client)
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
    const trustedAddressBytes = filecoinAddress.newFromString(walletDefaultId).str
    const params = cbor.encode([new cbor.Tagged(42, codeCidBytes), trustedAddressBytes])
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


function _bountyActorId(createActorStatus){return(
createActorStatus?.waitResponse?.ReturnDec?.IDAddress
)}

function _bountyActorAddress(createActorStatus){return(
createActorStatus?.waitResponse?.ReturnDec?.RobustAddress
)}

function _59(md){return(
md`## Step 6: Generate Random Phrases and Piece CIDs (aka. CommP)`
)}

function _60(md){return(
md`Here we generate a list of random phrases - this is the raw file data that will be used to create storage deals. We're just using short strings here because we are limited to under 2K in a sector with the localnet.`
)}

function _phrases(protocolWords)
{
  const phrases = []
  for (let i = 0; i < 10; i++) {
    phrases.push(randomPhrase())
  }
  return phrases
  
  function getRandom (max) {
    return Math.floor(Math.random() * Math.floor(max))
  }
  
  function randomPhrase () {
    const adjective = protocolWords.adjectives[getRandom(protocolWords.adjectives.length)]
    const noun = protocolWords.nouns[getRandom(protocolWords.nouns.length)]
    return `${adjective} ${noun}`
  }
}


function _phraseUploads(phrases,baseUrl,client)
{
  const uploadPromises = []
  for (const phrase of phrases) {
    uploadPromises.push((async () => {
      try {
        const response = await fetch(`${baseUrl}/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'binary/octet-stream'
          },
          body: phrase +
            '\n' + ' '.repeat(120) + '\n' // padding
        })
        const uploadResults = await response.json()
        const inputFile = uploadResults.filename
        const carFile = uploadResults.filename + '.car'
        await client.clientGenCar(
          {Path: inputFile, IsCar: false},
          carFile
        )
        const calcCommP = await client.clientCalcCommP(carFile)
        return {
          filename: inputFile,
          calcCommP
        }
      } catch (e) {
        return { error: e }
      }
    })())
  }
  return Promise.all(uploadPromises)
}


function _63(Inputs,phrases,phraseUploads){return(
Inputs.table(
  phrases.map((phrase, i) => ({ phrase, pieceCid: phraseUploads[i].calcCommP.Root['/'] })),
  { width: { phrase: 200 } }
)
)}

function _pieceCidToPhraseMap(phrases,phraseUploads)
{
  const pieceCidToPhraseMap = new Map()
  phrases.forEach((phrase, i) => {
    pieceCidToPhraseMap.set(phraseUploads[i].calcCommP.Root['/'], phrase)
  })
  return pieceCidToPhraseMap
}


function _pieceCidToFilenameMap(phrases,phraseUploads)
{
  const pieceCidToFilenameMap = new Map()
  phrases.forEach((phrase, i) => {
    pieceCidToFilenameMap.set(phraseUploads[i].calcCommP.Root['/'], phraseUploads[i].filename)
  })
  return pieceCidToFilenameMap
}


function _66(md){return(
md`## Step 7: Alice Posts Some Bounties`
)}

function _67(md){return(
md`Now that we've got an actor running with an ID Address, alice can call the method to post a bounty. Pretend that you are Alice, and select a piece of data (a "phrase" that has a matching Piece CID), a provider ID (aka miner) that you want the data to be stored on, and an amount you will send to the bounty actor to act as a "reward" for whoever makes a deal to store the data.`
)}

function _68(md){return(
md`At the command line, this is the same as: \`lotus chain invoke <actor-id-address> <method-number>\``
)}

function _postBountyForm(providerIds,phrases,Inputs,phraseUploads){return(
providerIds && phrases && Inputs.form([
  Inputs.select(
    phrases.map((phrase, i) => ({
      phrase,
      pieceCid: phraseUploads[i].calcCommP.Root['/']
    })),
    {
      label: 'Desired Data',
      format: x => `"${x.phrase}" CID: ${x.pieceCid.slice(0, 4)}...${x.pieceCid.slice(-4)}`
    }
  ),
  Inputs.select(providerIds, { label: "Desired Provider" }),
  Inputs.range([0, 10], {value: 1, step: 1, label: 'Amount for Reward'})
])
)}

function _postBountyButton(Inputs,createActorStatus,postBountyForm,aliceAddress){return(
Inputs.button('Post Bounty', {
  disabled: !createActorStatus ||
    !createActorStatus.waitResponse ||
    !createActorStatus.waitResponse.ReturnDec ||
    !createActorStatus.waitResponse.ReturnDec.IDAddress,
  value: null,
  reduce: () => ({
    pieceCid: postBountyForm[0].pieceCid,
    providerAddress: postBountyForm[1],
    amount: postBountyForm[2],
    clientAddress: aliceAddress
  })
})
)}

async function* _71(postBountyStatus,md,Promises,bountyActorId,html,$0)
{
  if (postBountyStatus === undefined || !postBountyStatus) {
    yield md`Status: Method has not been invoked yet.`
    return
  }
  if (postBountyStatus.invoking) {
    while (true) {
      const elapsed = (Date.now() - postBountyStatus.start) / 1000
      yield md`Sending message to actor for method 2... (${elapsed.toFixed(1)}s)`
      await Promises.delay(1000)
    }
  }
  if (postBountyStatus.response) {
    while (true) {
      let output = `<div><b>Message sent to actor</b></div>
      <div>To: ${bountyActorId} (Bounty Actor)</div>
      <div>Method: 2</div>
      <div>Message CID: ${postBountyStatus.response.CID['/']}</div>
      `
      if (postBountyStatus.waitResponse) {
        output += `<div>Message executed in block at height: ${postBountyStatus.waitResponse.Height}</div>`
        output += `<div>Gas used: ${postBountyStatus.waitResponse.Receipt.GasUsed}</div>`
        output += `<div>Exit Code: ${postBountyStatus.waitResponse.Receipt.ExitCode}</div>`
        output += `<div>Return: ${postBountyStatus.waitResponse.Receipt.Return} (Base64 encoded CBOR)</div>`
        // output += `<div><b>Decoded Result:</b> <b style="font-size: 120%">${JSON.stringify(postBountyStatus.decodedResult)}</b></div>`
        yield html`${output}`
        $0.value = new Date()
        break
      }
      const elapsed = (Date.now() - postBountyStatus.waitStart) / 1000
      output += `<div>Waiting for message to be executed in a block... (${elapsed.toFixed(1)}s)</div>`
      yield html`${output}`
      await Promises.delay(1000)
    }
  }
}


function _72(md){return(
md`**Balances:**`
)}

function _73(md){return(
md`After Alice posts a bounty, the Bounty Actor's balance should increase, and Alice's bounty should decrease by the amount of the bounty + gas fees.`
)}

function _74(balancesTable){return(
balancesTable()
)}

function _75(Inputs,$0){return(
Inputs.button("Update", { value: null, reduce: () => { $0.value = new Date() } })
)}

function _balancesTable(invalidatedAt,postBountyStatus,md,getBalances,bountyActorAddress,clientAddresses,Inputs,keys,bountyActorId,transferFundsStatus,FilecoinNumber){return(
async () => {
  invalidatedAt;
  if (!postBountyStatus || !postBountyStatus.invoked) {
    return md``
  }
  const balances = await getBalances([bountyActorAddress].concat(clientAddresses))
    
  return Inputs.table(
    balances.map(({ address, balance }) => ({
      name: address === bountyActorAddress ? 'Bounty Actor' : keys.find(({ address: keyAddress }) => address === keyAddress).name,
      id: address === bountyActorAddress ? bountyActorId :
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
)}

async function* _postBountyStatus(postBountyButton,multiformats,filecoinAddress,bountyActorAddress,FilecoinNumber,cbor,keys,filecoin_client,client)
{
  if (postBountyButton) {
    const start = Date.now()
    console.log('Post Bounty', postBountyButton)
    yield {
      invoking: true,
      start
    }
    const pieceCid = multiformats.CID.parse(postBountyButton.pieceCid)
    const pieceCidBytes = new Uint8Array(pieceCid.bytes.length + 1)
    pieceCidBytes.set(pieceCid.bytes, 1)
    
    const providerAddressBytes = filecoinAddress.newFromString(postBountyButton.providerAddress).str
    const message = {
      To: bountyActorAddress,
      From: postBountyButton.clientAddress,
      Nonce: 0,
      Value: (new FilecoinNumber(postBountyButton.amount, 'fil')).toAttoFil(),
      GasLimit: 1000000000,
      GasFeeCap: new FilecoinNumber(0, 'attofil'),
      GasPremium: new FilecoinNumber(0, 'attofil'),
      Method: 2,
      Params: cbor.encode([
        new cbor.Tagged(42, pieceCidBytes),
        providerAddressBytes 
      ]).toString('base64')
    }
    const privateKey = keys.find(({ address }) => address === postBountyButton.clientAddress).privateKey
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


function _78(md){return(
md`## Step 8: List the available bounties`
)}

function _79(md){return(
md`Here are all the unclaimed bounties that Alice has posted. Anybody can claim these by making a deal to store data with the same Piece CID at the Storage Provider address specified.`
)}

function _80(availableBountiesTable){return(
availableBountiesTable()
)}

function _availableBountiesTable(Inputs,bounties){return(
() => Inputs.table(
  bounties,
  {
    columns: [ 'phrase', 'piece_cid', 'address', 'amount' ],
    format: {
      piece_cid: cid => `${cid.slice(0,4)}..${cid.slice(-4)}`
    },
    width: { phrase: 200 },
    sort: 'amount',
    reverse: true
  }
)
)}

function _bountiesCall(invalidatedAt,bountyActorId,walletDefaultAddress,client)
{
  invalidatedAt;
  const messageBody = {
      To: bountyActorId,
      From: walletDefaultAddress,
      Value: "0",
      Method: 3,
      Params: null
  }
  return client.StateCall(messageBody, [])
}


function _bounties(bountiesCall,cbor,multiformats,filecoinAddress,filecoinNumber,bytesToBig,pieceCidToPhraseMap)
{
  if (!bountiesCall?.MsgRct?.Return) return
  const result = cbor.decode(bountiesCall.MsgRct.Return, 'base64')
  const mappedResult = result.map(({ piece_cid, address, amount }) => {
    const cid = multiformats.CID.decode(piece_cid.value.slice(1)).toString()
    const decodedAddress = filecoinAddress.newAddress(address[0], address.slice(1), 't').toString()
    const decodedAmount = new filecoinNumber.FilecoinNumber(bytesToBig(amount).toString(), 'attofil')
    const phrase = pieceCidToPhraseMap.get(cid)
    return { piece_cid: cid, phrase, address: decodedAddress, amount: decodedAmount }
  })
  return mappedResult
}


function _84(md){return(
md`## Step 9: Bob stores a file with a provider (and wins bounties)`
)}

function _85(md){return(
md`Bob can take the list of bounties, and make deals to store files on Storage Providers so he can claim the bounties.

When the deals are accepted by the Storage Providers and published to the chain, the off-chain service will see the deals, and award the bounty amount to whichever client made the deal.`
)}

function _selectedBounty(Inputs,bounties){return(
Inputs.select(
  bounties.sort((a, b) => b.amount - a.amount),
  {
    label: 'Select a bounty',
    format: x => `"${x.phrase}" => ${x.address} (${x.amount} FIL)`
  }
)
)}

function _makeDealButton(Inputs,selectedBounty){return(
Inputs.button('Make a deal', {
  disabled: !selectedBounty,
  value: null,
  reduce: () => selectedBounty
})
)}

function _88(md){return(
md`Here is the list of deals + deal statuses. **Note:** The Lotus client in the localnet build seems to be a bit slow/buggy, so the deal statuses and deal IDs sometimes don't get updated right away even though the deal has been published. The service that watches all deals (below) will see when the deals are published.`
)}

function _89(Inputs,dealList,watchDeals){return(
Inputs.table(
  dealList.map(deal => {
    const newDeal = {...deal}
    const watchedDeal = watchDeals.find(watched => watched.ProposalCid['/'] === deal.proposalCid)
    if (watchedDeal) {
      newDeal.status = watchedDeal.Status
      newDeal.deal_id = watchedDeal.DealID
    }
    return newDeal
  }),
  {
    columns: [ 'timestamp', 'phrase', 'address', 'status', 'deal_id' ],
    format: {
      timestamp: date => date.toISOString().slice(11, 19),
      proposalCid: cid => `${cid.slice(0,4)}..${cid.slice(-4)}`,
      payloadCid: cid => `${cid.slice(0,4)}..${cid.slice(-4)}`,
      piece_cid: cid => `${cid.slice(0,4)}..${cid.slice(-4)}`
    },
    width: {
      status: 250
    },
    sort: 'timestamp'
  }
)
)}

function _90(makeDealButton){return(
makeDealButton
)}

function _dealList(){return(
[]
)}

async function* _makeDealStatus(makeDealButton,pieceCidToFilenameMap,client,bobAddress,$0)
{
  if (makeDealButton) {
    const start = Date.now()
    console.log('Make deal', makeDealButton)
    const filename = pieceCidToFilenameMap.get(makeDealButton.piece_cid)
    yield {
      dealInProgress: true,
      filename,
      start
    }
    const importResponse = await client.clientImport({ Path: filename, IsCar: false })
    yield {
      dealInProgress: true,
      filename,
      importResponse,
      start
    }
    const payloadCid = importResponse.Root['/']
    const dataRef = {
      Data: {
        TransferType: 'graphsync',
        Root: {
          '/': payloadCid
        },
        PieceCid: null,
        PieceSize: 0
      },
      Wallet: bobAddress,
      // Wallet: walletDefaultAddress,
      Miner: makeDealButton.address,
      EpochPrice: "1000",
      MinBlocksDuration: (200 * 24 * 60 * 60) / 15,
      FastRetrieval: true,
      VerifiedDeal: false
    }
    try {
      const dealResponse = await client.clientStartDeal(dataRef)
      yield {
        dealCompleted: true,
        dealResponse
      }
      $0.value.push({
        timestamp: new Date(start),
        proposalCid: dealResponse['/'],
        payloadCid,
        ...makeDealButton
      })
    } catch (e) {
      yield {
        dealCompleted: true,
        error: e
      }
      $0.value.push({
        timestamp: new Date(start),
        payloadCid,
        ...makeDealButton,
        error: e.message
      })
    }
    $0.value = $0.value
  }
}


async function* _watchDeals(dealList,client,Promises)
{
  const statusCodes = new Map()
  while (true) {
    if (dealList.length > 0) {
      const listDeals = await client.clientListDeals()
      for (const deal of listDeals) {
        if (statusCodes.has(deal.State)) {
          deal.Status = statusCodes.get(deal.State)
        } else {
          const status = await client.clientGetDealStatus(deal.State)
          statusCodes.set(deal.State, status)
          deal.Status = status
        }
      }
      yield listDeals
    }
    await Promises.delay(4000)
  }
}


function _94(md){return(
md`## Off-chain service to watch deals and award bounties`
)}

function _95(md){return(
md`Because the bounty actor has no access to the state of the Markets system actor which tracks the on-chain deal status, and it doesn't currently expose useful methods we can call to check deals, we need to implement an external off-chain service that watches for deals, and if it sees a deal that satisfies a bounty, it will call a method on the deal to award the bounty to the client that made the deal.

The award method needs to be restricted so that only the deal monitoring service can call it, otherwise anybody could steal the funds.`
)}

function _96(md){return(
md`The miners in the localnet have been configured to publish the deals quickly. On mainnet, there is typically an hour delay or more before deals are published so providers can reduce their gas usage.`
)}

function _97(md){return(
md`Here is a list of the deals observed by the service:`
)}

function _98(Inputs,observedDealList,pieceCidToPhraseMap){return(
Inputs.table(
  observedDealList.flatMap(([dealId, data]) => {
    const pieceCid = data.Proposal.PieceCID['/']
    const phrase = pieceCidToPhraseMap.get(pieceCid)
    if (!phrase) {
      return []
    }
    return [{
      dealId,
      client: data.Proposal.Client,
      provider: data.Proposal.Provider,
      pieceCid,
      phrase
    }]
  }),
  {
    format: {
      pieceCid: cid => `${cid.slice(0,4)}..${cid.slice(-4)}`
    },
    sort: "dealId"
  }
)
)}

function _99(md){return(
md`If the following checkbox is checked, the service will automatically payout bounties to the client that performed any new matching deals.`
)}

function _awardOptions(Inputs){return(
Inputs.checkbox(['Automatically award bounties'], { value: ['Automatically award bounties'] })
)}

function _101(md){return(
md`Here is a list of the bounties that have been awarded, based on observed deals, or manually awarded (below):`
)}

function _102(awardedBountyListTable){return(
awardedBountyListTable()
)}

function _awardedBountyListTable(Inputs,awardedBountyList,pieceCidToPhraseMap){return(
() => Inputs.table(
  awardedBountyList.map(bounty => ({...bounty, phrase: pieceCidToPhraseMap.get(bounty.pieceCid)})),
  {
    format: {
      pieceCid: cid => `${cid.slice(0,4)}..${cid.slice(-4)}`,
      payoutAddress: address => address.length > 8 ? `${address.slice(0,4)}..${address.slice(-4)}` : address
    },
    sort: 'timestamp'
  }
)
)}

function _awardedBountyList(){return(
[]
)}

function _observedDealList(){return(
[]
)}

function _DealsStream(heightStream,client){return(
async function *DealsStream () {
  for await (const height of heightStream()) {
    const marketActorState = await client.stateReadState('t05', [])
    yield { height, marketActorState }
  }
}
)}

async function* _serviceStatus(DealsStream,client,$0,$1,pieceCidToPhraseMap,lookupBounty,awardBounty,$2,$3)
{
  let lastDealId
  for await (const deal of DealsStream()) {
    if (deal.marketActorState.State.NextID - 1 !== lastDealId) {
      const nextLastDealId = deal.marketActorState.State.NextID - 1
      for (let dealId = lastDealId + 1; dealId <= nextLastDealId; dealId++) {
        const dealData = await client.stateMarketStorageDeal(dealId, [])
        $0.value.push([dealId, dealData])
        $0.value = $0.value
        if (($1.value).includes('Automatically award bounties')) {
          const pieceCid = dealData.Proposal.PieceCID['/']
          const provider = dealData.Proposal.Provider
          const clientAddress = dealData.Proposal.Client
          const phrase = pieceCidToPhraseMap.get(pieceCid)
          if (phrase) {
            const lookupAmount = await lookupBounty(pieceCid, provider)
            console.log(`Lookup "${phrase}"`, pieceCid, provider, `${lookupAmount.toFil()} FIL`)
            if (lookupAmount.toFil() !== "0") {
              console.log('Awarding bounty', pieceCid, provider, clientAddress)
              const start = Date.now()
              const response = await awardBounty(pieceCid, provider, clientAddress)
              console.log('Bounty awarded, msg id:', response)
              $2.value.push({
                timestamp: new Date(start),
                pieceCid: pieceCid,
                provider,
                payoutAddress: clientAddress,
                amount: lookupAmount
              })
              $2.value = $2.value
              async function invalidateAfterWaitMsg () {
                await client.stateWaitMsg(response.CID, 0)
                $3.value = new Date()
              }
              invalidateAfterWaitMsg()
            }
          } else {
            console.log(`Couldn't find phrase for ${pieceCid}, skipping.`)
          }
        }
      }
      lastDealId = nextLastDealId
    }
    yield {
      lastDealId,
      ...deal
    }
  }
}


function _lookupBounty(multiformats,filecoinAddress,bountyActorId,walletDefaultAddress,cbor,client,filecoinNumber,bytesToBig){return(
async function lookupBounty (pieceCidString, address) {
  const pieceCid = multiformats.CID.parse(pieceCidString)
  const pieceCidBytes = new Uint8Array(pieceCid.bytes.length + 1)
  pieceCidBytes.set(pieceCid.bytes, 1)

  const providerAddressBytes = filecoinAddress.newFromString(address).str
  
  const messageBody = {
    To: bountyActorId,
    From: walletDefaultAddress,
    Value: "0",
    Method: 4,
    Params: cbor.encode([
      new cbor.Tagged(42, pieceCidBytes),
      providerAddressBytes 
    ]).toString('base64')
  }
  console.log('Lookup bounty', messageBody)
  const response = await client.StateCall(messageBody, [])

  if (!response?.MsgRct?.Return) return response
  const amountBytes = cbor.decode(response.MsgRct.Return, 'base64').amount
  const decodedAmount = new filecoinNumber.FilecoinNumber(bytesToBig(amountBytes).toString(), 'attofil')
  return decodedAmount
}
)}

function _109(md){return(
md`## Extra Tool: Manually lookup bounty`
)}

function _lookupBountySelection(Inputs,bounties){return(
Inputs.select(
  bounties.sort((a, b) => b.amount - a.amount),
  {
    label: 'Select a bounty',
    format: x => `"${x.phrase}" => ${x.address} (${x.amount} FIL)`
  }
)
)}

function _lookupBountyButton(Inputs,lookupBountySelection){return(
Inputs.button('Lookup Bounty', {
  disabled: !lookupBountySelection,
  value: null,
  reduce: () => lookupBountySelection
})
)}

async function _lookup(lookupBountyButton,md,lookupBounty)
{
  if (!lookupBountyButton) return md``
  // return lookupBountyButton

  const decodedAmount = await lookupBounty(lookupBountyButton.piece_cid, lookupBountyButton.address)
  return md `**Lookup results:** Piece CID "${lookupBountyButton.piece_cid.slice(0, 4)}..${lookupBountyButton.piece_cid.slice(-4)}" on ${lookupBountyButton.address} => ${decodedAmount.toFil()} FIL`
}


function _113(md){return(
md`## Extra Tool: Manually award bounty`
)}

function _114(md){return(
md`The service above should automatically award bounties. If the automatic mode is turned off, or a deal hasn't been published yet, you can use this tool to manually award bounties (paid out to the "Bob" actor).`
)}

function _awardBountySelection(Inputs,bounties){return(
Inputs.select(
  bounties.sort((a, b) => b.amount - a.amount),
  {
    label: 'Select a bounty',
    format: x => `"${x.phrase}" => ${x.address} (${x.amount} FIL)`
  }
)
)}

function _awardBountyButton(Inputs,awardBountySelection){return(
Inputs.button('Manually award bounty', {
  disabled: !awardBountySelection,
  value: null,
  reduce: () => awardBountySelection
})
)}

async function* _117(awardBountyStatus,md,Promises,bountyActorId,html)
{
  if (awardBountyStatus === undefined || !awardBountyStatus) {
    yield md`Status: Method has not been invoked yet.`
    return
  }
  if (awardBountyStatus.invoking) {
    while (true) {
      const elapsed = (Date.now() - awardBountyStatus.start) / 1000
      yield md`Sending message to actor for method... (${elapsed.toFixed(1)}s)`
      await Promises.delay(1000)
    }
  }
  if (awardBountyStatus.response) {
    while (true) {
      let output = `<div><b>Message sent to actor</b></div>
      <div>To: ${bountyActorId} (Bounty Actor)</div>
      <div>Method: 5</div>
      <div>Message CID: ${awardBountyStatus.response.CID['/']}</div>
      `
      if (awardBountyStatus.waitResponse) {
        output += `<div>Message executed in block at height: ${awardBountyStatus.waitResponse.Height}</div>`
        output += `<div>Gas used: ${awardBountyStatus.waitResponse.Receipt.GasUsed}</div>`
        output += `<div>Exit Code: ${awardBountyStatus.waitResponse.Receipt.ExitCode}</div>`
        output += `<div>Return: ${awardBountyStatus.waitResponse.Receipt.Return} (Base64 encoded CBOR)</div>`
        // output += `<div><b>Decoded Result:</b> <b style="font-size: 120%">${JSON.stringify(postBountyStatus.decodedResult)}</b></div>`
        yield html`${output}`
        // mutable invalidatedAt = new Date()
        break
      }
      const elapsed = (Date.now() - awardBountyStatus.waitStart) / 1000
      output += `<div>Waiting for message to be executed in a block... (${elapsed.toFixed(1)}s)</div>`
      yield html`${output}`
      await Promises.delay(1000)
    }
  }
}


function _118(md){return(
md`After awarding the bounty, the bounty will be deleted from the list of bounties, and the balance of the Bounty Actor will decrease, and the balance of the account receiving the payout will increase by the amount of the bounty.`
)}

function _119(md){return(
md`Awarded bounties:`
)}

function _120(awardedBountyListTable){return(
awardedBountyListTable()
)}

function _121(md){return(
md`Available bounties:`
)}

function _122(availableBountiesTable){return(
availableBountiesTable()
)}

function _123(md){return(
md`Balances:`
)}

function _124(balancesTable){return(
balancesTable()
)}

async function* _awardBountyStatus(awardBountyButton,awardBounty,bobId,client,cbor,$0,bobAddress,$1)
{
  if (awardBountyButton) {
    const start = Date.now()
    console.log('Award Bounty', awardBountyButton)
    yield {
      invoking: true,
      start
    }

    const response = await awardBounty(awardBountyButton.piece_cid, awardBountyButton.address, bobId)

    const waitStart = Date.now()
    yield { waiting: true, waitStart, response }
    const waitResponse = await client.stateWaitMsg(response.CID, 0)
    let decodedResult
    if (waitResponse.Receipt && waitResponse.Receipt.Return) {
      decodedResult = cbor.decodeAll(waitResponse.Receipt.Return, 'base64')
    }
    yield { invoked: true, response, waitResponse, decodedResult }
    $0.value.push({
      timestamp: new Date(start),
      pieceCid: awardBountyButton.piece_cid,
      provider: awardBountyButton.address,
      payoutAddress: bobAddress,
      amount: awardBountyButton.amount
    })
    $0.value = $0.value
    $1.value = new Date()
  }
}


function _awardBounty(multiformats,filecoinAddress,bountyActorAddress,walletDefaultAddress,cbor,client){return(
async function awardBounty (pieceCidString, providerAddress, payoutAddress) {
  const pieceCid = multiformats.CID.parse(pieceCidString)
  const pieceCidBytes = new Uint8Array(pieceCid.bytes.length + 1)
  pieceCidBytes.set(pieceCid.bytes, 1)

  const providerAddressBytes = filecoinAddress.newFromString(providerAddress).str
  const payoutAddressBytes = filecoinAddress.newFromString(payoutAddress).str

  const messageBody = {
    To: bountyActorAddress,
    From: walletDefaultAddress,
    Value: "0",
    Method: 5,
    Params: cbor.encode([
      new cbor.Tagged(42, pieceCidBytes),
      providerAddressBytes,
      payoutAddressBytes,
    ]).toString('base64')
  }
  console.log('Award bounty message', messageBody)
  const response = await client.mpoolPushMessage(messageBody, null)
  return response
}
)}

function _127(md){return(
md`## Serialize/Deserialize Filecoin Bigints`
)}

function _128(FilecoinNumber){return(
new FilecoinNumber('5', 'attofil')
)}

function _129(cbor,FilecoinNumber){return(
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

function _131(bigToBytes){return(
bigToBytes(-1234)
)}

function _132(bigToBytes){return(
bigToBytes(1234)
)}

function _133(bigToBytes,FilecoinNumber){return(
bigToBytes(new FilecoinNumber(1234, 'attofil'))
)}

function _134(){return(
({ x: 1 }).toString()
)}

function _135(bigToBytes){return(
bigToBytes("1234")
)}

function _136(bigToBytes){return(
bigToBytes("12345678901234567890")
)}

function _137(bigToBytes){return(
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

function _139(bytesToBig,bigToBytes){return(
bytesToBig(bigToBytes(12345678901234567890n)).toString()
)}

function _140(bytesToBig,bigToBytes){return(
bytesToBig(bigToBytes(-1234)).toString()
)}

function _141(md){return(
md`# Final notes`
)}

function _142(md){return(
md`Thank you for trying out this demo.

If the backend is not working, please get in touch with me. Feel free to fork this notebook to customize your own actors and build scenarios using the on-demand localnet that supports this early version of actors / smart contracts.

I can also deploy custom instances of the localnet and the API for compiling actors ... feel free to contact me at @jimpick on the Filecoin Slack.`
)}

function _143(md){return(
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
import('https://cdn.skypack.dev/pin/borc@v3.0.0-uvbwT4SVvOaMhkLqIBOF/mode=imports,min/optimized/borc.js')
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
import('https://cdn.skypack.dev/pin/@glif/filecoin-number@v2.0.0-beta.0-iQnBkhznGjB3HsyiyYB8/mode=imports,min/optimized/@glif/filecoin-number.js')
)}

function _FilecoinNumber(filecoinNumber){return(
filecoinNumber.FilecoinNumber
)}

function _BN(require){return(
require('https://bundle.run/bn.js@5.2.0')
)}

function _protocolWords(){return(
import('https://cdn.skypack.dev/protocol-words@0.0.7?min')
)}

function _filecoinAddress(){return(
import('https://cdn.skypack.dev/pin/@glif/filecoin-address@v2.0.0-beta.3-EOQV1pNtsg3BOYA74Vst/mode=imports,min/optimized/@glif/filecoin-address.js')
)}

function _multiformats(){return(
import('https://cdn.skypack.dev/pin/multiformats@v9.6.5-93rn6JH3zqEZdoz77NBu/mode=imports,min/optimized/multiformats.js')
)}

function _buffer(require){return(
require('https://bundle.run/buffer@6.0.3')
)}

function _163(md){return(
md`## Boilerplate Code`
)}

function _initialCodeUrl(){return(
`https://raw.githubusercontent.com/raulk/fil-hello-world-actor/1b8aaab57ca82d296c041752b364c6685d57e84d/src/lib.rs`
)}

async function _initialCode(initialCodeUrl){return(
(await fetch(initialCodeUrl)).text()
)}

function _stateObjectCode(){return(
`
#[derive(Serialize, Deserialize, Debug)]
pub struct BountyKey {
    pub piece_cid: Cid,
    pub address: Address,
}

#[derive(Serialize, Deserialize, PartialEq, Debug)]
pub struct BountyValue {
    #[serde(with = "bigint_ser")]
    pub amount: TokenAmount,
}

/// The state object.
#[derive(Serialize_tuple, Deserialize_tuple, Clone, Debug)]
pub struct State {
    pub trusted_address: Address,
    pub bounties_map: Cid,
}
`.trim()
)}

function _methodsCode(){return(
`
/// The constructor populates the initial state.
///
/// Method num 1. This is part of the Filecoin calling convention.
/// InitActor#Exec will call the constructor on method_num = 1.
pub fn constructor(params: u32) -> Option<RawBytes> {
    let params = sdk::message::params_raw(params).unwrap().1;
    let trusted_address = Address::from_bytes(&params).unwrap();

    // This constant should be part of the SDK.
    const INIT_ACTOR_ADDR: ActorID = 1;

    // Should add SDK sugar to perform ACL checks more succinctly.
    // i.e. the equivalent of the validate_* builtin-actors runtime methods.
    // https://github.com/filecoin-project/builtin-actors/blob/master/actors/runtime/src/runtime/fvm.rs#L110-L146
    if sdk::message::caller() != INIT_ACTOR_ADDR {
        abort!(USR_FORBIDDEN, "constructor invoked by non-init actor");
    }

    let mut state = State {
        trusted_address,
        bounties_map: Cid::default(),
    };
    let mut bounties: Hamt<Blockstore, BountyValue, BytesKey> = Hamt::new(Blockstore);
    let bounties_cid = match bounties.flush() {
        Ok(map) => map,
        Err(_e) => abort!(USR_ILLEGAL_STATE, "failed to create bounties hamt"),
    };
    state.bounties_map = bounties_cid;
    state.save();
    None
}

#[derive(Debug, Deserialize_tuple)]
pub struct PostBountyParams {
    pub piece_cid: Cid,
    pub address: Address,
}   

/// Method num 2.
pub fn post_bounty(params: u32) -> Option<RawBytes> {
    let params = sdk::message::params_raw(params).unwrap().1;
    let params = RawBytes::new(params);
    let params: PostBountyParams = params.deserialize().unwrap();

    let mut state = State::load();

    let mut bounties =
        match Hamt::<Blockstore, BountyValue, BytesKey>::load(&state.bounties_map, Blockstore) {
            Ok(map) => map,
            Err(err) => abort!(USR_ILLEGAL_STATE, "failed to load bounties hamt: {:?}", err),
        };

    let key = BountyKey {
        piece_cid: params.piece_cid,
        address: params.address,
    };
    let raw_bytes = RawBytes::serialize(&key).unwrap();
    let bytes = raw_bytes.bytes();
    let key = BytesKey::from(bytes);

    let mut amount = match bounties.get(&key) {
        Ok(Some(bounty_value)) => bounty_value.amount.clone(),
        Ok(None) => TokenAmount::from(0),
        Err(err) => abort!(
            USR_ILLEGAL_STATE,
            "failed to query hamt when getting bounty balance: {:?}",
            err
        ),
    };
    amount += sdk::message::value_received();

    if amount > TokenAmount::from(0) {
        let bounty_value = BountyValue { amount: amount };
        bounties.set(key, bounty_value).unwrap();

        // Flush the HAMT to generate the new root CID to update the actor's state.
        let cid = match bounties.flush() {
            Ok(cid) => cid,
            Err(err) => abort!(USR_ILLEGAL_STATE, "failed to flush hamt: {:?}", err),
        };

        // Update the actor's state.
        state.bounties_map = cid;
        state.save();
    }

    None
}

#[derive(Debug, Serialize)]
pub struct PostedBounty {
    pub piece_cid: Cid,
    pub address: Address,
    #[serde(with = "bigint_ser")]
    pub amount: TokenAmount,
}

/// Method num 3.
pub fn list_bounties() -> Option<RawBytes> {
    let mut bounties_vec = Vec::new();

    let state = State::load();
    let bounties =
        match Hamt::<Blockstore, BountyValue, BytesKey>::load(&state.bounties_map, Blockstore) {
            Ok(map) => map,
            Err(err) => abort!(USR_ILLEGAL_STATE, "failed to load bounties hamt: {:?}", err),
        };
    bounties
        .for_each(|k, v: &BountyValue| {
            let raw_bytes = RawBytes::new(k.as_slice().to_vec());
            let key: BountyKey = raw_bytes.deserialize().unwrap();
            let posted_bounty = PostedBounty {
                piece_cid: key.piece_cid,
                address: key.address,
                amount: v.amount.clone(),
            };
            bounties_vec.push(posted_bounty);
            Ok(())
        })
        .unwrap();

    Some(RawBytes::serialize(&bounties_vec).unwrap())
}

/// Method num 4.
pub fn lookup_bounty(params: u32) -> Option<RawBytes> {
    let params = sdk::message::params_raw(params).unwrap().1;
    let params = RawBytes::new(params);
    let params: PostBountyParams = params.deserialize().unwrap();

    let state = State::load();
    let bounties =
        match Hamt::<Blockstore, BountyValue, BytesKey>::load(&state.bounties_map, Blockstore) {
            Ok(map) => map,
            Err(err) => abort!(USR_ILLEGAL_STATE, "failed to load bounties hamt: {:?}", err),
        };

    let key = BountyKey {
        piece_cid: params.piece_cid,
        address: params.address,
    };
    let raw_bytes = RawBytes::serialize(&key).unwrap();
    let bytes = raw_bytes.bytes();
    let key = BytesKey::from(bytes);
    let amount = match bounties.get(&key) {
        Ok(Some(bounty_value)) => bounty_value.amount.clone(),
        Ok(None) => TokenAmount::from(0),
        Err(err) => abort!(
            USR_ILLEGAL_STATE,
            "failed to query hamt when getting bounty balance: {:?}",
            err
        ),
    };
    let bounty_value = BountyValue { amount: amount };
    Some(RawBytes::serialize(&bounty_value).unwrap())
}

#[derive(Debug, Deserialize_tuple)]
pub struct AwardBountyParams {
    pub piece_cid: Cid,
    pub address: Address,
    pub payout_address: Address,
}

/// Method num 5.
pub fn award_bounty(params: u32) -> Option<RawBytes> {
    let params = sdk::message::params_raw(params).unwrap().1;
    let params = RawBytes::new(params);
    let params: AwardBountyParams = params.deserialize().unwrap();

    let mut state = State::load();

    let caller = sdk::message::caller();
    let address = Address::new_id(caller);
    if state.trusted_address != address.clone() {
        abort!(
            USR_FORBIDDEN,
            "caller not trusted {:?} != {:?} (trusted)",
            address,
            &state.trusted_address
        );
    }

    let mut bounties =
        match Hamt::<Blockstore, BountyValue, BytesKey>::load(&state.bounties_map, Blockstore) {
            Ok(map) => map,
            Err(err) => abort!(USR_ILLEGAL_STATE, "failed to load bounties hamt: {:?}", err),
        };

    let key = BountyKey {
        piece_cid: params.piece_cid,
        address: params.address,
    };
    let raw_bytes = RawBytes::serialize(&key).unwrap();
    let bytes = raw_bytes.bytes();
    let key = BytesKey::from(bytes);

    let amount = match bounties.get(&key) {
        Ok(Some(bounty_value)) => bounty_value.amount.clone(),
        Ok(None) => TokenAmount::from(0),
        Err(err) => abort!(
            USR_ILLEGAL_STATE,
            "failed to query hamt when getting bounty balance: {:?}",
            err
        ),
    };

    if amount > TokenAmount::from(0) {
        let send_params = RawBytes::default();
        let _receipt =
            fvm_sdk::send::send(&params.payout_address, METHOD_SEND, send_params, amount).unwrap();

        bounties.delete(&key).unwrap();

        // Flush the HAMT to generate the new root CID to update the actor's state.
        let cid = match bounties.flush() {
            Ok(cid) => cid,
            Err(err) => abort!(USR_ILLEGAL_STATE, "failed to flush hamt: {:?}", err),
        };

        // Update the actor's state.
        state.bounties_map = cid;
        state.save();
    }

    None
}
`.trim()
)}

function _templateStart(initialCode)
{
  const code = initialCode
    .replace('pub fn invoke(_: u32)', 'pub fn invoke(params: u32)')
    .replace('constructor()', 'constructor(params)')
    .replace('say_hello()', 'post_bounty(params)')
    .replace(/\/\/\/ The state object.[^}]*}/s, '%%stateObjectCode%%')
    .replace(/\/\/\/ The constructor populates the initial state.*/s, '')
    .split('\n')

  const insertAt = code.findIndex(line => line.match(/post_bounty/)) + 1
  code.splice(
    insertAt, 0,
    '        3 => list_bounties(),',
    '        4 => lookup_bounty(params),',
    '        5 => award_bounty(params),',    
  )
  code.splice(
    10, 0,
    'use serde::{Serialize, Deserialize};',
    'use fvm_shared::METHOD_SEND;',
    'use fvm_shared::address::Address;',
    'use fvm_shared::bigint::bigint_ser;',
    'use fvm_shared::econ::TokenAmount;',
    'use fvm_ipld_hamt::{BytesKey, Hamt};',
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


function _172(md){return(
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

function _invalidatedAt(){return(
new Date()
)}

async function _providerIds(ready,client,sortMiners){return(
ready && (await client.stateListMiners([])).sort(sortMiners)
)}

function _sortMiners(){return(
(a, b) => Number(a.slice(1)) - Number(b.slice(1))
)}

function _heightReadyTapStream(heightStream,client,$0){return(
async function *heightReadyTapStream () {
  let lastReady = false
  let enoughProviders = false
  for await (const height of heightStream()) {
    const newReady = height > 7
    if (newReady && !enoughProviders) {
      const providerIds = await client.stateListMiners([])
      enoughProviders = providerIds.length >= 3
    }
    if (enoughProviders && newReady !== lastReady) {
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

function _walletDefaultId(walletDefaultAddress,client){return(
walletDefaultAddress && client.stateLookupID(walletDefaultAddress, [])
)}

function _186(md){return(
md`## Backups`
)}

function _188(backups){return(
backups()
)}

function _189(backupNowButton){return(
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
  main.variable(observer()).define(["ready","md"], _11);
  main.variable(observer()).define(["transferFundsStatus","md","Promises"], _12);
  main.variable(observer("transferFundsStatus")).define("transferFundsStatus", ["walletDefaultAddress","keys","client"], _transferFundsStatus);
  main.variable(observer("aliceId")).define("aliceId", ["transferFundsStatus","keys"], _aliceId);
  main.variable(observer("bobId")).define("bobId", ["transferFundsStatus","keys"], _bobId);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer("initialBalances")).define("initialBalances", ["transferFundsStatus","md","getBalances","clientAddresses"], _initialBalances);
  main.variable(observer()).define(["Inputs","initialBalances","keys","transferFundsStatus","FilecoinNumber"], _19);
  main.variable(observer("aliceAddress")).define("aliceAddress", ["transferFundsStatus","aliceId"], _aliceAddress);
  main.variable(observer("bobAddress")).define("bobAddress", ["transferFundsStatus","bobId"], _bobAddress);
  main.variable(observer("getBalances")).define("getBalances", ["client"], _getBalances);
  main.variable(observer()).define(["md"], _23);
  main.variable(observer()).define(["md"], _24);
  main.variable(observer("bobKeyInfoImportResult")).define("bobKeyInfoImportResult", ["ready","keys","buffer","client"], _bobKeyInfoImportResult);
  main.variable(observer()).define(["md"], _26);
  main.variable(observer()).define(["md"], _27);
  main.variable(observer()).define(["bobAddress","client","mutable invalidatedAt"], _28);
  main.variable(observer()).define(["md"], _29);
  main.variable(observer("viewof editor")).define("viewof editor", ["skypack","stateObjectCode","methodsCode"], _editor);
  main.variable(observer("editor")).define("editor", ["Generators", "viewof editor"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _31);
  main.variable(observer("combinedCode")).define("combinedCode", ["editor","templateStart"], _combinedCode);
  main.variable(observer()).define(["html","button","combinedCode"], _34);
  main.variable(observer()).define(["md"], _35);
  main.variable(observer()).define(["md"], _36);
  main.variable(observer("viewof compileToWasmButton")).define("viewof compileToWasmButton", ["Inputs","combinedCode"], _compileToWasmButton);
  main.variable(observer("compileToWasmButton")).define("compileToWasmButton", ["Generators", "viewof compileToWasmButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["compileStatus","md","Promises","html","stripAnsi"], _38);
  main.variable(observer()).define(["compileStatus","md"], _39);
  main.variable(observer()).define(["compileStatus","html","button","md"], _40);
  main.variable(observer("compileStatus")).define("compileStatus", ["compileToWasmButton","baseUrl","patchedCargoToml","cbor"], _compileStatus);
  main.variable(observer()).define(["md"], _42);
  main.variable(observer()).define(["md","currentHeight"], _43);
  main.variable(observer()).define(["md"], _44);
  main.variable(observer()).define(["md"], _45);
  main.variable(observer()).define(["md"], _46);
  main.variable(observer("viewof installActorButton")).define("viewof installActorButton", ["Inputs","compileStatus"], _installActorButton);
  main.variable(observer("installActorButton")).define("installActorButton", ["Generators", "viewof installActorButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["installActorStatus","md","Promises","html"], _48);
  main.variable(observer("installActorStatus")).define("installActorStatus", ["installActorButton","walletDefaultAddress","compileStatus","client"], _installActorStatus);
  main.variable(observer()).define(["md"], _50);
  main.variable(observer()).define(["md"], _51);
  main.variable(observer()).define(["md"], _52);
  main.variable(observer()).define(["md"], _53);
  main.variable(observer("viewof createActorButton")).define("viewof createActorButton", ["Inputs","installActorStatus"], _createActorButton);
  main.variable(observer("createActorButton")).define("createActorButton", ["Generators", "viewof createActorButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["createActorStatus","md","Promises","createActorButton","html"], _55);
  main.variable(observer("createActorStatus")).define("createActorStatus", ["createActorButton","CID","filecoinAddress","walletDefaultId","cbor","walletDefaultAddress","client"], _createActorStatus);
  main.variable(observer("bountyActorId")).define("bountyActorId", ["createActorStatus"], _bountyActorId);
  main.variable(observer("bountyActorAddress")).define("bountyActorAddress", ["createActorStatus"], _bountyActorAddress);
  main.variable(observer()).define(["md"], _59);
  main.variable(observer()).define(["md"], _60);
  main.variable(observer("phrases")).define("phrases", ["protocolWords"], _phrases);
  main.variable(observer("phraseUploads")).define("phraseUploads", ["phrases","baseUrl","client"], _phraseUploads);
  main.variable(observer()).define(["Inputs","phrases","phraseUploads"], _63);
  main.variable(observer("pieceCidToPhraseMap")).define("pieceCidToPhraseMap", ["phrases","phraseUploads"], _pieceCidToPhraseMap);
  main.variable(observer("pieceCidToFilenameMap")).define("pieceCidToFilenameMap", ["phrases","phraseUploads"], _pieceCidToFilenameMap);
  main.variable(observer()).define(["md"], _66);
  main.variable(observer()).define(["md"], _67);
  main.variable(observer()).define(["md"], _68);
  main.variable(observer("viewof postBountyForm")).define("viewof postBountyForm", ["providerIds","phrases","Inputs","phraseUploads"], _postBountyForm);
  main.variable(observer("postBountyForm")).define("postBountyForm", ["Generators", "viewof postBountyForm"], (G, _) => G.input(_));
  main.variable(observer("viewof postBountyButton")).define("viewof postBountyButton", ["Inputs","createActorStatus","postBountyForm","aliceAddress"], _postBountyButton);
  main.variable(observer("postBountyButton")).define("postBountyButton", ["Generators", "viewof postBountyButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["postBountyStatus","md","Promises","bountyActorId","html","mutable invalidatedAt"], _71);
  main.variable(observer()).define(["md"], _72);
  main.variable(observer()).define(["md"], _73);
  main.variable(observer()).define(["balancesTable"], _74);
  main.variable(observer()).define(["Inputs","mutable invalidatedAt"], _75);
  main.variable(observer("balancesTable")).define("balancesTable", ["invalidatedAt","postBountyStatus","md","getBalances","bountyActorAddress","clientAddresses","Inputs","keys","bountyActorId","transferFundsStatus","FilecoinNumber"], _balancesTable);
  main.variable(observer("postBountyStatus")).define("postBountyStatus", ["postBountyButton","multiformats","filecoinAddress","bountyActorAddress","FilecoinNumber","cbor","keys","filecoin_client","client"], _postBountyStatus);
  main.variable(observer()).define(["md"], _78);
  main.variable(observer()).define(["md"], _79);
  main.variable(observer()).define(["availableBountiesTable"], _80);
  main.variable(observer("availableBountiesTable")).define("availableBountiesTable", ["Inputs","bounties"], _availableBountiesTable);
  main.variable(observer("bountiesCall")).define("bountiesCall", ["invalidatedAt","bountyActorId","walletDefaultAddress","client"], _bountiesCall);
  main.variable(observer("bounties")).define("bounties", ["bountiesCall","cbor","multiformats","filecoinAddress","filecoinNumber","bytesToBig","pieceCidToPhraseMap"], _bounties);
  main.variable(observer()).define(["md"], _84);
  main.variable(observer()).define(["md"], _85);
  main.variable(observer("viewof selectedBounty")).define("viewof selectedBounty", ["Inputs","bounties"], _selectedBounty);
  main.variable(observer("selectedBounty")).define("selectedBounty", ["Generators", "viewof selectedBounty"], (G, _) => G.input(_));
  main.variable(observer("viewof makeDealButton")).define("viewof makeDealButton", ["Inputs","selectedBounty"], _makeDealButton);
  main.variable(observer("makeDealButton")).define("makeDealButton", ["Generators", "viewof makeDealButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _88);
  main.variable(observer()).define(["Inputs","dealList","watchDeals"], _89);
  main.variable(observer()).define(["makeDealButton"], _90);
  main.define("initial dealList", _dealList);
  main.variable(observer("mutable dealList")).define("mutable dealList", ["Mutable", "initial dealList"], (M, _) => new M(_));
  main.variable(observer("dealList")).define("dealList", ["mutable dealList"], _ => _.generator);
  main.variable(observer("makeDealStatus")).define("makeDealStatus", ["makeDealButton","pieceCidToFilenameMap","client","bobAddress","mutable dealList"], _makeDealStatus);
  main.variable(observer("watchDeals")).define("watchDeals", ["dealList","client","Promises"], _watchDeals);
  main.variable(observer()).define(["md"], _94);
  main.variable(observer()).define(["md"], _95);
  main.variable(observer()).define(["md"], _96);
  main.variable(observer()).define(["md"], _97);
  main.variable(observer()).define(["Inputs","observedDealList","pieceCidToPhraseMap"], _98);
  main.variable(observer()).define(["md"], _99);
  main.variable(observer("viewof awardOptions")).define("viewof awardOptions", ["Inputs"], _awardOptions);
  main.variable(observer("awardOptions")).define("awardOptions", ["Generators", "viewof awardOptions"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _101);
  main.variable(observer()).define(["awardedBountyListTable"], _102);
  main.variable(observer("awardedBountyListTable")).define("awardedBountyListTable", ["Inputs","awardedBountyList","pieceCidToPhraseMap"], _awardedBountyListTable);
  main.define("initial awardedBountyList", _awardedBountyList);
  main.variable(observer("mutable awardedBountyList")).define("mutable awardedBountyList", ["Mutable", "initial awardedBountyList"], (M, _) => new M(_));
  main.variable(observer("awardedBountyList")).define("awardedBountyList", ["mutable awardedBountyList"], _ => _.generator);
  main.define("initial observedDealList", _observedDealList);
  main.variable(observer("mutable observedDealList")).define("mutable observedDealList", ["Mutable", "initial observedDealList"], (M, _) => new M(_));
  main.variable(observer("observedDealList")).define("observedDealList", ["mutable observedDealList"], _ => _.generator);
  main.variable(observer("DealsStream")).define("DealsStream", ["heightStream","client"], _DealsStream);
  main.variable(observer("serviceStatus")).define("serviceStatus", ["DealsStream","client","mutable observedDealList","viewof awardOptions","pieceCidToPhraseMap","lookupBounty","awardBounty","mutable awardedBountyList","mutable invalidatedAt"], _serviceStatus);
  main.variable(observer("lookupBounty")).define("lookupBounty", ["multiformats","filecoinAddress","bountyActorId","walletDefaultAddress","cbor","client","filecoinNumber","bytesToBig"], _lookupBounty);
  main.variable(observer()).define(["md"], _109);
  main.variable(observer("viewof lookupBountySelection")).define("viewof lookupBountySelection", ["Inputs","bounties"], _lookupBountySelection);
  main.variable(observer("lookupBountySelection")).define("lookupBountySelection", ["Generators", "viewof lookupBountySelection"], (G, _) => G.input(_));
  main.variable(observer("viewof lookupBountyButton")).define("viewof lookupBountyButton", ["Inputs","lookupBountySelection"], _lookupBountyButton);
  main.variable(observer("lookupBountyButton")).define("lookupBountyButton", ["Generators", "viewof lookupBountyButton"], (G, _) => G.input(_));
  main.variable(observer("lookup")).define("lookup", ["lookupBountyButton","md","lookupBounty"], _lookup);
  main.variable(observer()).define(["md"], _113);
  main.variable(observer()).define(["md"], _114);
  main.variable(observer("viewof awardBountySelection")).define("viewof awardBountySelection", ["Inputs","bounties"], _awardBountySelection);
  main.variable(observer("awardBountySelection")).define("awardBountySelection", ["Generators", "viewof awardBountySelection"], (G, _) => G.input(_));
  main.variable(observer("viewof awardBountyButton")).define("viewof awardBountyButton", ["Inputs","awardBountySelection"], _awardBountyButton);
  main.variable(observer("awardBountyButton")).define("awardBountyButton", ["Generators", "viewof awardBountyButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["awardBountyStatus","md","Promises","bountyActorId","html"], _117);
  main.variable(observer()).define(["md"], _118);
  main.variable(observer()).define(["md"], _119);
  main.variable(observer()).define(["awardedBountyListTable"], _120);
  main.variable(observer()).define(["md"], _121);
  main.variable(observer()).define(["availableBountiesTable"], _122);
  main.variable(observer()).define(["md"], _123);
  main.variable(observer()).define(["balancesTable"], _124);
  main.variable(observer("awardBountyStatus")).define("awardBountyStatus", ["awardBountyButton","awardBounty","bobId","client","cbor","mutable awardedBountyList","bobAddress","mutable invalidatedAt"], _awardBountyStatus);
  main.variable(observer("awardBounty")).define("awardBounty", ["multiformats","filecoinAddress","bountyActorAddress","walletDefaultAddress","cbor","client"], _awardBounty);
  main.variable(observer()).define(["md"], _127);
  main.variable(observer()).define(["FilecoinNumber"], _128);
  main.variable(observer()).define(["cbor","FilecoinNumber"], _129);
  main.variable(observer("bigToBytes")).define("bigToBytes", ["BN"], _bigToBytes);
  main.variable(observer()).define(["bigToBytes"], _131);
  main.variable(observer()).define(["bigToBytes"], _132);
  main.variable(observer()).define(["bigToBytes","FilecoinNumber"], _133);
  main.variable(observer()).define(_134);
  main.variable(observer()).define(["bigToBytes"], _135);
  main.variable(observer()).define(["bigToBytes"], _136);
  main.variable(observer()).define(["bigToBytes"], _137);
  main.variable(observer("bytesToBig")).define("bytesToBig", ["BN"], _bytesToBig);
  main.variable(observer()).define(["bytesToBig","bigToBytes"], _139);
  main.variable(observer()).define(["bytesToBig","bigToBytes"], _140);
  main.variable(observer()).define(["md"], _141);
  main.variable(observer()).define(["md"], _142);
  main.variable(observer()).define(["md"], _143);
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
  main.variable(observer("protocolWords")).define("protocolWords", _protocolWords);
  main.variable(observer("filecoinAddress")).define("filecoinAddress", _filecoinAddress);
  main.variable(observer("multiformats")).define("multiformats", _multiformats);
  main.variable(observer("buffer")).define("buffer", ["require"], _buffer);
  main.variable(observer()).define(["md"], _163);
  main.variable(observer("initialCodeUrl")).define("initialCodeUrl", _initialCodeUrl);
  main.variable(observer("initialCode")).define("initialCode", ["initialCodeUrl"], _initialCode);
  main.variable(observer("stateObjectCode")).define("stateObjectCode", _stateObjectCode);
  main.variable(observer("methodsCode")).define("methodsCode", _methodsCode);
  main.variable(observer("templateStart")).define("templateStart", ["initialCode"], _templateStart);
  main.variable(observer("initialCargoTomlUrl")).define("initialCargoTomlUrl", _initialCargoTomlUrl);
  main.variable(observer("initialCargoToml")).define("initialCargoToml", ["initialCargoTomlUrl"], _initialCargoToml);
  main.variable(observer("patchedCargoToml")).define("patchedCargoToml", ["initialCargoToml"], _patchedCargoToml);
  main.variable(observer()).define(["md"], _172);
  main.variable(observer("baseUrl")).define("baseUrl", _baseUrl);
  main.variable(observer("token")).define("token", ["baseUrl"], _token);
  main.variable(observer("client")).define("client", ["BrowserProvider","baseUrl","token","LotusRPC","schema"], _client);
  main.variable(observer("filecoin_client")).define("filecoin_client", ["FilecoinClient","baseUrl","token"], _filecoin_client);
  main.variable(observer("heightStream")).define("heightStream", ["client","Promises"], _heightStream);
  main.define("initial ready", _ready);
  main.variable(observer("mutable ready")).define("mutable ready", ["Mutable", "initial ready"], (M, _) => new M(_));
  main.variable(observer("ready")).define("ready", ["mutable ready"], _ => _.generator);
  main.define("initial invalidatedAt", _invalidatedAt);
  main.variable(observer("mutable invalidatedAt")).define("mutable invalidatedAt", ["Mutable", "initial invalidatedAt"], (M, _) => new M(_));
  main.variable(observer("invalidatedAt")).define("invalidatedAt", ["mutable invalidatedAt"], _ => _.generator);
  main.variable(observer("providerIds")).define("providerIds", ["ready","client","sortMiners"], _providerIds);
  main.variable(observer("sortMiners")).define("sortMiners", _sortMiners);
  main.variable(observer("heightReadyTapStream")).define("heightReadyTapStream", ["heightStream","client","mutable ready"], _heightReadyTapStream);
  main.variable(observer("currentHeight")).define("currentHeight", ["heightReadyTapStream"], _currentHeight);
  main.variable(observer("walletDefaultAddress")).define("walletDefaultAddress", ["ready","client"], _walletDefaultAddress);
  main.variable(observer("walletDefaultId")).define("walletDefaultId", ["walletDefaultAddress","client"], _walletDefaultId);
  main.variable(observer()).define(["md"], _186);
  const child2 = runtime.module(define2);
  main.import("backups", child2);
  main.import("backupNowButton", child2);
  main.variable(observer()).define(["backups"], _188);
  main.variable(observer()).define(["backupNowButton"], _189);
  return main;
}
