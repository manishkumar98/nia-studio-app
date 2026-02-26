import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { mockUsers } from '../data/mockUsers'

export default function Login() {
  const [method, setMethod] = useState('google') // 'google', 'email', 'phone', 'legacy'
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
    mockLogin
  } = useAuth()

  useEffect(() => {
    if (method === 'phone') {
      setupRecaptcha('recaptcha-container')
    }
  }, [method])

  const handleError = (err) => {
    console.error(err)
    setError(err.message || 'An error occurred during login')
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      await loginWithGoogle()
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
      // If user not found, try to register them automatically for this demo
      if (err.code === 'auth/user-not-found') {
        try {
          await registerWithEmail(email, password)
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
      await verificationId.confirm(otp)
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
      setError('Invalid Employee ID or PIN')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-8 md:p-12 space-y-8 relative overflow-hidden backdrop-blur-xl border border-white/50">

        {/* Decorative Background */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>

        <div className="text-center relative">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#0071e3] to-[#00a2ff] rounded-[24px] flex items-center justify-center text-white shadow-2xl shadow-blue-200 transform hover:rotate-6 transition-transform">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-4.305-6.218A7 7 0 1118.354 12.571m1.391 8.357c-1.744-2.772-2.753-6.054-2.753-9.571m-2.753-7.429L12 9" />
              </svg>
            </div>
          </div>
          <h2 className="text-4xl font-black text-[#1d1d1f] tracking-tight mb-2">Login to Nia</h2>
          <p className="text-[#6e6e73] font-medium">Access your global rewards dashboard</p>
        </div>

        {/* Method Switcher */}
        <div className="flex p-1 bg-gray-100 rounded-2xl">
          {['google', 'email', 'phone', 'legacy'].map((m) => (
            <button
              key={m}
              onClick={() => { setMethod(m); setError(''); }}
              className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all ${method === m ? 'bg-white text-[#0071e3] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {m === 'legacy' ? 'ID' : m}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100 animate-shake flex items-center gap-2">
              <span className="text-lg">⚠️</span> {error}
            </div>
          )}

          {/* Google Login */}
          {method === 'google' && (
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-4 py-4 bg-white border border-gray-200 text-[#1d1d1f] rounded-2xl text-lg font-bold hover:bg-gray-50 transition-all shadow-sm active:scale-[0.98] group"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
              <span>Continue with Google</span>
            </button>
          )}

          {/* Email Login */}
          {method === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-lg focus:ring-2 focus:ring-[#0071e3] transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-lg focus:ring-2 focus:ring-[#0071e3] transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#1d1d1f] text-white rounded-2xl text-lg font-black shadow-xl hover:bg-black transition-all active:scale-[0.98]"
              >
                {loading ? 'Processing...' : 'Sign In'}
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
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-lg focus:ring-2 focus:ring-[#0071e3] transition-all"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                  <div id="recaptcha-container"></div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-[#0071e3] text-white rounded-2xl text-lg font-black shadow-xl hover:bg-[#0077ed] transition-all active:scale-[0.98]"
                  >
                    {loading ? 'Sending...' : 'Send OTP'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <input
                    type="text"
                    placeholder="6-Digit OTP"
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-5xl font-mono font-black text-center tracking-[0.2em] focus:ring-2 focus:ring-[#0071e3] transition-all"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-green-600 text-white rounded-2xl text-lg font-black shadow-xl hover:bg-green-700 transition-all active:scale-[0.98]"
                  >
                    {loading ? 'Verifying...' : 'Confirm OTP'}
                  </button>
                  <button onClick={() => setVerificationId(null)} className="w-full text-[10px] uppercase font-bold text-gray-400 hover:text-gray-600">Change Phone Number</button>
                </form>
              )}
            </div>
          )}

          {/* Legacy Login */}
          {method === 'legacy' && (
            <form onSubmit={handleLegacyLogin} className="space-y-4">
              <input
                type="text"
                placeholder="Employee ID (NIA001)"
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-lg focus:ring-2 focus:ring-[#0071e3] transition-all"
                value={empId}
                onChange={(e) => setEmpId(e.target.value.toUpperCase())}
                required
              />
              <input
                type="password"
                placeholder="4-Digit PIN"
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-lg focus:ring-2 focus:ring-[#0071e3] transition-all"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={4}
                required
              />
              <button
                type="submit"
                className="w-full py-4 bg-[#0071e3] text-white rounded-2xl text-lg font-black shadow-xl hover:bg-[#0077ed] transition-all active:scale-[0.98]"
              >
                Sign In with ID
              </button>
            </form>
          )}
        </div>

        <div className="text-center pt-8 border-t border-gray-50 relative">
          <p className="text-[10px] text-[#86868b] font-black uppercase tracking-widest">
            Powered by Nia Cloud Security
          </p>
        </div>
      </div>
    </div>
  )
}
