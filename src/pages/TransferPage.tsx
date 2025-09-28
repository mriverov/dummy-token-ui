import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Field, Header } from 'decentraland-ui'
import { Link, useNavigate } from 'react-router-dom'
import { ethers } from 'ethers'
import { Props } from '../components/App/App.types'
import { ROUTES, MESSAGES } from '../constants'
import { validateAddress, validateAmount } from '../utils/errorHandling'
import '../styles/components.css'

type TransferProps = Pick<Props, 'address' | 'balance' | 'isTransferring' | 'onTransfer' | 'error'>

export default function TransferPage({
  balance,
  isTransferring,
  onTransfer,
  error,
}: TransferProps) {
  const navigate = useNavigate()
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')

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
      // Successful transfer, navigate back to wallet
      setTo('')
      setAmount('')
      navigate(ROUTES.WALLET)
    }
    wasTransferring.current = isTransferring
  }, [isTransferring, error, navigate])

  const submit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!canSend) return
      onTransfer(to.trim(), amount.trim())
    },
    [canSend, onTransfer, to, amount],
  )

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <Header size="large" className="header">
          {MESSAGES.UI.TRANSFER}
        </Header>
        <p className="description">{MESSAGES.UI.SEND_TOKENS_DESCRIPTION}</p>

        <form onSubmit={submit}>
          <Field
            label={MESSAGES.UI.AMOUNT}
            placeholder="100"
            value={amount}
            disabled={isTransferring}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
            error={!(isValidAmountFormat && hasEnough) && amount !== ''}
            message={
              !isValidAmountFormat && amount !== ''
                ? MESSAGES.ERRORS.ONLY_POSITIVE_INTEGERS
                : isValidAmountFormat && !hasEnough
                  ? MESSAGES.ERRORS.INSUFFICIENT_BALANCE
                  : undefined
            }
          />

          <Field
            label={MESSAGES.UI.ADDRESS}
            placeholder="0x..."
            value={to}
            disabled={isTransferring}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTo(e.target.value)}
            error={!isValidAddress && to !== ''}
            message={!isValidAddress && to !== '' ? MESSAGES.ERRORS.INVALID_ADDRESS : undefined}
          />

          {error && isTransferring === false ? <p className="error-message">{error}</p> : null}

          <div className="button-container">
            <Button
              primary
              type="submit"
              disabled={!canSend || isTransferring}
              loading={isTransferring}
            >
              {MESSAGES.UI.SEND}
            </Button>
            <Link to={ROUTES.WALLET}>
              <Button basic disabled={isTransferring}>
                {MESSAGES.UI.BACK}
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
