import { createContext, useContext, useState, useEffect } from 'react'
import { mockUsers } from '../data/mockUsers'

const PointsContext = createContext()

export function PointsProvider({ children }) {
  // Persistence Helper
  const getSaved = (key, fallback) => {
    const saved = localStorage.getItem(key)
    try {
      return saved ? JSON.parse(saved) : fallback
    } catch (e) {
      return fallback
    }
  }

  const [userBalances, setUserBalances] = useState(() =>
    getSaved('nia_balances', mockUsers.reduce((acc, user) => ({ ...acc, [user.id]: user.balance }), {}))
  )

  const [allTransactions, setAllTransactions] = useState(() =>
    getSaved('nia_transactions', [
      { id: 1, userId: 'u1', date: '2026-02-20', description: 'Nest made before 7 AM', points: 5, type: 'credit' },
      { id: 2, userId: 'u1', date: '2026-02-19', description: 'Common area cleanup', points: 3, type: 'credit' },
    ])
  )

  const [vouchers, setVouchers] = useState(() => getSaved('nia_vouchers', []))
  const [cart, setCart] = useState([])

  // State Persistence Effects
  useEffect(() => {
    localStorage.setItem('nia_balances', JSON.stringify(userBalances))
  }, [userBalances])

  useEffect(() => {
    localStorage.setItem('nia_transactions', JSON.stringify(allTransactions))
  }, [allTransactions])

  useEffect(() => {
    localStorage.setItem('nia_vouchers', JSON.stringify(vouchers))
  }, [vouchers])

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
    return newTransaction
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

  const requestRedemption = (userId, reward) => {
    const balance = getBalance(userId)
    if (balance < reward.cost) {
      return { success: false, message: 'Insufficient points' }
    }

    const newVoucher = {
      id: `vouch_${Date.now()}`,
      userId,
      rewardId: reward.id,
      name: reward.name,
      emoji: reward.emoji,
      cost: reward.cost,
      code: Math.random().toString(36).substring(2, 8).toUpperCase(),
      date: new Date().toISOString().split('T')[0],
      status: 'PENDING'
    }

    setVouchers(prev => [newVoucher, ...prev])
    return { success: true, voucher: newVoucher }
  }

  const fulfillRedemption = (code) => {
    const voucherIndex = vouchers.findIndex(v => v.code === code && v.status === 'PENDING')

    if (voucherIndex === -1) {
      return { success: false, message: 'Invalid or already used voucher' }
    }

    const voucher = vouchers[voucherIndex]
    const balance = getBalance(voucher.userId)

    if (balance < voucher.cost) {
      return { success: false, message: 'Resident has insufficient points now' }
    }

    addTransaction({
      userId: voucher.userId,
      description: `Redeemed: ${voucher.name}`,
      points: -voucher.cost,
      type: 'debit'
    })

    setVouchers(prev => prev.map(v =>
      v.code === code ? { ...v, status: 'FULFILLED', fulfilledDate: new Date().toISOString() } : v
    ))

    return { success: true, voucher: { ...voucher, status: 'FULFILLED' } }
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
      requestRedemption,
      fulfillRedemption
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
