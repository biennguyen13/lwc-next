"use client"

import { useEffect } from "react"
import { listenForAuthSync, reloadTab } from "@/lib/simple-tab-sync"

export function useAuthSync() {
  useEffect(() => {
    console.log('🔄 Setting up auth sync listener...')
    
    const cleanup = listenForAuthSync((action) => {
      console.log('🔄 Auth sync received:', action)
      
      if (action === 'login' || action === 'logout') {
        console.log(`🔄 ${action} detected in another tab, reloading...`)
        
        // Small delay to ensure console logs are visible
        reloadTab()
      }
    })
    
    console.log('✅ Auth sync listener set up')
    
    return cleanup
  }, [])
}
