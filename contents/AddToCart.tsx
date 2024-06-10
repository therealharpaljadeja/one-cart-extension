import type { PlasmoGetInlineAnchor } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://zora.co/collect/base:*"]
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () =>
  document.querySelector('button[data-testid="mint-sale-public"]')

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
          fontWeight: 600
        }}>
        Add to Cart
      </button>
    </div>
  )
}
