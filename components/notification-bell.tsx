"use client"

import { useState } from "react"
import { EmailSubscriptionModal } from "./email-subscription-modal"

export function NotificationBell() {
  const [showModal, setShowModal] = useState(false)
  const [hasNotifications, setHasNotifications] = useState(true)

  return (
    <>
      <button onClick={() => setShowModal(true)} className="p-2 hover:bg-muted rounded-lg transition-colors relative">
        <span className="text-muted-foreground text-lg">🔔</span>
        {hasNotifications && <span className="absolute top-1 right-1 h-2 w-2 bg-accent rounded-full" />}
      </button>
      <EmailSubscriptionModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}
