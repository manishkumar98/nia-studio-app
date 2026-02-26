export default function BottomNav({ activeTab, onTabChange }) {
    const tabs = [
        { id: 'store', label: 'Home', icon: '🏠' },
        { id: 'earn', label: 'Earn', icon: '⚡' },
        { id: 'redeem', label: 'Redeem', icon: '🎁' },
        { id: 'ranks', label: 'Ranks', icon: '🏆' },
        { id: 'me', label: 'Me', icon: '👤' },
    ]

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 z-50 safe-area-bottom">
            <div className="flex items-center justify-around h-16 md:h-20 max-w-lg mx-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className="flex flex-col items-center justify-center flex-1 gap-1 transition-all"
                    >
                        <span className={`text-xl transition-transform ${activeTab === tab.id ? 'scale-125 -translate-y-1' : 'opacity-60 grayscale'}`}>
                            {tab.icon}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${activeTab === tab.id ? 'text-[#0071e3]' : 'text-[#86868b] opacity-60'}`}>
                            {tab.label}
                        </span>
                    </button>
                ))}
            </div>
        </nav>
    )
}
