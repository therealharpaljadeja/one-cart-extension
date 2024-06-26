import { motion } from "framer-motion"
import React from "react"

const CheckmarkAnimation = () => {
  const circleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (custom) => ({
      scale: 1,
      opacity: custom.opacity,
      transition: {
        delay: custom.delay,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  }

  const checkmarkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        delay: 0.7,
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  }

  const circles = [
    { radius: 55, opacity: 0.3, delay: 0 },
    { radius: 50, opacity: 0.6, delay: 0.1 },
    { radius: 45, opacity: 1, delay: 0.2 }
  ]

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="120"
      height="120"
      viewBox="0 0 120 120">
      {circles.map((circle, index) => (
        <motion.circle
          key={index}
          cx="60"
          cy="60"
          r={circle.radius}
          fill="#0052ff"
          variants={circleVariants}
          custom={circle}
          initial="hidden"
          animate="visible"
        />
      ))}
      <motion.path
        d="M40 60 L55 75 L85 45"
        fill="none"
        stroke="#ffffff"
        strokeWidth="6"
        strokeLinejoin="miter"
        strokeLinecap="butt"
        variants={checkmarkVariants}
        initial="hidden"
        animate="visible"
      />
    </motion.svg>
  )
}

export default CheckmarkAnimation
