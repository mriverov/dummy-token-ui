/* eslint-disable @typescript-eslint/no-unused-vars */
import '@testing-library/jest-dom'
import type { Eip1193Provider } from 'ethers'
import React from 'react'

// Mock ethers
vi.mock('ethers', () => ({
  ethers: {
    isAddress: (address: string) => /^0x[a-fA-F0-9]{40}$/.test(address),
    formatUnits: (value: bigint, decimals: number) => {
      const divisor = BigInt(10 ** decimals)
      const whole = value / divisor
      const remainder = value % divisor
      if (remainder === 0n) {
        return whole.toString()
      }
      return `${whole}.${remainder.toString().padStart(decimals, '0').replace(/0+$/, '')}`
    },
  },
}))

// Mock Decentraland UI components
vi.mock('decentraland-ui', () => ({
  Button: ({ children, onClick, disabled, loading, primary, basic, type, ...props }: any) => {
    return React.createElement(
      'button',
      {
        onClick,
        disabled: disabled || loading,
        className: `button ${loading ? 'loading' : ''} ${primary ? 'primary' : ''} ${basic ? 'basic' : ''}`,
        type,
        ...props,
      },
      children,
    )
  },
  Card: ({ children, ...props }: any) => {
    return React.createElement('div', { className: 'card', ...props }, children)
  },
  Header: ({ children, size, ...props }: any) => {
    const Tag = size === 'large' ? 'h1' : 'h2'
    return React.createElement(Tag, { className: 'header', ...props }, children)
  },
  Field: ({ label, placeholder, value, onChange, disabled, error, message, ...props }: any) => {
    return React.createElement('div', { className: 'field' }, [
      label && React.createElement('label', { key: 'label' }, label),
      React.createElement('input', {
        key: 'input',
        placeholder,
        value,
        onChange,
        disabled,
        className: error ? 'error' : '',
        ...props,
      }),
      message &&
        React.createElement('div', { key: 'message', className: 'error-message' }, message),
    ])
  },
  Center: ({ children, ...props }: any) => {
    return React.createElement('div', { className: 'center', ...props }, children)
  },
}))

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
    removeListener: () => undefined,
  }
  window.ethereum = mockEthereum
}
