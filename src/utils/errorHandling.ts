import { MESSAGES } from '../constants'

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: unknown,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const createError = (message: string, code?: string, originalError?: unknown): AppError => {
  return new AppError(message, code, originalError)
}

export const handleAsyncError = async <T>(
  asyncFn: () => Promise<T>,
  fallbackMessage: string = MESSAGES.ERRORS.UNKNOWN_ERROR,
): Promise<T> => {
  try {
    return await asyncFn()
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    throw createError(fallbackMessage, 'ASYNC_ERROR', error)
  }
}

export const validateAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address.trim())
}

export const validateAmount = (amount: string): boolean => {
  return /^\d+$/.test(amount.trim()) && Number(amount) >= 1
}

export const formatError = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return MESSAGES.ERRORS.UNKNOWN_ERROR
}
