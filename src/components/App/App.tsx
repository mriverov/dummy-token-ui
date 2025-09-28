import { Routes, Route } from 'react-router-dom'
import { Props } from './App.types'
import HomePage from '../../pages/HomePage'
import TransferPage from '../../pages/TransferPage'
import WalletPage from '../../pages/WalletPage'

export function App(props: Props) {
  return (
    <Routes>
      <Route path="/" element={<HomePage {...props} />} />
      <Route path="/wallet" element={<WalletPage {...props} />} />
      <Route path="/transfer" element={<TransferPage {...props} />} />
    </Routes>
  )
}
