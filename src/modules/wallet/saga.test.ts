import { runSaga } from 'redux-saga'
import { vi, beforeEach, test, expect } from 'vitest'
import { handleConnectWalletRequest, handleTransferTokenRequest } from './sagas'
import { transferTokenRequest } from './actions'

// Mocks ethers
const mockSigner = {
  getAddress: vi.fn().mockResolvedValue('0x1234567890abcdef1234567890abcdef12345678'),
}

const mockTx = {
  wait: vi.fn().mockResolvedValue({}),
  hash: '0xtxhash123',
}

const mockContract = {
  symbol: vi.fn().mockResolvedValue('DUMMY'),
  balanceOf: vi.fn().mockResolvedValue(100n),
  transfer: vi.fn().mockResolvedValue(mockTx),
}

const mockProvider = {
  send: vi.fn().mockResolvedValue(['0x1234567890abcdef1234567890abcdef12345678']),
  getSigner: vi.fn().mockResolvedValue(mockSigner),
}

vi.mock('ethers', () => ({
  ethers: {
    BrowserProvider: vi.fn().mockImplementation(() => mockProvider),
    Contract: vi.fn().mockImplementation(() => mockContract),
    parseUnits: (value: string, decimals: number) => BigInt(value),
    formatUnits: (value: bigint, decimals: number) => value.toString(),
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
  mockSigner.getAddress.mockResolvedValue('0x1234567890abcdef1234567890abcdef12345678')
  mockContract.symbol.mockResolvedValue('DUMMY')
  mockContract.balanceOf.mockResolvedValue(100n)
  mockContract.transfer.mockResolvedValue(mockTx)
  mockTx.wait.mockResolvedValue({})
  mockProvider.send.mockResolvedValue(['0x1234567890abcdef1234567890abcdef12345678'])
  mockProvider.getSigner.mockResolvedValue(mockSigner)
  ;(globalThis as any).window = {
    ethereum: {
      request: vi.fn().mockResolvedValue(['0x1234567890abcdef1234567890abcdef12345678']),
    },
  }
})

test('handleConnectWalletRequest dispatch connectWalletSuccess with correct address and balance', async () => {
  const dispatched: any[] = []

  await runSaga(
    { dispatch: action => dispatched.push(action) },
    handleConnectWalletRequest,
  ).toPromise()

  const successAction = dispatched.find(action => action.type === '[Success] Connect Wallet')
  expect(successAction).toBeTruthy()
  expect(successAction.payload.address).toBe('0x1234567890abcdef1234567890abcdef12345678')
  expect(successAction.payload.balance).toBe('100 DUMMY')

  expect(mockProvider.send).toHaveBeenCalledWith('eth_requestAccounts', [])
  expect(mockSigner.getAddress).toHaveBeenCalled()
  expect(mockContract.balanceOf).toHaveBeenCalledWith('0x1234567890abcdef1234567890abcdef12345678')
  expect(mockContract.symbol).toHaveBeenCalled()
})

test('handleConnectWalletRequest dispatch connectWalletFailure when connection fails', async () => {
  const dispatched: any[] = []

  mockSigner.getAddress.mockRejectedValue(new Error('User rejected'))

  await runSaga(
    { dispatch: action => dispatched.push(action) },
    handleConnectWalletRequest,
  ).toPromise()

  const failureAction = dispatched.find(action => action.type === '[Failure] Connect Wallet')
  expect(failureAction).toBeTruthy()
  expect(failureAction.payload.error).toBe('User rejected')
})

test('handleConnectWalletRequest dispatch connectWalletFailure when balance fails', async () => {
  const dispatched: any[] = []

  mockContract.balanceOf.mockRejectedValue(new Error('Contract error'))

  await runSaga(
    { dispatch: action => dispatched.push(action) },
    handleConnectWalletRequest,
  ).toPromise()

  const failureAction = dispatched.find(action => action.type === '[Failure] Connect Wallet')
  expect(failureAction).toBeTruthy()
  expect(failureAction.payload.error).toBe('Contract error')
})

test('handleTransferTokenRequest dispatch transferTokenSuccess correctly', async () => {
  const dispatched: any[] = []
  const action = transferTokenRequest({ to: '0xto', amount: '10' })

  await runSaga(
    { dispatch: action => dispatched.push(action) },
    handleTransferTokenRequest,
    action,
  ).toPromise()

  const successAction = dispatched.find(action => action.type === '[Success] Transfer Token')
  expect(successAction).toBeTruthy()
  expect(successAction.payload.txHash).toBe('0xtxhash123')

  // setBalance is not dispatched in the current implementation
  const setBalanceAction = dispatched.find(action => action.type === '[State] Set Balance')
  expect(setBalanceAction).toBeFalsy()

  expect(mockContract.transfer).toHaveBeenCalledWith('0xto', 10n)
  expect(mockTx.wait).toHaveBeenCalled()
})

test('handleTransferTokenRequest dispatch transferTokenFailure when transfer fails', async () => {
  const dispatched: any[] = []
  const action = transferTokenRequest({ to: '0xto', amount: '10' })

  mockContract.transfer.mockRejectedValue(new Error('Insufficient funds'))

  await runSaga(
    { dispatch: action => dispatched.push(action) },
    handleTransferTokenRequest,
    action,
  ).toPromise()

  const failureAction = dispatched.find(action => action.type === '[Failure] Transfer Token')
  expect(failureAction).toBeTruthy()
  expect(failureAction.payload.error).toBe('Insufficient funds')
})

test('handleTransferTokenRequest handles unknown errors', async () => {
  const dispatched: any[] = []
  const action = transferTokenRequest({ to: '0xto', amount: '10' })

  mockContract.transfer.mockRejectedValue({})

  await runSaga(
    { dispatch: action => dispatched.push(action) },
    handleTransferTokenRequest,
    action,
  ).toPromise()

  const failureAction = dispatched.find(action => action.type === '[Failure] Transfer Token')
  expect(failureAction).toBeTruthy()
  expect(failureAction.payload.error).toBe('Unknown error')
})
