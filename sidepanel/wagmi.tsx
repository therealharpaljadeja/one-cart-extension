import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { base, baseSepolia } from "viem/chains"
import { createConfig, http, WagmiProvider } from "wagmi"
import { coinbaseWallet } from "wagmi/connectors"

export const config = createConfig({
  chains: [base],
  multiInjectedProviderDiscovery: false,
  transports: {
    [base.id]: http(
      "https://api.developer.coinbase.com/rpc/v1/base/8JRxKERJhxmvLtTDCg7oIbEj25fyBY31"
    )
  },
  connectors: [
    coinbaseWallet({
      appName: "ZoraCart",
      preference: "smartWalletOnly"
    })
  ],
  ssr: true
})

const queryClient = new QueryClient()

export default function OnchainProviders({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
