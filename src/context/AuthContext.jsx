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
    const unsubscribe = onSnapshotAuth()
    return unsubscribe
  }, [])

  const onSnapshotAuth = () => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user profile from Firestore or create one
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          setCurrentUser({ ...user, ...userDoc.data() })
        } else {
          // New user default profile
          const newProfile = {
            name: user.displayName || 'New Resident',
            email: user.email || '',
            role: 'resident', // Default role
            nestId: 'n1',
            nestName: 'Kush-12',
            balance: 0,
            employeeId: user.phoneNumber || user.email?.split('@')[0] || `NIA${Math.floor(Math.random() * 1000)}`
          }
          await setDoc(doc(db, 'users', user.uid), newProfile)
          setCurrentUser({ ...user, ...newProfile })
        }
      } else {
        setCurrentUser(null)
      }
      setLoading(false)
    })
  }

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider)

  const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password)

  const registerWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password)

  const logout = () => signOut(auth)

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

  // Fallback for current mock login system during transition
  const mockLogin = (user) => {
    setCurrentUser(user)
  }

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
      mockLogin
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
