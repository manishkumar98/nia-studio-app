import { useState } from 'react'
import { products } from '../data/products'
import ProductCard from './ProductCard'

export default function Store() {
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')

    const categories = ['all', 'studio', 'flow', 'tribe']

    const filteredProducts = products.filter(p => {
        const matchesFilter = filter === 'all' || p.category === filter
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase())
        return matchesFilter && matchesSearch
    })

    return (
        <div className="pb-24">
            {/* Hero Section */}
            <section className="bg-white px-6 pt-16 pb-12 text-center max-w-4xl mx-auto">
                <h2 className="text-[#bf4800] text-lg font-medium mb-3">Nia One Ecosystem</h2>
                <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-[#1d1d1f] mb-6 leading-[1.1]">
                    Live. Work. Grow.
                </h1>
                <p className="text-xl text-[#6e6e73] leading-relaxed mb-8">
                    Three pillars, one mission. Connecting India's workforce to stability, opportunity, and community.
                </p>
            </section>

            {/* Filter & Search Bar */}
            <div className="sticky top-16 z-30 bg-[#f5f5f7]/80 backdrop-blur-md py-4 border-b border-gray-100 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex gap-2 p-1 bg-gray-200/50 rounded-2xl w-fit overflow-x-auto no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-6 py-2 rounded-xl text-sm font-semibold capitalize transition-all whitespace-nowrap ${filter === cat ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
                                    }`}
                            >
                                {cat === 'all' ? 'All Products' : cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative group w-full md:max-w-xs">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b] group-focus-within:text-[#0071e3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search services..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-transparent rounded-2xl text-sm focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition-all shadow-sm group-hover:border-gray-200"
                        />
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <h2 className="text-3xl font-bold text-[#1d1d1f] mb-8">The Nia Store.</h2>
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-gray-300">
                        <p className="text-[#86868b] text-lg">No services found matching your search.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>

            {/* Promo Section */}
            <section className="bg-gray-100 rounded-[48px] mx-6 p-12 text-center mb-12">
                <h2 className="text-4xl font-bold text-[#1d1d1f] mb-4">Built for India's workforce.</h2>
                <p className="text-xl text-[#6e6e73] max-w-2xl mx-auto mb-8">
                    From migrants to gig workers, Nia helps millions access jobs, stable living, and growth opportunities.
                </p>
                <button className="px-8 py-4 bg-[#0071e3] text-white rounded-full font-bold text-lg hover:bg-[#0077ed] transition-all">
                    Get Started
                </button>
            </section>
        </div>
    )
}
