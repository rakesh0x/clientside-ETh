import { useState, useMemo } from 'react'
import { isAddress, formatUnits, type Address } from 'viem'
import { mainnet, sepolia } from 'wagmi/chains'
import { useReadContract } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

const erc20Abi = [
  { name: 'name', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'string' }] },
  { name: 'symbol', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'string' }] },
  { name: 'decimals', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'uint8' }] },
  { name: 'totalSupply', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
] as const

const CHAINS = [mainnet, sepolia]

export function TokenTools() {
  const [address, setAddress] = useState<string>('0x6B175474E89094C44Da98b954EedeAC495271d0F')
  const [chainId, setChainId] = useState<number>(mainnet.id)

  const enabled = isAddress(address)
  const addr = useMemo(() => (enabled ? (address as Address) : undefined), [enabled, address])

  const name = useReadContract({ address: addr, abi: erc20Abi, functionName: 'name', chainId, query: { enabled } })
  const symbol = useReadContract({ address: addr, abi: erc20Abi, functionName: 'symbol', chainId, query: { enabled } })
  const decimals = useReadContract({ address: addr, abi: erc20Abi, functionName: 'decimals', chainId, query: { enabled } })
  const totalSupply = useReadContract({ address: addr, abi: erc20Abi, functionName: 'totalSupply', chainId, query: { enabled } })

  const formattedSupply = useMemo(() => {
    if (!totalSupply.data || !decimals.data) return undefined
    try { return formatUnits(totalSupply.data as bigint, Number(decimals.data)) } catch { return undefined }
  }, [totalSupply.data, decimals.data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Tools</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <Label htmlFor="token">Token address</Label>
          <Input id="token" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="0x..." />
        </div>
        <div className="grid gap-3">
          <Label>Network</Label>
          <Select value={String(chainId)} onValueChange={(v) => setChainId(Number(v))}>
            <SelectTrigger><SelectValue placeholder="Select a chain" /></SelectTrigger>
            <SelectContent>
              {CHAINS.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="meta" className="pt-2">
          <TabsList>
            <TabsTrigger value="meta">Metadata</TabsTrigger>
            <TabsTrigger value="supply">Total Supply</TabsTrigger>
          </TabsList>

          <TabsContent value="meta" className="space-y-2">
            <Field label="Name" value={name.data as string} loading={name.isLoading} error={name.error?.message} />
            <Field label="Symbol" value={symbol.data as string} loading={symbol.isLoading} error={symbol.error?.message} />
            <Field label="Decimals" value={decimals.data as number} loading={decimals.isLoading} error={decimals.error?.message} />
          </TabsContent>

          <TabsContent value="supply">
            <Field label="Raw" value={(totalSupply.data as bigint)?.toString()} loading={totalSupply.isLoading} error={totalSupply.error?.message} />
            <Field label="Formatted" value={formattedSupply} loading={totalSupply.isLoading || decimals.isLoading} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function Field({ label, value, loading, error }: { label: string; value: string | number | undefined; loading?: boolean; error?: string }) {
  if (loading) return <div className="space-y-1"><div className="text-sm text-muted-foreground">{label}</div><Skeleton className="h-5 w-40" /></div>
  if (error) return <div className="space-y-1"><div className="text-sm text-muted-foreground">{label}</div><div className="text-destructive text-sm">{error}</div></div>
  return (
    <div className="space-y-1">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="font-mono text-sm break-all">{value ?? '—'}</div>
    </div>
  )
}


