import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { mockUsers } from '../data/mockUsers'

export default function Login() {
  const [portal, setPortal] = useState('resident') // 'resident' or 'staff'
  const [method, setMethod] = useState('legacy')
  const [empId, setEmpId] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { mockLogin, loginWithGoogle, setupRecaptcha, sendOtp, confirmOtp } = useAuth()

  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [confirmationResult, setConfirmationResult] = useState(null)
  const [step, setStep] = useState('input') // 'input' or 'otp'

  const handleLegacyLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    setTimeout(() => {
      const user = mockUsers.find(u => u.employeeId === empId && u.pin === pin)
      if (user) {
        mockLogin(user)
      } else {
        setError('Invalid Security Code or PIN')
        setLoading(false)
      }
    }, 800)
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      await loginWithGoogle(portal)
    } catch (err) {
      setError('Google Sign-in failed. Please try again.')
      setLoading(false)
    }
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
    if (!phoneNumber) return setError('Please enter a phone number')
    setLoading(true)
    setError('')
    try {
      setupRecaptcha('recaptcha-container')
      const result = await sendOtp(phoneNumber)
      setConfirmationResult(result)
      setStep('otp')
    } catch (err) {
      console.error(err)
      setError('Failed to send OTP. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await confirmOtp(confirmationResult, otp, portal)
    } catch (err) {
      setError('Invalid OTP code')
    } finally {
      setLoading(false)
    }
  }

  const methods = portal === 'resident'
    ? [
      { id: 'legacy', label: 'PIN', disabled: false }
    ]
    : [
      { id: 'legacy', label: 'EMP ID', disabled: false }
    ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f7] relative overflow-x-hidden font-display transition-all duration-1000">
      <div id="recaptcha-container"></div>

      {/* Background Orbs */}
      <div className={`absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] transition-colors duration-1000 ${portal === 'staff' ? 'bg-amber-200/10' : 'bg-blue-200/20'}`}></div>
      <div className={`absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] transition-colors duration-1000 ${portal === 'staff' ? 'bg-gray-300/10' : 'bg-purple-200/10'}`}></div>

      {/* 1. Header: Nia One Ecosystem Branding */}
      <header className="w-full py-8 px-6 relative z-30 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1d1d1f] rounded-xl flex items-center justify-center text-white shadow-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-4.305-6.218A7 7 0 1118.354 12.571m1.391 8.357c-1.744-2.772-2.753-6.054-2.753-9.571m-2.753-7.429L12 9" /></svg>
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-[#1d1d1f]">Nia One</span>
            <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-[9px] font-black rounded-lg uppercase tracking-widest">Ecosystem</span>
          </div>
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <a href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#86868b] hover:text-[#1d1d1f] transition-colors">Architecture</a>
          <a href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#86868b] hover:text-[#1d1d1f] transition-colors">Pilot Program</a>
          <div className="w-px h-4 bg-gray-200"></div>
          <a href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 border border-blue-600/20 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all">Support</a>
        </div>
      </header>

      {/* 2. Main Login Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-20">

        {/* Portal Switcher */}
        <div className="mb-12 p-1.5 bg-gray-200/30 backdrop-blur-2xl rounded-[30px] flex shadow-inner w-full max-w-sm border border-white/20">
          <button
            onClick={() => { setPortal('resident'); setMethod('legacy'); setError(''); setConfirmationResult(null); setStep('input'); }}
            className={`flex-1 py-4 px-6 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${portal === 'resident' ? 'bg-white text-blue-600 shadow-2xl' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Nia Resident Portal
          </button>
          <button
            onClick={() => { setPortal('staff'); setMethod('legacy'); setError(''); setConfirmationResult(null); setStep('input'); }}
            className={`flex-1 py-4 px-6 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${portal === 'staff' ? 'bg-[#1d1d1f] text-white shadow-2xl' : 'text-gray-400 hover:text-gray-600'}`}
          >
            EAE Staff Terminal
          </button>
        </div>

        <div className="max-w-md w-full transition-all duration-500">
          <div className={`bg-white/70 backdrop-blur-3xl rounded-[50px] shadow-[0_40px_100px_rgba(0,0,0,0.08)] border-4 p-10 md:p-14 space-y-10 text-center transition-all duration-700 ${portal === 'staff' ? 'border-[#1d1d1f]' : 'border-white'}`}>

            {/* Icon Area */}
            <div className="flex justify-center flex-col items-center gap-6">
              <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center text-white shadow-2xl transform transition-all duration-700 ${portal === 'staff' ? 'bg-[#1d1d1f] rotate-0 scale-110' : 'bg-gradient-to-br from-blue-600 to-blue-400 rotate-0'}`}>
                {portal === 'staff' ? (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                ) : (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                )}
              </div>
              <div>
                <h2 className="text-4xl font-black text-[#1d1d1f] tracking-tight mb-2">
                  {portal === 'staff' ? 'Staff Login' : 'Resident Login'}
                </h2>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#86868b] opacity-60 leading-relaxed max-w-[200px]">
                  {portal === 'staff' ? 'Enterprise Access Enabled' : 'Welcome to your Nia Nest Dashboard'}
                </p>
              </div>
            </div>

            {/* Method Switcher */}
            {methods.length > 1 && (
              <div className="flex p-1.5 bg-gray-100/50 rounded-2xl w-full max-w-sm mx-auto">
                {methods.map((m) => (
                  <button
                    key={m.id}
                    disabled={m.disabled}
                    onClick={() => { setMethod(m.id); setError(''); setStep('input'); }}
                    className={`flex-1 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${method === m.id
                      ? (portal === 'staff' ? 'bg-[#1d1d1f] text-white shadow-lg' : 'bg-white text-blue-600 shadow-lg')
                      : 'text-gray-300 hover:text-gray-500'
                      }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-6">
              {error && (
                <div className="bg-rose-50 text-rose-600 p-4 rounded-3xl text-[10px] font-black uppercase tracking-widest border border-rose-100 mb-4 animate-shake">
                  {error}
                </div>
              )}

              {method === 'legacy' && (
                <form onSubmit={handleLegacyLogin} className="space-y-4">
                  <input
                    type="text"
                    placeholder={portal === 'staff' ? "Employee ID (EAE001)" : "ID (NIA001)"}
                    className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-[24px] text-lg font-bold text-center focus:bg-white transition-all uppercase"
                    value={empId}
                    onChange={(e) => setEmpId(e.target.value.toUpperCase())}
                    required
                  />
                  <input
                    type="password"
                    placeholder="PIN"
                    className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-[24px] text-lg font-bold text-center focus:bg-white tracking-widest"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    maxLength={4}
                    required
                  />
                  <button type="submit" disabled={loading} className={`w-full py-6 rounded-[28px] text-lg font-black text-white shadow-2xl transition-all active:scale-95 ${portal === 'staff' ? 'bg-[#1d1d1f]' : 'bg-[#0071e3]'}`}>
                    {loading ? 'Entering...' : 'Enter Dashboard →'}
                  </button>
                </form>
              )}

              {method === 'google' && (
                <div className="space-y-4">
                  <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full py-6 bg-white border border-gray-200 rounded-[28px] text-[#1d1d1f] font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                    Continue with Google
                  </button>
                </div>
              )}

              {method === 'phone' && (
                <div className="space-y-4">
                  {step === 'input' ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-[24px] text-lg font-bold text-center focus:bg-white"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                      />
                      <button type="submit" disabled={loading} className="w-full py-6 bg-[#0071e3] text-white rounded-[28px] font-black shadow-xl">
                        {loading ? 'Sending...' : 'Send OTP'}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-[24px] text-lg font-bold text-center focus:bg-white tracking-[0.5em]"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        required
                      />
                      <button type="submit" disabled={loading} className="w-full py-6 bg-green-600 text-white rounded-[28px] font-black shadow-xl">
                        {loading ? 'Verifying...' : 'Verify & Enter'}
                      </button>
                      <button type="button" onClick={() => setStep('input')} className="text-xs font-bold text-gray-400">Back</button>
                    </form>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      {/* 3. Footer: Ecosystem Details */}
      <footer className="w-full py-12 px-6 border-t border-gray-200/50 relative z-30 bg-white/30 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 text-[#86868b]">
          <div className="max-w-xs">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1d1d1f] mb-4">Nia One Ecosystem</h4>
            <p className="text-xs font-medium leading-relaxed">
              A unified platform for community engagement, reward processing, and social empowerment within the Nia Nest network.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 flex-1">
            <div>
              <h5 className="text-[9px] font-black uppercase tracking-widest text-[#1d1d1f] mb-4">Architecture</h5>
              <ul className="space-y-2 text-[10px] font-bold">
                <li><a href="#" className="hover:text-blue-600">Points Protocol</a></li>
                <li><a href="#" className="hover:text-blue-600">Redemption Logic</a></li>
                <li><a href="#" className="hover:text-blue-600">EAE Handlers</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-[9px] font-black uppercase tracking-widest text-[#1d1d1f] mb-4">Resources</h5>
              <ul className="space-y-2 text-[10px] font-bold">
                <li><a href="#" className="hover:text-blue-600">Nest Guidelines</a></li>
                <li><a href="#" className="hover:text-blue-600">Staff Manual</a></li>
                <li><a href="#" className="hover:text-blue-600">Ecosystem Docs</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-[9px] font-black uppercase tracking-widest text-[#1d1d1f] mb-4">Connectivity</h5>
              <ul className="space-y-2 text-[10px] font-bold">
                <li className="flex items-center gap-2 underline decoration-blue-500/30 text-blue-600">Cloud Status: Active</li>
                <li className="opacity-40 tracking-widest">v1.2.0 Stable Build</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] font-black uppercase tracking-widest opacity-40">© 2026 Nia Studio Network • All Rights Reserved</p>
          <div className="flex gap-6">
            <span className="text-[9px] font-black uppercase tracking-widest border border-gray-200 px-3 py-1 rounded">Security Protocol: AES-256</span>
            <span className="text-[9px] font-black uppercase tracking-widest border border-gray-200 px-3 py-1 rounded">Ecosystem Hash: NI-S5-812</span>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}} />
    </div>
  )
}
