import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import { usePoints } from './context/PointsContext'
import Login from './components/Login'
import Leaderboard from './components/Leaderboard'
import Store from './components/Store'
import CartDrawer from './components/CartDrawer'
import BottomNav from './components/BottomNav'
import PointsBanner from './components/PointsBanner'

/**
 * FRONTEND APP (Vercel)
 * Focus: Resident experience (Nia Store, Leaderboard, Points)
 */
export default function App() {
  const { currentUser, logout } = useAuth()
  const { cart } = usePoints()
  const [activeTab, setActiveTab] = useState('store')
  const [isCartOpen, setIsCartOpen] = useState(false)

  if (!currentUser) {
    return <Login />
  }

  // Redirect Staff to Streamlit if they log in here? 
  // For Phase 1, we let them see the resident view but without staff tools.
  const isStaff = currentUser.role === 'eae' || currentUser.role === 'jco'

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)

  return (
    <div className="min-h-screen bg-[#f5f5f7] pb-24">
      {/* Dynamic Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 h-16">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="w-10 h-10 bg-[#0071e3] rounded-xl flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-4.305-6.218A7 7 0 1118.354 12.571m1.391 8.357c-1.744-2.772-2.753-6.054-2.753-9.571m-2.753-7.429L12 9" /></svg>
            </div>
            <span className="text-xl font-black tracking-tight text-[#1d1d1f] ml-2">Nia One</span>
            {isStaff && (
              <span className="ml-2 px-2 py-0.5 bg-blue-50 text-[#0071e3] text-[10px] font-bold rounded uppercase">Staff Mode</span>
            )}
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
              <div className="text-xs text-[#86868b] uppercase tracking-tighter">Nest {currentUser.nestName}</div>
            </div>
            <button onClick={logout} className="ml-2 p-2 rounded-full hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto">
        {activeTab === 'store' && (
          <div className="animate-fadeIn">
            <PointsBanner userId={currentUser.id} />
            <Store />
          </div>
        )}

        {activeTab === 'ranks' && (
          <div className="animate-fadeIn mt-8 px-6">
            <Leaderboard />
          </div>
        )}

        {(activeTab === 'earn' || activeTab === 'redeem' || activeTab === 'me') && (
          <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8">
            <div className="text-7xl mb-6 grayscale opacity-20 filter blur-[1px]">
              {activeTab === 'earn' ? '⚡' : activeTab === 'redeem' ? '🎁' : '👤'}
            </div>
            <h2 className="text-2xl font-black text-[#1d1d1f] mb-2">{activeTab.toUpperCase()}</h2>
            <p className="text-[#86868b] max-w-sm font-medium">Coming soon in Phase 2. We're building your digital ecosystem one pillar at a time.</p>
            <button
              onClick={() => setActiveTab('store')}
              className="mt-8 px-8 py-3 bg-[#1d1d1f] text-white rounded-2xl text-sm font-bold shadow-xl active:scale-95 transition-all"
            >
              Back to Store
            </button>
          </div>
        )}
      </main>

      {/* Global Overlays */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
