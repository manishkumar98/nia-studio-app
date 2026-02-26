import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { mockUsers } from '../data/mockUsers'

export default function Login() {
  const [portal, setPortal] = useState('resident') // 'resident' (Nia) or 'staff' (EAE)
  const [method, setMethod] = useState('google')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [verificationId, setVerificationId] = useState(null)
  const [empId, setEmpId] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    setupRecaptcha,
    sendOtp,
    confirmOtp,
    mockLogin
  } = useAuth()

  useEffect(() => {
    if (method === 'phone') {
      setupRecaptcha('recaptcha-container')
    }
  }, [method])

  const handleError = (err) => {
    console.error(err)
    let msg = err.message || 'An error occurred'
    if (err.code === 'auth/invalid-credential') msg = 'Invalid email or password'
    if (err.code === 'auth/user-not-found') msg = 'Account not found. Trying to register...'
    setError(msg)
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      await loginWithGoogle(portal === 'staff' ? 'eae' : 'resident')
    } catch (err) {
      handleError(err)
    }
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await loginWithEmail(email, password)
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        // Try auto-registration for this pilot if it's the first time
        try {
          await registerWithEmail(email, password, portal === 'staff' ? 'eae' : 'resident')
        } catch (regErr) {
          handleError(regErr)
        }
      } else {
        handleError(err)
      }
    }
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const confirmation = await sendOtp(phoneNumber)
      setVerificationId(confirmation)
      setLoading(false)
    } catch (err) {
      handleError(err)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await confirmOtp(verificationId, otp, portal === 'staff' ? 'eae' : 'resident')
    } catch (err) {
      handleError(err)
    }
  }

  const handleLegacyLogin = (e) => {
    e.preventDefault()
    const user = mockUsers.find(u => u.employeeId === empId && u.pin === pin)
    if (user) {
      mockLogin(user)
    } else {
      setError('Invalid ID or PIN')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] px-4 py-12">
      <div className="max-w-md w-full">

        {/* Portal Switcher (Modern Segmented Control) */}
        <div className="mb-8 p-1.5 bg-gray-200/50 backdrop-blur-lg rounded-[24px] flex shadow-inner">
          <button
            onClick={() => { setPortal('resident'); setMethod('google'); setError(''); }}
            className={`flex-1 py-4 px-6 rounded-[20px] text-xs font-black uppercase tracking-widest transition-all duration-500 ${portal === 'resident' ? 'bg-white text-blue-600 shadow-xl scale-[1.02]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Nia Resident Portal
          </button>
          <button
            onClick={() => { setPortal('staff'); setMethod('email'); setError(''); }}
            className={`flex-1 py-4 px-6 rounded-[20px] text-xs font-black uppercase tracking-widest transition-all duration-500 ${portal === 'staff' ? 'bg-[#1d1d1f] text-white shadow-xl scale-[1.02]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            EAE Staff Terminal
          </button>
        </div>

        <div className={`bg-white rounded-[40px] shadow-2xl p-8 md:p-12 space-y-8 relative overflow-hidden backdrop-blur-xl border-4 ${portal === 'staff' ? 'border-[#1d1d1f]' : 'border-white'}`}>

          {/* Theme Gradient based on Portal */}
          <div className={`absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full blur-[100px] opacity-10 transition-colors duration-1000 ${portal === 'staff' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
          <div className={`absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full blur-[100px] opacity-10 transition-colors duration-1000 ${portal === 'staff' ? 'bg-red-500' : 'bg-purple-500'}`}></div>

          <div className="text-center relative">
            <div className="flex justify-center mb-6">
              <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center text-white shadow-2xl transform hover:rotate-6 transition-all duration-500 ${portal === 'staff' ? 'bg-[#1d1d1f] scale-110' : 'bg-gradient-to-br from-[#0071e3] to-[#00a2ff]'}`}>
                {portal === 'staff' ? (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                ) : (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-4.305-6.218A7 7 0 1118.354 12.571m1.391 8.357c-1.744-2.772-2.753-6.054-2.753-9.571m-2.753-7.429L12 9" /></svg>
                )}
              </div>
            </div>
            <h2 className="text-4xl font-black text-[#1d1d1f] tracking-tight mb-2">
              {portal === 'staff' ? 'Staff Login' : 'Resident Login'}
            </h2>
            <p className="text-[#6e6e73] font-bold text-sm uppercase tracking-widest opacity-60">
              {portal === 'staff' ? 'Enterprise Access Enabled' : 'Nia Rewards & Wallet'}
            </p>
          </div>

          {/* Method Switcher */}
          <div className="flex p-1 bg-gray-100/50 rounded-2xl">
            {(portal === 'resident' ? ['google', 'phone', 'email', 'legacy'] : ['email', 'google', 'legacy']).map((m) => (
              <button
                key={m}
                onClick={() => { setMethod(m); setError(''); setVerificationId(null); }}
                className={`flex-1 py-2 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${method === m ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {m === 'legacy' ? (portal === 'staff' ? 'EMP ID' : 'PIN') : m}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-100 animate-shake flex items-center gap-3">
                <span className="text-xl">🛑</span> {error}
              </div>
            )}

            {/* Google Login */}
            {method === 'google' && (
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className={`w-full flex items-center justify-center gap-4 py-5 bg-white border border-gray-200 text-[#1d1d1f] rounded-2xl text-lg font-black hover:bg-gray-50 transition-all shadow-xl active:scale-[0.98] group`}
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                <span>Sync with Gmail</span>
              </button>
            )}

            {/* Email Login */}
            {method === 'email' && (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="official@nianest.com"
                    className="w-full px-6 py-5 bg-gray-50 border-none rounded-2xl text-lg font-medium focus:ring-4 focus:ring-blue-500/10 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-6 py-5 bg-gray-50 border-none rounded-2xl text-lg font-medium focus:ring-4 focus:ring-blue-500/10 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-5 text-white rounded-2xl text-lg font-black shadow-2xl transition-all active:scale-[0.98] ${portal === 'staff' ? 'bg-[#1d1d1f] hover:bg-black' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {loading ? 'Authenticating...' : (portal === 'staff' ? 'Enter Terminal' : 'Proceed to Wallet')}
                </button>
              </form>
            )}

            {/* Phone Login */}
            {method === 'phone' && (
              <div className="space-y-4">
                {!verificationId ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <input
                      type="tel"
                      placeholder="+91 00000 00000"
                      className="w-full px-6 py-5 bg-gray-50 border-none rounded-2xl text-lg font-medium focus:ring-4 focus:ring-blue-500/10 transition-all text-center tracking-wider"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                    <div id="recaptcha-container" className="flex justify-center"></div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-5 bg-blue-600 text-white rounded-2xl text-lg font-black shadow-2xl hover:bg-blue-700 transition-all active:scale-[0.98]"
                    >
                      {loading ? 'Sending Security Code...' : 'Send OTP'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <input
                      type="text"
                      placeholder="------"
                      className="w-full px-5 py-6 bg-gray-50 border-none rounded-2xl text-6xl font-mono font-black text-center tracking-[0.25em] focus:ring-4 focus:ring-blue-500/10 transition-all text-blue-600"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-5 bg-green-600 text-white rounded-2xl text-lg font-black shadow-2xl hover:bg-green-700 transition-all active:scale-[0.98]"
                    >
                      {loading ? 'Confirming...' : 'Verify & Launch'}
                    </button>
                    <button onClick={() => setVerificationId(null)} className="w-full text-[9px] uppercase font-black tracking-widest text-gray-400 hover:text-gray-600">Try another number</button>
                  </form>
                )}
              </div>
            )}

            {/* Legacy Login */}
            {method === 'legacy' && (
              <form onSubmit={handleLegacyLogin} className="space-y-4">
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder={portal === 'staff' ? "Employee ID (EAE001)" : "ID (NIA001)"}
                    className="w-full px-6 py-5 bg-gray-50 border-none rounded-2xl text-lg font-medium focus:ring-4 focus:ring-blue-500/10 transition-all"
                    value={empId}
                    onChange={(e) => setEmpId(e.target.value.toUpperCase())}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Security PIN"
                    className="w-full px-6 py-5 bg-gray-50 border-none rounded-2xl text-lg font-medium focus:ring-4 focus:ring-blue-500/10 transition-all"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    maxLength={4}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className={`w-full py-5 text-white rounded-2xl text-lg font-black shadow-2xl transition-all active:scale-[0.98] ${portal === 'staff' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  Legacy Sign In
                </button>
              </form>
            )}
          </div>

          <div className="text-center pt-8 border-t border-gray-100 relative">
            <p className="text-[9px] text-[#86868b] font-black uppercase tracking-[0.3em]">
              {portal === 'staff' ? 'Protected by Nia Enterprise Systems' : 'Secured by Nia Blockchain Cloud'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
