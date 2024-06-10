import Popup from "./popup"
import OnchainProviders from "./wagmi"

export default function IndexPopup() {
  return (
    <OnchainProviders>
      <Popup />
    </OnchainProviders>
  )
}
