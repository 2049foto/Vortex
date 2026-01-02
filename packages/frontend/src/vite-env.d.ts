/// <reference types="vite/client" />

/**
 * Vite environment variables
 * Supports both VITE_* (Vite standard) and NEXT_PUBLIC_* (for compatibility)
 */
interface ImportMetaEnv {
  // App
  readonly VITE_APP_NAME?: string;
  readonly NEXT_PUBLIC_APP_NAME?: string;
  readonly VITE_APP_URL?: string;
  readonly NEXT_PUBLIC_APP_URL?: string;
  readonly VITE_API_URL?: string;
  
  // Wallet
  readonly VITE_WALLET_CONNECT_PROJECT_ID?: string;
  readonly NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID?: string;
  readonly VITE_PRIVY_APP_ID?: string;
  readonly NEXT_PUBLIC_PRIVY_APP_ID?: string;
  
  // RPC
  readonly VITE_QUICKNODE_BASE_HTTPS?: string;
  readonly NEXT_PUBLIC_QUICKNODE_BASE_HTTPS?: string;
  readonly VITE_ALCHEMY_BASE_RPC?: string;
  readonly NEXT_PUBLIC_ALCHEMY_BASE_RPC?: string;
  readonly VITE_INFURA_PROJECT_ID?: string;
  readonly NEXT_PUBLIC_INFURA_PROJECT_ID?: string;
  readonly VITE_HELIUS_API_KEY?: string;
  readonly NEXT_PUBLIC_HELIUS_API_KEY?: string;
  
  // Security APIs
  readonly VITE_GOPLUS_API_URL?: string;
  readonly NEXT_PUBLIC_GOPLUS_API_URL?: string;
  
  // Analytics
  readonly VITE_POSTHOG_KEY?: string;
  readonly NEXT_PUBLIC_POSTHOG_KEY?: string;
  readonly VITE_POSTHOG_HOST?: string;
  readonly NEXT_PUBLIC_POSTHOG_HOST?: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly NEXT_PUBLIC_SENTRY_DSN?: string;
  
  // Chains
  readonly VITE_PRIMARY_CHAIN?: string;
  readonly NEXT_PUBLIC_PRIMARY_CHAIN?: string;
  readonly VITE_CHAIN_ID?: string;
  readonly NEXT_PUBLIC_CHAIN_ID?: string;
  readonly VITE_SUPPORTED_CHAINS?: string;
  readonly NEXT_PUBLIC_SUPPORTED_CHAINS?: string;
  
  // Feature Flags
  readonly VITE_ENABLE_ANALYTICS?: string;
  readonly NEXT_PUBLIC_ENABLE_ANALYTICS?: string;
  readonly VITE_ENABLE_GASLESS?: string;
  readonly NEXT_PUBLIC_ENABLE_GASLESS?: string;
  
  // Admin
  readonly VITE_ADMIN_WALLET?: string;
  readonly NEXT_PUBLIC_ADMIN_WALLET?: string;
  
  // [key: string]: any; // Allow any other env vars
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

