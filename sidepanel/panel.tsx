import {
  Button,
  Flex,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
  VStack
} from "@chakra-ui/react"
import {
  chains,
  createGlideConfig,
  createSession,
  currencies,
  waitForSession
} from "@paywithglide/glide-js"
import { createCollectorClient } from "@zoralabs/protocol-sdk"
import glide from "data-base64:~/assets/glide.svg"
import zorb from "data-base64:~/assets/icon.png"
import zora from "data-base64:~/assets/zora.png"
import { useCallback, useEffect, useState } from "react"
import { MdOutlineShoppingCart } from "react-icons/md"
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  usePublicClient
} from "wagmi"
import { useSendCalls, useWriteContracts } from "wagmi/experimental"

import ERC20Abi from "~/utils/ERC20Abi"

import CoinBaseButton from "./components/Button"
import NFT from "./components/NFT"
import SuccessScreen from "./components/SuccessScreen"

export const config = createGlideConfig({
  projectId: "55432225-f9f0-4a04-b3d4-88e71ef2cdad",
  chains: [chains.base]
})

export default function Panel() {
  const { connectors, connect } = useConnect()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { disconnect } = useDisconnect()
  const { isConnected, address } = useAccount()
  const chainId = useChainId()
  const publicClient = usePublicClient()
  const [cart, setCart] = useState([])
  const { sendCallsAsync } = useSendCalls()
  const [showSuccessScreen, setShowSuccessScreen] = useState(false)
  const toast = useToast()

  const onCloseSuccess = useCallback(() => {
    setShowSuccessScreen(false)
    clearCart()
  }, [])

  async function init() {
    const { cart } = await chrome.storage.sync.get("cart")
    setCart(cart)
  }

  async function storageChangeListener(changes, areaName) {
    if (areaName == "sync" && changes.cart) {
      console.log("storage has changed")
      await init()
    }
  }

  useEffect(() => {
    // Get Cart if it already exists.
    init()

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
    if (address) {
      onOpen()
      try {
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

          const { unsignedTransaction, sessionId } = await createSession(
            config,
            {
              chainId: chains.base.id,
              account: address,
              paymentCurrency: currencies.usdc,
              ...parameters
            }
          )

          console.log(unsignedTransaction)

          let transaction = {
            to: unsignedTransaction.to,
            data: unsignedTransaction.input,
            value: unsignedTransaction.value
          }

          transactions.push(transaction)
        }

        if (address) {
          await sendCallsAsync({
            account: address,
            calls: transactions,
            capabilities: {
              paymasterService: {
                url: "https://cdp-paymaster-proxy.vercel.app/api/paymaster"
              },
              auxillaryFunds: {
                8453: {
                  supported: true
                }
              }
            }
          })

          setShowSuccessScreen(true)
        }
      } catch (error) {
        console.error(error)
      } finally {
        onClose()
      }
    } else {
      toast({
        title: "Please Connect Wallet",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top"
      })
    }
  }

  const connector = connectors[0]

  function removeItem(itemIndex: number) {
    let modifiedCart = cart.filter((item, index) => index != itemIndex)
    setCart(modifiedCart)
    chrome.storage.sync.set({
      cart: modifiedCart
    })
  }

  if (showSuccessScreen) return <SuccessScreen onClose={onCloseSuccess} />

  return (
    <div
      style={{
        backgroundColor: "white",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        boxSizing: "border-box",
        alignItems: "center"
      }}>
      <Modal
        closeOnOverlayClick={false}
        size={"xs"}
        isOpen={isOpen}
        onClose={onClose}
        isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalBody padding={"20px"}>
            <Flex
              direction={"column"}
              justifyContent={"center"}
              alignItems={"center"}
              gap="2">
              <Flex justifyContent={"center"} alignItems={"center"} gap="2">
                <Spinner size="xs" />
                <Text size={"md"}>Awaiting Confirmation</Text>
              </Flex>
              <HStack>
                <Text>Powered by </Text>
                <Image width={"45px"} src={glide} />
              </HStack>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Flex
        flexDirection={"column"}
        alignItems={"center"}
        width={"100%"}
        gap={"6"}>
        <Flex gap="2" marginBottom={"20px"}>
          <img width="24px" src={zorb} />
          <img width="60px" src={zora} />
        </Flex>
        {cart ? (
          cart.length ? (
            <VStack gap="5" width={"100%"}>
              {cart.map((item, index) => {
                const { image, collectionTitle, price, title, currency } = item
                return (
                  <NFT
                    image={image}
                    collectionTitle={collectionTitle}
                    price={price}
                    title={title}
                    key={index}
                    currency={currency}
                    removeItem={() => removeItem(index)}
                  />
                )
              })}
            </VStack>
          ) : null
        ) : null}
      </Flex>
      {cart && cart.length ? null : (
        <Flex
          width={"100%"}
          height="84%"
          borderStyle={"dashed"}
          border="4px dashed #e3e3e3"
          alignItems={"center"}
          justifyContent={"center"}
          borderRadius="10px">
          <Text fontSize="12px">Cart is empty!</Text>
        </Flex>
      )}
      <VStack
        zIndex={10}
        width={"90%"}
        bottom="15px"
        position={"fixed"}
        boxSizing="border-box">
        {cart ? (
          cart.length ? (
            <Flex width="100%" flexDirection={"column"} gap="2">
              {/* <Button width={"100%"} colorScheme={"red"} onClick={clearCart}>
                Clear Cart
              </Button> */}
              <Button
                padding={"25px 16px"}
                width={"100%"}
                fontSize={"16px"}
                leftIcon={<MdOutlineShoppingCart />}
                colorScheme={"green"}
                onClick={checkout}>
                Checkout
              </Button>
            </Flex>
          ) : null
        ) : null}
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
      </VStack>
    </div>
  )
}
