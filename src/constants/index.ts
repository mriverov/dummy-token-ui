// Application constants
export const ROUTES = {
  HOME: '/',
  WALLET: '/wallet',
  TRANSFER: '/transfer',
} as const

export const MESSAGES = {
  ERRORS: {
    INVALID_ADDRESS: 'Invalid address',
    INSUFFICIENT_BALANCE: 'Insufficient balance',
    ONLY_POSITIVE_INTEGERS: 'Only positive integers',
    CONNECTION_FAILED: 'Connection failed',
    UNKNOWN_ERROR: 'Unknown error',
  },
  UI: {
    SEND_TOKENS_DESCRIPTION: 'Send tokens to an account',
    TRANSFER: 'Transfer',
    WALLET: 'Wallet',
    CONNECT: 'Connect',
    SEND: 'Send',
    BACK: 'Back',
    ADDRESS: 'Address',
    AMOUNT: 'Amount',
  },
} as const

export const VALIDATION = {
  ADDRESS_PATTERN: /^0x[a-fA-F0-9]{40}$/,
  AMOUNT_PATTERN: /^\d+$/,
  MIN_AMOUNT: 1,
} as const

export const STYLES = {
  CONTAINER: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  FORM_CONTAINER: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    flexDirection: 'column' as const,
  },
  BUTTON_CONTAINER: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  FORM_WRAPPER: {
    maxWidth: 540,
    width: '100%',
  },
  HEADER: {
    marginBottom: 8,
    textAlign: 'center' as const,
  },
  DESCRIPTION: {
    color: '#777',
    marginTop: 0,
    textAlign: 'center' as const,
  },
} as const

export const TOKEN = {
  DEFAULT_BALANCE: '0 DUMMY',
  DECIMALS: 0,
} as const
