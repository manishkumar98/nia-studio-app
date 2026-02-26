import { createContext, useContext, useState, useEffect } from 'react'
import { auth, googleProvider, db } from '../firebase'
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          setCurrentUser({ uid: user.uid, ...userDoc.data() })
        } else {
          // New user default profile (if not created via social login flow)
          const newProfile = {
            name: user.displayName || 'New User',
            email: user.email || '',
            role: 'resident', // Default role for safety
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
      role: role, // 'resident' or 'eae'
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
      setCurrentUser(null) // Manual clear for mock users
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

  // Legacy support
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
