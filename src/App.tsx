import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import { useAccount, useConnect, useDisconnect, useReadContract, WagmiProvider } from "wagmi"

import { config } from './config';
import { AllowUSDT } from './AllowUSDT';
const client = new QueryClient();
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { Toaster } from '@/components/ui/toaster'
import { TokenTools } from '@/components/token-tools'

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <ThemeProvider>
          <div className="min-h-screen w-full bg-background text-foreground">
            <div className="relative">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_60%)]" />
            </div>
            <div className="mx-auto max-w-4xl p-6 space-y-6">
              <header className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Eth-wallet-adapter</h1>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <ConnectionAlert />
                </div>
              </header>
              <Separator />

              <Card>
                <CardHeader>
                  <CardTitle>Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <Account />
                </CardContent>
              </Card>

              <TokenTools />

              <Card>
                <CardHeader>
                  <CardTitle>USDT Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <TotalSupply />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Allow USDT</CardTitle>
                </CardHeader>
                <CardContent>
                  <AllowUSDT />
                </CardContent>
              </Card>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

function Account() {
  const { address } = useAccount();
  return (
    <div className="text-sm">
      {address ? (
        <p className="truncate">Your address: {address}</p>
      ) : (
        <p className="text-muted-foreground">You are not connected to an account</p>
      )}
    </div>
  )
}

function ConnectionAlert() {
  const { connect, connectors} = useConnect();
  const { disconnect} = useDisconnect();
  const { address } = useAccount();

  if(address) {
    return (
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline text-sm truncate max-w-[200px]">{address}</span>
        <Button variant="secondary" onClick={() => disconnect()}>Disconnect</Button>
      </div>
    )
  }

  return (
    <div className="flex gap-2"> 
      {connectors.map((connector) => (
        <Button onClick={() => connect({connector: connector})} key={connector.id}>
          Connect via {connector.name}
        </Button>
      ))}
    </div>
  )
}

function TotalSupply() {


  const {data, isLoading, error} = useReadContract({
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    abi: [
      {"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}
    ],
    functionName: "balanceOf",
    args: ["0x71fda82BbdD8659bA0C779883Bb2BDD52B79d138"],
  })

  if(isLoading) return <div>Loading...</div>
  if(error) return <div>Error: {error.message}</div>
  
  return (
    <p className="font-mono">{data?.toString()}</p>
  )
}
export default App