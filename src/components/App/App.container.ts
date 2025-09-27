import { connect } from 'react-redux'
import { connectWalletRequest, transferTokenRequest } from '../../modules/wallet/actions'
import {
  getAddress,
  getBalance,
  getError,
  isConnected,
  isConnecting,
  isTransferring,
} from '../../modules/wallet/selectors'
import { RootState } from '../../modules/types'
import { MapDispatch, MapDispatchProps, MapStateProps } from './App.types'
import App from './App'

const mapState = (state: RootState): MapStateProps => ({
  address: getAddress(state),
  balance: getBalance(state),
  isConnected: isConnected(state),
  isConnecting: isConnecting(state),
  isTransferring: isTransferring(state),
  error: getError(state),
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onConnect: () => dispatch(connectWalletRequest()),
  onTransfer: (to, amount) => dispatch(transferTokenRequest({ to, amount })),
})

export default connect(mapState, mapDispatch)(App)
