'use client'
import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type ToastType = 'success' | 'error'
interface ToastItem { id: number; message: string; type: ToastType }
interface Ctx { showToast: (msg: string, type?: ToastType) => void }

const ToastCtx = createContext<Ctx>({ showToast: () => {} })

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now()
    setItems(p => [...p, { id, message, type }])
    setTimeout(() => setItems(p => p.filter(t => t.id !== id)), 4000)
  }, [])

  return (
    <ToastCtx.Provider value={{ showToast }}>
      {children}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(t => (
          <div key={t.id} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: '#0d1a0d', border: `1px solid ${t.type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
            padding: '12px 18px', borderRadius: 14, maxWidth: 360,
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            animation: 'modalIn 0.3s ease forwards',
          }}>
            <span style={{ fontSize: 16 }}>{t.type === 'success' ? '✅' : '❌'}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  return useContext(ToastCtx)
}
