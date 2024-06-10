import { useAccount, useConnect, useDisconnect } from "wagmi"

export default function Popup() {
  const { connectors, connect, isSuccess } = useConnect()
  const { disconnect } = useDisconnect()
  const { address, status, isConnected } = useAccount()

  const connector = connectors[0]
  return (
    <div
      style={{
        backgroundColor: "white",
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
      <p style={{ color: "white" }}>{address}</p>
      <p>Connect Wallet</p>
      {isConnected ? (
        <button
          className="bg-[#0052FF] flex space-x-2 items-center p-[12px_16px] justify-between text-lg text-white rounded-[10px]"
          style={{
            backgroundColor: "#0052FF",
            display: "flex",
            alignItems: "center"
          }}
          onClick={() => {
            disconnect({ connector })
          }}>
          Disconnect Wallet
        </button>
      ) : (
        <button onClick={() => connect({ connector })}>Connect Wallet</button>
      )}
    </div>
  )
}
