/* eslint-disable @typescript-eslint/no-unused-vars */
import '@testing-library/jest-dom'
import type { Eip1193Provider } from 'ethers'

type EthereumLike = Eip1193Provider & {
  on?: (event: string, listener: (...args: unknown[]) => void) => void
  removeListener?: (event: string, listener: (...args: unknown[]) => void) => void
}

declare global {
  interface Window {
    ethereum?: EthereumLike
  }
}

if (typeof window !== 'undefined' && !window.ethereum) {
  const mockEthereum: EthereumLike = {
    request: async (_args: { method: string; params?: unknown[] | object }) => undefined,
    on: () => undefined,
    removeListener: () => undefined
  }
  window.ethereum = mockEthereum
}
