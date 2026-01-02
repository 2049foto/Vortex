import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

// CORS
app.use("*", cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://vortex-frontend.vercel.app",
    "*"
  ],
  credentials: true
}));

// Health Check (Critical)
app.get("/api/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "production"
  });
});

// Chains endpoint
app.get("/api/chains", (c) => {
  const chains = [
    { id: 56, name: "BSC" },
    { id: 8453, name: "Base" },
    { id: 42161, name: "Arbitrum" },
    { id: 137, name: "Polygon" },
    { id: 1, name: "Ethereum" },
    { id: 43114, name: "Avalanche" },
    { id: 10, name: "Optimism" },
    { id: 838592, name: "Monad" },
    { id: "solana", name: "Solana" }
  ];
  return c.json(chains);
});

// Scan endpoint (Minimal working version)
app.post("/api/scan", async (c) => {
  try {
    const { address } = await c.req.json();
    
    if (!address || !address.startsWith("0x")) {
      return c.json({ error: "Invalid address" }, 400);
    }
    
    // Simulate scan (replace with real logic later)
    const mockTokens = [
      {
        address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        symbol: "USDC",
        chain: "Base",
        balance: "1000",
        usdValue: 1000,
        category: "premium"
      }
    ];
    
    return c.json({
      scanId: Date.now().toString(),
      tokens: mockTokens,
      summary: { totalValue: 1000, premium: 1, dust: 0, risk: 0 }
    });
  } catch (error) {
    console.error("Scan error:", error);
    return c.json({ error: "Scan failed" }, 500);
  }
});

// Export for Vercel
export default app;
