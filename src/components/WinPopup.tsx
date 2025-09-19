"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

interface WinPopupProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  duration?: number
}

export function WinPopup({ isOpen, onClose, amount, duration = 3000 }: WinPopupProps) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Set mounted to true after component mounts
    setMounted(true)
    
    // Create audio element for sound effect
    const winSound = new Audio('/sounds/win.mp3') // You'll need to add this sound file
    winSound.volume = 0.5
    setAudio(winSound)
  }, [])

  useEffect(() => {
    if (isOpen && audio) {
      // Play win sound
      audio.play().catch(console.error)
      
      // Auto close after duration
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Don't render until mounted (to avoid hydration issues)
  if (!mounted) return null

  if (!isOpen) return null

  const formatAmount = (amount: number) => {
    return `+$${amount.toFixed(2)}`
  }

  const popupContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
        <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, rotate: 180, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.8
          }}
          className="relative"
        >
          {/* Win Frame SVG with animated amount */}
          <div className="relative">
            <img 
              src="/images/win_frame_v2.37faa767.svg" 
              alt="Win Frame"
              className="w-[400px] md:w-[500px] h-auto drop-shadow-2xl"
            />
            
            {/* Congratulation Text */}
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="absolute top-[45%] left-0 right-0 flex items-center justify-center"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                className="text-2xl font-bold text-yellow-300 drop-shadow-lg"
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.5)'
                }}
              >
                🎉 Xin chúc mừng! 🎉
              </motion.span>
            </motion.div>

            {/* Amount overlay */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute top-[60%] left-0 right-0 flex items-center justify-center"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 300 }}
                className="text-5xl font-bold text-yellow-400 drop-shadow-lg"
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.5)'
                }}
              >
                {formatAmount(amount)}
              </motion.span>
            </motion.div>

            {/* Sparkle effects */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute inset-0 pointer-events-none"
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ 
                    scale: [0, 1, 0],
                    rotate: [0, 360],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    delay: 1.0 + i * 0.1,
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                  className="absolute text-yellow-300 text-2xl"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + (i % 2) * 40}%`
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Close button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={onClose}
            className="absolute -top-8 right-0 w-12 h-12  text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg transition-colors"
          >
            <X className="w-8 h-8" />
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  )

  // Use Portal to render outside of the component tree
  return createPortal(popupContent, document.body)
}
