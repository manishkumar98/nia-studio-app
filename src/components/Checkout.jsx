import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { usePoints } from '../context/PointsContext'

export default function Checkout({ onBack }) {
    const { currentUser } = useAuth()
    const { cart, createOrder } = usePoints()
    const [loading, setLoading] = useState(false)
    const [successOrder, setSuccessOrder] = useState(null)
    const [error, setError] = useState('')

    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0)

    const handlePlaceOrder = async () => {
        setLoading(true)
        setError('')

        try {
            const result = await createOrder(
                currentUser.uid || currentUser.id,
                currentUser.name,
                cart,
                total
            )

            if (result.success) {
                setSuccessOrder(result.orderId)
            } else {
                setError(result.message)
            }
        } catch (err) {
            setError('System error. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (successOrder) {
        return (
            <div className="p-6 max-w-lg mx-auto animate-fadeUp">
                <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
                    <div className="bg-green-600 p-12 text-center text-white relative">
                        <div className="text-7xl mb-6">📦</div>
                        <h2 className="text-3xl font-black mb-2 tracking-tight">Order Placed!</h2>
                        <p className="opacity-90 font-medium font-display">Cash on Delivery Requested</p>
                    </div>

                    <div className="p-10 text-center">
                        <div className="bg-white border-2 border-gray-100 p-8 rounded-[32px] mb-8 shadow-inner flex flex-col items-center">
                            <p className="text-[11px] font-black text-[#86868b] uppercase tracking-[0.2em] mb-2">Order Tracking ID</p>
                            <div className="text-3xl font-black tracking-[0.1em] text-[#1d1d1f] font-mono bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 italic">
                                {successOrder}
                            </div>
                        </div>

                        <div className="p-5 bg-blue-50 rounded-2xl mb-8 border border-blue-100 text-left">
                            <div className="flex gap-3">
                                <span className="text-xl">ℹ️</span>
                                <p className="text-xs text-blue-800 font-bold leading-relaxed">
                                    NEXT STEPS: <span className="font-medium opacity-80">Please show this Order ID to the Nia Staff. They will collect the cash payment of ₹{total.toLocaleString('en-IN')} and fulfill your order.</span>
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onBack}
                            className="w-full py-5 bg-[#1d1d1f] text-white rounded-2xl font-black hover:scale-[0.98] transition-all shadow-lg text-sm uppercase tracking-widest"
                        >
                            Return to Store
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="px-6 py-12 pb-32 max-w-2xl mx-auto animate-fadeIn">
            <div className="mb-10 flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-[#1d1d1f] hover:bg-gray-200 transition-all"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h1 className="text-4xl font-black text-[#1d1d1f] tracking-tight">Checkout</h1>
            </div>

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden mb-8">
                <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                    <h2 className="text-[11px] font-black text-[#86868b] uppercase tracking-[0.2em]">Order Summary</h2>
                </div>

                <div className="p-8 space-y-6">
                    {cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-[#f5f5f7] rounded-2xl flex items-center justify-center text-2xl">
                                    {item.emoji}
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#1d1d1f]">{item.name}</h4>
                                    <p className="text-xs text-[#86868b] font-bold uppercase tracking-widest">Qty: {item.qty}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-[#1d1d1f]">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                    ))}

                    <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-lg font-bold text-[#1d1d1f]">Total Amount</span>
                        <span className="text-3xl font-black text-[#0071e3]">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[40px] border-2 border-[#0071e3] shadow-lg p-8 mb-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                    <div className="bg-[#0071e3] text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Selected</div>
                </div>
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-[#ebf5ff] rounded-[24px] flex items-center justify-center text-3xl">
                        💵
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-[#1d1d1f]">Cash on Delivery</h3>
                        <p className="text-sm text-[#6e6e73] font-medium">Pay directly to our staff at the Nest hub.</p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold text-center border border-red-100 animate-shake">
                    🛑 {error}
                </div>
            )}

            <button
                onClick={handlePlaceOrder}
                disabled={loading || cart.length === 0}
                className={`w-full py-6 rounded-[28px] text-lg font-black text-white shadow-2xl transition-all active:scale-[0.98] ${loading ? 'bg-gray-400' : 'bg-[#1d1d1f] hover:bg-black shadow-gray-200'}`}
            >
                {loading ? 'Processing Order...' : `Confirm Order • ₹${total.toLocaleString('en-IN')} →`}
            </button>

            <p className="text-center mt-8 text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em] opacity-40">
                Authorized Nia Nest Checkout Protocol
            </p>
        </div>
    )
}
