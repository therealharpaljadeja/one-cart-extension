import { createCollectorClient } from "@zoralabs/protocol-sdk"
import { ZDK, ZDKChain, ZDKNetwork } from "@zoralabs/zdk"
import type {
  PlasmoCSConfig,
  PlasmoGetInlineAnchor,
  PlasmoGetStyle
} from "plasmo"
import { createPublicClient, http, type Address } from "viem"
import { base } from "viem/chains"

export const config: PlasmoCSConfig = {
  matches: ["https://zora.co/collect/base:*"]
}

export const chainId = base.id

export const publicClient = createPublicClient({
  // this will determine which chain to interact with
  chain: base,
  transport: http()
})

const collectorClient = createCollectorClient({ chainId, publicClient })

const API_ENDPOINT = "https://api.zora.co/graphql"

const zdk = new ZDK({
  endpoint: API_ENDPOINT,
  networks: [{ network: ZDKNetwork.Base, chain: ZDKChain.BaseMainnet }]
})

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = `
    #plasmo-shadow-container {
      z-index: 10 !important
    }
  `
  return style
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () =>
  document.querySelector(
    'button[data-testid="connect-trigger"].Button_--size-large__2b6m4'
  ) ||
  document.querySelector(
    'button[data-testid="action-trigger"].Button_--size-large__2b6m4'
  ) ||
  document.querySelector(
    'button[data-testid="mint-sale-public"].Button_--size-large__2b6m4'
  )

function hex2a(hexx) {
  var hex = hexx.toString() //force conversion
  var str = ""
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
  return str
}

async function getToken(address, tokenId) {
  const args = {
    token: {
      address,
      tokenId
    },
    includeFullDetails: false // Optional, provides more data on the NFT such as all historical events
  }
  const { token } = await zdk.token(args)
  return token
}

async function getCurrencySymbol(currencyAddress: Address) {
  const { data } = await publicClient.call({
    data: "0x95d89b41",
    to: currencyAddress
  })

  return hex2a(data)
}

async function constructItemFromToken(token) {
  if (token) {
    let imageContentUrl = `https://magic.decentralized-content.com/ipfs/${token.token.image.url.split("/")[2]}`

    // let token = await collectorClient.getToken({
    //   tokenContract: tokenToCSSVar.
    // })

    console.log("Token", token)

    const { prepareMint } = await collectorClient.getToken({
      tokenContract: token.token.collectionAddress,
      mintType: "1155",
      tokenId: token.token.tokenId
    })

    const { costs } = await prepareMint({
      quantityToMint: 1,
      minterAccount: "0x0000000000000000000000000000000000000000"
    })

    console.log("Costs", costs)

    // const mintCosts = await collectorClient.getMintCosts({
    //   // 1155 contract address
    //   collection: token.token.collectionAddress,
    //   // 1155 token id
    //   tokenId: token.token.tokenId,
    //   quantityMinted: 1,
    //   mintType: "1155"
    // })

    let item = {
      image: imageContentUrl,
      title: token.token.name,
      collectionTitle: token.token.tokenContract.name,
      decimals: token.token.mintInfo.price.nativePrice.currency.decimals,
      collectionAddress: token.token.collectionAddress,
      tokenId: token.token.tokenId
    }

    if (costs.totalPurchaseCostCurrency && costs.totalPurchaseCost) {
      item.price = costs.totalPurchaseCost.toString()
      item.purchaseCurrency = costs.totalPurchaseCostCurrency
      item.currency = (
        await getCurrencySymbol(costs.totalPurchaseCostCurrency)
      ).trim()
      console.log("currency added")
    } else {
      item.price = costs.totalCostEth.toString()
      item.currency = "ETH"
    }

    return item
  }
}

async function processAddToCart() {
  let link = window.location.href
  link = link.replace("https://zora.co/collect/base:", "")
  let [address, tokenId] = link.split("/")

  const token = await getToken(address, tokenId)

  const item = constructItemFromToken(token)

  return item
}

async function addToCart() {
  let item = await processAddToCart()
  chrome.runtime.sendMessage({
    name: "mint",
    body: {
      item
    }
  })
}

export default function AddToCart() {
  return (
    <div style={{ width: "100%", marginTop: "8px" }}>
      <button
        style={{
          width: "100%",
          backgroundColor: "black",
          color: "white",
          padding: "12px 16px",
          fontSize: "16px",
          borderRadius: "8px",
          fontWeight: 600,
          cursor: "pointer",
          zIndex: 10
        }}
        onClick={addToCart}>
        Add to Cart
      </button>
    </div>
  )
}
