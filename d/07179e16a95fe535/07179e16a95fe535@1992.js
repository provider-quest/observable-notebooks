import define1 from "./9a34a4df6e8a276b@50.js";
import define2 from "./c4e4a355c53d2a1a@112.js";

function _1(md){return(
md`# FVM Actor Code Playground - Storage Client Contract`
)}

function _2(md){return(
md`Here is an smart contract that can act as a Filecoin client for making deals:

* https://github.com/lotus-web3/client-contract
* https://www.youtube.com/watch?v=gvMOBPan4lY
* https://www.youtube.com/watch?v=2Cpahhb0IW0

You can modify it here, then scroll down and click the buttons to compile it, then load it into a on-demand hosted [Lotus localnet](https://lotus.filecoin.io/developers/local-network/) created from the [experimental/fvm-m2](https://github.com/filecoin-project/lotus/tree/experimental/fvm-m2) branch, and invoke methods against it.

**Note:** The on-demand localnet will be reclaimed after 3 minutes of inactivity. Modifications to the blockchain state are ephemeral -- good for testing! Staying on this page will keep it alive, but if you navigate away and then return, it may get restarted with fresh state. If that happens, reload the web page. There is one instance of the localnet shared between all users.`
)}

function _3(md){return(
md`This notebook is currently using a mix of Lotus JSON-RPC APIs + (mostly) Ethereum JSON-RPC APIs.`
)}

function _4(md){return(
md`## Generate Client Side Addresses`
)}

function _5(md){return(
md`We use \`filecoin-js-signer\` to generate a random mnemomic phrase. You could save this phrase and re-use it to generate the secrets. In this notebook, we just use different secrets on each page reload.`
)}

function _randomMnemonic(filecoin_signer)
{
  // return 'cycle raccoon pool vintage unusual note twelve morning program glare salon survey'
  // https://github.com/blitslabs/filecoin-js-signer#filecoin-signer
  const strength = 128 // 128 => 12 words | 256 => 24 words
  return filecoin_signer.wallet.generateMnemonic(strength)
}


function _7(md){return(
md`---`
)}

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

function _11(md){return(
md`## Wait for Lotus to be ready, then transfer 100 FIL to each address`
)}

function _12(md){return(
md`Be patient as it takes a little while for the funds to be sent via the Ethereum JSON-RPC API when the notebook is first loaded.`
)}

async function* _13(transferFundsStatus,md,Promises)
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
        To: key.delegated.toString(),
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
    const lookups = {
      [walletDefaultAddress]: 't0100'
    }
    for (const key of keys) {
      lookups[key.delegated.toString()] = await client.stateLookupID(key.delegated.toString(), [])
    }
    yield { transferred: true, responses, waitResponses, lookups }
  }
}


function _15(md){return(
md`## Initial Balances`
)}

function _16(md){return(
md`Here are the addresses and IDs of the 4 clients we created, as well at their initial balances (should be 100 FIL each).`
)}

function _initialBalances(transferFundsStatus,md,getBalances,clientAddresses){return(
!transferFundsStatus ? md`Waiting...` : transferFundsStatus.transferred && getBalances(clientAddresses)
)}

function _18(Inputs,initialBalances,keys,transferFundsStatus,FilecoinNumber){return(
Inputs.table(
  initialBalances ? initialBalances.map(({ address, balance }) => ({
    name: keys.find(({ delegated }) => address === delegated.toString()).name, 
    id: transferFundsStatus.lookups[address],
    address,
    eth_address: keys.find(({ delegated }) => address === delegated.toString()).address,
    balance
  })) : [],
  {
    width: {
      name: 60,
      id: 60,
      address: 300,
      eth_address: 340,
      balance: 100
    },
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

function _ownerId(transferFundsStatus,keys){return(
transferFundsStatus?.lookups && transferFundsStatus.lookups[keys[0].delegated.toString()]
)}

function _21(md){return(
md`## Step 1: Connect to Hosted "localnet"

This notebook connects to a [hosted instance](https://github.com/jimpick/lotus-fvm-localnet-web) of a Lotus "localnet" (started on demand) into which you can install the actor code, create an actor instance, and invoke methods against.

If the localnet is started and online, the following chain height should be increasing every 4-10 seconds (depending on system load):`
)}

function _22(md,currentHeight){return(
md`**Height: ${currentHeight}**`
)}

function _23(md){return(
md`If the connection is working, then proceed to the next step.`
)}

function _24(md){return(
md`## Step 2: Create EVM smart contracts`
)}

function _25(md){return(
md`Now we can create an actor instances from the compiled EVM smart contracts.`
)}

function _26(htl){return(
htl.html`This code uses the Ethers.js library to format and sign the messages to send to the JSON-RPC API.`
)}

function _createActorButton(Inputs,ready,client,ownerKey){return(
Inputs.button(
  'Create EVM Smart Contracts',
  {
    disabled: !ready,
    value: null,
    reduce: async () => ({
      nonce: await client.mpoolGetNonce(ownerKey.delegated.toString())
    })
  }
)
)}

async function* _28(createMockMarketContractStatus,md,Promises,html,createDealClientContractStatus)
{
  if (createMockMarketContractStatus === undefined || !createMockMarketContractStatus) {
    yield md`Status: Contracts have not been created yet.`
    return
  }

  // Mock Market Contract
  
  if (createMockMarketContractStatus.creating) {
    while (true) {
      const elapsed = (Date.now() - createMockMarketContractStatus.start) / 1000
      yield md`Sending create "Mock Market" contract transaction... (${elapsed.toFixed(1)}s)`
      await Promises.delay(1000)
    }
  }
  let output = ''
  if (createMockMarketContractStatus.response) {
    while (true) {
      output = `<div><b>Create "Mock Market" contract transaction sent</b></div>
      <div>Txn Hash: ${createMockMarketContractStatus.response}</div>
      `
      if (createMockMarketContractStatus.waitResponse) {
        output += `<div>Transaction executed in block at height: ${Number.parseInt(createMockMarketContractStatus.waitResponse.blockNumber.slice(2), 16)}</div>`
        output += `<div>Gas used: ${Number.parseInt(createMockMarketContractStatus.waitResponse.gasUsed.slice(2), 16)}</div>`
        output += `<div>Contract address (Eth): ${createMockMarketContractStatus.waitResponse.contractAddress}</div>`
        output += `<div>Contract address (t4): ${createMockMarketContractStatus.waitResponse.delegated.toString()}</div>`
        output += `<b><div>ID Address: ${createMockMarketContractStatus.waitResponse.actorId}</div></b>`
        yield html`${output}`
        break
      }
      const elapsed = (Date.now() - createMockMarketContractStatus.waitStart) / 1000
      output += `<div>Waiting for transaction to be executed in a block... (${elapsed.toFixed(1)}s)</div>`
      yield html`${output}`
      await Promises.delay(1000)
    }
  }

  // Deal Client Contract

  let output2 = ''
  while (true) {
    if (createDealClientContractStatus.creating) {
      const elapsed = (Date.now() - createDealClientContractStatus.start) / 1000
      output2 = `Sending create "Deal Client" contract transaction... (${elapsed.toFixed(1)}s)`
      yield md`${output}\n\n${output2}`
    }
    if (createDealClientContractStatus.response) break
    await Promises.delay(1000)
  }
  if (createDealClientContractStatus.response) {
    while (true) {
      output2 = `<div><b>Create "Deal Client" contract transaction sent</b></div>
      <div>Txn Hash: ${createDealClientContractStatus.response}</div>
      `
      if (createDealClientContractStatus.waitResponse) {
        output2 += `<div>Transaction executed in block at height: ${Number.parseInt(createDealClientContractStatus.waitResponse.blockNumber.slice(2), 16)}</div>`
        output2 += `<div>Gas used: ${Number.parseInt(createDealClientContractStatus.waitResponse.gasUsed.slice(2), 16)}</div>`
        output2 += `<div>Contract address (Eth): ${createDealClientContractStatus.waitResponse.contractAddress}</div>`
        output2 += `<div>Contract address (t4): ${createDealClientContractStatus.waitResponse.delegated.toString()}</div>`
        output2 += `<b><div>ID Address: ${createDealClientContractStatus.waitResponse.actorId}</div></b>`
       yield md`${output}\n\n${output2}`
        break
      }
      const elapsed = (Date.now() - createDealClientContractStatus.waitStart) / 1000
      output2 += `<div>Waiting for transaction to be executed in a block... (${elapsed.toFixed(1)}s)</div>`
      yield md`${output}\n\n${output2}`
      await Promises.delay(1000)
    }
  }
}


function _29(md){return(
md`---`
)}

function _provider(ethers,baseUrl,token){return(
new ethers.providers.JsonRpcProvider(`${baseUrl}/rpc/v0?token=${token}`)
)}

function _deployer(ethers,ownerKey,provider){return(
new ethers.Wallet(ownerKey.privateKey, provider)
)}

async function _mockMarketContractBytes(FileAttachment,buffer)
{
  const hex = (await (await FileAttachment("MockMarket.bin")).text()).slice(2)
  return buffer.Buffer.from(hex, 'hex')
}


async function _mockMarketAbi(FileAttachment){return(
(await FileAttachment("MockMarket.abi")).json()
)}

function _mockMarketIface(ethers,mockMarketAbi){return(
new ethers.utils.Interface(mockMarketAbi)
)}

function _mockMarketFactory(ethers,mockMarketIface,mockMarketContractBytes,deployer){return(
new ethers.ContractFactory(mockMarketIface, mockMarketContractBytes, deployer)
)}

async function* _createMockMarketContractStatus(createActorButton,client,mockMarketFactory,deployer,provider,waitEthTx,filecoinAddress)
{
  if (createActorButton) {
    console.log('Create actor', createActorButton)
    const start = Date.now()
    yield {
      creating: true,
      start
    }
    const priorityFee = await client.callEthMethod('maxPriorityFeePerGas')
    const unsignedTx = await mockMarketFactory.getDeployTransaction()
    const populatedTx = await deployer.populateTransaction(unsignedTx)
    const signedTx = await deployer.signTransaction(populatedTx)
    console.log('Create Mock Market Transaction:', provider.formatter.transaction(signedTx))
    const response = await client.callEthMethod('sendRawTransaction', [signedTx])
    const waitStart = Date.now()
    yield { waiting: true, waitStart, response }
    const waitResponse = await waitEthTx(response)
    if (waitResponse?.contractAddress) {
      waitResponse.delegated = filecoinAddress.newDelegatedEthAddress(waitResponse.contractAddress, 't')
      waitResponse.actorId = await client.stateLookupID(waitResponse.delegated.toString(), [])
    }
    yield { installed: true, response, waitResponse }
  }
}


function _mockMarketContract(createMockMarketContractStatus,mockMarketFactory){return(
createMockMarketContractStatus?.waitResponse?.contractAddress && mockMarketFactory.attach(createMockMarketContractStatus.waitResponse.contractAddress)
)}

async function _dealClientContractBytes(FileAttachment,buffer)
{
  const hex = (await (await FileAttachment("DealClient.bin")).text()).slice(2)
  return buffer.Buffer.from(hex, 'hex')
}


async function _dealClientAbi(FileAttachment){return(
(await FileAttachment("DealClient.abi")).json()
)}

function _dealClientIface(ethers,dealClientAbi){return(
new ethers.utils.Interface(dealClientAbi)
)}

function _dealClientFactory(ethers,dealClientIface,dealClientContractBytes,deployer){return(
new ethers.ContractFactory(dealClientIface,dealClientContractBytes, deployer)
)}

async function* _createDealClientContractStatus(createMockMarketContractStatus,client,dealClientFactory,deployer,provider,waitEthTx,filecoinAddress)
{
  if (createMockMarketContractStatus?.installed) {
    console.log('Create deal client contract')
    const start = Date.now()
    yield {
      creating: true,
      start
    }
    const priorityFee = await client.callEthMethod('maxPriorityFeePerGas')
    const unsignedTx = await dealClientFactory.getDeployTransaction()
    const populatedTx = await deployer.populateTransaction(unsignedTx)
    const signedTx = await deployer.signTransaction(populatedTx)
    console.log('Create Deal Client Transaction:', provider.formatter.transaction(signedTx))
    const response = await client.callEthMethod('sendRawTransaction', [signedTx])
    const waitStart = Date.now()
    yield { waiting: true, waitStart, response }
    const waitResponse = await waitEthTx(response)
    if (waitResponse?.contractAddress) {
      waitResponse.delegated = filecoinAddress.newDelegatedEthAddress(waitResponse.contractAddress, 't')
      waitResponse.actorId = await client.stateLookupID(waitResponse.delegated.toString(), [])
    }
    yield { installed: true, response, waitResponse }
  }
}


function _43(md,ownerId){return(
md`## Step 4: Invoke a method to get the ERC20 token balance for the owner address (${ownerId})`
)}

function _44(md){return(
md`Now that we've got an actor running with an ID Address, we can call the methods we have defined. Let's check the balance of the addresses. The method signature (from above) to get the balance is => \`70a08231: balanceOf(address)\``
)}

function _45(md,createActorStatus,ownerKey){return(
md`From the Lotus command line, we could call the method like this:

\`./lotus chain invoke-evm-actor ${createActorStatus.waitResponse.actorId} 70a08231 000000000000000000000000000000000000000000000000${ownerKey.address.slice(2)}\``
)}

function _46(md){return(
md`But we can use Ethers.js to make a JSON-RPC call to get the value from the state immediately.`
)}

function _invokeEvmMethodButton(Inputs,ownerId,createActorStatus,contract,keys){return(
Inputs.button(`Get ERC20 Token Balance for Owner (${ownerId})`, {
  disabled: !createActorStatus ||
    !createActorStatus.waitResponse ||
    !createActorStatus.waitResponse.actorId,
  value: null,
  reduce: async () => (await contract.balanceOf(keys[0].address)).toString()
})
)}

function _48(invokeEvmMethodButton,md){return(
invokeEvmMethodButton ? md`Balance: ${invokeEvmMethodButton}` : md``
)}

function _49(md,ownerId){return(
md`## Step 5: Invoke a method to transfer ERC20 tokens from the owner address (${ownerId}) to a user address`
)}

function _50(md){return(
md`The method signature is => \`a9059cbb: transfer(address,uint256)\``
)}

function _transferFromOwnerForm(keys,transferFundsStatus,Inputs){return(
keys && transferFundsStatus && Inputs.form([
  Inputs.select(keys.slice(1), { label: "Transfer from Owner to User", format: x => `${x.name} (${transferFundsStatus.lookups[x.delegated.toString()]})` }),
  Inputs.range([1, 1000000], {value: 1, step: 1, label: 'ERC20 Tokens to Transfer'})
])
)}

function _transferFromOwnerButton(Inputs,ownerId,createActorStatus,transferFromOwnerForm){return(
Inputs.button(`Transfer From Owner (${ownerId})`, {
  disabled: !createActorStatus ||
    !createActorStatus.waitResponse ||
    !createActorStatus.waitResponse.actorId,
  value: null,
  reduce: () => ({
    actorId: createActorStatus.waitResponse.actorId,
    dest: transferFromOwnerForm[0],
    amount: transferFromOwnerForm[1]
  })
})
)}

async function* _53(transferFromOwnerStatus,md,Promises,createActorStatus,html)
{
  if (transferFromOwnerStatus === undefined || !transferFromOwnerStatus) {
    yield md`Status: Method has not been invoked yet.`
    return
  }
  if (transferFromOwnerStatus.invoking) {
    while (true) {
      const elapsed = (Date.now() - transferFromOwnerStatus.start) / 1000
      yield md`Sending transaction for method... (${elapsed.toFixed(1)}s)`
      await Promises.delay(1000)
    }
  }
  if (transferFromOwnerStatus.response) {
    while (true) {
      let output = `<div><b>Transaction sent</b></div>
      <div>Txn Hash: ${createActorStatus.response}</div>
      `
      if (transferFromOwnerStatus.waitResponse) {
        output += `<div>Transaction executed in block at height: ${Number.parseInt(transferFromOwnerStatus.waitResponse.blockNumber.slice(2), 16)}</div>`
        output += `<div>Gas used: ${Number.parseInt(transferFromOwnerStatus.waitResponse.gasUsed.slice(2), 16)}</div>`
        output += `<div>Status: ${transferFromOwnerStatus.waitResponse.status}</div>`
        yield html`${output}`
        break
      }

      const elapsed = (Date.now() - transferFromOwnerStatus.waitStart) / 1000
      output += `<div>Waiting for transaction to be executed in a block... (${elapsed.toFixed(1)}s)</div>`
      yield html`${output}`
      await Promises.delay(1000)
    }
  }
}


function _54(md){return(
md`---`
)}

async function* _transferFromOwnerStatus(transferFromOwnerButton,contract,deployer,provider,client,waitEthTx,$0)
{
  if (transferFromOwnerButton) {
    const start = Date.now()
    yield { invoking: true, start }
    const dest = transferFromOwnerButton.dest.address
    const amount = transferFromOwnerButton.amount
    const unsignedTx = await contract.populateTransaction.transfer(dest, amount)
    const populatedTx = await deployer.populateTransaction(unsignedTx)
    const signedTx = await deployer.signTransaction(populatedTx)
    console.log('Transfer From Owner Transaction:', provider.formatter.transaction(signedTx))
    const response = await client.callEthMethod('sendRawTransaction', [signedTx])
    const waitStart = Date.now()
    yield { waiting: true, waitStart, response }
    const waitResponse = await waitEthTx(response)
    yield { invoked: true, response, waitResponse }
    $0.value = new Date()
  }
}


function _56(md){return(
md`## Step 6: Retrieve the ERC20 token balances for all the addresses`
)}

function _57(md){return(
md`This is the same as Step 4, where we got the token balance for a single account. But here we retrieve all the account token balances in parallel to make it easier to observe what's going on.`
)}

function _58(tokenBalances,md,Inputs,keys,transferFundsStatus)
{
  if (!tokenBalances) {
    return md``
  } else {
    return Inputs.table(
      tokenBalances.map((balance, i) => {
        return {
          name: keys[i].name,
          id: transferFundsStatus.lookups[keys[i].delegated.toString()], 
          balance
        }
      }),
      {
        format: {
        }
      }
    )
  }
}


function _59(Inputs,$0){return(
Inputs.button("Update", { value: null, reduce: () => { $0.value = new Date() } })
)}

function _60(md){return(
md`---`
)}

async function _tokenBalances(invalidatedBalancesAt,createActorStatus,keys,contract)
{
  invalidatedBalancesAt;
  const evmActorId = createActorStatus?.waitResponse?.actorId
  if (keys && evmActorId) {
    const responses = []
    for (const key of keys) {
      responses.push((await contract.balanceOf(key.address)).toBigInt())
    }
    return await Promise.all(responses)
  }
}


function _invalidatedBalancesAt(){return(
new Date()
)}

function _63(md){return(
md`## Step 7: Transfer ERC20 tokens from user to user`
)}

function _64(md){return(
md`This is almost the same as Step 5, where we transferred from the owner (the genesis address on the Lotus node). But this time we will use secrets on the client side (in the browser) and sign the message from a non-owner address.`
)}

function _transferFromUserForm(keys,transferFundsStatus,Inputs){return(
keys && transferFundsStatus && Inputs.form([
  Inputs.select(keys.slice(1), { label: "Transfer from User", format: x => `${x.name} (${transferFundsStatus.lookups[x.delegated.toString()]})` }),
  Inputs.select(keys.slice(1), {
    label: "Transfer to User",
    format: x => `${x.name} (${transferFundsStatus.lookups[x.delegated.toString()]})`,
    value: keys[1]
  }),
  Inputs.range([1, 1000000], {value: 1, step: 1, label: 'ERC20 Tokens to Transfer'})
])
)}

function _transferFromUserButton(Inputs,createActorStatus,transferFromUserForm){return(
Inputs.button('Transfer From User to User', {
  disabled: !createActorStatus ||
    !createActorStatus.waitResponse ||
    !createActorStatus.waitResponse.actorId ||
    transferFromUserForm[0] === transferFromUserForm[1],
  value: null,
  reduce: () => ({
    actorId: createActorStatus.waitResponse.actorId,
    source: transferFromUserForm[0],
    dest: transferFromUserForm[1],
    amount: transferFromUserForm[2]
  })
})
)}

async function* _67(transferFromUserStatus,md,Promises,createActorStatus,html)
{
  if (transferFromUserStatus === undefined || !transferFromUserStatus) {
    yield md`Status: Method has not been invoked yet.`
    return
  }
  if (transferFromUserStatus.invoking) {
    while (true) {
      const elapsed = (Date.now() - transferFromUserStatus.start) / 1000
      yield md`Sending transaction for method... (${elapsed.toFixed(1)}s)`
      await Promises.delay(1000)
    }
  }
  if (transferFromUserStatus.response) {
    while (true) {
      let output = `<div><b>Transaction sent</b></div>
      <div>Txn Hash: ${createActorStatus.response}</div>
      `
      if (transferFromUserStatus.waitResponse) {
        output += `<div>Transaction executed in block at height: ${Number.parseInt(transferFromUserStatus.waitResponse.blockNumber.slice(2), 16)}</div>`
        output += `<div>Gas used: ${Number.parseInt(transferFromUserStatus.waitResponse.gasUsed.slice(2), 16)}</div>`
        output += `<div>Status: ${transferFromUserStatus.waitResponse.status}</div>`
        yield html`${output}`
        break
      }

      const elapsed = (Date.now() - transferFromUserStatus.waitStart) / 1000
      output += `<div>Waiting for transaction to be executed in a block... (${elapsed.toFixed(1)}s)</div>`
      yield html`${output}`
      await Promises.delay(1000)
    }
  }
}


function _68(md){return(
md`---`
)}

async function* _transferFromUserStatus(transferFromUserButton,ethers,provider,iface,contractBytes,createActorStatus,client,waitEthTx,$0)
{
  if (transferFromUserButton) {
    const start = Date.now()
    yield { invoking: true, start }
    const source = transferFromUserButton.source
    const dest = transferFromUserButton.dest.address
    const amount = transferFromUserButton.amount
    const signer = new ethers.Wallet(source.privateKey, provider)
    const factory = new ethers.ContractFactory(iface, contractBytes, signer)
    const contract = factory.attach(createActorStatus.waitResponse.contractAddress)
    const unsignedTx = await contract.populateTransaction.transfer(dest, amount)
    const populatedTx = await signer.populateTransaction(unsignedTx)
    const signedTx = await signer.signTransaction(populatedTx)
    console.log('Transfer From User Transaction:', provider.formatter.transaction(signedTx))
    const response = await client.callEthMethod('sendRawTransaction', [signedTx])
    const waitStart = Date.now()
    yield { waiting: true, waitStart, response }
    const waitResponse = await waitEthTx(response)
    yield { invoked: true, response, waitResponse }
    $0.value = new Date()
  }
}


function _70(md){return(
md`# Final notes`
)}

function _71(md){return(
md`Thank you for trying out this demo.

If the backend is not working, please get in touch with me. Feel free to fork this notebook to customize your own actors and build scenarios using the on-demand localnet that supports this early version of actors / smart contracts.

I can also deploy custom instances of the localnet and the API for compiling actors ... feel free to contact me at @jimpick on the Filecoin Slack.`
)}

function _72(md){return(
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

function _91(md){return(
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
"https://jimpick-fvm-sapphire-patch-1.quick.cluster-3.localnet.farm"
)}

async function _token(baseUrl){return(
(await fetch(`${baseUrl}/token`)).text()
)}

function _client(BrowserProvider,baseUrl,token,LotusRPC,schema)
{
  const provider = new BrowserProvider(`${baseUrl}/rpc/v0`, { token })
  // Monkey-patch in a method to call eth_* JSON-RPC methods
  LotusRPC.prototype.callEthMethod = async function (method, args) {
    await this.provider.connect()
    const request = {
      method: `eth_${method}`
    }
    request.params = args
    return this.provider.send(request, {})
  }
  return new LotusRPC(provider, { schema })
}


function _filecoin_client(FilecoinClient,baseUrl,token){return(
new FilecoinClient(`${baseUrl}/rpc/v0`, token)
)}

function _lotusApiClient(filecoinJs,baseUrl,token)
{
  const connector = new filecoinJs.HttpJsonRpcConnector({ url: baseUrl, token })
  return new filecoinJs.LotusClient(connector)
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

function _getEvmAddress(){return(
function getEvmAddress (address) {
  return '000000000000000000000000ff' + Number(address.slice(1)).toString(16).padStart(38, '0')
}
)}

function _waitMsg(client){return(
async function waitMsg (cid) {
  return await client.stateWaitMsg(cid, 0)
}
)}

function _waitEthTx(client,Promises){return(
async function waitEthTx (txId) {
  console.log('Waiting for', txId)
  let waitResponse
  for (let i = 0; i < 36; i++) { // 36 attempts at 5s each
    try {
      waitResponse = await client.callEthMethod('getTransactionReceipt', [txId])
    } catch (e) {
      if (e.message !== 'msg does not exist') {
        console.log('Get transaction error', txId, e)
        throw (e)
      }
    }
    if (!waitResponse) {
      console.log('Sleeping 5s - ', txId, i)
      await Promises.delay(5000)
      continue
    }
  }
  return waitResponse
}
)}

function _107(md){return(
md`## Backups`
)}

function _109(backups){return(
backups()
)}

function _110(backupNowButton){return(
backupNowButton()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["DealClient.abi", {url: new URL("./files/aac7d47005a2abd4d9aebd51871e6f2ab8b9adf7d00f940d0612f9384f92aa82e1a34d210a35d05f5c53cd0fa3bc3506fe758bf91ef243615f6599c1efe915e9.bin", import.meta.url), mimeType: "application/octet-stream", toString}],
    ["DealClient.bin", {url: new URL("./files/f2798bcc7dd54993d07751f34ca7cb149f4b9358f15a7055e1c87333954032124b7bbae40e240828cc589829912e7f9c2a722bb1b4b9e1e533091c435af3bc1c.bin", import.meta.url), mimeType: "application/octet-stream", toString}],
    ["MockMarket.abi", {url: new URL("./files/c254d8693d9ad3f0e2b232b6ce59f5070291ce0bfd5bb665ae1ef301c86c6767caae12c11a7e57a9cfec6c4065cb597ae7a42a6cc973d1676cd17a8d754a000e.bin", import.meta.url), mimeType: "application/octet-stream", toString}],
    ["MockMarket.bin", {url: new URL("./files/f9772299c75c0eec8c1d0c845878056d9750e5f246c37e1452221c817b2665ee55cc38da54e0cc3452db16333ab670079d1f03e64e8729f3e11c7c97e6c74972.bin", import.meta.url), mimeType: "application/octet-stream", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("randomMnemonic")).define("randomMnemonic", ["filecoin_signer"], _randomMnemonic);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer("keys")).define("keys", ["ethers","randomMnemonic","filecoinAddress"], _keys);
  main.variable(observer("clientAddresses")).define("clientAddresses", ["keys"], _clientAddresses);
  main.variable(observer("ownerKey")).define("ownerKey", ["keys"], _ownerKey);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer()).define(["transferFundsStatus","md","Promises"], _13);
  main.variable(observer("transferFundsStatus")).define("transferFundsStatus", ["walletDefaultAddress","keys","client"], _transferFundsStatus);
  main.variable(observer()).define(["md"], _15);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer("initialBalances")).define("initialBalances", ["transferFundsStatus","md","getBalances","clientAddresses"], _initialBalances);
  main.variable(observer()).define(["Inputs","initialBalances","keys","transferFundsStatus","FilecoinNumber"], _18);
  main.variable(observer("getBalances")).define("getBalances", ["client"], _getBalances);
  main.variable(observer("ownerId")).define("ownerId", ["transferFundsStatus","keys"], _ownerId);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer()).define(["md","currentHeight"], _22);
  main.variable(observer()).define(["md"], _23);
  main.variable(observer()).define(["md"], _24);
  main.variable(observer()).define(["md"], _25);
  main.variable(observer()).define(["htl"], _26);
  main.variable(observer("viewof createActorButton")).define("viewof createActorButton", ["Inputs","ready","client","ownerKey"], _createActorButton);
  main.variable(observer("createActorButton")).define("createActorButton", ["Generators", "viewof createActorButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["createMockMarketContractStatus","md","Promises","html","createDealClientContractStatus"], _28);
  main.variable(observer()).define(["md"], _29);
  main.variable(observer("provider")).define("provider", ["ethers","baseUrl","token"], _provider);
  main.variable(observer("deployer")).define("deployer", ["ethers","ownerKey","provider"], _deployer);
  main.variable(observer("mockMarketContractBytes")).define("mockMarketContractBytes", ["FileAttachment","buffer"], _mockMarketContractBytes);
  main.variable(observer("mockMarketAbi")).define("mockMarketAbi", ["FileAttachment"], _mockMarketAbi);
  main.variable(observer("mockMarketIface")).define("mockMarketIface", ["ethers","mockMarketAbi"], _mockMarketIface);
  main.variable(observer("mockMarketFactory")).define("mockMarketFactory", ["ethers","mockMarketIface","mockMarketContractBytes","deployer"], _mockMarketFactory);
  main.variable(observer("createMockMarketContractStatus")).define("createMockMarketContractStatus", ["createActorButton","client","mockMarketFactory","deployer","provider","waitEthTx","filecoinAddress"], _createMockMarketContractStatus);
  main.variable(observer("mockMarketContract")).define("mockMarketContract", ["createMockMarketContractStatus","mockMarketFactory"], _mockMarketContract);
  main.variable(observer("dealClientContractBytes")).define("dealClientContractBytes", ["FileAttachment","buffer"], _dealClientContractBytes);
  main.variable(observer("dealClientAbi")).define("dealClientAbi", ["FileAttachment"], _dealClientAbi);
  main.variable(observer("dealClientIface")).define("dealClientIface", ["ethers","dealClientAbi"], _dealClientIface);
  main.variable(observer("dealClientFactory")).define("dealClientFactory", ["ethers","dealClientIface","dealClientContractBytes","deployer"], _dealClientFactory);
  main.variable(observer("createDealClientContractStatus")).define("createDealClientContractStatus", ["createMockMarketContractStatus","client","dealClientFactory","deployer","provider","waitEthTx","filecoinAddress"], _createDealClientContractStatus);
  main.variable(observer()).define(["md","ownerId"], _43);
  main.variable(observer()).define(["md"], _44);
  main.variable(observer()).define(["md","createActorStatus","ownerKey"], _45);
  main.variable(observer()).define(["md"], _46);
  main.variable(observer("viewof invokeEvmMethodButton")).define("viewof invokeEvmMethodButton", ["Inputs","ownerId","createActorStatus","contract","keys"], _invokeEvmMethodButton);
  main.variable(observer("invokeEvmMethodButton")).define("invokeEvmMethodButton", ["Generators", "viewof invokeEvmMethodButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["invokeEvmMethodButton","md"], _48);
  main.variable(observer()).define(["md","ownerId"], _49);
  main.variable(observer()).define(["md"], _50);
  main.variable(observer("viewof transferFromOwnerForm")).define("viewof transferFromOwnerForm", ["keys","transferFundsStatus","Inputs"], _transferFromOwnerForm);
  main.variable(observer("transferFromOwnerForm")).define("transferFromOwnerForm", ["Generators", "viewof transferFromOwnerForm"], (G, _) => G.input(_));
  main.variable(observer("viewof transferFromOwnerButton")).define("viewof transferFromOwnerButton", ["Inputs","ownerId","createActorStatus","transferFromOwnerForm"], _transferFromOwnerButton);
  main.variable(observer("transferFromOwnerButton")).define("transferFromOwnerButton", ["Generators", "viewof transferFromOwnerButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["transferFromOwnerStatus","md","Promises","createActorStatus","html"], _53);
  main.variable(observer()).define(["md"], _54);
  main.variable(observer("transferFromOwnerStatus")).define("transferFromOwnerStatus", ["transferFromOwnerButton","contract","deployer","provider","client","waitEthTx","mutable invalidatedBalancesAt"], _transferFromOwnerStatus);
  main.variable(observer()).define(["md"], _56);
  main.variable(observer()).define(["md"], _57);
  main.variable(observer()).define(["tokenBalances","md","Inputs","keys","transferFundsStatus"], _58);
  main.variable(observer()).define(["Inputs","mutable invalidatedBalancesAt"], _59);
  main.variable(observer()).define(["md"], _60);
  main.variable(observer("tokenBalances")).define("tokenBalances", ["invalidatedBalancesAt","createActorStatus","keys","contract"], _tokenBalances);
  main.define("initial invalidatedBalancesAt", _invalidatedBalancesAt);
  main.variable(observer("mutable invalidatedBalancesAt")).define("mutable invalidatedBalancesAt", ["Mutable", "initial invalidatedBalancesAt"], (M, _) => new M(_));
  main.variable(observer("invalidatedBalancesAt")).define("invalidatedBalancesAt", ["mutable invalidatedBalancesAt"], _ => _.generator);
  main.variable(observer()).define(["md"], _63);
  main.variable(observer()).define(["md"], _64);
  main.variable(observer("viewof transferFromUserForm")).define("viewof transferFromUserForm", ["keys","transferFundsStatus","Inputs"], _transferFromUserForm);
  main.variable(observer("transferFromUserForm")).define("transferFromUserForm", ["Generators", "viewof transferFromUserForm"], (G, _) => G.input(_));
  main.variable(observer("viewof transferFromUserButton")).define("viewof transferFromUserButton", ["Inputs","createActorStatus","transferFromUserForm"], _transferFromUserButton);
  main.variable(observer("transferFromUserButton")).define("transferFromUserButton", ["Generators", "viewof transferFromUserButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["transferFromUserStatus","md","Promises","createActorStatus","html"], _67);
  main.variable(observer()).define(["md"], _68);
  main.variable(observer("transferFromUserStatus")).define("transferFromUserStatus", ["transferFromUserButton","ethers","provider","iface","contractBytes","createActorStatus","client","waitEthTx","mutable invalidatedBalancesAt"], _transferFromUserStatus);
  main.variable(observer()).define(["md"], _70);
  main.variable(observer()).define(["md"], _71);
  main.variable(observer()).define(["md"], _72);
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
  main.variable(observer("filecoinJsSigner")).define("filecoinJsSigner", _filecoinJsSigner);
  main.variable(observer("filecoinJs")).define("filecoinJs", _filecoinJs);
  main.variable(observer("FilecoinClient")).define("FilecoinClient", ["filecoinJsSigner"], _FilecoinClient);
  main.variable(observer("FilecoinSigner")).define("FilecoinSigner", ["filecoinJsSigner"], _FilecoinSigner);
  main.variable(observer("filecoin_signer")).define("filecoin_signer", ["FilecoinSigner"], _filecoin_signer);
  main.variable(observer("filecoinNumber")).define("filecoinNumber", _filecoinNumber);
  main.variable(observer("FilecoinNumber")).define("FilecoinNumber", ["filecoinNumber"], _FilecoinNumber);
  main.variable(observer("ethers")).define("ethers", _ethers);
  main.variable(observer("filecoinAddress")).define("filecoinAddress", _filecoinAddress);
  main.variable(observer()).define(["md"], _91);
  main.variable(observer("simpleCoinSol")).define("simpleCoinSol", _simpleCoinSol);
  main.variable(observer("initialCodeUrl")).define("initialCodeUrl", _initialCodeUrl);
  main.variable(observer("baseUrl")).define("baseUrl", _baseUrl);
  main.variable(observer("token")).define("token", ["baseUrl"], _token);
  main.variable(observer("client")).define("client", ["BrowserProvider","baseUrl","token","LotusRPC","schema"], _client);
  main.variable(observer("filecoin_client")).define("filecoin_client", ["FilecoinClient","baseUrl","token"], _filecoin_client);
  main.variable(observer("lotusApiClient")).define("lotusApiClient", ["filecoinJs","baseUrl","token"], _lotusApiClient);
  main.variable(observer("heightStream")).define("heightStream", ["client","Promises"], _heightStream);
  main.define("initial ready", _ready);
  main.variable(observer("mutable ready")).define("mutable ready", ["Mutable", "initial ready"], (M, _) => new M(_));
  main.variable(observer("ready")).define("ready", ["mutable ready"], _ => _.generator);
  main.variable(observer("heightReadyTapStream")).define("heightReadyTapStream", ["heightStream","mutable ready"], _heightReadyTapStream);
  main.variable(observer("currentHeight")).define("currentHeight", ["heightReadyTapStream"], _currentHeight);
  main.variable(observer("walletDefaultAddress")).define("walletDefaultAddress", ["ready","client"], _walletDefaultAddress);
  main.variable(observer("getEvmAddress")).define("getEvmAddress", _getEvmAddress);
  main.variable(observer("waitMsg")).define("waitMsg", ["client"], _waitMsg);
  main.variable(observer("waitEthTx")).define("waitEthTx", ["client","Promises"], _waitEthTx);
  main.variable(observer()).define(["md"], _107);
  const child2 = runtime.module(define2);
  main.import("backups", child2);
  main.import("backupNowButton", child2);
  main.variable(observer()).define(["backups"], _109);
  main.variable(observer()).define(["backupNowButton"], _110);
  return main;
}
