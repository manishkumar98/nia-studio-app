import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { mockUsers } from '../data/mockUsers'

export default function Login() {
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
        setError('Invalid Security ID or PIN')
        setLoading(false)
      }
    }, 800)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] relative overflow-hidden font-display">

      {/* Dynamic Background Elements for "Homey" Vibe */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-orange-200/30 to-rose-200/30 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-blue-200/20 to-indigo-200/20 rounded-full blur-[100px]"></div>

      <div className="max-w-md w-full px-6 py-12 relative z-10">

        {/* Branding & Welcome */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-white rounded-[32px] shadow-2xl flex items-center justify-center p-1 border-4 border-white transform hover:scale-105 transition-transform duration-500">
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-400 rounded-[24px] flex items-center justify-center text-white">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-4.305-6.218A7 7 0 1118.354 12.571m1.391 8.357c-1.744-2.772-2.753-6.054-2.753-9.571m-2.753-7.429L12 9" />
                </svg>
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-black text-[#1d1d1f] tracking-tight mb-3">Welcome Home</h1>
          <p className="text-[#86868b] font-medium text-lg leading-relaxed">Your digital companion for a better <span className="text-blue-600 font-bold">Nia Nest</span> experience.</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/70 backdrop-blur-3xl rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/40 p-10 space-y-8">

          <div className="space-y-2 text-center">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 py-2 rounded-full inline-block px-4">Secure Terminal</h3>
            <p className="text-xs text-[#86868b] font-bold">Enter your Employee ID and PIN to enter your dashboard.</p>
          </div>

          <form onSubmit={handleLegacyLogin} className="space-y-6">
            {error && (
              <div className="bg-rose-50 text-rose-600 p-4 rounded-3xl text-xs font-black uppercase tracking-widest border border-rose-100 animate-shake flex items-center gap-3">
                <span className="text-xl">⚠️</span> {error}
              </div>
            )}

            <div className="space-y-5">
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input
                  type="text"
                  placeholder="Employee ID"
                  className="w-full pl-16 pr-6 py-5 bg-white border-none rounded-3xl text-lg font-bold placeholder:text-gray-300 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value.toUpperCase())}
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <input
                  type="password"
                  placeholder="Security PIN"
                  className="w-full pl-16 pr-6 py-5 bg-white border-none rounded-3xl text-lg font-bold placeholder:text-gray-300 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
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
              className="w-full py-5 bg-gradient-to-br from-[#1d1d1f] to-[#333] text-white rounded-[24px] text-lg font-black shadow-2xl hover:shadow-blue-200/20 hover:scale-[1.02] transition-all active:scale-[0.98] relative overflow-hidden group"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Enter Nest</span>
                    <svg className="w-5 h-5 opacity-50 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="pt-6 border-t border-gray-100/50">
            <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-[#86868b]">
              <span>Secure Access Only</span>
              <span className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                Live Server Active
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm font-bold text-[#6e6e73]">
            Need help? <a href="#" className="text-blue-600 hover:underline">Contact your Nest EAE</a>
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
