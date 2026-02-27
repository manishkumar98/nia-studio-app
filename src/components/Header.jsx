export default function Header({ cartCount, onCartClick, userName, nestName, onSignOut, balance }) {
    return (
        <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50 h-16 px-6">
            <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#1d1d1f] flex items-center justify-center text-white">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3c1.105 0 2 .895 2 2s-.895 2-2 2-2-.895-2-2 .895-2 2-2zm4 12h-8v-1c0-1.333 2.667-2 4-2s4 .667 4 2v1z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-[#1d1d1f]">Nia</span>
                </div>

                {/* Desktop Nav - Right Aligned */}
                <div className="hidden lg:flex items-center gap-8 ml-auto mr-12">
                    {['Home', 'Studio', 'Flow', 'Tribe', 'Shop'].map(item => (
                        <a
                            key={item}
                            href="#"
                            className="text-[13px] font-medium text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
                        >
                            {item}
                        </a>
                    ))}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-5">
                    {/* Points Pill */}
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#f5f5f7] rounded-full border border-gray-100">
                        <span className="text-amber-500 font-bold text-[10px]">⚡</span>
                        <span className="text-[10px] font-bold text-[#1d1d1f]">{balance} <span className="opacity-50">pts</span></span>
                    </div>

                    <button className="text-[#1d1d1f] hover:opacity-70 transition-opacity">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </button>

                    <button onClick={onCartClick} className="relative text-[#1d1d1f] hover:opacity-70 transition-opacity">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-[#0066FF] text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    {/* User Profile - Subtle */}
                    <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-200">
                        <div className="text-right">
                            <div className="text-[10px] font-bold text-[#1d1d1f]">{userName}</div>
                            <div className="text-[8px] text-[#86868b] font-medium uppercase tracking-tight">{nestName}</div>
                        </div>
                        <button
                            onClick={onSignOut}
                            className="text-[#86868b] hover:text-red-500 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}
