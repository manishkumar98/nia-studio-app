import { createContext, useContext, useState, useEffect } from 'react'
import { auth, googleProvider, db } from '../firebase'
import { mockUsers } from '../data/mockUsers'
import { products } from '../data/products'
import { rewards } from '../data/rewards'
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth'
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // One-time seed for EVERYTHING into Firestore (Phase 4 Logic)
      try {
        const usersSnap = await getDocs(collection(db, 'users'))
        if (usersSnap.empty) {
          console.log("[Phase 4 Build] Seeding users...");
          for (const mu of mockUsers) {
            await setDoc(doc(db, 'users', mu.id), { ...mu, createdAt: new Date().toISOString() })
          }
        }

        const productsSnap = await getDocs(collection(db, 'products'))
        if (productsSnap.empty) {
          console.log("[Phase 4 Build] Seeding products...");
          for (const p of products) {
            await setDoc(doc(db, 'products', p.id.toString()), p)
          }
        }

        const rewardsSnap = await getDocs(collection(db, 'rewards'))
        if (rewardsSnap.empty) {
          console.log("[Phase 4 Build] Seeding rewards...");
          for (const r of rewards) {
            await setDoc(doc(db, 'rewards', r.id.toString()), r)
          }
        }
      } catch (e) {
        console.error("Seeding Error:", e)
      }

      if (user) {
        // Fetch user profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          setCurrentUser({ uid: user.uid, ...userDoc.data() })
        } else {
          // New user default profile
          const newProfile = {
            name: user.displayName || 'New User',
            email: user.email || '',
            role: 'resident',
            nestId: 'n1',
            nestName: 'Kush-12',
            balance: 100,
            employeeId: user.phoneNumber || user.email?.split('@')[0] || `NIA${Math.floor(Math.random() * 1000)}`,
            createdAt: new Date().toISOString()
          }
          await setDoc(doc(db, 'users', user.uid), newProfile)
          setCurrentUser({ uid: user.uid, ...newProfile })
        }
      } else {
        setCurrentUser(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const createProfile = async (user, role = 'resident') => {
    const newProfile = {
      name: user.displayName || 'New User',
      email: user.email || '',
      role: role,
      nestId: 'n1',
      nestName: 'Kush-12',
      balance: role === 'resident' ? 100 : 0,
      employeeId: user.phoneNumber || user.email?.split('@')[0] || `NIA${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
    }
    await setDoc(doc(db, 'users', user.uid), newProfile)
    setCurrentUser({ uid: user.uid, ...newProfile })
    return newProfile
  }

  const loginWithGoogle = async (role = 'resident') => {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    if (!userDoc.exists()) {
      await createProfile(user, role)
    }
  }

  const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password)

  const registerWithEmail = async (email, password, role = 'resident') => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await createProfile(result.user, role)
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setCurrentUser(null)
    } catch (e) {
      console.error("Logout Error:", e)
      setCurrentUser(null)
    }
  }

  const setupRecaptcha = (containerId) => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        'size': 'invisible'
      })
    }
  }

  const sendOtp = async (phoneNumber) => {
    return signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier)
  }

  const confirmOtp = async (confirmationResult, otp, role = 'resident') => {
    const result = await confirmationResult.confirm(otp)
    const user = result.user
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    if (!userDoc.exists()) {
      await createProfile(user, role)
    }
  }

  const mockLogin = (user) => setCurrentUser(user)

  return (
    <AuthContext.Provider value={{
      currentUser,
      loading,
      loginWithGoogle,
      loginWithEmail,
      registerWithEmail,
      logout,
      setupRecaptcha,
      sendOtp,
      confirmOtp,
      mockLogin
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
