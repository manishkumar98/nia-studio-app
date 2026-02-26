import { useState, useEffect } from 'react'
import { usePoints } from '../context/PointsContext'
import { mockUsers } from '../data/mockUsers'
import { creditActions, deductActions } from '../data/actions'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase'

export default function ManualLedger() {
    const { addTransaction, getBalance } = usePoints()
    const [realResidents, setRealResidents] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedUser, setSelectedUser] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [activeTab, setActiveTab] = useState('credit')
    const [loading, setLoading] = useState(true)

    // Combine Mock Users and Firestore Users
    useEffect(() => {
        const fetchResidents = async () => {
            try {
                const q = query(collection(db, 'users'), where('role', '==', 'resident'))
                const querySnapshot = await getDocs(q)
                const firestoreUsers = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))

                // Merge, avoiding duplicates if any mock user is already in DB
                const combined = [...firestoreUsers]
                mockUsers.forEach(mu => {
                    if (mu.role === 'resident' && !combined.find(c => c.employeeId === mu.employeeId)) {
                        combined.push(mu)
                    }
                })

                setRealResidents(combined)
            } catch (err) {
                console.error("Error fetching residents:", err)
                setRealResidents(mockUsers.filter(u => u.role === 'resident'))
            } finally {
                setLoading(false)
            }
        }
        fetchResidents()
    }, [])

    const filteredResidents = realResidents.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleAward = (user, personAction) => {
        addTransaction({
            userId: user.id || user.uid,
            userName: user.name,
            description: personAction.label,
            points: personAction.points,
            type: personAction.points > 0 ? 'credit' : 'debit'
        })
        setShowModal(false)
    }

    return (
        <div className="p-4 sm:p-8 bg-[#f5f5f7] min-h-screen pb-32">
            <div className="max-w-6xl mx-auto space-y-6">
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-[#1d1d1f] tracking-tight">Manual Ledger</h1>
                        <p className="text-sm font-bold text-[#6e6e73] uppercase tracking-widest opacity-60">Phase 0 Pilot • Spreadsheet Proxy</p>
                    </div>

                    {/* Compact Search Bar */}
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Search resident..."
                            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-transparent rounded-2xl text-sm font-bold focus:border-blue-500/20 shadow-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </header>

                {/* Mobile: Card View / Desktop: Table View */}
                <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">

                    {/* Desktop View */}
                    <table className="w-full text-left hidden md:table">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-[#86868b] uppercase tracking-[0.2em]">Resident</th>
                                <th className="px-8 py-5 text-[10px] font-black text-[#86868b] uppercase tracking-[0.2em]">Balance</th>
                                <th className="px-8 py-5 text-[10px] font-black text-[#86868b] uppercase tracking-[0.2em] text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredResidents.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0071e3] font-black text-lg">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-[#1d1d1f] text-lg tracking-tight">{user.name}</div>
                                                <div className="text-[10px] font-black text-[#86868b] uppercase tracking-widest">{user.employeeId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-black bg-blue-50 text-[#0071e3]">
                                            ⚡ {getBalance(user.id)}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button
                                            onClick={() => { setSelectedUser(user); setShowModal(true); }}
                                            className="px-6 py-2.5 bg-[#1d1d1f] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-[0.98]"
                                        >
                                            Update
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-gray-50">
                        {filteredResidents.map((user) => (
                            <div key={user.id} className="p-5 flex items-center justify-between active:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0071e3] font-black">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-[#1d1d1f] leading-tight">{user.name}</div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[9px] font-black text-[#86868b] uppercase tracking-widest">{user.employeeId}</span>
                                            <span className="text-[10px] text-blue-600 font-black">⚡{getBalance(user.id)}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setSelectedUser(user); setShowModal(true); }}
                                    className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 active:bg-blue-600 active:text-white transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    {filteredResidents.length === 0 && (
                        <div className="p-20 text-center">
                            <p className="text-[#86868b] font-bold text-sm">No residents found matching "{searchTerm}"</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Point Award Modal */}
            {showModal && selectedUser && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-t-[40px] sm:rounded-[40px] shadow-2xl overflow-hidden animate-slideUp">
                        <div className="p-8 border-b border-gray-100 flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl text-[#0071e3] font-black">
                                    {selectedUser.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-[#1d1d1f] tracking-tight">{selectedUser.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.2em]">ID: {selectedUser.employeeId}</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span className="text-[11px] font-bold text-blue-600">Balance: {getBalance(selectedUser.id)} pts</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="flex bg-gray-50 p-1.5 mt-2 mx-4 rounded-2xl">
                            <button
                                onClick={() => setActiveTab('credit')}
                                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'credit' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400'}`}
                            >
                                Award Points
                            </button>
                            <button
                                onClick={() => setActiveTab('debit')}
                                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'debit' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400'}`}
                            >
                                Deduct Points
                            </button>
                        </div>

                        <div className="p-4 h-[60vh] sm:h-[400px] overflow-y-auto mt-2 space-y-2 no-scrollbar">
                            {(activeTab === 'credit' ? creditActions : deductActions).map((action) => (
                                <button
                                    key={action.code}
                                    onClick={() => handleAward(selectedUser, action)}
                                    className="w-full flex items-center justify-between p-5 bg-white border border-gray-100 rounded-3xl transition-all active:scale-[0.98] active:bg-gray-50 group hover:border-blue-100"
                                >
                                    <div className="text-left">
                                        <div className="font-bold text-[#1d1d1f] tracking-tight group-hover:text-blue-600">{action.label}</div>
                                        <div className="text-[10px] font-black text-[#86868b] uppercase tracking-widest mt-0.5">{action.category}</div>
                                    </div>
                                    <div className={`text-lg font-black ${action.points > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {action.points > 0 ? '+' : ''}{action.points}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="p-6 bg-gray-50 text-center">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#86868b]">Authorized EAE Session • Secure Transaction</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
