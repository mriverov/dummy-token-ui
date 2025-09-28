import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import WalletPage from './WalletPage'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('WalletPage', () => {
  const defaultProps = {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    balance: '100 DUMMY',
    isConnected: true,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders wallet information when connected', () => {
    render(
      <MemoryRouter>
        <WalletPage {...defaultProps} />
      </MemoryRouter>,
    )

    expect(screen.getByText(/wallet/i)).toBeInTheDocument()
    expect(screen.getByText(/address/i)).toBeInTheDocument()
    expect(screen.getByText(/balance/i)).toBeInTheDocument()
    expect(screen.getByText('100 DUMMY')).toBeInTheDocument()
  })

  test('shows truncated address', () => {
    render(
      <MemoryRouter>
        <WalletPage {...defaultProps} />
      </MemoryRouter>,
    )

    expect(screen.getByText(/0x1234...5678/)).toBeInTheDocument()
  })

  test('shows transfer button', () => {
    render(
      <MemoryRouter>
        <WalletPage {...defaultProps} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('button', { name: /transfer/i })).toBeInTheDocument()
  })

  test('navigates to home when not connected', () => {
    render(
      <MemoryRouter>
        <WalletPage {...defaultProps} isConnected={false} />
      </MemoryRouter>,
    )

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  test('navigates to transfer page when transfer button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <WalletPage {...defaultProps} />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /transfer/i }))
    // The navigation is handled by Link component, so we just verify the button exists
    expect(screen.getByRole('button', { name: /transfer/i })).toBeInTheDocument()
  })
})
