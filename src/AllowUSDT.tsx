import { useWriteContract } from "wagmi"

export function AllowUSDT() {
    const {data, writeContract} = useWriteContract()

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        writeContract({
            address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            abi: [{
                "constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"
            }],
            functionName: "approve",
            args: ['0x71fda82BbdD8659bA0C779883Bb2BDD52B79d138', BigInt(1)]
        })
    }

    return (
        <form onSubmit={submit}>
            <input id="tokenId" placeholder="4343" required />
            <button type="submit">Approve</button>
            {data && <div>Transaction Hash : {data}</div>}
        </form>
    )
}