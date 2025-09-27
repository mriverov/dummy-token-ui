import { getAddress, getBalance, isConnected, isConnecting, getError, isTransferring } from './selectors'
import { RootState } from '../types'

const mockState: RootState = {
  wallet: {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    balance: '100 DUMMY',
    isConnecting: false,
    isTransferring: false,
    error: null,
  }
}

const mockStateDisconnected: RootState = {
  wallet: {
    address: null,
    balance: '0 DUMMY',
    isConnecting: true,
    isTransferring: false,
    error: 'Connection failed',
  }
}

test('getAddress returns address when connected', () => {
  expect(getAddress(mockState)).toBe('0x1234567890abcdef1234567890abcdef12345678')
})

test('getAddress returns empty string when not connected', () => {
  expect(getAddress(mockStateDisconnected)).toBe('')
})

test('getBalance returns balance when exists', () => {
  expect(getBalance(mockState)).toBe('100 DUMMY')
})

test('getBalance returns empty string when not exists', () => {
  expect(getBalance(mockStateDisconnected)).toBe('0 DUMMY')
})

test('isConnected returns true when there is address', () => {
  expect(isConnected(mockState)).toBe(true)
})

test('isConnected returns false when there is no address', () => {
  expect(isConnected(mockStateDisconnected)).toBe(false)
})

test('isConnecting returns correct state', () => {
  expect(isConnecting(mockState)).toBe(false)
  expect(isConnecting(mockStateDisconnected)).toBe(true)
})

test('isTransferring returns correct state', () => {
  expect(isTransferring(mockState)).toBe(false)
  expect(isTransferring(mockStateDisconnected)).toBe(false)
})

test('getError returns error when exists', () => {
  expect(getError(mockState)).toBeNull()
  expect(getError(mockStateDisconnected)).toBe('Connection failed')
})
