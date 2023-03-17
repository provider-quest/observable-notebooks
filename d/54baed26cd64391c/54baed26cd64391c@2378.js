import define1 from "./9a34a4df6e8a276b@50.js";
import define2 from "./c2dae147641e012a@46.js";
import define3 from "./c4e4a355c53d2a1a@111.js";

function _1(md){return(
md`# FVM Actor Code Playground - WFIL Testing - Hyperspace Testnet`
)}

function _2(md){return(
md`Try a real [ERC20](https://docs.openzeppelin.com/contracts/4.x/erc20) Smart Contract on the [Filecoin Virtual Machine](https://fvm.filecoin.io/)!

Here is an example EVM Smart Contract, from:

* https://github.com/filecoin-project/testnet-wallaby/issues/8
* https://github.com/filecoin-project/fvm-example-actors/tree/main/erc20-sans-events
* https://github.com/jimpick/fvm-example-actors/tree/jim-erc20/erc20-sans-events (same as above, but with extra build scripts and missing files)

You can modify it here, then scroll down and click the buttons to compile it, then load onto the [Hyperspace Testnet](https://github.com/filecoin-project/testnet-hyperspace), and invoke methods against it.`
)}

function _3(md){return(
md`This is a modified version of the [ERC20 Sans Events](https://observablehq.com/@jimpick/fvm-actor-code-playground-erc20-sans-events) notebook (that version deploys the contract to an on-demand localnet instead of a live testnet). This demo runs much slower because the testnet has a 30 second block time, whereas the localnet has a 10 second block time.`
)}

function _4(md){return(
md`It communicates with the network using the [Hyperspace Public GLIF API Gateway](https://api.hyperspace.node.glif.io/) ... so it needs to keep all the secrets local in the web browser.`
)}

function _5(md){return(
md`* https://github.com/filecoin-project/testnet-hyperspace`
)}

function _6(md){return(
md`## Video Demo`
)}

function _7(md){return(
md`* YouTube: [FVM Actor Code Playground - ERC20 Sans Events - Wallaby Testnet](https://www.youtube.com/watch?v=pp8RIaS9skA)`
)}

function _8(md){return(
md`## Development Funds`
)}

function _9(md){return(
md`Since we're going to deploy against the Wallaby Testnet, we'll need some funds to do that. First, we'll create a "seed phrase" (aka. "mnemonic") and store that (very insecurely) in the browser's localStorage so that it can be accessed from any notebook. Cryptographic keys can be derived from the passphrase so you have an address to send funds to. This is super dangerous! You wouldn't want to do this with real funds!`
)}

function _10(md,devFundsMnemonic){return(
md`**Developer funds seed phrase:**

\`\`\`
${devFundsMnemonic}
\`\`\`
`
)}

function _11(md){return(
md`**Tip:** You can import the seed phrase from above to create a "burner wallet" using the [GLIF Wallet](https://wallet.glif.io/?network=hyperspace) (optional)`
)}

function _12(md,devFundsAddress,devFundsDelegatedAddress,devFundsId,devFundsBalance)
{
  return md`
Address: **\`${devFundsAddress}\`**

Delegated (t4) Address: ${devFundsDelegatedAddress}

ID: ${!devFundsId || devFundsId.error ? "Doesn't exist yet, transfer in some funds." : devFundsId} \ 
Balance: ${!devFundsBalance || devFundsBalance.error ? '0 FIL' : devFundsBalance.toFil() + ' FIL'}
`
}


function _13(Inputs,$0,$1){return(
Inputs.button("Re-check ID and Balance", { value: null, reduce: () => {
  $0.value = new Date();
  $1.value = new Date();
} })
)}

function _14(md){return(
md`You can get some funds from the [Hyperspace Faucet](https://hyperspace.yoga/#faucet) ... just submit the address above, complete the captcha, and wait for the funds to be deposited. (Be sure to scroll down to see the form)`
)}

function _15(md,devFundsAddress){return(
md`Also, check out the [GLIF Explorer](https://explorer.glif.io/actor/?network=wallaby&address=${devFundsAddress}) to watch the transactions for the address in real time.`
)}

function _16(md){return(
md`---`
)}

function _devFundsMnemonic(localStorage,bip39)
{
  const localStorageKey = 'fvm_playground_dev_funds_phrase'
  let phrase = localStorage.getItem(localStorageKey)
  if (!phrase) {
    phrase = bip39.generateMnemonic()
    localStorage.setItem(localStorageKey, phrase)
  }
  return phrase
}


function _devFundsKey(ethers,devFundsMnemonic){return(
ethers.Wallet.fromMnemonic(devFundsMnemonic, `m/44'/60'/0'/0/0`)
)}

function _devFundsAddress(devFundsKey){return(
devFundsKey.address
)}

function _devFundsDelegatedKey(filecoinAddress,devFundsAddress){return(
filecoinAddress.newDelegatedEthAddress(devFundsAddress, 't')
)}

function _devFundsDelegatedAddress(devFundsDelegatedKey){return(
devFundsDelegatedKey.toString()
)}

async function _devFundsId(invalidatedDevFundsIdAt,lotusApiClient,devFundsDelegatedAddress)
{
  invalidatedDevFundsIdAt;
  try {
    return await lotusApiClient.state.lookupId(devFundsDelegatedAddress, [])
  } catch (e) {
    return { error: e.message }
  }
}


function _invalidatedDevFundsIdAt(){return(
new Date()
)}

async function _devFundsBalance(invalidatedDevFundsBalanceAt,lotusApiClient,devFundsDelegatedAddress,FilecoinNumber)
{
  invalidatedDevFundsBalanceAt;
  try {
    const result = await lotusApiClient.state.getActor(devFundsDelegatedAddress, [])
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

function _devFundsWallet(ethers,devFundsKey,provider){return(
new ethers.Wallet(devFundsKey.privateKey, provider)
)}

function _28(md){return(
md`## Generate Client Side Addresses`
)}

function _29(md){return(
md`We use \`filecoin-js-signer\` to generate a random mnemomic phrase. You could save this phrase and re-use it to generate the secrets. In this notebook, we just use different secrets on each page reload.`
)}

function _30(md,randomMnemonic){return(
md`**Random temporary seed phrase:**

\`\`\`
${randomMnemonic}
\`\`\`
`
)}

function _31(md){return(
md`---`
)}

function _randomMnemonic(bip39){return(
bip39.generateMnemonic()
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

function _36(ownerKey){return(
ownerKey.privateKey
)}

function _37(md){return(
md`## Wait for Lotus to be ready, then transfer 0.1 FIL to each address`
)}

function _38(md){return(
md`Be patient as it takes a little while for the funds to be sent via the Ethereum JSON-RPC API when the notebook is first loaded. Transferring the funds might take up to 2 minutes.`
)}

async function* _39(transferFundsStatus,md,Promises)
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


function _40(md){return(
md`---`
)}

async function* _transferFundsStatus(walletDefaultAddress,keys,devFundsWallet,ethers,provider,client,waitEthTx,lotusApiClient,$0)
{
  if (walletDefaultAddress && keys) {
    const start = Date.now()
    yield {
      transferring: true,
      start
    }
    const responses = []
    for (const key of keys) {
      responses.push(await send())

      async function send () {
        console.log('Send to:', key.address)
        const populatedTx = await devFundsWallet.populateTransaction({
          to: key.address,
          value: ethers.utils.parseEther("0.1"),
        })
        console.log('Transaction:', populatedTx)
        const signedTx = await devFundsWallet.signTransaction(populatedTx)
        console.log('Send Transaction:', provider.formatter.transaction(signedTx))
        const response = await client.callEthMethod('sendRawTransaction', [signedTx])
        console.log('Response:', response)
        return response
      }
    }
    const waitStart = Date.now()
    yield { waiting: true, start, waitStart, responses }
    const promises = []
    for (const response of responses) {
      promises.push(waitEthTx(response))
    }
    const waitResponses = await Promise.all(promises)
    const lookups = {}
    for (const key of keys) {
      lookups[key.delegated.toString()] = await lotusApiClient.state.lookupId(key.delegated.toString(), [])
    }
    yield { transferred: true, responses, waitResponses, lookups }
    $0.value = new Date()
  }
}


function _42(md){return(
md`## Initial Balances`
)}

function _43(md){return(
md`Here are the addresses and IDs of the 4 clients we created, as well at their initial balances (should be 0.1 FIL each).`
)}

function _44(Inputs,initialBalances,keys,transferFundsStatus,FilecoinNumber){return(
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

function _45(md){return(
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

function _ownerId(transferFundsStatus,keys){return(
transferFundsStatus?.lookups && transferFundsStatus.lookups[keys[0].delegated.toString()]
)}

function _49(md){return(
md`## Step 2: Connect to Deployed WFIL Contract`
)}

function _50(md){return(
md`At the command line, this is the same as: \`lotus chain create-evm-actor <bytecode file>\``
)}

function _51(md){return(
md`---`
)}

async function _abi2(){return(
(await fetch('https://raw.githubusercontent.com/jimpick/fvm-example-actors/jim-erc20/erc20-sans-events/output/ERC20PresetFixedSupply.abi')).json()
)}

function _abi(FileAttachment){return(
FileAttachment("WFIL.abi.json").json()
)}

function _iface(ethers,abi){return(
new ethers.utils.Interface(abi)
)}

function _deployer(ethers,ownerKey,provider){return(
new ethers.Wallet(ownerKey.privateKey, provider)
)}

function _wfilAddress(){return(
"0x6C297AeD654816dc5d211c956DE816Ba923475D2"
)}

function _contract(ethers,wfilAddress,abi,deployer){return(
new ethers.Contract(wfilAddress, abi, deployer)
)}

function _58(md,ownerId){return(
md`## Step 3: Invoke a method to get the ERC20 token balance for the owner address (${ownerId})`
)}

function _59(md){return(
md`Now that we've got an actor running with an ID Address, we can call the methods we have defined. Let's check the balance of the addresses. The method signature (from above) to get the balance is => \`70a08231: balanceOf(address)\``
)}

function _invokeEvmMethodButton(Inputs,ownerId,contract,keys){return(
Inputs.button(`Get ERC20 Token Balance for Owner (${ownerId})`, {
  value: null,
  reduce: async () => (await contract.balanceOf(keys[0].address)).toString()
})
)}

function _61(invokeEvmMethodButton,md){return(
invokeEvmMethodButton ? md`Balance: ${invokeEvmMethodButton}` : md``
)}

function _62(md,ownerId){return(
md`## Step 4: Invoke a method to transfer ERC20 tokens from the owner address (${ownerId}) to a user address`
)}

function _63(md){return(
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

async function* _66(transferFromOwnerStatus,md,Promises,createActorStatus,html)
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


function _67(md){return(
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


function _69(md){return(
md`## Step 5: Retrieve the ERC20 token balances for all the addresses`
)}

function _70(md){return(
md`This is the same as Step 3, where we got the token balance for a single account. But here we retrieve all the account token balances in parallel to make it easier to observe what's going on.`
)}

function _71(tokenBalances,md,Inputs,keys,transferFundsStatus)
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


function _72(Inputs,$0){return(
Inputs.button("Update", { value: null, reduce: () => { $0.value = new Date() } })
)}

function _73(md){return(
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

function _76(md){return(
md`## Step 6: Transfer ERC20 tokens from user to user`
)}

function _77(md){return(
md`This is almost the same as Step 4, where we transferred from the owner (the genesis address on the Lotus node). But this time we will use secrets on the client side (in the browser) and sign the message from a non-owner address.`
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

async function* _80(transferFromUserStatus,md,Promises,createActorStatus,html)
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


function _81(md){return(
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


function _83(md){return(
md`# Final notes`
)}

function _84(md){return(
md`Thank you for trying out this demo.

If the backend is not working, please get in touch with me. Feel free to fork this notebook to customize your own actors and build scenarios using the on-demand localnet that supports this early version of actors / smart contracts.

I can also deploy custom instances of the localnet and the API for compiling actors ... feel free to contact me at @jimpick on the Filecoin Slack.`
)}

function _85(md){return(
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

async function _filecoinJs(){return(
(await import('https://jspm.dev/filecoin.js')).default
)}

function _bip39(require){return(
require('https://bundle.run/bip39@3.0.4')
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

function _provider(ethers,baseUrl,token){return(
new ethers.providers.JsonRpcProvider(`${baseUrl}/rpc/v0?token=${token}`)
)}

function _filecoinAddress(){return(
import('https://cdn.skypack.dev/@glif/filecoin-address')
)}

function _107(md){return(
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
"https://api.hyperspace.node.glif.io"
)}

function _token(){return(
''
)}

function _client(BrowserProvider,baseUrl,LotusRPC,schema)
{
  const provider = new BrowserProvider(`${baseUrl}/rpc/v0?token=`, {
    sendHttpContentType: 'application/json'
  })
  // Monkey-patch in a method to call eth_* JSON-RPC methods
  LotusRPC.prototype.callEthMethod = async function (method, args) {
    await this.provider.connect()
    const request = {
      method: `eth_${method}`
    }
    request.params = args || []
    return this.provider.send(request, {})
  }
  return new LotusRPC(provider, { schema })
}


function _filecoin_client(FilecoinClient,baseUrl,token){return(
new FilecoinClient(baseUrl, token)
)}

function _lotusApiClient(filecoinJs,baseUrl,token)
{
  const connector = new filecoinJs.HttpJsonRpcConnector({ url: baseUrl, token })
  return new filecoinJs.LotusClient(connector)
}


function _walletDefaultAddress(devFundsReady,devFundsAddress){return(
devFundsReady && devFundsAddress
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

function _119(md){return(
md`## Backups`
)}

function _121(backups){return(
backups()
)}

function _122(backupNowButton){return(
backupNowButton()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["WFIL.abi.json", {url: new URL("./files/eef3a4645344ca80cca701962a7a6f851f7ea0d4c3861220c815e0d2f14de89afb7bb115a4767aae190d4d75a383477db1afae32f07e4adf316a894fbeea8d42.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer()).define(["md","devFundsMnemonic"], _10);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer()).define(["md","devFundsAddress","devFundsDelegatedAddress","devFundsId","devFundsBalance"], _12);
  main.variable(observer()).define(["Inputs","mutable invalidatedDevFundsIdAt","mutable invalidatedDevFundsBalanceAt"], _13);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer()).define(["md","devFundsAddress"], _15);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer("devFundsMnemonic")).define("devFundsMnemonic", ["localStorage","bip39"], _devFundsMnemonic);
  main.variable(observer("devFundsKey")).define("devFundsKey", ["ethers","devFundsMnemonic"], _devFundsKey);
  main.variable(observer("devFundsAddress")).define("devFundsAddress", ["devFundsKey"], _devFundsAddress);
  main.variable(observer("devFundsDelegatedKey")).define("devFundsDelegatedKey", ["filecoinAddress","devFundsAddress"], _devFundsDelegatedKey);
  main.variable(observer("devFundsDelegatedAddress")).define("devFundsDelegatedAddress", ["devFundsDelegatedKey"], _devFundsDelegatedAddress);
  main.variable(observer("devFundsId")).define("devFundsId", ["invalidatedDevFundsIdAt","lotusApiClient","devFundsDelegatedAddress"], _devFundsId);
  main.define("initial invalidatedDevFundsIdAt", _invalidatedDevFundsIdAt);
  main.variable(observer("mutable invalidatedDevFundsIdAt")).define("mutable invalidatedDevFundsIdAt", ["Mutable", "initial invalidatedDevFundsIdAt"], (M, _) => new M(_));
  main.variable(observer("invalidatedDevFundsIdAt")).define("invalidatedDevFundsIdAt", ["mutable invalidatedDevFundsIdAt"], _ => _.generator);
  main.variable(observer("devFundsBalance")).define("devFundsBalance", ["invalidatedDevFundsBalanceAt","lotusApiClient","devFundsDelegatedAddress","FilecoinNumber"], _devFundsBalance);
  main.define("initial invalidatedDevFundsBalanceAt", _invalidatedDevFundsBalanceAt);
  main.variable(observer("mutable invalidatedDevFundsBalanceAt")).define("mutable invalidatedDevFundsBalanceAt", ["Mutable", "initial invalidatedDevFundsBalanceAt"], (M, _) => new M(_));
  main.variable(observer("invalidatedDevFundsBalanceAt")).define("invalidatedDevFundsBalanceAt", ["mutable invalidatedDevFundsBalanceAt"], _ => _.generator);
  main.variable(observer("devFundsReady")).define("devFundsReady", ["devFundsId"], _devFundsReady);
  main.variable(observer("devFundsWallet")).define("devFundsWallet", ["ethers","devFundsKey","provider"], _devFundsWallet);
  main.variable(observer()).define(["md"], _28);
  main.variable(observer()).define(["md"], _29);
  main.variable(observer()).define(["md","randomMnemonic"], _30);
  main.variable(observer()).define(["md"], _31);
  main.variable(observer("randomMnemonic")).define("randomMnemonic", ["bip39"], _randomMnemonic);
  main.variable(observer("keys")).define("keys", ["ethers","randomMnemonic","filecoinAddress"], _keys);
  main.variable(observer("clientAddresses")).define("clientAddresses", ["keys"], _clientAddresses);
  main.variable(observer("ownerKey")).define("ownerKey", ["keys"], _ownerKey);
  main.variable(observer()).define(["ownerKey"], _36);
  main.variable(observer()).define(["md"], _37);
  main.variable(observer()).define(["md"], _38);
  main.variable(observer()).define(["transferFundsStatus","md","Promises"], _39);
  main.variable(observer()).define(["md"], _40);
  main.variable(observer("transferFundsStatus")).define("transferFundsStatus", ["walletDefaultAddress","keys","devFundsWallet","ethers","provider","client","waitEthTx","lotusApiClient","mutable invalidatedDevFundsBalanceAt"], _transferFundsStatus);
  main.variable(observer()).define(["md"], _42);
  main.variable(observer()).define(["md"], _43);
  main.variable(observer()).define(["Inputs","initialBalances","keys","transferFundsStatus","FilecoinNumber"], _44);
  main.variable(observer()).define(["md"], _45);
  main.variable(observer("initialBalances")).define("initialBalances", ["transferFundsStatus","md","getBalances","clientAddresses"], _initialBalances);
  main.variable(observer("getBalances")).define("getBalances", ["lotusApiClient"], _getBalances);
  main.variable(observer("ownerId")).define("ownerId", ["transferFundsStatus","keys"], _ownerId);
  main.variable(observer()).define(["md"], _49);
  main.variable(observer()).define(["md"], _50);
  main.variable(observer()).define(["md"], _51);
  main.variable(observer("abi2")).define("abi2", _abi2);
  main.variable(observer("abi")).define("abi", ["FileAttachment"], _abi);
  main.variable(observer("iface")).define("iface", ["ethers","abi"], _iface);
  main.variable(observer("deployer")).define("deployer", ["ethers","ownerKey","provider"], _deployer);
  main.variable(observer("wfilAddress")).define("wfilAddress", _wfilAddress);
  main.variable(observer("contract")).define("contract", ["ethers","wfilAddress","abi","deployer"], _contract);
  main.variable(observer()).define(["md","ownerId"], _58);
  main.variable(observer()).define(["md"], _59);
  main.variable(observer("viewof invokeEvmMethodButton")).define("viewof invokeEvmMethodButton", ["Inputs","ownerId","contract","keys"], _invokeEvmMethodButton);
  main.variable(observer("invokeEvmMethodButton")).define("invokeEvmMethodButton", ["Generators", "viewof invokeEvmMethodButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["invokeEvmMethodButton","md"], _61);
  main.variable(observer()).define(["md","ownerId"], _62);
  main.variable(observer()).define(["md"], _63);
  main.variable(observer("viewof transferFromOwnerForm")).define("viewof transferFromOwnerForm", ["keys","transferFundsStatus","Inputs"], _transferFromOwnerForm);
  main.variable(observer("transferFromOwnerForm")).define("transferFromOwnerForm", ["Generators", "viewof transferFromOwnerForm"], (G, _) => G.input(_));
  main.variable(observer("viewof transferFromOwnerButton")).define("viewof transferFromOwnerButton", ["Inputs","ownerId","createActorStatus","transferFromOwnerForm"], _transferFromOwnerButton);
  main.variable(observer("transferFromOwnerButton")).define("transferFromOwnerButton", ["Generators", "viewof transferFromOwnerButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["transferFromOwnerStatus","md","Promises","createActorStatus","html"], _66);
  main.variable(observer()).define(["md"], _67);
  main.variable(observer("transferFromOwnerStatus")).define("transferFromOwnerStatus", ["transferFromOwnerButton","contract","deployer","provider","client","waitEthTx","mutable invalidatedBalancesAt"], _transferFromOwnerStatus);
  main.variable(observer()).define(["md"], _69);
  main.variable(observer()).define(["md"], _70);
  main.variable(observer()).define(["tokenBalances","md","Inputs","keys","transferFundsStatus"], _71);
  main.variable(observer()).define(["Inputs","mutable invalidatedBalancesAt"], _72);
  main.variable(observer()).define(["md"], _73);
  main.variable(observer("tokenBalances")).define("tokenBalances", ["invalidatedBalancesAt","createActorStatus","keys","contract"], _tokenBalances);
  main.define("initial invalidatedBalancesAt", _invalidatedBalancesAt);
  main.variable(observer("mutable invalidatedBalancesAt")).define("mutable invalidatedBalancesAt", ["Mutable", "initial invalidatedBalancesAt"], (M, _) => new M(_));
  main.variable(observer("invalidatedBalancesAt")).define("invalidatedBalancesAt", ["mutable invalidatedBalancesAt"], _ => _.generator);
  main.variable(observer()).define(["md"], _76);
  main.variable(observer()).define(["md"], _77);
  main.variable(observer("viewof transferFromUserForm")).define("viewof transferFromUserForm", ["keys","transferFundsStatus","Inputs"], _transferFromUserForm);
  main.variable(observer("transferFromUserForm")).define("transferFromUserForm", ["Generators", "viewof transferFromUserForm"], (G, _) => G.input(_));
  main.variable(observer("viewof transferFromUserButton")).define("viewof transferFromUserButton", ["Inputs","createActorStatus","transferFromUserForm"], _transferFromUserButton);
  main.variable(observer("transferFromUserButton")).define("transferFromUserButton", ["Generators", "viewof transferFromUserButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["transferFromUserStatus","md","Promises","createActorStatus","html"], _80);
  main.variable(observer()).define(["md"], _81);
  main.variable(observer("transferFromUserStatus")).define("transferFromUserStatus", ["transferFromUserButton","ethers","provider","iface","contractBytes","createActorStatus","client","waitEthTx","mutable invalidatedBalancesAt"], _transferFromUserStatus);
  main.variable(observer()).define(["md"], _83);
  main.variable(observer()).define(["md"], _84);
  main.variable(observer()).define(["md"], _85);
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
  main.variable(observer("filecoinJs")).define("filecoinJs", _filecoinJs);
  main.variable(observer("bip39")).define("bip39", ["require"], _bip39);
  main.variable(observer("filecoinNumber")).define("filecoinNumber", _filecoinNumber);
  main.variable(observer("FilecoinNumber")).define("FilecoinNumber", ["filecoinNumber"], _FilecoinNumber);
  main.variable(observer("ethers")).define("ethers", _ethers);
  main.variable(observer("provider")).define("provider", ["ethers","baseUrl","token"], _provider);
  const child2 = runtime.module(define2);
  main.import("localStorage", child2);
  main.variable(observer("filecoinAddress")).define("filecoinAddress", _filecoinAddress);
  main.variable(observer()).define(["md"], _107);
  main.variable(observer("simpleCoinSol")).define("simpleCoinSol", _simpleCoinSol);
  main.variable(observer("initialCodeUrl")).define("initialCodeUrl", _initialCodeUrl);
  main.variable(observer("baseUrl")).define("baseUrl", _baseUrl);
  main.variable(observer("token")).define("token", _token);
  main.variable(observer("client")).define("client", ["BrowserProvider","baseUrl","LotusRPC","schema"], _client);
  main.variable(observer("filecoin_client")).define("filecoin_client", ["FilecoinClient","baseUrl","token"], _filecoin_client);
  main.variable(observer("lotusApiClient")).define("lotusApiClient", ["filecoinJs","baseUrl","token"], _lotusApiClient);
  main.variable(observer("walletDefaultAddress")).define("walletDefaultAddress", ["devFundsReady","devFundsAddress"], _walletDefaultAddress);
  main.variable(observer("getEvmAddress")).define("getEvmAddress", _getEvmAddress);
  main.variable(observer("waitMsg")).define("waitMsg", ["lotusApiClient","Promises"], _waitMsg);
  main.variable(observer("waitEthTx")).define("waitEthTx", ["client","Promises"], _waitEthTx);
  main.variable(observer()).define(["md"], _119);
  const child3 = runtime.module(define3);
  main.import("backups", child3);
  main.import("backupNowButton", child3);
  main.variable(observer()).define(["backups"], _121);
  main.variable(observer()).define(["backupNowButton"], _122);
  return main;
}
