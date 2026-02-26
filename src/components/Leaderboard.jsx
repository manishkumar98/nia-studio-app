import { usePoints } from '../context/PointsContext'
import { mockUsers } from '../data/mockUsers'

export default function Leaderboard() {
    const { getBalance } = usePoints()
    const residents = mockUsers
        .filter(u => u.role === 'resident')
        .map(u => ({ ...u, dynamicBalance: getBalance(u.id) }))
        .sort((a, b) => b.dynamicBalance - a.dynamicBalance)

    return (
        <div className="p-8 bg-white min-h-screen">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-[#1d1d1f] mb-2 tracking-tight">Kush-12 Points Leaderboard</h1>
                    <p className="text-xl text-[#6e6e73]">Top Contributors & Community Members</p>
                </header>

                <div className="space-y-4">
                    {residents.map((user, index) => (
                        <div
                            key={user.id}
                            className={`flex items-center justify-between p-6 rounded-3xl transition-all ${index === 0 ? 'bg-amber-50 border-2 border-amber-200' :
                                    index === 1 ? 'bg-slate-50 border-2 border-slate-200' :
                                        index === 2 ? 'bg-orange-50 border-2 border-orange-200' :
                                            'bg-white border border-gray-100 shadow-sm'
                                }`}
                        >
                            <div className="flex items-center gap-6">
                                <div className={`w-12 h-12 flex items-center justify-center rounded-2xl text-2xl font-bold ${index === 0 ? 'bg-amber-400 text-white' :
                                        index === 1 ? 'bg-slate-400 text-white' :
                                            index === 2 ? 'bg-orange-400 text-white' :
                                                'bg-gray-100 text-[#86868b]'
                                    }`}>
                                    {index + 1}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#1d1d1f]">{user.name}</h3>
                                    <p className="text-[#6e6e73] font-medium">{user.employeeId}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-black text-[#0071e3] tracking-tight">
                                    {user.dynamicBalance} <span className="text-sm font-bold uppercase tracking-widest text-[#86868b]">pts</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <footer className="mt-12 text-center p-8 bg-[#f5f5f7] rounded-3xl border border-gray-100">
                    <p className="text-[#6e6e73] font-medium italic">
                        "Points are awarded by EAEs for Nest hygiene, Jambo attendance, and community spirit."
                    </p>
                </footer>
            </div>
        </div>
    )
}
