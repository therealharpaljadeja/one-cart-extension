import { ZDK, ZDKChain, ZDKNetwork } from "@zoralabs/zdk"
import { useEffect, useState } from "react"
import { formatEther, parseEther } from "viem"
import { useAccount, useConnect, useDisconnect } from "wagmi"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import Button from "./components/Button"
import NFT from "./components/NFT"

const API_ENDPOINT = "https://api.zora.co/graphql"

const zdk = new ZDK({
  endpoint: API_ENDPOINT,
  networks: [{ network: ZDKNetwork.Base, chain: ZDKChain.BaseMainnet }]
})

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

async function listenerCallback(request, sender, sendResponse) {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  )

  let link = sender.tab.url
  link = link.replace("https://zora.co/collect/base:", "")
  let [address, tokenId] = link.split("/")

  const token = await getToken(address, tokenId)
  if (token) {
    let imageUrl = token.token.image.url
    imageUrl = imageUrl.replace("ipfs://", "")
    let imageContentUrl = `https://remote-image.decentralized-content.com/image?url=${encodeURIComponent(`https://magic.decentralized-content.com/ipfs/${imageUrl}`)}&w=640&q=25`

    let item = {
      image: imageContentUrl,
      title: token.token.name,
      collectionTitle: token.token.tokenContract.name,
      price: token.token.mintInfo.price.nativePrice.raw
    }

    return item
  }

  if (request.greeting === "hello") sendResponse({ farewell: "goodbye" })
}

export default function Panel() {
  const { connectors, connect, isSuccess } = useConnect()
  const { disconnect } = useDisconnect()
  const { address, status, isConnected } = useAccount()
  const [total, setTotal] = useState("0")

  const [cart, setCart, { setStoreValue }] = useStorage({
    key: "cart",
    instance: new Storage({
      area: "local"
    })
  })

  useEffect(() => {
    setCart([])
    if (!chrome.runtime.onMessage.hasListeners()) {
      chrome.runtime.onMessage.addListener(
        async (request, sender, sendResponse) => {
          console.log("request", request)
          let item = await listenerCallback(request, sender, sendResponse)
          console.log("item", item)
          const { cart } = await chrome.storage.local.get("cart")
          let loadedCart = JSON.parse(cart)
          console.log(loadedCart, [...loadedCart, item])
          if (loadedCart && loadedCart.length) {
            setCart([...loadedCart, item])
          } else {
            setCart([item])
          }

          return true
        }
      )
    }

    console.log(chrome.runtime.onMessage.hasListeners())

    chrome.storage.onChanged.addListener(async () => {
      console.log("storage has changed")
      const { cart } = await chrome.storage.local.get("cart")
      const loadedCart = JSON.parse(cart)

      let totalPrice = loadedCart.reduce((totalAmount, item) => {
        return formatEther(
          parseEther(item.price) +
            parseEther("0.000777") +
            parseEther(totalAmount)
        )
      }, total)

      console.log(totalPrice)

      return
    })

    return () => {
      chrome.runtime.onMessage.removeListener(() => {
        console.log("listener removed")
        chrome.storage.local.set({
          cart: JSON.stringify([])
        })
      })
    }
  }, [])

  function clearCart() {
    setCart([])
  }

  const connector = connectors[0]

  return (
    <div
      style={{
        backgroundColor: "white",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "20px",
        boxSizing: "border-box",
        alignItems: "center"
      }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%"
        }}>
        <p
          style={{
            color: "black",
            fontSize: "16px",
            fontWeight: "600",
            textWrap: "wrap",
            marginBottom: "40px",
            textAlign: "center"
          }}>
          Zora Cart
        </p>
        {cart ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {cart.length
              ? cart.map((item, index) => {
                  const { image, collectionTitle, price, title } = item
                  return (
                    <NFT
                      image={image}
                      collectionTitle={collectionTitle}
                      price={price}
                      title={title}
                      key={title}
                    />
                  )
                })
              : null}
          </div>
        ) : null}
      </div>
      <div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
        {cart ? (
          cart.length ? (
            <Button onClick={clearCart}>Clear Cart</Button>
          ) : null
        ) : null}
        <div style={{ margin: "5px" }}></div>
        {isConnected ? (
          <Button
            onClick={() => {
              disconnect({ connector })
            }}>
            Disconnect
          </Button>
        ) : (
          <Button onClick={() => connect({ connector })}>Connect Wallet</Button>
        )}
      </div>
    </div>
  )
}
