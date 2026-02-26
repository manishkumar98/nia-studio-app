import { creditActions } from '../data/actions'
import { useAuth } from '../context/AuthContext'

export default function Earn() {
    const categories = [...new Set(creditActions.map(a => a.category))]

    return (
        <div className="px-6 py-8 pb-32 max-w-4xl mx-auto">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-black text-[#1d1d1f] mb-3">Earn Points ⚡</h1>
                <p className="text-[#6e6e73] font-medium">Contribute to your community and grow your balance.</p>
            </div>

            {categories.map(cat => (
                <div key={cat} className="mb-12">
                    <h2 className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#86868b] mb-6 pl-2 capitalize border-l-4 border-[#0071e3]">
                        {cat} Tasks
                    </h2>
                    <div className="grid gap-4">
                        {creditActions.filter(a => a.category === cat).map(action => (
                            <div
                                key={action.code}
                                className="bg-white p-6 rounded-[28px] border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all duration-500"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-xl group-hover:bg-[#e3f0ff] transition-colors">
                                        {action.category === 'daily' ? '🌅' : action.category === 'weekly' ? '📅' : '🤝'}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#1d1d1f]">{action.label}</h3>
                                        <p className="text-[11px] text-[#86868b] font-bold uppercase tracking-wider">
                                            Verified by {action.verifiedBy}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[20px] font-black text-[#0071e3]">+{action.points}</div>
                                    <div className="text-[10px] font-bold text-[#86868b] uppercase">Points</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div className="mt-12 p-8 bg-[#1d1d1f] rounded-[40px] text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                    <span className="text-8xl">💡</span>
                </div>
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-3">Community First</h3>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                        High hygiene scores and Jambo attendance help you unlock better housing options in the Nia ecosystem.
                    </p>
                </div>
            </div>
        </div>
    )
}
