import define1 from "./9a34a4df6e8a276b@50.js";
import define2 from "./c2dae147641e012a@46.js";
import define3 from "./c4e4a355c53d2a1a@111.js";

function _1(md){return(
md`# FVM Actor Code Playground - ERC20 Sans Events - Wallaby Testnet`
)}

function _2(md){return(
md`**ALERT: Not working on current version of the testnet!**

*(The code needs to be updated to use the Ethereum JSON-RPC APIs and f4 addresses)*`
)}

function _3(md){return(
md`Try a real [ERC20](https://docs.openzeppelin.com/contracts/4.x/erc20) Smart Contract on the [Filecoin Virtual Machine](https://fvm.filecoin.io/)!

Here is an example EVM Smart Contract, from:

* https://github.com/filecoin-project/testnet-wallaby/issues/8
* https://github.com/filecoin-project/fvm-example-actors/tree/main/erc20-sans-events
* https://github.com/jimpick/fvm-example-actors/tree/jim-erc20/erc20-sans-events (same as above, but with extra build scripts and missing files)

You can modify it here, then scroll down and click the buttons to compile it, then load onto the [Wallaby Testnet](https://kb.factor8.io/en/docs/fil/wallabynet), and invoke methods against it.`
)}

function _4(md){return(
md`This is a modified version of the [ERC20 Sans Events](https://observablehq.com/@jimpick/fvm-actor-code-playground-erc20-sans-events) notebook (that version deploys the contract to an on-demand localnet instead of a live testnet). This demo runs much slower because the testnet has a 30 second block time, whereas the localnet has a 10 second block time.`
)}

function _5(md){return(
md`It communicates with the network using the [Wallaby Public GLIF API Gateway](https://wallaby.node.glif.io/) ... so it needs to keep all the secrets local in the web browser.`
)}

function _6(md){return(
md`## Development Funds`
)}

function _7(md){return(
md`Since we're going to deploy against the Wallaby Testnet, we'll need some funds to do that. First, we'll create a "seed phrase" (aka. "mnemonic") and store that (very insecurely) in the browser's localStorage so that it can be accessed from any notebook. Cryptographic keys can be derived from the passphrase so you have an address to send funds to. This is super dangerous! You wouldn't want to do this with real funds!`
)}

function _8(md,devFundsMnemonic){return(
md`**Developer funds seed phrase:**

\`\`\`
${devFundsMnemonic.split(' ').slice(0,12).join(' ')}
${devFundsMnemonic.split(' ').slice(-12).join(' ')}
\`\`\`
`
)}

function _9(md){return(
md`**Tip:** You can import the seed phrase from above to create a "burner wallet" using the [GLIF Wallet](https://wallet.glif.io/?network=wallaby) (optional)`
)}

function _10(md,devFundsKey,devFundsId,devFundsBalance)
{
  return md`
Address: **\`${devFundsKey.address}\`**

ID: ${!devFundsId || devFundsId.error ? "Doesn't exist yet, transfer in some funds." : devFundsId} \ 
Balance: ${!devFundsBalance || devFundsBalance.error ? '0 FIL' : devFundsBalance.toFil() + ' FIL'}
`
}


function _11(Inputs,$0,$1){return(
Inputs.button("Re-check ID and Balance", { value: null, reduce: () => {
  $0.value = new Date();
  $1.value = new Date();
} })
)}

function _12(md){return(
md`You can get some funds from the [Wallaby Faucet](https://wallaby.network/#faucet) ... just submit the address above, complete the captcha, and wait for the funds to be deposited. (Be sure to scroll down to see the form)`
)}

function _13(md,devFundsKey){return(
md`Also, check out the [GLIF Explorer](https://explorer.glif.io/actor/?network=wallaby&address=${devFundsKey.address}) to watch the transactions for the address in real time.`
)}

function _14(md){return(
md`---`
)}

function _devFundsMnemonic(localStorage,filecoin_signer)
{
  const localStorageKey = 'fvm_playground_dev_funds_phrase'
  let phrase = localStorage.getItem(localStorageKey)
  if (!phrase) {
    // https://github.com/blitslabs/filecoin-js-signer#filecoin-signer
    const strength = 256 // 128 => 12 words | 256 => 24 words
    phrase = filecoin_signer.wallet.generateMnemonic(strength)
    localStorage.setItem(localStorageKey, phrase)
  }
  return phrase
}


async function _devFundsKey(filecoin_signer,devFundsMnemonic)
{
  const network = 'testnet'

  const key = await filecoin_signer.wallet.keyDerive(devFundsMnemonic, `m/44'/1'/0'/0/0`, network)
  key.name = 'Owner'
  return key
}


async function _devFundsId(invalidatedDevFundsIdAt,lotusApiClient,devFundsKey)
{
  invalidatedDevFundsIdAt;
  try {
    return await lotusApiClient.state.lookupId(devFundsKey.address, [])
  } catch (e) {
    return { error: e.message }
  }
}


function _invalidatedDevFundsIdAt(){return(
new Date()
)}

async function _devFundsBalance(invalidatedDevFundsBalanceAt,lotusApiClient,devFundsKey,FilecoinNumber)
{
  invalidatedDevFundsBalanceAt;
  try {
    const result = await lotusApiClient.state.getActor(devFundsKey.address, [])
    return new FilecoinNumber(result.Balance, 'attofil')
  } catch (e) {
    return { error: e.message }
  }
}


function _invalidatedDevFundsBalanceAt(){return(
new Date()
)}

function _devFundsReady(devFundsId){return(
devFundsId && !devFundsId.error
)}

function _22(md){return(
md`## Generate Client Side Addresses`
)}

function _23(md){return(
md`We use \`filecoin-js-signer\` to generate a random mnemomic phrase. You could save this phrase and re-use it to generate the secrets. In this notebook, we just use different secrets on each page reload.`
)}

function _24(md,randomMnemonic){return(
md`**Random temporary seed phrase:**

\`\`\`
${randomMnemonic}
\`\`\`
`
)}

function _25(md){return(
md`---`
)}

function _randomMnemonic(filecoin_signer)
{
  // https://github.com/blitslabs/filecoin-js-signer#filecoin-signer
  const strength = 128 // 128 => 12 words | 256 => 24 words
  return filecoin_signer.wallet.generateMnemonic(strength)
}


async function _keys(ethers,randomMnemonic,filecoinAddress)
{
  const keys = []
  const names = [ 'Owner', 'Alice', 'Bob', 'Carol' ]
  for (let i = 0; i < names.length; i++) {
    const network = 'testnet'

    // const key = await filecoin_signer.wallet.keyDerive(randomMnemonic, `m/44'/60'/0'/0/${i}`, network)
    const key = await ethers.Wallet.fromMnemonic(randomMnemonic, `m/44'/60'/0'/0/${i}`)
    key.delegated = filecoinAddress.newDelegatedEthAddress(key.address, 't')
    
    key.name = names[i]

    keys.push(key)
  }
  return keys
}


function _clientAddresses(keys){return(
keys.map(key => key.delegated.toString())
)}

function _ownerKey(keys){return(
keys.find(({ name }) => name === 'Owner')
)}

function _30(md){return(
md`## Wait for Lotus to be ready, then transfer 100 FIL to each address`
)}

function _31(md){return(
md`Be patient as it takes a little while for the funds to be sent via the Lotus JSON-RPC API when the notebook is first loaded. Transferring the funds might take up to 2 minutes.`
)}

async function* _32(transferFundsStatus,md,Promises)
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


function _33(md){return(
md`---`
)}

async function* _transferFundsStatus(walletDefaultAddress,keys,devFundsKey,filecoin_client,waitMsg,devFundsId,lotusApiClient,$0)
{
  if (walletDefaultAddress && keys) {
    const start = Date.now()
    yield {
      transferring: true,
      start
    }
    const privateKey = devFundsKey.privateKey
    const responses = []
    for (const key of keys) {
      responses.push(await filecoin_client.tx.send(
        key.address, // to
        '1000000000000000000',
        1000000000, // gaslimit
        privateKey,
        'testnet', // network
        false // waitMsg
      ))
    }
    const waitStart = Date.now()
    yield { waiting: true, start, waitStart, responses }
    const promises = []
    for (const response of responses) {
      promises.push(waitMsg(response))
    }
    const waitResponses = await Promise.all(promises)
    const lookups = {
      [walletDefaultAddress]: devFundsId
    }
    for (const key of keys) {
      lookups[key.address] = await lotusApiClient.state.lookupId(key.address, [])
    }
    yield { transferred: true, responses, waitResponses, lookups }
    $0.value = new Date()
  }
}


function _35(md){return(
md`## Initial Balances`
)}

function _36(md){return(
md`Here are the addresses and IDs of the 3 clients we created, as well at their initial balances (should be 1 FIL each).`
)}

function _37(Inputs,initialBalances,keys,transferFundsStatus,FilecoinNumber){return(
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

function _38(md){return(
md`---`
)}

function _initialBalances(transferFundsStatus,md,getBalances,clientAddresses){return(
!transferFundsStatus ? md`Waiting...` : transferFundsStatus.transferred && getBalances(clientAddresses)
)}

function _getBalances(lotusApiClient){return(
async function getBalances (addresses) {
  return Promise.all(
    addresses
      .map(async address => {
        const response = await lotusApiClient.state.getActor(address, [])
        return {
          address: address,
          balance: response.Balance
        }
      })
  )
}
)}

function _41(md){return(
md`## Step 1: Define deployment parameters for your token`
)}

function _constructorParamsForm(Inputs){return(
Inputs.form([
  Inputs.text({label: "Name for your token", value: "littlecoin"}),
  Inputs.text({label: "Symbol for your token", value: "LIT"}),
  Inputs.number({label: "Initial supply", value: 1000000 })
])
)}

function _43(md,devFundsId){return(
md`The "address" will be set to \`${devFundsId}\`, which is the address for our developer funds.`
)}

function _44(md){return(
md`The code below uses the [\`.encodeDeploy()\`](https://docs.ethers.io/v5/api/utils/abi/interface/#Interface--encoding) method from ethers.js to encode the constructor parameters which are appended to the contract binary.`
)}

function _45(evmBytes,html,button,constructorParamsForm,md){return(
evmBytes ? html`Optional: ${button(evmBytes, constructorParamsForm[0] + '.bin')}` : md``
)}

function _46(md){return(
md`**Tip:** You could use this binary and load it into the Wallaby testnet using the [wallaby-fevm-msg-signer](https://github.com/jimpick/wallaby-fevm-msg-signer) command line tool.`
)}

function _47(md){return(
md`---`
)}

async function _contractBytes(FileAttachment,buffer)
{
  // Using prebuilt example from https://github.com/filecoin-project/fvm-example-actors/tree/main/erc20-sans-events/bin
  const buf = new Uint8Array(await FileAttachment("ERC20.bin").arrayBuffer())
  const bytes = buffer.Buffer.from(buf)
  return bytes.subarray(0, bytes.length - 256) // Remove initcode

  /*
  const buf = await (await fetch('https://raw.githubusercontent.com/jimpick/fvm-example-actors/jim-erc20/erc20-sans-events/output/ERC20PresetFixedSupply.bin')).arrayBuffer()
  return buffer.Buffer.from(buf, 'hex')
  */
}


async function _abi(){return(
(await fetch('https://raw.githubusercontent.com/jimpick/fvm-example-actors/jim-erc20/erc20-sans-events/output/ERC20PresetFixedSupply.abi')).json()
)}

function _iface(ethers,abi){return(
new ethers.utils.Interface(abi)
)}

function _deployBytes(buffer,iface,constructorParamsForm,getEvmAddress,devFundsId){return(
buffer.Buffer.from(
  iface.encodeDeploy(
    [ 
      constructorParamsForm[0], // name - string
      constructorParamsForm[1], // symbol - string
      constructorParamsForm[2], // initialSupply - uint256
      "0x" + getEvmAddress(devFundsId).slice(24), // owner - address (genesis miner)
    ]
  ).slice(2), 'hex'
)
)}

function _evmBytes(buffer,contractBytes,deployBytes){return(
buffer.Buffer.concat([contractBytes, deployBytes])
)}

function _53(md){return(
md`## Step 2: Create an EVM actor instance`
)}

function _54(md){return(
md`Now we can create an actor instance from the compiled EVM smart contract. It is possible to create lots and lots of actors using the same code, each will get assigned a unique "ID Address" (eg. t01001) to which messages and funds can be sent, as well as an equivalent "Robust Address" alias (eg. "t2...") which maps on the same address (but doesn't change in the event of a chain re-organization).`
)}

function _55(md){return(
md`At the command line, this is the same as: \`lotus chain create-evm-actor <bytecode file>\``
)}

function _createActorButton(Inputs,devFundsReady){return(
Inputs.button(
  'Create EVM Actor',
  {
    disabled: !devFundsReady
  }
)
)}

async function* _57(createActorStatus,md,Promises,html)
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
      <div>Message CID: <a href="https://explorer.glif.io/message/?network=wallaby&cid=${createActorStatus.response.CID['/']}">${createActorStatus.response.CID['/']}</a></div>
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


function _58(md){return(
md`---`
)}

function _evmActorCid(multiformats){return(
multiformats.CID.parse('bafk2bzacecgwjrepfw6r4ozuw47qw435n2jwgxnkdy7yrkbnsdgnqwd2wkcve')
)}

function _evmBytesCbor(cbor,evmBytes){return(
cbor.encode([evmBytes])
)}

async function* _createActorStatus(createActorButton,evmActorCid,cbor,evmBytesCbor,walletDefaultAddress,devFundsKey,filecoin_client,waitMsg,filecoinAddress)
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
    const message = {
      To: 't01',
      From: walletDefaultAddress,
      Value: "0",
      Method: 2,
      Params: params.toString('base64')
    }
    console.log('message', message)
    const privateKey = devFundsKey.privateKey
    const responseCID = await filecoin_client.tx.sendMessage(
      message,
      privateKey,
      true, // updateMsgNonce
      false // waitMsg
    )
    const waitStart = Date.now()
    yield { waiting: true, waitStart, response: { CID: responseCID } }
    const waitResponse = await waitMsg(responseCID)
    const base64Result = waitResponse.Receipt.Return
    const decoded = cbor.decode(base64Result, 'base64')
    const idAddress = filecoinAddress.newAddress(
      decoded[0][0],
      decoded[0].slice(1),
      't'
    )
    const robustAddress = filecoinAddress.newAddress(
      decoded[1][0],
      decoded[1].slice(1),
      't'
    )
    waitResponse.ReturnDec = {
      IDAddress: idAddress.toString(),
      RobustAddress: robustAddress.toString()
    }
    yield { installed: true, response: { CID: responseCID }, waitResponse }
  }
}


async function _62(md){return(
md`**Signatures:**

\`\`\`
${await (await fetch('https://raw.githubusercontent.com/jimpick/fvm-example-actors/jim-erc20/erc20-sans-events/output/ERC20Burnable.signatures')).text()}
\`\`\``
)}

function _63(md,devFundsId){return(
md`## Step 3: Invoke a method to get the ERC20 token balance for the owner address (${devFundsId})`
)}

function _64(md){return(
md`Now that we've got an actor running with an ID Address, we can call the methods we have defined. Let's check the balance of the addresses. The method signature (from above) to get the balance is => \`70a08231: balanceOf(address)\``
)}

function _invokeEvmMethodButton(Inputs,devFundsId,createActorStatus){return(
Inputs.button(`Get ERC20 Token Balance for Owner (${devFundsId})`, {
  disabled: !createActorStatus ||
    !createActorStatus.waitResponse ||
    !createActorStatus.waitResponse.ReturnDec ||
    !createActorStatus.waitResponse.ReturnDec.IDAddress,
  value: null,
  reduce: () => createActorStatus.waitResponse.ReturnDec.IDAddress
})
)}

async function* _66(invokeEvmMethodStatus,md,Promises,invokeEvmMethodButton,html)
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
      <div>Message CID: <a href="https://explorer.glif.io/message/?network=wallaby&cid=${invokeEvmMethodStatus.response.CID['/']}">${invokeEvmMethodStatus.response.CID['/']}</a></div>
      `
      if (invokeEvmMethodStatus.waitResponse) {
        output += `<div>Message executed in block at height: ${invokeEvmMethodStatus.waitResponse.Height}</div>`
        output += `<div>Gas used: ${invokeEvmMethodStatus.waitResponse.Receipt.GasUsed}</div>`
        output += `<div>Return: ${invokeEvmMethodStatus.waitResponse.Receipt.Return} (Base64 encoded binary array)</div>`
        output += `<div><b>Decoded Result (Hex):</b> <b style="font-size: 100%">${JSON.stringify(invokeEvmMethodStatus.decodedResult.toString('hex'))}</b></div>`
        output += `<div><b>Decoded Result (Decimal):</b> <b style="font-size: 100%">${Number(`0x${invokeEvmMethodStatus.decodedResult.toString('hex')}`)} tokens</b></div>`
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


function _67(md){return(
md`---`
)}

async function* _invokeEvmMethodStatus(invokeEvmMethodButton,buffer,getEvmAddress,devFundsId,walletDefaultAddress,devFundsKey,filecoin_client,waitMsg)
{
  if (invokeEvmMethodButton) {
    const start = Date.now()
    yield {
      invoking: true,
      start
    }
    const params = buffer.Buffer.concat([
      buffer.Buffer.from('70a08231', 'hex'),
      buffer.Buffer.from(getEvmAddress(devFundsId), 'hex')]
    )
    const message = {
      To: invokeEvmMethodButton,
      From: walletDefaultAddress,
      Value: "0",
      Method: 2,
      Params: params.toString('base64')
    }
    console.log('message', message)
    const privateKey = devFundsKey.privateKey
    const responseCID = await filecoin_client.tx.sendMessage(
      message,
      privateKey,
      true, // updateMsgNonce
      false // waitMsg
    )
    const waitStart = Date.now()
    yield { waiting: true, waitStart, response: { CID: responseCID } }
    const waitResponse = await waitMsg(responseCID)
    let decodedResult
    if (waitResponse.Receipt && waitResponse.Receipt.Return) {
      decodedResult = buffer.Buffer.from(waitResponse.Receipt.Return, 'base64')
    }
    yield { invoked: true, response: { CID: responseCID }, waitResponse, decodedResult }
  }
}


function _69(md,devFundsId){return(
md`## Step 4: Invoke a method to transfer ERC20 tokens from the owner address (${devFundsId}) to a user address`
)}

function _70(md){return(
md`The method signature is => \`a9059cbb: transfer(address,uint256)\``
)}

function _transferFromOwnerForm(keys,transferFundsStatus,Inputs){return(
keys && transferFundsStatus && Inputs.form([
  Inputs.select(keys, { label: "Transfer from Owner to User", format: x => `${x.name} (${transferFundsStatus.lookups[x.address]})` }),
  Inputs.range([1, 1000000], {value: 1, step: 1, label: 'ERC20 Tokens to Transfer'})
])
)}

function _transferFromOwnerButton(Inputs,devFundsId,createActorStatus,transferFromOwnerForm){return(
Inputs.button(`Transfer From Owner (${devFundsId})`, {
  disabled: !createActorStatus ||
    !createActorStatus.waitResponse ||
    !createActorStatus.waitResponse.ReturnDec ||
    !createActorStatus.waitResponse.ReturnDec.IDAddress,
  value: null,
  reduce: () => ({
    actorId: createActorStatus.waitResponse.ReturnDec.IDAddress,
    dest: transferFromOwnerForm[0],
    amount: transferFromOwnerForm[1]
  })
})
)}

async function* _73(transferFromOwnerStatus,md,Promises,transferFromOwnerButton,html)
{
  if (transferFromOwnerStatus === undefined || !transferFromOwnerStatus) {
    yield md`Status: Method has not been invoked yet.`
    return
  }
  if (transferFromOwnerStatus.invoking) {
    while (true) {
      const elapsed = (Date.now() - transferFromOwnerStatus.start) / 1000
      yield md`Sending message to actor for method... (${elapsed.toFixed(1)}s)`
      await Promises.delay(1000)
    }
  }
  if (transferFromOwnerStatus.response) {
    while (true) {
      let output = `<div><b>Message sent to actor</b></div>
      <div>To: ${transferFromOwnerButton.actorId}</div>
      <div>Message CID: <a href="https://explorer.glif.io/message/?network=wallaby&cid=${transferFromOwnerStatus.response.CID['/']}">${transferFromOwnerStatus.response.CID['/']}</a></div>
      `
      if (transferFromOwnerStatus.waitResponse) {
        output += `<div>Message executed in block at height: ${transferFromOwnerStatus.waitResponse.Height}</div>`
        output += `<div>Gas used: ${transferFromOwnerStatus.waitResponse.Receipt.GasUsed}</div>`
        output += `<div>Return: ${transferFromOwnerStatus.waitResponse.Receipt.Return} (Base64 encoded binary array)</div>`
        output += `<div><b>Decoded Result (Hex):</b> <b style="font-size: 100%">${JSON.stringify(transferFromOwnerStatus.decodedResult.toString('hex'))}</b></div>`
        yield html`${output}`
        break
      }
      const elapsed = (Date.now() - transferFromOwnerStatus.waitStart) / 1000
      output += `<div>Waiting for message to be executed in a block... (${elapsed.toFixed(1)}s)</div>`
      yield html`${output}`
      await Promises.delay(1000)
    }
  }
}


function _74(md){return(
md`---`
)}

async function* _transferFromOwnerStatus(transferFromOwnerButton,getEvmAddress,transferFundsStatus,buffer,walletDefaultAddress,devFundsKey,filecoin_client,waitMsg,$0)
{
  if (transferFromOwnerButton) {
    const start = Date.now()
    yield {
      invoking: true,
      start
    }
    const dest = getEvmAddress(transferFundsStatus.lookups[transferFromOwnerButton.dest.address])
    const amount = transferFromOwnerButton.amount.toString(16).padStart(64, '0')
    const params = buffer.Buffer.concat([
      buffer.Buffer.from('a9059cbb', 'hex'),
      buffer.Buffer.from(dest, 'hex'),
      buffer.Buffer.from(amount, 'hex')
    ])
    const message = {
      To: transferFromOwnerButton.actorId,
      From: walletDefaultAddress,
      Value: "0",
      Method: 2,
      Params: params.toString('base64')
    }
    console.log('message', message)
    const privateKey = devFundsKey.privateKey
    const responseCID = await filecoin_client.tx.sendMessage(
      message,
      privateKey,
      true, // updateMsgNonce
      false // waitMsg
    )
    const waitStart = Date.now()
    yield { waiting: true, waitStart, response: { CID: responseCID } }
    const waitResponse = await waitMsg(responseCID)
    let decodedResult
    if (waitResponse.Receipt && waitResponse.Receipt.Return) {
      decodedResult = buffer.Buffer.from(waitResponse.Receipt.Return, 'base64')
    }
    yield { invoked: true, response: { CID: responseCID }, waitResponse, decodedResult }
    $0.value = new Date()
  }
}


function _76(md){return(
md`## Step 5: Retrieve the ERC20 token balances for all the addresses`
)}

function _77(md){return(
md`This is the same as Step 3, where we got the token balance for a single account. But here we retrieve all the account token balances in parallel to make it easier to observe what's going on.`
)}

async function* _78(tokenBalancesStatus,md,Promises,transferFundsStatus,Inputs)
{
  if (tokenBalancesStatus?.retrieving || tokenBalancesStatus?.waiting) {
    while (true) {
      const elapsed = (Date.now() - tokenBalancesStatus.start) / 1000
      yield md`Retrieving balances... (${elapsed.toFixed(1)}s)`
      await Promises.delay(1000)
    }
  } else {
    const rows = tokenBalancesStatus?.retrieved ? tokenBalancesStatus.balances.map((balance, i) => {
        return {
          name: tokenBalancesStatus.allKeys[i].name,
          id: transferFundsStatus.lookups[tokenBalancesStatus.allKeys[i].address], 
          balance
        }
      }) : []
    yield Inputs.table(rows)
  }
}


function _79(Inputs,$0){return(
Inputs.button("Update", { value: null, reduce: () => { $0.value = new Date() } })
)}

function _80(md){return(
md`---`
)}

async function* _tokenBalancesStatus(invalidatedBalancesAt,createActorStatus,walletDefaultAddress,keys,devFundsKey,transferFundsStatus,getEvmAddress,buffer,filecoin_client,waitMsg)
{
  invalidatedBalancesAt;
  const evmActorId = createActorStatus?.waitResponse?.ReturnDec?.IDAddress
  if (walletDefaultAddress && keys && evmActorId) {
    const start = Date.now()
    yield {
      retrieving: true,
      start
    }
    const ownerKey = {
      name: 'Owner',
      address: walletDefaultAddress
    }
    const allKeys = [ownerKey].concat(keys)
    const responses = []
    const privateKey = devFundsKey.privateKey
    for (const key of allKeys) {
      const keyActorId = transferFundsStatus.lookups[key.address]
      const addressEvm = getEvmAddress(keyActorId)
      const params = buffer.Buffer.concat([
        buffer.Buffer.from('70a08231', 'hex'),
        buffer.Buffer.from(addressEvm, 'hex')
      ])
      const message = {
        To: evmActorId,
        From: walletDefaultAddress,
        Value: "0",
        Method: 2,
        Params: params.toString('base64')
      }
      responses.push(await filecoin_client.tx.sendMessage(
        message,
        privateKey,
        true, // updateMsgNonce
        false // waitMsg
      ))
    }
    const waitStart = Date.now()
    yield { waiting: true, start, waitStart, responses }
    const promises = []
    for (const response of responses) {
      promises.push(waitMsg(response))
    }
    const waitResponses = await Promise.all(promises)
    const balances = waitResponses.map(waitResponse => {
      const base64 = waitResponse?.Receipt?.Return
      if (base64) {
        const bytes = buffer.Buffer.from(base64, 'base64')
        let multiplier = 1n
        let acc = 0n
        for (let i = 0; i < bytes.length; i++) {
          const value = bytes[bytes.length - i - 1]
          acc += BigInt(value) * multiplier
          multiplier *= 256n
        }
        return acc
      }
    })
    yield { retrieved: true, responses, waitResponses, balances, allKeys }
  }
}


function _invalidatedBalancesAt(){return(
new Date()
)}

function _83(md){return(
md`## Step 6: Transfer ERC20 tokens from user to user`
)}

function _84(md){return(
md`This is almost the same as Step 4, where we transferred from the owner (the genesis address on the Lotus node). But this time we will use secrets on the client side (in the browser) and sign the message from a non-owner address.`
)}

function _transferFromUserForm(keys,transferFundsStatus,Inputs){return(
keys && transferFundsStatus && Inputs.form([
  Inputs.select(keys, { label: "Transfer from User", format: x => `${x.name} (${transferFundsStatus.lookups[x.address]})` }),
  Inputs.select(keys, {
    label: "Transfer to User",
    format: x => `${x.name} (${transferFundsStatus.lookups[x.address]})`,
    value: keys[1]
  }),
  Inputs.range([1, 1000000], {value: 1, step: 1, label: 'ERC20 Tokens to Transfer'})
])
)}

function _transferFromUserButton(Inputs,createActorStatus,transferFromUserForm){return(
Inputs.button('Transfer From User to User', {
  disabled: !createActorStatus ||
    !createActorStatus.waitResponse ||
    !createActorStatus.waitResponse.ReturnDec ||
    !createActorStatus.waitResponse.ReturnDec.IDAddress ||
    transferFromUserForm[0] === transferFromUserForm[1],
  value: null,
  reduce: () => ({
    actorId: createActorStatus.waitResponse.ReturnDec.IDAddress,
    source: transferFromUserForm[0],
    dest: transferFromUserForm[1],
    amount: transferFromUserForm[2]
  })
})
)}

async function* _87(transferFromUserStatus,md,Promises,transferFromUserButton,html)
{
  if (transferFromUserStatus === undefined || !transferFromUserStatus) {
    yield md`Status: Method has not been invoked yet.`
    return
  }
  if (transferFromUserStatus.invoking) {
    while (true) {
      const elapsed = (Date.now() - transferFromUserStatus.start) / 1000
      yield md`Sending message to actor for method... (${elapsed.toFixed(1)}s)`
      await Promises.delay(1000)
    }
  }
  if (transferFromUserStatus.response) {
    while (true) {
      let output = `<div><b>Message sent to actor</b></div>
      <div>To: ${transferFromUserButton.actorId}</div>
      <div>Message CID: <a href="https://explorer.glif.io/message/?network=wallaby&cid=${transferFromUserStatus.response.CID['/']}">${transferFromUserStatus.response.CID['/']}</a></div>
      `
      if (transferFromUserStatus.waitResponse) {
        output += `<div>Message executed in block at height: ${transferFromUserStatus.waitResponse.Height}</div>`
        output += `<div>Gas used: ${transferFromUserStatus.waitResponse.Receipt.GasUsed}</div>`
        output += `<div>Return: ${transferFromUserStatus.waitResponse.Receipt.Return} (Base64 encoded binary array)</div>`
        output += `<div><b>Decoded Result (Hex):</b> <b style="font-size: 100%">${JSON.stringify(transferFromUserStatus.decodedResult.toString('hex'))}</b></div>`
        yield html`${output}`
        break
      }
      const elapsed = (Date.now() - transferFromUserStatus.waitStart) / 1000
      output += `<div>Waiting for message to be executed in a block... (${elapsed.toFixed(1)}s)</div>`
      yield html`${output}`
      await Promises.delay(1000)
    }
  }
}


function _88(md){return(
md`---`
)}

async function* _transferFromUserStatus(transferFromUserButton,getEvmAddress,transferFundsStatus,buffer,FilecoinNumber,keys,filecoin_client,waitMsg,$0)
{
  if (transferFromUserButton) {
    const start = Date.now()
    yield {
      invoking: true,
      start
    }
    const dest = getEvmAddress(transferFundsStatus.lookups[transferFromUserButton.dest.address])
    const amount = transferFromUserButton.amount.toString(16).padStart(64, '0')
    const params = buffer.Buffer.concat([
      buffer.Buffer.from('a9059cbb', 'hex'),
      buffer.Buffer.from(dest, 'hex'),
      buffer.Buffer.from(amount, 'hex')
    ])
    const message = {
      To: transferFromUserButton.actorId,
      From: transferFromUserButton.source.address,
      Nonce: 0,
      Value: "0",
      GasLimit: 1000000000,
      GasFeeCap: new FilecoinNumber(0, 'attofil'),
      GasPremium: new FilecoinNumber(0, 'attofil'),
      Method: 2,
      Params: params.toString('base64')
    }
    const privateKey = keys.find(({ address }) => address === transferFromUserButton.source.address).privateKey
    console.log('message', message)
    const responseCID = await filecoin_client.tx.sendMessage(
      message,
      privateKey,
      true, // updateMsgNonce
      false // waitMsg
    )
    const waitStart = Date.now()
    yield { waiting: true, waitStart, response: { CID: responseCID } }
    const waitResponse = await waitMsg(responseCID)
    let decodedResult
    if (waitResponse.Receipt && waitResponse.Receipt.Return) {
      decodedResult = buffer.Buffer.from(waitResponse.Receipt.Return, 'base64')
    }
    yield { invoked: true, response: { CID: responseCID }, waitResponse, decodedResult }
    $0.value = new Date()
  }
}


function _90(md){return(
md`# Final notes`
)}

function _91(md){return(
md`Thank you for trying out this demo.

If the backend is not working, please get in touch with me. Feel free to fork this notebook to customize your own actors and build scenarios using the on-demand localnet that supports this early version of actors / smart contracts.

I can also deploy custom instances of the localnet and the API for compiling actors ... feel free to contact me at @jimpick on the Filecoin Slack.`
)}

function _92(md){return(
md`## Imports`
)}

function _skypack(){return(
(library) => import(`https://cdn.skypack.dev/${library}?min`)
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

function _filecoinJsSigner(){return(
import('https://jspm.dev/@blitslabs/filecoin-js-signer')
)}

async function _filecoinJs(){return(
(await import('https://jspm.dev/filecoin.js')).default
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

function _ethers(){return(
import('https://cdn.skypack.dev/ethers@5.7.1?min')
)}

function _filecoinAddress(){return(
import('https://cdn.skypack.dev/@glif/filecoin-address')
)}

function _110(md){return(
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
"https://wallaby.node.glif.io"
)}

function _token(){return(
''
)}

function _filecoin_client(FilecoinClient,baseUrl,token){return(
new FilecoinClient(baseUrl, token)
)}

function _lotusApiClient(filecoinJs,baseUrl,token)
{
  const connector = new filecoinJs.HttpJsonRpcConnector({ url: baseUrl, token })
  return new filecoinJs.LotusClient(connector)
}


function _walletDefaultAddress(devFundsReady,devFundsKey){return(
devFundsReady && devFundsKey.address
)}

function _getEvmAddress(){return(
function getEvmAddress (address) {
  return '000000000000000000000000ff' + Number(address.slice(1)).toString(16).padStart(38, '0')
}
)}

function _waitMsg(lotusApiClient,Promises){return(
async function waitMsg (cid) {
  // console.log('Waiting for', cid)
  let waitResponse
  for (let i = 0; i < 36; i++) { // 36 attempts at 5s each
    waitResponse = await lotusApiClient.state.searchMsg(cid)
    if (!waitResponse) {
      // console.log('Sleeping 5s - ', cid['/'], i)
      await Promises.delay(5000)
      continue
    }
  }
  return waitResponse
}
)}

function _120(md){return(
md`## Backups`
)}

function _122(backups){return(
backups()
)}

function _123(backupNowButton){return(
backupNowButton()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["ERC20.bin", {url: new URL("./files/2aa607f0a34ff42eed6860893616da5b8d2a255af2899d5b8f0391c18b9912a5994354f7a65c3d1439809ab4ecded309de0654d7dc3fac8d10bd17140d642d0c.bin", import.meta.url), mimeType: "application/octet-stream", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["md","devFundsMnemonic"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer()).define(["md","devFundsKey","devFundsId","devFundsBalance"], _10);
  main.variable(observer()).define(["Inputs","mutable invalidatedDevFundsIdAt","mutable invalidatedDevFundsBalanceAt"], _11);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer()).define(["md","devFundsKey"], _13);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer("devFundsMnemonic")).define("devFundsMnemonic", ["localStorage","filecoin_signer"], _devFundsMnemonic);
  main.variable(observer("devFundsKey")).define("devFundsKey", ["filecoin_signer","devFundsMnemonic"], _devFundsKey);
  main.variable(observer("devFundsId")).define("devFundsId", ["invalidatedDevFundsIdAt","lotusApiClient","devFundsKey"], _devFundsId);
  main.define("initial invalidatedDevFundsIdAt", _invalidatedDevFundsIdAt);
  main.variable(observer("mutable invalidatedDevFundsIdAt")).define("mutable invalidatedDevFundsIdAt", ["Mutable", "initial invalidatedDevFundsIdAt"], (M, _) => new M(_));
  main.variable(observer("invalidatedDevFundsIdAt")).define("invalidatedDevFundsIdAt", ["mutable invalidatedDevFundsIdAt"], _ => _.generator);
  main.variable(observer("devFundsBalance")).define("devFundsBalance", ["invalidatedDevFundsBalanceAt","lotusApiClient","devFundsKey","FilecoinNumber"], _devFundsBalance);
  main.define("initial invalidatedDevFundsBalanceAt", _invalidatedDevFundsBalanceAt);
  main.variable(observer("mutable invalidatedDevFundsBalanceAt")).define("mutable invalidatedDevFundsBalanceAt", ["Mutable", "initial invalidatedDevFundsBalanceAt"], (M, _) => new M(_));
  main.variable(observer("invalidatedDevFundsBalanceAt")).define("invalidatedDevFundsBalanceAt", ["mutable invalidatedDevFundsBalanceAt"], _ => _.generator);
  main.variable(observer("devFundsReady")).define("devFundsReady", ["devFundsId"], _devFundsReady);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer()).define(["md"], _23);
  main.variable(observer()).define(["md","randomMnemonic"], _24);
  main.variable(observer()).define(["md"], _25);
  main.variable(observer("randomMnemonic")).define("randomMnemonic", ["filecoin_signer"], _randomMnemonic);
  main.variable(observer("keys")).define("keys", ["ethers","randomMnemonic","filecoinAddress"], _keys);
  main.variable(observer("clientAddresses")).define("clientAddresses", ["keys"], _clientAddresses);
  main.variable(observer("ownerKey")).define("ownerKey", ["keys"], _ownerKey);
  main.variable(observer()).define(["md"], _30);
  main.variable(observer()).define(["md"], _31);
  main.variable(observer()).define(["transferFundsStatus","md","Promises"], _32);
  main.variable(observer()).define(["md"], _33);
  main.variable(observer("transferFundsStatus")).define("transferFundsStatus", ["walletDefaultAddress","keys","devFundsKey","filecoin_client","waitMsg","devFundsId","lotusApiClient","mutable invalidatedDevFundsBalanceAt"], _transferFundsStatus);
  main.variable(observer()).define(["md"], _35);
  main.variable(observer()).define(["md"], _36);
  main.variable(observer()).define(["Inputs","initialBalances","keys","transferFundsStatus","FilecoinNumber"], _37);
  main.variable(observer()).define(["md"], _38);
  main.variable(observer("initialBalances")).define("initialBalances", ["transferFundsStatus","md","getBalances","clientAddresses"], _initialBalances);
  main.variable(observer("getBalances")).define("getBalances", ["lotusApiClient"], _getBalances);
  main.variable(observer()).define(["md"], _41);
  main.variable(observer("viewof constructorParamsForm")).define("viewof constructorParamsForm", ["Inputs"], _constructorParamsForm);
  main.variable(observer("constructorParamsForm")).define("constructorParamsForm", ["Generators", "viewof constructorParamsForm"], (G, _) => G.input(_));
  main.variable(observer()).define(["md","devFundsId"], _43);
  main.variable(observer()).define(["md"], _44);
  main.variable(observer()).define(["evmBytes","html","button","constructorParamsForm","md"], _45);
  main.variable(observer()).define(["md"], _46);
  main.variable(observer()).define(["md"], _47);
  main.variable(observer("contractBytes")).define("contractBytes", ["FileAttachment","buffer"], _contractBytes);
  main.variable(observer("abi")).define("abi", _abi);
  main.variable(observer("iface")).define("iface", ["ethers","abi"], _iface);
  main.variable(observer("deployBytes")).define("deployBytes", ["buffer","iface","constructorParamsForm","getEvmAddress","devFundsId"], _deployBytes);
  main.variable(observer("evmBytes")).define("evmBytes", ["buffer","contractBytes","deployBytes"], _evmBytes);
  main.variable(observer()).define(["md"], _53);
  main.variable(observer()).define(["md"], _54);
  main.variable(observer()).define(["md"], _55);
  main.variable(observer("viewof createActorButton")).define("viewof createActorButton", ["Inputs","devFundsReady"], _createActorButton);
  main.variable(observer("createActorButton")).define("createActorButton", ["Generators", "viewof createActorButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["createActorStatus","md","Promises","html"], _57);
  main.variable(observer()).define(["md"], _58);
  main.variable(observer("evmActorCid")).define("evmActorCid", ["multiformats"], _evmActorCid);
  main.variable(observer("evmBytesCbor")).define("evmBytesCbor", ["cbor","evmBytes"], _evmBytesCbor);
  main.variable(observer("createActorStatus")).define("createActorStatus", ["createActorButton","evmActorCid","cbor","evmBytesCbor","walletDefaultAddress","devFundsKey","filecoin_client","waitMsg","filecoinAddress"], _createActorStatus);
  main.variable(observer()).define(["md"], _62);
  main.variable(observer()).define(["md","devFundsId"], _63);
  main.variable(observer()).define(["md"], _64);
  main.variable(observer("viewof invokeEvmMethodButton")).define("viewof invokeEvmMethodButton", ["Inputs","devFundsId","createActorStatus"], _invokeEvmMethodButton);
  main.variable(observer("invokeEvmMethodButton")).define("invokeEvmMethodButton", ["Generators", "viewof invokeEvmMethodButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["invokeEvmMethodStatus","md","Promises","invokeEvmMethodButton","html"], _66);
  main.variable(observer()).define(["md"], _67);
  main.variable(observer("invokeEvmMethodStatus")).define("invokeEvmMethodStatus", ["invokeEvmMethodButton","buffer","getEvmAddress","devFundsId","walletDefaultAddress","devFundsKey","filecoin_client","waitMsg"], _invokeEvmMethodStatus);
  main.variable(observer()).define(["md","devFundsId"], _69);
  main.variable(observer()).define(["md"], _70);
  main.variable(observer("viewof transferFromOwnerForm")).define("viewof transferFromOwnerForm", ["keys","transferFundsStatus","Inputs"], _transferFromOwnerForm);
  main.variable(observer("transferFromOwnerForm")).define("transferFromOwnerForm", ["Generators", "viewof transferFromOwnerForm"], (G, _) => G.input(_));
  main.variable(observer("viewof transferFromOwnerButton")).define("viewof transferFromOwnerButton", ["Inputs","devFundsId","createActorStatus","transferFromOwnerForm"], _transferFromOwnerButton);
  main.variable(observer("transferFromOwnerButton")).define("transferFromOwnerButton", ["Generators", "viewof transferFromOwnerButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["transferFromOwnerStatus","md","Promises","transferFromOwnerButton","html"], _73);
  main.variable(observer()).define(["md"], _74);
  main.variable(observer("transferFromOwnerStatus")).define("transferFromOwnerStatus", ["transferFromOwnerButton","getEvmAddress","transferFundsStatus","buffer","walletDefaultAddress","devFundsKey","filecoin_client","waitMsg","mutable invalidatedBalancesAt"], _transferFromOwnerStatus);
  main.variable(observer()).define(["md"], _76);
  main.variable(observer()).define(["md"], _77);
  main.variable(observer()).define(["tokenBalancesStatus","md","Promises","transferFundsStatus","Inputs"], _78);
  main.variable(observer()).define(["Inputs","mutable invalidatedBalancesAt"], _79);
  main.variable(observer()).define(["md"], _80);
  main.variable(observer("tokenBalancesStatus")).define("tokenBalancesStatus", ["invalidatedBalancesAt","createActorStatus","walletDefaultAddress","keys","devFundsKey","transferFundsStatus","getEvmAddress","buffer","filecoin_client","waitMsg"], _tokenBalancesStatus);
  main.define("initial invalidatedBalancesAt", _invalidatedBalancesAt);
  main.variable(observer("mutable invalidatedBalancesAt")).define("mutable invalidatedBalancesAt", ["Mutable", "initial invalidatedBalancesAt"], (M, _) => new M(_));
  main.variable(observer("invalidatedBalancesAt")).define("invalidatedBalancesAt", ["mutable invalidatedBalancesAt"], _ => _.generator);
  main.variable(observer()).define(["md"], _83);
  main.variable(observer()).define(["md"], _84);
  main.variable(observer("viewof transferFromUserForm")).define("viewof transferFromUserForm", ["keys","transferFundsStatus","Inputs"], _transferFromUserForm);
  main.variable(observer("transferFromUserForm")).define("transferFromUserForm", ["Generators", "viewof transferFromUserForm"], (G, _) => G.input(_));
  main.variable(observer("viewof transferFromUserButton")).define("viewof transferFromUserButton", ["Inputs","createActorStatus","transferFromUserForm"], _transferFromUserButton);
  main.variable(observer("transferFromUserButton")).define("transferFromUserButton", ["Generators", "viewof transferFromUserButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["transferFromUserStatus","md","Promises","transferFromUserButton","html"], _87);
  main.variable(observer()).define(["md"], _88);
  main.variable(observer("transferFromUserStatus")).define("transferFromUserStatus", ["transferFromUserButton","getEvmAddress","transferFundsStatus","buffer","FilecoinNumber","keys","filecoin_client","waitMsg","mutable invalidatedBalancesAt"], _transferFromUserStatus);
  main.variable(observer()).define(["md"], _90);
  main.variable(observer()).define(["md"], _91);
  main.variable(observer()).define(["md"], _92);
  main.variable(observer("skypack")).define("skypack", _skypack);
  main.variable(observer("schema")).define("schema", _schema);
  main.variable(observer("stripAnsi")).define("stripAnsi", _stripAnsi);
  main.variable(observer("cbor")).define("cbor", _cbor);
  main.variable(observer("multiformats")).define("multiformats", _multiformats);
  const child1 = runtime.module(define1);
  main.import("button", child1);
  main.variable(observer("buffer")).define("buffer", ["require"], _buffer);
  main.variable(observer("filecoinJsSigner")).define("filecoinJsSigner", _filecoinJsSigner);
  main.variable(observer("filecoinJs")).define("filecoinJs", _filecoinJs);
  main.variable(observer("FilecoinClient")).define("FilecoinClient", ["filecoinJsSigner"], _FilecoinClient);
  main.variable(observer("FilecoinSigner")).define("FilecoinSigner", ["filecoinJsSigner"], _FilecoinSigner);
  main.variable(observer("filecoin_signer")).define("filecoin_signer", ["FilecoinSigner"], _filecoin_signer);
  main.variable(observer("filecoinNumber")).define("filecoinNumber", _filecoinNumber);
  main.variable(observer("FilecoinNumber")).define("FilecoinNumber", ["filecoinNumber"], _FilecoinNumber);
  main.variable(observer("ethers")).define("ethers", _ethers);
  const child2 = runtime.module(define2);
  main.import("localStorage", child2);
  main.variable(observer("filecoinAddress")).define("filecoinAddress", _filecoinAddress);
  main.variable(observer()).define(["md"], _110);
  main.variable(observer("simpleCoinSol")).define("simpleCoinSol", _simpleCoinSol);
  main.variable(observer("initialCodeUrl")).define("initialCodeUrl", _initialCodeUrl);
  main.variable(observer("baseUrl")).define("baseUrl", _baseUrl);
  main.variable(observer("token")).define("token", _token);
  main.variable(observer("filecoin_client")).define("filecoin_client", ["FilecoinClient","baseUrl","token"], _filecoin_client);
  main.variable(observer("lotusApiClient")).define("lotusApiClient", ["filecoinJs","baseUrl","token"], _lotusApiClient);
  main.variable(observer("walletDefaultAddress")).define("walletDefaultAddress", ["devFundsReady","devFundsKey"], _walletDefaultAddress);
  main.variable(observer("getEvmAddress")).define("getEvmAddress", _getEvmAddress);
  main.variable(observer("waitMsg")).define("waitMsg", ["lotusApiClient","Promises"], _waitMsg);
  main.variable(observer()).define(["md"], _120);
  const child3 = runtime.module(define3);
  main.import("backups", child3);
  main.import("backupNowButton", child3);
  main.variable(observer()).define(["backups"], _122);
  main.variable(observer()).define(["backupNowButton"], _123);
  return main;
}
