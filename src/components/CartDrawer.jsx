import { usePoints } from '../context/PointsContext'

export default function CartDrawer({ isOpen, onClose, onCheckout }) {
    const { cart, changeQty, removeFromCart, clearCart } = usePoints()
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

    if (!isOpen) return null

    const handleCheckout = () => {
        onCheckout()
        onClose()
    }

    return (
        <>
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity"
                onClick={onClose}
            />
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-[#1d1d1f]">Your Bag</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cart.length === 0 ? (
                        <div className="text-center py-20">
                            <span className="text-6xl mb-4 block">🛒</span>
                            <p className="text-[#6e6e73] text-lg">Your bag is empty.</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="flex gap-4 animate-fadeUp">
                                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl shrink-0 ${item.category === 'flow' ? 'bg-[#e3f0ff]' :
                                    item.category === 'studio' ? 'bg-[#fff0e6]' : 'bg-[#e8e8ed]'
                                    }`}>
                                    {item.emoji}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-[#1d1d1f] truncate">{item.name}</h4>
                                    <p className="text-[#6e6e73] text-sm mb-2">₹{item.price.toLocaleString('en-IN')}{item.period}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => changeQty(item.id, -1)}
                                                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#0071e3] hover:text-[#0071e3] transition-colors"
                                            >
                                                −
                                            </button>
                                            <span className="font-bold text-sm w-4 text-center">{item.qty}</span>
                                            <button
                                                onClick={() => changeQty(item.id, 1)}
                                                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#0071e3] hover:text-[#0071e3] transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-sm font-semibold text-[#0071e3] hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-[#6e6e73]">Subtotal</span>
                        <span className="text-2xl font-bold text-[#1d1d1f]">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                    <button
                        disabled={cart.length === 0}
                        onClick={handleCheckout}
                        className="w-full py-4 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-2xl text-lg font-semibold shadow-lg shadow-blue-100 transition-all active:scale-[0.98] disabled:bg-gray-300 disabled:shadow-none"
                    >
                        Check Out
                    </button>
                </div>
            </div>
        </>
    )
}
