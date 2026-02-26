import { createContext, useContext, useState, useEffect } from 'react'
import { mockUsers } from '../data/mockUsers'
import { db } from '../firebase'
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore'

const PointsContext = createContext()

// Strict Voucher Code Generator
const generateVoucherCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function PointsProvider({ children }) {
  const [userBalances, setUserBalances] = useState({})
  const [allTransactions, setAllTransactions] = useState([])
  const [vouchers, setVouchers] = useState([])
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)

  // 1. Sync Balances from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'balances'), (snapshot) => {
      const balances = {}
      snapshot.forEach(doc => {
        balances[doc.id] = doc.data().points
      })
      // Merge with mock users if empty (initial seed)
      if (Object.keys(balances).length === 0) {
        const initial = mockUsers.reduce((acc, user) => ({ ...acc, [user.id]: user.balance }), {})
        setUserBalances(initial)
      } else {
        setUserBalances(balances)
      }
    })
    return unsub
  }, [])

  // 2. Sync Vouchers from Firestore (Live across devices!)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'vouchers'), (snapshot) => {
      const vouchList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      // Sort by date/timestamp
      setVouchers(vouchList.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds))
      setLoading(false)
    })
    return unsub
  }, [])

  // 3. Sync Transactions
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'transactions'), (snapshot) => {
      const transList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setAllTransactions(transList.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds))
    })
    return unsub
  }, [])

  const addTransaction = async (transaction) => {
    const newTrans = {
      ...transaction,
      createdAt: serverTimestamp(),
      date: new Date().toISOString().split('T')[0]
    }

    // Add to Firestore
    await addDoc(collection(db, 'transactions'), newTrans)

    // Update Balance in Firestore
    const userRef = doc(db, 'balances', transaction.userId)
    const currentBalance = userBalances[transaction.userId] || 0
    await setDoc(userRef, { points: currentBalance + transaction.points }, { merge: true })

    return newTrans
  }

  const getBalance = (userId) => userBalances[userId] || 0
  const getTransactions = (userId) => allTransactions.filter(t => t.userId === userId)

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item)
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const clearCart = () => setCart([])

  const requestRedemption = async (userId, reward) => {
    const balance = getBalance(userId)
    if (balance < reward.cost) {
      return { success: false, message: 'Insufficient points' }
    }

    const voucherCode = generateVoucherCode()
    const newVoucher = {
      userId,
      rewardId: reward.id,
      name: reward.name,
      emoji: reward.emoji,
      cost: reward.cost,
      code: voucherCode,
      date: new Date().toISOString().split('T')[0],
      status: 'PENDING',
      createdAt: serverTimestamp()
    }

    try {
      await addDoc(collection(db, 'vouchers'), newVoucher)
      console.log("[FIREBASE] Voucher Saved Globally:", voucherCode)
      return { success: true, voucher: { ...newVoucher, id: Date.now().toString() } }
    } catch (e) {
      console.error("Firebase Error:", e)
      return { success: false, message: 'Database Error. Check connection.' }
    }
  }

  const fulfillRedemption = async (code) => {
    const normalizedCode = code.trim().toUpperCase()

    // Query Firestore for the pending voucher
    const q = query(collection(db, 'vouchers'),
      where('code', '==', normalizedCode),
      where('status', '==', 'PENDING')
    )

    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return { success: false, message: 'Invalid or already used voucher' }
    }

    const voucherDoc = querySnapshot.docs[0]
    const voucherData = voucherDoc.data()
    const balance = getBalance(voucherData.userId)

    if (balance < voucherData.cost) {
      return { success: false, message: 'Resident has insufficient points' }
    }

    // 1. Deduct Points via Transaction
    await addTransaction({
      userId: voucherData.userId,
      description: `Redeemed: ${voucherData.name}`,
      points: -voucherData.cost,
      type: 'debit'
    })

    // 2. Mark Voucher as Fulfilled in Firestore
    await updateDoc(doc(db, 'vouchers', voucherDoc.id), {
      status: 'FULFILLED',
      fulfilledAt: serverTimestamp()
    })

    return { success: true, voucher: { ...voucherData, status: 'FULFILLED' } }
  }

  const getVoucherRecord = async (code) => {
    const normalizedCode = code.trim().toUpperCase()
    const q = query(collection(db, 'vouchers'),
      where('code', '==', normalizedCode)
    )
    const snapshot = await getDocs(q)
    if (snapshot.empty) return null
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() }
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
      clearCart,
      vouchers,
      requestRedemption,
      fulfillRedemption,
      getVoucherRecord,
      loading
    }}>
      {children}
    </PointsContext.Provider>
  )
}

export function usePoints() {
  const context = useContext(PointsContext)
  if (!context) throw new Error('usePoints must be used within PointsProvider')
  return context
}
