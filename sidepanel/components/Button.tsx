import { CoinbaseWalletLogo } from "./CoinbaseWalletLogo"

export default function Button({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      style={{
        backgroundColor: "#0052FF",
        display: "flex",
        border: "none",
        width: "100%",
        alignItems: "center",
        padding: "12px 16px",
        justifyContent: "center",
        fontSize: "16px",
        color: "white",
        borderRadius: "10px"
      }}
      {...props}>
      <CoinbaseWalletLogo />
      {children}
    </button>
  )
}
