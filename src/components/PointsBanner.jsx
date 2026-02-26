import { usePoints } from '../context/PointsContext'

export default function PointsBanner({ userId }) {
    const { getBalance } = usePoints()
    const balance = getBalance(userId)

    const getTierColor = (bal) => {
        if (bal < 50) return 'from-amber-400 to-amber-500 text-white'
        if (bal < 200) return 'from-[#1d1d1f] to-[#424245] text-white'
        return 'from-[#0071e3] to-[#0077ed] text-white'
    }

    return (
        <div className={`mx-6 mt-6 p-6 rounded-[24px] shadow-lg bg-gradient-to-r ${getTierColor(balance)} transition-all duration-500 flex items-center justify-between group overflow-hidden relative`}>
            <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-700">
                <span className="text-9xl">⚡</span>
            </div>

            <div className="relative z-10">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-80 mb-1">⚡ Your Points</h4>
                <div className="text-4xl font-black tracking-tight">{balance} <span className="text-sm font-bold opacity-70">PTS</span></div>
                <p className="text-xs mt-2 opacity-90 font-medium">You're 30 pts away from a free Umoja meal →</p>
            </div>

            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/10 transition-colors">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </div>
        </div>
    )
}
