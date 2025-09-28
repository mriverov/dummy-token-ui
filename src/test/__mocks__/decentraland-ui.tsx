import React from 'react'

export const Button = ({
  children,
  onClick,
  disabled,
  loading,
  primary,
  basic,
  type,
  ...props
}: any) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className={`button ${loading ? 'loading' : ''} ${primary ? 'primary' : ''} ${basic ? 'basic' : ''}`}
    type={type}
    {...props}
  >
    {children}
  </button>
)

export const Card = ({ children, ...props }: any) => (
  <div className="card" {...props}>
    {children}
  </div>
)

export const Header = ({ children, size, ...props }: any) => {
  const Tag = size === 'large' ? 'h1' : 'h2'
  return (
    <Tag className="header" {...props}>
      {children}
    </Tag>
  )
}

export const Field = ({
  label,
  placeholder,
  value,
  onChange,
  disabled,
  error,
  message,
  ...props
}: any) => (
  <div className="field">
    {label && <label>{label}</label>}
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={error ? 'error' : ''}
      {...props}
    />
    {message && <div className="error-message">{message}</div>}
  </div>
)

export const Center = ({ children, ...props }: any) => (
  <div className="center" {...props}>
    {children}
  </div>
)
