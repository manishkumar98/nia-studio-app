import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { usePoints } from '../context/PointsContext'

export default function Me() {
    const { currentUser, logout } = useAuth()
    const { getBalance, getTransactions, vouchers } = usePoints()
    const [selectedVoucher, setSelectedVoucher] = useState(null)

    const userId = currentUser.uid || currentUser.id
    const balance = getBalance(userId)
    const transactions = getTransactions(userId)
    const myVouchers = vouchers.filter(v => v.userId === userId)

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

                <div className="bg-[#1d1d1f] p-8 rounded-[40px] text-white shadow-xl flex flex-col justify-center">
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
                            🎟️ My Vouchers <span className="text-xs bg-[#0071e3] text-white px-2 py-0.5 rounded-full font-bold">{myVouchers.length}</span>
                        </h2>
                        <div className="space-y-4">
                            {myVouchers.map(v => (
                                <div
                                    key={v.id}
                                    onClick={() => setSelectedVoucher(v)}
                                    className="bg-white p-6 rounded-[32px] border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-colors ${v.status === 'PENDING' ? 'bg-amber-50 group-hover:bg-amber-100' : 'bg-[#f5f5f7] group-hover:bg-[#e3f0ff]'}`}>
                                            {v.emoji}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#1d1d1f] tracking-tight">{v.name}</h4>
                                            <div className="flex items-center gap-2">
                                                <p className={`text-[11px] font-bold tracking-widest ${v.status === 'PENDING' ? 'text-amber-600' : 'text-[#0071e3]'}`}>{v.code}</p>
                                                <span className="text-[10px] text-[#86868b] font-medium">• {v.status === 'PENDING' ? 'Ready to Scan' : 'Claimed'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${v.status === 'PENDING'
                                            ? 'bg-amber-50 text-amber-600 border border-amber-100'
                                            : 'bg-green-50 text-green-600 border border-green-100'
                                            }`}>
                                            {v.status}
                                        </span>
                                        <p className="text-[10px] text-[#86868b] mt-1.5 font-bold">{v.date}</p>
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
                                <p className="text-[#86868b] font-medium">No transactions yet.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {transactions.map(t => (
                                    <div key={t.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                        <div>
                                            <h4 className="text-sm font-bold text-[#1d1d1f] tracking-tight">{t.description}</h4>
                                            <p className="text-[10px] font-extrabold text-[#86868b] uppercase tracking-wider mt-0.5">{t.date}</p>
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

            {/* Voucher Modal / Pass */}
            {selectedVoucher && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div
                        className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl overflow-hidden animate-fadeUp relative"
                    >
                        <button
                            onClick={() => setSelectedVoucher(null)}
                            className="absolute top-6 right-6 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors z-10"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div className={`${selectedVoucher.status === 'PENDING' ? 'bg-[#0071e3]' : 'bg-[#1d1d1f]'} p-10 text-center text-white transition-colors duration-500`}>
                            <div className="text-6xl mb-4">{selectedVoucher.emoji}</div>
                            <h2 className="text-2xl font-black tracking-tight">{selectedVoucher.name}</h2>
                            <p className="text-white/60 text-sm font-medium mt-1 uppercase tracking-widest text-[10px]">
                                {selectedVoucher.status === 'PENDING' ? 'Scan to Deduct Points' : 'Successfully Redeemed'}
                            </p>
                        </div>

                        <div className="p-8">
                            <div className="flex flex-col items-center">
                                {/* QR Logic */}
                                <div className={`p-4 bg-white border-2 rounded-[32px] mb-6 shadow-inner ${selectedVoucher.status === 'PENDING' ? 'border-amber-100' : 'border-green-100 opacity-20 grayscale'}`}>
                                    <div className="w-48 h-48 grid grid-cols-4 grid-rows-4 gap-1.5">
                                        {[...Array(16)].map((_, i) => {
                                            const isActive = (i * 7 + 3) % 10 > 4;
                                            return (
                                                <div
                                                    key={i}
                                                    className={`rounded-md transition-all duration-700 ${isActive ? (selectedVoucher.status === 'PENDING' ? 'bg-[#1d1d1f]' : 'bg-gray-400') : 'bg-transparent'}`}
                                                ></div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-[0.2em] mb-1">Voucher Code</p>
                                    <p className={`text-4xl font-black tracking-[0.3em] font-mono ${selectedVoucher.status === 'PENDING' ? 'text-[#1d1d1f]' : 'text-gray-400 line-through'}`}>{selectedVoucher.code}</p>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-100 flex justify-between items-center text-[10px] font-bold text-[#86868b] uppercase tracking-wider">
                                <div>
                                    <p>Issued To</p>
                                    <p className="text-[#1d1d1f] mt-0.5">{currentUser.name}</p>
                                </div>
                                <div className="text-right">
                                    <p>{selectedVoucher.status === 'PENDING' ? 'Valid For' : 'Claimed On'}</p>
                                    <p className="text-[#1d1d1f] mt-0.5">{selectedVoucher.status === 'PENDING' ? '24 Hours' : selectedVoucher.fulfilledDate?.split('T')[0] || selectedVoucher.date}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-5 text-center">
                            {selectedVoucher.status === 'PENDING' ? (
                                <p className="text-[10px] text-[#0071e3] font-bold animate-pulse">
                                    WAITING FOR STAFF SCAN...
                                </p>
                            ) : (
                                <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">
                                    Transaction Complete ✅
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* App Support & Actions */}
            <div className="mt-16 flex flex-col items-center gap-6">
                <button
                    onClick={logout}
                    className="w-full max-w-sm py-5 bg-red-50 text-red-600 rounded-[24px] font-black text-sm uppercase tracking-widest border border-red-100 active:scale-[0.98] transition-all"
                >
                    Sign Out
                </button>
                <button className="text-[11px] font-extrabold text-[#86868b] uppercase tracking-widest hover:text-[#0071e3] transition-colors">
                    Support ID: {(currentUser.id || currentUser.uid)?.substring(0, 8)} • NIA ONE SESSION
                </button>
            </div>
        </div>
    )
}
