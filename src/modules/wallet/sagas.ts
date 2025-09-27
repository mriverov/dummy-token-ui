import { ethers } from 'ethers'
import { call, put, takeEvery } from 'redux-saga/effects'
import { isErrorWithMessage } from '../utils'
import {
  connectWalletFailure,
  connectWalletSuccess,
  CONNECT_WALLET_REQUEST,
  TRANSFER_TOKEN_REQUEST,
  TransferTokenRequestAction,
  transferTokenSuccess,
  transferTokenFailure,
  setBalance,
} from './actions'
import { WindowWithEthereum } from './types'

// The regular `window` object with `ethereum` injected by MetaMask
const windowWithEthereum = window as unknown as WindowWithEthereum

/* This is the Dummy Token address, it identifies the token contract once deployed */
export const TOKEN_ADDRESS = import.meta.env.VITE_TOKEN_ADDRESS
if (!TOKEN_ADDRESS) {
  console.error(`Missing env variable VITE_TOKEN_ADDRESS`)
}

const DECIMALS = 0

export const TOKEN_ABI = [
  'function symbol() view returns (string)',
  'function balanceOf(address) view returns (uint)',
  'function transfer(address to, uint amount)',
]

function getProvider() {
  const eth = windowWithEthereum?.ethereum
  if (!eth || typeof eth.request !== 'function') {
    throw new Error('No Ethereum provider found. Install MetaMask.')
  }
  return new ethers.BrowserProvider(eth)
}

function* requestAccounts(provider: ethers.BrowserProvider) {
  yield call(() => provider.send('eth_requestAccounts', []))
}

function* getSigner(provider: ethers.BrowserProvider) {
  return (yield call(() => provider.getSigner())) as ethers.Signer
}

function getToken(reader: ethers.Signer | ethers.BrowserProvider) {
  if (!TOKEN_ADDRESS) throw new Error('Missing VITE_TOKEN_ADDRESS')
  return new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, reader)
}

function* readPrettyBalance(token: ethers.Contract, address: string) {
  const raw: bigint = (yield call(() => token.balanceOf(address))) as bigint
  const symbol: string = (yield call(() => token.symbol().catch(() => 'TOKEN'))) as string
  return `${ethers.formatUnits(raw, DECIMALS)} ${symbol}`
}

export function* walletSaga() {
  yield takeEvery(CONNECT_WALLET_REQUEST, handleConnectWalletRequest)
  yield takeEvery(TRANSFER_TOKEN_REQUEST, handleTransferTokenRequest)
}


function* handleConnectWalletRequest() {
  try {
    const provider: ethers.BrowserProvider = yield call(getProvider)
    yield* requestAccounts(provider)

    const signer = (yield* getSigner(provider)) as ethers.Signer
    const address = (yield call(() => signer.getAddress())) as string

    const token = getToken(provider) 
    const pretty = (yield call(() => readPrettyBalance(token, address))) as string

    yield put(connectWalletSuccess(address, pretty))
  } catch (error) {
    const msg = isErrorWithMessage(error) ? error.message : 'Unknown error'
    yield put(connectWalletFailure(msg))
  }
}

function* handleTransferTokenRequest(action: TransferTokenRequestAction) {
  try {
    const { to, amount } = action.payload

    const provider: ethers.BrowserProvider = yield call(getProvider)


    const signer = (yield* getSigner(provider)) as ethers.Signer
    const token = getToken(signer) 

    const value = ethers.parseUnits(amount.trim(), DECIMALS)
    const tx = (yield call(() => token.transfer(to.trim(), value))) as ethers.TransactionResponse
    yield call(() => tx.wait())

    const fromAddress = (yield call(() => signer.getAddress())) as string
    const pretty = (yield call(() => readPrettyBalance(token, fromAddress))) as string

    yield put(transferTokenSuccess(tx.hash))
    yield put(setBalance(pretty))
  } catch (error) {
    const msg = isErrorWithMessage(error) ? error.message : 'Unknown error'
    yield put(transferTokenFailure(msg))
  }
}
