import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import { useAccount, useConnect, useConnectors, useDisconnect, WagmiProvider } from "wagmi"
import { config } from './config';
const client = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <ConnectionAlert />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

function ConnectionAlert() {
  const { connect, connectors} = useConnect();
  const { disconnect} = useDisconnect();
  const { address } = useAccount();

  if(address) {
    return (
      <div>
        you are connected to the address { address}
        <button onClick={() => {
          disconnect()
        }}>Disconnect
        </button>
      </div>
    )
  }

  return (
    <div> 
      {connectors.map((connector) => (
        <button onClick={() => connect({connector: connector})} key={connector.id}>
          connect via {connector.name} 
        </button>
      ))}
    </div>
  )
}

export default App


