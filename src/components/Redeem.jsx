import { useState } from 'react'
import { rewards } from '../data/rewards'
import { usePoints } from '../context/PointsContext'
import { useAuth } from '../context/AuthContext'

export default function Redeem() {
    const { currentUser } = useAuth()
    const { getBalance, requestRedemption } = usePoints()
    const [successVoucher, setSuccessVoucher] = useState(null)
    const [error, setError] = useState('')

    const balance = getBalance(currentUser.id)

    const handleRedeem = (reward) => {
        setError('')
        const result = requestRedemption(currentUser.id, reward)
        if (result.success) {
            setSuccessVoucher(result.voucher)
            window.scrollTo(0, 0)
        } else {
            setError(result.message)
        }
    }

    if (successVoucher) {
        return (
            <div className="p-6 max-w-lg mx-auto animate-fadeUp">
                <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
                    <div className="bg-[#0071e3] p-12 text-center text-white relative">
                        <div className="text-7xl mb-6">{successVoucher.emoji}</div>
                        <h2 className="text-3xl font-black mb-2 tracking-tight">Voucher Ready!</h2>
                        <p className="opacity-90 font-medium">Claim your {successVoucher.name}</p>
                        <div className="mt-4 inline-block px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                            Status: {successVoucher.status}
                        </div>
                    </div>
                    <div className="p-10 text-center">
                        <div className="bg-white border-2 border-gray-100 p-6 rounded-[32px] mb-8 shadow-inner flex flex-col items-center">
                            {/* Mock QR */}
                            <div className="w-40 h-40 bg-white grid grid-cols-4 gap-1 p-2 border border-gray-50 mb-6">
                                {[...Array(16)].map((_, i) => (
                                    <div key={i} className={`rounded-[2px] ${Math.random() > 0.4 ? 'bg-[#1d1d1f]' : 'bg-transparent'}`}></div>
                                ))}
                            </div>
                            <p className="text-[11px] font-bold text-[#86868b] uppercase tracking-[0.2em] mb-1">Redemption Code</p>
                            <div className="text-4xl font-black tracking-[0.3em] text-[#1d1d1f] font-mono leading-none">{successVoucher.code}</div>
                        </div>

                        <div className="p-4 bg-amber-50 rounded-2xl mb-8 border border-amber-100 text-left">
                            <p className="text-[11px] text-amber-800 font-bold leading-relaxed">
                                ⚠️ POINTS DEDUCTION: <span className="font-medium opacity-80">Points will be deducted from your balance once the EAE scans this voucher and confirms your reward.</span>
                            </p>
                        </div>

                        <p className="text-sm text-[#6e6e73] mb-10 font-medium">Show this code at the Haat counter or to your EAE to claim your reward.</p>

                        <button
                            onClick={() => setSuccessVoucher(null)}
                            className="w-full py-4 bg-[#1d1d1f] text-white rounded-2xl font-bold hover:scale-[0.98] transition-all shadow-lg active:shadow-md"
                        >
                            Back to Catalog
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="px-6 py-8 pb-32 max-w-6xl mx-auto">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-black text-[#1d1d1f] mb-3 tracking-tight">Redeem Rewards 🎁</h1>
                <p className="text-[#6e6e73] font-medium max-w-md mx-auto">Use your hard-earned points for exclusive perks. Points are deducted only upon fulfillment.</p>

                {error && (
                    <div className="mt-6 p-4 bg-red-50 text-red-500 rounded-2xl text-sm font-bold border border-red-100 animate-shake">
                        ⚠️ {error}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewards.map(reward => {
                    const canAfford = balance >= reward.cost
                    return (
                        <div
                            key={reward.id}
                            className={`bg-white rounded-[32px] overflow-hidden border border-gray-100 flex flex-col group transition-all duration-500 ${!canAfford ? 'opacity-70 contrast-75 grayscale' : 'hover:shadow-2xl hover:-translate-y-2'}`}
                        >
                            <div className="h-40 bg-[#f5f5f7] flex items-center justify-center text-6xl relative overflow-hidden">
                                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-black text-[#1d1d1f] shadow-sm">
                                    {reward.fulfillment}
                                </div>
                                <span className="group-hover:scale-110 transition-transform duration-500">{reward.emoji}</span>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-[#86868b] mb-1">{reward.category}</div>
                                <h3 className="text-lg font-bold text-[#1d1d1f] mb-4">{reward.name}</h3>

                                <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-black text-[#0071e3]">{reward.cost}</span>
                                        <span className="text-[10px] uppercase font-bold text-[#86868b] leading-tight tracking-tighter">Points needed</span>
                                    </div>

                                    <button
                                        disabled={!canAfford}
                                        onClick={() => handleRedeem(reward)}
                                        className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all shadow-md active:shadow-sm ${canAfford
                                            ? 'bg-[#1d1d1f] text-white hover:bg-[#333]'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                            }`}
                                    >
                                        {canAfford ? 'Get Voucher' : 'Need More'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
