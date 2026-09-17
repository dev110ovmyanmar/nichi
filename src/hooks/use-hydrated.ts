"use client"

import { useSyncExternalStore } from "react"

function subscribeNever() {
  return () => {}
}

export function useHydrated() {
  return useSyncExternalStore(subscribeNever, () => true, () => false)
}
