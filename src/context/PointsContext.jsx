import { createContext, useContext, useState } from 'react'
import { mockUsers } from '../data/mockUsers'

const PointsContext = createContext()

export function PointsProvider({ children }) {
  const [userBalances, setUserBalances] = useState(
    mockUsers.reduce((acc, user) => ({ ...acc, [user.id]: user.balance }), {})
  )
  const [allTransactions, setAllTransactions] = useState([
    { id: 1, userId: 'u1', date: '2025-02-20', description: 'Nest made before 7 AM', points: 5, type: 'credit' },
    { id: 2, userId: 'u1', date: '2025-02-19', description: 'Common area cleanup', points: 3, type: 'credit' },
  ])
  const [cart, setCart] = useState([])
  const [vouchers, setVouchers] = useState([])

  const addTransaction = (transaction) => {
    const newTransaction = {
      id: Math.max(...allTransactions.map(t => t.id), 0) + 1,
      ...transaction,
      date: new Date().toISOString().split('T')[0]
    }
    setAllTransactions(prev => [newTransaction, ...prev])
    setUserBalances(prev => ({
      ...prev,
      [transaction.userId]: (prev[transaction.userId] || 0) + transaction.points
    }))
  }

  const getBalance = (userId) => userBalances[userId] || 0
  const getTransactions = (userId) => allTransactions.filter(t => t.userId === userId)

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  const changeQty = (productId, delta) => {
    setCart(prev => {
      return prev
        .map(item =>
          item.id === productId
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
      userBalances,
      allTransactions,
      getBalance,
      getTransactions,
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
