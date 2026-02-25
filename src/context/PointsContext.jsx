import { createContext, useContext, useState } from 'react'

const PointsContext = createContext()

export function PointsProvider({ children }) {
  const [balance, setBalance] = useState(185)
  const [transactions, setTransactions] = useState([
    { id: 1, date: '2025-02-20', description: 'Nest made before 7 AM', points: 5, type: 'credit' },
    { id: 2, date: '2025-02-19', description: 'Common area cleanup', points: 3, type: 'credit' },
    { id: 3, date: '2025-02-18', description: 'Shouting / creating disturbance', points: -15, type: 'debit' },
    { id: 4, date: '2025-02-17', description: 'Jambo attendance (full session)', points: 10, type: 'credit' },
    { id: 5, date: '2025-02-16', description: 'Zero violations today', points: 2, type: 'credit' },
    { id: 6, date: '2025-02-15', description: 'Meal feedback submitted', points: 1, type: 'credit' },
    { id: 7, date: '2025-02-14', description: 'Spitting in common areas', points: -10, type: 'debit' },
    { id: 8, date: '2025-02-13', description: 'Skill badge session', points: 10, type: 'credit' },
  ])
  const [cart, setCart] = useState([])
  const [vouchers, setVouchers] = useState([])

  const addTransaction = (transaction) => {
    const newTransaction = {
      id: Math.max(...transactions.map(t => t.id), 0) + 1,
      ...transaction,
      date: new Date().toISOString().split('T')[0]
    }
    setTransactions(prev => [newTransaction, ...prev])
    setBalance(prev => prev + transaction.points)
  }

  const addToCart = (productId) => {
    const product = null
    setCart(prev => {
      const existing = prev.find(item => item.product.id === productId)
      if (existing) {
        return prev.map(item =>
          item.product.id === productId
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      }
      return [...prev, { product: { id: productId }, qty: 1 }]
    })
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product.id !== productId))
  }

  const changeQty = (productId, delta) => {
    setCart(prev => {
      return prev
        .map(item =>
          item.product.id === productId
            ? { ...item, qty: Math.max(0, item.qty + delta) }
            : item
        )
        .filter(item => item.qty > 0)
    })
  }

  const clearCart = () => {
    setCart([])
  }

  const addVoucher = (voucher) => {
    setVouchers(prev => [...prev, voucher])
  }

  return (
    <PointsContext.Provider value={{
      balance,
      setBalance,
      transactions,
      addTransaction,
      cart,
      addToCart,
      removeFromCart,
      changeQty,
      clearCart,
      vouchers,
      addVoucher
    }}>
      {children}
    </PointsContext.Provider>
  )
}

export function usePoints() {
  const context = useContext(PointsContext)
  if (!context) {
    throw new Error('usePoints must be used within PointsProvider')
  }
  return context
}
