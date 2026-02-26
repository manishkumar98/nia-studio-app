import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { mockUsers } from '../data/mockUsers'

export default function Login() {
  const [portal, setPortal] = useState('resident') // 'resident' or 'staff'
  const [method, setMethod] = useState('legacy') // Default to legacy (EMP ID / PIN)
  const [empId, setEmpId] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { mockLogin } = useAuth()

  const handleLegacyLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simulate slight delay for premium feel
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

  // Define which methods are available/disabled
  const methods = portal === 'resident'
    ? [
      { id: 'phone', label: 'Phone', disabled: true },
      { id: 'google', label: 'Google', disabled: true },
      { id: 'email', label: 'Email', disabled: true },
      { id: 'legacy', label: 'PIN', disabled: false }
    ]
    : [
      { id: 'email', label: 'Email', disabled: true },
      { id: 'google', label: 'Google', disabled: true },
      { id: 'legacy', label: 'EMP ID', disabled: false }
    ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f7] relative overflow-hidden font-display p-6">

      {/* Background Orbs */}
      <div className={`absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] transition-colors duration-1000 ${portal === 'staff' ? 'bg-amber-200/20' : 'bg-blue-200/30'}`}></div>
      <div className={`absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] transition-colors duration-1000 ${portal === 'staff' ? 'bg-gray-300/20' : 'bg-purple-200/20'}`}></div>

      {/* 1. Global Portal Switcher (As per screenshot) */}
      <div className="mb-12 p-1 bg-gray-200/50 backdrop-blur-xl rounded-[28px] flex shadow-inner w-full max-w-sm relative z-20">
        <button
          onClick={() => { setPortal('resident'); setMethod('legacy'); setError(''); }}
          className={`flex-1 py-4 px-6 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${portal === 'resident' ? 'bg-white text-blue-600 shadow-xl' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Nia Resident Portal
        </button>
        <button
          onClick={() => { setPortal('staff'); setMethod('legacy'); setError(''); }}
          className={`flex-1 py-4 px-6 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${portal === 'staff' ? 'bg-[#1d1d1f] text-white shadow-xl' : 'text-gray-400 hover:text-gray-600'}`}
        >
          EAE Staff Terminal
        </button>
      </div>

      <div className="max-w-md w-full relative z-10 transition-all duration-500">

        {/* 2. Login Card */}
        <div className={`bg-white rounded-[50px] shadow-[0_40px_100px_rgba(0,0,0,0.08)] border-4 p-10 md:p-14 space-y-10 text-center transition-all duration-700 ${portal === 'staff' ? 'border-[#1d1d1f]' : 'border-white'}`}>

          {/* Dynamic Icon Section */}
          <div className="flex justify-center flex-col items-center gap-6">
            <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center text-white shadow-2xl transform transition-all duration-700 ${portal === 'staff' ? 'bg-[#1d1d1f] rotate-0 scale-110' : 'bg-gradient-to-br from-blue-600 to-blue-400 rotate-3'}`}>
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
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#86868b] opacity-60">
                {portal === 'staff' ? 'Enterprise Access Enabled' : 'Welcome to your Nia Nest'}
              </p>
            </div>
          </div>

          {/* 3. Method Switcher (Greyed out for disabled options) */}
          <div className="flex p-1.5 bg-gray-100/50 rounded-2xl w-full max-w-sm mx-auto">
            {methods.map((m) => (
              <button
                key={m.id}
                disabled={m.disabled}
                onClick={() => { setMethod(m.id); setError(''); }}
                className={`flex-1 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${method === m.id
                    ? (portal === 'staff' ? 'bg-[#1d1d1f] text-white shadow-lg' : 'bg-white text-blue-600 shadow-lg')
                    : 'text-gray-300 cursor-not-allowed opacity-40'
                  }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleLegacyLogin} className="space-y-6">
            {error && (
              <div className="bg-rose-50 text-rose-600 p-4 rounded-3xl text-[10px] font-black uppercase tracking-widest border border-rose-100 animate-shake mb-4">
                🛑 {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <input
                  type="text"
                  placeholder={portal === 'staff' ? "Employee ID (EAE001)" : "ID (NIA001)"}
                  className={`w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-3xl text-lg font-bold placeholder:text-gray-300 focus:bg-white focus:border-blue-500/20 transition-all text-center`}
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value.toUpperCase())}
                  required
                />
              </div>

              <div className="relative group">
                <input
                  type="password"
                  placeholder="Security PIN"
                  className={`w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-3xl text-lg font-bold placeholder:text-gray-300 focus:bg-white focus:border-blue-500/20 transition-all text-center tracking-widest`}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength={4}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-6 rounded-[28px] text-lg font-black shadow-2xl transition-all active:scale-[0.98] group overflow-hidden relative ${portal === 'staff'
                  ? 'bg-[#1d1d1f] text-white hover:bg-black'
                  : 'bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-blue-200'
                }`}
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{portal === 'staff' ? 'Enter Terminal' : 'Enter Home'}</span>
                    <svg className="w-5 h-5 opacity-40 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="pt-8 border-t border-gray-50">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#86868b] leading-relaxed">
              {portal === 'staff' ? 'Protected by Nia Enterprise Systems' : 'Secured by Nia Blockchain Cloud'}
            </p>
          </div>
        </div>

        <div className="mt-12 text-center opacity-40">
          <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">
            Support Security Code: <span className="text-gray-900">NEST-V1-PILOT</span>
          </p>
        </div>
      </div>

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
