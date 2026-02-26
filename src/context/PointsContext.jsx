import { createContext, useContext, useState, useEffect } from 'react'
import { mockUsers } from '../data/mockUsers'

const PointsContext = createContext()

// Strict Voucher Code Generator
const generateVoucherCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No O, 0, I, 1 to avoid confusion
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function PointsProvider({ children }) {
  // Persistence Helper with better error handling
  const getSaved = (key, fallback) => {
    try {
      const saved = localStorage.getItem(key)
      if (saved) {
        const parsed = JSON.parse(saved)
        console.log(`[DB] Loaded ${key}:`, parsed)
        return parsed
      }
    } catch (e) {
      console.error(`[DB] Error loading ${key}:`, e)
    }
    return fallback
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

  // Synchronous initial persist to avoid empty wipe
  useEffect(() => {
    console.log("[DB] PointsProvider Mounted. Active Vouchers:", vouchers.length)
  }, [])

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
      id: Date.now() + Math.floor(Math.random() * 1000), // More unique IDs
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
      code: generateVoucherCode(),
      date: new Date().toISOString().split('T')[0],
      status: 'PENDING'
    }

    console.log("[DB] Generating New Voucher:", newVoucher.code)
    setVouchers(prev => [newVoucher, ...prev])
    return { success: true, voucher: newVoucher }
  }

  const fulfillRedemption = (code) => {
    // Robust lookup (trim and case-insensitive)
    const normalizedCode = code.trim().toUpperCase()
    const voucherIndex = vouchers.findIndex(v => v.code === normalizedCode && v.status === 'PENDING')

    if (voucherIndex === -1) {
      console.warn("[DB] Voucher Fulfill Failed. Requested:", normalizedCode, "Current Vouchers:", vouchers)
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
      v.code === normalizedCode ? { ...v, status: 'FULFILLED', fulfilledDate: new Date().toISOString() } : v
    ))

    return { success: true, voucher: { ...voucher, status: 'FULFILLED' } }
  }

  const resetDatabase = () => {
    localStorage.clear()
    window.location.reload()
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
      fulfillRedemption,
      resetDatabase
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
