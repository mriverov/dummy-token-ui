import { AnyAction } from 'redux'
import {
  ConnectWalletFailureAction,
  ConnectWalletSuccessAction,
  CONNECT_WALLET_FAILURE,
  CONNECT_WALLET_REQUEST,
  CONNECT_WALLET_SUCCESS,
  TRANSFER_TOKEN_REQUEST,
  TRANSFER_TOKEN_SUCCESS,
  TRANSFER_TOKEN_FAILURE,
  SET_BALANCE,
} from './actions'
import { WalletState } from './types'

const INITIAL_STATE: WalletState = {
  address: null,
  balance: '0 DUMMY',
  isConnecting: false,
  isTransferring: false,
  error: null,
}

export function walletReducer(state: WalletState = INITIAL_STATE, action: AnyAction): WalletState {
  switch (action.type) {
    case CONNECT_WALLET_REQUEST: {
      return {
        ...state,
        isConnecting: true,
        error: null,
      }
    }
    case CONNECT_WALLET_SUCCESS: {
      const { address, balance } = action.payload as ConnectWalletSuccessAction['payload']
      return {
        ...state,
        isConnecting: false,
        address,
        balance,
        error: null,
      }
    }

    case CONNECT_WALLET_FAILURE: {
      const { error } = action.payload as ConnectWalletFailureAction['payload']
      return {
        ...state,
        isConnecting: false,
        error,
      }
    }

    case TRANSFER_TOKEN_REQUEST:
      return { ...state, isTransferring: true, error: null }

    case TRANSFER_TOKEN_SUCCESS:
      return { ...state, isTransferring: false, error: null }

    case TRANSFER_TOKEN_FAILURE:
      return { ...state, isTransferring: false, error: action.payload.error }

    case SET_BALANCE: {
      return { ...state, balance: action.payload.balance }
    }

    default:
      return state
  }
}
