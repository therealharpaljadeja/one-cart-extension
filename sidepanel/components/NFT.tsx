import { CloseIcon } from "@chakra-ui/icons"
import { Button, Flex, IconButton, Text, VStack } from "@chakra-ui/react"
import { formatEther } from "viem"

export default function NFT({
  image,
  title,
  collectionTitle,
  price,
  currency,
  removeItem
}) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        justifyContent: "space-between"
      }}>
      <Flex>
        <div
          style={{
            marginRight: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start"
          }}>
          <img style={{ width: "85px", height: "70px" }} src={image} />
        </div>
        <Flex flexDirection={"column"} gap="2" alignItems={"flex-start"}>
          <VStack gap="1" alignItems={"flex-start"}>
            <p
              style={{
                fontSize: "10px",
                fontWeight: 400,
                color: "#555"
              }}>
              {collectionTitle}
            </p>
            <p style={{ fontSize: "16px", fontWeight: 600 }}>{title}</p>
          </VStack>

          <Flex alignItems={"baseline"}>
            <p style={{ fontSize: "18px", fontWeight: 600 }}>
              {formatEther(BigInt(price))}
            </p>
            <Text color="darkslategrey">{currency}</Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex justifyContent={"flex-end"}>
        <Button
          aria-label="remove-item"
          leftIcon={<CloseIcon boxSize={2} />}
          colorScheme="red"
          onClick={removeItem}
          size="xs"
          variant={"ghost"}>
          Remove
        </Button>
      </Flex>
    </div>
  )
}
