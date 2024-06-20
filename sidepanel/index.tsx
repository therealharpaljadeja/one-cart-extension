import { ChakraProvider } from "@chakra-ui/react"

import Popup from "./panel"
import OnchainProviders from "./wagmi"

export default function IndexPopup() {
  return (
    <OnchainProviders>
      <ChakraProvider>
        <Popup />
      </ChakraProvider>
    </OnchainProviders>
  )
}
