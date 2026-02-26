import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import { usePoints } from './context/PointsContext'
import Login from './components/Login'
import ManualLedger from './components/ManualLedger'
import Leaderboard from './components/Leaderboard'
import Store from './components/Store'
import CartDrawer from './components/CartDrawer'
import BottomNav from './components/BottomNav'
import PointsBanner from './components/PointsBanner'

export default function App() {
  const { currentUser, logout } = useAuth()
  const { cart } = usePoints()
  const [activeTab, setActiveTab] = useState('store')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [eaeView, setEaeView] = useState('ledger') // 'ledger' or 'leaderboard'

  if (!currentUser) {
    return <Login />
  }

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)

  // Staff Views (EAE/JCO)
  if (currentUser.role === 'eae' || currentUser.role === 'jco') {
    return (
      <div className="min-h-screen bg-[#f5f5f7]">
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">Nia Staff</span>
              <span className="px-2 py-0.5 bg-blue-50 text-[#0071e3] text-[10px] font-bold rounded uppercase">{currentUser.role}</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setEaeView(eaeView === 'ledger' ? 'leaderboard' : 'ledger')}
                className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all"
              >
                {eaeView === 'ledger' ? '🎯 View Leaderboard' : '📝 Back to Ledger'}
              </button>
              <button onClick={logout} className="text-sm font-semibold text-[#0071e3]">Sign Out</button>
            </div>
          </div>
        </nav>
        <main>
          {eaeView === 'ledger' ? <ManualLedger /> : <Leaderboard />}
        </main>
      </div>
    )
  }

  // Resident View (Phase 1)
  return (
    <div className="min-h-screen bg-[#f5f5f7] pb-20">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 h-14 md:h-16">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#0071e3] rounded-xl flex items-center justify-center text-white scale-80 md:scale-100">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-4.305-6.218A7 7 0 1118.354 12.571m1.391 8.357c-1.744-2.772-2.753-6.054-2.753-9.571m-2.753-7.429L12 9" /></svg>
            </div>
            <span className="text-lg md:text-xl font-black tracking-tight text-[#1d1d1f]">Nia One</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#6e6e73] hover:text-[#1d1d1f] transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#0071e3] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
            <div className="hidden md:block text-right">
              <div className="text-sm font-bold text-[#1d1d1f]">{currentUser.name}</div>
              <div className="text-xs text-[#86868b]">{currentUser.nestName}</div>
            </div>
            <button onClick={logout} className="text-xs font-bold text-[#86868b] uppercase tracking-widest hover:text-[#0071e3] transition-all">Out</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto">
        {activeTab === 'store' && (
          <>
            <PointsBanner userId={currentUser.id} />
            <Store />
          </>
        )}
        {activeTab === 'ranks' && <Leaderboard />}
        {(activeTab === 'earn' || activeTab === 'redeem' || activeTab === 'me') && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
            <div className="text-7xl mb-6 grayscale opacity-40">
              {activeTab === 'earn' ? '⚡' : activeTab === 'redeem' ? '🎁' : '👤'}
            </div>
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Coming Soon</h2>
            <p className="text-[#6e6e73] max-w-xs">Phase 2 will unlock full points features including detailed earn tasks and rewards catalog.</p>
          </div>
        )}
      </main>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
