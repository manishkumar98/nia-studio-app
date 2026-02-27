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
import Earn from './components/Earn'
import Redeem from './components/Redeem'
import Me from './components/Me'
import Scanner from './components/Scanner'
import Header from './components/Header'
import Footer from './components/Footer'
import Checkout from './components/Checkout'
import OrderTerminal from './components/OrderTerminal'

export default function App() {
  const { currentUser, logout, loading } = useAuth()
  const { cart } = usePoints()
  const [activeTab, setActiveTab] = useState('store')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckout, setIsCheckout] = useState(false)
  const [staffView, setStaffView] = useState('scanner')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="w-16 h-16 border-4 border-[#0071e3] border-t-transparent rounded-full animate-spin shadow-xl"></div>
      </div>
    )
  }

  if (!currentUser) {
    return <Login />
  }

  const isStaff = currentUser.role === 'eae' || currentUser.role === 'jco'
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)
  const userId = currentUser.uid || currentUser.id // Support both Firebase and legacy IDs

  // --- 1. STAFF VIEW (Pure Management Dashboard) ---
  if (isStaff) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 h-16 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1d1d1f] rounded-xl flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-[#1d1d1f]">Nia Staff</span>
                <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-lg uppercase">{currentUser.role}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <div className="text-sm font-bold text-[#1d1d1f]">{currentUser.name}</div>
                <div className="text-[10px] text-[#86868b] uppercase font-bold tracking-widest">{currentUser.nestName}</div>
              </div>
              <button
                onClick={() => { console.log("Staff Sign Out Clicked"); logout(); }}
                className="p-2.5 rounded-2xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border border-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            </div>
          </div>
        </nav>

        <header className="bg-white border-b border-gray-100 px-4 py-4 sticky top-16 z-30">
          <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setStaffView('scanner')}
              className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${staffView === 'scanner' ? 'bg-[#0071e3] text-white shadow-lg shadow-blue-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              📷 QR Scanner
            </button>
            <button
              onClick={() => setStaffView('orders')}
              className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${staffView === 'orders' ? 'bg-[#0071e3] text-white shadow-lg shadow-blue-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              🛍️ Orders
            </button>
            <button
              onClick={() => setStaffView('ledger')}
              className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${staffView === 'ledger' ? 'bg-[#0071e3] text-white shadow-lg shadow-blue-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              📝 Manual Ledger
            </button>
            <button
              onClick={() => setStaffView('leaderboard')}
              className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${staffView === 'leaderboard' ? 'bg-[#0071e3] text-white shadow-lg shadow-blue-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              🎯 Leaderboard
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-4 md:p-8">
          {staffView === 'scanner' && <Scanner />}
          {staffView === 'orders' && <OrderTerminal />}
          {staffView === 'ledger' && <ManualLedger />}
          {staffView === 'leaderboard' && <Leaderboard />}
        </main>
      </div>
    )
  }

  // --- 2. RESIDENT VIEW (Nia Store & Points experience) ---
  if (!isStaff && isCheckout) {
    return (
      <div className="min-h-screen bg-[#f5f5f7]">
        <Checkout onBack={() => setIsCheckout(false)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      <Header
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        userName={currentUser.name}
        nestName={currentUser.nestName}
        onSignOut={() => { console.log("Sign Out Clicked"); logout(); }}
        balance={usePoints().getBalance(userId)}
      />

      <main className="max-w-7xl mx-auto">
        {activeTab === 'store' && (
          <div className="animate-fadeUp">
            <Store />
          </div>
        )}
        {activeTab === 'earn' && <Earn />}
        {activeTab === 'redeem' && <Redeem />}
        {activeTab === 'ranks' && (
          <div className="px-4 py-8 animate-fadeUp">
            <Leaderboard />
          </div>
        )}
        {activeTab === 'me' && <Me />}
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => setIsCheckout(true)}
      />
      {activeTab === 'store' && <Footer />}
      <BottomNav activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setIsCheckout(false); }} />
    </div>
  )
}
