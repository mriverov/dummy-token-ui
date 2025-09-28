import { createSelector } from 'reselect'
import type { RootState } from '../store'
import { TOKEN } from '../../constants'

export const selectWallet = (state: RootState) => state.wallet

export const selectAddress = createSelector([selectWallet], w => w?.address ?? null)
export const selectIsConnected = createSelector([selectWallet], w => !!w?.address)
export const selectIsConnecting = createSelector([selectWallet], w => !!w?.isConnecting)
export const selectIsTransferring = createSelector([selectWallet], w => !!w?.isTransferring)
export const selectError = createSelector([selectWallet], w => w?.error ?? null)

export const selectPrettyBalance = createSelector(
  [selectWallet],
  w => w?.balance ?? TOKEN.DEFAULT_BALANCE,
)
