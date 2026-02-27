import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import ProductCard from './ProductCard'

export default function Store() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const snap = await getDocs(collection(db, 'products'))
                const data = snap.docs.map(doc => doc.data())
                // Sort by ID to keep consistent
                setProducts(data.sort((a, b) => a.id - b.id))
            } catch (e) {
                console.error("Store Fetch Error:", e)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    const categories = ['all', 'studio', 'flow', 'tribe']

    const filteredProducts = products.filter(p => {
        const matchesFilter = filter === 'all' || p.category === filter
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase())
        return matchesFilter && matchesSearch
    })

    const pillars = [
        {
            id: 'studio',
            title: 'Studio',
            emoji: '🏠',
            desc: 'Stabilise daily life. Affordable housing, meals, healthcare, and essentials.',
            color: 'bg-white',
            text: 'text-[#0066FF]'
        },
        {
            id: 'flow',
            title: 'Flow',
            emoji: '🚀',
            desc: 'Get connected to work. AI job matching, gig placements, and career pathways.',
            color: 'bg-white',
            text: 'text-[#0066FF]'
        },
        {
            id: 'tribe',
            title: 'Tribe',
            emoji: '🤝',
            desc: 'Learn, connect, grow. Digital upskilling, mentorship, and community events.',
            color: 'bg-white',
            text: 'text-[#0066FF]'
        }
    ]

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative px-6 pt-24 pb-20 text-center overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-blue-50/50 to-transparent -z-10 blur-3xl opacity-60"></div>
                <div className="max-w-4xl mx-auto space-y-6">
                    <span className="inline-block text-[#bf4800] text-[11px] font-black uppercase tracking-[0.3em]">Nia One Ecosystem</span>
                    <h1 className="text-6xl sm:text-7xl font-bold tracking-tight text-[#1d1d1f] leading-[1.1] font-display">
                        Live. Work. Grow.
                    </h1>
                    <p className="text-xl text-[#6e6e73] max-w-2xl mx-auto font-medium leading-relaxed pt-2">
                        Three pillars, one mission. Connecting India's workforce to stability, opportunity, and community.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                        <button className="px-8 py-4 bg-[#0066FF] text-white rounded-full font-bold text-sm hover:bg-[#0052cc] transition-all shadow-lg active:scale-95 flex items-center gap-2">
                            Explore all services
                        </button>
                        <a href="#" className="text-sm font-bold text-[#0066FF] hover:underline flex items-center gap-1 group">
                            Learn more
                            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                        </a>
                    </div>
                </div>
            </section>

            {/* Pillar Cards */}
            <section className="bg-[#f5f5f7] py-32 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pillars.map(pillar => (
                        <div key={pillar.id} className="group p-12 rounded-[40px] bg-white transition-all duration-500 cursor-pointer text-center">
                            <div className="text-5xl mb-8 mx-auto group-hover:scale-110 transition-transform duration-500">
                                {pillar.emoji}
                            </div>
                            <h3 className="text-2xl font-bold text-[#1d1d1f] mb-4 tracking-tight">{pillar.title}</h3>
                            <p className="text-[#6e6e73] font-medium leading-relaxed mb-8 max-w-[280px] mx-auto">
                                {pillar.desc}
                            </p>
                            <span className="text-sm font-bold text-[#0066FF] flex items-center justify-center gap-1 transition-all">
                                Explore {pillar.title} →
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* The Nia Store Section */}
            <section className="bg-white py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="space-y-2 mb-12">
                        <h2 className="text-6xl font-bold text-[#1d1d1f] tracking-tight">The Nia Store.</h2>
                        <p className="text-lg text-[#6e6e73] font-medium">Everything you need to work, live, and thrive.</p>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-12">
                        <div className="relative group flex-1 w-full max-w-sm">
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b] group-focus-within:text-[#0066FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search services..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-11 pr-4 py-4 bg-[#f5f5f7] border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#0066FF]/20 transition-all shadow-sm"
                            />
                        </div>

                        <div className="flex p-1 bg-gray-100 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`px-6 py-2.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${filter === cat ? 'bg-[#1d1d1f] text-white shadow-md' : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                                        }`}
                                >
                                    {cat === 'all' ? 'All Products' : cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                            <p className="text-sm font-bold text-[#86868b] uppercase tracking-widest">Loading ecosystem...</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-32 bg-white rounded-[40px] border border-dashed border-gray-200">
                            <p className="text-[#86868b] font-bold">No results matching your query.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Final CTA - Perfect Match to Screenshot */}
            <section className="bg-[#f5f5f7] py-32 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-[#1d1d1f] mb-6">Built for India's workforce.</h2>
                    <p className="text-xl text-[#6e6e73] font-medium leading-relaxed mb-10 max-w-2xl mx-auto">
                        From migrants to gig workers, Nia helps millions access jobs, stable living, and growth opportunities.
                    </p>
                    <button className="px-10 py-4 bg-[#0066FF] text-white rounded-full font-bold text-sm hover:bg-[#0052cc] transition-all flex items-center gap-2 mx-auto group">
                        Get started
                        <span className="text-lg">→</span>
                    </button>
                </div>
            </section>
        </div>
    )
}
