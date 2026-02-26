import { usePoints } from '../context/PointsContext'

export default function ProductCard({ product }) {
    const { addToCart, cart } = usePoints()
    const inCart = cart.find(item => item.id === product.id)

    return (
        <div className="bg-white rounded-[28px] overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 flex flex-col h-full">
            <div className={`h-48 flex items-center justify-center text-6xl relative overflow-hidden ${product.category === 'flow' ? 'bg-gradient-to-b from-[#e3f0ff] to-[#f5f5f7]' :
                    product.category === 'studio' ? 'bg-gradient-to-b from-[#fff0e6] to-[#f5f5f7]' :
                        'bg-gradient-to-b from-[#e8e8ed] to-[#f5f5f7]'
                }`}>
                <span className="group-hover:scale-110 transition-transform duration-500">{product.emoji}</span>
            </div>

            <div className="p-6 flex flex-col flex-1">
                <div className={`text-[11px] font-bold uppercase tracking-widest mb-1 ${product.category === 'flow' ? 'text-[#0071e3]' :
                        product.category === 'studio' ? 'text-[#bf4800]' : 'text-[#86868b]'
                    }`}>
                    {product.category}
                </div>

                <h3 className="text-[17px] font-bold text-[#1d1d1f] mb-1 leading-tight">{product.name}</h3>
                <p className="text-[13px] text-[#6e6e73] leading-relaxed line-clamp-2 mb-4">
                    {product.description}
                </p>

                {product.earnBadge && (
                    <div className="mb-4 inline-flex items-center px-2 py-1 bg-gray-100 rounded-lg text-[10px] font-bold text-[#86868b] uppercase tracking-tighter">
                        ⚡ {product.earnBadge}
                    </div>
                )}

                <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="text-[17px] font-bold text-[#1d1d1f]">
                        {product.price === 0 ? 'Free' : `₹${product.price.toLocaleString('en-IN')}`}
                        {product.period && <span className="text-[12px] font-normal text-[#86868b]">{product.period}</span>}
                    </div>

                    <button
                        onClick={() => addToCart(product)}
                        className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all ${inCart
                                ? 'bg-[#1d1d1f] text-white'
                                : 'bg-[#0071e3] text-white hover:bg-[#0077ed]'
                            }`}
                    >
                        {inCart ? `Added (${inCart.qty})` : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    )
}
