import { Button, Flex, Text } from "@chakra-ui/react"
import { createCollectorClient } from "@zoralabs/protocol-sdk"
import zora from "data-base64:~/assets/zora.png"
import { useEffect, useState } from "react"
import { formatEther } from "viem"
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  usePublicClient
} from "wagmi"
import { useWriteContracts } from "wagmi/experimental"

import ERC20Abi from "~/utils/ERC20Abi"

import CoinBaseButton from "./components/Button"
import NFT from "./components/NFT"

export default function Panel() {
  const { connectors, connect, isSuccess } = useConnect()
  const { disconnect } = useDisconnect()
  const { isConnected, address } = useAccount()
  const chainId = useChainId()
  const publicClient = usePublicClient()
  const [cart, setCart] = useState([])
  const { writeContracts } = useWriteContracts()

  async function init() {
    const { cart } = await chrome.storage.sync.get("cart")
    const totalPrice = calculateCartTotal(cart)
    setCart(cart)
  }

  async function storageChangeListener(changes, areaName) {
    if (areaName == "sync" && changes.cart) {
      console.log("storage has changed")
      await init()
    }
  }

  function calculateCartTotal(cart) {
    let total = BigInt(0)
    console.log("Cart", cart)

    let totalPrice = cart.reduce((totalAmount, item) => {
      return BigInt(item.price) + totalAmount
    }, total)

    return totalPrice
  }

  useEffect(() => {
    // Get Cart and calculate total if it already exists.
    init()

    console.log(chrome.storage.onChanged.hasListeners())

    if (!chrome.storage.onChanged.hasListeners()) {
      console.log("Registering the Storage Listener")
      chrome.storage.onChanged.addListener(storageChangeListener)
    }

    return () => {
      chrome.storage.onChanged.removeListener(storageChangeListener)
    }
  }, [])

  function clearCart() {
    chrome.storage.sync.set({
      cart: []
    })
  }

  async function checkout() {
    const collectorClient = createCollectorClient({ chainId, publicClient })
    let transactions: any[] = []

    for await (let item of cart) {
      let { parameters } = await collectorClient.mint({
        minterAccount: address,
        // collection address to mint
        tokenId: item.tokenId,
        tokenContract: item.collectionAddress,
        // quantity of tokens to mint
        quantityToMint: 1,
        mintReferral: "0x408f46674216bad2f0e3710db6645cf7280f4b02",
        // can be set to 1155, 721, or premint
        mintType: "1155"
      })

      if (item.purchaseCurrency) {
        transactions.push({
          account: address,
          address: item.purchaseCurrency,
          functionName: "approve",
          abi: ERC20Abi,
          args: [
            "0x777777E8850d8D6d98De2B5f64fae401F96eFF31", // ERC20Minter
            item.price
          ]
        })
      }

      transactions.push(parameters)
    }

    console.log(transactions)

    if (address) {
      await writeContracts({
        contracts: transactions,
        capabilities: {
          paymasterService: {
            url: "https://api.developer.coinbase.com/rpc/v1/base/8JRxKERJhxmvLtTDCg7oIbEj25fyBY31"
          }
        }
      })
    }
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
      <Flex
        flexDirection={"column"}
        alignItems={"center"}
        width={"100%"}
        gap={"6"}>
        <img width="60px" src={zora} />
        {cart ? (
          <div
            style={{
              display: "flex",
              height: "420px",
              width: "100%",
              overflow: "auto",
              flexDirection: "column"
            }}>
            {cart.length
              ? cart.map((item, index) => {
                  const { image, collectionTitle, price, title, currency } =
                    item
                  return (
                    <NFT
                      image={image}
                      collectionTitle={collectionTitle}
                      price={price}
                      title={title}
                      key={index}
                      currency={currency}
                    />
                  )
                })
              : null}
          </div>
        ) : null}
      </Flex>
      <div
        style={{
          position: "fixed",
          zIndex: 10,
          width: "90%",
          boxSizing: "border-box",
          margin: "20px",
          bottom: "15px",
          flexDirection: "column"
        }}>
        {cart ? (
          cart.length ? (
            <Flex
              flexDirection={"column"}
              border={"1px solid #777"}
              padding={"12px"}
              borderRadius={"10px"}
              gap="4"
              backgroundColor={"white"}>
              {/* <Flex justifyContent={"space-between"}>
                <Text fontSize={"md"}>Total: </Text>
                <Text fontSize={"md"}>{formatEther(total)} ETH</Text>
              </Flex> */}
              <Flex flexDirection={"column"} gap="2">
                <Button width={"100%"} colorScheme={"red"} onClick={clearCart}>
                  Clear Cart
                </Button>
                <Button width={"100%"} colorScheme={"green"} onClick={checkout}>
                  Checkout
                </Button>
              </Flex>
            </Flex>
          ) : null
        ) : null}
        <div style={{ margin: "5px" }}></div>
        {isConnected ? (
          <CoinBaseButton
            onClick={() => {
              disconnect({ connector })
            }}>
            Disconnect
          </CoinBaseButton>
        ) : (
          <CoinBaseButton onClick={() => connect({ connector })}>
            Connect Wallet
          </CoinBaseButton>
        )}
      </div>
    </div>
  )
}
