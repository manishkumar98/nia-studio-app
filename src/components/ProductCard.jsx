import { usePoints } from '../context/PointsContext'

export default function ProductCard({ product }) {
    const { addToCart, cart } = usePoints()
    const inCart = cart.find(item => item.id === product.id)

    const categoryTextColors = {
        flow: 'text-[#0066FF]',
        studio: 'text-[#bf4800]',
        tribe: 'text-[#86868b]'
    }

    return (
        <div className="bg-white rounded-[24px] overflow-hidden group hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col h-full">
            <div className="h-48 flex items-center justify-center text-7xl bg-[#fbfbfd]">
                <span className="group-hover:scale-105 transition-transform duration-500">{product.emoji}</span>
            </div>

            <div className="p-6 flex flex-col flex-1">
                <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${categoryTextColors[product.category] || 'text-[#86868b]'}`}>
                    {product.category}
                </div>

                <h3 className="text-[17px] font-bold text-[#1d1d1f] mb-1 leading-tight">{product.name}</h3>
                <p className="text-[13px] text-[#6e6e73] leading-relaxed line-clamp-2 mb-4">
                    {product.description}
                </p>

                <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="text-[17px] font-bold text-[#1d1d1f]">
                        {product.price === 0 ? 'Free' : `₹${product.price.toLocaleString('en-IN')}`}
                        {product.period && <span className="text-[12px] font-normal text-[#86868b]">{product.period}</span>}
                    </div>

                    <button
                        onClick={() => addToCart(product)}
                        className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all ${inCart
                            ? 'bg-[#1d1d1f] text-white'
                            : 'bg-[#0066FF] text-white hover:bg-[#0052cc]'
                            }`}
                    >
                        {inCart ? `Added (${inCart.qty})` : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    )
}
