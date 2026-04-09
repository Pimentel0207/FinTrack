import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  type?: 'error' | 'success' | 'info'
  onClose: () => void
}

export function Toast({ message, type = 'error', onClose }: ToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const colors: Record<string, string> = {
    error: 'var(--danger)',
    success: 'var(--success)',
    info: 'var(--info)',
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: `translateX(-50%) translateY(${visible ? '0' : '100px'})`,
      background: 'var(--bg-elevated)',
      border: `1px solid ${colors[type]}`,
      borderRadius: '12px',
      padding: '12px 20px',
      color: colors[type],
      fontSize: '14px',
      fontWeight: 600,
      zIndex: 9999,
      transition: 'transform 0.3s ease, opacity 0.3s ease',
      opacity: visible ? 1 : 0,
      boxShadow: `0 8px 32px rgba(0,0,0,0.3)`,
      maxWidth: '400px',
      textAlign: 'center',
    }}>
      {message}
    </div>
  )
}
