"use client"

import { SwapModal } from "./SwapModal"
import { useSwapModal } from "@/contexts/SwapContext"

export function SwapModalProvider() {
  const { isSwapModalOpen, closeSwapModal } = useSwapModal()

  return (
    <SwapModal
      isOpen={isSwapModalOpen}
      onClose={closeSwapModal}
    />
  )
}
