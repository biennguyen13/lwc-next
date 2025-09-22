"use client"

// Key để sync auth state across tabs
const AUTH_SYNC_KEY = 'auth-sync-state'

// Generate random value để trigger storage event
const generateRandomValue = () => {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
}

// Trigger auth sync event
export const triggerAuthSync = (action: 'login' | 'logout') => {
  if (typeof window === 'undefined') return
  
  const syncData = {
    action,
    timestamp: Date.now(),
    random: generateRandomValue()
  }
  
  console.log('🔄 Triggering auth sync:', action, syncData)
  localStorage.setItem(AUTH_SYNC_KEY, JSON.stringify(syncData))
}

// Listen for auth sync events
export const listenForAuthSync = (callback: (action: 'login' | 'logout') => void) => {
  if (typeof window === 'undefined') return () => {}
  
  console.log('👂 Setting up auth sync listener...')
  
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === AUTH_SYNC_KEY && event.newValue) {
      try {
        const syncData = JSON.parse(event.newValue)
        console.log('👂 Auth sync event received:', syncData)
        
        // Call callback with action
        callback(syncData.action)
      } catch (error) {
        console.warn('❌ Failed to parse auth sync data:', error)
      }
    }
  }
  
  // Listen for storage changes
  window.addEventListener('storage', handleStorageChange)
  
  // Cleanup function
  return () => {
    console.log('👂 Cleaning up auth sync listener')
    window.removeEventListener('storage', handleStorageChange)
  }
}

// Reload current tab
export const reloadTab = () => {
  if (typeof window === 'undefined') return
  
  console.log('🔄 Reloading tab...')
  window.location.reload()
}
