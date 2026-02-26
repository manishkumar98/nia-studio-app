import { useState } from 'react'
import { usePoints } from '../context/PointsContext'
import { mockUsers } from '../data/mockUsers'
import { creditActions, deductActions } from '../data/actions'

export default function ManualLedger() {
    const { addTransaction, getBalance } = usePoints()
    const residents = mockUsers.filter(u => u.role === 'resident')
    const [selectedUser, setSelectedUser] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [activeTab, setActiveTab] = useState('credit')

    const handleAward = (user, personAction) => {
        addTransaction({
            userId: user.id,
            userName: user.name,
            description: personAction.label,
            points: personAction.points,
            type: personAction.points > 0 ? 'credit' : 'debit'
        })
        setShowModal(false)
    }

    return (
        <div className="p-4 sm:p-8 bg-[#f5f5f7] min-h-screen">
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1d1d1f] tracking-tight">Manual Ledger</h1>
                        <p className="text-[#6e6e73]">Phase 0 Pilot: Spreadsheets Digital Proxy</p>
                    </div>
                    <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
                        <div className="px-4 py-2 text-sm font-semibold text-[#0071e3] bg-blue-50 rounded-xl">Kush-12 Nest</div>
                    </div>
                </header>

                {/* Resident Matrix */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-bottom border-gray-50">
                                <th className="px-6 py-4 text-xs font-semibold text-[#86868b] uppercase tracking-wider">Resident</th>
                                <th className="px-6 py-4 text-xs font-semibold text-[#86868b] uppercase tracking-wider">Points</th>
                                <th className="px-6 py-4 text-xs font-semibold text-[#86868b] uppercase tracking-wider">Join Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-[#86868b] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {residents.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0071e3] font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-[#1d1d1f]">{user.name}</div>
                                                <div className="text-xs text-[#86868b]">{user.employeeId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-[#0071e3]">
                                            ⚡ {getBalance(user.id)} pts
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-[#6e6e73]">
                                        {user.joinDate}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button
                                            onClick={() => { setSelectedUser(user); setShowModal(true); }}
                                            className="text-sm font-semibold text-[#0071e3] hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl transition-all"
                                        >
                                            Update Ledger
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Point Award Modal */}
            {showModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-[#1d1d1f]">Update {selectedUser.name}</h3>
                                <p className="text-sm text-[#6e6e73]">Current Balance: {getBalance(selectedUser.id)} pts</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">✕</button>
                        </div>

                        <div className="flex border-b border-gray-100">
                            <button
                                onClick={() => setActiveTab('credit')}
                                className={`flex-1 py-4 text-sm font-bold border-b-2 transition-all ${activeTab === 'credit' ? 'border-[#0071e3] text-[#0071e3]' : 'border-transparent text-[#86868b]'}`}
                            >
                                Award Points
                            </button>
                            <button
                                onClick={() => setActiveTab('debit')}
                                className={`flex-1 py-4 text-sm font-bold border-b-2 transition-all ${activeTab === 'debit' ? 'border-red-500 text-red-500' : 'border-transparent text-[#86868b]'}`}
                            >
                                Deduct Points
                            </button>
                        </div>

                        <div className="p-2 h-96 overflow-y-auto">
                            {(activeTab === 'credit' ? creditActions : deductActions).map((action) => (
                                <button
                                    key={action.code}
                                    onClick={() => handleAward(selectedUser, action)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all group"
                                >
                                    <div className="text-left">
                                        <div className="font-semibold text-[#1d1d1f] group-hover:text-[#0071e3]">{action.label}</div>
                                        <div className="text-xs text-[#86868b]">{action.category}</div>
                                    </div>
                                    <div className={`font-bold ${action.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {action.points > 0 ? '+' : ''}{action.points}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
