import { walletReducer } from './reducer'
import {
  CONNECT_WALLET_REQUEST,
  CONNECT_WALLET_SUCCESS,
  CONNECT_WALLET_FAILURE,
  TRANSFER_TOKEN_REQUEST,
  TRANSFER_TOKEN_SUCCESS,
  TRANSFER_TOKEN_FAILURE,
  setBalance,
} from './actions'

test('CONNECT_WALLET_REQUEST activates isConnecting', () => {
  const s = walletReducer(undefined, { type: CONNECT_WALLET_REQUEST })
  expect(s.isConnecting).toBe(true)
})

test('CONNECT_WALLET_SUCCESS sets address and clears error', () => {
  const s = walletReducer(undefined, {
    type: CONNECT_WALLET_SUCCESS,
    payload: { address: '0xabc', balance: '100 DUMMY' },
  })
  expect(s.address).toBe('0xabc')
  expect(s.error).toBeNull()
})

test('TRANSFER_TOKEN_REQUEST activa isTransferring', () => {
  const s = walletReducer(undefined, { type: TRANSFER_TOKEN_REQUEST })
  expect(s.isTransferring).toBe(true)
})

test('TRANSFER_TOKEN_FAILURE deactivates isTransferring and sets error', () => {
  const s = walletReducer(undefined, {
    type: TRANSFER_TOKEN_FAILURE,
    payload: { error: 'boom' },
  })
  expect(s.isTransferring).toBe(false)
  expect(s.error).toBe('boom')
})

test('setBalance updates balance', () => {
  const s = walletReducer(undefined, setBalance('123 DUMMY'))
  expect(s.balance).toBe('123 DUMMY')
})

test('CONNECT_WALLET_FAILURE deactivates isConnecting and sets error', () => {
  const s = walletReducer(undefined, {
    type: CONNECT_WALLET_FAILURE,
    payload: { error: 'User rejected' },
  })
  expect(s.isConnecting).toBe(false)
  expect(s.error).toBe('User rejected')
})

test('TRANSFER_TOKEN_SUCCESS deactivates isTransferring and clears error', () => {
  const s = walletReducer(
    {
      address: '0xabc',
      balance: '100 DUMMY',
      isConnecting: false,
      isTransferring: true,
      error: 'Previous error',
    },
    {
      type: TRANSFER_TOKEN_SUCCESS,
      payload: { txHash: '0xtx123' },
    },
  )
  expect(s.isTransferring).toBe(false)
  expect(s.error).toBeNull()
})

test('initial state is correct', () => {
  const s = walletReducer(undefined, { type: 'UNKNOWN_ACTION' })
  expect(s).toEqual({
    address: null,
    balance: '0 DUMMY',
    isConnecting: false,
    isTransferring: false,
    error: null,
  })
})
