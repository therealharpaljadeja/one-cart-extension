import { formatEther } from "viem"

export default function NFT({
  image,
  title,
  collectionTitle,
  price,
  currency
}) {
  return (
    <div style={{ display: "flex", width: "100%", marginBottom: "30px" }}>
      <div
        style={{
          marginRight: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start"
        }}>
        <img style={{ width: "85px", height: "70px" }} src={image} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start"
        }}>
        <p style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>
          {title}
        </p>
        <p
          style={{
            fontSize: "12px",
            fontWeight: 400,
            color: "#555",
            marginBottom: "10px"
          }}>
          {collectionTitle}
        </p>
        <p style={{ fontSize: "14px", fontWeight: 600, color: "#222" }}>
          {formatEther(BigInt(price))} {currency.trim()}
        </p>
      </div>
    </div>
  )
}
