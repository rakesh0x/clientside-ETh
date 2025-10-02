import { createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { fallback } from 'viem'

export const config = createConfig({
  chains: [mainnet],
  transports: {
    // Resilient fallback across multiple public RPCs
    [mainnet.id]: fallback([
      http("https://eth-mainnet.g.alchemy.com/v2/jrwsleF2pRmk5BJQx6fzf")
    ]),
  },
});