"use client"

import { useState, useEffect, useRef } from "react"

interface ScrambleTextProps {
  text: string
  className?: string
}

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"

export function ScrambleText({ text, className = "" }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState("")
  const [isScrambling, setIsScrambling] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const scramble = () => {
    if (isScrambling) return
    setIsScrambling(true)

    let iteration = 0

    clearInterval(intervalRef.current as NodeJS.Timeout)

    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index]
            }
            if (letter === " ") return " "
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join("")
      )

      if (iteration >= text.length) {
        clearInterval(intervalRef.current as NodeJS.Timeout)
        setIsScrambling(false)
        setDisplayText(text)
      }

      iteration += 1 / 4 // Smaller = slower reveal. 1/5 means each letter takes 5 frames to lock
    }, 20) // Faster 20ms refresh rate for smoother "flashing"
  }

  useEffect(() => {
    scramble()

    // Auto rescramble periodically (10 seconds) ONLY for mobile users who can't hover
    let periodicTimer: NodeJS.Timeout | undefined;
    
    // Only set up the timer if the device doesn't support hover
    if (window.matchMedia("(hover: none)").matches || window.innerWidth < 1024) {
      periodicTimer = setInterval(() => {
        scramble()
      }, 10000)
    }

    return () => {
      clearInterval(intervalRef.current as NodeJS.Timeout)
      if (periodicTimer) clearInterval(periodicTimer)
    }
  }, [text])

  return (
    <div
      className={className}
      onMouseEnter={scramble}
      style={{ display: 'inline-block' }}
    >
      {displayText}
    </div>
  )
}
