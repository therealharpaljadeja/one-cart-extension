import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  let { item } = req.body
  let { cart } = await chrome.storage.sync.get("cart")
  if (cart) {
    console.log("Cart is already present", cart)
    chrome.storage.sync.set({
      cart: [...cart, item]
    })
  } else {
    console.log("Cart is empty", item)
    chrome.storage.sync.set({
      cart: [item]
    })
  }
}

export default handler
