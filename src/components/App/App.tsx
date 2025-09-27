import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import {
  Button,
  Card,
  Center,
  Close,
  Field,
  Footer,
  Header,
  Modal,
  Navbar,
  Page,
} from 'decentraland-ui'
import { Props } from './App.types'
import './App.css'
import { AnyAction } from 'redux-saga'
import { ethers } from 'ethers'

const App: React.FC<Props> = ({
  address,
  balance,
  isConnected,
  onConnect,
  onTransfer,
  isConnecting,
  isTransferring,
  error,
}) => {
  const [isTransferOpen, setIsTransferOpen] = useState(false)
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const openTransfer = useCallback(() => setIsTransferOpen(true), [])
  const closeTransfer = useCallback(() => setIsTransferOpen(false), [])

  const confirmTransfer = useCallback(() => {
    onTransfer(to.trim(), amount.trim())
  }, [onTransfer, to, amount])

  //Validations
  const isValidAddress = useMemo(() => ethers.isAddress(to.trim()), [to])
  const numericBalance = balance.trim().match(/^(\d+(?:\.\d+)?)/)?.[1] ?? '0'
  const isValidAmountFormat = /^\d+$/.test(amount.trim()) && Number(amount) > 0

  const hasEnough = (() => {
    try {
      return (
        BigInt(amount || '0') <= BigInt(numericBalance.split('.')[0] || '0') &&
        BigInt(amount || '0') > 0n
      )
    } catch {
      return false
    }
  })()
  const canSend = isValidAddress && isValidAmountFormat && hasEnough

  const wasTransferring = useRef(false)

  useEffect(() => {
    if (wasTransferring.current && !isTransferring && !error) {
      setIsTransferOpen(false)
      setTo('')
      setAmount('')
    }
    wasTransferring.current = isTransferring
  }, [isTransferring, error])

  return (
    <>
      <Navbar activePage="Wallet" />
      <Page className="App">
        <Center>
          {!isConnected ? (
            <>
              <Button primary onClick={onConnect} loading={isConnecting}>
                Connect
              </Button>
              {error ? <p className="error">{error}</p> : null}
            </>
          ) : (
            <Card>
              <Header>Wallet</Header>
              <p>
                <strong>Address:</strong>&nbsp;
                {address.slice(0, 6) + '...' + address.slice(-4)}
              </p>
              <p>
                <strong>Balance:</strong>&nbsp;
                {balance}
                <Button basic onClick={openTransfer} style={{ marginLeft: 8 }}>
                  <strong>Transfer</strong>
                </Button>
              </p>
            </Card>
          )}
        </Center>
      </Page>

      <Modal
        size="small"
        open={isTransferOpen}
        onClose={isTransferring ? undefined : closeTransfer}
        closeIcon={isTransferring ? null : <Close />}
        closeOnEscape={!isTransferring}
        closeOnDimmerClick={!isTransferring}
      >
        <Modal.Header>
          <div style={{ textAlign: 'center' }}>
            <Header size="large" textAlign="center" style={{ margin: 0, lineHeight: 1 }}>
              Transfer
            </Header>
            <p style={{ color: '#777', marginTop: 20, marginBottom: 0, lineHeight: 1 }}>
              Send tokens to an account
            </p>
          </div>
        </Modal.Header>
        <Modal.Content>
          <Field
            label="Amount"
            placeholder="100"
            value={amount}
            disabled={isTransferring}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
            error={!(isValidAmountFormat && hasEnough) && amount !== ''}
            message={
              !isValidAmountFormat && amount !== ''
                ? 'Solo enteros positivos'
                : isValidAmountFormat && !hasEnough
                  ? 'Saldo insuficiente'
                  : undefined
            }
          />
          <Field
            label="Address"
            placeholder="0x..."
            value={to}
            onChange={(e: AnyAction) => setTo(e.target.value)}
            error={!isValidAddress && to !== ''}
            message={!isValidAddress && to !== '' ? 'Address inválida' : undefined}
          />
          {error && isTransferring === false ? <p className="error">{error}</p> : null}
        </Modal.Content>

        <Modal.Actions>
          <Button
            primary
            onClick={confirmTransfer}
            disabled={!canSend || isTransferring}
            loading={isTransferring}
          >
            Send
          </Button>
        </Modal.Actions>
      </Modal>

      <Footer />
    </>
  )
}

export default App
