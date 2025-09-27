/* eslint-disable no-empty-pattern */
import { screen, fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../test/test-utils'
import ConnectedApp from './index'

test('show balance from store', () => {
  renderWithProviders(<ConnectedApp />, {
    preloadedState: {
      wallet: { address: '0xabc', balance: '100 DUMMY', isConnecting: false, isTransferring: false, error: null }
    }
  })
  expect(screen.getByText(/100 DUMMY/i)).toBeInTheDocument()
})

test('show Connect when not connected', () => {
  renderWithProviders(<ConnectedApp />, {
    preloadedState: {
      wallet: { address: null, balance: '0 DUMMY', isConnecting: false, isTransferring: false, error: null }
    }
  })
  expect(screen.getByRole('button', { name: /connect/i })).toBeInTheDocument()
})

test('show loading in Connect when connecting', () => {
  renderWithProviders(<ConnectedApp />, {
    preloadedState: {
      wallet: { address: null, balance: '0 DUMMY', isConnecting: true, isTransferring: false, error: null }
    }
  })
  expect(screen.getByRole('button', { name: /connect/i })).toBeInTheDocument()
})

test('show error when there is an error', () => {
  renderWithProviders(<ConnectedApp />, {
    preloadedState: {
      wallet: { address: null, balance: '0 DUMMY', isConnecting: false, isTransferring: false, error: 'Connection failed' }
    }
  })
  expect(screen.getByText('Connection failed')).toBeInTheDocument()
})

test('allow open transfer modal when connected', async () => {
  renderWithProviders(<ConnectedApp />, {
    preloadedState: {
      wallet: { address: '0xabc', balance: '100 DUMMY', isConnecting: false, isTransferring: false, error: null }
    }
  })
  
  const transferButton = screen.getByRole('button', { name: /transfer/i })
  fireEvent.click(transferButton)
  
  expect(screen.getByText(/send tokens to an account/i)).toBeInTheDocument()
})
