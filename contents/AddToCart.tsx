import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"

import { sendToBackground } from "@plasmohq/messaging"
import { useStorage } from "@plasmohq/storage/hook"

export const config: PlasmoCSConfig = {
  matches: ["https://zora.co/collect/base:*"]
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () =>
  document.querySelector(
    'button[data-testid="connect-trigger"].Button_--size-large__2b6m4'
  ) ||
  document.querySelector(
    'button[data-testid="mint-sale-public"].Button_--size-large__2b6m4'
  )

export default function AddToCart() {
  const [cart, setCart] = useStorage("cart")

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
          cursor: "pointer"
        }}
        onClick={() => {
          // console.log("Pressed Add to Cart")
          sendToBackground({
            name: "mint",
            body: {
              url: location.href
            }
          })
        }}>
        Add to Cart
      </button>
    </div>
  )
}
