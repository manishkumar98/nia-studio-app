import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { mockUsers } from '../data/mockUsers'

export default function Login() {
  const [empId, setEmpId] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    const user = mockUsers.find(u => u.employeeId === empId && u.pin === pin)
    if (user) {
      login(user)
    } else {
      setError('Invalid Employee ID or PIN')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#0071e3] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-4.305-6.218A7 7 0 1118.354 12.571m1.391 8.357c-1.744-2.772-2.753-6.054-2.753-9.571m-2.753-7.429L12 9" />
               </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#1d1d1f] tracking-tight">Nia One</h2>
          <p className="mt-2 text-[#6e6e73]">Sign in to your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 animate-shake">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider ml-1 mb-2 block">Employee ID</label>
              <input
                type="text"
                required
                className="w-full px-4 py-4 bg-[#f5f5f7] border-none rounded-2xl text-lg focus:ring-2 focus:ring-[#0071e3] transition-all"
                placeholder="e.g. NIA001"
                value={empId}
                onChange={(e) => setEmpId(e.target.value.toUpperCase())}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider ml-1 mb-2 block">PIN</label>
              <input
                type="password"
                required
                className="w-full px-4 py-4 bg-[#f5f5f7] border-none rounded-2xl text-lg focus:ring-2 focus:ring-[#0071e3] transition-all"
                placeholder="4-digit PIN"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-2xl text-lg font-semibold shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-sm text-[#86868b]">
            First time? Ask your EAE for your PIN
          </p>
        </div>
      </div>
    </div>
  )
}
