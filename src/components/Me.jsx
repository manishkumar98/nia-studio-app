import { useAuth } from '../context/AuthContext'
import { usePoints } from '../context/PointsContext'

export default function Me() {
    const { currentUser } = useAuth()
    const { getBalance, getTransactions, vouchers } = usePoints()

    const balance = getBalance(currentUser.id)
    const transactions = getTransactions(currentUser.id)
    const myVouchers = vouchers.filter(v => v.userId === currentUser.id)

    return (
        <div className="px-6 py-8 pb-32 max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="flex flex-col items-center mb-10 text-center">
                <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-[#0071e3] to-[#0077ed] flex items-center justify-center text-4xl text-white shadow-xl mb-4 text-shadow">
                    {currentUser.name.charAt(0)}
                </div>
                <h1 className="text-3xl font-black text-[#1d1d1f] tracking-tight">{currentUser.name}</h1>
                <p className="text-[#6e6e73] font-medium tracking-wide uppercase text-xs mt-1"> Resident • {currentUser.nestName} • {currentUser.employeeId}</p>
            </div>

            {/* Balance Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <span className="text-9xl">⚡</span>
                    </div>
                    <p className="text-[11px] font-bold text-[#86868b] uppercase tracking-[0.2em] mb-2">Available Balance</p>
                    <div className="text-5xl font-black text-[#0071e3]">{balance} <span className="text-sm font-bold opacity-40">PTS</span></div>
                </div>

                <div className="bg-[#1d1d1f] p-8 rounded-[40px] text-white shadow-xl">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Total Managed</p>
                    <div className="text-3xl font-bold mb-4">₹{(balance * 2.5).toLocaleString('en-IN')}</div>
                    <p className="text-xs text-gray-400 leading-relaxed font-medium">Estimated value of housing & insurance benefits unlocked through Nia pillars.</p>
                </div>
            </div>

            {/* Tabs / Sections */}
            <div className="space-y-12">
                {/* Vouchers Section */}
                {myVouchers.length > 0 && (
                    <section>
                        <h2 className="text-lg font-bold text-[#1d1d1f] mb-6 px-2 flex items-center gap-2">
                            🎟️ My Vouchers <span className="text-xs bg-[#0071e3] text-white px-2 py-0.5 rounded-full">{myVouchers.length}</span>
                        </h2>
                        <div className="space-y-4">
                            {myVouchers.map(v => (
                                <div key={v.id} className="bg-white p-6 rounded-[32px] border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-[#f5f5f7] rounded-2xl flex items-center justify-center text-2xl">
                                            {v.emoji}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#1d1d1f]">{v.name}</h4>
                                            <p className="text-[11px] font-bold text-[#0071e3] tracking-widest">{v.code}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase">{v.status}</span>
                                        <p className="text-[10px] text-[#86868b] mt-1 font-medium">{v.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* History Section */}
                <section>
                    <h2 className="text-lg font-bold text-[#1d1d1f] mb-6 px-2 flex items-center gap-2">
                        🕒 Points History
                    </h2>
                    <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
                        {transactions.length === 0 ? (
                            <div className="p-20 text-center">
                                <p className="text-[#86868b]">No transactions yet.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {transactions.map(t => (
                                    <div key={t.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                        <div>
                                            <h4 className="text-sm font-bold text-[#1d1d1f]">{t.description}</h4>
                                            <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-tighter">{t.date}</p>
                                        </div>
                                        <div className={`text-sm font-black ${t.points > 0 ? 'text-green-500' : 'text-red-400'}`}>
                                            {t.points > 0 ? '+' : ''}{t.points}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* App Support */}
            <div className="mt-16 text-center">
                <button className="text-[11px] font-bold text-[#86868b] uppercase tracking-widest hover:text-[#0071e3] transition-colors">
                    Support ID: {currentUser.id.substring(0, 8)} • Logout Session
                </button>
            </div>
        </div>
    )
}
