import Popup from "./panel"
import OnchainProviders from "./wagmi"

export default function IndexPopup() {
  return (
    <OnchainProviders>
      <Popup />
    </OnchainProviders>
  )
}
