import { useState } from 'react'
import { usePoints } from '../context/PointsContext'
import { db } from '../firebase'
import { collection, query, where, getDocs, updateDoc, doc, serverTimestamp } from 'firebase/firestore'

export default function OrderTerminal() {
    const { orders } = usePoints()
    const [searchTerm, setSearchTerm] = useState('')
    const [foundOrder, setFoundOrder] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSearch = async (e) => {
        if (e) e.preventDefault()
        let term = searchTerm.trim().toUpperCase()
        if (!term) return

        // Normalize: Prepend ORD- if missing
        if (!term.startsWith('ORD-')) {
            term = `ORD-${term}`
        }

        setLoading(true)
        setError('')
        setSuccess(false)
        setFoundOrder(null)

        try {
            const q = query(collection(db, 'orders'), where('orderId', '==', term))
            const snap = await getDocs(q)

            if (snap.empty) {
                setError('ORDER NOT FOUND')
            } else {
                setFoundOrder({ id: snap.docs[0].id, ...snap.docs[0].data() })
            }
        } catch (err) {
            setError('DATABASE ERROR')
        } finally {
            setLoading(false)
        }
    }

    const handleComplete = async () => {
        setLoading(true)
        try {
            await updateDoc(doc(db, 'orders', foundOrder.id), {
                status: 'COMPLETED',
                completedAt: serverTimestamp()
            })
            setSuccess(true)
            setFoundOrder(null)
            setSearchTerm('')
            setTimeout(() => setSuccess(false), 3000)
        } catch (err) {
            setError('FAILED TO UPDATE ORDER')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="px-6 py-8 pb-32 max-w-2xl mx-auto animate-fadeIn">
            <div className="mb-10 text-center">
                <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                    Staff Payment Collection
                </div>
                <h1 className="text-4xl font-black text-[#1d1d1f] mb-3 tracking-tight">Order Terminal 🏦</h1>
                <p className="text-[#6e6e73] font-medium max-w-sm mx-auto">Collect cash for COD orders and verify Resident identity.</p>
            </div>

            {/* Search View */}
            {!foundOrder && (
                <div className="bg-[#1d1d1f] rounded-[40px] p-10 shadow-2xl border-4 border-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <span className="text-8xl">🔎</span>
                    </div>

                    <form onSubmit={handleSearch} className="relative z-10">
                        <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Verification Search</p>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                            placeholder="ORD-XXXXXX"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-6 text-3xl font-mono font-black text-white focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all placeholder:opacity-20 uppercase tracking-widest mb-6"
                        />
                        <button
                            type="submit"
                            disabled={loading || !searchTerm}
                            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40"
                        >
                            {loading ? 'Searching Database...' : 'Lookup Order →'}
                        </button>
                    </form>
                </div>
            )}

            {error && !foundOrder && (
                <div className="mt-4 p-4 bg-red-500 text-white rounded-2xl text-[11px] font-black text-center animate-shake uppercase tracking-widest shadow-lg">
                    ⚠️ {error}
                </div>
            )}

            {success && (
                <div className="mb-8 p-8 bg-green-500 text-white rounded-[40px] flex flex-col items-center text-center animate-bounce shadow-2xl">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl mb-4">💰</div>
                    <h2 className="text-2xl font-black mb-1">CASH COLLECTED</h2>
                    <p className="font-bold opacity-80 uppercase text-[10px] tracking-widest">Order status updated to Completed</p>
                </div>
            )}

            {/* Order Verification Card */}
            {foundOrder && (
                <div className="animate-fadeUp">
                    <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 border-b-8 border-b-green-600">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                            <div>
                                <div className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Order Verified</div>
                                <h2 className="text-3xl font-black text-[#1d1d1f] tracking-tighter">{foundOrder.orderId}</h2>
                            </div>
                            <div className="bg-white px-4 py-2 border rounded-2xl">
                                <span className={`text-[11px] font-black uppercase tracking-widest ${foundOrder.status === 'PENDING' ? 'text-amber-600' : 'text-green-600'}`}>
                                    {foundOrder.status}
                                </span>
                            </div>
                        </div>

                        <div className="p-8 space-y-8">
                            <div>
                                <p className="text-[10px] font-black text-[#86868b] uppercase tracking-widest mb-4">Resident Information</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-[24px] bg-blue-50 flex items-center justify-center text-2xl text-blue-600 font-black">
                                        {foundOrder.userName.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-xl font-black text-[#1d1d1f]">{foundOrder.userName}</div>
                                        <div className="text-xs font-bold text-[#86868b] uppercase tracking-widest">ID: {foundOrder.userId.substring(0, 8)}</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] font-black text-[#86868b] uppercase tracking-widest mb-4">Payment Due</p>
                                <div className="bg-green-50 p-6 rounded-[32px] border border-green-100 flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-green-700 uppercase leading-none">₹{foundOrder.total.toLocaleString('en-IN')}</span>
                                    <span className="text-xs font-bold text-green-600/60 uppercase tracking-widest">Cash Only</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-[#86868b] uppercase tracking-widest">Items in Order</p>
                                <div className="space-y-3">
                                    {foundOrder.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm font-bold p-3 bg-gray-50 rounded-2xl">
                                            <span className="text-[#1d1d1f]">{item.emoji} {item.name} <span className="text-[#86868b] text-[10px]">x{item.qty}</span></span>
                                            <span className="text-[#1d1d1f]">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-8 pt-4 flex gap-4">
                            <button
                                onClick={handleComplete}
                                disabled={loading || foundOrder.status !== 'PENDING'}
                                className="flex-1 py-5 bg-[#1d1d1f] text-white rounded-[24px] font-black hover:bg-green-600 transition-all shadow-xl active:scale-[0.98] uppercase tracking-widest text-xs"
                            >
                                Mark as Paid & Paid-to-Full
                            </button>
                            <button
                                onClick={() => setFoundOrder(null)}
                                className="px-10 py-5 bg-gray-100 text-[#1d1d1f] rounded-[24px] font-bold hover:bg-gray-200 transition-all uppercase tracking-widest text-xs"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Orders Log */}
            {!foundOrder && (
                <div className="mt-16 pt-8 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h3 className="text-[10px] font-black text-[#86868b] uppercase tracking-widest">Recent Pending Orders</h3>
                    </div>
                    <div className="space-y-3">
                        {orders.filter(o => o.status === 'PENDING').slice(0, 3).map(o => (
                            <div
                                key={o.id}
                                onClick={() => { setSearchTerm(o.orderId); }}
                                className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-3xl hover:border-blue-100 cursor-pointer transition-all group shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-lg">🛍️</div>
                                    <div>
                                        <p className="text-[11px] font-black text-[#1d1d1f] leading-none mb-1">{o.userName}</p>
                                        <p className="text-[9px] font-bold text-[#86868b] uppercase tracking-tight">{o.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <code className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1.5 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">{o.orderId}</code>
                                    <p className="text-[10px] font-black text-[#1d1d1f] mt-1.5 leading-none">₹{o.total.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
