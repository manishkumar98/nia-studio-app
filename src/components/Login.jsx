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

  const { mockLogin } = useAuth()

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
    <div className="min-h-screen flex flex-col bg-[#f5f5f7] relative overflow-x-hidden font-display transition-all duration-1000">

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
            onClick={() => { setPortal('resident'); setMethod('legacy'); setError(''); }}
            className={`flex-1 py-4 px-6 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${portal === 'resident' ? 'bg-white text-blue-600 shadow-2xl' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Nia Resident Portal
          </button>
          <button
            onClick={() => { setPortal('staff'); setMethod('legacy'); setError(''); }}
            className={`flex-1 py-4 px-6 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${portal === 'staff' ? 'bg-[#1d1d1f] text-white shadow-2xl' : 'text-gray-400 hover:text-gray-600'}`}
          >
            EAE Staff Terminal
          </button>
        </div>

        <div className="max-w-md w-full transition-all duration-500">
          {/* Login Card */}
          <div className={`bg-white/70 backdrop-blur-3xl rounded-[50px] shadow-[0_40px_100px_rgba(0,0,0,0.08)] border-4 p-10 md:p-14 space-y-10 text-center transition-all duration-700 ${portal === 'staff' ? 'border-[#1d1d1f]' : 'border-white'}`}>

            {/* Fixed Non-tilted Icon Area */}
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
                    className={`w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-[24px] text-lg font-bold placeholder:text-gray-300 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-center`}
                    value={empId}
                    onChange={(e) => setEmpId(e.target.value.toUpperCase())}
                    required
                  />
                </div>

                <div className="relative group">
                  <input
                    type="password"
                    placeholder="Security PIN"
                    className={`w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-[24px] text-lg font-bold placeholder:text-gray-300 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-center tracking-widest`}
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
                      <svg className="w-5 h-5 opacity-40 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
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
