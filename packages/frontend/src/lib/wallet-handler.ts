// Prevent multiple wallet extension conflicts

export function initializeWalletHandler() {
  // Priority: MetaMask > Coinbase > Others
  if (typeof window !== 'undefined') {
    const providers: any[] = []
    
    // Detect all providers
    if (window.ethereum?.providers) {
      providers.push(...window.ethereum.providers)
    } else if (window.ethereum) {
      providers.push(window.ethereum)
    }
    
    // Find MetaMask
    const metamask = providers.find((p: any) => p.isMetaMask && !p.isBraveWallet)
    
    // Set primary provider
    if (metamask) {
      window.ethereum = metamask
    }
    
    // Silence errors
    window.addEventListener('error', (e) => {
      if (e.message.includes('ethereum') || e.message.includes('wallet')) {
        e.preventDefault()
        console.warn('Wallet extension conflict (handled)')
      }
    })
  }
}
