import { Text, VStack } from "@chakra-ui/react"

import CheckmarkAnimation from "./CheckmarkAnimation"

export default function SuccessScreen({ onClose }) {
  return (
    <div
      style={{
        backgroundColor: "white",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        boxSizing: "border-box",
        alignItems: "center",
        justifyContent: "center"
      }}>
      <VStack gap="5">
        <CheckmarkAnimation />
        <Text fontSize={"medium"}>Thank you for shopping!</Text>
        <Text
          cursor={"pointer"}
          onClick={onClose}
          textDecoration={"underline"}
          fontSize={"small"}>
          ← Back
        </Text>
      </VStack>
    </div>
  )
}
